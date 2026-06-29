"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Upload, Trash2, FileText, X } from "lucide-react";

interface TextbookUploadProps {
  gradeSlug: string;
}

export default function TextbookUpload({ gradeSlug }: TextbookUploadProps) {
  const [hasTextbook, setHasTextbook] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkTextbook = useCallback(async () => {
    try {
      const res = await fetch(`/api/textbook/${gradeSlug}`, { method: "HEAD" });
      setHasTextbook(res.ok);
    } catch {
      setHasTextbook(false);
    }
  }, [gradeSlug]);

  useEffect(() => {
    checkTextbook();
  }, [checkTextbook]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("gradeSlug", gradeSlug);

      const res = await fetch("/api/textbook/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      setHasTextbook(true);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove the uploaded textbook?")) return;

    try {
      const res = await fetch(`/api/textbook/upload?gradeSlug=${gradeSlug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHasTextbook(false);
        setShowViewer(false);
      }
    } catch {
      setError("Failed to delete textbook");
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {hasTextbook ? (
          <>
            <button
              onClick={() => setShowViewer(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              <BookOpen size={14} />
              View Textbook PDF
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50"
            >
              <Upload size={14} />
              Replace Textbook
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition-all hover:border-blue-400 hover:bg-blue-100 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <FileText size={14} />
                Upload Textbook PDF
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          className="hidden"
        />

        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>

      {showViewer && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BookOpen size={16} />
                Textbook PDF
              </div>
              <button
                onClick={() => setShowViewer(false)}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <iframe
              src={`/api/textbook/${gradeSlug}`}
              className="flex-1 rounded-b-xl"
              title="Textbook PDF"
            />
          </div>
        </div>
      )}
    </>
  );
}
