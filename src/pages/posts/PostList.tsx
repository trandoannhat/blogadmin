import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

// Định nghĩa kiểu dữ liệu để TypeScript hỗ trợ nhắc code
interface PostSummary {
  id: number;
  title: string;
  categoryName: string;
  createdAt: string;
  slug: string;
  tags: string[];
}

export const PostList = () => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // API của bạn trả về cấu trúc: { success: true, data: { items: [...], totalCount: 10 }, ... }
      const res = await axiosClient.get("/Posts?pageNumber=1&pageSize=50");

      // Chú ý: .data là response của axios, .data tiếp theo là ApiResponse của .NET
      // và .data tiếp nữa là object PagedResult chứa items
      const pagedData = res.data.data.items;
      setPosts(pagedData);
    } catch (error) {
      console.error("Lỗi lấy danh sách bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id: number) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa bài viết này? Thao tác này không thể hoàn tác.",
      )
    ) {
      try {
        await axiosClient.delete(`/Posts/${id}`);
        // Cách xóa nhanh trên UI mà không cần gọi lại API
        setPosts(posts.filter((p) => p.id !== id));
      } catch (error) {
        alert("Xóa thất bại. Vui lòng kiểm tra lại quyền hạn.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h2>
          <p className="text-gray-500 text-sm">
            Danh sách các bài viết đã đăng trên hệ thống
          </p>
        </div>
        <Link
          to="/posts/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus size={20} /> Viết bài mới
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-600 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Bài viết</th>
              <th className="px-6 py-4 font-semibold">Danh mục</th>
              <th className="px-6 py-4 font-semibold">Ngày đăng</th>
              <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-20 text-gray-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-20 text-gray-400">
                  Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </span>
                      <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        /{post.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase">
                      {post.categoryName || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/posts/edit/${post.id}`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa bài"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
