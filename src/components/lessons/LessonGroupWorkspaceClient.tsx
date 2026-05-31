"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eraser,
  Highlighter,
  ImagePlus,
  Minus,
  MousePointer2,
  PenTool,
  Plus,
  Redo2,
  Save,
  Type,
  Undo2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LessonSection } from "./LessonCourseStepper";

type GroupTask = NonNullable<NonNullable<LessonSection["groupTasks"]>["groups"]>[number];

type Point = {
  x: number;
  y: number;
};

type StrokeTool = "pen" | "highlighter";
type WorkspaceMode = "select" | "text" | StrokeTool | "eraser";

type InkStroke = {
  id: string;
  tool?: StrokeTool;
  color: string;
  width: number;
  points: Point[];
};

type PastedImage = {
  id: string;
  name: string;
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type TextNote = {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  bold: boolean;
  highlighted: boolean;
  highlightColor: string;
  width: number;
  height: number;
};

type WorkspaceState = {
  mode: WorkspaceMode;
  writing: string;
  strokes: InkStroke[];
  pastedImages: PastedImage[];
  notes: TextNote[];
  pageColor: string;
  showLines: boolean;
  pageCount: number;
};

type DragTarget =
  | { kind: "note"; id: string; offsetX: number; offsetY: number }
  | { kind: "image"; id: string; offsetX: number; offsetY: number }
  | {
      kind: "image-resize";
      id: string;
      direction: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
      startClientX: number;
      startClientY: number;
      startX: number;
      startY: number;
      startWidth: number;
      startHeight: number;
    }
  | null;

type Props = {
  lessonSlug: string;
  lessonTitle: string;
  sectionTitle: string;
  baseLessonPath: string;
  group: GroupTask;
};

const EMPTY_WORKSPACE: WorkspaceState = {
  mode: "pen",
  writing: "",
  strokes: [],
  pastedImages: [],
  notes: [],
  pageColor: "#ffffff",
  showLines: false,
  pageCount: 1,
};

const PEN_COLOR = "#1f2937";
const PEN_WIDTH = 2.5;
const HIGHLIGHTER_COLOR = "#fde047";
const HIGHLIGHTER_WIDTH = 16;
const ERASER_RADIUS = 20;
const PAGE_HEIGHT = 960;
const PAGE_GAP = 24;
const MAX_PAGE_COUNT = 12;

const COLOR_SWATCHES = [
  { value: "#bdbdbd", label: "Gray" },
  { value: "#e26cb5", label: "Pink" },
  { value: "#f59a45", label: "Orange" },
  { value: "#fde45c", label: "Yellow" },
  { value: "#a9e34b", label: "Green" },
  { value: "#79dbe8", label: "Cyan" },
  { value: "#9077e8", label: "Purple" },
  { value: "#e94a42", label: "Red" },
  { value: "#ffffff", label: "White" },
  { value: "#111827", label: "Black" },
] as const;

const PEN_WIDTH_OPTIONS = [2.5, 4, 6, 8] as const;
const HIGHLIGHTER_WIDTH_OPTIONS = [10, 16, 24] as const;

const TOOL_BUTTONS: Array<{ value: WorkspaceMode; label: string; Icon: LucideIcon }> = [
  { value: "select", label: "Cursor", Icon: MousePointer2 },
  { value: "pen", label: "Pen", Icon: PenTool },
  { value: "highlighter", label: "Highlighter", Icon: Highlighter },
  { value: "eraser", label: "Eraser", Icon: Eraser },
  { value: "text", label: "Text", Icon: Type },
];

function isStrokeMode(mode: WorkspaceMode): mode is StrokeTool {
  return mode === "pen" || mode === "highlighter";
}

function isObjectMode(mode: WorkspaceMode) {
  return mode === "select" || mode === "text";
}

function workspaceKey(lessonSlug: string, groupSlug: string) {
  return `lesson_group_workspace_v3:${lessonSlug}:${groupSlug}`;
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function getText(value: string | { en: string; ar: string }) {
  if (typeof value === "string") return value;
  return value.en;
}

function pathFromPoints(points: Point[]) {
  if (!points.length) return "";
  if (points.length === 1) {
    const point = points[0];
    return `M ${point.x} ${point.y} L ${point.x + 0.01} ${point.y + 0.01}`;
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeImageRect(
  x: number,
  y: number,
  width: number,
  height: number,
  workspaceWidth: number,
  workspaceHeight: number
) {
  const minWidth = 80;
  const minHeight = 56;
  const maxWidth = Math.max(minWidth, workspaceWidth - 8);
  const maxHeight = Math.max(minHeight, workspaceHeight - 8);

  const nextWidth = clamp(width, minWidth, maxWidth);
  const nextHeight = clamp(height, minHeight, maxHeight);
  const nextX = clamp(x, 4, Math.max(4, workspaceWidth - nextWidth - 4));
  const nextY = clamp(y, 4, Math.max(4, workspaceHeight - nextHeight - 4));

  return { x: nextX, y: nextY, width: nextWidth, height: nextHeight };
}

function getResizeDirectionFromPoint(localX: number, localY: number, width: number, height: number) {
  const centerPadX = width * 0.25;
  const centerPadY = height * 0.25;
  const isCenterZone =
    localX > centerPadX &&
    localX < width - centerPadX &&
    localY > centerPadY &&
    localY < height - centerPadY;

  if (isCenterZone) return null;

  const horizontal = localX < width * 0.35 ? "w" : localX > width * 0.65 ? "e" : "";
  const vertical = localY < height * 0.35 ? "n" : localY > height * 0.65 ? "s" : "";

  if (vertical && horizontal) {
    return `${vertical}${horizontal}` as "ne" | "nw" | "se" | "sw";
  }
  if (vertical) return vertical as "n" | "s";
  if (horizontal) return horizontal as "e" | "w";
  return null;
}

function resizeCursor(direction: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null) {
  switch (direction) {
    case "n":
      return "n-resize";
    case "s":
      return "s-resize";
    case "e":
      return "e-resize";
    case "w":
      return "w-resize";
    case "ne":
      return "ne-resize";
    case "nw":
      return "nw-resize";
    case "se":
      return "se-resize";
    case "sw":
      return "sw-resize";
    default:
      return "move";
  }
}

function computeNoteSize(text: string, fontSize: number, bold: boolean) {
  const lines = (text || " ").split("\n");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return { width: 180, height: 44 };
  }

  context.font = `${bold ? 700 : 400} ${fontSize}px Calibri, Arial, sans-serif`;
  const widestLine = Math.max(
    ...lines.map((line) => context.measureText(line.length > 0 ? line : " ").width)
  );

  const paddingX = 10;
  const paddingY = 8;
  const lineHeight = fontSize * 1.35;
  const width = clamp(Math.ceil(widestLine + paddingX * 2), 120, 680);
  const height = clamp(Math.ceil(lines.length * lineHeight + paddingY * 2), 38, 500);

  return { width, height };
}

function distanceToSegment(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);

  const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
}

function strokeTouchesEraser(stroke: InkStroke, point: Point) {
  const radius = ERASER_RADIUS + stroke.width / 2;
  if (stroke.points.some((entry) => Math.hypot(entry.x - point.x, entry.y - point.y) <= radius)) return true;

  for (let index = 1; index < stroke.points.length; index += 1) {
    if (distanceToSegment(point, stroke.points[index - 1], stroke.points[index]) <= radius) return true;
  }

  return false;
}

function noteTouchesEraser(note: TextNote, point: Point) {
  const padding = ERASER_RADIUS;
  return (
    point.x >= note.x - padding &&
    point.x <= note.x + note.width + padding &&
    point.y >= note.y - padding &&
    point.y <= note.y + note.height + padding
  );
}

function cloneWorkspaceState(value: WorkspaceState): WorkspaceState {
  return JSON.parse(JSON.stringify(value)) as WorkspaceState;
}

export default function LessonGroupWorkspaceClient({
  lessonSlug,
  lessonTitle: _lessonTitle,
  sectionTitle: _sectionTitle,
  baseLessonPath: _baseLessonPath,
  group,
}: Props) {
  const storageKey = useMemo(() => workspaceKey(lessonSlug, group.slug), [lessonSlug, group.slug]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pendingPageScrollRef = useRef(false);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const erasingRef = useRef(false);
  const activeStrokeRef = useRef<InkStroke | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceState>(EMPTY_WORKSPACE);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [activeStroke, setActiveStroke] = useState<InkStroke | null>(null);
  const [dragTarget, setDragTarget] = useState<DragTarget>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<WorkspaceState[]>([]);
  const [redoStack, setRedoStack] = useState<WorkspaceState[]>([]);
  const [penColor, setPenColor] = useState(PEN_COLOR);
  const [highlighterColor, setHighlighterColor] = useState(HIGHLIGHTER_COLOR);
  const [penWidth, setPenWidth] = useState(PEN_WIDTH);
  const [highlighterWidth, setHighlighterWidth] = useState(HIGHLIGHTER_WIDTH);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  useEffect(() => {
    if (workspace.mode !== "text" || !activeNoteId) return;
    const frameId = window.requestAnimationFrame(() => {
      const textareas = Array.from(
        workspaceRef.current?.querySelectorAll<HTMLTextAreaElement>("textarea[data-note-input-id]") ?? []
      );
      const activeTextarea = textareas.find((element) => element.dataset.noteInputId === activeNoteId);
      activeTextarea?.focus();
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [activeNoteId, workspace.mode, workspace.notes.length]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
      const parsedPastedImages: PastedImage[] = Array.isArray(parsed.pastedImages)
        ? parsed.pastedImages
            .map((item) => {
              if (
                !item ||
                typeof item.id !== "string" ||
                typeof item.dataUrl !== "string" ||
                typeof item.name !== "string" ||
                typeof item.x !== "number" ||
                typeof item.y !== "number"
              ) {
                return null;
              }

              return {
                id: item.id,
                dataUrl: item.dataUrl,
                name: item.name,
                x: item.x,
                y: item.y,
                width: typeof item.width === "number" ? item.width : 176,
                height: typeof item.height === "number" ? item.height : 96,
              } as PastedImage;
            })
            .filter((item): item is PastedImage => item !== null)
        : [];

      const parsedNotes: TextNote[] = Array.isArray(parsed.notes)
        ? parsed.notes
            .map((item) => {
              if (
                !item ||
                typeof item.id !== "string" ||
                typeof item.text !== "string" ||
                typeof item.x !== "number" ||
                typeof item.y !== "number"
              ) {
                return null;
              }

              return {
                id: item.id,
                text: item.text,
                x: item.x,
                y: item.y,
                fontSize: typeof item.fontSize === "number" ? item.fontSize : 22,
                color: typeof item.color === "string" ? item.color : "#334155",
                bold: typeof item.bold === "boolean" ? item.bold : false,
                highlighted: typeof item.highlighted === "boolean" ? item.highlighted : false,
                highlightColor: typeof item.highlightColor === "string" ? item.highlightColor : "#fff59d",
                width: typeof item.width === "number" ? item.width : 180,
                height: typeof item.height === "number" ? item.height : 44,
              } as TextNote;
            })
            .filter((item): item is TextNote => item !== null)
        : [];

      const parsedStrokes: InkStroke[] = Array.isArray(parsed.strokes)
        ? parsed.strokes
            .map((item) => {
              if (!item || typeof item.id !== "string" || !Array.isArray(item.points)) return null;
              const points = item.points.filter(
                (point): point is Point =>
                  point != null && typeof point.x === "number" && typeof point.y === "number"
              );
              if (!points.length) return null;

              return {
                id: item.id,
                tool: item.tool === "highlighter" ? "highlighter" : "pen",
                color: typeof item.color === "string" ? item.color : PEN_COLOR,
                width: typeof item.width === "number" ? item.width : PEN_WIDTH,
                points,
              } as InkStroke;
            })
            .filter((item): item is InkStroke => item !== null)
        : [];

      setWorkspace({
        mode:
          parsed.mode === "select" ||
          parsed.mode === "text" ||
          parsed.mode === "pen" ||
          parsed.mode === "highlighter" ||
          parsed.mode === "eraser"
            ? parsed.mode
            : EMPTY_WORKSPACE.mode,
        writing: parsed.writing ?? "",
        strokes: parsedStrokes,
        pastedImages: parsedPastedImages,
        notes: parsedNotes,
        pageColor: typeof parsed.pageColor === "string" ? parsed.pageColor : "#ffffff",
        showLines: typeof parsed.showLines === "boolean" ? parsed.showLines : false,
        pageCount:
          typeof parsed.pageCount === "number" && Number.isFinite(parsed.pageCount)
            ? clamp(Math.floor(parsed.pageCount), 1, MAX_PAGE_COUNT)
            : EMPTY_WORKSPACE.pageCount,
      });
    } catch {
      setWorkspace(EMPTY_WORKSPACE);
    }
  }, [storageKey]);

  function addImageFromFile(file: File) {
    setUndoStack((current) => [...current.slice(-49), cloneWorkspaceState(workspace)]);
    setRedoStack([]);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      setWorkspace((current) => ({
        ...current,
        pastedImages: [
          ...current.pastedImages,
          {
            id: createId("img"),
            name: file.name || "Image",
            dataUrl,
            x: 24 + ((current.pastedImages.length * 24) % 280),
            y: 24 + ((current.pastedImages.length * 24) % 220),
            width: 176,
            height: 96,
          },
        ],
      }));
    };
    reader.readAsDataURL(file);
  }

  function onPickImage() {
    fileInputRef.current?.click();
  }

  function onImageInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    addImageFromFile(file);
    event.target.value = "";
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(workspace));
      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      // ignore storage errors
    }
  }, [storageKey, workspace]);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      if (!workspaceRef.current) return;
      const items = Array.from(event.clipboardData?.items ?? []);
      const imageItem = items.find((item) => item.type.startsWith("image/"));

      if (imageItem) {
        const file = imageItem.getAsFile();
        if (!file) return;
        addImageFromFile(file);
        event.preventDefault();
        return;
      }

      const active = document.activeElement;
      const isTypingIntoInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        Boolean(active?.getAttribute("contenteditable"));
      if (isTypingIntoInput && workspace.mode === "text") return;
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [workspace.mode]);

  function removePastedImage(id: string) {
    setUndoStack((current) => [...current.slice(-49), cloneWorkspaceState(workspace)]);
    setRedoStack([]);
    setWorkspace((current) => ({
      ...current,
      pastedImages: current.pastedImages.filter((item) => item.id !== id),
    }));
    if (activeImageId === id) {
      setActiveImageId(null);
    }
  }

  function updateNote(id: string, updater: (current: TextNote) => TextNote) {
    setWorkspace((current) => ({
      ...current,
      notes: current.notes.map((note) => (note.id === id ? updater(note) : note)),
    }));
  }

  function addNoteAt(x: number, y: number) {
    setUndoStack((current) => [...current.slice(-49), cloneWorkspaceState(workspace)]);
    setRedoStack([]);
    const id = createId("note");
    const initialSize = computeNoteSize("", 22, false);
    setWorkspace((current) => ({
      ...current,
      notes: [
        ...current.notes,
        {
          id,
          x,
          y,
          text: "",
          fontSize: 22,
          color: "#334155",
          bold: false,
          highlighted: false,
          highlightColor: "#fff59d",
          width: initialSize.width,
          height: initialSize.height,
        },
      ],
    }));
    setActiveNoteId(id);
  }

  function updateActiveNote(updater: (current: TextNote) => TextNote) {
    if (!activeNoteId) return;
    updateNote(activeNoteId, updater);
  }

  function removeNote(id: string) {
    setUndoStack((current) => [...current.slice(-49), cloneWorkspaceState(workspace)]);
    setRedoStack([]);
    setWorkspace((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== id),
    }));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
  }

  function resetWorkspace() {
    setUndoStack((current) => [...current.slice(-49), cloneWorkspaceState(workspace)]);
    setRedoStack([]);
    setWorkspace(EMPTY_WORKSPACE);
    setActiveStroke(null);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }

  function addPage() {
    setUndoStack((current) => [...current.slice(-49), cloneWorkspaceState(workspace)]);
    setRedoStack([]);
    pendingPageScrollRef.current = true;
    setWorkspace((current) => ({
      ...current,
      pageCount: clamp((current.pageCount || 1) + 1, 1, MAX_PAGE_COUNT),
    }));
  }

  function getActiveScrollElement() {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight + 1) {
      return scrollContainer;
    }
    if (typeof document === "undefined") {
      return null;
    }
    return (document.scrollingElement || document.documentElement || document.body) as HTMLElement | null;
  }

  function isDocumentScrollElement(element: HTMLElement) {
    if (typeof document === "undefined") {
      return false;
    }
    return (
      element === document.scrollingElement ||
      element === document.documentElement ||
      element === document.body
    );
  }

  useEffect(() => {
    if (!pendingPageScrollRef.current || !workspaceRef.current) return;

    const scrollContainer = getActiveScrollElement();
    if (!scrollContainer) return;

    pendingPageScrollRef.current = false;

    const workspaceElement = workspaceRef.current;

    const scrollToNewPage = () => {
      const workspaceRect = workspaceElement.getBoundingClientRect();
      const scrollViewportTop = isDocumentScrollElement(scrollContainer)
        ? 0
        : scrollContainer.getBoundingClientRect().top;
      const nextTop =
        scrollContainer.scrollTop +
        (workspaceRect.top - scrollViewportTop) +
        Math.max(0, workspace.pageCount - 1) * (PAGE_HEIGHT + PAGE_GAP) -
        16;

      const targetTop = Math.max(0, nextTop);
      scrollContainer.scrollTop = targetTop;
      scrollContainer.scrollTo({ top: targetTop });
    };

    let secondFrame: number | null = null;
    let fallbackTimeout: number | null = null;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollToNewPage();
        fallbackTimeout = window.setTimeout(scrollToNewPage, 80);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) {
        window.cancelAnimationFrame(secondFrame);
      }
      if (fallbackTimeout !== null) {
        window.clearTimeout(fallbackTimeout);
      }
    };
  }, [workspace.pageCount]);

  function toWorkPoint(clientX: number, clientY: number) {
    const rect = workspaceRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function startStroke(clientX: number, clientY: number) {
    const point = toWorkPoint(clientX, clientY);
    if (!point) return;
    const tool = workspace.mode === "highlighter" ? "highlighter" : "pen";
    setUndoStack((current) => [...current.slice(-49), cloneWorkspaceState(workspace)]);
    setRedoStack([]);
    const nextStroke: InkStroke = {
      id: createId("stroke"),
      tool,
      color: tool === "highlighter" ? highlighterColor : penColor,
      width: tool === "highlighter" ? highlighterWidth : penWidth,
      points: [point],
    };
    activeStrokeRef.current = nextStroke;
    setActiveStroke(nextStroke);
  }

  function extendStroke(clientX: number, clientY: number) {
    const point = toWorkPoint(clientX, clientY);
    if (!point) return;
    const current = activeStrokeRef.current;
    if (!current) return;
    const nextStroke = { ...current, points: [...current.points, point] };
    activeStrokeRef.current = nextStroke;
    setActiveStroke(nextStroke);
  }

  function finishStroke() {
    const current = activeStrokeRef.current;
    activeStrokeRef.current = null;
    setActiveStroke(null);
    if (!current || current.points.length < 1) return;
    setWorkspace((workspaceState) => ({ ...workspaceState, strokes: [...workspaceState.strokes, current] }));
  }

  function clearInk() {
    setWorkspace((current) => ({ ...current, strokes: [] }));
    activeStrokeRef.current = null;
    setActiveStroke(null);
  }

  function eraseAt(clientX: number, clientY: number) {
    const point = toWorkPoint(clientX, clientY);
    if (!point) return;

    setWorkspace((current) => {
      const nextStrokes = current.strokes.filter((stroke) => !strokeTouchesEraser(stroke, point));
      const nextNotes = current.notes.filter((note) => !noteTouchesEraser(note, point));
      if (nextStrokes.length === current.strokes.length && nextNotes.length === current.notes.length) {
        return current;
      }
      return { ...current, strokes: nextStrokes, notes: nextNotes };
    });
    setActiveNoteId(null);
    setActiveImageId(null);
  }

  function startEraser(clientX: number, clientY: number) {
    setUndoStack((current) => [...current.slice(-49), cloneWorkspaceState(workspace)]);
    setRedoStack([]);
    erasingRef.current = true;
    eraseAt(clientX, clientY);
  }

  function onWorkspacePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (isStrokeMode(workspace.mode) && activeStrokeRef.current) {
      extendStroke(event.clientX, event.clientY);
    }
    if (workspace.mode === "eraser" && erasingRef.current) {
      eraseAt(event.clientX, event.clientY);
    }
    if (isObjectMode(workspace.mode) && dragTarget) {
      applyDragAt(event.clientX, event.clientY);
    }
  }

  function applyDragAt(clientX: number, clientY: number) {
    if (!isObjectMode(workspace.mode) || !dragTarget || !workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();

    if (dragTarget.kind === "note") {
      const nextX = clientX - rect.left - dragTarget.offsetX;
      const nextY = clientY - rect.top - dragTarget.offsetY;
      updateNote(dragTarget.id, (note) => ({
        ...note,
        x: clamp(nextX, 4, Math.max(4, rect.width - note.width - 4)),
        y: clamp(nextY, 4, Math.max(4, rect.height - note.height - 4)),
      }));
      return;
    }

    if (dragTarget.kind === "image") {
      const nextX = clientX - rect.left - dragTarget.offsetX;
      const nextY = clientY - rect.top - dragTarget.offsetY;
      setWorkspace((current) => ({
        ...current,
        pastedImages: current.pastedImages.map((image) => {
          if (image.id !== dragTarget.id) return image;
          return {
            ...image,
            ...normalizeImageRect(nextX, nextY, image.width, image.height, rect.width, rect.height),
          };
        }),
      }));
      return;
    }

    const deltaX = clientX - dragTarget.startClientX;
    const deltaY = clientY - dragTarget.startClientY;

    setWorkspace((current) => ({
      ...current,
      pastedImages: current.pastedImages.map((image) => {
        if (image.id !== dragTarget.id) return image;

        let nextXRect = dragTarget.startX;
        let nextYRect = dragTarget.startY;
        let nextWidth = dragTarget.startWidth;
        let nextHeight = dragTarget.startHeight;

        if (dragTarget.direction.includes("e")) {
          nextWidth = dragTarget.startWidth + deltaX;
        }
        if (dragTarget.direction.includes("s")) {
          nextHeight = dragTarget.startHeight + deltaY;
        }
        if (dragTarget.direction.includes("w")) {
          nextWidth = dragTarget.startWidth - deltaX;
          nextXRect = dragTarget.startX + deltaX;
        }
        if (dragTarget.direction.includes("n")) {
          nextHeight = dragTarget.startHeight - deltaY;
          nextYRect = dragTarget.startY + deltaY;
        }

        return {
          ...image,
          ...normalizeImageRect(nextXRect, nextYRect, nextWidth, nextHeight, rect.width, rect.height),
        };
      }),
    }));
  }

  function onWorkspaceTextPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (workspace.mode !== "text") return;
    if (!workspaceRef.current) return;
    if (dragTarget) return;
    if (event.pointerType === "touch") return;

    setActiveImageId(null);

    const target = event.target as HTMLElement;
    if (target.closest('[data-note="true"]') || target.closest('[data-image="true"]')) {
      return;
    }

    setActiveNoteId(null);

    const rect = workspaceRef.current.getBoundingClientRect();
    const initialSize = computeNoteSize("", 22, false);
    const nextX = clamp(event.clientX - rect.left - 20, 4, Math.max(4, rect.width - initialSize.width - 4));
    const nextY = clamp(event.clientY - rect.top - 10, 4, Math.max(4, rect.height - initialSize.height - 4));
    addNoteAt(nextX, nextY);
  }

  function onWorkspacePointerUp() {
    if (isStrokeMode(workspace.mode) && activeStrokeRef.current) {
      finishStroke();
    }
    erasingRef.current = false;
    setDragTarget(null);
  }

  function onWorkspacePointerLeave() {
    if (isStrokeMode(workspace.mode) && activeStrokeRef.current) {
      finishStroke();
    }
    erasingRef.current = false;
  }

  useEffect(() => {
    if (!isObjectMode(workspace.mode) || !dragTarget) return;

    const onWindowPointerMove = (event: PointerEvent) => {
      applyDragAt(event.clientX, event.clientY);
    };

    const onWindowPointerUp = () => {
      setDragTarget(null);
    };

    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
    };
  }, [dragTarget, workspace.mode]);

  function undoWorkspace() {
    setUndoStack((current) => {
      if (!current.length) return current;
      const previous = current[current.length - 1];
      setRedoStack((redoCurrent) => [...redoCurrent.slice(-49), cloneWorkspaceState(workspace)]);
      setWorkspace(previous);
      return current.slice(0, -1);
    });
  }

  function redoWorkspace() {
    setRedoStack((current) => {
      if (!current.length) return current;
      const next = current[current.length - 1];
      setUndoStack((undoCurrent) => [...undoCurrent.slice(-49), cloneWorkspaceState(workspace)]);
      setWorkspace(next);
      return current.slice(0, -1);
    });
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isUndo = (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "z";
      const isRedo =
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "z");

      if (isUndo) {
        const active = document.activeElement;
        const isTypingIntoInput =
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          Boolean(active?.getAttribute("contenteditable"));
        if (isTypingIntoInput) return;
        undoWorkspace();
        event.preventDefault();
        return;
      }

      if (isRedo) {
        const active = document.activeElement;
        const isTypingIntoInput =
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          Boolean(active?.getAttribute("contenteditable"));
        if (isTypingIntoInput) return;
        redoWorkspace();
        event.preventDefault();
        return;
      }

      if (event.key !== "Delete" && event.key !== "Backspace") return;

      const active = document.activeElement;
      const isTypingIntoInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        Boolean(active?.getAttribute("contenteditable"));
      if (isTypingIntoInput) return;

      if (activeImageId) {
        removePastedImage(activeImageId);
        event.preventDefault();
        return;
      }

      if (activeNoteId) {
        removeNote(activeNoteId);
        event.preventDefault();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImageId, activeNoteId, redoStack.length, undoStack.length, workspace]);

  function setToolMode(mode: WorkspaceMode) {
    activeStrokeRef.current = null;
    setActiveStroke(null);
    erasingRef.current = false;
    setDragTarget(null);
    if (!isObjectMode(mode)) {
      setActiveNoteId(null);
      setActiveImageId(null);
    }
    setWorkspace((current) => ({ ...current, mode }));
  }

  function saveWorkspaceNow() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(workspace));
      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      // ignore storage errors
    }
  }

  function handleActiveColorChange(value: string) {
    if (workspace.mode === "highlighter") {
      setHighlighterColor(value);
      return;
    }
    if (workspace.mode === "text") {
      updateActiveNote((note) => ({ ...note, color: value }));
      return;
    }
    setPenColor(value);
  }

  function handleStrokeWidthChange(value: number) {
    if (workspace.mode === "highlighter") {
      setHighlighterWidth(value);
      return;
    }
    setPenWidth(value);
  }

  const selectedNote = activeNoteId ? workspace.notes.find((note) => note.id === activeNoteId) ?? null : null;
  const strokeControlsTool: StrokeTool = workspace.mode === "highlighter" ? "highlighter" : "pen";
  const activeStrokeColor = strokeControlsTool === "highlighter" ? highlighterColor : penColor;
  const activeStrokeWidth = strokeControlsTool === "highlighter" ? highlighterWidth : penWidth;
  const activeStrokeWidthOptions = strokeControlsTool === "highlighter" ? HIGHLIGHTER_WIDTH_OPTIONS : PEN_WIDTH_OPTIONS;
  const showStrokeControls = workspace.mode === "pen" || workspace.mode === "highlighter" || workspace.mode === "select";
  const showTextControls = workspace.mode === "text";
  const pageCount = clamp(Math.floor(workspace.pageCount || 1), 1, MAX_PAGE_COUNT);
  const activeToolLabel = TOOL_BUTTONS.find(({ value }) => value === workspace.mode)?.label ?? "Pen";
  const documentHeight = pageCount * PAGE_HEIGHT + (pageCount - 1) * PAGE_GAP;
  const pageBackgroundImage = workspace.showLines
    ? "repeating-linear-gradient(to bottom, transparent 0, transparent 29px, rgba(15,23,42,0.12) 29px, rgba(15,23,42,0.12) 30px)"
    : undefined;

  return (
    <div
      ref={scrollContainerRef}
      className="min-h-screen w-full bg-slate-50 p-2 md:p-3"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex min-h-[calc(100vh-1rem)] flex-col gap-3 md:min-h-[calc(100vh-1.5rem)]">
        <div className="overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm">
          <div
            className={[
              "flex flex-wrap items-center justify-between gap-3 px-3 py-2.5",
              isHeaderCollapsed ? "" : "border-b border-slate-100",
            ].join(" ")}
          >
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-dark)]">Workspace controls</div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-1">{pageCount} {pageCount === 1 ? "page" : "pages"}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{activeToolLabel}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                  {lastSavedAt ? `Saved ${lastSavedAt}` : "Auto-save on"}
                </span>
                {showInfoSheet ? <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700">Information open</span> : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsHeaderCollapsed((current) => !current)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              aria-expanded={!isHeaderCollapsed}
              aria-label={isHeaderCollapsed ? "Expand workspace controls" : "Collapse workspace controls"}
              title={isHeaderCollapsed ? "Expand workspace controls" : "Collapse workspace controls"}
            >
              {isHeaderCollapsed ? "Open" : "Collapse"}
              {isHeaderCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
          </div>

          <div
            className={[
              "grid overflow-hidden transition-all duration-300 ease-out",
              isHeaderCollapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
            ].join(" ")}
            aria-hidden={isHeaderCollapsed}
          >
            <div className={isHeaderCollapsed ? "pointer-events-none min-h-0" : "min-h-0"}>
              <div className="px-3 py-3">
                <div className="grid gap-3 lg:grid-cols-[minmax(220px,0.85fr)_minmax(360px,1.15fr)]">
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-dark)]">Learning objective</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-700">{getText(group.learningObjective)}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-dark)]">Task</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-700">{getText(group.task)}</div>
                  </div>
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                        {TOOL_BUTTONS.map(({ value, label, Icon }) => {
                          const selected = workspace.mode === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setToolMode(value)}
                              title={label}
                              aria-label={label}
                              className={[
                                "flex h-11 w-11 items-center justify-center rounded-xl border p-0 transition",
                                selected
                                  ? "border-black bg-black text-white shadow-sm"
                                  : "border-transparent bg-white text-slate-800 hover:border-slate-200 hover:bg-slate-100 hover:text-black",
                              ].join(" ")}
                            >
                              <Icon className="h-5 w-5" strokeWidth={2.2} />
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm">
                        <button
                          type="button"
                          disabled
                          aria-label="Zoom out"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-14 text-center text-xs font-semibold tabular-nums text-slate-600">100%</span>
                        <button
                          type="button"
                          disabled
                          aria-label="Zoom in"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={undoWorkspace}
                        disabled={undoStack.length === 0}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <Undo2 className="h-4 w-4" />
                        Undo
                      </button>
                      <button
                        type="button"
                        onClick={redoWorkspace}
                        disabled={redoStack.length === 0}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <Redo2 className="h-4 w-4" />
                        Redo
                      </button>
                      <button
                        type="button"
                        onClick={saveWorkspaceNow}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        aria-label="Save now"
                        title="Save now"
                      >
                        <Save className="h-4 w-4" />
                        Save now
                      </button>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        {lastSavedAt ? `Auto-saved ${lastSavedAt}` : "Auto-saved"}
                      </span>

                      <div className="ml-auto flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={onPickImage}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          <ImagePlus className="h-4 w-4" />
                          Add pic
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setWorkspace((current) => ({
                              ...current,
                              showLines: !current.showLines,
                            }))
                          }
                          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          {workspace.showLines ? "Remove lines" : "Add lines"}
                        </button>
                        <button
                          type="button"
                          onClick={addPage}
                          disabled={pageCount >= MAX_PAGE_COUNT}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          <Plus className="h-4 w-4" />
                          Add page
                        </button>
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
                          {pageCount} {pageCount === 1 ? "page" : "pages"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowInfoSheet((current) => !current)}
                          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          {showInfoSheet ? "Hide information" : "Information"}
                        </button>
                        <button
                          type="button"
                          onClick={() => window.history.back()}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                          aria-label="Close page"
                          title="Close"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-3">
                      {showStrokeControls ? (
                        <>
                          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-2 py-2 shadow-sm">
                            {COLOR_SWATCHES.map(({ value, label }) => {
                              const selected = activeStrokeColor.toLowerCase() === value.toLowerCase();
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  title={label}
                                  aria-label={`Set ${label.toLowerCase()} color`}
                                  onClick={() => handleActiveColorChange(value)}
                                  className={[
                                    "h-10 w-10 rounded-full border-2 transition",
                                    value === "#ffffff" ? "border-slate-300" : "border-white/80",
                                    selected ? "ring-4 ring-[#9b8cff] ring-offset-2 ring-offset-white" : "hover:scale-105",
                                  ].join(" ")}
                                  style={{ backgroundColor: value }}
                                />
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                            {activeStrokeWidthOptions.map((widthValue) => {
                              const selected = activeStrokeWidth === widthValue;
                              const previewHeight =
                                strokeControlsTool === "highlighter"
                                  ? Math.max(8, Math.round(widthValue / 2.5))
                                  : Math.max(3, Math.round(widthValue));

                              return (
                                <button
                                  key={widthValue}
                                  type="button"
                                  onClick={() => handleStrokeWidthChange(widthValue)}
                                  className={[
                                    "flex h-10 min-w-12 items-center justify-center rounded-xl border px-3 transition",
                                    selected
                                      ? "border-black bg-black text-white"
                                      : "border-transparent bg-white text-slate-800 hover:border-slate-200 hover:bg-slate-100",
                                  ].join(" ")}
                                  aria-label={`Set stroke width ${widthValue}`}
                                >
                                  <span
                                    className={selected ? "rounded-full bg-white" : "rounded-full bg-slate-800"}
                                    style={{
                                      width: strokeControlsTool === "highlighter" ? 24 : 20,
                                      height: previewHeight,
                                      opacity: strokeControlsTool === "highlighter" ? 0.7 : 1,
                                    }}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : showTextControls ? (
                        <>
                          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-2 py-2 shadow-sm">
                            {COLOR_SWATCHES.map(({ value, label }) => {
                              const selected = Boolean(selectedNote && selectedNote.color.toLowerCase() === value.toLowerCase());
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  title={label}
                                  aria-label={`Set text to ${label.toLowerCase()}`}
                                  disabled={!selectedNote}
                                  onClick={() => handleActiveColorChange(value)}
                                  className={[
                                    "h-10 w-10 rounded-full border-2 transition disabled:cursor-not-allowed disabled:opacity-40",
                                    value === "#ffffff" ? "border-slate-300" : "border-white/80",
                                    selected ? "ring-4 ring-[#9b8cff] ring-offset-2 ring-offset-white" : "hover:scale-105",
                                  ].join(" ")}
                                  style={{ backgroundColor: value }}
                                />
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                            <button
                              type="button"
                              onClick={() =>
                                updateActiveNote((note) => {
                                  const nextFontSize = clamp(note.fontSize - 2, 12, 64);
                                  const size = computeNoteSize(note.text, nextFontSize, note.bold);
                                  return { ...note, fontSize: nextFontSize, width: size.width, height: size.height };
                                })
                              }
                              className="h-10 rounded-xl border border-transparent bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              disabled={!selectedNote}
                            >
                              A-
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateActiveNote((note) => {
                                  const nextFontSize = clamp(note.fontSize + 2, 12, 64);
                                  const size = computeNoteSize(note.text, nextFontSize, note.bold);
                                  return { ...note, fontSize: nextFontSize, width: size.width, height: size.height };
                                })
                              }
                              className="h-10 rounded-xl border border-transparent bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              disabled={!selectedNote}
                            >
                              A+
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateActiveNote((note) => {
                                  const nextBold = !note.bold;
                                  const size = computeNoteSize(note.text, note.fontSize, nextBold);
                                  return { ...note, bold: nextBold, width: size.width, height: size.height };
                                })
                              }
                              className={[
                                "h-10 rounded-xl border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40",
                                selectedNote?.bold
                                  ? "border-black bg-black text-white"
                                  : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-100",
                              ].join(" ")}
                              disabled={!selectedNote}
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={() => updateActiveNote((note) => ({ ...note, highlighted: !note.highlighted }))}
                              className={[
                                "h-10 rounded-xl border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
                                selectedNote?.highlighted
                                  ? "border-black bg-black text-white"
                                  : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-100",
                              ].join(" ")}
                              disabled={!selectedNote}
                            >
                              Highlight
                            </button>
                            <input
                              type="color"
                              value={selectedNote?.highlightColor ?? "#fff59d"}
                              onChange={(event) =>
                                updateActiveNote((note) => ({ ...note, highlightColor: event.target.value, highlighted: true }))
                              }
                              disabled={!selectedNote}
                              className="h-10 w-10 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Highlight color"
                              title="Highlight color"
                            />
                          </div>
                        </>
                      ) : null}

                      <label className="ml-auto flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm">
                        Page
                        <input
                          type="color"
                          value={workspace.pageColor}
                          onChange={(event) =>
                            setWorkspace((current) => ({
                              ...current,
                              pageColor: event.target.value,
                            }))
                          }
                          className="h-7 w-7 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                          aria-label="Page color"
                          title="Page color"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {showInfoSheet ? (
                  <div className="mt-3 rounded-xl border border-[var(--theme-border)] bg-white px-4 py-3 text-xs text-slate-700 shadow-sm">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-dark)]">Information sheet</div>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {group.evidence.map((item, index) => (
                        <span
                          key={`evidence-${index}`}
                          className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-soft)] px-2 py-1 text-[11px] font-medium"
                        >
                          {getText(item)}
                        </span>
                      ))}
                    </div>
                    <div className="grid gap-1.5">
                      {group.sourceNotes.map((item, index) => (
                        <div key={`source-${index}`} className="rounded-md bg-slate-50 px-2.5 py-2 leading-5 text-slate-600">
                          {getText(item)}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageInputChange}
        />

      <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,_#eef2f7_0%,_#f8fafc_100%)] p-2">
        <div
          ref={workspaceRef}
          className="relative w-full overflow-hidden rounded-xl"
          style={{
            height: documentHeight,
            minHeight: documentHeight,
            backgroundColor: "transparent",
            cursor:
              workspace.mode === "text"
                ? "text"
                : workspace.mode === "eraser"
                  ? "cell"
                  : workspace.mode === "select"
                    ? "default"
                    : "crosshair",
            touchAction: isObjectMode(workspace.mode) ? "auto" : "pan-y",
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => event.preventDefault()}
          onPointerDown={(event) => {
            if (isStrokeMode(workspace.mode)) {
              if (event.pointerType === "touch") return;
              event.preventDefault();
              startStroke(event.clientX, event.clientY);
              return;
            }
            if (workspace.mode === "eraser") {
              if (event.pointerType === "touch") return;
              event.preventDefault();
              startEraser(event.clientX, event.clientY);
            }
          }}
          onPointerMove={onWorkspacePointerMove}
          onPointerUp={onWorkspacePointerUp}
          onPointerLeave={onWorkspacePointerLeave}
          onPointerDownCapture={onWorkspaceTextPointerDown}
        >
          {Array.from({ length: pageCount }).map((_, index) => {
            const top = index * (PAGE_HEIGHT + PAGE_GAP);
            return (
              <div
                key={`page-${index}`}
                className="pointer-events-none absolute inset-x-0 rounded-xl border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                style={{
                  top,
                  height: PAGE_HEIGHT,
                  backgroundColor: workspace.pageColor,
                  backgroundImage: pageBackgroundImage,
                }}
              >
                {pageCount > 1 ? (
                  <div className="absolute right-4 top-3 rounded-full bg-slate-100/90 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                    Page {index + 1}
                  </div>
                ) : null}
              </div>
            );
          })}

          {workspace.mode === "text" && workspace.notes.length === 0 ? (
            <div className="pointer-events-none absolute left-4 top-3 text-xs text-slate-400">
              Click anywhere to type. Paste images with Ctrl+V.
            </div>
          ) : null}

          {workspace.notes.map((note) => (
                <div
                  key={note.id}
                  data-note="true"
                  className={
                    "absolute z-50 cursor-move rounded-md border p-1 transition " +
                    (activeNoteId === note.id
                      ? "border-slate-300/80 bg-white/25"
                      : "border-transparent bg-transparent")
                  }
                  style={{
                    left: note.x,
                    top: note.y,
                    width: note.width + 8,
                    height: note.height + 8,
                    pointerEvents: isObjectMode(workspace.mode) ? "auto" : "none",
                  }}
                  onPointerDown={(event) => {
                    if (!isObjectMode(workspace.mode)) return;
                    setActiveNoteId(note.id);
                    setActiveImageId(null);
                    if (!workspaceRef.current) return;
                    const rect = workspaceRef.current.getBoundingClientRect();
                    setDragTarget({
                      kind: "note",
                      id: note.id,
                      offsetX: event.clientX - rect.left - note.x,
                      offsetY: event.clientY - rect.top - note.y,
                    });
                  }}
                >
                  <textarea
                    data-note-input-id={note.id}
                    value={note.text}
                    onChange={(event) =>
                      updateNote(note.id, (current) => {
                        const nextText = event.target.value;
                        const size = computeNoteSize(nextText, current.fontSize, current.bold);
                        return {
                          ...current,
                          text: nextText,
                          width: size.width,
                          height: size.height,
                        };
                      })
                    }
                    autoFocus={activeNoteId === note.id}
                    onFocus={() => {
                      setActiveNoteId(note.id);
                      setActiveImageId(null);
                    }}
                    className="resize-none border-none bg-transparent px-0 py-0 leading-[1.35] outline-none"
                    style={{
                      width: note.width,
                      height: note.height,
                      fontSize: note.fontSize,
                      color: note.color,
                      fontWeight: note.bold ? 700 : 400,
                      backgroundColor: note.highlighted ? note.highlightColor : "transparent",
                    }}
                  />
                </div>
              ))}

          {workspace.pastedImages.map((image) => (
                <div
                  key={image.id}
                  data-image="true"
                  className={
                    "absolute z-20 select-none rounded-lg border bg-white/95 p-1.5 shadow-sm touch-none " +
                    (activeImageId === image.id
                      ? "border-violet-400 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                      : "border-slate-200")
                  }
                  style={{
                    left: image.x,
                    top: image.y,
                    width: image.width,
                    pointerEvents: isObjectMode(workspace.mode) ? "auto" : "none",
                  }}
                  onPointerMove={(event) => {
                    if (!isObjectMode(workspace.mode)) return;
                    const imageRect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
                    const localX = event.clientX - imageRect.left;
                    const localY = event.clientY - imageRect.top;
                    const direction = getResizeDirectionFromPoint(localX, localY, imageRect.width, imageRect.height);
                    (event.currentTarget as HTMLDivElement).style.cursor = resizeCursor(direction);
                  }}
                  onPointerLeave={(event) => {
                    (event.currentTarget as HTMLDivElement).style.cursor = "default";
                  }}
                  onPointerDown={(event) => {
                    if (!isObjectMode(workspace.mode)) return;
                    const target = event.target as HTMLElement;
                    if (target.closest("button")) return;
                    event.stopPropagation();
                    setActiveImageId(image.id);
                    setActiveNoteId(null);
                    if (!workspaceRef.current) return;
                    const imageRect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
                    const localX = event.clientX - imageRect.left;
                    const localY = event.clientY - imageRect.top;
                    const resizeDirection = getResizeDirectionFromPoint(localX, localY, imageRect.width, imageRect.height);

                    if (resizeDirection) {
                      setDragTarget({
                        kind: "image-resize",
                        id: image.id,
                        direction: resizeDirection,
                        startClientX: event.clientX,
                        startClientY: event.clientY,
                        startX: image.x,
                        startY: image.y,
                        startWidth: image.width,
                        startHeight: image.height,
                      });
                      return;
                    }

                    const workspaceRect = workspaceRef.current.getBoundingClientRect();
                    setDragTarget({
                      kind: "image",
                      id: image.id,
                      offsetX: event.clientX - workspaceRect.left - image.x,
                      offsetY: event.clientY - workspaceRect.top - image.y,
                    });
                  }}
                >
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    className="pointer-events-none w-full rounded object-cover"
                    style={{ height: image.height }}
                    draggable={false}
                    onDragStart={(event) => event.preventDefault()}
                  />
                  {activeImageId === image.id ? (
                    <>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          removePastedImage(image.id);
                        }}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-rose-500 shadow-sm"
                        aria-label="Remove image"
                        title="Remove image"
                      >
                        ×
                      </button>
                      {(
                        [
                          { dir: "n", cls: "left-3 right-3 top-0 h-4 cursor-n-resize" },
                          { dir: "s", cls: "bottom-0 left-3 right-3 h-4 cursor-s-resize" },
                          { dir: "e", cls: "bottom-3 right-0 top-3 w-4 cursor-e-resize" },
                          { dir: "w", cls: "bottom-3 left-0 top-3 w-4 cursor-w-resize" },
                          { dir: "ne", cls: "right-0 top-0 h-5 w-5 cursor-ne-resize" },
                          { dir: "nw", cls: "left-0 top-0 h-5 w-5 cursor-nw-resize" },
                          { dir: "se", cls: "bottom-0 right-0 h-5 w-5 cursor-se-resize" },
                          { dir: "sw", cls: "bottom-0 left-0 h-5 w-5 cursor-sw-resize" },
                        ] as const
                      ).map((handle) => (
                        <button
                          key={handle.dir}
                          type="button"
                          aria-label={`Resize image ${handle.dir}`}
                          title="Resize image"
                          className={`absolute z-40 rounded border border-violet-300 bg-white/95 shadow-sm ${handle.cls}`}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                            setDragTarget({
                              kind: "image-resize",
                              id: image.id,
                              direction: handle.dir,
                              startClientX: event.clientX,
                              startClientY: event.clientY,
                              startX: image.x,
                              startY: image.y,
                              startWidth: image.width,
                              startHeight: image.height,
                            });
                          }}
                        />
                      ))}
                    </>
                  ) : null}
                </div>
              ))}

          <svg
            className="absolute inset-0"
            width="100%"
            height="100%"
            style={{ pointerEvents: isObjectMode(workspace.mode) ? "none" : "auto" }}
          >
            {workspace.strokes.map((stroke) => (
              <path
                key={stroke.id}
                d={pathFromPoints(stroke.points)}
                fill="none"
                stroke={stroke.color}
                strokeWidth={stroke.width}
                strokeOpacity={stroke.tool === "highlighter" ? 0.42 : 1}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ mixBlendMode: stroke.tool === "highlighter" ? "multiply" : "normal" }}
              />
            ))}
            {activeStroke ? (
              <path
                d={pathFromPoints(activeStroke.points)}
                fill="none"
                stroke={activeStroke.color}
                strokeWidth={activeStroke.width}
                strokeOpacity={activeStroke.tool === "highlighter" ? 0.42 : 1}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ mixBlendMode: activeStroke.tool === "highlighter" ? "multiply" : "normal" }}
              />
            ) : null}
          </svg>
        </div>
      </div>
      </div>
    </div>
  );
}
