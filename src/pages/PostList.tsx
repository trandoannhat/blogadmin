import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const PostList = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    axiosClient.get("/api/Post").then((res) => setPosts(res.data));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa bài này?")) {
      await axiosClient.delete(`/api/Post/${id}`);
      fetchPosts(); // Load lại danh sách
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Danh sách bài viết</h2>
        <Link
          to="/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Viết bài mới
        </Link>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-400 text-sm uppercase">
            <th className="py-3">Tiêu đề</th>
            <th className="py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: any) => (
            <tr key={post.id} className="border-b hover:bg-gray-50">
              <td className="py-4 font-medium">{post.title}</td>
              <td className="py-4 text-right flex justify-end gap-3">
                <Link to={`/posts/edit/${post.id}`} className="text-blue-500">
                  <Edit size={18} />
                </Link>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
