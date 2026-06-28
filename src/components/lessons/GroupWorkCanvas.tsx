"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type CanvasTool = "pen" | "highlighter" | "text" | "eraser";

type StrokePoint = { x: number; y: number };

type Stroke = {
  id: string;
  tool: "pen" | "highlighter";
  color: string;
  width: number;
  points: StrokePoint[];
};

type TextBox = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
};

type CanvasAnnotation = Stroke | TextBox;

const isStroke = (a: CanvasAnnotation): a is Stroke => "points" in a;

// ---------------------------------------------------------------------------
// Constants (matching assessment annotator style)
// ---------------------------------------------------------------------------
const COLOR_SWATCHES = [
  "#111827", "#dc2626", "#2563eb", "#16a34a",
  "#f59e0b", "#8b5cf6", "#ec4899", "#67e8f9",
] as const;

const PEN_WIDTHS = [2, 4, 6] as const;
const HIGHLIGHTER_WIDTHS = [10, 16, 24] as const;
const ERASER_RADIUS = 20;
const MIN_POINT_DISTANCE = 1.5;
const INITIAL_HEIGHT = 800;
const HEIGHT_STEP = 400;
const MAX_CANVAS_PIXEL_RATIO = 2;

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// ---------------------------------------------------------------------------
// Smooth path tracing (quadratic through midpoints — same as assessment)
// ---------------------------------------------------------------------------
const traceSmoothPath = (
  ctx: CanvasRenderingContext2D,
  points: StrokePoint[],
) => {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y);
    return;
  }
  for (let i = 1; i < points.length - 1; i++) {
    const cur = points[i];
    const nxt = points[i + 1];
    ctx.quadraticCurveTo(cur.x, cur.y, (cur.x + nxt.x) / 2, (cur.y + nxt.y) / 2);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
};

const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
  const pts = stroke.points;
  if (pts.length === 0) return;
  ctx.save();
  if (stroke.tool === "highlighter") {
    ctx.globalAlpha = 0.3;
    ctx.globalCompositeOperation = "multiply";
  }
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (pts.length === 1) {
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, Math.max(stroke.width / 2, 1), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  traceSmoothPath(ctx, pts);
  ctx.stroke();
  ctx.restore();
};

const drawTextBox = (ctx: CanvasRenderingContext2D, box: TextBox) => {
  if (!box.text.trim()) return;
  ctx.save();
  ctx.fillStyle = box.color;
  ctx.font = `${box.fontSize}px 'Georgia', 'Times New Roman', serif`;
  ctx.textBaseline = "top";
  const lines = box.text.split("\n");
  const lineHeight = box.fontSize * 1.3;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], box.x, box.y + i * lineHeight);
  }
  ctx.restore();
};

// ---------------------------------------------------------------------------
// Notebook background (ruled lines + margin)
// ---------------------------------------------------------------------------
const drawNotebookBg = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const lineSpacing = 32;

  // Horizontal ruled lines
  ctx.strokeStyle = "#fef3c7";
  ctx.lineWidth = 1;
  for (let y = lineSpacing; y < h; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Left margin line
  ctx.strokeStyle = "#fde68a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 0);
  ctx.lineTo(48, h);
  ctx.stroke();
};

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------
type GroupWorkCanvasProps = {
  disabled?: boolean;
  /** Called whenever annotations change; parent can use to track "has content" */
  onChange?: (hasContent: boolean) => void;
  /** Get serialised data for the parent to use with submit */
  dataRef?: React.MutableRefObject<() => string>;
};

// ---------------------------------------------------------------------------
// GroupWorkCanvas Component
// ---------------------------------------------------------------------------
export default function GroupWorkCanvas({ disabled, onChange, dataRef }: GroupWorkCanvasProps) {
  // --- state ---
  const [tool, setTool] = useState<CanvasTool>("pen");
  const [color, setColor] = useState("#111827");
  const [penWidth, setPenWidth] = useState<number>(4);
  const [highlighterWidth, setHighlighterWidth] = useState<number>(16);
  const [textFontSize, setTextFontSize] = useState(20);
  const [canvasHeight, setCanvasHeight] = useState(INITIAL_HEIGHT);
  const [annotations, setAnnotations] = useState<CanvasAnnotation[]>([]);
  const [undoStack, setUndoStack] = useState<CanvasAnnotation[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasAnnotation[][]>([]);
  const [activeStroke, setActiveStroke] = useState<Stroke | null>(null);
  const [editingTextBox, setEditingTextBox] = useState<TextBox | null>(null);
  const [textInputValue, setTextInputValue] = useState("");

  // --- refs ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const annotationsRef = useRef<CanvasAnnotation[]>([]);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const isDrawing = useRef(false);

  annotationsRef.current = annotations;

  // --- expose data getter to parent ---
  useEffect(() => {
    if (dataRef) {
      dataRef.current = () => {
        const finalAnnotations = [...annotationsRef.current];
        // Include any in-progress text box
        return JSON.stringify(finalAnnotations);
      };
    }
  }, [dataRef]);

  // Notify parent of content changes
  useEffect(() => {
    onChange?.(annotations.length > 0);
  }, [annotations, onChange]);

  // --- canvas dimensions ---
  const getCanvasWidth = useCallback(() => {
    return containerRef.current?.clientWidth ?? 900;
  }, []);

  // --- redraw main canvas ---
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width / (window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, MAX_CANVAS_PIXEL_RATIO) : 1);
    const h = canvas.height / (window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, MAX_CANVAS_PIXEL_RATIO) : 1);

    const dpr = window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, MAX_CANVAS_PIXEL_RATIO) : 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawNotebookBg(ctx, w, h);

    for (const ann of annotationsRef.current) {
      if (isStroke(ann)) {
        drawStroke(ctx, ann);
      } else {
        drawTextBox(ctx, ann);
      }
    }
  }, []);

  // --- redraw overlay (active stroke) ---
  const redrawOverlay = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, MAX_CANVAS_PIXEL_RATIO) : 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    const stroke = activeStrokeRef.current;
    if (stroke) {
      drawStroke(ctx, stroke);
    }
  }, []);

  // --- setup canvas sizing ---
  const setupCanvas = useCallback(() => {
    const main = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    const container = containerRef.current;
    if (!main || !overlay || !container) return;

    const w = container.clientWidth;
    const h = canvasHeight;
    const dpr = window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, MAX_CANVAS_PIXEL_RATIO) : 1;

    main.width = w * dpr;
    main.height = h * dpr;
    main.style.width = `${w}px`;
    main.style.height = `${h}px`;

    overlay.width = w * dpr;
    overlay.height = h * dpr;
    overlay.style.width = `${w}px`;
    overlay.style.height = `${h}px`;

    redrawCanvas();
  }, [canvasHeight, redrawCanvas]);

  useEffect(() => {
    setupCanvas();
  }, [setupCanvas]);

  useEffect(() => {
    const handleResize = () => setupCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setupCanvas]);

  // Redraw when annotations change
  useEffect(() => {
    redrawCanvas();
  }, [annotations, redrawCanvas]);

  // --- helper: get pointer position relative to canvas ---
  const getPoint = useCallback((e: React.PointerEvent<HTMLCanvasElement>): StrokePoint => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // --- undo / redo ---
  const pushUndo = useCallback((prev: CanvasAnnotation[]) => {
    setUndoStack((s) => [...s.slice(-49), prev]);
    setRedoStack([]);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack((s) => [...s, annotationsRef.current]);
    setUndoStack((s) => s.slice(0, -1));
    setAnnotations(prev);
  }, [undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((s) => [...s, annotationsRef.current]);
    setRedoStack((s) => s.slice(0, -1));
    setAnnotations(next);
  }, [redoStack]);

  // --- clear all ---
  const handleClear = useCallback(() => {
    if (annotationsRef.current.length === 0) return;
    pushUndo(annotationsRef.current);
    setAnnotations([]);
  }, [pushUndo]);

  // --- eraser logic ---
  const eraseAtPoint = useCallback((point: StrokePoint) => {
    const remaining = annotationsRef.current.filter((ann) => {
      if (isStroke(ann)) {
        // Check if any point in the stroke is within eraser radius
        return !ann.points.some(
          (p) => Math.hypot(p.x - point.x, p.y - point.y) < ERASER_RADIUS
        );
      } else {
        // Text box hit test
        const box = ann as TextBox;
        const textWidth = box.text.length * box.fontSize * 0.6;
        const textHeight = box.fontSize * 1.3 * (box.text.split("\n").length || 1);
        return !(
          point.x >= box.x - 10 &&
          point.x <= box.x + textWidth + 10 &&
          point.y >= box.y - 10 &&
          point.y <= box.y + textHeight + 10
        );
      }
    });
    if (remaining.length !== annotationsRef.current.length) {
      setAnnotations(remaining);
    }
  }, []);

  // --- commit text box that's being edited ---
  const commitTextBox = useCallback(() => {
    if (editingTextBox && textInputValue.trim()) {
      const box: TextBox = {
        ...editingTextBox,
        text: textInputValue,
      };
      pushUndo(annotationsRef.current);
      setAnnotations((prev) => [...prev, box]);
    }
    setEditingTextBox(null);
    setTextInputValue("");
  }, [editingTextBox, textInputValue, pushUndo]);

  // --- pointer handlers ---
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const point = getPoint(e);

    // Commit any active text box first
    if (editingTextBox) {
      commitTextBox();
    }

    if (tool === "text") {
      const newBox: TextBox = {
        id: makeId(),
        x: point.x,
        y: point.y,
        text: "",
        color,
        fontSize: textFontSize,
      };
      setEditingTextBox(newBox);
      setTextInputValue("");
      setTimeout(() => textInputRef.current?.focus(), 50);
      return;
    }

    if (tool === "eraser") {
      e.currentTarget.setPointerCapture(e.pointerId);
      isDrawing.current = true;
      pushUndo(annotationsRef.current);
      eraseAtPoint(point);
      return;
    }

    // pen or highlighter
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    const stroke: Stroke = {
      id: makeId(),
      tool: tool === "highlighter" ? "highlighter" : "pen",
      color,
      width: tool === "highlighter" ? highlighterWidth : penWidth,
      points: [point],
    };
    activeStrokeRef.current = stroke;
    setActiveStroke(stroke);
  }, [disabled, tool, color, penWidth, highlighterWidth, textFontSize, getPoint, editingTextBox, commitTextBox, pushUndo, eraseAtPoint]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || disabled) return;
    const point = getPoint(e);

    if (tool === "eraser") {
      eraseAtPoint(point);
      return;
    }

    const currentStroke = activeStrokeRef.current;
    if (!currentStroke) return;

    // Minimum distance between points for smooth drawing
    const lastPoint = currentStroke.points[currentStroke.points.length - 1];
    if (Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) < MIN_POINT_DISTANCE) return;

    const updated = { ...currentStroke, points: [...currentStroke.points, point] };
    activeStrokeRef.current = updated;
    setActiveStroke(updated);
    redrawOverlay();
  }, [disabled, tool, getPoint, eraseAtPoint, redrawOverlay]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (tool === "eraser") return;

    const completedStroke = activeStrokeRef.current;
    activeStrokeRef.current = null;
    setActiveStroke(null);

    if (completedStroke && completedStroke.points.length > 0) {
      pushUndo(annotationsRef.current);
      setAnnotations((prev) => [...prev, completedStroke]);
    }

    // Clear overlay
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext("2d");
      if (ctx) {
        const dpr = window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, MAX_CANVAS_PIXEL_RATIO) : 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, overlay.width / dpr, overlay.height / dpr);
      }
    }
  }, [tool, pushUndo]);

  // --- keyboard shortcuts ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [disabled, handleUndo, handleRedo]);

  // --- expand page ---
  const handleExpand = () => {
    setCanvasHeight((h) => h + HEIGHT_STEP);
  };

  // active stroke width options
  const strokeWidths = tool === "highlighter" ? HIGHLIGHTER_WIDTHS : PEN_WIDTHS;
  const activeWidth = tool === "highlighter" ? highlighterWidth : penWidth;

  const toolButtons: { value: CanvasTool; icon: string; label: string }[] = [
    { value: "pen", icon: "✏️", label: "Pen" },
    { value: "highlighter", icon: "🖍️", label: "Highlighter" },
    { value: "text", icon: "🔤", label: "Text" },
    { value: "eraser", icon: "🧹", label: "Eraser" },
  ];

  const getCursorStyle = () => {
    if (disabled) return "not-allowed";
    if (tool === "pen") return "crosshair";
    if (tool === "highlighter") return "crosshair";
    if (tool === "text") return "text";
    if (tool === "eraser") return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${ERASER_RADIUS * 2}' height='${ERASER_RADIUS * 2}'%3E%3Ccircle cx='${ERASER_RADIUS}' cy='${ERASER_RADIUS}' r='${ERASER_RADIUS - 1}' fill='none' stroke='%23999' stroke-width='2' stroke-dasharray='4,3'/%3E%3C/svg%3E") ${ERASER_RADIUS} ${ERASER_RADIUS}, crosshair`;
    return "default";
  };

  return (
    <div className="rounded-xl border-2 border-slate-300 bg-white shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-slate-200 bg-slate-50 px-3 py-2">
        {/* Tool buttons */}
        <div className="flex h-9 items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {toolButtons.map((t) => (
            <button
              key={t.value}
              type="button"
              title={t.label}
              disabled={disabled}
              onClick={() => {
                if (editingTextBox) commitTextBox();
                setTool(t.value);
              }}
              className={
                "flex h-7 w-8 items-center justify-center rounded-lg border text-sm transition-all " +
                (tool === t.value
                  ? "border-blue-400 bg-blue-50 shadow-sm"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-100") +
                (disabled ? " opacity-50 cursor-not-allowed" : " cursor-pointer")
              }
            >
              {t.icon}
            </button>
          ))}
        </div>

        {/* Color swatches */}
        <div className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 shadow-sm">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              disabled={disabled}
              onClick={() => setColor(c)}
              className={
                "h-[20px] w-[20px] rounded-full border-2 transition-all " +
                (color === c ? "border-slate-600 scale-110 shadow" : "border-white/80 hover:scale-105") +
                (disabled ? " opacity-50 cursor-not-allowed" : " cursor-pointer")
              }
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Stroke widths */}
        <div className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 shadow-sm">
          {strokeWidths.map((w) => (
            <button
              key={w}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (tool === "highlighter") setHighlighterWidth(w);
                else setPenWidth(w);
              }}
              className={
                "flex h-7 w-7 items-center justify-center rounded-lg border transition-all " +
                (activeWidth === w
                  ? "border-blue-400 bg-blue-50 shadow-sm"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-100") +
                (disabled ? " opacity-50 cursor-not-allowed" : " cursor-pointer")
              }
            >
              <span
                className="rounded-full bg-slate-800"
                style={{ width: 14, height: Math.min(w, 8) }}
              />
            </button>
          ))}
        </div>

        {/* Text size (when text tool active) */}
        {tool === "text" && (
          <div className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 mr-1">Size</span>
            {[14, 20, 28, 36].map((s) => (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={() => setTextFontSize(s)}
                className={
                  "flex h-7 items-center justify-center rounded-lg border px-1.5 text-xs font-bold transition-all " +
                  (textFontSize === s
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-100")
                }
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Undo / Redo */}
        <div className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-1 shadow-sm">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={disabled || undoStack.length === 0}
            onClick={handleUndo}
            className={
              "flex h-7 w-7 items-center justify-center rounded-lg transition-all " +
              (undoStack.length > 0 && !disabled
                ? "text-slate-700 hover:bg-slate-100 cursor-pointer"
                : "text-slate-300 cursor-not-allowed")
            }
          >
            ↩️
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            disabled={disabled || redoStack.length === 0}
            onClick={handleRedo}
            className={
              "flex h-7 w-7 items-center justify-center rounded-lg transition-all " +
              (redoStack.length > 0 && !disabled
                ? "text-slate-700 hover:bg-slate-100 cursor-pointer"
                : "text-slate-300 cursor-not-allowed")
            }
          >
            ↪️
          </button>
        </div>

        {/* Clear all */}
        <button
          type="button"
          title="Clear all"
          disabled={disabled || annotations.length === 0}
          onClick={handleClear}
          className={
            "flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 shadow-sm text-xs font-bold transition-all " +
            (annotations.length > 0 && !disabled
              ? "text-red-500 hover:bg-red-50 hover:border-red-200 cursor-pointer"
              : "text-slate-300 cursor-not-allowed")
          }
        >
          🗑️ Clear
        </button>

        {/* Expand page */}
        <button
          type="button"
          title="Add more space"
          disabled={disabled}
          onClick={handleExpand}
          className={
            "flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 shadow-sm text-xs font-bold transition-all " +
            (disabled
              ? "text-slate-300 cursor-not-allowed"
              : "text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer")
          }
        >
          📄 Expand page
        </button>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative w-full overflow-auto"
        style={{ maxHeight: "75vh" }}
      >
        {/* Main canvas (committed annotations) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ touchAction: "none" }}
        />
        {/* Overlay canvas (active stroke being drawn) */}
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0"
          style={{
            touchAction: "none",
            cursor: getCursorStyle(),
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        {/* Text input overlay */}
        {editingTextBox && (
          <textarea
            ref={textInputRef}
            value={textInputValue}
            onChange={(e) => setTextInputValue(e.target.value)}
            onBlur={commitTextBox}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditingTextBox(null);
                setTextInputValue("");
              }
            }}
            className="absolute border-2 border-blue-400 bg-white/90 rounded px-1 py-0.5 outline-none resize"
            style={{
              left: editingTextBox.x,
              top: editingTextBox.y,
              color: editingTextBox.color,
              fontSize: editingTextBox.fontSize,
              fontFamily: "'Georgia', 'Times New Roman', serif",
              lineHeight: `${editingTextBox.fontSize * 1.3}px`,
              minWidth: 120,
              minHeight: editingTextBox.fontSize * 1.5,
              zIndex: 10,
            }}
            placeholder="Type here..."
            autoFocus
          />
        )}

        {/* Spacer to give the container actual height for scrolling */}
        <div style={{ width: "100%", height: canvasHeight, pointerEvents: "none" }} />
      </div>
    </div>
  );
}
