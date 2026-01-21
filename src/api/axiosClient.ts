import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.nhatdev.top/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // Kiểm tra thêm để tránh gửi chuỗi "undefined" lên server
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa từng thử refresh token cho request này
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("token");

      if (refreshToken) {
        try {
          // Gọi API refresh token (nhật kiểm tra lại route này ở Backend nhé)
          const res = await axios.post(
            "https://api.nhatdev.top/api/Auth/refresh-token",
            {
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
          );

          if (res.data.success) {
            const newToken = res.data.data.accessToken;
            const newRefreshToken = res.data.data.refreshToken;

            localStorage.setItem("token", newToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            // Gắn token mới vào header và thực hiện lại request cũ
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          // Nếu refresh cũng lỗi thì mới bắt log out
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
