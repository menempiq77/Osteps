"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonSection } from "./LessonCourseStepper";

type GroupTask = NonNullable<NonNullable<LessonSection["groupTasks"]>["groups"]>[number];

type Point = {
  x: number;
  y: number;
};

type InkStroke = {
  id: string;
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
  mode: "text" | "pen";
  writing: string;
  strokes: InkStroke[];
  pastedImages: PastedImage[];
  notes: TextNote[];
  pageColor: string;
  showLines: boolean;
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
  mode: "text",
  writing: "",
  strokes: [],
  pastedImages: [],
  notes: [],
  pageColor: "#ffffff",
  showLines: false,
};

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
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceState>(EMPTY_WORKSPACE);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [activeStroke, setActiveStroke] = useState<InkStroke | null>(null);
  const [dragTarget, setDragTarget] = useState<DragTarget>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<WorkspaceState[]>([]);
  const [redoStack, setRedoStack] = useState<WorkspaceState[]>([]);

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

      setWorkspace({
        mode: "text",
        writing: parsed.writing ?? "",
        strokes: Array.isArray(parsed.strokes) ? (parsed.strokes as InkStroke[]) : [],
        pastedImages: parsedPastedImages,
        notes: parsedNotes,
        pageColor: typeof parsed.pageColor === "string" ? parsed.pageColor : "#ffffff",
        showLines: typeof parsed.showLines === "boolean" ? parsed.showLines : false,
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
    setActiveStroke({
      id: createId("stroke"),
      color: "#1f2937",
      width: 2.5,
      points: [point],
    });
  }

  function extendStroke(clientX: number, clientY: number) {
    const point = toWorkPoint(clientX, clientY);
    if (!point) return;
    setActiveStroke((current) => {
      if (!current) return current;
      return { ...current, points: [...current.points, point] };
    });
  }

  function finishStroke() {
    setActiveStroke((current) => {
      if (!current || current.points.length < 1) return null;
      setWorkspace((workspaceState) => ({ ...workspaceState, strokes: [...workspaceState.strokes, current] }));
      return null;
    });
  }

  function clearInk() {
    setWorkspace((current) => ({ ...current, strokes: [] }));
    setActiveStroke(null);
  }

  function onWorkspacePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (workspace.mode === "pen" && activeStroke) {
      extendStroke(event.clientX, event.clientY);
    }
    if (workspace.mode === "text" && dragTarget) {
      applyDragAt(event.clientX, event.clientY);
    }
  }

  function applyDragAt(clientX: number, clientY: number) {
    if (workspace.mode !== "text" || !dragTarget || !workspaceRef.current) return;

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
    if (workspace.mode === "pen" && activeStroke) {
      finishStroke();
    }
    setDragTarget(null);
  }

  function onWorkspacePointerLeave() {
    if (workspace.mode === "pen" && activeStroke) {
      finishStroke();
    }
  }

  useEffect(() => {
    if (workspace.mode !== "text" || !dragTarget) return;

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

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 p-2 md:p-3">
      <div className="flex h-full flex-col gap-2">
      <div className="sticky top-0 z-20 grid gap-2 md:grid-cols-[1fr_1fr_auto] rounded-xl border border-white/70 bg-white px-3 py-2 shadow-sm">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-dark)]">Learning objective</div>
          <div className="mt-0.5 text-xs text-slate-700">{getText(group.learningObjective)}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-dark)]">Task</div>
          <div className="mt-0.5 text-xs text-slate-700">{getText(group.task)}</div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="rounded-full border border-slate-200 bg-slate-50 p-1">
            {(["text", "pen"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setWorkspace((current) => ({ ...current, mode }))}
                className={
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold transition " +
                  (workspace.mode === mode
                    ? "bg-[var(--theme-dark)] text-white"
                    : "text-slate-500 hover:bg-white hover:text-slate-700")
                }
              >
                {mode === "text" ? "Text" : "Pen"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onPickImage}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Add pic
          </button>
          <button
            type="button"
            onClick={() =>
              updateActiveNote((note) => {
                const nextFontSize = clamp(note.fontSize - 2, 12, 64);
                const size = computeNoteSize(note.text, nextFontSize, note.bold);
                return { ...note, fontSize: nextFontSize, width: size.width, height: size.height };
              })
            }
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            disabled={!activeNoteId}
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
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            disabled={!activeNoteId}
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
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            disabled={!activeNoteId}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => updateActiveNote((note) => ({ ...note, highlighted: !note.highlighted }))}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            disabled={!activeNoteId}
          >
            Highlight
          </button>
          <input
            type="color"
            value={
              activeNoteId
                ? workspace.notes.find((item) => item.id === activeNoteId)?.color ?? "#334155"
                : "#334155"
            }
            onChange={(event) => updateActiveNote((note) => ({ ...note, color: event.target.value }))}
            disabled={!activeNoteId}
            className="h-8 w-8 cursor-pointer rounded border border-slate-200 bg-white p-1 disabled:cursor-not-allowed"
            aria-label="Text color"
            title="Text color"
          />
          <input
            type="color"
            value={
              activeNoteId
                ? workspace.notes.find((item) => item.id === activeNoteId)?.highlightColor ?? "#fff59d"
                : "#fff59d"
            }
            onChange={(event) => updateActiveNote((note) => ({ ...note, highlightColor: event.target.value, highlighted: true }))}
            disabled={!activeNoteId}
            className="h-8 w-8 cursor-pointer rounded border border-slate-200 bg-white p-1 disabled:cursor-not-allowed"
            aria-label="Highlight color"
            title="Highlight color"
          />
          <button
            type="button"
            onClick={() =>
              setWorkspace((current) => ({
                ...current,
                showLines: !current.showLines,
              }))
            }
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {workspace.showLines ? "Remove lines" : "Add lines"}
          </button>
          <input
            type="color"
            value={workspace.pageColor}
            onChange={(event) =>
              setWorkspace((current) => ({
                ...current,
                pageColor: event.target.value,
              }))
            }
            className="h-8 w-8 cursor-pointer rounded border border-slate-200 bg-white p-1"
            aria-label="Page color"
            title="Page color"
          />
          <button
            type="button"
            onClick={() => setShowInfoSheet((current) => !current)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {showInfoSheet ? "Hide information sheet" : "Open information sheet"}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Close page"
            title="Close"
          >
            X
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageInputChange}
      />

      {showInfoSheet ? (
        <div className="mb-2 rounded-xl border border-[var(--theme-border)] bg-white px-4 py-3 text-xs text-slate-700 shadow-sm">
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

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,_#eef2f7_0%,_#f8fafc_100%)] p-2">
        <div
          ref={workspaceRef}
          className="relative h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
          style={{ backgroundColor: workspace.pageColor }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => event.preventDefault()}
          onPointerDown={(event) => {
            if (workspace.mode !== "pen") return;
            startStroke(event.clientX, event.clientY);
          }}
          onPointerMove={onWorkspacePointerMove}
          onPointerUp={onWorkspacePointerUp}
          onPointerLeave={onWorkspacePointerLeave}
          onPointerDownCapture={onWorkspaceTextPointerDown}
        >
          {workspace.showLines ? (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0, transparent 29px, rgba(15,23,42,0.12) 29px, rgba(15,23,42,0.12) 30px)",
              }}
            />
          ) : null}

          {workspace.mode === "text" && workspace.notes.length === 0 ? (
            <div className="pointer-events-none absolute left-4 top-3 text-xs text-slate-400">
              Click anywhere to type. Paste images with Ctrl+V.
            </div>
          ) : null}

          {workspace.mode === "text"
            ? workspace.notes.map((note) => (
                <div
                  key={note.id}
                  data-note="true"
                  className={
                    "absolute z-50 cursor-move rounded-md border p-1 transition " +
                    (activeNoteId === note.id
                      ? "border-slate-300/80 bg-white/25"
                      : "border-transparent bg-transparent")
                  }
                  style={{ left: note.x, top: note.y, width: note.width + 8, height: note.height + 8 }}
                  onPointerDown={(event) => {
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
              ))
            : null}

          {workspace.mode === "text"
            ? workspace.pastedImages.map((image) => (
                <div
                  key={image.id}
                  data-image="true"
                  className={
                    "absolute z-20 select-none rounded-lg border bg-white/95 p-1.5 shadow-sm touch-none " +
                    (activeImageId === image.id
                      ? "border-violet-400 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                      : "border-slate-200")
                  }
                  style={{ left: image.x, top: image.y, width: image.width }}
                  onPointerMove={(event) => {
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
              ))
            : null}

          <svg
            className="absolute inset-0"
            width="100%"
            height="100%"
            style={{ pointerEvents: workspace.mode === "pen" ? "auto" : "none" }}
          >
            {workspace.strokes.map((stroke) => (
              <path
                key={stroke.id}
                d={pathFromPoints(stroke.points)}
                fill="none"
                stroke={stroke.color}
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {activeStroke ? (
              <path
                d={pathFromPoints(activeStroke.points)}
                fill="none"
                stroke={activeStroke.color}
                strokeWidth={activeStroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </svg>
        </div>
      </div>
      </div>
    </div>
  );
}
