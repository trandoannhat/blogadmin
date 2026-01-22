// src/components/layout/Header.tsx
import { getUserFromStorage } from "../../utils/auth";

export const Header = () => {
  const userName = getUserFromStorage();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Quản trị viên / <span className="text-blue-600">Hệ thống</span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-black text-slate-700 leading-none">
            {userName}
          </span>
          <span className="text-[10px] text-blue-500 font-bold">
            Quản trị cấp cao
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg shadow-slate-200">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};
