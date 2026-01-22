// src/App.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { PostList } from "./pages/posts/PostList";
import { PostForm } from "./pages/posts/PostForm";
import { Login } from "./pages/auth/Login";
import { Toaster } from "react-hot-toast";
import { CategoryPage } from "./pages/categories";
import MediasPage from "./pages/Medias";
import { useEffect } from "react";

function App() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    console.log("🚀 URL hiện tại đã đổi thành:", location.pathname);
  }, [location]);
  // 1. Rào chắn Login
  if (!token && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  // 2. Trang Login (Không dùng Layout)
  if (location.pathname === "/login") {
    return (
      <>
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    );
  }

  // 3. Trang Admin (Bọc trong AdminLayout)
  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/categories" element={<CategoryPage />} />

        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/create" element={<PostForm />} />
        <Route path="/posts/edit/:id" element={<PostForm />} />

        <Route path="/medias" element={<MediasPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
}

// Một component nhỏ cho trang chủ
const DashboardHome = () => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
    <h2 className="text-2xl font-black">Chào mừng trở lại! 👋</h2>
    <p className="text-gray-500">Hệ thống đang hoạt động ổn định.</p>
  </div>
);

export default App;
