"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Upload, Trash2, FileText, X, Plus } from "lucide-react";

interface TextbookFile {
  name: string;
  size: number;
  url: string;
}

interface TextbookUploadProps {
  gradeSlug: string;
}

export default function TextbookUpload({ gradeSlug }: TextbookUploadProps) {
  const [files, setFiles] = useState<TextbookFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerName, setViewerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("gradeSlug", gradeSlug);

      let validCount = 0;
      for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i].type === "application/pdf") {
          formData.append("files", selectedFiles[i]);
          validCount++;
        }
      }

      if (validCount === 0) {
        setError("Please upload PDF files only.");
        setUploading(false);
        return;
      }

      const res = await fetch("/api/textbook/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      await loadFiles();
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteOne = async (fileName: string) => {
    if (!confirm(`Remove "${fileName}"?`)) return;

    setError(null);
    try {
      const res = await fetch(
        `/api/textbook/upload?gradeSlug=${gradeSlug}&fileName=${encodeURIComponent(fileName)}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`Delete failed with status ${res.status}`);
      await loadFiles();
      if (viewerUrl) setViewerUrl(null);
    } catch {
      setError("Failed to delete file");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Remove all uploaded textbooks for this grade?")) return;

    setError(null);
    try {
      const res = await fetch(`/api/textbook/upload?gradeSlug=${gradeSlug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed with status ${res.status}`);
      setFiles([]);
      setViewerUrl(null);
    } catch {
      setError("Failed to delete textbooks");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
              files.length > 0
                ? "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                : "border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-2 text-blue-600 hover:border-blue-400 hover:bg-blue-100"
            }`}
          >
            {uploading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                Uploading...
              </>
            ) : files.length > 0 ? (
              <>
                <Plus size={14} />
                Add More PDFs
              </>
            ) : (
              <>
                <FileText size={14} />
                Upload Textbook PDF
              </>
            )}
          </button>

          {files.length > 1 && (
            <button
              onClick={handleDeleteAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50"
            >
              <Trash2 size={14} />
              Remove All
            </button>
          )}

          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleUpload}
          className="hidden"
        />

        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all hover:border-blue-300 hover:shadow"
              >
                <FileText size={16} className="shrink-0 text-blue-500" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-700" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={() => {
                    setViewerUrl(file.url);
                    setViewerName(file.name);
                  }}
                  className="ml-1 rounded p-1 text-blue-500 transition-colors hover:bg-blue-50"
                  title="View PDF"
                >
                  <BookOpen size={14} />
                </button>
                <button
                  onClick={() => handleDeleteOne(file.name)}
                  className="rounded p-1 text-red-400 opacity-0 transition-all hover:bg-red-50 group-hover:opacity-100"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
