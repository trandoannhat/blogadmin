import axiosClient from "../../api/axiosClient";

const MediaService = {
  // Lấy danh sách ảnh
  getAll: async () => {
    const response = await axiosClient.get("/Media");
    return response.data;
  },

  // Upload ảnh mới
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("File", file); // Phải khớp với Key ở Backend
    const response = await axiosClient.post("/Media/upload", formData);
    return response.data;
  },

  // Xóa ảnh
  delete: async (id: number) => {
    const response = await axiosClient.delete(`/Media/${id}`);
    return response.data;
  },
};

export default MediaService;
