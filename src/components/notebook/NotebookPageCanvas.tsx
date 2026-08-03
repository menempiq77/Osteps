"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
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
const TEXT_BOX_WIDTH = 300;

const cloneAnnotations = (items: NotebookAnnotation[]) =>
  items.map((item) =>
    item.type === "pen"
      ? { ...item, points: item.points.map((point) => ({ ...point })) }
      : { ...item }
  );

const smoothPath = (context: CanvasRenderingContext2D, points: Array<{ x: number; y: number }>) => {
  if (!points.length) return;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  if (points.length === 1) {
    context.arc(points[0].x, points[0].y, 1, 0, Math.PI * 2);
    return;
  }
  if (points.length === 2) {
    context.lineTo(points[1].x, points[1].y);
    return;
  }
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    context.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }
  const last = points[points.length - 1];
  context.lineTo(last.x, last.y);
};

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const output: string[] = [];
  text.split(/\r?\n/).forEach((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      output.push("");
      return;
    }
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && context.measureText(candidate).width > maxWidth) {
        output.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    output.push(line);
  });
  return output;
};

const drawText = (context: CanvasRenderingContext2D, annotation: NotebookTextAnnotation) => {
  context.save();
  context.font = `${annotation.fontWeight === "bold" ? "700" : "400"} ${annotation.fontSize}px Arial`;
  context.fillStyle = annotation.color;
  context.textBaseline = "top";
  const lines = wrapText(context, annotation.text, annotation.width);
  const lineHeight = annotation.fontSize * 1.22;
  lines.forEach((line, index) => {
    const lineWidth = context.measureText(line).width;
    const x =
      annotation.textAlign === "center"
        ? annotation.x + (annotation.width - lineWidth) / 2
        : annotation.textAlign === "right"
          ? annotation.x + annotation.width - lineWidth
          : annotation.x;
    const y = annotation.y + index * lineHeight;
    context.fillText(line, x, y);
    if (annotation.underline) {
      context.fillRect(x, y + annotation.fontSize + 2, lineWidth, Math.max(1, annotation.fontSize / 14));
    }
  });
  context.restore();
};

const drawPen = (context: CanvasRenderingContext2D, annotation: NotebookPenAnnotation) => {
  if (!annotation.points.length) return;
  context.save();
  context.strokeStyle = annotation.color;
  context.fillStyle = annotation.color;
  context.lineWidth = annotation.width;
  context.lineCap = "round";
  context.lineJoin = "round";
  if (annotation.tool === "highlighter") {
    context.globalAlpha = 0.3;
    context.globalCompositeOperation = "multiply";
  }
  if (annotation.points.length === 1) {
    context.beginPath();
    context.arc(annotation.points[0].x, annotation.points[0].y, Math.max(1, annotation.width / 2), 0, Math.PI * 2);
    context.fill();
  } else {
    smoothPath(context, annotation.points);
    context.stroke();
  }
  context.restore();
};

const textHitHeight = (annotation: NotebookTextAnnotation) =>
  Math.max(
    annotation.fontSize * 1.6,
    Math.ceil(annotation.text.length / Math.max(1, annotation.width / annotation.fontSize)) *
      annotation.fontSize *
      1.22
  );

export default function NotebookPageCanvas({
  background,
  annotations,
  displayAnnotations,
  readOnly = false,
  onChange,
}: Props) {
  const annotationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeStrokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
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
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const visibleAnnotations = displayAnnotations ?? annotations;
  const editingText = annotations.find(
    (annotation): annotation is NotebookTextAnnotation =>
      annotation.type === "text" && annotation.id === editingTextId
  );
  const pageDimensions = useMemo(
    () => ({ width: NOTEBOOK_PAGE_WIDTH * zoom, height: NOTEBOOK_PAGE_HEIGHT * zoom }),
    [zoom]
  );

  const remember = useCallback(() => {
    historyRef.current.push(cloneAnnotations(annotations));
    if (historyRef.current.length > 50) historyRef.current.shift();
    redoRef.current = [];
  }, [annotations]);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    setImageUrl(null);
    if (!background.imageUrl) return undefined;
    void fetch(background.imageUrl, { headers: getAuthHeader() })
      .then((response) => {
        if (!response.ok) throw new Error("Background image unavailable");
        return response.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setImageUrl(null);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [background.imageUrl]);

  const prepareCanvas = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return null;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(pageDimensions.width * ratio);
      canvas.height = Math.round(pageDimensions.height * ratio);
      canvas.style.width = `${pageDimensions.width}px`;
      canvas.style.height = `${pageDimensions.height}px`;
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.setTransform(ratio * zoom, 0, 0, ratio * zoom, 0, 0);
      context.clearRect(0, 0, NOTEBOOK_PAGE_WIDTH, NOTEBOOK_PAGE_HEIGHT);
      return context;
    },
    [pageDimensions.height, pageDimensions.width, zoom]
  );

  const redraw = useCallback(() => {
    const context = prepareCanvas(annotationCanvasRef.current);
    if (!context) return;
    visibleAnnotations.forEach((annotation) => {
      if (annotation.type === "pen") drawPen(context, annotation);
      else drawText(context, annotation);
    });
    prepareCanvas(activeStrokeCanvasRef.current);
  }, [prepareCanvas, visibleAnnotations]);

  useEffect(() => redraw(), [redraw]);

  const paintActiveStroke = useCallback(() => {
    const context = prepareCanvas(activeStrokeCanvasRef.current);
    if (context && drawingRef.current) drawPen(context, drawingRef.current);
  }, [prepareCanvas]);

  const pointFromEvent = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(NOTEBOOK_PAGE_WIDTH, ((event.clientX - rect.left) / rect.width) * NOTEBOOK_PAGE_WIDTH)),
      y: Math.max(0, Math.min(NOTEBOOK_PAGE_HEIGHT, ((event.clientY - rect.top) / rect.height) * NOTEBOOK_PAGE_HEIGHT)),
    };
  };

  const removeAnnotation = (id: string) => {
    remember();
    onChange(annotations.filter((annotation) => annotation.id !== id));
    setEditingTextId(null);
    setSelectedTextId(null);
  };

  const finishStroke = () => {
    if (drawingRef.current) {
      const stroke = drawingRef.current;
      drawingRef.current = null;
      if (stroke.points.length) {
        remember();
        onChange([...annotations, stroke]);
      }
    }
    prepareCanvas(activeStrokeCanvasRef.current);
    draggingRef.current = null;
  };

  const findTextAt = (point: { x: number; y: number }) =>
    [...annotations].reverse().find(
      (annotation): annotation is NotebookTextAnnotation =>
        annotation.type === "text" &&
        point.x >= annotation.x &&
        point.x <= annotation.x + annotation.width &&
        point.y >= annotation.y &&
        point.y <= annotation.y + textHitHeight(annotation)
    );

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    setSelectedTextId(null);
    if (tool === "cursor") {
      const selected = findTextAt(point);
      if (selected) {
        remember();
        setSelectedTextId(selected.id);
        draggingRef.current = { id: selected.id, offsetX: point.x - selected.x, offsetY: point.y - selected.y };
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
      paintActiveStroke();
    } else if (tool === "eraser") {
      const nearest = [...annotations].reverse().find((annotation) => {
        if (annotation.type === "pen") {
          return annotation.points.some(
            (candidate) => Math.hypot(candidate.x - point.x, candidate.y - point.y) < annotation.width + 14
          );
        }
        return point.x >= annotation.x && point.x <= annotation.x + annotation.width && point.y >= annotation.y && point.y <= annotation.y + textHitHeight(annotation);
      });
      if (nearest) removeAnnotation(nearest.id);
    } else if (tool === "text") {
      remember();
      const text: NotebookTextAnnotation = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: "text",
        x: point.x,
        y: point.y,
        width: TEXT_BOX_WIDTH,
        text: "",
        color,
        fontSize: textSize,
        fontWeight: bold ? "bold" : "normal",
        underline,
        textAlign,
      };
      onChange([...annotations, text]);
      setEditingTextId(text.id);
      setSelectedTextId(text.id);
    }
  };

  const onDoubleClick = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (readOnly || tool !== "cursor") return;
    const selected = findTextAt(pointFromEvent(event));
    if (selected) {
      setSelectedTextId(selected.id);
      setEditingTextId(selected.id);
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const point = pointFromEvent(event);
    if (drawingRef.current) {
      drawingRef.current.points.push(point);
      paintActiveStroke();
      return;
    }
    if (draggingRef.current) {
      const drag = draggingRef.current;
      onChange(
        annotations.map((annotation) =>
          annotation.id === drag.id && annotation.type === "text"
            ? { ...annotation, x: point.x - drag.offsetX, y: point.y - drag.offsetY }
            : annotation
        )
      );
    }
  };

  const undo = () => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    redoRef.current.push(cloneAnnotations(annotations));
    onChange(previous);
  };
  const redo = () => {
    const next = redoRef.current.pop();
    if (!next) return;
    historyRef.current.push(cloneAnnotations(annotations));
    onChange(next);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "TEXTAREA" || target?.tagName === "INPUT") return;
      if ((event.key === "Delete" || event.key === "Backspace") && selectedTextId) {
        event.preventDefault();
        removeAnnotation(selectedTextId);
        return;
      }
      if (!event.ctrlKey && !event.metaKey) return;
      const key = event.key.toLowerCase();
      if (key === "m") setTool("cursor");
      else if (key === "p") setTool("pen");
      else if (key === "h") setTool("highlighter");
      else if (key === "e") setTool("eraser");
      else if (key === "q") setTool("text");
      else if (key === "z") {
        event.preventDefault();
        event.shiftKey ? redo() : undo();
      } else if (key === "y") {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const toolButtons = useMemo(
    () =>
      [
        ["cursor", MousePointer2, "Cursor"],
        ["pen", PenTool, "Pen"],
        ["highlighter", Highlighter, "Highlighter"],
        ["eraser", Eraser, "Eraser"],
        ["text", Type, "Text"],
      ] as const,
    []
  );
  const textareaStyle = editingText
    ? {
        left: editingText.x * zoom,
        top: editingText.y * zoom,
        width: editingText.width * zoom,
        minHeight: editingText.fontSize * 2 * zoom,
        fontSize: editingText.fontSize * zoom,
        color: editingText.color,
        fontWeight: editingText.fontWeight,
        textDecoration: editingText.underline ? "underline" : "none",
        textAlign: editingText.textAlign,
      }
    : undefined;

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
          <select value={textSize} onChange={(event) => setTextSize(Number(event.target.value))} className="rounded border px-1 py-1 text-xs">{TEXT_SIZES.map((value) => <option key={value} value={value}>{value}px</option>)}</select>
          <button type="button" onClick={() => setBold((value) => !value)} className={`rounded px-2 py-1 text-xs font-bold ${bold ? "bg-emerald-100" : "hover:bg-slate-100"}`}>B</button>
          <button type="button" onClick={() => setUnderline((value) => !value)} className={`rounded px-2 py-1 text-xs underline ${underline ? "bg-emerald-100" : "hover:bg-slate-100"}`}>U</button>
          <select value={textAlign} onChange={(event) => setTextAlign(event.target.value as typeof textAlign)} className="rounded border px-1 py-1 text-xs"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
          <label className="ml-auto flex items-center gap-1 text-xs">Zoom <input type="range" min="0.5" max="1.5" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
        </div>
      )}
      <div className="overflow-auto rounded-xl bg-slate-200 p-4">
        <div className="relative mx-auto overflow-hidden bg-white shadow-xl" style={pageDimensions}>
          <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(to bottom, transparent 31px, rgba(148,163,184,.28) 32px)", backgroundSize: `100% ${32 * zoom}px` }} />
          {imageUrl && <img src={imageUrl} alt="" className="pointer-events-none absolute left-0 top-0 h-full w-full object-contain object-top" />}
          <canvas ref={annotationCanvasRef} className="pointer-events-none absolute left-0 top-0" />
          <canvas ref={activeStrokeCanvasRef} className="absolute left-0 top-0 touch-none" onPointerDown={onPointerDown} onDoubleClick={onDoubleClick} onPointerMove={onPointerMove} onPointerUp={finishStroke} onPointerCancel={finishStroke} />
          {editingText && <textarea autoFocus value={editingText.text} onChange={(event) => onChange(annotations.map((annotation) => annotation.id === editingText.id && annotation.type === "text" ? { ...annotation, text: event.target.value } : annotation))} onBlur={() => { if (!editingText.text.trim()) removeAnnotation(editingText.id); setEditingTextId(null); }} className="absolute z-20 resize-none overflow-hidden border border-emerald-400 bg-white/70 p-1 outline-none" style={textareaStyle} />}
        </div>
      </div>
    </div>
  );
}
