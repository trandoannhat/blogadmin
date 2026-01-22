// src/components/layout/AdminLayout.tsx
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar cố định - Không cho phép scroll cả trang */}
      <Sidebar />

      {/* Khu vực bên phải: Header + Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header luôn nằm trên cùng */}
        <Header />

        {/* Nội dung chính: Đây là nơi duy nhất được Scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-160px)]">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
