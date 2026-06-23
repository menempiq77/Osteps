"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ImageLightboxProps {
  url: string | null;
  onClose: () => void;
}

export default function ImageLightbox({ url, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (url) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [url]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (url) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [url, onClose]);

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.5, 5)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.5, 0.5)), []);
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.25 : 0.25;
      setScale((s) => Math.min(Math.max(s + delta, 0.5), 5));
    },
    []
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setDragging(true);
      setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleDownload = () => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 left-0 right-0 flex items-center justify-center gap-2 z-10 px-4">
        <button
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          title="Zoom out"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); resetZoom(); }}
          className="rounded-full bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/20"
          title="Reset"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          title="Zoom in"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleDownload(); }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          title="Download"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          title="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      <div
        className="flex h-full w-full items-center justify-center overflow-hidden p-4"
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={url}
          alt="Preview"
          className="max-h-full max-w-full cursor-grab object-contain transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: dragging ? "grabbing" : scale > 1 ? "grab" : "zoom-in",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (scale === 1) zoomIn();
            else resetZoom();
          }}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
      </div>
    </div>
  );
}
