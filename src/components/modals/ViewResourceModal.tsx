import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Button,
  Divider,
  Tag,
  Typography,
  message,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { IMG_BASE_URL } from "@/lib/config";

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
  tags?: string[];
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");
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

  const isExternalLink = (url: string) => {
    if (!url) return false;
    const isHttp = /^https?:\/\//i.test(url);
    const hasVideoExtension = /\.(mp4|mov|avi|mkv|webm)(\?|#|$)/i.test(url);
    const isInternal = url.startsWith(IMG_BASE_URL);
    return isHttp && !isInternal && !hasVideoExtension;
  };

  const getVideoEmbedUrl = (url: string) => {
    const youTubeMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i
    );
    if (youTubeMatch?.[1]) {
      return `https://www.youtube.com/embed/${youTubeMatch[1]}`;
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
    if (vimeoMatch?.[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  useEffect(() => {
    if (open && currentItem?.url) {
      setMediaUrl(currentItem.url);
      return;
    }

    setMediaUrl("");
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [open, currentItem?.url]);

  const renderViewContent = () => {
    if (!currentItem) return null;

    switch (currentItem.type) {
      case "video":
        if (isExternalLink(currentItem.url)) {
          const embedUrl = mediaUrl ? getVideoEmbedUrl(mediaUrl) : "";
          return (
            <div className="video-container" style={{ padding: "12px" }}>
              <iframe
                key={embedUrl || "empty"}
                src={embedUrl}
                title={currentItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "500px", border: "none" }}
              />
            </div>
          );
        }
        return (
          <div className="video-container">
            <video
              ref={videoRef}
              controls
              autoPlay
              style={{ width: "100%", maxHeight: "500px" }}
            >
              <source src={mediaUrl} type="video/mp4" />
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
            <audio ref={audioRef} controls autoPlay style={{ width: "100%" }}>
              <source src={mediaUrl} type="audio/mpeg" />
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
                className="!bg-primary !border-primary"
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
      destroyOnClose
      afterClose={() => {
        setMediaUrl("");
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }}
      footer={[
        currentItem?.url && isExternalLink(currentItem.url) ? (
          <Button
            key="open"
            type="primary"
            icon={<DownloadOutlined />}
            href={currentItem.url}
            target="_blank"
            className="!bg-primary !border-primary"
          >
            Open Link
          </Button>
        ) : (
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            href={currentItem?.url}
            download
            className="!bg-primary !border-primary"
          >
            Download
          </Button>
        ),
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

        {currentItem?.tags && currentItem.tags.length > 0 && (
          <div className="mb-4">
            <Text strong>Tags: </Text>
            <span className="ml-2">
              {currentItem.tags.map((tag) => (
                <Tag key={`${currentItem.id}-${tag}`} className="m-0">
                  {tag}
                </Tag>
              ))}
            </span>
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