import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
// Thay đổi dòng này
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface Category {
  id: number;
  name: string;
}

export const PostForm = () => {
  const { id } = useParams(); // Lấy ID nếu là trang Edit
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    thumbnail: "",
    categoryId: "",
    tagIds: [] as number[],
  });

  useEffect(() => {
    // 1. Lấy danh sách Categories để đổ vào Select
    axiosClient.get("/Categories").then((res) => {
      setCategories(res.data.data);
    });

    // 2. Nếu có ID, đây là chế độ Edit -> Load dữ liệu cũ
    if (id) {
      axiosClient.get(`/Posts/${id}`).then((res) => {
        const p = res.data.data;
        setFormData({
          title: p.title,
          summary: p.summary,
          content: p.content,
          thumbnail: p.thumbnail || "",
          categoryId: p.categoryId.toString(),
          tagIds: p.tags?.map((t: any) => t.id) || [],
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
    };

    try {
      if (id) {
        await axiosClient.put(`/Posts/${id}`, payload);
      } else {
        await axiosClient.post("/Posts", payload);
      }
      alert("Lưu bài viết thành công!");
      navigate("/posts");
    } catch (error: any) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header hướng dẫn */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/posts")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={20} /> Quay lại danh sách
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {id ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        {/* Cột chính: Nội dung bài viết */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4 text-gray-800">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ví dụ: Hướng dẫn học ASP.NET Core"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Mô tả ngắn (Summary)
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Tóm tắt nội dung bài viết..."
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
              />
            </div>

            <div className="h-[400px] mb-12">
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Nội dung chi tiết
              </label>
              <ReactQuill
                theme="snow"
                className="h-[320px] rounded-lg"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>
          </div>
        </div>

        {/* Cột phụ: Cài đặt bài viết */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Danh mục
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg outline-none bg-gray-50 text-gray-800"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Ảnh đại diện (URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pl-10"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                />
                <ImageIcon
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              {formData.thumbnail && (
                <img
                  src={formData.thumbnail}
                  alt="Preview"
                  className="mt-3 rounded-lg w-full h-32 object-cover border"
                />
              )}
            </div>

            <hr />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <Save size={20} />
              {loading ? "Đang lưu..." : "XUẤT BẢN BÀI VIẾT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
