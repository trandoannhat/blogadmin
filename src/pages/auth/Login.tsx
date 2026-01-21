import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosClient.post("/Auth/login", {
        username,
        password,
      });

      // Kiểm tra phản hồi từ API
      if (response.data && response.data.success) {
        const {
          accessToken,
          refreshToken,
          username: resUser,
        } = response.data.data;

        if (accessToken) {
          // Xóa sạch bộ nhớ cũ trước khi lưu mới để tránh xung đột
          localStorage.clear();

          // Lưu các giá trị mới
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("user", resUser || "Admin");

          // Kiểm tra xem trình duyệt đã ghi xuống chưa
          const checkToken = localStorage.getItem("token");

          if (checkToken) {
            console.log("Xác nhận Token đã lưu thành công!");
            // Chuyển hướng bằng window.location để reset lại axios instance
            window.location.href = "/";
          } else {
            setError(
              "Trình duyệt không thể lưu Token. Vui lòng kiểm tra cài đặt bảo mật.",
            );
          }
        } else {
          setError("API không trả về Access Token hợp lệ.");
        }
      } else {
        setError(response.data.message || "Đăng nhập thất bại.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
            <h1 className="text-4xl font-black text-blue-600 tracking-tighter">
              ND
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">NHATDEV ADMIN</h2>
          <p className="text-gray-400 text-sm mt-1">
            Hệ thống quản trị bài viết
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Tài khoản
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700"
              placeholder="Nhập username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-extrabold text-white transition-all shadow-lg shadow-blue-200 mt-4 ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.97]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                ĐANG XỬ LÝ...
              </span>
            ) : (
              "ĐĂNG NHẬP NGAY"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
