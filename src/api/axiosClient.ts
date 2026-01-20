import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.nhatdev.top", // Link API bạn đã deploy thành công
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để xử lý lỗi tập trung (nếu muốn)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosClient;
