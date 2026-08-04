"use client";

import { useEffect, useRef } from "react";
import { NOTEBOOK_PAGE_HEIGHT, NOTEBOOK_PAGE_WIDTH, type NotebookPage } from "@/lib/classNotebook";
import { drawNotebookAnnotations } from "./NotebookPageCanvas";
import AuthenticatedNotebookImage from "./AuthenticatedNotebookImage";

type Props = {
  page: NotebookPage;
  active: boolean;
  onClick: () => void;
  studentAnnotations?: NotebookPage["studentAnnotations"];
  teacherAnnotations?: NotebookPage["teacherAnnotations"];
  title?: string;
  heading?: string | null;
};

const THUMBNAIL_WIDTH = 118;
const THUMBNAIL_HEIGHT = Math.round((NOTEBOOK_PAGE_HEIGHT / NOTEBOOK_PAGE_WIDTH) * THUMBNAIL_WIDTH);
const SCALE = THUMBNAIL_WIDTH / NOTEBOOK_PAGE_WIDTH;

export default function NotebookPageThumbnail({
  page,
  active,
  onClick,
  studentAnnotations = page.studentAnnotations,
  teacherAnnotations = page.teacherAnnotations,
  title = page.title,
  heading = page.heading,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(THUMBNAIL_WIDTH * ratio);
    canvas.height = Math.round(THUMBNAIL_HEIGHT * ratio);
    canvas.style.width = `${THUMBNAIL_WIDTH}px`;
    canvas.style.height = `${THUMBNAIL_HEIGHT}px`;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(ratio * SCALE, 0, 0, ratio * SCALE, 0, 0);
    context.clearRect(0, 0, NOTEBOOK_PAGE_WIDTH, NOTEBOOK_PAGE_HEIGHT);
    drawNotebookAnnotations(context, [...studentAnnotations, ...teacherAnnotations]);
  }, [studentAnnotations, teacherAnnotations]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border p-2 text-left transition ${
        active ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-300" : "border-slate-200 bg-white hover:border-emerald-300"
      }`}
    >
      <div className="relative mx-auto w-fit overflow-hidden rounded border bg-white shadow-sm">
        {page.background.imageUrl ? (
          <AuthenticatedNotebookImage
            src={page.background.imageUrl}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-contain object-top"
          />
        ) : null}
        {[...studentAnnotations, ...teacherAnnotations]
          .filter((annotation) => annotation.type === "image")
          .map((annotation) => (
            <AuthenticatedNotebookImage
              key={annotation.id}
              src={annotation.url}
              alt={annotation.name || ""}
              className="pointer-events-none absolute object-contain object-top"
              style={{
                left: annotation.x * SCALE,
                top: annotation.y * SCALE,
                width: annotation.width * SCALE,
                height: annotation.height * SCALE,
              }}
            />
          ))}
        {heading ? (
          <div
            className="pointer-events-none absolute z-10 truncate border-b border-slate-400 text-center font-[cursive] text-slate-700"
            style={{
              left: 40 * SCALE,
              top: 24 * SCALE,
              width: 714 * SCALE,
              height: 46 * SCALE,
              fontSize: 30 * SCALE,
              lineHeight: `${40 * SCALE}px`,
            }}
          >
            {heading}
          </div>
        ) : null}
        <canvas ref={canvasRef} className="relative block" />
      </div>
      <div className="mt-1 truncate text-xs font-medium text-slate-700">
        {page.pageIndex + 1}. {title || "Untitled page"}
      </div>
    </button>
  );
}
