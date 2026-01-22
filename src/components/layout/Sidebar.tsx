import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Tags,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import { getUserFromStorage } from "../../utils/auth"; // Điều chỉnh đường dẫn cho đúng

export const Sidebar = () => {
  const location = useLocation();
  const userName = getUserFromStorage(); // Sử dụng hàm từ auth.ts

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shrink-0">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-white font-black leading-none tracking-tight">
            NHATDEV
          </h1>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        <div>
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
            Điều khiển
          </p>
          <div className="space-y-1">
            <SidebarItem
              to="/"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={location.pathname === "/"}
            />
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
            Nội dung
          </p>
          <div className="space-y-1">
            <SidebarItem
              to="/posts"
              icon={<FileText size={20} />}
              label="Bài viết"
              active={isActive("/posts")}
            />
            <SidebarItem
              to="/categories"
              icon={<Tags size={20} />}
              label="Danh mục"
              active={isActive("/categories")}
            />
            <SidebarItem
              to="/medias"
              icon={<ImageIcon size={20} />}
              label="Thư viện ảnh"
              active={isActive("/media")}
            />
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
            Hệ thống
          </p>
          <div className="space-y-1">
            <SidebarItem
              to="/profile"
              icon={<User size={20} />}
              label="Hồ sơ"
              active={isActive("/profile")}
            />
            <SidebarItem
              to="/settings"
              icon={<Settings size={20} />}
              label="Cài đặt"
              active={isActive("/settings")}
            />
          </div>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 p-2 mb-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-inner">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{userName}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-bold text-sm border border-transparent hover:border-red-500/20"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} /> Đăng xuất
          </div>
        </button>
      </div>
    </aside>
  );
};

const SidebarItem = ({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-bold"
        : "hover:bg-slate-800 text-slate-400 hover:text-white"
    }`}
  >
    <div className="flex items-center gap-3">
      <span
        className={`${active ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors`}
      >
        {icon}
      </span>
      <span className="text-sm tracking-wide">{label}</span>
    </div>
    {active && <ChevronRight size={14} className="opacity-50" />}
  </Link>
);
