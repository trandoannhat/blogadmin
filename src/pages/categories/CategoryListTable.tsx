import { Trash2, Edit3 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
}

interface Props {
  data: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoryListTable = ({ data, onEdit, onDelete }: Props) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50">
          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Thông tin
          </th>
          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Đường dẫn (Slug)
          </th>
          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Số bài viết
          </th>
          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {data.map((cat) => (
          <tr
            key={cat.id}
            className="hover:bg-slate-50/50 transition-colors group"
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  {cat.name.charAt(0)}
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {cat.name}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                /{cat.slug}
              </span>
            </td>
            <td className="px-6 py-4 text-sm font-black text-slate-400">
              {cat.postCount || 0}
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => onEdit(cat)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
