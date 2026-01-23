import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: baseURL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log(
      `📡 Đang gửi request: [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`,
    );
    const token = localStorage.getItem("token");
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("token");

      if (refreshToken) {
        try {
          // THỐNG NHẤT: Sử dụng baseURL từ biến môi trường
          const res = await axios.post(`${baseURL}/Auth/refresh-token`, {
            accessToken: accessToken,
            refreshToken: refreshToken,
          });

          if (res.data.success) {
            const newToken = res.data.data.accessToken;
            const newRefreshToken = res.data.data.refreshToken;

            localStorage.setItem("token", newToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
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
