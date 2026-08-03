"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAuthHeader } from "@/lib/apiClient";
import {
  Eraser,
  Highlighter,
  MousePointer2,
  PenTool,
  Redo2,
  Type,
  Undo2,
} from "lucide-react";
import {
  NOTEBOOK_PAGE_HEIGHT,
  NOTEBOOK_PAGE_WIDTH,
  type NotebookAnnotation,
  type NotebookBackground,
  type NotebookPenAnnotation,
  type NotebookTextAnnotation,
} from "@/lib/classNotebook";

type Tool = "cursor" | "pen" | "highlighter" | "text" | "eraser";

type Props = {
  background: NotebookBackground;
  annotations: NotebookAnnotation[];
  displayAnnotations?: NotebookAnnotation[];
  readOnly?: boolean;
  onChange: (annotations: NotebookAnnotation[]) => void;
};

const COLORS = ["#111827", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#8b5cf6", "#ffffff"];
const PEN_WIDTHS = [2, 4, 6, 8];
const HIGHLIGHT_WIDTHS = [10, 16, 24];
const TEXT_SIZES = [14, 18, 24, 36];

const smoothPath = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y);
    return;
  }
  for (let i = 1; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
};

const drawText = (ctx: CanvasRenderingContext2D, annotation: NotebookTextAnnotation) => {
  ctx.save();
  ctx.font = `${annotation.fontWeight === "bold" ? "700" : "400"} ${annotation.fontSize}px Arial`;
  ctx.fillStyle = annotation.color;
  ctx.textBaseline = "top";
  const lines = annotation.text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const width = ctx.measureText(line).width;
    const x =
      annotation.textAlign === "center"
        ? annotation.x + (annotation.width - width) / 2
        : annotation.textAlign === "right"
          ? annotation.x + annotation.width - width
          : annotation.x;
    const y = annotation.y + index * annotation.fontSize * 1.22;
    ctx.fillText(line, x, y);
    if (annotation.underline) {
      ctx.fillRect(x, y + annotation.fontSize + 2, width, Math.max(1, annotation.fontSize / 14));
    }
  });
  ctx.restore();
};

export default function NotebookPageCanvas({
  background,
  annotations,
  displayAnnotations,
  readOnly = false,
  onChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const drawingRef = useRef<NotebookPenAnnotation | null>(null);
  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const historyRef = useRef<NotebookAnnotation[][]>([]);
  const redoRef = useRef<NotebookAnnotation[][]>([]);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#111827");
  const [penWidth, setPenWidth] = useState(4);
  const [highlighterWidth, setHighlighterWidth] = useState(16);
  const [textSize, setTextSize] = useState(24);
  const [bold, setBold] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      const key = event.key.toLowerCase();
      if (key === "m") setTool("cursor");
      else if (key === "p") setTool("pen");
      else if (key === "h") setTool("highlighter");
      else if (key === "e") setTool("eraser");
      else if (key === "q") setTool("text");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const remember = () => {
    historyRef.current.push(annotations.map((item) => (item.type === "pen" ? { ...item, points: item.points.map((p) => ({ ...p })) } : { ...item })));
    if (historyRef.current.length > 50) historyRef.current.shift();
    redoRef.current = [];
  };

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(NOTEBOOK_PAGE_WIDTH, ((event.clientX - rect.left) / rect.width) * NOTEBOOK_PAGE_WIDTH)),
      y: Math.max(0, Math.min(NOTEBOOK_PAGE_HEIGHT, ((event.clientY - rect.top) / rect.height) * NOTEBOOK_PAGE_HEIGHT)),
    };
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = NOTEBOOK_PAGE_WIDTH * zoom;
    const height = NOTEBOOK_PAGE_HEIGHT * zoom;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const visibleAnnotations = displayAnnotations ?? annotations;
    ctx.setTransform(ratio * zoom, 0, 0, ratio * zoom, 0, 0);
    ctx.clearRect(0, 0, NOTEBOOK_PAGE_WIDTH, NOTEBOOK_PAGE_HEIGHT);
    if (background.imageUrl) {
      const image = new Image();
      image.onload = () => {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.drawImage(image, 0, 0, NOTEBOOK_PAGE_WIDTH, NOTEBOOK_PAGE_HEIGHT);
        visibleAnnotations.forEach((annotation) => {
          if (annotation.type === "pen") {
            if (!annotation.points.length) return;
            ctx.save();
            ctx.strokeStyle = annotation.color;
            ctx.fillStyle = annotation.color;
            ctx.lineWidth = annotation.width;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            if (annotation.tool === "highlighter") {
              ctx.globalAlpha = 0.3;
              ctx.globalCompositeOperation = "multiply";
            }
            if (annotation.points.length === 1) {
              ctx.beginPath();
              ctx.arc(annotation.points[0].x, annotation.points[0].y, annotation.width / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              smoothPath(ctx, annotation.points);
              ctx.stroke();
            }
            ctx.restore();
          } else drawText(ctx, annotation);
        });
        ctx.restore();
      };
      void fetch(background.imageUrl, { headers: getAuthHeader() })
        .then((response) => response.blob())
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          image.src = objectUrl;
        })
        .catch(() => undefined);
    } else {
      visibleAnnotations.forEach((annotation) => {
        if (annotation.type === "pen") {
          if (!annotation.points.length) return;
          ctx.save();
          ctx.strokeStyle = annotation.color;
          ctx.fillStyle = annotation.color;
          ctx.lineWidth = annotation.width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          if (annotation.tool === "highlighter") {
            ctx.globalAlpha = 0.3;
            ctx.globalCompositeOperation = "multiply";
          }
          if (annotation.points.length === 1) {
            ctx.beginPath();
            ctx.arc(annotation.points[0].x, annotation.points[0].y, annotation.width / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            smoothPath(ctx, annotation.points);
            ctx.stroke();
          }
          ctx.restore();
        } else drawText(ctx, annotation);
      });
    }
  };

  useEffect(() => redraw(), [annotations, displayAnnotations, background.imageUrl, zoom]);

  const finishStroke = () => {
    if (!drawingRef.current) {
      draggingRef.current = null;
      return;
    }
    const stroke = drawingRef.current;
    drawingRef.current = null;
    if (stroke.points.length > 0) {
      remember();
      onChange([...annotations, stroke]);
    }
    draggingRef.current = null;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    if (tool === "cursor") {
      const selected = [...annotations].reverse().find(
        (annotation) =>
          annotation.type === "text" &&
          point.x >= annotation.x &&
          point.x <= annotation.x + annotation.width &&
          point.y >= annotation.y &&
          point.y <= annotation.y + annotation.fontSize * 2
      );
      if (selected?.type === "text") {
        draggingRef.current = {
          id: selected.id,
          offsetX: point.x - selected.x,
          offsetY: point.y - selected.y,
        };
      }
    } else if (tool === "pen" || tool === "highlighter") {
      drawingRef.current = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: "pen",
        tool,
        color,
        width: tool === "highlighter" ? highlighterWidth : penWidth,
        points: [point],
      };
    } else if (tool === "eraser") {
      const nearest = [...annotations].reverse().find((annotation) =>
        annotation.type === "pen" && annotation.points.some((p) => Math.hypot(p.x - point.x, p.y - point.y) < annotation.width + 14)
      );
      if (nearest) {
        remember();
        onChange(annotations.filter((annotation) => annotation.id !== nearest.id));
      }
    } else if (tool === "text") {
      const value = window.prompt("Text");
      if (value?.trim()) {
        remember();
        onChange([
          ...annotations,
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type: "text",
            x: point.x,
            y: point.y,
            width: 300,
            text: value.trim(),
            color,
            fontSize: textSize,
            fontWeight: bold ? "bold" : "normal",
            underline,
            textAlign,
          },
        ]);
      }
    }
  };

  const undo = () => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    redoRef.current.push(annotations);
    onChange(previous);
  };
  const redo = () => {
    const next = redoRef.current.pop();
    if (!next) return;
    historyRef.current.push(annotations);
    onChange(next);
  };

  const toolButtons = useMemo(() => [
    ["cursor", MousePointer2, "Cursor"],
    ["pen", PenTool, "Pen"],
    ["highlighter", Highlighter, "Highlighter"],
    ["eraser", Eraser, "Eraser"],
    ["text", Type, "Text"],
  ] as const, []);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-white p-2 shadow-sm">
          {toolButtons.map(([value, Icon, label]) => (
            <button key={value} type="button" title={label} onClick={() => setTool(value)} className={`rounded-lg p-2 ${tool === value ? "bg-emerald-100 text-emerald-700" : "hover:bg-slate-100"}`}>
              <Icon className="h-4 w-4" />
            </button>
          ))}
          <button type="button" onClick={undo} title="Undo" className="rounded-lg p-2 hover:bg-slate-100"><Undo2 className="h-4 w-4" /></button>
          <button type="button" onClick={redo} title="Redo" className="rounded-lg p-2 hover:bg-slate-100"><Redo2 className="h-4 w-4" /></button>
          <div className="flex items-center gap-1">{COLORS.map((entry) => <button key={entry} type="button" aria-label={entry} onClick={() => setColor(entry)} className={`h-5 w-5 rounded-full border ${color === entry ? "ring-2 ring-emerald-500 ring-offset-1" : ""}`} style={{ backgroundColor: entry }} />)}</div>
          <select value={tool === "highlighter" ? highlighterWidth : penWidth} onChange={(event) => tool === "highlighter" ? setHighlighterWidth(Number(event.target.value)) : setPenWidth(Number(event.target.value))} className="rounded border px-1 py-1 text-xs">
            {(tool === "highlighter" ? HIGHLIGHT_WIDTHS : PEN_WIDTHS).map((value) => <option key={value} value={value}>{value}px</option>)}
          </select>
          <select value={textSize} onChange={(event) => setTextSize(Number(event.target.value))} className="rounded border px-1 py-1 text-xs">
            {TEXT_SIZES.map((value) => <option key={value} value={value}>{value}px</option>)}
          </select>
          <button type="button" onClick={() => setBold((value) => !value)} className={`rounded px-2 py-1 text-xs font-bold ${bold ? "bg-emerald-100" : "hover:bg-slate-100"}`}>B</button>
          <button type="button" onClick={() => setUnderline((value) => !value)} className={`rounded px-2 py-1 text-xs underline ${underline ? "bg-emerald-100" : "hover:bg-slate-100"}`}>U</button>
          <select value={textAlign} onChange={(event) => setTextAlign(event.target.value as typeof textAlign)} className="rounded border px-1 py-1 text-xs">
            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
          </select>
          <label className="ml-auto flex items-center gap-1 text-xs">Zoom <input type="range" min="0.5" max="1.5" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
        </div>
      )}
      <div ref={wrapperRef} className="overflow-auto rounded-xl bg-slate-200 p-4">
        <div className="relative mx-auto bg-white shadow-xl" style={{ width: NOTEBOOK_PAGE_WIDTH * zoom, height: NOTEBOOK_PAGE_HEIGHT * zoom }}>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-8 pt-7 text-center text-2xl font-black text-slate-900">
            {background.text || ""}
          </div>
          <canvas ref={canvasRef} onPointerDown={onPointerDown} onPointerMove={(event) => {
            const point = pointFromEvent(event);
            if (drawingRef.current) drawingRef.current.points.push(point);
            else if (draggingRef.current) {
              const drag = draggingRef.current;
              const next = annotations.map((annotation) =>
                annotation.id === drag.id && annotation.type === "text"
                  ? { ...annotation, x: point.x - drag.offsetX, y: point.y - drag.offsetY }
                  : annotation
              );
              onChange(next);
            }
          }} onPointerUp={finishStroke} onPointerCancel={finishStroke} className="touch-none" />
        </div>
      </div>
    </div>
  );
}
