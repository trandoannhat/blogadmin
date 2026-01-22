import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import { FolderKanban } from "lucide-react";
import { CategoryForm } from "./CategoryForm";
import { CategoryListTable } from "./CategoryListTable";
import { CategoryStats } from "./CategoryStats";

export const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const fetchCategories = async () => {
    const res = await axiosClient.get("/Categories");
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axiosClient.put(`/Categories/${editingId}`, {
          name: categoryName,
        });
        toast.success("Cập nhật danh mục thành công");
      } else {
        await axiosClient.post("/Categories", { name: categoryName });
        toast.success("Thêm mới thành công");
      }
      setCategoryName("");
      setEditingId(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xác nhận xóa danh mục này?")) return;
    try {
      await axiosClient.delete(`/Categories/${id}`);
      toast.success("Đã xóa");
      fetchCategories();
    } catch (error) {
      toast.error("Không thể xóa danh mục đang có bài viết");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
          <FolderKanban size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Danh mục
          </h2>
          <p className="text-slate-500 font-medium">
            Quản lý cấu trúc phân loại của Blog
          </p>
        </div>
      </div>
      <CategoryStats data={categories} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CategoryForm
          name={categoryName}
          setName={setCategoryName}
          onSubmit={handleSubmit}
          isEditing={!!editingId}
          onCancel={() => {
            setEditingId(null);
            setCategoryName("");
          }}
          loading={loading}
        />
        <div className="lg:col-span-2">
          <CategoryListTable
            data={categories}
            onEdit={(cat) => {
              setEditingId(cat.id);
              setCategoryName(cat.name);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};
