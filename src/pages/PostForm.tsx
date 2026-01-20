import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { id } = useParams(); // Lấy ID nếu là trang Edit
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axiosClient.get(`/api/Post/${id}`).then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, content };
    if (id) {
      await axiosClient.put(`/api/Post/${id}`, data);
    } else {
      await axiosClient.post("/api/Post", data);
    }
    navigate("/posts");
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        {id ? "Cập nhật bài viết" : "Thêm bài viết mới"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tiêu đề</label>
          <input
            className="w-full border rounded-lg p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nội dung</label>
          <textarea
            className="w-full border rounded-lg p-2 h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Lưu bài viết
        </button>
      </form>
    </div>
  );
};
