"use client";

import { useEffect, useRef } from "react";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import {
  NOTEBOOK_DOCX_FLOW,
  NOTEBOOK_PAGE_HEIGHT,
  NOTEBOOK_PAGE_WIDTH,
  type NotebookMaterial,
  type NotebookPage,
} from "@/lib/classNotebook";
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
  titleEditing?: boolean;
  onTitleChange?: (value: string) => void;
  onTitleCommit?: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  material?: NotebookMaterial | null;
};

const THUMBNAIL_WIDTH = 118;
const THUMBNAIL_SCALE = THUMBNAIL_WIDTH / NOTEBOOK_PAGE_WIDTH;
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
  titleEditing = false,
  onTitleChange,
  onTitleCommit,
  dragHandleProps,
  material = page.material,
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
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={`w-full rounded-lg border p-2 text-left transition ${
        active ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-300" : "border-slate-200 bg-white hover:border-emerald-300"
      }`}
    >
      <div className="relative mx-auto w-fit overflow-hidden rounded border bg-white shadow-sm">
        <div
          {...(dragHandleProps || {})}
          className="absolute left-0 top-0 z-20 flex h-full w-3 cursor-grab items-center justify-center bg-slate-200/60 text-[9px] text-slate-500 active:cursor-grabbing"
          aria-label="Drag to reorder page"
        >
          ⋮
        </div>
        {material ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {material.kind === "docx" ? (
              <div
                className="absolute left-0 top-0"
                style={{
                  width: NOTEBOOK_PAGE_WIDTH,
                  height: NOTEBOOK_PAGE_HEIGHT,
                  transform: `scale(${THUMBNAIL_SCALE})`,
                  transformOrigin: "top left",
                  fontFamily: NOTEBOOK_DOCX_FLOW.fontFamily,
                  fontSize: NOTEBOOK_DOCX_FLOW.fontSize,
                  lineHeight: NOTEBOOK_DOCX_FLOW.lineHeight,
                  padding: NOTEBOOK_DOCX_FLOW.padding,
                  columnWidth: NOTEBOOK_DOCX_FLOW.columnWidth,
                  columnGap: NOTEBOOK_DOCX_FLOW.columnGap,
                  columnFill: NOTEBOOK_DOCX_FLOW.columnFill,
                  boxSizing: "border-box",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    material.pages[page.background.materialPage || 0]?.html || "",
                }}
              />
            ) : material.pages[page.background.materialPage || 0]?.imageUrl ? (
              <AuthenticatedNotebookImage
                src={material.pages[page.background.materialPage || 0].imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-contain object-top"
              />
            ) : null}
          </div>
        ) : null}
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
      {titleEditing ? (
        <input
          autoFocus
          value={title}
          onChange={(event) => onTitleChange?.(event.target.value)}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === "Enter") onTitleCommit?.();
            if (event.key === "Escape") onTitleCommit?.();
          }}
          onBlur={onTitleCommit}
          className="mt-1 w-full rounded border border-emerald-400 px-1 py-0.5 text-xs font-medium text-slate-700 outline-none"
          aria-label="Page title"
        />
      ) : (
        <div className="mt-1 truncate text-xs font-medium text-slate-700">
          {page.pageIndex + 1}. {title || "Untitled page"}
        </div>
      )}
    </div>
  );
}
