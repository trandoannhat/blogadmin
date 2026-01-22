import React from "react";
import { Card, Image, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined, CopyOutlined } from "@ant-design/icons";

interface MediaCardProps {
  item: any;
  onDelete: (id: number) => void;
  onCopy: (url: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onDelete, onCopy }) => {
  return (
    <Card
      hoverable
      cover={
        <Image
          src={item.url}
          alt={item.fileName}
          height={160}
          style={{ objectFit: "cover" }}
          fallback="https://placehold.co/400?text=Error"
        />
      }
      actions={[
        <Tooltip title="Copy Link">
          <CopyOutlined key="copy" onClick={() => onCopy(item.url)} />
        </Tooltip>,
        <Popconfirm
          title="Xóa ảnh này?"
          description="Hành động này không thể hoàn tác!"
          onConfirm={() => onDelete(item.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <DeleteOutlined key="delete" style={{ color: "#ff4d4f" }} />
        </Popconfirm>,
      ]}
    >
      <Card.Meta
        title={
          <div
            style={{
              fontSize: "13px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.fileName}
          </div>
        }
        description={
          <span style={{ fontSize: "11px" }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        }
      />
    </Card>
  );
};

export default MediaCard;
