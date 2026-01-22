import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { Save, ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
}

// Cấu hình Toolbar cho trình soạn thảo xịn hơn
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block", "blockquote"],
    ["link", "image"],
    ["clean"],
  ],
};

export const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id); // Trạng thái đang load dữ liệu cũ

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    thumbnail: "",
    categoryId: "",
    tagIds: [] as number[],
  });

  useEffect(() => {
    // 1. Load Categories
    axiosClient.get("/Categories").then((res) => {
      setCategories(res.data.data);
    });

    // 2. Load dữ liệu nếu là Edit
    if (id) {
      axiosClient
        .get(`/Posts/${id}`)
        .then((res) => {
          const p = res.data.data;
          setFormData({
            title: p.title || "",
            summary: p.summary || "",
            content: p.content || "",
            thumbnail: p.thumbnail || "",
            categoryId: p.categoryId?.toString() || "",
            tagIds: p.tags?.map((t: any) => t.id) || [],
          });
        })
        .catch(() => toast.error("Không thể tải thông tin bài viết"))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content || formData.content === "<p><br></p>") {
      return toast.error("Vui lòng nhập nội dung bài viết");
    }

    setLoading(true);
    const loadId = toast.loading("Đang xử lý bài viết...");

    const payload = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
    };

    try {
      if (id) {
        await axiosClient.put(`/Posts/${id}`, payload);
        toast.success("Cập nhật thành công!", { id: loadId });
      } else {
        await axiosClient.post("/Posts", payload);
        toast.success("Đã xuất bản bài viết mới!", { id: loadId });
      }
      navigate("/posts");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi lưu dữ liệu", {
        id: loadId,
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="text-center p-20 text-gray-400">
        Đang lấy dữ liệu bài viết...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => navigate("/posts")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <div className="flex items-center gap-2 text-blue-600">
          <Sparkles size={20} />
          <h2 className="text-xl font-black uppercase tracking-tight">
            {id ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </h2>
        </div>
        <div className="w-20"></div> {/* Spacer để cân bằng */}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Cột chính: Nội dung */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Tiêu đề
              </label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg font-bold"
                placeholder="Nhập tiêu đề thu hút..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Tóm tắt ngắn
              </label>
              <textarea
                rows={3}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                placeholder="Một vài dòng mô tả cho bài viết này..."
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Nội dung chi tiết
              </label>
              <div className="prose max-w-none">
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  className="rounded-2xl overflow-hidden"
                  style={{ height: "400px", marginBottom: "50px" }}
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phụ: Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Danh mục
              </label>
              <select
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Ảnh đại diện (URL)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pl-11"
                  placeholder="Dán link ảnh tại đây..."
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                />
                <ImageIcon
                  className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
              </div>

              <div className="mt-4 aspect-video rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                {formData.thumbnail ? (
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/600x400?text=Lỗi+đường+dẫn+ảnh")
                    }
                  />
                ) : (
                  <p className="text-gray-400 text-xs text-center px-4">
                    Xem trước ảnh đại diện hiển thị tại đây
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
            >
              <Save size={20} />
              {loading ? "ĐANG LƯU..." : id ? "LƯU THAY ĐỔI" : "XUẤT BẢN NGAY"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
