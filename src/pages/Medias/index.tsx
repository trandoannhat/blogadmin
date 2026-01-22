import { useEffect, useState } from "react";
import { Row, Col, Button, Upload, message, Spin, Empty } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MediaService from "./MediaService";
import MediaCard from "./MediaCard";

const MediasPage = () => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    console.log("🔍 Đang chuẩn bị gọi API lấy danh sách Media...");
    setLoading(true);
    const res = await MediaService.getAll();
    console.log("✅ Kết quả API trả về:", res);
    if (res.success) setMedias(res.data);
    setLoading(false);
  };

  useEffect(() => {
    console.log("📱 Component MediasPage đã Mount (hiển thị)");
    loadData();
  }, []);

  const handleUpload = async (options: any) => {
    try {
      const res = await MediaService.upload(options.file);
      if (res.success) {
        message.success("Upload thành công!");
        loadData();
      }
    } catch (err) {
      message.error("Lỗi upload!");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Thư viện Media</h2>
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button type="primary" icon={<UploadOutlined />}>
            Tải ảnh lên
          </Button>
        </Upload>
      </div>

      <Spin spinning={loading}>
        {medias.length === 0 ? (
          <Empty />
        ) : (
          <Row gutter={[16, 16]}>
            {medias.map((item: any) => (
              <Col xs={12} sm={8} md={6} lg={4} key={item.id}>
                <MediaCard
                  item={item}
                  onDelete={async (id) => {
                    await MediaService.delete(id);
                    message.success("Đã xóa!");
                    loadData();
                  }}
                  onCopy={(url) => {
                    navigator.clipboard.writeText(url);
                    message.success("Đã copy link!");
                  }}
                />
              </Col>
            ))}
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default MediasPage;
