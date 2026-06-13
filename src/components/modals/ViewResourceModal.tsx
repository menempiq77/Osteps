import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Divider, Tag, Typography, Spin } from "antd";
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
  const [previewMode, setPreviewMode] = useState<"live" | "image">("live");
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);

  const normalizeResourceUrl = (url?: string) => {
    if (!url) {
      console.log('[normalizeResourceUrl] Input is empty');
      return "";
    }
    let trimmed = String(url).trim();
    console.log('[normalizeResourceUrl] Input:', trimmed);

    const wrappedExternalMatch = trimmed.match(/\/storage\/(https?:\/\/.*)$/i);
    if (wrappedExternalMatch?.[1]) {
      trimmed = wrappedExternalMatch[1];
      console.log('[normalizeResourceUrl] Unwrapped external URL:', trimmed);
    }
    
    if (!trimmed) {
      console.log('[normalizeResourceUrl] Empty after cleanup');
      return "";
    }
    
    // Ensure it starts with http/https if it's an external link
    if (!/^(https?:\/\/|blob:|data:)/i.test(trimmed)) {
      if (trimmed.startsWith("//")) {
        const result = `https:${trimmed}`;
        console.log('[normalizeResourceUrl] Prepended https: for //, result:', result);
        return result;
      }
      if (trimmed.startsWith("/")) {
        console.log('[normalizeResourceUrl] Local path, returning as-is');
        return trimmed;
      }
      const result = `https://${trimmed}`;
      console.log('[normalizeResourceUrl] Prepended https://, result:', result);
      return result;
    }
    
    console.log('[normalizeResourceUrl] Final result:', trimmed);
    return trimmed;
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

  const isPdfResource = (url: string, type: string) =>
    (type || "").toLowerCase() === "pdf" || isLikelyEmbeddableDocument(url);

  // PDFs render in the browser's built-in viewer. We route every http(s) PDF
  // through the same-origin proxy so it is served with the right content-type
  // and without frame-blocking headers (Chrome refuses PDFs from a sandboxed
  // cross-origin frame, which is why a direct link showed a broken icon).
  const getPdfFrameUrl = (url: string) => {
    const normalized = normalizeResourceUrl(url);
    if (/^https?:\/\//i.test(normalized)) {
      return `/api/resource-proxy?url=${encodeURIComponent(normalized)}`;
    }
    return normalized;
  };

  // Some published pages (e.g. Canva sites) send X-Frame-Options and are
  // single-page apps that render blank when proxied. For those we show a
  // readable full-page snapshot instead of a blank frame.
  const isSnapshotPreferred = (url: string) => {
    try {
      const host = new URL(normalizeResourceUrl(url)).hostname.toLowerCase();
      return /\.canva\.site$/i.test(host);
    } catch {
      return false;
    }
  };

  const getSnapshotUrl = (url: string) => {
    const normalized = normalizeResourceUrl(url);
    return `https://image.thum.io/get/width/1200/fullpage/noanimate/${normalized}`;
  };

  const getPreviewFrameUrl = (url: string, type: string) => {
    const normalized = normalizeResourceUrl(url);
    const normalizedType = (type || "").toLowerCase();
    if (
      normalized &&
      isExternalLink(normalized) &&
      !isLikelyEmbeddableDocument(normalized) &&
      !["audio", "video"].includes(normalizedType)
    ) {
      return `/api/resource-proxy?url=${encodeURIComponent(normalized)}`;
    }

    return normalized;
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
      console.log('[ViewResourceModal useEffect] Raw currentItem.url:', currentItem.url);
      const normalized = normalizeResourceUrl(currentItem.url);
      console.log('[ViewResourceModal useEffect] After normalization:', normalized);
      setMediaUrl(normalized);
      setIframeLoaded(false);
      setEmbedBlocked(false);
      setSnapshotLoaded(false);
      setPreviewMode(isSnapshotPreferred(currentItem.url) ? "image" : "live");
      return;
    }

    setMediaUrl("");
    setIframeLoaded(false);
    setEmbedBlocked(false);
    setSnapshotLoaded(false);
    setPreviewMode("live");
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
    const shouldCheckEmbed =
      !["audio", "video"].includes(normalizedType) &&
      previewMode === "live" &&
      !isPdfResource(currentItem.url, normalizedType);
    if (!shouldCheckEmbed) return;

    // The proxy strips frame-blocking headers, so a reachable site will fire
    // onLoad within a few seconds. Give it a generous window before falling
    // back to the "open in new tab" prompt so we don't bail out prematurely.
    const timer = window.setTimeout(() => {
      if (!iframeLoaded) {
        setEmbedBlocked(true);
      }
    }, 20000);

    return () => window.clearTimeout(timer);
  }, [open, currentItem?.url, currentItem?.type, iframeLoaded, previewMode]);

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
    const previewFrameUrl = getPreviewFrameUrl(mediaUrl || currentItem.url, normalizedType);

    if (normalizedType === "video") {
      const normalizedVideoUrl = mediaUrl || normalizeResourceUrl(currentItem.url);
      const embedUrl = normalizedVideoUrl ? getVideoEmbedUrl(normalizedVideoUrl) : "";
      const canEmbed = /youtube\.com\/embed\/|player\.vimeo\.com\/video\//i.test(embedUrl);

      if (canEmbed) {
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

    // PDFs / documents: render inline in the browser's PDF viewer.
    if (isPdfResource(currentItem.url, normalizedType)) {
      const pdfUrl = getPdfFrameUrl(mediaUrl || currentItem.url);
      return (
        <div style={{ padding: isFullscreen ? "0" : "12px" }}>
          <iframe
            key={pdfUrl || "pdf-frame"}
            src={pdfUrl}
            title={currentItem.title}
            style={{
              width: "100%",
              height: playerHeight,
              border: "1px solid #e5e7eb",
              borderRadius: isFullscreen ? "0" : "8px",
              background: "#fff",
            }}
          />
          <div style={{ marginTop: "10px", display: isFullscreen ? "none" : "block" }}>
            <Text type="secondary">If the document does not display, use Open Link.</Text>
          </div>
        </div>
      );
    }

    const snapshotUrl = getSnapshotUrl(mediaUrl || currentItem.url);

    return (
      <div style={{ padding: isFullscreen ? "0" : "12px" }}>
        {!isFullscreen && (
          <div style={{ marginBottom: "10px" }}>
            <Button.Group>
              <Button
                type={previewMode === "live" ? "primary" : "default"}
                className={previewMode === "live" ? "!bg-primary !border-primary" : ""}
                onClick={() => {
                  setPreviewMode("live");
                  setIframeLoaded(false);
                  setEmbedBlocked(false);
                }}
              >
                Live page
              </Button>
              <Button
                type={previewMode === "image" ? "primary" : "default"}
                className={previewMode === "image" ? "!bg-primary !border-primary" : ""}
                onClick={() => {
                  setPreviewMode("image");
                  setSnapshotLoaded(false);
                }}
              >
                Page image
              </Button>
            </Button.Group>
            <Text type="secondary" style={{ marginLeft: 10, fontSize: 12 }}>
              {previewMode === "image"
                ? "A readable snapshot — use Live page or Open Link to interact."
                : "Some sites block embedding; switch to Page image if it stays blank."}
            </Text>
          </div>
        )}

        <div
          style={{
            position: "relative",
            width: "100%",
            height: playerHeight,
            borderRadius: isFullscreen ? "0" : "8px",
            overflow: previewMode === "image" ? "auto" : "hidden",
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          {previewMode === "image" ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={snapshotUrl}
                src={snapshotUrl}
                alt={currentItem.title}
                onLoad={() => setSnapshotLoaded(true)}
                onError={() => setSnapshotLoaded(true)}
                style={{ width: "100%", display: "block" }}
              />
              {!snapshotLoaded && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    background: "#f8fafc",
                  }}
                >
                  <Spin />
                  <Text type="secondary">Rendering page snapshot…</Text>
                </div>
              )}
            </>
          ) : (
            <>
              <iframe
                key={previewFrameUrl || "resource-frame"}
                src={previewFrameUrl}
                title={currentItem.title}
                onLoad={() => {
                  setIframeLoaded(true);
                  setEmbedBlocked(false);
                }}
                onError={() => setEmbedBlocked(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
              />

              {!iframeLoaded && !embedBlocked && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    background: "#f8fafc",
                  }}
                >
                  <Spin />
                  <Text type="secondary">Loading preview…</Text>
                </div>
              )}

              {embedBlocked && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "24px",
                    background: "#f8fafc",
                  }}
                >
                  <Text strong style={{ fontSize: 16 }}>
                    This page can&apos;t be embedded.
                  </Text>
                  <Text type="secondary" style={{ textAlign: "center" }}>
                    Some sites block embedding. View a readable snapshot, or open it in a new tab.
                  </Text>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      onClick={() => {
                        setPreviewMode("image");
                        setSnapshotLoaded(false);
                      }}
                    >
                      View page image
                    </Button>
                    <Button
                      type="primary"
                      icon={<LinkOutlined />}
                      onClick={() => {
                        const finalUrl = normalizeResourceUrl(currentItem?.url);
                        window.open(finalUrl, "_blank");
                      }}
                      className="!bg-primary !border-primary"
                    >
                      Open Link
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
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
          onClick={() => {
            const finalUrl = normalizeResourceUrl(currentItem?.url);
            console.log('ViewResourceModal - Original URL:', currentItem?.url);
            console.log('ViewResourceModal - Final URL:', finalUrl);
            window.open(finalUrl, '_blank');
          }}
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
