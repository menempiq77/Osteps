import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Divider, Tag, Typography } from "antd";
import { ExpandOutlined, CompressOutlined, LinkOutlined } from "@ant-design/icons";
import { IMG_BASE_URL } from "@/lib/config";

const { Text } = Typography;

interface LibraryItem {
  id: string;
  title: string;
  type: string;
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
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [embedBlocked, setEmbedBlocked] = useState(false);

  const normalizeResourceUrl = (url?: string) => {
    if (!url) return "";
    const trimmed = String(url).trim();
    if (!trimmed) return "";
    if (/^(https?:\/\/|blob:|data:)/i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("//")) return `https:${trimmed}`;
    if (trimmed.startsWith("/")) return trimmed;
    return `https://${trimmed}`;
  };

  const getTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      book: { color: "blue", text: "Book" },
      video: { color: "red", text: "Video" },
      pdf: { color: "green", text: "PDF" },
      audio: { color: "orange", text: "Audio" },
      website: { color: "cyan", text: "Website" },
      document: { color: "geekblue", text: "Document" },
      link: { color: "lime", text: "Link" },
    };

    const normalized = (type || "").toLowerCase();
    return (
      <Tag color={typeMap[normalized]?.color || "default"}>
        {typeMap[normalized]?.text || type}
      </Tag>
    );
  };

  const isExternalLink = (url: string) => {
    if (!url) return false;
    const normalized = normalizeResourceUrl(url);
    const isHttp = /^https?:\/\//i.test(normalized);
    const hasVideoExtension = /\.(mp4|mov|avi|mkv|webm)(\?|#|$)/i.test(url);
    const isInternal = normalized.startsWith(IMG_BASE_URL);
    return isHttp && !isInternal && !hasVideoExtension;
  };

  const isLikelyEmbeddableDocument = (url: string) => {
    const clean = normalizeResourceUrl(url).split("?")[0].split("#")[0].toLowerCase();
    return clean.endsWith(".pdf");
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
      setMediaUrl(normalizeResourceUrl(currentItem.url));
      setIframeLoaded(false);
      setEmbedBlocked(false);
      return;
    }

    setMediaUrl("");
    setIframeLoaded(false);
    setEmbedBlocked(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [open, currentItem?.url]);

  useEffect(() => {
    if (!open || !currentItem?.url) return;
    const normalizedType = (currentItem.type || "").toLowerCase();
    const shouldCheckEmbed = !["audio", "video"].includes(normalizedType);
    if (!shouldCheckEmbed) return;

    const timer = window.setTimeout(() => {
      if (!iframeLoaded) {
        setEmbedBlocked(true);
      }
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [open, currentItem?.url, currentItem?.type, iframeLoaded]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && previewContainerRef.current) {
        await previewContainerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore browser-specific fullscreen failures.
    }
  };

  const renderViewContent = () => {
    if (!currentItem) return null;

    const normalizedType = (currentItem.type || "").toLowerCase();
    const playerHeight = isFullscreen ? "100vh" : "560px";
    const external = isExternalLink(currentItem.url);

    if (normalizedType === "video") {
      if (isExternalLink(currentItem.url)) {
        const embedUrl = mediaUrl ? getVideoEmbedUrl(mediaUrl) : "";
        return (
          <div style={{ padding: isFullscreen ? "0" : "12px" }}>
            <iframe
              key={embedUrl || "empty"}
              src={embedUrl}
              title={currentItem.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: "100%",
                height: playerHeight,
                border: "none",
                borderRadius: isFullscreen ? "0" : "8px",
              }}
            />
          </div>
        );
      }

      return (
        <div style={{ padding: isFullscreen ? "0" : "12px" }}>
          <video
            ref={videoRef}
            controls
            autoPlay
            style={{
              width: "100%",
              height: playerHeight,
              maxHeight: "none",
              objectFit: "contain",
            }}
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (normalizedType === "audio") {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <audio ref={audioRef} controls autoPlay style={{ width: "100%" }}>
            <source src={mediaUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    // External websites often block iframe embedding (X-Frame-Options/CSP).
    // For non-document external links, show a reliable fallback panel instead of blank iframe.
    if (external && !isLikelyEmbeddableDocument(currentItem.url) && normalizedType !== "video") {
      return (
        <div style={{ padding: isFullscreen ? "0" : "12px" }}>
          <div
            style={{
              width: "100%",
              height: playerHeight,
              borderRadius: isFullscreen ? "0" : "8px",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
              padding: "24px",
            }}
          >
            <Text strong style={{ fontSize: 16 }}>
              This website cannot be displayed inside the app.
            </Text>
            <Text type="secondary">Use Open Link to view it in a new tab.</Text>
            <Button
              type="primary"
              icon={<LinkOutlined />}
              href={normalizeResourceUrl(currentItem?.url)}
              target="_blank"
              className="!bg-primary !border-primary"
            >
              Open Link
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: isFullscreen ? "0" : "12px" }}>
        {embedBlocked ? (
          <div
            style={{
              width: "100%",
              height: playerHeight,
              borderRadius: isFullscreen ? "0" : "8px",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
              padding: "24px",
            }}
          >
            <Text strong style={{ fontSize: 16 }}>
              This website blocks in-app preview.
            </Text>
            <Text type="secondary">Open it in a new tab to view the content.</Text>
            <Button
              type="primary"
              icon={<LinkOutlined />}
              href={normalizeResourceUrl(currentItem?.url)}
              target="_blank"
              className="!bg-primary !border-primary"
            >
              Open Link
            </Button>
          </div>
        ) : (
          <iframe
            key={mediaUrl || "resource-frame"}
            src={mediaUrl}
            title={currentItem.title}
            onLoad={() => {
              setIframeLoaded(true);
              setEmbedBlocked(false);
            }}
            onError={() => setEmbedBlocked(true)}
            style={{
              width: "100%",
              height: playerHeight,
              border: "none",
              borderRadius: isFullscreen ? "0" : "8px",
            }}
          />
        )}
        <div style={{ marginTop: "10px", display: isFullscreen ? "none" : "block" }}>
          <Text type="secondary">If preview is blocked by the provider, use Open Link.</Text>
        </div>
      </div>
    );
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
        <Button
          key="fullscreen"
          icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? "Exit Full Screen" : "Full Screen"}
        </Button>,
        <Button
          key="open-link"
          type="primary"
          icon={<LinkOutlined />}
          href={normalizeResourceUrl(currentItem?.url)}
          target="_blank"
          className="!bg-primary !border-primary"
        >
          Open Link
        </Button>,
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={900}
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: "24px" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <Text strong>Subject: </Text>
            <Tag color="purple">{currentItem?.subject || "General"}</Tag>
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
            Uploaded by {currentItem?.uploadedBy} on {currentItem?.uploadDate} - {currentItem?.size}
          </Text>
        </div>
      </div>

      <Divider style={{ margin: 0 }} />

      <div
        ref={previewContainerRef}
        style={{ minHeight: isFullscreen ? "100vh" : "560px", background: "#fff" }}
      >
        {renderViewContent()}
      </div>
    </Modal>
  );
};

export default ViewResourceModal;
