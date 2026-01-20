import { Routes, Route, Link } from "react-router-dom";
import { LayoutDashboard, FileText } from "lucide-react";
import { PostList } from "./pages/PostList";
import { PostForm } from "./pages/PostForm";

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6 text-xl font-bold text-blue-600">NHATDEV ADMIN</div>
        <nav className="p-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            to="/posts"
            className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
          >
            <FileText size={20} /> Bài viết
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route
            path="/"
            element={<div className="text-2xl font-bold">Chào mừng Nhật!</div>}
          />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/create" element={<PostForm />} />
          <Route path="/posts/edit/:id" element={<PostForm />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;
