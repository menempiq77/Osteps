"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X, ChevronDown } from "lucide-react";

interface TextbookFile {
  name: string;
  url: string;
}

interface TextbookButtonProps {
  gradeSlug: string;
}

export default function TextbookButton({ gradeSlug }: TextbookButtonProps) {
  const [files, setFiles] = useState<TextbookFile[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerName, setViewerName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch(`/api/textbook/${gradeSlug}`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch {
      setFiles([]);
    }
  }, [gradeSlug]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  if (files.length === 0) return null;

  const openViewer = (file: TextbookFile) => {
    setViewerUrl(file.url);
    setViewerName(file.name);
    setShowMenu(false);
  };

  return (
    <>
      {files.length === 1 ? (
        <button
          onClick={() => openViewer(files[0])}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          title="View Textbook PDF"
        >
          <BookOpen size={14} />
          Textbook
        </button>
      ) : (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            <BookOpen size={14} />
            Textbooks ({files.length})
            <ChevronDown size={12} />
          </button>
          {showMenu && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => openViewer(file)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 transition-colors hover:bg-blue-50"
                >
                  <BookOpen size={12} className="shrink-0 text-blue-500" />
                  <span className="truncate">{file.name.replace(/\.pdf$/i, "")}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {viewerUrl &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
            <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BookOpen size={16} />
                  {viewerName || "Textbook PDF"}
                </div>
                <button
                  onClick={() => setViewerUrl(null)}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
              <iframe
                src={viewerUrl}
                className="flex-1 rounded-b-xl"
                title="Textbook PDF"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
