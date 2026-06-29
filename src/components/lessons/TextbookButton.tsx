"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X } from "lucide-react";

interface TextbookButtonProps {
  gradeSlug: string;
}

export default function TextbookButton({ gradeSlug }: TextbookButtonProps) {
  const [hasTextbook, setHasTextbook] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

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

  if (!hasTextbook) return null;

  return (
    <>
      <button
        onClick={() => setShowViewer(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        title="View Textbook PDF"
      >
        <BookOpen size={14} />
        Textbook
      </button>

      {showViewer &&
        createPortal(
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
          </div>,
          document.body,
        )}
    </>
  );
}
