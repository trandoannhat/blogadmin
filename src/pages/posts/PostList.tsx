import { useEffect, useState, useCallback } from "react";
import axiosClient from "../../api/axiosClient";
import { Plus, Edit, Trash2, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // Cài: npm install react-hot-toast

interface PostSummary {
  id: number;
  title: string;
  categoryName: string;
  createdAt: string;
  slug: string;
  thumbnail?: string; // Thêm thumbnail để giao diện sinh động hơn
}

export const PostList = () => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Tăng pageSize hoặc thêm logic phân trang thực tế nếu cần
      const res = await axiosClient.get("/Posts?pageNumber=1&pageSize=100");
      setPosts(res.data.data.items);
    } catch (error: any) {
      toast.error("Không thể tải danh sách bài viết");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const deletePost = async (id: number) => {
    if (!window.confirm("Xác nhận xóa bài viết này?")) return;

    const loadId = toast.loading("Đang xóa...");
    try {
      await axiosClient.delete(`/Posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Đã xóa bài viết", { id: loadId });
    } catch (error) {
      toast.error("Xóa thất bại. Vui lòng thử lại", { id: loadId });
    }
  };

  // Logic tìm kiếm nhanh trên UI
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Bài Viết
          </h2>
          <p className="text-gray-400 text-sm">Quản lý nội dung Blog của bạn</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm tên bài viết..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/posts/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95 font-bold"
          >
            <Plus size={20} /> Viết bài
          </Link>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b text-gray-500 text-[11px] uppercase tracking-[0.1em] font-bold">
                <th className="px-6 py-4">Nội dung bài viết</th>
                <th className="px-6 py-4">Phân loại</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-6">
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </td>
                  </tr>
                ))
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center text-gray-400">
                      <Search size={48} className="mb-2 opacity-20" />
                      <p>Không tìm thấy bài viết nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar bài viết nhỏ */}
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 font-bold overflow-hidden">
                          {post.thumbnail ? (
                            <img
                              src={post.thumbnail}
                              alt=""
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            "ND"
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {post.title}
                          </span>
                          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-tighter">
                            {post.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-white text-gray-600 text-[10px] font-black rounded-md border border-gray-200 uppercase">
                        {post.categoryName || "Ghi chép"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Calendar size={12} />
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/posts/edit/${post.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
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
    </div>
  );
};
