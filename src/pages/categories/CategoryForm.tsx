import { Save, X, Plus, Edit3 } from "lucide-react";

interface Props {
  name: string;
  setName: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  onCancel: () => void;
  loading: boolean;
}

export const CategoryForm = ({
  name,
  setName,
  onSubmit,
  isEditing,
  onCancel,
  loading,
}: Props) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
      {isEditing ? (
        <Edit3 size={18} className="text-blue-600" />
      ) : (
        <Plus size={18} className="text-blue-600" />
      )}
      {isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}
    </h3>
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">
          Tên danh mục
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
          placeholder="Ví dụ: Backend, Frontend..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:bg-slate-300 shadow-lg shadow-slate-200"
        >
          <Save size={18} />
          {loading ? "Đang xử lý..." : "Lưu dữ liệu"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  </div>
);
