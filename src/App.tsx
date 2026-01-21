import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import { PostList } from "./pages/posts/PostList";
import { PostForm } from "./pages/posts/PostForm";
import { Login } from "./pages/auth/Login";

function App() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // 1. Nếu chưa có token và không ở trang login, đá sang login
  if (!token && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đang ở trang login, chỉ hiển thị mỗi trang login (không có sidebar)
  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  const handleLogout = () => {
    // localStorage.removeItem("token");
    // window.location.href = "/login";

    // 1. Xóa sạch bách mọi thứ trong LocalStorage
    localStorage.clear();

    // 2. Nếu bạn dùng SessionStorage thì cũng nên xóa (tùy chọn)
    // sessionStorage.clear();

    // 3. Đưa người dùng về trang Login
    // Dùng window.location.href để đảm bảo mọi trạng thái (state) cũ trong React bị xóa sạch
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-600">NHATDEV ADMIN</div>

        <nav className="p-4 space-y-2 flex-1">
          <Link
            to="/"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              location.pathname === "/"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            to="/posts"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              location.pathname.startsWith("/posts")
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <FileText size={20} /> Bài viết
          </Link>
        </nav>

        {/* Nút Đăng xuất ở dưới cùng sidebar */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route
            path="/"
            element={<div className="text-2xl font-bold">Chào mừng Nhất!</div>}
          />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/create" element={<PostForm />} />
          <Route path="/posts/edit/:id" element={<PostForm />} />
          {/* Nếu user cố tình gõ /login khi đã login rồi thì đá về trang chủ */}
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
