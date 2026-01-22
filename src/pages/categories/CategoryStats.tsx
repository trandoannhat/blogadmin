// src/pages/categories/CategoryStats.tsx
import { Layers, FileText, TrendingUp, AlertCircle } from "lucide-react";

interface Category {
  id: number;
  name: string;
  postCount?: number;
}

interface Props {
  data: Category[];
}

export const CategoryStats = ({ data }: Props) => {
  // Tính toán các thông số
  const totalCategories = data.length;
  const totalPosts = data.reduce((acc, curr) => acc + (curr.postCount || 0), 0);
  const emptyCategories = data.filter(
    (cat) => (cat.postCount || 0) === 0,
  ).length;
  const mostUsedCategory = [...data].sort(
    (a, b) => (b.postCount || 0) - (a.postCount || 0),
  )[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Tổng số danh mục */}
      <StatCard
        icon={<Layers className="text-blue-600" size={20} />}
        label="Tổng danh mục"
        value={totalCategories}
        bgColor="bg-blue-50"
      />

      {/* Tổng bài viết theo danh mục */}
      <StatCard
        icon={<FileText className="text-green-600" size={20} />}
        label="Tổng bài viết"
        value={totalPosts}
        bgColor="bg-green-50"
      />

      {/* Danh mục hot nhất */}
      <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <TrendingUp className="text-orange-600" size={20} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
            Nhiều bài nhất
          </p>
          <p className="text-sm font-black text-slate-800 truncate">
            {mostUsedCategory ? mostUsedCategory.name : "N/A"}
          </p>
        </div>
      </div>

      {/* Danh mục trống */}
      <StatCard
        icon={<AlertCircle className="text-red-600" size={20} />}
        label="Danh mục trống"
        value={emptyCategories}
        bgColor="bg-red-50"
      />
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: any;
  label: string;
  value: number;
  bgColor: string;
}) => (
  <div
    className={`${bgColor} p-5 rounded-3xl border border-opacity-50 shadow-sm flex items-center gap-4`}
  >
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black opacity-60 uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="text-2xl font-black text-slate-800 leading-none mt-1">
        {value}
      </p>
    </div>
  </div>
);
