import React from "react";
import {
  Modal,
  Button,
  Divider,
  Tag,
  Typography,
  message,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface LibraryItem {
  id: string;
  title: string;
  type: "book" | "video" | "pdf" | "audio";
  url: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  subject?: string;
  description?: string;
}

interface ViewResourceModalProps {
  open: boolean;
  onCancel: () => void;
  currentItem: LibraryItem | null;
}

const ViewResourceModal: React.FC<ViewResourceModalProps> = ({
  open,
  onCancel,
  currentItem,
}) => {
  const getTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      book: { color: "blue", text: "Book" },
      video: { color: "red", text: "Video" },
      pdf: { color: "green", text: "PDF" },
      audio: { color: "orange", text: "Audio" },
    };

    return (
      <Tag color={typeMap[type]?.color || "default"}>
        {typeMap[type]?.text || type}
      </Tag>
    );
  };

  const renderViewContent = () => {
    if (!currentItem) return null;

    switch (currentItem.type) {
      case "video":
        return (
          <div className="video-container">
            <video
              controls
              autoPlay
              style={{ width: "100%", maxHeight: "500px" }}
            >
              <source src={currentItem.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "audio":
        return (
          <div
            className="audio-container"
            style={{ textAlign: "center", padding: "20px" }}
          >
            <audio controls autoPlay style={{ width: "100%" }}>
              <source src={currentItem.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case "book":
        return (
          <div className="book-preview" style={{ padding: "20px" }}>
            <Text>
              This is a book resource. Click the download button to get the full
              content.
            </Text>
            <div style={{ marginTop: "20px" }}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                href={currentItem.url}
                target="_blank"
              >
                Download Book
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="default-preview" style={{ padding: "20px" }}>
            <Text>Preview not available for this resource type.</Text>
          </div>
        );
    }
  };

  return (
    <Modal
      title={currentItem?.title || "View Resource"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          href={currentItem?.url}
          download
        >
          Download
        </Button>,
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={800}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: "24px" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <Text strong>Subject: </Text>
            <Tag color="purple">{currentItem?.subject}</Tag>
          </div>
          <div>
            <Text strong>Type: </Text>
            {currentItem && getTypeTag(currentItem.type)}
          </div>
        </div>

        {currentItem?.description && (
          <div className="mb-4">
            <Text strong>Description: </Text>
            <Text>{currentItem.description}</Text>
          </div>
        )}

        <div className="mb-2">
          <Text type="secondary">
            Uploaded by {currentItem?.uploadedBy} on {currentItem?.uploadDate} •{" "}
            {currentItem?.size}
          </Text>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      <div style={{ minHeight: "500px" }}>{renderViewContent()}</div>
    </Modal>
  );
};

export default ViewResourceModal;