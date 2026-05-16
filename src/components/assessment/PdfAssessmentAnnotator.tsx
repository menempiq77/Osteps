"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Input, InputNumber, Modal, message, Select, Spin, Tag } from "antd";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Eraser,
  Highlighter,
  MousePointer2,
  PenTool,
  Trash2,
  Type,
  Underline,
} from "lucide-react";
import type {
  AssessmentDocumentAnnotation,
  AssessmentDocumentLayer,
  AssessmentDocumentState,
  PenAnnotation,
  TextAnnotation,
} from "@/services/documentAssessmentApi";
import {
  fetchAssessmentDocument,
  saveAssessmentDocumentAnnotations,
} from "@/services/documentAssessmentApi";
import { draftAssessmentMark } from "@/services/aiMarkingApi";
import type {
  AiDraftMarkResponse,
  AiDraftProviderTrace,
  QuestionAnswerAnchor,
  QuestionMarkEntry,
} from "@/services/aiMarkingApi";
import { addStudentTaskMarks, uploadTaskByStudent } from "@/services/api";
import { fetchStudentProfileData } from "@/services/studentsApi";
import { resolveExamWindow } from "@/lib/taskTypeMetadata";

type Tool = "cursor" | "pen" | "highlighter" | "text" | "eraser";
type DocumentKind = "pdf" | "docx" | "image";
type TextFontWeight = "normal" | "bold";
type TextAlignment = "left" | "center" | "right";
type TextToolbarMenu = "color" | "align" | "size";

const COLOR_SWATCHS = [
  { value: "#bdbdbd", label: "Gray" },
  { value: "#f472b6", label: "Pink" },
  { value: "#fb923c", label: "Orange" },
  { value: "#fde047", label: "Yellow" },
  { value: "#a3e635", label: "Green" },
  { value: "#67e8f9", label: "Cyan" },
  { value: "#a78bfa", label: "Purple" },
  { value: "#ef4444", label: "Red" },
  { value: "#ffffff", label: "White" },
  { value: "#111827", label: "Black" },
] as const;
const PEN_WIDTH_OPTIONS = [2, 4, 6, 8] as const;
const HIGHLIGHTER_WIDTH_OPTIONS = [10, 16, 24] as const;
const TEXT_SIZE_OPTIONS = [14, 16, 18, 24] as const;
const TEXT_SIZE_DROPDOWN_OPTIONS = [
  { label: "Small", value: 14 },
  { label: "Medium", value: 18 },
  { label: "Large", value: 24 },
  { label: "Extra Large", value: 30 },
  { label: "Huge", value: 36 },
] as const;
const TEXT_COLOR_DROPDOWN_SWATCHS = [
  { value: "#111827", label: "Black" },
  { value: "#737373", label: "Gray" },
  { value: "#ea580c", label: "Orange red" },
  { value: "#fb923c", label: "Orange" },
  { value: "#facc15", label: "Yellow" },
  { value: "#16a34a", label: "Green" },
  { value: "#0284c7", label: "Blue" },
  { value: "#7c3aed", label: "Purple" },
  { value: "#ffffff", label: "White" },
  { value: "#d4d4d8", label: "Light gray" },
  { value: "#fca5a5", label: "Light red" },
  { value: "#fdba74", label: "Light orange" },
  { value: "#fde68a", label: "Light yellow" },
  { value: "#86efac", label: "Light green" },
  { value: "#7dd3fc", label: "Light blue" },
  { value: "#c4b5fd", label: "Lavender" },
] as const;
const TEXT_ALIGNMENT_OPTIONS: Array<{
  value: TextAlignment;
  label: string;
  Icon: typeof AlignLeft;
}> = [
  { value: "left", label: "Align left", Icon: AlignLeft },
  { value: "center", label: "Align center", Icon: AlignCenter },
  { value: "right", label: "Align right", Icon: AlignRight },
];

const TOOL_BUTTONS: Array<{
  value: Tool;
  label: string;
  Icon: typeof PenTool;
}> = [
  { value: "cursor", label: "Cursor", Icon: MousePointer2 },
  { value: "pen", label: "Pen", Icon: PenTool },
  { value: "highlighter", label: "Highlighter", Icon: Highlighter },
  { value: "eraser", label: "Eraser", Icon: Eraser },
  { value: "text", label: "Text", Icon: Type },
];

const TOUCH_PAGE_ACTION_GRACE_MS = 120;

type RenderedPage = {
  pageNumber: number;
  width: number;
  height: number;
  previewUrl?: string;
};

type EditingText = {
  id?: string;
  page: number;
  x: number;
  y: number;
  value: string;
  fontSize: number;
  width: number;
  fontWeight: TextFontWeight;
  underline: boolean;
  textAlign: TextAlignment;
};

type DraggingText = {
  id: string;
  startClientX: number;
  startClientY: number;
  originX: number;
  originY: number;
  x: number;
  y: number;
};

type ResizingText = {
  id?: string;
  startClientX: number;
  originWidth: number;
  originX: number;
  x: number;
  width: number;
  edge: "left" | "right";
};

type PenBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

type ResizingPen = {
  id: string;
  edge: "left" | "right";
  startClientX: number;
  originPoints: PenAnnotation["points"];
  originBounds: PenBounds;
};

type DraggingPen = {
  id: string;
  startClientX: number;
  startClientY: number;
  originPoints: PenAnnotation["points"];
  originBounds: PenBounds;
};

type TrackedTouchPointer = {
  clientX: number;
  clientY: number;
};

type TouchGestureState = {
  initialDistance: number;
  initialZoomLevel: number;
  initialContentX: number;
  initialContentY: number;
};

type PendingTouchPageAction = {
  pointerId: number;
  pageNumber: number;
  startClientX: number;
  startClientY: number;
  startedAtMs: number;
  startPoint: { x: number; y: number };
  target: HTMLDivElement;
  mode: "cursor" | "eraser" | "stroke";
  strokeTool?: "pen" | "highlighter";
  strokeColor?: string;
  strokeWidth?: number;
};

type ExamExitContext = "fullscreen" | "screen" | "leave";

type ExamExitLogEntry = {
  reason: string;
  context: ExamExitContext;
  createdAt: string;
  role: AssessmentDocumentLayer;
};

type TeacherExamStudentInfo = {
  studentName: string;
  className: string;
};

type StudentSwitcherOption = {
  value: string;
  label: string;
  status?: string;
};

type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
};

type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

type PdfAssessmentAnnotatorProps = {
  assessmentId: string;
  taskId: string;
  studentId: string;
  role: AssessmentDocumentLayer;
  fileUrl: string;
  title?: string;
  maxMarks?: number;
  initialTeacherMarks?: string;
  initialTeacherFeedback?: string;
  examMode?: boolean;
  examStartAt?: string;
  examDurationMinutes?: number;
  examEndAt?: string;
  initialSelfAssessmentMark?: number | null;
  returnTo?: string | null;
  currentStudentName?: string;
  subjectName?: string;
  studentSwitcherOptions?: StudentSwitcherOption[];
  studentSwitcherLoading?: boolean;
  onStudentChange?: (studentId: string) => void;
  autoDownloadTeacherPaper?: boolean;
};

const AUTOSAVE_DELAY_MS = 5000;
const LIVE_SYNC_INTERVAL_MS = 1200;
const REMOTE_SYNC_INTERVAL_MS = 1500;
const SELF_ASSESSMENT_AUTOSAVE_DELAY_MS = 1200;
const TEACHER_DRAFT_AUTOSAVE_DELAY_MS = 1200;
const HISTORY_STACK_LIMIT = 50;
const AI_PAGE_IMAGE_MAX_COUNT = 12;
const AI_PAGE_IMAGE_MAX_WIDTH = 1200;
const AI_PAGE_IMAGE_JPEG_QUALITY = 0.68;
const ERASER_RADIUS = 28;
const PEN_SELECTION_RADIUS = 12;
const PEN_SELECTION_BOX_PADDING = 12;
const PEN_SELECTION_BOX_MIN_SIZE = 32;
const PEN_RESIZE_MIN_SCALE = 0.25;
const TEXT_ERASER_PADDING = 18;
const TEXT_ANNOTATION_MIN_WIDTH = 120;
const TEXT_ANNOTATION_DEFAULT_WIDTH = 360;
const TEXT_ANNOTATION_MAX_WIDTH = 900;
const EXAM_EXIT_REASON_MAX_LENGTH = 500;
const MIN_ZOOM_LEVEL = 0.5;
const MAX_ZOOM_LEVEL = 2;
const ZOOM_STEP = 0.1;
const MIN_TEXT_FONT_SIZE = 12;
const MAX_TEXT_FONT_SIZE = 36;

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const sanitizeFileName = (value: string) =>
  value
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "student-paper";

const normalizeDocumentUrl = (value: string | null | undefined) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  try {
    const url = new URL(rawValue);
    url.hash = "";
    return url.toString();
  } catch {
    return rawValue.replace(/#.*$/, "");
  }
};

const getDocumentDraftKey = (
  assessmentId: string,
  taskId: string,
  studentId: string,
  role: AssessmentDocumentLayer
) => `osteps:assessment-document-draft:${assessmentId}:${taskId}:${studentId}:${role}`;

const getDocumentLoadKey = (
  assessmentId: string,
  taskId: string,
  studentId: string,
  fileUrl: string,
  role: AssessmentDocumentLayer
) => `${assessmentId}:${taskId}:${studentId}:${normalizeDocumentUrl(fileUrl)}:${role}`;

const getStoredDocumentDraft = (key: string) => {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    if (!parsed || !Array.isArray(parsed.annotations)) return null;
    return parsed as {
      annotations: AssessmentDocumentAnnotation[];
      metadata?: Record<string, unknown>;
      updatedAtMs?: number;
      signature?: string;
    };
  } catch {
    return null;
  }
};

const clampZoomLevel = (value: number) =>
  Math.min(MAX_ZOOM_LEVEL, Math.max(MIN_ZOOM_LEVEL, Math.round(value * 100) / 100));

const getCurrentFullscreenElement = (doc: FullscreenCapableDocument) =>
  doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement ?? null;

const isTouchFriendlyExamDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const iPadOS = platform === "MacIntel" && maxTouchPoints > 1;
  const appleTouchDevice = /iPad|iPhone|iPod/i.test(userAgent) || iPadOS;
  const androidTouchDevice = /Android/i.test(userAgent) && coarsePointer;
  const tabletSizedTouchDevice = coarsePointer && maxTouchPoints > 0 && window.innerWidth <= 1366;

  return appleTouchDevice || androidTouchDevice || tabletSizedTouchDevice;
};

const formatCountdown = (valueMs: number | null) => {
  if (valueMs == null) return "--:--:--";
  const safeValue = Math.max(0, valueMs);
  const totalSeconds = Math.floor(safeValue / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

const formatExamExitContext = (value: ExamExitContext) => {
  if (value === "screen") return "Switched screen";
  if (value === "leave") return "Tried to leave page";
  return "Left fullscreen";
};

const sanitizeReturnToPath = (value: string | null | undefined) => {
  const normalizedValue = String(value || "").trim();
  if (!normalizedValue || !normalizedValue.startsWith("/")) return null;
  if (normalizedValue.startsWith("//")) return null;
  return normalizedValue;
};

const extractStudentClassName = (profileData: Record<string, any> | null | undefined) =>
  String(
    profileData?.subject_class_name ??
      profileData?.subject_context?.subject_class_name ??
      profileData?.subject_context?.base_class_label ??
      profileData?.subject_class?.name ??
      profileData?.subject_class?.base_class_label ??
      profileData?.class?.class_name ??
      profileData?.class?.name ??
      profileData?.class_name ??
      "Unknown class"
  ).trim() || "Unknown class";

const normalizeSelfAssessmentValue = (value: unknown): number | null => {
  if (value == null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const normalizeAiProviderTrace = (value: unknown): AiDraftProviderTrace | undefined => {
  if (!value || typeof value !== "object") return undefined;

  const raw = value as Partial<AiDraftProviderTrace>;
  const selected = String(raw.selected ?? "").trim();
  const attempts = Array.isArray(raw.attempts)
    ? raw.attempts.map((attempt) => String(attempt ?? "").trim()).filter(Boolean)
    : [];
  const recheck = String(raw.recheck ?? "").trim();

  if (!selected && attempts.length === 0 && !recheck) return undefined;

  return {
    selected: selected || attempts[attempts.length - 1] || "Unknown AI provider",
    attempts,
    recheck: recheck || undefined,
  };
};

const normalizeAiAnswerAnchor = (value: unknown): QuestionAnswerAnchor | undefined => {
  if (!value || typeof value !== "object") return undefined;

  const raw = value as Partial<QuestionAnswerAnchor>;
  const pageNumber = Number(raw.pageNumber ?? 0);
  const x = Number(raw.x ?? NaN);
  const y = Number(raw.y ?? NaN);
  const width = Number(raw.width ?? NaN);
  const height = Number(raw.height ?? NaN);

  if (!Number.isFinite(pageNumber) || pageNumber <= 0) return undefined;
  if (![x, y, width, height].every((entry) => Number.isFinite(entry))) return undefined;
  if (width < 8 || height < 8) return undefined;

  const clampedX = Math.max(0, Math.min(1000, x));
  const clampedY = Math.max(0, Math.min(1000, y));
  const clampedWidth = Math.max(8, Math.min(1000 - clampedX, width));
  const clampedHeight = Math.max(8, Math.min(1000 - clampedY, height));

  return {
    pageNumber,
    x: clampedX,
    y: clampedY,
    width: clampedWidth,
    height: clampedHeight,
    confidence:
      raw.confidence === "high" || raw.confidence === "medium" || raw.confidence === "low"
        ? raw.confidence
        : undefined,
    evidence: String(raw.evidence ?? "").trim() || undefined,
  };
};

const normalizeAiDraftPreview = (value: unknown): AiDraftMarkResponse | null => {
  if (!value || typeof value !== "object") return null;

  const raw = value as Partial<AiDraftMarkResponse>;
  const suggestedMark =
    raw.suggestedMark == null || raw.suggestedMark === ""
      ? null
      : Number(raw.suggestedMark);
  const confidence =
    raw.confidence === "high" || raw.confidence === "medium" ? raw.confidence : "low";
  const warnings = Array.isArray(raw.warnings)
    ? raw.warnings.map((warning) => String(warning ?? "").trim()).filter(Boolean)
    : [];
  const providerTrace = normalizeAiProviderTrace(raw.providerTrace);

  return {
    suggestedMark: Number.isFinite(suggestedMark) ? suggestedMark : null,
    questionBreakdown: Array.isArray(raw.questionBreakdown)
      ? (raw.questionBreakdown as QuestionMarkEntry[])
          .filter((e) => e && typeof e.question === "string")
          .map((entry) => ({
            question: String(entry.question ?? "").trim(),
            questionType: String(entry.questionType ?? "").trim() || undefined,
            studentAnswer: String(entry.studentAnswer ?? "").trim(),
            correctAnswer: String(entry.correctAnswer ?? "").trim() || undefined,
            marksAwarded: Number(entry.marksAwarded ?? 0),
            maxMarksForQuestion:
              entry.maxMarksForQuestion == null || entry.maxMarksForQuestion === ""
                ? null
                : Number(entry.maxMarksForQuestion),
            reason: String(entry.reason ?? "").trim(),
            answerAnchor: normalizeAiAnswerAnchor(entry.answerAnchor),
          }))
      : undefined,
    feedback: String(raw.feedback ?? "").trim(),
    rationale: String(raw.rationale ?? "").trim(),
    confidence,
    sourcePolicy: String(raw.sourcePolicy ?? "").trim(),
    warnings,
    providerTrace,
  };
};

const isAiDraftFailureText = (value: string) =>
  /(?:could not draft a safe mark|could not reliably read|cannot read|could not read|unreadable|mark manually|no reliable visual|no readable student answer)/i.test(
    value
  );

const isFailedAiDraft = (draft: AiDraftMarkResponse | null) => {
  if (!draft) return true;
  if (draft.suggestedMark == null) return true;

  const text = [draft.feedback, draft.rationale]
    .join(" ")
    .toLowerCase();
  return isAiDraftFailureText(text);
};

const isReliableAiDraft = (draft: AiDraftMarkResponse | null) => {
  if (isFailedAiDraft(draft)) return false;
  if (!draft || draft.suggestedMark == null) return false;
  if (draft.confidence === "low") return false;

  const text = [draft.feedback, draft.rationale, ...(draft.warnings || [])]
    .join(" ")
    .toLowerCase();

  return !/(?:did not read enough|only accounted for|only produced|teacher review required|could not reliably read|unreadable|mark manually|no reliable visual|no readable student answer|timed out before completing)/i.test(
    text
  );
};

const getAiDeductionRows = (draft: AiDraftMarkResponse | null) => {
  const rows = draft?.questionBreakdown || [];
  return rows.filter((entry) => {
    const maxForQuestion = Number(entry.maxMarksForQuestion ?? 0);
    if (Number.isFinite(maxForQuestion) && maxForQuestion > 0) {
      return Number(entry.marksAwarded ?? 0) < maxForQuestion;
    }
    return /(wrong|incorrect|missing|not provided|blank|unreadable|incomplete|deduct|lost|0 marks?)/i.test(
      `${entry.studentAnswer || ""} ${entry.reason || ""}`
    );
  });
};

const getAiMarksLost = (entry: QuestionMarkEntry) => {
  const maxForQuestion = Number(entry.maxMarksForQuestion ?? 0);
  const marksAwarded = Number(entry.marksAwarded ?? 0);
  if (!Number.isFinite(maxForQuestion) || maxForQuestion <= 0) return null;
  return Math.max(0, maxForQuestion - (Number.isFinite(marksAwarded) ? marksAwarded : 0));
};

const AI_DRAFT_OVERLAY_ID_PREFIX = "ai-draft-overlay:";
const AI_DRAFT_OVERLAY_COLOR = "#dc2626";
const AI_DRAFT_OVERLAY_WIDTH = 3;

const isChoiceQuestionType = (value: string | undefined) => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "mcq" || normalized === "truefalse";
};

const buildEllipsePoints = (x: number, y: number, width: number, height: number, segments = 28) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const rx = Math.max(6, width / 2);
  const ry = Math.max(6, height / 2);

  return Array.from({ length: segments + 1 }, (_, index) => {
    const angle = (index / segments) * Math.PI * 2;
    return {
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
    };
  });
};

const buildAiDraftOverlayAnnotations = ({
  draft,
  pages,
}: {
  draft: AiDraftMarkResponse;
  pages: RenderedPage[];
}): AssessmentDocumentAnnotation[] => {
  const pageByNumber = new Map(pages.map((page) => [page.pageNumber, page] as const));
  const overlays: AssessmentDocumentAnnotation[] = [];

  (draft.questionBreakdown || []).forEach((entry, index) => {
    if (!isChoiceQuestionType(entry.questionType)) return;
    if (!entry.answerAnchor || entry.answerAnchor.confidence === "low") return;

    const page = pageByNumber.get(entry.answerAnchor.pageNumber);
    if (!page) return;

    const normalizedX = (entry.answerAnchor.x / 1000) * page.width;
    const normalizedY = (entry.answerAnchor.y / 1000) * page.height;
    const normalizedWidth = (entry.answerAnchor.width / 1000) * page.width;
    const normalizedHeight = (entry.answerAnchor.height / 1000) * page.height;
    const padding = Math.max(10, Math.min(page.width, page.height) * 0.008);

    const x = Math.max(0, normalizedX - padding / 2);
    const y = Math.max(0, normalizedY - padding / 2);
    const width = Math.min(page.width - x, normalizedWidth + padding);
    const height = Math.min(page.height - y, normalizedHeight + padding);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 10 || height < 10) return;

    overlays.push({
      id: `${AI_DRAFT_OVERLAY_ID_PREFIX}${entry.answerAnchor.pageNumber}:${index}:circle`,
      type: "pen",
      page: entry.answerAnchor.pageNumber,
      color: AI_DRAFT_OVERLAY_COLOR,
      width: AI_DRAFT_OVERLAY_WIDTH,
      points: buildEllipsePoints(x, y, width, height),
    });
  });

  return overlays;
};

const formatAiMarkValue = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(1);

const getPointerPoint = (
  event: React.PointerEvent<HTMLDivElement>,
  target: HTMLDivElement,
  zoomLevel: number
) => {
  const rect = target.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / zoomLevel,
    y: (event.clientY - rect.top) / zoomLevel,
  };
};

const getTrackedTouchPoints = (pointers: Map<number, TrackedTouchPointer>) =>
  Array.from(pointers.values()).slice(0, 2);

const getTouchGestureCenter = (points: TrackedTouchPointer[]) => ({
  x: (points[0].clientX + points[1].clientX) / 2,
  y: (points[0].clientY + points[1].clientY) / 2,
});

const getTouchGestureDistance = (points: TrackedTouchPointer[]) =>
  Math.hypot(points[0].clientX - points[1].clientX, points[0].clientY - points[1].clientY);

const getNativeTouchPointerId = (touch: Touch) => -1 - touch.identifier;

const getSafePenPoints = (annotation: { points?: Array<{ x?: number; y?: number }> | null }) =>
  Array.isArray(annotation.points)
    ? annotation.points.filter(
        (point): point is { x: number; y: number } =>
          point != null && Number.isFinite(point.x) && Number.isFinite(point.y)
      )
    : [];

const cloneAnnotationsSnapshot = (annotations: AssessmentDocumentAnnotation[]) =>
  annotations.map((annotation) =>
    annotation.type === "pen"
      ? {
          ...annotation,
          points: getSafePenPoints(annotation).map((point) => ({ ...point })),
        }
      : { ...annotation }
  );

const getTextFont = (fontSize: number, fontWeight: TextFontWeight = "normal") =>
  `${fontWeight === "bold" ? "700" : "400"} ${fontSize}px Arial, sans-serif`;

const compactAnnotationsForAiDraft = (annotations: AssessmentDocumentAnnotation[]) =>
  annotations.map((annotation) => {
    if (annotation.type === "text") return annotation;
    if (annotation.type === "pen") {
      return {
        id: annotation.id,
        type: annotation.type,
        tool: annotation.tool,
        page: annotation.page,
        color: annotation.color,
        width: annotation.width,
        pointCount: getSafePenPoints(annotation).length,
      };
    }
    return annotation;
  }) as AssessmentDocumentAnnotation[];

const drawPen = (context: CanvasRenderingContext2D, annotation: PenAnnotation) => {
  const points = getSafePenPoints(annotation);
  if (points.length < 2) return;
  const strokeTool = annotation.tool === "highlighter" ? "highlighter" : "pen";
  context.save();
  if (strokeTool === "highlighter") {
    context.globalAlpha = 0.3;
    context.globalCompositeOperation = "multiply";
  }
  context.strokeStyle = annotation.color;
  context.lineWidth = annotation.width;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) {
    context.lineTo(point.x, point.y);
  }
  context.stroke();
  context.restore();
};

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  annotation: TextAnnotation,
  maxWidth = TEXT_ANNOTATION_MAX_WIDTH
) => {
  const text = annotation.text || "";
  if (!text.trim()) return;
  const effectiveMaxWidth = annotation.width ?? maxWidth;

  const fontSize = annotation.fontSize || 16;
  const fontWeight = annotation.fontWeight === "bold" ? "bold" : "normal";
  const textAlign = annotation.textAlign ?? "left";
  const lineHeight = fontSize * 1.22;
  context.save();
  context.fillStyle = annotation.color || "#111827";
  context.strokeStyle = annotation.color || "#111827";
  context.font = getTextFont(fontSize, fontWeight);
  context.textBaseline = "top";

  const paragraphs = text.split(/\r?\n/);
  let y = annotation.y;
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      y += lineHeight;
      continue;
    }

    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      if (context.measureText(testLine).width > effectiveMaxWidth && line) {
        const lineWidth = context.measureText(line).width;
        const lineX =
          textAlign === "center"
            ? annotation.x + (effectiveMaxWidth - lineWidth) / 2
            : textAlign === "right"
              ? annotation.x + effectiveMaxWidth - lineWidth
              : annotation.x;
        context.fillText(line, lineX, y);
        if (annotation.underline) {
          const underlineY = y + fontSize + Math.max(1, fontSize * 0.08);
          context.lineWidth = Math.max(1, fontSize * 0.06);
          context.beginPath();
          context.moveTo(lineX, underlineY);
          context.lineTo(lineX + lineWidth, underlineY);
          context.stroke();
        }
        line = word;
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      const lineWidth = context.measureText(line).width;
      const lineX =
        textAlign === "center"
          ? annotation.x + (effectiveMaxWidth - lineWidth) / 2
          : textAlign === "right"
            ? annotation.x + effectiveMaxWidth - lineWidth
            : annotation.x;
      context.fillText(line, lineX, y);
      if (annotation.underline) {
        const underlineY = y + fontSize + Math.max(1, fontSize * 0.08);
        context.lineWidth = Math.max(1, fontSize * 0.06);
        context.beginPath();
        context.moveTo(lineX, underlineY);
        context.lineTo(lineX + lineWidth, underlineY);
        context.stroke();
      }
      y += lineHeight;
    }
  }
  context.restore();
};

const distanceToSegment = (
  point: { x: number; y: number },
  start: { x: number; y: number },
  end: { x: number; y: number }
) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
};

const penTouchesEraser = (annotation: PenAnnotation, point: { x: number; y: number }) => {
  const points = getSafePenPoints(annotation);
  const radius = ERASER_RADIUS + annotation.width / 2;
  if (points.some((p) => Math.hypot(p.x - point.x, p.y - point.y) <= radius)) return true;
  for (let index = 1; index < points.length; index += 1) {
    if (distanceToSegment(point, points[index - 1], points[index]) <= radius) return true;
  }
  return false;
};

const penTouchesPoint = (annotation: PenAnnotation, point: { x: number; y: number }) => {
  const points = getSafePenPoints(annotation);
  const radius = PEN_SELECTION_RADIUS + annotation.width / 2;
  if (points.some((entry) => Math.hypot(entry.x - point.x, entry.y - point.y) <= radius)) {
    return true;
  }
  for (let index = 1; index < points.length; index += 1) {
    if (distanceToSegment(point, points[index - 1], points[index]) <= radius) return true;
  }
  return false;
};

const findPenAnnotationAtPoint = (
  annotations: AssessmentDocumentAnnotation[],
  pageNumber: number,
  point: { x: number; y: number }
) => {
  for (let index = annotations.length - 1; index >= 0; index -= 1) {
    const annotation = annotations[index];
    if (annotation.type !== "pen" || annotation.page !== pageNumber) continue;
    if (String(annotation.id || "").startsWith(AI_DRAFT_OVERLAY_ID_PREFIX)) continue;
    if (penTouchesPoint(annotation, point)) return annotation;
  }
  return null;
};

const drawSelectedPenHighlight = (context: CanvasRenderingContext2D, annotation: PenAnnotation) => {
  const points = getSafePenPoints(annotation);
  if (points.length < 2) return;

  context.save();
  context.strokeStyle = "#7c3aed";
  context.lineWidth = annotation.width + 10;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.globalAlpha = 0.28;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) {
    context.lineTo(point.x, point.y);
  }
  context.stroke();
  context.restore();
};

const getPenBounds = (annotation: PenAnnotation): PenBounds | null => {
  const points = getSafePenPoints(annotation);
  if (points.length === 0) return null;

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (const point of points.slice(1)) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
};

const getPenSelectionOverlayBounds = (bounds: PenBounds) => {
  const width = Math.max(bounds.width + PEN_SELECTION_BOX_PADDING * 2, PEN_SELECTION_BOX_MIN_SIZE);
  const height = Math.max(bounds.height + PEN_SELECTION_BOX_PADDING * 2, PEN_SELECTION_BOX_MIN_SIZE);

  return {
    left: bounds.centerX - width / 2,
    top: bounds.centerY - height / 2,
    width,
    height,
  };
};

const scalePenPointsFromEdge = (
  points: PenAnnotation["points"],
  bounds: PenBounds,
  scale: number,
  edge: "left" | "right"
) => {
  const anchorX = edge === "right" ? bounds.minX : bounds.maxX;
  return points.map((point) => ({
    x: anchorX + (point.x - anchorX) * scale,
    y: bounds.centerY + (point.y - bounds.centerY) * scale,
  }));
};

const textTouchesEraser = (annotation: TextAnnotation, point: { x: number; y: number }) => {
  const text = String(annotation.text ?? "");
  const lineCount = Math.max(1, text.split("\n").length);
  const height = annotation.fontSize * 1.45 * lineCount;
  return (
    point.x >= annotation.x - TEXT_ERASER_PADDING &&
    point.x <= annotation.x + (annotation.width ?? TEXT_ANNOTATION_DEFAULT_WIDTH) + TEXT_ERASER_PADDING &&
    point.y >= annotation.y - TEXT_ERASER_PADDING &&
    point.y <= annotation.y + height + TEXT_ERASER_PADDING
  );
};

const PdfAssessmentAnnotator: React.FC<PdfAssessmentAnnotatorProps> = ({
  assessmentId,
  taskId,
  studentId,
  role,
  fileUrl,
  title = "PDF Assessment",
  maxMarks,
  initialTeacherMarks = "",
  initialTeacherFeedback = "",
  examMode = false,
  examStartAt,
  examDurationMinutes,
  examEndAt,
  initialSelfAssessmentMark = null,
  returnTo = null,
  currentStudentName,
  subjectName,
  studentSwitcherOptions = [],
  studentSwitcherLoading = false,
  onStudentChange,
  autoDownloadTeacherPaper = false,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, setState] = useState<AssessmentDocumentState | null>(null);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [documentKind, setDocumentKind] = useState<DocumentKind>("pdf");
  const [docxHtml, setDocxHtml] = useState("");
  const [tool, setTool] = useState<Tool>(role === "teacher" ? "pen" : "text");
  const [color, setColor] = useState(role === "teacher" ? "#dc2626" : "#111827");
  const [penWidth, setPenWidth] = useState(3);
  const [highlighterWidth, setHighlighterWidth] = useState(16);
  const [textFontSize, setTextFontSize] = useState(role === "teacher" ? 18 : 16);
  const [textFontWeight, setTextFontWeight] = useState<TextFontWeight>("normal");
  const [textUnderline, setTextUnderline] = useState(false);
  const [textAlignment, setTextAlignment] = useState<TextAlignment>("left");
  const [textToolbarMenu, setTextToolbarMenu] = useState<TextToolbarMenu | null>(null);
  const [saving, setSaving] = useState(false);
  const [autosaveQueued, setAutosaveQueued] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [changingStudentLock, setChangingStudentLock] = useState(false);
  const [exportingPaper, setExportingPaper] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);
  const [aiDraftPreview, setAiDraftPreview] = useState<AiDraftMarkResponse | null>(null);
  const [loadedDocumentKey, setLoadedDocumentKey] = useState("");

  const [selfAssessmentMark, setSelfAssessmentMark] = useState<number | null>(initialSelfAssessmentMark);
  const [teacherMarks, setTeacherMarks] = useState(initialTeacherMarks);
  const [teacherFeedback, setTeacherFeedback] = useState(initialTeacherFeedback);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [zoomLevel, setZoomLevel] = useState(1);
  const [visualViewportScale, setVisualViewportScale] = useState(1);
  const [visualViewportOffset, setVisualViewportOffset] = useState({ left: 0, top: 0, width: 0 });
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [isExamFullscreen, setIsExamFullscreen] = useState(false);
  const [examFullscreenSupported, setExamFullscreenSupported] = useState(true);
  const [examStartModalOpen, setExamStartModalOpen] = useState(false);
  const [examExitModalOpen, setExamExitModalOpen] = useState(false);
  const [examExitReason, setExamExitReason] = useState("");
  const [examExitContext, setExamExitContext] = useState<ExamExitContext>("fullscreen");
  const [screenshotWarningVisible, setScreenshotWarningVisible] = useState(false);
  const [handlingExamExit, setHandlingExamExit] = useState(false);
  const [teacherExamAlertDismissed, setTeacherExamAlertDismissed] = useState(false);
  const [teacherExamStudentInfo, setTeacherExamStudentInfo] = useState<TeacherExamStudentInfo | null>(null);
  const [activeStroke, setActiveStroke] = useState<PenAnnotation | null>(null);
  const [editingText, setEditingText] = useState<EditingText | null>(null);
  const [resizingText, setResizingText] = useState(false);
  const [resizingPen, setResizingPen] = useState(false);
  const [draggingPen, setDraggingPen] = useState(false);
  const [selectedPenAnnotationId, setSelectedPenAnnotationId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<AssessmentDocumentAnnotation[][]>([]);
  const [redoStack, setRedoStack] = useState<AssessmentDocumentAnnotation[][]>([]);
  const selectedPenAnnotation = useMemo(() => {
    if (!selectedPenAnnotationId) return null;
    const currentAnnotations = role === "teacher" ? state?.teacherAnnotations || [] : state?.studentAnnotations || [];
    const annotation = currentAnnotations.find(
      (entry): entry is PenAnnotation =>
        entry.id === selectedPenAnnotationId && entry.type === "pen"
    );
    if (!annotation || String(annotation.id || "").startsWith(AI_DRAFT_OVERLAY_ID_PREFIX)) {
      return null;
    }
    return annotation;
  }, [role, selectedPenAnnotationId, state?.studentAnnotations, state?.teacherAnnotations]);
  const strokeControlsTool =
    tool === "cursor" && selectedPenAnnotation
      ? selectedPenAnnotation.tool === "highlighter"
        ? "highlighter"
        : "pen"
      : tool === "highlighter"
        ? "highlighter"
        : "pen";
  const drawingStrokeWidth = tool === "highlighter" ? highlighterWidth : penWidth;
  const activeStrokeWidth =
    tool === "cursor" && selectedPenAnnotation ? selectedPenAnnotation.width : drawingStrokeWidth;
  const activeStrokeWidthOptions =
    strokeControlsTool === "highlighter" ? HIGHLIGHTER_WIDTH_OPTIONS : PEN_WIDTH_OPTIONS;
  const activeStrokeColor =
    tool === "cursor" && selectedPenAnnotation ? selectedPenAnnotation.color : color;
  const selectedPenBounds = useMemo(
    () => (selectedPenAnnotation ? getPenBounds(selectedPenAnnotation) : null),
    [selectedPenAnnotation]
  );
  const selectedPenOverlayBounds = useMemo(
    () => (selectedPenBounds ? getPenSelectionOverlayBounds(selectedPenBounds) : null),
    [selectedPenBounds]
  );
  const selectedPenPage = useMemo(
    () =>
      selectedPenAnnotation
        ? pages.find((page) => page.pageNumber === selectedPenAnnotation.page) || null
        : null,
    [pages, selectedPenAnnotation]
  );
  const activeTextFontSize = editingText?.fontSize ?? textFontSize;
  const activeTextFontWeight = editingText?.fontWeight ?? textFontWeight;
  const activeTextUnderline = editingText?.underline ?? textUnderline;
  const activeTextAlignment = editingText?.textAlign ?? textAlignment;
  const activeTextAlignmentOption =
    TEXT_ALIGNMENT_OPTIONS.find((option) => option.value === activeTextAlignment) ||
    TEXT_ALIGNMENT_OPTIONS[0];
  const activeTextSizeOption =
    TEXT_SIZE_DROPDOWN_OPTIONS.find((option) => option.value === activeTextFontSize) || null;
  const examContainerRef = useRef<HTMLDivElement | null>(null);
  const toolbarChromeRef = useRef<HTMLDivElement | null>(null);
  const viewerScrollRef = useRef<HTMLDivElement | null>(null);
  const pagesViewportRef = useRef<HTMLDivElement | null>(null);
  const activeStrokeRef = useRef<PenAnnotation | null>(null);
  const activeAnnotationsRef = useRef<AssessmentDocumentAnnotation[]>([]);
  const historyGestureStartRef = useRef<AssessmentDocumentAnnotation[] | null>(null);
  const resizingTextRef = useRef<ResizingText | null>(null);
  const resizingPenRef = useRef<ResizingPen | null>(null);
  const draggingPenRef = useRef<DraggingPen | null>(null);
  const erasingRef = useRef(false);
  const draggingTextRef = useRef<DraggingText | null>(null);
  const touchPointersRef = useRef<Map<number, TrackedTouchPointer>>(new Map());
  const touchGestureRef = useRef<TouchGestureState | null>(null);
  const touchGestureFrameRef = useRef<number | null>(null);
  const pendingTouchPageActionRef = useRef<PendingTouchPageAction | null>(null);
  const suppressTouchClickRef = useRef(false);
  const annotationCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selfAssessmentSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const teacherDraftSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAutosaveRef = useRef<AssessmentDocumentAnnotation[] | null>(null);
  const lastAiMarkAnnouncementRef = useRef("");
  const lastSavedSelfAssessmentRef = useRef<number | null>(
    normalizeSelfAssessmentValue(initialSelfAssessmentMark)
  );
  const lastSavedTeacherDraftRef = useRef(
    JSON.stringify({
      teacherMarks: String(initialTeacherMarks || ""),
      teacherFeedback: String(initialTeacherFeedback || ""),
    })
  );
  const lastLiveSyncedSignatureRef = useRef<string>("");
  const lastRemoteSnapshotRef = useRef<string>("");
  const autoSubmittedExpiredExamRef = useRef(false);
  const autoDownloadAttemptedRef = useRef(false);
  const hiddenDuringExamRef = useRef(false);
  const approvedExamExitRef = useRef(false);
  const suppressExamExitPromptRef = useRef(false);
  const clientSaveIdRef = useRef(makeId());
  const paperTextCacheRef = useRef<string | null>(null);
  const visualAnswerCacheRef = useRef<string | null>(null);
  const clientSaveSeqRef = useRef(0);

  const localDraftKey = useMemo(
    () => getDocumentDraftKey(assessmentId, taskId, studentId, role),
    [assessmentId, role, studentId, taskId]
  );
  const documentLoadKey = useMemo(
    () => getDocumentLoadKey(assessmentId, taskId, studentId, fileUrl, role),
    [assessmentId, fileUrl, role, studentId, taskId]
  );

  const pdfRenderUrl = useMemo(() => {
    const metadataFileUrl = normalizeDocumentUrl(
      typeof state?.metadata?.documentFileUrl === "string"
        ? state.metadata.documentFileUrl
        : null
    );
    const currentFileUrl = normalizeDocumentUrl(fileUrl);
    const effectiveFileUrl = metadataFileUrl || currentFileUrl;
    if (!effectiveFileUrl) return "";
    return `/api/assessment-document/pdf?url=${encodeURIComponent(effectiveFileUrl)}`;
  }, [fileUrl, state?.metadata?.documentFileUrl]);

  const currentDocumentUrl = useMemo(() => normalizeDocumentUrl(fileUrl), [fileUrl]);
  const savedDocumentUrl = useMemo(
    () =>
      normalizeDocumentUrl(
        typeof state?.metadata?.documentFileUrl === "string"
          ? state.metadata.documentFileUrl
          : null
      ),
    [state?.metadata?.documentFileUrl]
  );
  const documentFileMismatch = Boolean(
    savedDocumentUrl && currentDocumentUrl && savedDocumentUrl !== currentDocumentUrl
  );

  const fileExtension = useMemo(() => {
    try {
      return new URL(fileUrl).pathname.split(".").pop()?.toLowerCase() || "";
    } catch {
      return fileUrl.split("?")[0].split(".").pop()?.toLowerCase() || "";
    }
  }, [fileUrl]);

  const examWindow = useMemo(
    () =>
      resolveExamWindow(
        {
          exam_mode: examMode,
          exam_start_at: examStartAt || null,
          exam_duration_minutes: examDurationMinutes ?? null,
          exam_end_at: examEndAt || null,
        },
        nowMs
      ),
    [examDurationMinutes, examEndAt, examMode, examStartAt, nowMs]
  );
  const examExitEvents = useMemo(() => {
    const rawEvents = Array.isArray(state?.metadata?.examExitEvents)
      ? (state?.metadata?.examExitEvents as ExamExitLogEntry[])
      : [];

    return [...rawEvents].sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
  }, [state?.metadata?.examExitEvents]);
  const touchFriendlyExamDevice = useMemo(() => isTouchFriendlyExamDevice(), []);
  const shouldEnforceExamScreen =
    role === "student" && examWindow.examMode && examWindow.state === "open";
  const shouldRequireExamFullscreen = shouldEnforceExamScreen && !touchFriendlyExamDevice;
  const examWatermarkText = useMemo(() => {
    const studentName = teacherExamStudentInfo?.studentName || "Selected student";
    const className = teacherExamStudentInfo?.className || "Exam mode";
    return `${studentName} • ${className} • ID ${studentId} • ${new Date(nowMs).toLocaleString()}`;
  }, [nowMs, studentId, teacherExamStudentInfo?.className, teacherExamStudentInfo?.studentName]);

  const studentLocked = state?.studentLocked ?? state?.status !== "draft";
  const examEditingLocked =
    (role === "student" && examWindow.examMode && examWindow.state !== "open") ||
    (shouldRequireExamFullscreen && !isExamFullscreen && !approvedExamExitRef.current);
  const activeAnnotations = role === "teacher" ? state?.teacherAnnotations || [] : state?.studentAnnotations || [];
  const studentAnnotations = state?.studentAnnotations || [];
  const teacherAnnotations = state?.teacherAnnotations || [];
  const documentIdentityUnverified = Boolean(
    role !== "student" && !savedDocumentUrl && currentDocumentUrl && studentAnnotations.length > 0
  );
  const editable = role === "teacher" || (!studentLocked && !examEditingLocked && !documentIdentityUnverified);
  const oppositeLayer = role === "teacher" ? "student" : "teacher";
  const documentLoaded = Boolean(state);
  const documentReadyForCurrentStudent = documentLoaded && loadedDocumentKey === documentLoadKey;
  const safeReturnTo = sanitizeReturnToPath(returnTo);
  const zoomPercent = Math.round(zoomLevel * 100);
  const canOpenOriginalFile = role !== "student";
  const displayStudentName = currentStudentName || teacherExamStudentInfo?.studentName || "Selected student";
  const canDownloadSubmittedPaper = role === "teacher" && documentLoaded && (studentLocked || state?.status === "submitted" || state?.status === "marked");
  const canEditSelectedStroke = tool === "cursor" && Boolean(selectedPenAnnotation);
  const hasReadableStudentAnnotation = studentAnnotations.some(
    (annotation) =>
      (annotation.type === "text" && String(annotation.text ?? "").trim().length > 0) ||
      (annotation.type === "pen" && getSafePenPoints(annotation).length > 0)
  );
  const hasReadableStudentAnswer =
    hasReadableStudentAnnotation ||
    (role === "teacher" && documentLoaded && pages.length > 0 && (studentLocked || state?.status === "submitted" || state?.status === "marked"));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateVisualViewportState = () => {
      const visualViewport = window.visualViewport;
      setVisualViewportScale(visualViewport?.scale || 1);
      setVisualViewportOffset({
        left: visualViewport?.offsetLeft || 0,
        top: visualViewport?.offsetTop || 0,
        width: visualViewport?.width || window.innerWidth,
      });
    };

    updateVisualViewportState();
    window.visualViewport?.addEventListener("resize", updateVisualViewportState);
    window.visualViewport?.addEventListener("scroll", updateVisualViewportState);
    window.addEventListener("resize", updateVisualViewportState);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateVisualViewportState);
      window.visualViewport?.removeEventListener("scroll", updateVisualViewportState);
      window.removeEventListener("resize", updateVisualViewportState);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const toolbarChrome = toolbarChromeRef.current;
    if (!toolbarChrome) return;

    const updateToolbarHeight = () => setToolbarHeight(toolbarChrome.offsetHeight);
    updateToolbarHeight();

    const resizeObserver = new ResizeObserver(updateToolbarHeight);
    resizeObserver.observe(toolbarChrome);

    return () => resizeObserver.disconnect();
  }, [role, studentSwitcherOptions.length, tool, zoomPercent]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCollectAiContext = (event: Event) => {
      const detail = (event as CustomEvent<{ contexts?: Array<Record<string, unknown>> }>).detail;
      if (!detail?.contexts) return;

      const typedAnswers = studentAnnotations
        .filter((annotation) => annotation.type === "text")
        .map((annotation) => {
          const text = String((annotation as { text?: unknown }).text ?? "").trim();
          if (!text) return "";
          return `[Page ${annotation.page}, y=${Math.round(Number((annotation as { y?: unknown }).y || 0))}] ${text}`;
        })
        .filter(Boolean)
        .join("\n")
        .slice(0, 8000);

      const answerPages = Array.from(
        new Set(
          studentAnnotations
            .map((annotation) => Number(annotation.page || 0))
            .filter((pageNumber) => Number.isFinite(pageNumber) && pageNumber > 0)
        )
      ).sort((left, right) => left - right);

      const penCount = studentAnnotations.filter(
        (annotation) => annotation.type === "pen" && getSafePenPoints(annotation).length > 0
      ).length;
      const reliableAiDraftPreview = isReliableAiDraft(aiDraftPreview) ? aiDraftPreview : null;

      detail.contexts.push({
        page: "assessment document / online PDF marking workspace",
        title,
        subject: subjectName ?? undefined,
        maxMarks: maxMarks ?? undefined,
        fileUrl,
        suggestedMark: reliableAiDraftPreview?.suggestedMark ?? undefined,
        feedback: reliableAiDraftPreview?.feedback,
        rationale: reliableAiDraftPreview?.rationale,
        studentAnswer: typedAnswers,
        questionBreakdown: reliableAiDraftPreview?.questionBreakdown
          ? JSON.stringify(reliableAiDraftPreview.questionBreakdown).slice(0, 8000)
          : undefined,
        assessmentContext: [
          `Role: ${role}`,
          `Document status: ${state?.status || "unknown"}`,
          `PDF pages rendered: ${pages.length}`,
          `Student answer pages: ${answerPages.join(", ") || "none detected"}`,
          `Typed answer boxes: ${studentAnnotations.filter((annotation) => annotation.type === "text").length}`,
          `Pen/handwriting marks: ${penCount}`,
          `Current teacher mark field: ${teacherMarks || "blank"}`,
          `Current teacher feedback field: ${teacherFeedback || "blank"}`,
          canDownloadSubmittedPaper ? "Submitted/locked paper can be downloaded." : "Submitted paper download may not be available yet.",
        ].join("\n"),
      });
    };

    window.addEventListener("osteps:collect-ai-context", handleCollectAiContext);
    return () => window.removeEventListener("osteps:collect-ai-context", handleCollectAiContext);
  }, [
    aiDraftPreview,
    canDownloadSubmittedPaper,
    maxMarks,
    pages.length,
    role,
    state?.status,
    studentAnnotations,
    subjectName,
    teacherFeedback,
    teacherMarks,
    title,
  ]);

  const autosaveStatusLabel = saving
    ? "Saving"
    : autosaveQueued
    ? "Queued"
    : lastSavedAt
    ? "Saved"
    : "Ready";
  const autosaveStatusColor = saving
    ? "blue"
    : autosaveQueued
    ? "gold"
    : lastSavedAt
    ? "green"
    : "default";

  const cancelTouchGestureFrame = useCallback(() => {
    if (typeof window === "undefined") return;
    if (touchGestureFrameRef.current == null) return;
    window.cancelAnimationFrame(touchGestureFrameRef.current);
    touchGestureFrameRef.current = null;
  }, []);

  const clearTransientPointerState = useCallback(() => {
    activeStrokeRef.current = null;
    setActiveStroke(null);
    erasingRef.current = false;
    pendingTouchPageActionRef.current = null;
    draggingTextRef.current = null;
    resizingTextRef.current = null;
    setResizingText(false);
    resizingPenRef.current = null;
    setResizingPen(false);
    draggingPenRef.current = null;
    setDraggingPen(false);
    historyGestureStartRef.current = null;
  }, []);

  const applyTouchGestureVerticalScroll = useCallback((delta: number) => {
    if (typeof window === "undefined" || Math.abs(delta) < 0.5) return;

    const scrollHost = viewerScrollRef.current;
    if (scrollHost && scrollHost.scrollHeight > scrollHost.clientHeight + 1) {
      const maxScrollTop = Math.max(0, scrollHost.scrollHeight - scrollHost.clientHeight);
      scrollHost.scrollTop = Math.min(Math.max(scrollHost.scrollTop + delta, 0), maxScrollTop);
      return;
    }

    const scrollElement = document.scrollingElement ?? document.documentElement;
    const maxScrollTop = Math.max(0, scrollElement.scrollHeight - window.innerHeight);
    scrollElement.scrollTop = Math.min(Math.max(scrollElement.scrollTop + delta, 0), maxScrollTop);
  }, []);

  const syncTouchGesture = useCallback(() => {
    if (typeof window === "undefined") return;

    const viewport = pagesViewportRef.current;
    const touchGesture = touchGestureRef.current;
    if (!viewport || !touchGesture) return;

    const points = getTrackedTouchPoints(touchPointersRef.current);
    if (points.length < 2) return;

    const center = getTouchGestureCenter(points);
    const distance = Math.max(getTouchGestureDistance(points), 1);
    const nextZoomLevel = clampZoomLevel(
      touchGesture.initialZoomLevel * (distance / touchGesture.initialDistance)
    );

    setZoomLevel((current) => (current === nextZoomLevel ? current : nextZoomLevel));

    cancelTouchGestureFrame();
    touchGestureFrameRef.current = window.requestAnimationFrame(() => {
      touchGestureFrameRef.current = null;

      const nextViewport = pagesViewportRef.current;
      if (!nextViewport) return;

      const rect = nextViewport.getBoundingClientRect();
      const nextScrollLeft =
        touchGesture.initialContentX * nextZoomLevel - (center.x - rect.left);
      const maxScrollLeft = Math.max(0, nextViewport.scrollWidth - nextViewport.clientWidth);
      nextViewport.scrollLeft = Math.min(Math.max(nextScrollLeft, 0), maxScrollLeft);

      const desiredViewportTop = center.y - touchGesture.initialContentY * nextZoomLevel;
      applyTouchGestureVerticalScroll(rect.top - desiredViewportTop);
    });
  }, [applyTouchGestureVerticalScroll, cancelTouchGestureFrame]);

  const startTouchGesture = useCallback(() => {
    const viewport = pagesViewportRef.current;
    if (!viewport || zoomLevel <= 0) return;

    const points = getTrackedTouchPoints(touchPointersRef.current);
    if (points.length < 2) return;

    const center = getTouchGestureCenter(points);
    const rect = viewport.getBoundingClientRect();
    touchGestureRef.current = {
      initialDistance: Math.max(getTouchGestureDistance(points), 1),
      initialZoomLevel: zoomLevel,
      initialContentX: (viewport.scrollLeft + center.x - rect.left) / zoomLevel,
      initialContentY: (center.y - rect.top) / zoomLevel,
    };
    suppressTouchClickRef.current = true;
    clearTransientPointerState();
    syncTouchGesture();
  }, [clearTransientPointerState, syncTouchGesture, zoomLevel]);

  const syncNativeTouchList = useCallback((touches: TouchList) => {
    touchPointersRef.current.clear();
    for (let index = 0; index < Math.min(touches.length, 2); index += 1) {
      const touch = touches.item(index);
      if (!touch) continue;
      touchPointersRef.current.set(getNativeTouchPointerId(touch), {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    }
  }, []);

  const handlePaperTouchStartCapture = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (event.touches.length === 0) return;
      if (
        editable &&
        event.touches.length === 1 &&
        (tool === "pen" || tool === "highlighter" || tool === "eraser")
      ) {
        return;
      }
      pendingTouchPageActionRef.current = null;
      touchGestureRef.current = null;
      touchPointersRef.current.clear();
    },
    [editable, tool]
  );

  const handlePaperTouchMoveCapture = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (event.touches.length === 0) return;
      if (
        editable &&
        event.touches.length === 1 &&
        (tool === "pen" || tool === "highlighter" || tool === "eraser")
      ) {
        return;
      }
      pendingTouchPageActionRef.current = null;
      touchGestureRef.current = null;
      touchPointersRef.current.clear();
    },
    [editable, tool]
  );

  const handlePaperTouchEndCapture = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      pendingTouchPageActionRef.current = null;
      touchGestureRef.current = null;
      touchPointersRef.current.clear();

      if (event.touches.length === 0) {
        cancelTouchGestureFrame();
        window.setTimeout(() => {
          suppressTouchClickRef.current = false;
        }, 0);
      }
    },
    [cancelTouchGestureFrame]
  );

  useEffect(() => {
    const container = examContainerRef.current;
    if (!container || typeof window === "undefined") return;

    const isPaperTouchTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest("[data-page-number]"));

    const handleTouchPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      if (isPaperTouchTarget(event.target)) return;

      touchPointersRef.current.set(event.pointerId, {
        clientX: event.clientX,
        clientY: event.clientY,
      });

      if (touchPointersRef.current.size < 2) return;

      event.preventDefault();
      event.stopPropagation();

      if (!touchGestureRef.current) {
        startTouchGesture();
        return;
      }

      syncTouchGesture();
    };

    const handleTouchPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      if (isPaperTouchTarget(event.target)) return;
      if (!touchPointersRef.current.has(event.pointerId)) return;

      touchPointersRef.current.set(event.pointerId, {
        clientX: event.clientX,
        clientY: event.clientY,
      });

      if (touchGestureRef.current || touchPointersRef.current.size >= 2) {
        event.preventDefault();
        event.stopPropagation();

        if (!touchGestureRef.current && touchPointersRef.current.size >= 2) {
          startTouchGesture();
          return;
        }

        syncTouchGesture();
      }
    };

    const handleTouchPointerEnd = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      if (isPaperTouchTarget(event.target)) return;

      const hadPointer = touchPointersRef.current.delete(event.pointerId);
      if (!hadPointer && !touchGestureRef.current && !suppressTouchClickRef.current) return;

      if (touchGestureRef.current || suppressTouchClickRef.current) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (touchPointersRef.current.size < 2) {
        touchGestureRef.current = null;
      }

      if (touchPointersRef.current.size === 0) {
        cancelTouchGestureFrame();
        window.setTimeout(() => {
          suppressTouchClickRef.current = false;
        }, 0);
      }
    };

    const syncNativeTouches = (touches: TouchList) => {
      touchPointersRef.current.clear();
      for (let index = 0; index < Math.min(touches.length, 2); index += 1) {
        const touch = touches.item(index);
        if (!touch) continue;
        touchPointersRef.current.set(getNativeTouchPointerId(touch), {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
      }
    };

    const handleNativeTouchStart = (event: TouchEvent) => {
      if (isPaperTouchTarget(event.target)) return;
      if (event.touches.length < 2) return;

      event.preventDefault();
      event.stopPropagation();
      syncNativeTouches(event.touches);

      if (!touchGestureRef.current) {
        startTouchGesture();
        return;
      }

      syncTouchGesture();
    };

    const handleNativeTouchMove = (event: TouchEvent) => {
      if (isPaperTouchTarget(event.target)) return;
      if (!touchGestureRef.current && event.touches.length < 2) return;

      event.preventDefault();
      event.stopPropagation();
      syncNativeTouches(event.touches);

      if (!touchGestureRef.current && touchPointersRef.current.size >= 2) {
        startTouchGesture();
        return;
      }

      syncTouchGesture();
    };

    const handleNativeTouchEnd = (event: TouchEvent) => {
      if (isPaperTouchTarget(event.target)) return;
      if (!touchGestureRef.current && !suppressTouchClickRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      syncNativeTouches(event.touches);

      if (event.touches.length < 2) {
        touchGestureRef.current = null;
      }

      if (event.touches.length === 0) {
        touchPointersRef.current.clear();
        cancelTouchGestureFrame();
        window.setTimeout(() => {
          suppressTouchClickRef.current = false;
        }, 0);
      }
    };

    container.addEventListener("pointerdown", handleTouchPointerDown, {
      capture: true,
      passive: false,
    });
    container.addEventListener("pointermove", handleTouchPointerMove, {
      capture: true,
      passive: false,
    });
    container.addEventListener("pointerup", handleTouchPointerEnd, {
      capture: true,
      passive: false,
    });
    container.addEventListener("pointercancel", handleTouchPointerEnd, {
      capture: true,
      passive: false,
    });
    container.addEventListener("touchstart", handleNativeTouchStart, {
      capture: true,
      passive: false,
    });
    container.addEventListener("touchmove", handleNativeTouchMove, {
      capture: true,
      passive: false,
    });
    container.addEventListener("touchend", handleNativeTouchEnd, {
      capture: true,
      passive: false,
    });
    container.addEventListener("touchcancel", handleNativeTouchEnd, {
      capture: true,
      passive: false,
    });

    return () => {
      container.removeEventListener("pointerdown", handleTouchPointerDown, true);
      container.removeEventListener("pointermove", handleTouchPointerMove, true);
      container.removeEventListener("pointerup", handleTouchPointerEnd, true);
      container.removeEventListener("pointercancel", handleTouchPointerEnd, true);
      container.removeEventListener("touchstart", handleNativeTouchStart, true);
      container.removeEventListener("touchmove", handleNativeTouchMove, true);
      container.removeEventListener("touchend", handleNativeTouchEnd, true);
      container.removeEventListener("touchcancel", handleNativeTouchEnd, true);
      touchPointersRef.current.clear();
      touchGestureRef.current = null;
      cancelTouchGestureFrame();
    };
  }, [cancelTouchGestureFrame, startTouchGesture, syncTouchGesture]);

  const renderErrorMessage =
    !renderError || canOpenOriginalFile
      ? renderError
      : renderError.replace(
          /Use the original file link below,? or check that the file allows browser access\./i,
          "Ask your teacher to check the uploaded file."
        );

  useEffect(() => {
    if (role !== "student" || !examWindow.examMode) return;

    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [examWindow.examMode, role]);

  useEffect(() => {
    const nextSelfAssessmentMark = normalizeSelfAssessmentValue(initialSelfAssessmentMark);
    setSelfAssessmentMark(nextSelfAssessmentMark);
    lastSavedSelfAssessmentRef.current = nextSelfAssessmentMark;
  }, [initialSelfAssessmentMark]);

  useEffect(() => {
    setTextFontSize(role === "teacher" ? 18 : 16);
  }, [role]);

  const isExamFullscreenActive = useCallback(() => {
    if (typeof document === "undefined") return false;

    const fullscreenDocument = document as FullscreenCapableDocument;
    const currentFullscreenElement = getCurrentFullscreenElement(fullscreenDocument);
    return (
      currentFullscreenElement === fullscreenDocument.documentElement ||
      currentFullscreenElement === examContainerRef.current
    );
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const fullscreenTarget = document.documentElement as FullscreenCapableElement;
    setExamFullscreenSupported(
      Boolean(
        fullscreenTarget.requestFullscreen ||
          fullscreenTarget.webkitRequestFullscreen ||
          fullscreenTarget.msRequestFullscreen
      )
    );
  }, []);

  const requestExamFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return false;

    const fullscreenDocument = document as FullscreenCapableDocument;
    const fullscreenTarget = fullscreenDocument.documentElement as FullscreenCapableElement;

    if (isExamFullscreenActive()) {
      setIsExamFullscreen(true);
      return true;
    }

    if (
      !fullscreenTarget.requestFullscreen &&
      !fullscreenTarget.webkitRequestFullscreen &&
      !fullscreenTarget.msRequestFullscreen
    ) {
      setExamFullscreenSupported(false);
      setIsExamFullscreen(false);
      return false;
    }

    try {
      if (fullscreenTarget.requestFullscreen) {
        try {
          await fullscreenTarget.requestFullscreen({ navigationUI: "hide" });
        } catch {
          await fullscreenTarget.requestFullscreen();
        }
      } else if (fullscreenTarget.webkitRequestFullscreen) {
        await Promise.resolve(fullscreenTarget.webkitRequestFullscreen());
      } else if (fullscreenTarget.msRequestFullscreen) {
        await Promise.resolve(fullscreenTarget.msRequestFullscreen());
      }

      const isNowFullscreen = isExamFullscreenActive();
      setExamFullscreenSupported(true);
      setIsExamFullscreen(isNowFullscreen);
      return isNowFullscreen;
    } catch (error) {
      console.error("Failed to enter exam fullscreen:", error);
      const isNowFullscreen = isExamFullscreenActive();
      setIsExamFullscreen(isNowFullscreen);
      return isNowFullscreen;
    }
  }, [isExamFullscreenActive]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const updateFullscreenState = () => {
      setIsExamFullscreen(isExamFullscreenActive());
    };

    updateFullscreenState();
    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("webkitfullscreenchange", updateFullscreenState);
    document.addEventListener("MSFullscreenChange", updateFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
      document.removeEventListener("webkitfullscreenchange", updateFullscreenState);
      document.removeEventListener("MSFullscreenChange", updateFullscreenState);
    };
  }, [isExamFullscreenActive]);

  useEffect(() => {
    approvedExamExitRef.current = false;
  }, [assessmentId, studentId, taskId]);

  useEffect(() => {
    if (role !== "teacher" && !(role === "student" && examWindow.examMode)) return;

    let cancelled = false;
    const loadTeacherExamStudentInfo = async () => {
      try {
        const profile = await fetchStudentProfileData(studentId, 0);
        if (!cancelled) {
          setTeacherExamStudentInfo({
            studentName:
              String(profile?.student_name ?? profile?.name ?? "Selected student").trim() ||
              "Selected student",
            className: extractStudentClassName(profile),
          });
        }
      } catch (error) {
        console.error("Failed to load student profile for exam alerts:", error);
        if (!cancelled) {
          setTeacherExamStudentInfo({
            studentName: "Selected student",
            className: "Unknown class",
          });
        }
      }
    };

    void loadTeacherExamStudentInfo();

    return () => {
      cancelled = true;
    };
  }, [examWindow.examMode, role, studentId]);

  useEffect(() => {
    setTeacherExamAlertDismissed(false);
  }, [assessmentId, studentId, taskId, examExitEvents.length, examExitEvents[0]?.createdAt]);

  useEffect(() => {
    if (!shouldRequireExamFullscreen) {
      setExamStartModalOpen(false);
      setExamExitModalOpen(false);
      hiddenDuringExamRef.current = false;
      return;
    }

    void requestExamFullscreen();
  }, [requestExamFullscreen, shouldRequireExamFullscreen]);

  useEffect(() => {
    if (!shouldRequireExamFullscreen || approvedExamExitRef.current) {
      setExamStartModalOpen(false);
      return;
    }

    if (!isExamFullscreen && !examExitModalOpen) {
      setExamStartModalOpen(true);
      return;
    }

    if (isExamFullscreen) {
      setExamStartModalOpen(false);
    }
  }, [examExitModalOpen, isExamFullscreen, shouldRequireExamFullscreen]);

  useEffect(() => {
    if (!shouldRequireExamFullscreen || typeof document === "undefined") return;

    const handleFullscreenChange = () => {
      const isCurrentFullscreen = isExamFullscreenActive();
      setIsExamFullscreen(isCurrentFullscreen);

      if (
        !isCurrentFullscreen &&
        !approvedExamExitRef.current &&
        !suppressExamExitPromptRef.current
      ) {
        setExamStartModalOpen(false);
        setExamExitContext("fullscreen");
        setExamExitModalOpen(true);
      }

      suppressExamExitPromptRef.current = false;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isExamFullscreenActive, shouldRequireExamFullscreen]);

  useEffect(() => {
    if (!shouldRequireExamFullscreen || typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        hiddenDuringExamRef.current = true;
        return;
      }

      if (hiddenDuringExamRef.current && !approvedExamExitRef.current) {
        hiddenDuringExamRef.current = false;
        setExamStartModalOpen(false);
        setExamExitContext("screen");
        setExamExitModalOpen(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [shouldRequireExamFullscreen]);

  useEffect(() => {
    if (!shouldEnforceExamScreen || typeof window === "undefined") return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (approvedExamExitRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldEnforceExamScreen]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const rootStyle = document.documentElement.style;
    const bodyStyle = document.body.style;
    const previousRootOverflow = rootStyle.overflow;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousRootOverscroll = rootStyle.overscrollBehavior;
    const previousBodyOverscroll = bodyStyle.overscrollBehavior;

    if (shouldEnforceExamScreen) {
      rootStyle.overflow = "hidden";
      bodyStyle.overflow = "hidden";
      rootStyle.overscrollBehavior = "none";
      bodyStyle.overscrollBehavior = "none";
    }

    return () => {
      rootStyle.overflow = previousRootOverflow;
      bodyStyle.overflow = previousBodyOverflow;
      rootStyle.overscrollBehavior = previousRootOverscroll;
      bodyStyle.overscrollBehavior = previousBodyOverscroll;
    };
  }, [shouldEnforceExamScreen]);

  useEffect(() => {
    if (!shouldEnforceExamScreen || typeof document === "undefined") return;

    const handleGuardedNavigationClick = (event: MouseEvent) => {
      if (approvedExamExitRef.current) return;

      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest(".ant-modal-root")) return;

      const actionableElement = target.closest("a,button");
      if (!actionableElement) return;
      if (examContainerRef.current?.contains(actionableElement)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setExamStartModalOpen(false);
      setExamExitContext("leave");
      setExamExitModalOpen(true);
    };

    document.addEventListener("click", handleGuardedNavigationClick, true);
    return () => {
      document.removeEventListener("click", handleGuardedNavigationClick, true);
    };
  }, [shouldEnforceExamScreen]);

  useEffect(() => {
    if (!shouldEnforceExamScreen || typeof window === "undefined") return;

    const stateMarker = {
      examGuard: true,
      assessmentId,
      taskId,
      studentId,
      at: Date.now(),
    };

    window.history.pushState(stateMarker, "", window.location.href);

    const handlePopState = () => {
      if (approvedExamExitRef.current) return;

      window.history.pushState(stateMarker, "", window.location.href);
      setExamStartModalOpen(false);
      setExamExitContext("leave");
      setExamExitModalOpen(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [assessmentId, shouldEnforceExamScreen, studentId, taskId]);

  useEffect(() => {
    activeAnnotationsRef.current = activeAnnotations;
  }, [activeAnnotations]);

  useEffect(() => {
    if (tool !== "cursor") {
      draggingPenRef.current = null;
      setDraggingPen(false);
      resizingPenRef.current = null;
      setResizingPen(false);
      setSelectedPenAnnotationId(null);
      return;
    }
    if (selectedPenAnnotationId && !selectedPenAnnotation) {
      draggingPenRef.current = null;
      setDraggingPen(false);
      resizingPenRef.current = null;
      setResizingPen(false);
      setSelectedPenAnnotationId(null);
    }
  }, [selectedPenAnnotation, selectedPenAnnotationId, tool]);

  const getAnnotationsSignature = useCallback(
    (annotations: AssessmentDocumentAnnotation[]) => JSON.stringify(annotations),
    []
  );

  const getCurrentLayerSnapshot = useCallback(() => {
    const activeStroke = activeStrokeRef.current;
    if (!activeStroke) return activeAnnotationsRef.current;

    const baseAnnotations = activeAnnotationsRef.current.filter(
      (annotation) => annotation.id !== activeStroke.id
    );

    return [...baseAnnotations, activeStroke];
  }, []);

  const beginHistoryGesture = useCallback(() => {
    historyGestureStartRef.current = cloneAnnotationsSnapshot(activeAnnotationsRef.current);
  }, []);

  const consumeHistoryGesture = useCallback(() => {
    const snapshot = historyGestureStartRef.current;
    historyGestureStartRef.current = null;
    return snapshot;
  }, []);

  const pushUndoSnapshot = useCallback(
    (previousAnnotations: AssessmentDocumentAnnotation[]) => {
      setUndoStack((current) =>
        [...current, cloneAnnotationsSnapshot(previousAnnotations)].slice(-HISTORY_STACK_LIMIT)
      );
    },
    []
  );

  const persistLocalDraft = useCallback(
    (annotations: AssessmentDocumentAnnotation[], metadata?: Record<string, unknown>) => {
      if (typeof window === "undefined") return;

      try {
        window.localStorage.setItem(
          localDraftKey,
          JSON.stringify({
            annotations,
            metadata: metadata || {},
            updatedAtMs: Date.now(),
            signature: getAnnotationsSignature(annotations),
          })
        );
      } catch {
        // localStorage is only a safety net; server save remains primary.
      }
    },
    [getAnnotationsSignature, localDraftKey]
  );

  const saveAnnotations = useCallback(
    async (
      nextAnnotations: AssessmentDocumentAnnotation[],
      nextStatus?: "draft" | "submitted" | "marked",
      options?: {
        syncState?: boolean;
        studentLocked?: boolean;
        silent?: boolean;
        metadata?: Record<string, unknown>;
      }
    ) => {
      const metadataOverrides = options?.metadata || {};
      const nextSelfAssessmentMark = normalizeSelfAssessmentValue(
        Object.prototype.hasOwnProperty.call(metadataOverrides, "selfAssessmentMark")
          ? metadataOverrides.selfAssessmentMark
          : selfAssessmentMark
      );

      const nextClientSaveSeq = clientSaveSeqRef.current + 1;
      clientSaveSeqRef.current = nextClientSaveSeq;
      const metadata = {
        title,
        maxMarks,
        documentFileUrl: normalizeDocumentUrl(fileUrl),
        teacherMarks,
        teacherFeedback,
        ...metadataOverrides,
        selfAssessmentMark: nextSelfAssessmentMark,
        clientSaveId: clientSaveIdRef.current,
        clientSaveSeq: nextClientSaveSeq,
        clientSavedAt: new Date().toISOString(),
        annotationsCount: nextAnnotations.length,
      };

      persistLocalDraft(nextAnnotations, metadata);

      if (!options?.silent) setSaving(true);
      const nextState = await saveAssessmentDocumentAnnotations({
        assessmentId,
        taskId,
        studentId,
        layer: role,
        annotations: nextAnnotations,
        status: nextStatus,
        studentLocked: options?.studentLocked,
        metadata,
      });
      lastSavedSelfAssessmentRef.current = nextSelfAssessmentMark;
      lastLiveSyncedSignatureRef.current = getAnnotationsSignature(nextAnnotations);
      if (options?.syncState !== false) setState(nextState);
      setLastSavedAt(new Date().toLocaleTimeString());
      if (!options?.silent) setSaving(false);
      return nextState;
    },
    [assessmentId, taskId, studentId, role, title, maxMarks, fileUrl, teacherMarks, teacherFeedback, selfAssessmentMark, getAnnotationsSignature, persistLocalDraft]
  );

  const persistExamExitReason = useCallback(
    async (reason: string, context: ExamExitContext) => {
      const existingLogs = Array.isArray(state?.metadata?.examExitEvents)
        ? (state?.metadata?.examExitEvents as ExamExitLogEntry[])
        : [];
      const nextEntry: ExamExitLogEntry = {
        reason: reason.trim(),
        context,
        createdAt: new Date().toISOString(),
        role,
      };

      await saveAnnotations(getCurrentLayerSnapshot(), undefined, {
        metadata: {
          examExitEvents: [...existingLogs, nextEntry],
          lastExamExitReason: nextEntry.reason,
          lastExamExitContext: context,
          lastExamExitAt: nextEntry.createdAt,
        },
        silent: true,
      });
    },
    [getCurrentLayerSnapshot, role, saveAnnotations, state?.metadata?.examExitEvents]
  );

  useEffect(() => {
    if (!shouldEnforceExamScreen || typeof window === "undefined") return;

    const recordScreenshotAttempt = (reason: string) => {
      setScreenshotWarningVisible(true);
      messageApi.warning("Screenshots, printing, saving, and downloading are not allowed during exam mode. This attempt has been recorded.");
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText("Screenshots are not allowed during this OSTEPS exam.")
          .catch(() => undefined);
      }
      persistExamExitReason(reason, "screen").catch((error) => {
        console.error("Could not record screenshot attempt:", error);
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = String(event.key || "").toLowerCase();
      const printScreenAttempt = key === "printscreen" || key === "print screen";
      const printAttempt = (event.ctrlKey || event.metaKey) && key === "p";
      const saveAttempt = (event.ctrlKey || event.metaKey) && key === "s";
      const downloadAttempt = (event.ctrlKey || event.metaKey) && (key === "d" || key === "j");

      if (!printScreenAttempt && !printAttempt && !saveAttempt && !downloadAttempt) return;

      event.preventDefault();
      event.stopPropagation();
      recordScreenshotAttempt(
        printAttempt
          ? "Print attempt detected during exam mode."
          : saveAttempt
          ? "Save/download attempt detected during exam mode."
          : downloadAttempt
          ? "Download shortcut attempt detected during exam mode."
          : "Screenshot attempt detected during exam mode."
      );
    };

    const handleBeforePrint = () => {
      recordScreenshotAttempt("Print/screenshot attempt detected during exam mode.");
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      recordScreenshotAttempt("Right-click/download menu attempt detected during exam mode.");
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("contextmenu", handleContextMenu, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("contextmenu", handleContextMenu, true);
    };
  }, [messageApi, persistExamExitReason, shouldEnforceExamScreen]);

  const queueAutosave = useCallback(
    (nextAnnotations: AssessmentDocumentAnnotation[]) => {
      pendingAutosaveRef.current = nextAnnotations;
      setAutosaveQueued(true);
      if (saveTimerRef.current) return;

      saveTimerRef.current = setTimeout(() => {
        const pendingAnnotations = pendingAutosaveRef.current;
        saveTimerRef.current = null;
        pendingAutosaveRef.current = null;
        setAutosaveQueued(false);

        if (!pendingAnnotations) return;
        saveAnnotations(pendingAnnotations, undefined, { syncState: false }).catch((error) => {
          console.error(error);
          messageApi.error("Autosave failed. Please save manually.");
          setSaving(false);
        });
      }, AUTOSAVE_DELAY_MS);
    },
    [messageApi, saveAnnotations]
  );

  const setLayerAnnotations = useCallback(
    (
      nextAnnotations: AssessmentDocumentAnnotation[],
      options?: {
        preserveRedo?: boolean;
        previousAnnotations?: AssessmentDocumentAnnotation[];
        skipHistory?: boolean;
      }
    ) => {
      const previousAnnotations = options?.previousAnnotations ?? activeAnnotationsRef.current;
      const annotationsChanged =
        getAnnotationsSignature(previousAnnotations) !==
        getAnnotationsSignature(nextAnnotations);

      activeAnnotationsRef.current = nextAnnotations;
      persistLocalDraft(nextAnnotations);
      if (annotationsChanged && !options?.skipHistory) {
        pushUndoSnapshot(previousAnnotations);
      }
      if (annotationsChanged && !options?.preserveRedo) setRedoStack([]);
      setState((prev) => {
        if (!prev) return prev;
        const nextState = {
          ...prev,
          ...(role === "teacher"
            ? { teacherAnnotations: nextAnnotations }
            : { studentAnnotations: nextAnnotations }),
        };
        return nextState;
      });
      if (annotationsChanged) {
        queueAutosave(nextAnnotations);
      }
    },
    [getAnnotationsSignature, persistLocalDraft, pushUndoSnapshot, queueAutosave, role]
  );

  const setLayerAnnotationsLocally = useCallback(
    (
      nextAnnotations: AssessmentDocumentAnnotation[],
      options?: { preserveRedo?: boolean }
    ) => {
      const annotationsChanged =
        getAnnotationsSignature(activeAnnotationsRef.current) !==
        getAnnotationsSignature(nextAnnotations);

      activeAnnotationsRef.current = nextAnnotations;
      persistLocalDraft(nextAnnotations);
      if (annotationsChanged && !options?.preserveRedo) setRedoStack([]);
      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...(role === "teacher"
            ? { teacherAnnotations: nextAnnotations }
            : { studentAnnotations: nextAnnotations }),
        };
      });
    },
    [getAnnotationsSignature, persistLocalDraft, role]
  );

  const deleteSelectedPenAnnotation = useCallback(() => {
    if (!editable || !selectedPenAnnotation) return;
    draggingPenRef.current = null;
    setDraggingPen(false);
    resizingPenRef.current = null;
    setResizingPen(false);
    setSelectedPenAnnotationId(null);
    setLayerAnnotations(
      activeAnnotationsRef.current.filter((annotation) => annotation.id !== selectedPenAnnotation.id)
    );
  }, [editable, selectedPenAnnotation, setLayerAnnotations]);

  useEffect(() => {
    if (typeof window === "undefined" || !editable || tool !== "cursor" || !selectedPenAnnotation) {
      return;
    }

    const handleDeleteKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      const tagName = String(target?.tagName || "").toLowerCase();
      if (
        target?.isContentEditable ||
        ["input", "textarea", "select", "button"].includes(tagName) ||
        target?.closest(".ant-input") ||
        target?.closest(".ant-input-number") ||
        target?.closest("[contenteditable='true']")
      ) {
        return;
      }

      if (event.key !== "Delete" && event.key !== "Backspace") return;

      event.preventDefault();
      event.stopPropagation();
      deleteSelectedPenAnnotation();
    };

    window.addEventListener("keydown", handleDeleteKey, true);
    return () => {
      window.removeEventListener("keydown", handleDeleteKey, true);
    };
  }, [deleteSelectedPenAnnotation, editable, selectedPenAnnotation, tool]);

  const updateSelectedPenAnnotation = useCallback(
    (updates: Partial<Pick<PenAnnotation, "color" | "width" | "points">>) => {
      if (!selectedPenAnnotation) return;
      const previousAnnotations = cloneAnnotationsSnapshot(activeAnnotationsRef.current);
      const nextAnnotations = activeAnnotationsRef.current.map((annotation) =>
        annotation.id === selectedPenAnnotation.id && annotation.type === "pen"
          ? { ...annotation, ...updates }
          : annotation
      );
      setLayerAnnotations(nextAnnotations, { previousAnnotations });
    },
    [selectedPenAnnotation, setLayerAnnotations]
  );

  const handleStrokeColorChange = useCallback(
    (nextColor: string) => {
      setColor(nextColor);
      if (tool === "cursor" && selectedPenAnnotation) {
        updateSelectedPenAnnotation({ color: nextColor });
      }
    },
    [selectedPenAnnotation, tool, updateSelectedPenAnnotation]
  );

  const handleStrokeWidthChange = useCallback(
    (widthValue: number) => {
      if (strokeControlsTool === "highlighter") {
        setHighlighterWidth(widthValue);
      } else {
        setPenWidth(widthValue);
      }

      if (tool === "cursor" && selectedPenAnnotation) {
        updateSelectedPenAnnotation({ width: widthValue });
      }
    },
    [selectedPenAnnotation, strokeControlsTool, tool, updateSelectedPenAnnotation]
  );

  const startResizeSelectedPen = useCallback(
    (event: React.PointerEvent<HTMLElement>, edge: "left" | "right") => {
      if (!editable || tool !== "cursor" || !selectedPenAnnotation) return;
      if (
        event.pointerType === "touch" &&
        (touchGestureRef.current || touchPointersRef.current.size >= 2)
      ) {
        return;
      }

      const originBounds = getPenBounds(selectedPenAnnotation);
      if (!originBounds) return;

      event.preventDefault();
      event.stopPropagation();
      beginHistoryGesture();
      resizingPenRef.current = {
        id: selectedPenAnnotation.id,
        edge,
        startClientX: event.clientX,
        originPoints: getSafePenPoints(selectedPenAnnotation).map((point) => ({ ...point })),
        originBounds,
      };
      setResizingPen(true);
    },
    [beginHistoryGesture, editable, selectedPenAnnotation, tool]
  );

  const startDragSelectedPen = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!editable || tool !== "cursor" || !selectedPenAnnotation) return;
      if (
        event.pointerType === "touch" &&
        (touchGestureRef.current || touchPointersRef.current.size >= 2)
      ) {
        return;
      }

      const originBounds = getPenBounds(selectedPenAnnotation);
      if (!originBounds) return;

      event.preventDefault();
      event.stopPropagation();
      beginHistoryGesture();
      draggingPenRef.current = {
        id: selectedPenAnnotation.id,
        startClientX: event.clientX,
        startClientY: event.clientY,
        originPoints: getSafePenPoints(selectedPenAnnotation).map((point) => ({ ...point })),
        originBounds,
      };
      setDraggingPen(true);
    },
    [beginHistoryGesture, editable, selectedPenAnnotation, tool]
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setLoadedDocumentKey("");
        setState(null);
        setAiDraftPreview(null);
        setTeacherMarks(initialTeacherMarks);
        setTeacherFeedback(initialTeacherFeedback);
        setSelectedPenAnnotationId(null);
        setUndoStack([]);
        setRedoStack([]);
        activeAnnotationsRef.current = [];
        historyGestureStartRef.current = null;
        lastLiveSyncedSignatureRef.current = "";
        lastRemoteSnapshotRef.current = "";
        const loaded = await fetchAssessmentDocument(assessmentId, taskId, studentId);
        if (!cancelled) {
          const loadedLayerAnnotations =
            role === "teacher" ? loaded.teacherAnnotations || [] : loaded.studentAnnotations || [];
          const storedDraft = getStoredDocumentDraft(localDraftKey);
          const loadedSignature = getAnnotationsSignature(loadedLayerAnnotations);
          const loadedUpdatedAtMs = new Date(loaded.updatedAt || 0).getTime() || 0;
          const shouldRestoreLocalDraft =
            role === "student" &&
            !loaded.studentLocked &&
            storedDraft &&
            storedDraft.signature !== loadedSignature &&
            storedDraft.annotations.length > 0 &&
            (storedDraft.annotations.length > loadedLayerAnnotations.length ||
              Number(storedDraft.updatedAtMs || 0) > loadedUpdatedAtMs);
          const nextLoaded = shouldRestoreLocalDraft
            ? { ...loaded, studentAnnotations: storedDraft.annotations }
            : loaded;

          setState(nextLoaded);
          setLoadedDocumentKey(documentLoadKey);
          lastLiveSyncedSignatureRef.current = getAnnotationsSignature(
            role === "teacher"
              ? nextLoaded.teacherAnnotations || []
              : nextLoaded.studentAnnotations || []
          );
          lastRemoteSnapshotRef.current = JSON.stringify({
            status: nextLoaded.status,
            studentLocked: nextLoaded.studentLocked,
            updatedAt: nextLoaded.updatedAt,
            annotations:
              oppositeLayer === "student"
                ? nextLoaded.studentAnnotations || []
                : nextLoaded.teacherAnnotations || [],
          });
          activeAnnotationsRef.current =
            role === "teacher"
              ? nextLoaded.teacherAnnotations || []
              : nextLoaded.studentAnnotations || [];
          if (shouldRestoreLocalDraft) {
            saveAssessmentDocumentAnnotations({
              assessmentId,
              taskId,
              studentId,
              layer: role,
              annotations: storedDraft.annotations,
              metadata: {
                ...(nextLoaded.metadata && typeof nextLoaded.metadata === "object"
                  ? nextLoaded.metadata
                  : {}),
                restoredFromLocalDraft: true,
              },
            }).catch((error) => console.error("Could not restore local document draft:", error));
          }
          const metadata = nextLoaded.metadata || {};
          const storedDraftMetadata =
            storedDraft?.metadata && typeof storedDraft.metadata === "object"
              ? (storedDraft.metadata as Record<string, unknown>)
              : null;
          let hydratedTeacherMarks = String(metadata.teacherMarks ?? "");
          let hydratedTeacherFeedback = String(metadata.teacherFeedback ?? "");
          if (role === "teacher" && !hydratedTeacherMarks.trim() && isAiDraftFailureText(hydratedTeacherFeedback)) {
            hydratedTeacherFeedback = "";
          }
          if (metadata.teacherMarks != null) setTeacherMarks(hydratedTeacherMarks);
          if (metadata.teacherFeedback != null) setTeacherFeedback(hydratedTeacherFeedback);
          if (role === "teacher" && storedDraftMetadata) {
            const localTeacherMarks = String(storedDraftMetadata.teacherMarks ?? "");
            let localTeacherFeedback = String(storedDraftMetadata.teacherFeedback ?? "");
            const remoteTeacherMarks = String(metadata.teacherMarks ?? "");
            const remoteTeacherFeedback = String(metadata.teacherFeedback ?? "");
            if (!localTeacherMarks.trim() && isAiDraftFailureText(localTeacherFeedback)) {
              localTeacherFeedback = "";
            }
            const hasRemoteTeacherDraft =
              remoteTeacherMarks.trim().length > 0 || remoteTeacherFeedback.trim().length > 0;
            const hasLocalTeacherDraft =
              localTeacherMarks.trim().length > 0 || localTeacherFeedback.trim().length > 0;

            if (!hasRemoteTeacherDraft && hasLocalTeacherDraft) {
              hydratedTeacherMarks = localTeacherMarks;
              hydratedTeacherFeedback = localTeacherFeedback;
              setTeacherMarks(localTeacherMarks);
              setTeacherFeedback(localTeacherFeedback);
            }

            const localAiDraftPreview = storedDraftMetadata.aiDraftPreview;
            if (localAiDraftPreview && typeof localAiDraftPreview === "object") {
              const normalizedLocalAiDraftPreview = normalizeAiDraftPreview(localAiDraftPreview);
              if (normalizedLocalAiDraftPreview && !isFailedAiDraft(normalizedLocalAiDraftPreview)) {
                setAiDraftPreview(normalizedLocalAiDraftPreview);
              }
            }
          }
          if (role === "teacher") {
            lastSavedTeacherDraftRef.current = JSON.stringify({
              teacherMarks: hydratedTeacherMarks,
              teacherFeedback: hydratedTeacherFeedback,
            });
          }
          if (Object.prototype.hasOwnProperty.call(metadata, "selfAssessmentMark")) {
            const savedSelfAssessmentMark = normalizeSelfAssessmentValue(metadata.selfAssessmentMark);
            const fallbackSelfAssessmentMark = normalizeSelfAssessmentValue(initialSelfAssessmentMark);
            const nextSelfAssessmentMark =
              savedSelfAssessmentMark != null ? savedSelfAssessmentMark : fallbackSelfAssessmentMark;
            setSelfAssessmentMark(nextSelfAssessmentMark);
            lastSavedSelfAssessmentRef.current = nextSelfAssessmentMark;
          }
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) messageApi.error("Could not load saved document work.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [assessmentId, taskId, studentId, messageApi, getAnnotationsSignature, oppositeLayer, role, localDraftKey, documentLoadKey, initialSelfAssessmentMark, initialTeacherMarks, initialTeacherFeedback]);

  useEffect(() => {
    let cancelled = false;
    const renderPdf = async () => {
      if (!pdfRenderUrl) return;
      try {
        setRendering(true);
        setRenderError(null);
        setDocxHtml("");

        if (fileExtension === "docx") {
          setDocumentKind("docx");
          const response = await fetch(pdfRenderUrl, { cache: "no-store" });
          if (!response.ok) throw new Error("Could not load Word document");
          const arrayBuffer = await response.arrayBuffer();
          const mammoth = await import("mammoth");
          const result = await mammoth.convertToHtml({ arrayBuffer });
          if (cancelled) return;
          const estimatedHeight = Math.max(1200, Math.min(3600, 700 + result.value.length / 2.5));
          setDocxHtml(result.value);
          setPages([{ pageNumber: 1, width: 900, height: estimatedHeight }]);
          return;
        }

        if (["png", "jpg", "jpeg", "webp", "gif"].includes(fileExtension)) {
          setDocumentKind("image");
          const image = new Image();
          image.onload = () => {
            if (cancelled) return;
            const width = Math.min(900, image.naturalWidth || 900);
            const scale = width / (image.naturalWidth || width);
            const height = Math.max(700, (image.naturalHeight || 1000) * scale);
            setPages([{ pageNumber: 1, width, height, previewUrl: pdfRenderUrl }]);
            setRendering(false);
          };
          image.onerror = () => {
            if (!cancelled) setRenderError("The image could not be rendered inline. Use the original file link below, or check that the file allows browser access.");
            if (!cancelled) setRendering(false);
          };
          image.src = pdfRenderUrl;
          return;
        }

        setDocumentKind("pdf");
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
        const pdf = await pdfjs.getDocument({ url: pdfRenderUrl }).promise;
        const renderedPages: RenderedPage[] = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.35 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          renderedPages.push({
            pageNumber,
            width: viewport.width,
            height: viewport.height,
            previewUrl: canvas.toDataURL("image/png"),
          });
        }

        if (!cancelled) setPages(renderedPages);
      } catch (error) {
        console.error(error);
        if (!cancelled) setRenderError("The document could not be rendered inline. Use the original file link below, or check that the file allows browser access.");
      } finally {
        if (!cancelled) setRendering(false);
      }
    };

    renderPdf();
    return () => {
      cancelled = true;
    };
  }, [pdfRenderUrl, fileExtension]);

  useEffect(() => {
    for (const page of pages) {
      const canvas = annotationCanvasRefs.current[page.pageNumber];
      if (!canvas) continue;
      canvas.width = page.width;
      canvas.height = page.height;
      canvas.style.width = `${page.width}px`;
      canvas.style.height = `${page.height}px`;
      const context = canvas.getContext("2d");
      if (!context) continue;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const allPenAnnotations = [...studentAnnotations, ...teacherAnnotations].filter(
        (annotation): annotation is PenAnnotation => annotation.type === "pen" && annotation.page === page.pageNumber
      );
      for (const annotation of allPenAnnotations) drawPen(context, annotation);
      if (selectedPenAnnotation?.page === page.pageNumber) {
        drawSelectedPenHighlight(context, selectedPenAnnotation);
        drawPen(context, selectedPenAnnotation);
      }
      if (activeStroke?.page === page.pageNumber) drawPen(context, activeStroke);
    }
  }, [pages, studentAnnotations, teacherAnnotations, activeStroke, selectedPenAnnotation]);

  useEffect(() => {
    return () => {
      const snapshot = getCurrentLayerSnapshot();
      persistLocalDraft(snapshot, { closing: true });
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (selfAssessmentSaveTimerRef.current) clearTimeout(selfAssessmentSaveTimerRef.current);
      if (teacherDraftSaveTimerRef.current) clearTimeout(teacherDraftSaveTimerRef.current);
      pendingAutosaveRef.current = null;
    };
  }, [getCurrentLayerSnapshot, persistLocalDraft]);

  useEffect(() => {
    if (typeof window === "undefined" || role !== "student") return;

    const flushOnPageExit = () => {
      const snapshot = getCurrentLayerSnapshot();
      const nextClientSaveSeq = clientSaveSeqRef.current + 1;
      clientSaveSeqRef.current = nextClientSaveSeq;
      const metadata = {
        title,
        maxMarks,
        documentFileUrl: normalizeDocumentUrl(fileUrl),
        selfAssessmentMark: normalizeSelfAssessmentValue(selfAssessmentMark),
        clientSaveId: clientSaveIdRef.current,
        clientSaveSeq: nextClientSaveSeq,
        clientSavedAt: new Date().toISOString(),
        annotationsCount: snapshot.length,
        pageExitFlush: true,
      };

      persistLocalDraft(snapshot, metadata);

      try {
        const params = new URLSearchParams({ assessmentId, taskId, studentId });
        const payload = JSON.stringify({
          layer: role,
          annotations: snapshot,
          metadata,
        });
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon?.(`/api/assessment-document?${params.toString()}`, blob);
      } catch {
        // local draft remains available when beacon is not supported or blocked.
      }
    };

    window.addEventListener("pagehide", flushOnPageExit);
    return () => {
      window.removeEventListener("pagehide", flushOnPageExit);
    };
  }, [assessmentId, fileUrl, getCurrentLayerSnapshot, maxMarks, persistLocalDraft, role, selfAssessmentMark, studentId, taskId, title]);

  useEffect(() => {
    if (role !== "student" || !documentLoaded) return;

    const normalizedSelfAssessmentMark = normalizeSelfAssessmentValue(selfAssessmentMark);
    if (normalizedSelfAssessmentMark === lastSavedSelfAssessmentRef.current) return;

    if (selfAssessmentSaveTimerRef.current) {
      clearTimeout(selfAssessmentSaveTimerRef.current);
    }

    selfAssessmentSaveTimerRef.current = setTimeout(() => {
      selfAssessmentSaveTimerRef.current = null;
      saveAnnotations(getCurrentLayerSnapshot(), undefined, {
        silent: true,
        metadata: { selfAssessmentMark: normalizedSelfAssessmentMark },
      }).catch((error) => {
        console.error(error);
        messageApi.error("Self mark autosave failed. Please save manually.");
      });
    }, SELF_ASSESSMENT_AUTOSAVE_DELAY_MS);

    return () => {
      if (selfAssessmentSaveTimerRef.current) {
        clearTimeout(selfAssessmentSaveTimerRef.current);
        selfAssessmentSaveTimerRef.current = null;
      }
    };
  }, [documentLoaded, getCurrentLayerSnapshot, messageApi, role, saveAnnotations, selfAssessmentMark]);

  useEffect(() => {
    if (role !== "teacher" || !documentLoaded) return;

    const teacherDraftSignature = JSON.stringify({
      teacherMarks: teacherMarks.trim(),
      teacherFeedback: teacherFeedback.trim(),
    });

    if (teacherDraftSignature === lastSavedTeacherDraftRef.current) return;

    persistLocalDraft(getCurrentLayerSnapshot(), {
      ...(state?.metadata && typeof state.metadata === "object" ? state.metadata : {}),
      teacherMarks,
      teacherFeedback,
      aiDraftPreview,
    });

    if (teacherDraftSaveTimerRef.current) {
      clearTimeout(teacherDraftSaveTimerRef.current);
    }

    teacherDraftSaveTimerRef.current = setTimeout(() => {
      teacherDraftSaveTimerRef.current = null;
      saveAnnotations(getCurrentLayerSnapshot(), undefined, {
        silent: true,
        syncState: false,
      })
        .then(() => {
          lastSavedTeacherDraftRef.current = teacherDraftSignature;
        })
        .catch((error) => {
          console.error(error);
          messageApi.error("Teacher draft autosave failed. Press Save now.");
        });
    }, TEACHER_DRAFT_AUTOSAVE_DELAY_MS);

    return () => {
      if (teacherDraftSaveTimerRef.current) {
        clearTimeout(teacherDraftSaveTimerRef.current);
        teacherDraftSaveTimerRef.current = null;
      }
    };
  }, [
    aiDraftPreview,
    documentLoaded,
    getCurrentLayerSnapshot,
    messageApi,
    persistLocalDraft,
    role,
    saveAnnotations,
    state?.metadata,
    teacherFeedback,
    teacherMarks,
  ]);

  useEffect(() => {
    if (!assessmentId || !taskId || !studentId || !state) return;

    const interval = window.setInterval(() => {
      if (role === "student" && studentLocked) return;

      const snapshot = getCurrentLayerSnapshot();
      const signature = getAnnotationsSignature(snapshot);
      if (signature === lastLiveSyncedSignatureRef.current) return;

      saveAnnotations(snapshot, undefined, { syncState: false, silent: true })
        .then(() => {
          lastLiveSyncedSignatureRef.current = signature;
          if (
            pendingAutosaveRef.current &&
            getAnnotationsSignature(pendingAutosaveRef.current) === signature
          ) {
            pendingAutosaveRef.current = null;
            setAutosaveQueued(false);
            if (saveTimerRef.current) {
              clearTimeout(saveTimerRef.current);
              saveTimerRef.current = null;
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, LIVE_SYNC_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [
    assessmentId,
    taskId,
    studentId,
    role,
    studentLocked,
    getCurrentLayerSnapshot,
    getAnnotationsSignature,
    saveAnnotations,
  ]);

  useEffect(() => {
    if (!assessmentId || !taskId || !studentId) return;

    let cancelled = false;

    const syncRemoteLayer = async () => {
      try {
        const loaded = await fetchAssessmentDocument(assessmentId, taskId, studentId);
        if (cancelled) return;

        const remoteAnnotations =
          oppositeLayer === "student"
            ? loaded.studentAnnotations || []
            : loaded.teacherAnnotations || [];
        const remoteSnapshot = JSON.stringify({
          status: loaded.status,
          studentLocked: loaded.studentLocked,
          updatedAt: loaded.updatedAt,
          annotations: remoteAnnotations,
        });

        if (remoteSnapshot === lastRemoteSnapshotRef.current) return;
        lastRemoteSnapshotRef.current = remoteSnapshot;

        setState((prev) => {
          if (!prev) return loaded;

          return {
            ...prev,
            status: loaded.status,
            studentLocked: loaded.studentLocked,
            updatedAt: loaded.updatedAt,
            submittedAt: loaded.submittedAt,
            markedAt: loaded.markedAt,
            metadata: loaded.metadata,
            ...(oppositeLayer === "student"
              ? { studentAnnotations: loaded.studentAnnotations || [] }
              : { teacherAnnotations: loaded.teacherAnnotations || [] }),
          };
        });
      } catch (error) {
        console.error(error);
      }
    };

    void syncRemoteLayer();
    const interval = window.setInterval(() => {
      void syncRemoteLayer();
    }, REMOTE_SYNC_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [assessmentId, taskId, studentId, oppositeLayer]);

  const textAnnotationsByPage = useMemo(() => {
    const grouped = new Map<number, TextAnnotation[]>();
    for (const annotation of [...studentAnnotations, ...teacherAnnotations]) {
      if (annotation.type !== "text") continue;
      grouped.set(annotation.page, [...(grouped.get(annotation.page) || []), annotation]);
    }
    return grouped;
  }, [studentAnnotations, teacherAnnotations]);

  const getAnnotationsAfterErase = (
    annotations: AssessmentDocumentAnnotation[],
    pageNumber: number,
    point: { x: number; y: number }
  ) =>
    annotations.filter((annotation) => {
      if (annotation.page !== pageNumber) return true;
      if (annotation.type === "text") return !textTouchesEraser(annotation, point);
      return !penTouchesEraser(annotation, point);
    });

  const eraseAtPoint = useCallback(
    (pageNumber: number, point: { x: number; y: number }) => {
      const currentAnnotations = activeAnnotationsRef.current;
      const nextAnnotations = getAnnotationsAfterErase(currentAnnotations, pageNumber, point);

      if (nextAnnotations.length === currentAnnotations.length) return;
      setLayerAnnotationsLocally(nextAnnotations);
      queueAutosave(nextAnnotations);
    },
    [queueAutosave, setLayerAnnotationsLocally]
  );

  const beginPendingTouchPageAction = (
    pendingAction: PendingTouchPageAction,
    currentPoint?: { x: number; y: number }
  ) => {
    pendingTouchPageActionRef.current = null;

    if (pendingAction.mode === "cursor") return;

    if (pendingAction.mode === "eraser") {
      beginHistoryGesture();
      pendingAction.target.setPointerCapture(pendingAction.pointerId);
      erasingRef.current = true;
      eraseAtPoint(pendingAction.pageNumber, pendingAction.startPoint);
      if (
        currentPoint &&
        (currentPoint.x !== pendingAction.startPoint.x ||
          currentPoint.y !== pendingAction.startPoint.y)
      ) {
        eraseAtPoint(pendingAction.pageNumber, currentPoint);
      }
      return;
    }

    const nextStroke: PenAnnotation = {
      id: makeId(),
      type: "pen",
      tool: pendingAction.strokeTool || "pen",
      page: pendingAction.pageNumber,
      color: pendingAction.strokeColor || color,
      width: pendingAction.strokeWidth || drawingStrokeWidth,
      points: [pendingAction.startPoint],
    };

    if (
      currentPoint &&
      (currentPoint.x !== pendingAction.startPoint.x ||
        currentPoint.y !== pendingAction.startPoint.y)
    ) {
      nextStroke.points.push(currentPoint);
    }

    pendingAction.target.setPointerCapture(pendingAction.pointerId);
    activeStrokeRef.current = nextStroke;
    setActiveStroke(nextStroke);
  };

  const finalizePendingTouchPageAction = (pendingAction: PendingTouchPageAction) => {
    pendingTouchPageActionRef.current = null;

    if (pendingAction.mode === "cursor") {
      const selectedAnnotation = findPenAnnotationAtPoint(
        activeAnnotationsRef.current,
        pendingAction.pageNumber,
        pendingAction.startPoint
      );
      setSelectedPenAnnotationId(selectedAnnotation?.id ?? null);
      return;
    }

    if (pendingAction.mode === "eraser") {
      const currentAnnotations = activeAnnotationsRef.current;
      const nextAnnotations = getAnnotationsAfterErase(
        currentAnnotations,
        pendingAction.pageNumber,
        pendingAction.startPoint
      );

      if (nextAnnotations.length === currentAnnotations.length) return;

      setLayerAnnotations(nextAnnotations, {
        previousAnnotations: cloneAnnotationsSnapshot(currentAnnotations),
      });
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, pageNumber: number) => {
    const isTouchDrawingTool =
      event.pointerType === "touch" &&
      editable &&
      (tool === "pen" || tool === "highlighter" || tool === "eraser");

    if (event.pointerType === "touch" && !isTouchDrawingTool) {
      pendingTouchPageActionRef.current = null;
      return;
    }

    if (
      event.pointerType === "touch" &&
      (touchGestureRef.current || touchPointersRef.current.size >= 2)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!editable || tool === "text") return;
    const target = event.currentTarget;
    const point = getPointerPoint(event, target, zoomLevel);

    event.preventDefault();
    event.stopPropagation();

    if (tool === "cursor") {
      const selectedAnnotation = findPenAnnotationAtPoint(activeAnnotationsRef.current, pageNumber, point);
      setSelectedPenAnnotationId(selectedAnnotation?.id ?? null);
      return;
    }

    if (tool === "eraser") {
      beginHistoryGesture();
      target.setPointerCapture(event.pointerId);
      erasingRef.current = true;
      eraseAtPoint(pageNumber, point);
      return;
    }

    target.setPointerCapture(event.pointerId);
    const nextStroke: PenAnnotation = {
      id: makeId(),
      type: "pen",
      tool: tool === "highlighter" ? "highlighter" : "pen",
      page: pageNumber,
      color,
      width: drawingStrokeWidth,
      points: [point],
    };
    activeStrokeRef.current = nextStroke;
    setActiveStroke(nextStroke);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const isTouchDrawingTool =
      event.pointerType === "touch" &&
      editable &&
      (tool === "pen" || tool === "highlighter" || tool === "eraser");

    if (event.pointerType === "touch" && !isTouchDrawingTool) return;

    if (
      event.pointerType === "touch" &&
      (touchGestureRef.current || touchPointersRef.current.size >= 2)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const pendingTouchPageAction = pendingTouchPageActionRef.current;
    if (
      event.pointerType === "touch" &&
      pendingTouchPageAction?.pointerId === event.pointerId
    ) {
      if (pendingTouchPageAction.mode === "cursor") return;

      const moveDistance = Math.hypot(
        event.clientX - pendingTouchPageAction.startClientX,
        event.clientY - pendingTouchPageAction.startClientY
      );
      if (moveDistance < 8) return;
      if (Date.now() - pendingTouchPageAction.startedAtMs < TOUCH_PAGE_ACTION_GRACE_MS) {
        return;
      }

      beginPendingTouchPageAction(
        pendingTouchPageAction,
        getPointerPoint(event, event.currentTarget, zoomLevel)
      );
      return;
    }
    if (erasingRef.current && tool === "eraser") {
      event.preventDefault();
      event.stopPropagation();
      const pageNumber = Number(event.currentTarget.dataset.pageNumber || 0);
      if (pageNumber > 0) {
        eraseAtPoint(pageNumber, getPointerPoint(event, event.currentTarget, zoomLevel));
      }
      return;
    }

    const currentStroke = activeStrokeRef.current;
    if (!currentStroke) return;
    event.preventDefault();
    event.stopPropagation();
    const point = getPointerPoint(event, event.currentTarget, zoomLevel);
    const nextStroke = { ...currentStroke, points: [...currentStroke.points, point] };
    activeStrokeRef.current = nextStroke;
    setActiveStroke(nextStroke);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const isTouchDrawingTool =
      event.pointerType === "touch" &&
      editable &&
      (tool === "pen" || tool === "highlighter" || tool === "eraser");

    if (event.pointerType === "touch" && !isTouchDrawingTool) {
      pendingTouchPageActionRef.current = null;
      return;
    }

    if (
      event.pointerType === "touch" &&
      (touchGestureRef.current || touchPointersRef.current.size >= 2)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const pendingTouchPageAction = pendingTouchPageActionRef.current;
    if (
      event.pointerType === "touch" &&
      pendingTouchPageAction?.pointerId === event.pointerId
    ) {
      event.preventDefault();
      event.stopPropagation();
      finalizePendingTouchPageAction(pendingTouchPageAction);
      return;
    }
    if (erasingRef.current) {
      event.preventDefault();
      event.stopPropagation();
      erasingRef.current = false;
      const previousAnnotations = consumeHistoryGesture();
      if (
        previousAnnotations &&
        getAnnotationsSignature(previousAnnotations) !==
          getAnnotationsSignature(activeAnnotationsRef.current)
      ) {
        pushUndoSnapshot(previousAnnotations);
        setRedoStack([]);
      }
      return;
    }

    const completedStroke = activeStrokeRef.current;
    if (!completedStroke) return;
    event.preventDefault();
    event.stopPropagation();
    activeStrokeRef.current = null;
    setActiveStroke(null);
    if (getSafePenPoints(completedStroke).length > 1) {
      setLayerAnnotations([...activeAnnotations, completedStroke]);
    }
  };

  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    if (suppressTouchClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!editable || tool !== "text") return;
    setSelectedPenAnnotationId(null);
    const point = getPointerPoint(
      event as unknown as React.PointerEvent<HTMLDivElement>,
      event.currentTarget,
      zoomLevel
    );
    setEditingText({
      page: pageNumber,
      x: point.x,
      y: point.y,
      value: "",
      fontSize: textFontSize,
      width: TEXT_ANNOTATION_DEFAULT_WIDTH,
      fontWeight: textFontWeight,
      underline: textUnderline,
      textAlign: textAlignment,
    });
  };

  const commitEditingText = () => {
    if (!editingText?.value.trim()) {
      setEditingText(null);
      return;
    }
    if (editingText.id) {
      setLayerAnnotations(
        activeAnnotations.map((annotation) =>
          annotation.id === editingText.id && annotation.type === "text"
            ? {
                ...annotation,
                text: editingText.value.trim(),
                x: editingText.x,
                y: editingText.y,
                color,
                fontSize: editingText.fontSize,
                width: editingText.width,
                fontWeight: editingText.fontWeight,
                underline: editingText.underline,
                textAlign: editingText.textAlign,
              }
            : annotation
        )
      );
      setTextFontSize(editingText.fontSize);
      setTextFontWeight(editingText.fontWeight);
      setTextUnderline(editingText.underline);
      setTextAlignment(editingText.textAlign);
      setEditingText(null);
      return;
    }
    const annotation: TextAnnotation = {
      id: makeId(),
      type: "text",
      page: editingText.page,
      x: editingText.x,
      y: editingText.y,
      text: editingText.value.trim(),
      color,
      fontSize: editingText.fontSize,
      width: editingText.width,
      fontWeight: editingText.fontWeight,
      underline: editingText.underline,
      textAlign: editingText.textAlign,
    };
    setLayerAnnotations([...activeAnnotations, annotation]);
    setTextFontSize(editingText.fontSize);
    setTextFontWeight(editingText.fontWeight);
    setTextUnderline(editingText.underline);
    setTextAlignment(editingText.textAlign);
    setEditingText(null);
  };

  const startEditTextAnnotation = (annotation: TextAnnotation) => {
    if (!editable || !activeAnnotations.some((item) => item.id === annotation.id)) return;
    setSelectedPenAnnotationId(null);
    setColor(annotation.color);
    setTextFontSize(annotation.fontSize);
    setTextFontWeight(annotation.fontWeight === "bold" ? "bold" : "normal");
    setTextUnderline(Boolean(annotation.underline));
    setTextAlignment(annotation.textAlign ?? "left");
    setEditingText({
      id: annotation.id,
      page: annotation.page,
      x: annotation.x,
      y: annotation.y,
      value: annotation.text,
      fontSize: annotation.fontSize,
      width: annotation.width ?? TEXT_ANNOTATION_DEFAULT_WIDTH,
      fontWeight: annotation.fontWeight === "bold" ? "bold" : "normal",
      underline: Boolean(annotation.underline),
      textAlign: annotation.textAlign ?? "left",
    });
  };

  const deleteTextAnnotation = (annotation: TextAnnotation) => {
    if (!editable || !activeAnnotations.some((item) => item.id === annotation.id)) return;
    if (editingText?.id === annotation.id) setEditingText(null);
    setLayerAnnotations(activeAnnotations.filter((item) => item.id !== annotation.id));
  };

  const deleteEditingText = () => {
    if (!editingText?.id) {
      setEditingText(null);
      return;
    }
    setLayerAnnotations(activeAnnotations.filter((annotation) => annotation.id !== editingText.id));
    setEditingText(null);
  };

  const clampTextAnnotationWidth = (value: number) =>
    Math.min(TEXT_ANNOTATION_MAX_WIDTH, Math.max(TEXT_ANNOTATION_MIN_WIDTH, value));

  const startResizeTextAnnotation = (
    event: React.PointerEvent<HTMLElement>,
    annotation: TextAnnotation | EditingText,
    edge: "left" | "right" = "right"
  ) => {
    if (!editable) return;
    if (
      event.pointerType === "touch" &&
      (touchGestureRef.current || touchPointersRef.current.size >= 2)
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (annotation.id) {
      beginHistoryGesture();
    }
    resizingTextRef.current = {
      id: annotation.id,
      startClientX: event.clientX,
      originWidth: annotation.width ?? TEXT_ANNOTATION_DEFAULT_WIDTH,
      originX: annotation.x,
      x: annotation.x,
      width: annotation.width ?? TEXT_ANNOTATION_DEFAULT_WIDTH,
      edge,
    };
    setResizingText(true);
  };

  const handleTextPointerDown = (event: React.PointerEvent<HTMLDivElement>, annotation: TextAnnotation) => {
    if (
      event.pointerType === "touch" &&
      (touchGestureRef.current || touchPointersRef.current.size >= 2)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!editable || !activeAnnotations.some((item) => item.id === annotation.id)) return;
    if (tool === "eraser") {
      event.preventDefault();
      event.stopPropagation();
      deleteTextAnnotation(annotation);
      return;
    }
    if (tool !== "cursor") return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    beginHistoryGesture();
    draggingTextRef.current = {
      id: annotation.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      originX: annotation.x,
      originY: annotation.y,
      x: annotation.x,
      y: annotation.y,
    };
  };

  const handleTextPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType === "touch" &&
      (touchGestureRef.current || touchPointersRef.current.size >= 2)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const draggingText = draggingTextRef.current;
    if (!draggingText) return;
    event.preventDefault();
    event.stopPropagation();
    const x = Math.max(
      0,
      draggingText.originX + (event.clientX - draggingText.startClientX) / zoomLevel
    );
    const y = Math.max(
      0,
      draggingText.originY + (event.clientY - draggingText.startClientY) / zoomLevel
    );
    draggingTextRef.current = { ...draggingText, x, y };
    setLayerAnnotationsLocally(
      activeAnnotations.map((annotation) =>
        annotation.id === draggingText.id && annotation.type === "text"
          ? { ...annotation, x, y }
          : annotation
      )
    );
  };

  const handleTextPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType === "touch" &&
      (touchGestureRef.current || touchPointersRef.current.size >= 2)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const draggingText = draggingTextRef.current;
    if (!draggingText) return;
    event.preventDefault();
    event.stopPropagation();
    draggingTextRef.current = null;
    const previousAnnotations = consumeHistoryGesture();
    setLayerAnnotations(
      activeAnnotations.map((annotation) =>
        annotation.id === draggingText.id && annotation.type === "text"
          ? { ...annotation, x: draggingText.x, y: draggingText.y }
          : annotation
      ),
      { previousAnnotations: previousAnnotations ?? undefined }
    );
  };

  useEffect(() => {
    if (editingText) return;
    setTextToolbarMenu(null);
  }, [editingText]);

  useEffect(() => {
    if (!resizingText) return;

    const handleResizeMove = (event: PointerEvent) => {
      const currentResize = resizingTextRef.current;
      if (!currentResize) return;
      event.preventDefault();
      const horizontalDelta = (event.clientX - currentResize.startClientX) / zoomLevel;
      let width = currentResize.originWidth;
      let x = currentResize.originX;

      if (currentResize.edge === "left") {
        width = clampTextAnnotationWidth(currentResize.originWidth - horizontalDelta);
        x = Math.max(0, currentResize.originX + (currentResize.originWidth - width));
      } else {
        width = clampTextAnnotationWidth(currentResize.originWidth + horizontalDelta);
      }

      resizingTextRef.current = { ...currentResize, width, x };

      if (!currentResize.id) {
        setEditingText((current) => (current ? { ...current, width, x } : current));
        return;
      }

      setEditingText((current) =>
        current?.id === currentResize.id ? { ...current, width, x } : current
      );
      setLayerAnnotationsLocally(
        activeAnnotationsRef.current.map((annotation) =>
          annotation.id === currentResize.id && annotation.type === "text"
            ? { ...annotation, width, x }
            : annotation
        )
      );
    };

    const handleResizeEnd = () => {
      const currentResize = resizingTextRef.current;
      const previousAnnotations = consumeHistoryGesture();
      resizingTextRef.current = null;
      setResizingText(false);
      if (!currentResize?.id) return;

      setLayerAnnotations(
        activeAnnotationsRef.current.map((annotation) =>
          annotation.id === currentResize.id && annotation.type === "text"
            ? { ...annotation, x: currentResize.x, width: currentResize.width }
            : annotation
        ),
        { previousAnnotations: previousAnnotations ?? undefined }
      );
    };

    window.addEventListener("pointermove", handleResizeMove);
    window.addEventListener("pointerup", handleResizeEnd);
    window.addEventListener("pointercancel", handleResizeEnd);

    return () => {
      window.removeEventListener("pointermove", handleResizeMove);
      window.removeEventListener("pointerup", handleResizeEnd);
      window.removeEventListener("pointercancel", handleResizeEnd);
    };
  }, [resizingText, setLayerAnnotations, setLayerAnnotationsLocally, zoomLevel]);

  useEffect(() => {
    if (!resizingPen) return;

    const handlePenResizeMove = (event: PointerEvent) => {
      const currentResize = resizingPenRef.current;
      if (!currentResize) return;

      event.preventDefault();
      const horizontalDelta = (event.clientX - currentResize.startClientX) / zoomLevel;
      const safeOriginWidth = Math.max(currentResize.originBounds.width, 1);
      const nextWidth = Math.max(
        safeOriginWidth * PEN_RESIZE_MIN_SCALE,
        safeOriginWidth + horizontalDelta * (currentResize.edge === "right" ? 1 : -1)
      );
      const scale = nextWidth / safeOriginWidth;
      const nextPoints = scalePenPointsFromEdge(
        currentResize.originPoints,
        currentResize.originBounds,
        scale,
        currentResize.edge
      );

      setLayerAnnotationsLocally(
        activeAnnotationsRef.current.map((annotation) =>
          annotation.id === currentResize.id && annotation.type === "pen"
            ? { ...annotation, points: nextPoints }
            : annotation
        )
      );
    };

    const handlePenResizeEnd = () => {
      const previousAnnotations = consumeHistoryGesture();
      resizingPenRef.current = null;
      setResizingPen(false);

      setLayerAnnotations(cloneAnnotationsSnapshot(activeAnnotationsRef.current), {
        previousAnnotations: previousAnnotations ?? undefined,
      });
    };

    window.addEventListener("pointermove", handlePenResizeMove);
    window.addEventListener("pointerup", handlePenResizeEnd);
    window.addEventListener("pointercancel", handlePenResizeEnd);

    return () => {
      window.removeEventListener("pointermove", handlePenResizeMove);
      window.removeEventListener("pointerup", handlePenResizeEnd);
      window.removeEventListener("pointercancel", handlePenResizeEnd);
    };
  }, [consumeHistoryGesture, resizingPen, setLayerAnnotations, setLayerAnnotationsLocally, zoomLevel]);

  useEffect(() => {
    if (!draggingPen) return;

    const handlePenDragMove = (event: PointerEvent) => {
      const currentDrag = draggingPenRef.current;
      if (!currentDrag) return;

      event.preventDefault();
      const deltaX = (event.clientX - currentDrag.startClientX) / zoomLevel;
      const deltaY = (event.clientY - currentDrag.startClientY) / zoomLevel;
      const minDeltaX = -currentDrag.originBounds.minX;
      const minDeltaY = -currentDrag.originBounds.minY;
      const maxDeltaX = selectedPenPage
        ? selectedPenPage.width - currentDrag.originBounds.maxX
        : Number.POSITIVE_INFINITY;
      const maxDeltaY = selectedPenPage
        ? selectedPenPage.height - currentDrag.originBounds.maxY
        : Number.POSITIVE_INFINITY;
      const clampedDeltaX = Math.min(Math.max(deltaX, minDeltaX), maxDeltaX);
      const clampedDeltaY = Math.min(Math.max(deltaY, minDeltaY), maxDeltaY);
      const nextPoints = currentDrag.originPoints.map((point) => ({
        x: point.x + clampedDeltaX,
        y: point.y + clampedDeltaY,
      }));

      setLayerAnnotationsLocally(
        activeAnnotationsRef.current.map((annotation) =>
          annotation.id === currentDrag.id && annotation.type === "pen"
            ? { ...annotation, points: nextPoints }
            : annotation
        )
      );
    };

    const handlePenDragEnd = () => {
      const previousAnnotations = consumeHistoryGesture();
      draggingPenRef.current = null;
      setDraggingPen(false);

      setLayerAnnotations(cloneAnnotationsSnapshot(activeAnnotationsRef.current), {
        previousAnnotations: previousAnnotations ?? undefined,
      });
    };

    window.addEventListener("pointermove", handlePenDragMove);
    window.addEventListener("pointerup", handlePenDragEnd);
    window.addEventListener("pointercancel", handlePenDragEnd);

    return () => {
      window.removeEventListener("pointermove", handlePenDragMove);
      window.removeEventListener("pointerup", handlePenDragEnd);
      window.removeEventListener("pointercancel", handlePenDragEnd);
    };
  }, [consumeHistoryGesture, draggingPen, selectedPenPage, setLayerAnnotations, setLayerAnnotationsLocally, zoomLevel]);

  const undo = () => {
    if (!editable || undoStack.length === 0) return;
    const previousAnnotations = undoStack[undoStack.length - 1];
    setEditingText(null);
    setTextToolbarMenu(null);
    historyGestureStartRef.current = null;
    setUndoStack((current) => current.slice(0, -1));
    setRedoStack((current) => [cloneAnnotationsSnapshot(activeAnnotationsRef.current), ...current].slice(0, HISTORY_STACK_LIMIT));
    setLayerAnnotations(cloneAnnotationsSnapshot(previousAnnotations), {
      preserveRedo: true,
      skipHistory: true,
    });
  };

  const redo = () => {
    if (!editable || redoStack.length === 0) return;
    const [nextAnnotations, ...remainingRedoStack] = redoStack;
    setEditingText(null);
    setTextToolbarMenu(null);
    historyGestureStartRef.current = null;
    setUndoStack((current) => [...current, cloneAnnotationsSnapshot(activeAnnotationsRef.current)].slice(-HISTORY_STACK_LIMIT));
    setRedoStack(remainingRedoStack);
    setLayerAnnotations(cloneAnnotationsSnapshot(nextAnnotations), {
      preserveRedo: true,
      skipHistory: true,
    });
  };

  const saveNow = async () => {
    if (!editable) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (selfAssessmentSaveTimerRef.current) clearTimeout(selfAssessmentSaveTimerRef.current);
    saveTimerRef.current = null;
    selfAssessmentSaveTimerRef.current = null;
    const snapshot = getCurrentLayerSnapshot();
    pendingAutosaveRef.current = null;
    setAutosaveQueued(false);
    try {
      await saveAnnotations(snapshot);
      messageApi.success("Saved");
    } catch (error) {
      console.error(error);
      messageApi.error("Save failed");
    }
  };

  const submitAssessmentRecord = useCallback(
    async (additionalNotes: string, includeSelfAssessment: boolean) => {
      const formData = new FormData();
      formData.append("task_id", taskId);
      formData.append("additional_notes", additionalNotes);

      if (includeSelfAssessment && selfAssessmentMark != null) {
        formData.append("self_assessment_mark", String(selfAssessmentMark));
      }

      try {
        await uploadTaskByStudent(formData, Number(assessmentId));
      } catch (error: any) {
        const duplicateSubmission =
          Number(error?.response?.data?.status_code ?? error?.response?.status ?? 0) === 409;
        if (!duplicateSubmission) throw error;
      }
    },
    [assessmentId, selfAssessmentMark, taskId]
  );

  const finishStudentWork = async () => {
    if (role !== "student") return;
    if (!examWindow.examMode && selfAssessmentMark == null) {
      messageApi.warning("Enter your self-assessment mark before finishing.");
      return;
    }
    setFinishing(true);
    try {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (selfAssessmentSaveTimerRef.current) clearTimeout(selfAssessmentSaveTimerRef.current);
      saveTimerRef.current = null;
      selfAssessmentSaveTimerRef.current = null;
      const snapshot = getCurrentLayerSnapshot();
      pendingAutosaveRef.current = null;
      setAutosaveQueued(false);
      await saveAnnotations(snapshot, "submitted", { studentLocked: false });
      await submitAssessmentRecord(
        examWindow.examMode
          ? "Completed online exam workspace"
          : "Completed online PDF workspace",
        !examWindow.examMode
      );

      messageApi.success(
        examWindow.examMode
          ? "Exam submitted. You can keep editing until the timer ends or your teacher marks it."
          : "Submitted. You can keep editing until your teacher marks it."
      );
    } catch (error) {
      console.error(error);
      messageApi.error("Saved, but final submission to the assessment list may have failed.");
    } finally {
      setFinishing(false);
    }
  };

  const handleStartExamMode = async () => {
    setHandlingExamExit(true);
    try {
      const enteredFullscreen = await requestExamFullscreen();
      if (!enteredFullscreen) {
        messageApi.error(
          examFullscreenSupported
            ? "Fullscreen was blocked by the browser. Allow fullscreen for this site and use Chrome or Edge for the strictest exam mode."
            : "This browser cannot lock the exam into full device-style fullscreen. Use Chrome or Edge on desktop or Android, or a managed exam browser."
        );
        return;
      }

      setExamStartModalOpen(false);
    } finally {
      setHandlingExamExit(false);
    }
  };

  const handleRemainInExam = async () => {
    setHandlingExamExit(true);
    try {
      const enteredFullscreen = await requestExamFullscreen();
      if (!enteredFullscreen) {
        messageApi.warning(
          examFullscreenSupported
            ? "Fullscreen is required to continue the exam. Allow fullscreen for this site and return to the exam screen."
            : "This device/browser cannot enforce locked fullscreen for this exam. Use a supported browser or managed exam device."
        );
        return;
      }

      setExamExitModalOpen(false);
      setExamExitReason("");
      setExamStartModalOpen(false);
    } finally {
      setHandlingExamExit(false);
    }
  };

  const handleExitExam = async () => {
    const trimmedReason = examExitReason.trim();
    if (!trimmedReason) {
      messageApi.warning("Write why you want to exit the exam.");
      return;
    }

    setHandlingExamExit(true);
    try {
      approvedExamExitRef.current = true;
      suppressExamExitPromptRef.current = true;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      pendingAutosaveRef.current = null;
      setAutosaveQueued(false);

      await persistExamExitReason(trimmedReason, examExitContext);

      if (
        typeof document !== "undefined" &&
        getCurrentFullscreenElement(document as FullscreenCapableDocument)
      ) {
        await document.exitFullscreen().catch(() => undefined);
      }

      setExamExitModalOpen(false);
      setExamExitReason("");

      if (typeof window !== "undefined") {
        if (safeReturnTo) {
          window.location.assign(safeReturnTo);
        } else if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.assign("/dashboard");
        }
      }
    } catch (error) {
      approvedExamExitRef.current = false;
      suppressExamExitPromptRef.current = false;
      console.error(error);
      messageApi.error("Could not save the exit reason. Please try again.");
    } finally {
      setHandlingExamExit(false);
    }
  };

  useEffect(() => {
    if (
      role !== "student" ||
      !examWindow.examMode ||
      examWindow.state !== "ended" ||
      autoSubmittedExpiredExamRef.current
    ) {
      return;
    }

    autoSubmittedExpiredExamRef.current = true;

    const finalizeExpiredExam = async () => {
      setFinishing(true);
      try {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
        pendingAutosaveRef.current = null;
        setAutosaveQueued(false);

        const snapshot = getCurrentLayerSnapshot();
        activeStrokeRef.current = null;
        setActiveStroke(null);
        await saveAnnotations(snapshot, "submitted", { studentLocked: false });
        await submitAssessmentRecord(
          "Exam time ended. Auto-submitted from the online exam workspace.",
          false
        );
        messageApi.info("Exam time ended. Your work has been autosaved and submitted.");
      } catch (error) {
        console.error(error);
        messageApi.error("Exam time ended, but automatic submission failed. Your latest work is still saved.");
      } finally {
        setFinishing(false);
      }
    };

    void finalizeExpiredExam();
  }, [
    examWindow.examMode,
    examWindow.state,
    getCurrentLayerSnapshot,
    messageApi,
    role,
    saveAnnotations,
    submitAssessmentRecord,
  ]);

  const finalizeTeacherMark = async () => {
    if (role !== "teacher") return;
    if (!teacherMarks.trim()) {
      messageApi.warning("Enter the teacher mark before finalising.");
      return;
    }
    const aiPreviewFeedback = aiDraftPreview
      ? [
          aiDraftPreview.feedback,
          aiDraftPreview.rationale ? `AI rationale for teacher review: ${aiDraftPreview.rationale}` : "",
          aiDraftPreview.warnings.length > 0 ? `Warnings: ${aiDraftPreview.warnings.join("; ")}` : "",
        ]
          .filter(Boolean)
          .join("\n\n")
      : "";
    setFinishing(true);
    try {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      pendingAutosaveRef.current = null;
      setAutosaveQueued(false);
      await saveAnnotations(activeAnnotations, "marked", { studentLocked: true });
      await addStudentTaskMarks(Number(studentId), {
        assessment_id: Number(assessmentId),
        task_id: Number(taskId),
        teacher_assessment_marks: Number(teacherMarks || 0),
        teacher_assessment_feedback:
          teacherFeedback.trim() || aiPreviewFeedback || "Marked online on the PDF.",
      });
      if (typeof window !== "undefined") {
        const payload = JSON.stringify({ assessmentId: Number(assessmentId), taskId: Number(taskId), at: Date.now() });
        window.localStorage.setItem("osteps:assessment-mark-updated", payload);
        window.dispatchEvent(new CustomEvent("osteps:assessment-mark-updated", { detail: { assessmentId: Number(assessmentId), taskId: Number(taskId) } }));
      }
      messageApi.success("Teacher annotations and markbook marks saved.");
    } catch (error) {
      console.error(error);
      messageApi.error("Could not finalise teacher mark.");
    } finally {
      setFinishing(false);
    }
  };

  const flushTeacherAnnotationsBeforeNavigation = async () => {
    if (role !== "teacher" || !documentLoaded) return;
    const snapshot = getCurrentLayerSnapshot();
    const signature = getAnnotationsSignature(snapshot);
    if (!autosaveQueued && signature === lastLiveSyncedSignatureRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
    pendingAutosaveRef.current = null;
    setAutosaveQueued(false);
    await saveAnnotations(snapshot, undefined, { syncState: false, silent: true });
    lastLiveSyncedSignatureRef.current = signature;
  };

  const handleStudentSwitcherChange = async (nextStudentId: string) => {
    if (!onStudentChange || nextStudentId === studentId) return;
    try {
      await flushTeacherAnnotationsBeforeNavigation();
    } catch (error) {
      console.error(error);
      messageApi.warning("Could not auto-save teacher notes before switching. Please press Save now, then switch student.");
      return;
    }
    onStudentChange(nextStudentId);
  };

  const applyAiDraftMark = async () => {
    if (role !== "teacher") return;
    if (!documentReadyForCurrentStudent || loading) {
      messageApi.info("Wait for this student's paper to finish loading before using AI Draft Mark.");
      return;
    }
    if (rendering || pages.length === 0) {
      messageApi.info("Wait for the paper to finish rendering before using AI Draft Mark.");
      return;
    }

    setAiDrafting(true);
    setAiDraftPreview(null);
    try {
      const { images: pageImages, pageNumbers: pageImagePageNumbers } = await buildAiPageSnapshots();
      const draft = await draftAssessmentMark({
        assessmentId,
        taskId,
        studentId,
        studentName: displayStudentName,
        title,
        subjectName,
        fileUrl,
        maxMarks,
        studentAnnotations: compactAnnotationsForAiDraft(studentAnnotations),
        pageImages,
        pageImagePageNumbers,
        currentTeacherMarks: teacherMarks,
        currentTeacherFeedback: teacherFeedback,
      });
      const normalizedDraft = normalizeAiDraftPreview(draft);

      if (isFailedAiDraft(normalizedDraft)) {
        setAiDraftPreview(normalizedDraft);
        persistLocalDraft(getCurrentLayerSnapshot(), {
          ...(state?.metadata && typeof state.metadata === "object" ? state.metadata : {}),
          teacherMarks,
          teacherFeedback,
          aiDraftPreview: normalizedDraft,
        });
        messageApi.warning(
          normalizedDraft.providerTrace?.selected
            ? `AI could not draft a safe mark with ${normalizedDraft.providerTrace.selected}. Your current mark and feedback were not changed.`
            : "AI could not draft a safe mark. Your current mark and feedback were not changed."
        );
        return;
      }

      const nextTeacherMarks = String(normalizedDraft.suggestedMark);
      const nextTeacherFeedback = normalizedDraft.feedback.trim();
      const preservedTeacherAnnotations = teacherAnnotations.filter(
        (annotation) => !String(annotation.id || "").startsWith(AI_DRAFT_OVERLAY_ID_PREFIX)
      );
      const aiOverlayAnnotations = buildAiDraftOverlayAnnotations({ draft: normalizedDraft, pages });
      const nextTeacherAnnotations = [...preservedTeacherAnnotations, ...aiOverlayAnnotations];

      setTeacherMarks(nextTeacherMarks);
      setTeacherFeedback(nextTeacherFeedback);
      setAiDraftPreview(normalizedDraft);
      setLayerAnnotations(nextTeacherAnnotations);
      persistLocalDraft(nextTeacherAnnotations, {
        ...(state?.metadata && typeof state.metadata === "object" ? state.metadata : {}),
        teacherMarks: nextTeacherMarks,
        teacherFeedback: nextTeacherFeedback,
        aiDraftPreview: normalizedDraft,
      });
      messageApi.success(
        normalizedDraft.providerTrace?.selected
          ? `AI draft added using ${normalizedDraft.providerTrace.selected}.${aiOverlayAnnotations.length > 0 ? ` ${aiOverlayAnnotations.length} MCQ/True-False selections were circled.` : " No safe MCQ/True-False circles were added."} Review it before saving the markbook mark.`
          : `AI draft added.${aiOverlayAnnotations.length > 0 ? ` ${aiOverlayAnnotations.length} MCQ/True-False selections were circled.` : " No safe MCQ/True-False circles were added."} Review it before saving the markbook mark.`
      );
    } catch (error) {
      console.error(error);
      messageApi.error(error instanceof Error ? error.message : "Could not create an AI draft mark.");
    } finally {
      setAiDrafting(false);
    }
  };

  const requestAiDraftMark = () => {
    void applyAiDraftMark();
  };

  // Listen for the AI assistant to emit a parsed total mark so we can auto-fill the mark box
  // and show a prominent notification to the teacher.
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ mark: number; maxMarks?: number | null }>;
      const mark = ev.detail?.mark;
      const maxMarks = ev.detail?.maxMarks;
      if (mark != null && Number.isFinite(mark)) {
        setTeacherMarks(String(mark));
        const announcementKey = `${mark}/${maxMarks ?? ""}`;
        if (lastAiMarkAnnouncementRef.current === announcementKey) return;
        lastAiMarkAnnouncementRef.current = announcementKey;
        void messageApi.success(
          maxMarks != null && Number.isFinite(maxMarks)
            ? `AI suggested mark: ${mark} / ${maxMarks} — mark box updated`
            : `AI suggested mark: ${mark} — mark box updated`,
          6
        );
      }
    };
    window.addEventListener("osteps:ai-mark-extracted", handler);
    return () => window.removeEventListener("osteps:ai-mark-extracted", handler);
  }, [messageApi]);

  const openAiMarkingAssistant = async () => {
    lastAiMarkAnnouncementRef.current = "";
    visualAnswerCacheRef.current = null;

    // Collect ALL typed text boxes, sorted top-to-bottom.
    // Skip boxes in the header region of page 1 (top 10% of page height) where
    // the student name / class / date fields are placed — these are never answers.
    const page1Height = pages.find((p) => p.pageNumber === 1)?.height ?? 0;
    // Use 15% of page height as header threshold; fall back to 150px if page dimensions aren't known yet.
    const headerThreshold = page1Height > 0 ? page1Height * 0.15 : 150;

    const typedAnswers = studentAnnotations
      .filter((a) => a.type === "text")
      .map((a) => ({
        page: a.page,
        y: Math.round(Number((a as { y?: number }).y ?? 0)),
        text: ((a as { text?: string }).text ?? "").trim(),
      }))
      .filter((a) => {
        if (!a.text) return false;
        // Skip header-region boxes on page 1 (name / class / date fields)
        if (a.page === 1 && a.y < headerThreshold) return false;
        return true;
      })
      .sort((l, r) => (l.page - r.page) || (l.y - r.y))
      .map((a, i) => `Text box ${i + 1} [Page ${a.page}]: "${a.text}"`)
      .join("\n")
      .slice(0, 3500);

    messageApi.open({
      key: "ai-marking-assistant",
      type: "loading",
      content: "Reading PDF questions and student handwriting...",
      duration: 0,
    });

    let pageImages: string[] = [];
    let pageImagePageNumbers: number[] = [];
    let draftPreviewForChat: AiDraftMarkResponse | null = null;
    let extractedAiMark: { mark: number; maxMarks?: number | null } | null = null;

    if (pages.length > 0 && !rendering) {
      try {
        const snapshotBatch = await buildAiPageSnapshots();
        pageImages = snapshotBatch.images;
        pageImagePageNumbers = snapshotBatch.pageNumbers;
      } catch {
        pageImages = [];
        pageImagePageNumbers = [];
      }
    }

    // Pre-fetch paper text once and cache it so follow-up messages don't re-extract
    if (paperTextCacheRef.current === null && fileUrl) {
      try {
        const res = await fetch("/api/ai/extract-paper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl }),
        });
        if (res.ok) {
          const data = (await res.json()) as { text?: string };
          paperTextCacheRef.current = data.text ?? "";
        } else {
          paperTextCacheRef.current = "";
        }
      } catch {
        paperTextCacheRef.current = "";
      }
    }

    // Read visible student evidence once: handwriting, circles, ticks, crosses, pen marks, and text boxes.
    if (visualAnswerCacheRef.current === null && pages.length > 0 && !rendering) {
      try {
        if (pageImages.length > 0) {
          const res = await fetch("/api/ai/read-student-paper", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              subject: subjectName ?? undefined,
              pageImages,
              pageImagePageNumbers,
            }),
          });
          if (res.ok) {
            const data = (await res.json()) as { text?: string };
            visualAnswerCacheRef.current = data.text ?? "";
          } else {
            visualAnswerCacheRef.current = "";
          }
        } else {
          visualAnswerCacheRef.current = "";
        }
      } catch {
        visualAnswerCacheRef.current = "";
      }
    }

    if (pageImages.length > 0) {
      try {
        const normalizedDraft = normalizeAiDraftPreview(
          await draftAssessmentMark({
            assessmentId,
            taskId,
            studentId,
            studentName: displayStudentName,
            title,
            subjectName,
            fileUrl,
            maxMarks,
            studentAnnotations,
            pageImages,
            pageImagePageNumbers,
            currentTeacherMarks: teacherMarks,
            currentTeacherFeedback: teacherFeedback,
          })
        );

        if (normalizedDraft) {
          const reliableDraft = isReliableAiDraft(normalizedDraft) ? normalizedDraft : null;
          draftPreviewForChat = reliableDraft;
          setAiDraftPreview(reliableDraft);

          if (reliableDraft?.suggestedMark != null) {
            const nextTeacherMarks = String(reliableDraft.suggestedMark);
            extractedAiMark = { mark: reliableDraft.suggestedMark, maxMarks: maxMarks ?? undefined };
            persistLocalDraft(getCurrentLayerSnapshot(), {
              ...(state?.metadata && typeof state.metadata === "object" ? state.metadata : {}),
              teacherMarks: nextTeacherMarks,
              teacherFeedback,
              aiDraftPreview: reliableDraft,
            });
          }
        }
      } catch (error) {
        console.error("Could not precompute AI draft total before opening the assistant:", error);
      }
    }

    const studentEvidence = [
      typedAnswers ? `Student typed answer boxes (in page + top-to-bottom order; rule 6 of AI: ignore any box that is clearly a name/header field):\n${typedAnswers}` : "",
      visualAnswerCacheRef.current ? `Visual evidence (handwriting, pen circles/ticks on printed MCQ options):\n${visualAnswerCacheRef.current}` : "",
    ].filter(Boolean).join("\n\n").slice(0, 5500);

    messageApi.destroy("ai-marking-assistant");

    if (extractedAiMark) {
      window.dispatchEvent(new CustomEvent("osteps:ai-mark-extracted", { detail: extractedAiMark }));
    }

    // Warn the teacher when neither the paper text nor student answers could be read.
    const hasPaperText = Boolean(paperTextCacheRef.current && paperTextCacheRef.current.length > 30);
    const hasEvidence = Boolean(studentEvidence && studentEvidence.length > 5);
    if (!hasPaperText && !hasEvidence) {
      void messageApi.warning(
        "Could not read the PDF text or student answers. Make sure the pages have finished loading, then try again.",
        6
      );
    }

    // Build a human-readable initial message that puts the student's typed answers RIGHT IN
    // the message body so the AI cannot miss them regardless of context handling.
    const evidenceBlock = studentEvidence
      ? `\n\nSTUDENT EVIDENCE:\n${studentEvidence}`
      : "\n\n(No typed text or visual evidence detected — mark based on the PDF questions only.)";

    window.dispatchEvent(new CustomEvent("osteps:open-ai-assistant", {
      detail: {
        context: {
          page: "marking",
          title,
          subject: subjectName ?? undefined,
          maxMarks: maxMarks ?? undefined,
          suggestedMark: draftPreviewForChat?.suggestedMark ?? undefined,
          feedback: draftPreviewForChat?.feedback || undefined,
          rationale: draftPreviewForChat?.rationale || undefined,
          fileUrl,
          paperContext: paperTextCacheRef.current ? paperTextCacheRef.current.slice(0, 7500) : undefined,
          studentAnswer: studentEvidence || undefined,
          questionBreakdown: draftPreviewForChat?.questionBreakdown
            ? JSON.stringify(draftPreviewForChat.questionBreakdown).slice(0, 8000)
            : undefined,
        },
        initialMessage:
          draftPreviewForChat?.suggestedMark != null
            ? `Use the provided per-question draft marking breakdown as the authoritative draft for this paper. Do not re-mark from scratch unless the teacher explicitly asks you to review a specific question. For every question in the provided breakdown, list: the student's answer, Correct/Partly/Wrong, the correct answer, and marks awarded. If the draft breakdown appears to miss a question, briefly say teacher review is needed for that missing question instead of inventing a new mark. End with the exact final line "Total: ${draftPreviewForChat.suggestedMark}/${maxMarks ?? "the total"}" and then 2 sentences of feedback for the student.`
            : `Mark this student's paper. For every question list: the student's answer, Correct/Partly/Wrong, the correct answer, and marks awarded. End with the exact final line "Total: [X]/[Y]" and then 2 sentences of feedback.${evidenceBlock}`,
      },
    }));
  };

  const drawPageIntoCanvas = async (
    page: RenderedPage,
    outputCanvas: HTMLCanvasElement,
    options?: { includeTeacherAnnotations?: boolean }
  ) => {
    outputCanvas.width = Math.max(1, Math.round(page.width));
    outputCanvas.height = Math.max(1, Math.round(page.height));
    const context = outputCanvas.getContext("2d");
    if (!context) throw new Error("Could not prepare export canvas");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

    if (page.previewUrl) {
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
          context.drawImage(image, 0, 0, page.width, page.height);
          resolve();
        };
        image.onerror = () => reject(new Error("Could not export rendered page"));
        image.src = page.previewUrl;
      });
    } else if (documentKind === "docx") {
      context.fillStyle = "#111827";
      context.font = "18px Arial, sans-serif";
      context.fillText("Word document preview cannot be flattened in-browser. Open the original file instead.", 48, 60);
    } else {
      throw new Error("The paper is still rendering. Try again after the pages finish loading.");
    }

    const annotationsToDraw =
      options?.includeTeacherAnnotations === false
        ? studentAnnotations
        : [...studentAnnotations, ...teacherAnnotations];

    for (const annotation of annotationsToDraw) {
      if (annotation.page !== page.pageNumber) continue;
      if (annotation.type === "pen") drawPen(context, annotation);
      if (annotation.type === "text") drawWrappedText(context, annotation);
    }
  };

  const buildAiPageSnapshots = useCallback(async () => {
    if (rendering || pages.length === 0) return { images: [] as string[], pageNumbers: [] as number[] };

    const answeredPageNumbers = Array.from(
      new Set(
        studentAnnotations
          .map((annotation) => Number(annotation.page || 0))
          .filter((pageNumber) => Number.isFinite(pageNumber) && pageNumber > 0)
      )
    ).sort((left, right) => left - right);

    // Prioritise pages where the student actually typed/wrote answers, then include
    // remaining pages for context. This prevents later answer pages (e.g. pages 9-10)
    // being dropped just because the PDF starts with instruction/MCQ pages.
    const answeredPages = pages.filter((page) => answeredPageNumbers.includes(page.pageNumber));
    const contextPages = pages.filter((page) => !answeredPageNumbers.includes(page.pageNumber));
    const candidatePages = answeredPages.length > 0 ? [...answeredPages, ...contextPages] : pages;

    const snapshots: string[] = [];
    const pageNumbers: number[] = [];
    for (const page of candidatePages.slice(0, AI_PAGE_IMAGE_MAX_COUNT)) {
      const sourceCanvas = document.createElement("canvas");
      await drawPageIntoCanvas(page, sourceCanvas, { includeTeacherAnnotations: false });

      const scale = Math.min(1, AI_PAGE_IMAGE_MAX_WIDTH / Math.max(1, page.width));
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = Math.max(1, Math.round(sourceCanvas.width * scale));
      outputCanvas.height = Math.max(1, Math.round(sourceCanvas.height * scale));

      const outputContext = outputCanvas.getContext("2d");
      if (!outputContext) continue;

      outputContext.fillStyle = "#ffffff";
      outputContext.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
      outputContext.drawImage(sourceCanvas, 0, 0, outputCanvas.width, outputCanvas.height);
      snapshots.push(outputCanvas.toDataURL("image/jpeg", AI_PAGE_IMAGE_JPEG_QUALITY));
      pageNumbers.push(page.pageNumber);
    }

    return { images: snapshots, pageNumbers };
  }, [drawPageIntoCanvas, pages, rendering, studentAnnotations]);

  const downloadSubmittedPaper = async () => {
    if (!canDownloadSubmittedPaper) {
      messageApi.warning("This student paper is still open. Download is enabled after the student submits or the paper is locked.");
      return;
    }
    if (rendering || pages.length === 0) {
      messageApi.info("Wait for the paper to finish rendering before downloading.");
      return;
    }

    setExportingPaper(true);
    try {
      const { jsPDF } = await import("jspdf");
      const fileName = `${sanitizeFileName(displayStudentName)} - ${sanitizeFileName(title || "assessment")}.pdf`;
      let pdf: InstanceType<typeof jsPDF> | null = null;

      for (const page of pages) {
        const canvas = document.createElement("canvas");
        await drawPageIntoCanvas(page, canvas);
        const orientation = page.width >= page.height ? "landscape" : "portrait";
        if (!pdf) {
          pdf = new jsPDF({ orientation, unit: "pt", format: [page.width, page.height] });
        } else {
          pdf.addPage([page.width, page.height], orientation);
        }
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, page.width, page.height);
      }

      pdf?.save(fileName);
      messageApi.success("Student paper downloaded. No student answers were changed.");
    } catch (error) {
      console.error(error);
      messageApi.error("Could not create the paper PDF. Open the original file or try again after the preview renders.");
    } finally {
      setExportingPaper(false);
    }
  };

  useEffect(() => {
    autoDownloadAttemptedRef.current = false;
  }, [assessmentId, autoDownloadTeacherPaper, studentId, taskId]);

  useEffect(() => {
    if (!autoDownloadTeacherPaper || role !== "teacher" || autoDownloadAttemptedRef.current) return;
    if (loading || rendering || !documentLoaded || pages.length === 0) return;
    autoDownloadAttemptedRef.current = true;
    void downloadSubmittedPaper();
  }, [autoDownloadTeacherPaper, documentLoaded, loading, pages.length, rendering, role]);

  const toggleStudentEditingLock = async () => {
    if (role !== "teacher" || !state) return;
    setChangingStudentLock(true);
    try {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      pendingAutosaveRef.current = null;
      setAutosaveQueued(false);
      await saveAnnotations(activeAnnotations, undefined, { studentLocked: !studentLocked });
      messageApi.success(
        studentLocked
          ? "Student can now write and edit this document."
          : "Student editing is now locked."
      );
    } catch (error) {
      console.error(error);
      messageApi.error("Could not update student edit access.");
    } finally {
      setChangingStudentLock(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {contextHolder}
        <Spin size="large" />
      </div>
    );
  }

  const aiDeductionRows = getAiDeductionRows(aiDraftPreview);
  const toolbarViewportScale = visualViewportScale > 0 ? visualViewportScale : 1;
  const toolbarChromeStyle: React.CSSProperties = {
    left: visualViewportOffset.left,
    top: visualViewportOffset.top,
    width: visualViewportOffset.width ? visualViewportOffset.width * toolbarViewportScale : undefined,
    transform: toolbarViewportScale === 1 ? undefined : `scale(${1 / toolbarViewportScale})`,
    transformOrigin: "top left",
  };

  return (
    <div ref={examContainerRef} className="min-h-screen bg-slate-100">
      {contextHolder}
      {shouldEnforceExamScreen ? (
        <>
          <style>{`
            @media print {
              body * { visibility: hidden !important; }
              body::before {
                content: "Printing is disabled during OSTEPS exam mode.";
                visibility: visible !important;
                display: block;
                padding: 48px;
                font: 700 24px Arial, sans-serif;
                color: #b91c1c;
              }
            }
          `}</style>
          <div className="pointer-events-none fixed inset-0 z-[60] grid grid-cols-2 gap-8 overflow-hidden p-8 opacity-[0.10] md:grid-cols-3">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className="select-none whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-slate-900"
                style={{ transform: "rotate(-28deg)" }}
              >
                {examWatermarkText}
              </div>
            ))}
          </div>
        </>
      ) : null}
      <Modal
        open={examStartModalOpen}
        title="Start exam mode"
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={[
          <Button
            key="enter-fullscreen"
            type="primary"
            loading={handlingExamExit}
            onClick={() => void handleStartExamMode()}
          >
            Enter exam fullscreen
          </Button>,
        ]}
      >
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            This exam must be taken in fullscreen mode. Enter exam mode to continue writing.
          </p>
          <p>
            If you try to leave the screen, you will be asked why you want to exit before you can continue out of the exam.
          </p>
        </div>
      </Modal>
      <Modal
        open={examExitModalOpen}
        title="Exit exam?"
        closable={false}
        maskClosable={false}
        keyboard={false}
        okText="Exit exam"
        cancelText="Remain in exam"
        onOk={() => void handleExitExam()}
        onCancel={() => void handleRemainInExam()}
        okButtonProps={{ danger: true, loading: handlingExamExit }}
        cancelButtonProps={{ loading: handlingExamExit }}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Why do you want to exit the exam? Write a reason before leaving, or stay in fullscreen to continue.
          </p>
          <Input.TextArea
            autoFocus
            rows={4}
            maxLength={EXAM_EXIT_REASON_MAX_LENGTH}
            value={examExitReason}
            onChange={(event) => setExamExitReason(event.target.value)}
            placeholder="Explain why you need to leave the exam screen..."
          />
        </div>
      </Modal>
      <div
        ref={toolbarChromeRef}
        className="fixed left-0 right-0 top-0 z-[90] border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
        style={toolbarChromeStyle}
      >
        <div className={shouldEnforceExamScreen ? "flex flex-col gap-4" : "mx-auto flex max-w-7xl flex-col gap-4"}>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-gray-900">{title}</h1>
            {role === "teacher" && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Student</span>
                {studentSwitcherOptions.length > 0 && onStudentChange ? (
                  <Select
                    showSearch
                    value={studentId}
                    loading={studentSwitcherLoading}
                    onChange={(value) => void handleStudentSwitcherChange(value)}
                    className="min-w-64"
                    optionFilterProp="label"
                    options={studentSwitcherOptions.map((option) => ({
                      value: option.value,
                      label: option.status ? `${option.label} · ${option.status}` : option.label,
                    }))}
                  />
                ) : (
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-sm font-medium text-slate-800">
                    {displayStudentName}
                  </span>
                )}
              </div>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:flex-nowrap sm:overflow-hidden">
              <Tag className="mb-0 shrink-0 whitespace-nowrap" color={role === "teacher" ? "red" : "blue"}>{role === "teacher" ? "Teacher marking" : "Student copy"}</Tag>
              <Tag className="mb-0 shrink-0 whitespace-nowrap" color={state?.status === "draft" ? "gold" : state?.status === "submitted" ? "green" : "purple"}>{state?.status || "draft"}</Tag>
              <Tag className="mb-0 shrink-0 whitespace-nowrap" color={studentLocked ? "default" : "cyan"}>{studentLocked ? "Student locked" : "Student open"}</Tag>
              <Tag
                className="mb-0 inline-flex min-w-[4.75rem] shrink-0 justify-center whitespace-nowrap"
                color={autosaveStatusColor}
                title={lastSavedAt ? `Saved ${lastSavedAt}` : autosaveStatusLabel}
              >
                {autosaveStatusLabel}
              </Tag>
              {maxMarks != null && <Tag className="mb-0 shrink-0 whitespace-nowrap tabular-nums">{maxMarks} marks</Tag>}
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <div className="order-2 flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                {TOOL_BUTTONS.map(({ value, label, Icon }) => (
                  <Button
                    key={value}
                    type="text"
                    icon={<Icon className="h-5 w-5" strokeWidth={2.2} />}
                    disabled={!editable}
                    onClick={() => setTool(value)}
                    title={label}
                    aria-label={`Use ${label.toLowerCase()} tool`}
                    className={[
                      "!flex !h-11 !w-11 !items-center !justify-center !rounded-xl !border !p-0 !shadow-none",
                      tool === value
                        ? "!border-black !bg-black !text-white hover:!border-black hover:!bg-black hover:!text-white"
                        : "!border-transparent !bg-white !text-slate-800 hover:!border-slate-200 hover:!bg-slate-100 hover:!text-black",
                    ].join(" ")}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1">
                <Button
                  size="small"
                  onClick={() => setZoomLevel((current) => clampZoomLevel(current - ZOOM_STEP))}
                  disabled={zoomLevel <= MIN_ZOOM_LEVEL}
                >
                  -
                </Button>
                <span className="w-14 text-center text-xs font-medium tabular-nums text-gray-600">
                  {zoomPercent}%
                </span>
                <Button
                  size="small"
                  onClick={() => setZoomLevel((current) => clampZoomLevel(current + ZOOM_STEP))}
                  disabled={zoomLevel >= MAX_ZOOM_LEVEL}
                >
                  +
                </Button>
              </div>
              <Button onClick={undo} disabled={!editable || undoStack.length === 0}>Undo</Button>
              <Button onClick={redo} disabled={!editable || redoStack.length === 0}>Redo</Button>
              <Button onClick={saveNow} disabled={!editable} loading={saving}>Save now</Button>
            </div>

            {(tool !== "eraser" && (tool !== "cursor" || canEditSelectedStroke)) && (
              <div className="order-3 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-2">
                <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-2 py-2 shadow-sm">
                  {COLOR_SWATCHS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      title={label}
                      aria-label={`Set color to ${label.toLowerCase()}`}
                      disabled={!editable}
                      onClick={() => handleStrokeColorChange(value)}
                      className={[
                        "h-10 w-10 rounded-full border-2 transition",
                        value === "#ffffff" ? "border-slate-300" : "border-white/80",
                        activeStrokeColor === value
                          ? "ring-4 ring-[#9b8cff] ring-offset-2 ring-offset-white"
                          : "hover:scale-105",
                        !editable ? "cursor-not-allowed opacity-50" : "",
                      ].join(" ")}
                      style={{ backgroundColor: value }}
                    />
                  ))}
                </div>

                {tool === "text" ? (
                  <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    {TEXT_SIZE_OPTIONS.map((fontSize) => (
                      <button
                        key={fontSize}
                        type="button"
                        disabled={!editable}
                        onClick={() => {
                          setTextFontSize(fontSize);
                          setEditingText((current) =>
                            current ? { ...current, fontSize } : current
                          );
                        }}
                        className={[
                          "min-w-12 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                          textFontSize === fontSize
                            ? "border-black bg-black text-white"
                            : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-100",
                          !editable ? "cursor-not-allowed opacity-50" : "",
                        ].join(" ")}
                      >
                        {fontSize}
                      </button>
                    ))}
                  </div>
                ) : (
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
                          disabled={!editable}
                          onClick={() => handleStrokeWidthChange(widthValue)}
                          className={[
                            "flex h-10 min-w-12 items-center justify-center rounded-xl border px-3 transition",
                            selected
                              ? "border-black bg-black text-white"
                              : "border-transparent bg-white text-slate-800 hover:border-slate-200 hover:bg-slate-100",
                            !editable ? "cursor-not-allowed opacity-50" : "",
                          ].join(" ")}
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
                )}
              </div>
            )}

            {role === "student" ? (
              <div className="order-1 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-2">
                <InputNumber min={0} max={maxMarks} value={selfAssessmentMark ?? undefined} onChange={(value) => setSelfAssessmentMark(value == null ? null : Number(value))} placeholder={examWindow.examMode ? "Predicted mark" : "Self mark"} disabled={!editable} className="w-32" />
                <Button type="primary" className="!bg-[#16a34a] !border-[#16a34a] !text-white hover:!bg-[#15803d] hover:!border-[#15803d] disabled:!bg-gray-200 disabled:!border-gray-200 disabled:!text-gray-500" onClick={finishStudentWork} loading={finishing} disabled={!editable}>{examWindow.examMode ? "Submit exam" : "Submit work"}</Button>
              </div>
            ) : (
              <div className="order-1 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-2">
                <Button
                  onClick={toggleStudentEditingLock}
                  loading={changingStudentLock}
                  type={studentLocked ? "default" : "primary"}
                  danger={!studentLocked}
                >
                  {studentLocked ? "Open for student edits" : "Lock student editing"}
                </Button>
                <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  <span className="font-medium">{examWindow.examMode ? "Predicted" : "Self"}</span>
                  <span className="font-semibold">
                    {selfAssessmentMark ?? "-"}
                    {maxMarks != null ? `/${maxMarks}` : ""}
                  </span>
                </div>
                <Input className="w-24" placeholder="Marks" value={teacherMarks} onChange={(event) => setTeacherMarks(event.target.value)} />
                <Button onClick={requestAiDraftMark} loading={aiDrafting} disabled={!documentReadyForCurrentStudent || rendering}>
                  Ask AI to Mark
                </Button>
                <Button
                  onClick={() => void downloadSubmittedPaper()}
                  loading={exportingPaper}
                  disabled={!canDownloadSubmittedPaper || rendering}
                  title={canDownloadSubmittedPaper ? "Download this student paper as a PDF" : "Download is available after the student submits or the paper is locked"}
                >
                  Download paper
                </Button>
                <Button type="primary" onClick={finalizeTeacherMark} loading={finishing}>Save markbook mark</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        ref={viewerScrollRef}
        className={shouldEnforceExamScreen ? "h-[calc(100vh-85px)] overflow-auto p-4" : "mx-auto max-w-7xl p-4"}
        style={{ paddingTop: toolbarHeight ? toolbarHeight + 16 : undefined }}
      >
        {documentFileMismatch ? (
          <Alert
            className="mb-4"
            type="error"
            showIcon
            message="This saved answer belongs to a different PDF than the task currently points to."
            description="OSTEPS is showing the original PDF linked to this saved answer to protect student work. Do not continue marking against the changed task PDF until an admin checks the assignment document."
          />
        ) : null}
        {!documentFileMismatch && documentIdentityUnverified ? (
          <Alert
            className="mb-4"
            type="error"
            showIcon
            message="This older saved answer has no recorded original PDF identity."
            description="Student writing is protected and temporarily read-only. An admin must verify which PDF belongs to this answer before students continue, so answers are not mixed with another year or class paper."
          />
        ) : null}
        {role === "teacher" ? (
          <Alert
            className="mb-4"
            type="info"
            showIcon
            message="Use AI marking to fill the mark and feedback"
            description="'Ask AI to Mark' now fills the marks box and simple deduction feedback directly from the student's handwriting, typed answers, and visible MCQ circles or ticks. Use ✨ (bottom-right) only if you want to open the assistant chat separately."
            action={
              <Button
                size="small"
                type="primary"
                onClick={requestAiDraftMark}
                loading={aiDrafting}
                disabled={!documentReadyForCurrentStudent || rendering}
              >
                Ask AI to Mark
              </Button>
            }
          />
        ) : null}
        {role === "teacher" && aiDraftPreview && !isFailedAiDraft(aiDraftPreview) ? (
          <Alert
            className="mb-4"
            type="success"
            showIcon
            closable
            onClose={() => setAiDraftPreview(null)}
            message={aiDraftPreview.suggestedMark != null ? `AI suggested mark: ${aiDraftPreview.suggestedMark}${maxMarks ? ` / ${maxMarks}` : ""}` : "AI marking complete"}
            description={
              <div className="space-y-1 text-sm text-gray-700">
                {aiDraftPreview.providerTrace?.selected ? (
                  <p className="text-xs font-medium text-teal-700">
                    AI provider: {aiDraftPreview.providerTrace.selected}
                  </p>
                ) : null}
                {aiDraftPreview.providerTrace?.recheck ? (
                  <p className="text-xs text-gray-500">
                    Recheck: {aiDraftPreview.providerTrace.recheck}
                  </p>
                ) : null}
                {aiDraftPreview.providerTrace?.attempts?.length > 1 ? (
                  <p className="text-xs text-gray-500">
                    Tried: {aiDraftPreview.providerTrace.attempts.join(" -> ")}
                  </p>
                ) : null}
                <p className="whitespace-pre-wrap">{aiDraftPreview.feedback}</p>
                {aiDeductionRows.length > 0 ? (
                  <button
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("osteps:open-ai-assistant", {
                        detail: {
                          context: {
                            page: "marking",
                            title,
                            subject: subjectName ?? undefined,
                            maxMarks: maxMarks ?? undefined,
                            fileUrl,
                            suggestedMark: aiDraftPreview.suggestedMark ?? undefined,
                            feedback: aiDraftPreview.feedback,
                            rationale: aiDraftPreview.rationale ?? undefined,
                            questionBreakdown: aiDraftPreview.questionBreakdown
                              ? JSON.stringify(aiDraftPreview.questionBreakdown).slice(0, 8000)
                              : undefined,
                          },
                        },
                      }))
                    }
                    className="mt-1 text-xs text-teal-700 underline cursor-pointer hover:text-teal-900"
                  >
                    💬 Ask AI about this marking →
                  </button>
                ) : null}
              </div>
            }
          />
        ) : null}
        {screenshotWarningVisible && shouldEnforceExamScreen ? (
          <Alert
            className="mb-4"
            type="error"
            showIcon
            closable
            onClose={() => setScreenshotWarningVisible(false)}
            message="Screenshots, printing, saving, and downloading are not allowed in exam mode."
            description="This attempt has been recorded for the teacher. Continue your exam in fullscreen mode."
          />
        ) : null}
        {role === "student" && examWindow.examMode && examWindow.state === "open" && (
          <div className={shouldEnforceExamScreen ? "sticky top-0 z-10 mb-4" : "mb-4"}>
            <Alert
              type="warning"
              showIcon
              message={
                <span className="inline-flex items-center gap-1 whitespace-nowrap tabular-nums">
                  <span>Exam timer running:</span>
                  <span className="inline-block min-w-[5.5rem] text-center font-medium">
                    {formatCountdown(examWindow.remainingMs)}
                  </span>
                  <span>remaining.</span>
                </span>
              }
              description="When the timer reaches zero, this workspace becomes read-only and your latest work is submitted automatically."
            />
          </div>
        )}
        {role === "teacher" && examExitEvents.length > 0 && !teacherExamAlertDismissed && (
          <Alert
            className="mb-4"
            type="warning"
            showIcon
            closable
            onClose={() => setTeacherExamAlertDismissed(true)}
            message={`Exam exit notes: ${teacherExamStudentInfo?.studentName ?? "Selected student"} (${teacherExamStudentInfo?.className ?? "Unknown class"})`}
            description={
              <div className="space-y-2">
                {examExitEvents.map((event) => (
                  <div key={`${event.createdAt}-${event.context}-${event.reason}`} className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                    <div className="font-medium">
                      {new Date(event.createdAt).toLocaleString()} · {formatExamExitContext(event.context)}
                    </div>
                    <div className="mt-1 whitespace-pre-wrap">{event.reason}</div>
                  </div>
                ))}
              </div>
            }
          />
        )}
        {shouldRequireExamFullscreen && !isExamFullscreen && !examExitModalOpen && !examStartModalOpen && (
          <Alert
            className="mb-4"
            type="error"
            showIcon
            message="Fullscreen is required for this exam."
            description={
              <div className="flex flex-wrap items-center gap-3">
                <span>Return to fullscreen to keep working on the exam.</span>
                <Button size="small" type="primary" onClick={() => void handleRemainInExam()}>
                  Enter fullscreen
                </Button>
              </div>
            }
          />
        )}
        {shouldEnforceExamScreen && touchFriendlyExamDevice && (
          <Alert
            className="mb-4"
            type="info"
            showIcon
            message="Tablet-friendly exam mode is active."
            description="You can type, select text, and use the on-screen keyboard without the fullscreen warning interrupting your answer. Leaving or refreshing the exam page is still protected."
          />
        )}
        {shouldEnforceExamScreen && !examFullscreenSupported && (
          <Alert
            className="mb-4"
            type="error"
            showIcon
            message="This browser cannot fully lock the device for the exam."
            description="Web pages cannot block the Home button, app switching, or system gestures. Use Chrome or Edge on desktop or Android, or a managed exam browser for stronger locking."
          />
        )}
        {role === "student" && examWindow.examMode && examWindow.state === "ended" && (
          <Alert className="mb-4" type="error" showIcon message="Exam time ended. This workspace is now read-only." />
        )}
        {role === "student" && studentLocked && (
          <Alert className="mb-4" type="success" showIcon message="This copy is finished and locked. Only the teacher can add marking annotations now." />
        )}
        {role === "student" && !studentLocked && state?.status === "submitted" && (
          <Alert className="mb-4" type="info" showIcon message="Your work is submitted, but it stays open for edits until the teacher marks it." />
        )}
        {role === "student" && !studentLocked && state?.status !== "draft" && state?.status !== "submitted" && (
          <Alert className="mb-4" type="info" showIcon message="Your teacher reopened this document. You can edit it again and submit again when you are done." />
        )}
        {role === "teacher" && !studentLocked && (
          <Alert className="mb-4" type="warning" showIcon message={state?.status === "draft" ? "The student can currently write and edit this document. You can still view their autosaved draft while they work." : state?.status === "submitted" ? "The student has submitted work, but it remains open for edits until you mark it." : "The student can currently write and edit this document. Lock it again when you want to stop further changes."} />
        )}
        {role === "teacher" && studentLocked && state?.status === "draft" && (
          <Alert className="mb-4" type="warning" showIcon message="The student has not pressed Finish yet, but editing is currently locked by the teacher." />
        )}
        {renderError && (
          <Alert
            className="mb-4"
            type="warning"
            showIcon
            message={renderErrorMessage}
            description={
              canOpenOriginalFile ? (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Open original PDF
                </a>
              ) : undefined
            }
          />
        )}

        {rendering && !renderError && (
          <div className="flex h-40 items-center justify-center rounded-lg border bg-white">
            <Spin />
            <span className="ml-3 text-sm text-gray-500">Rendering PDF...</span>
          </div>
        )}

        <div ref={pagesViewportRef} className="space-y-6 overflow-x-auto pb-10">
          {(pages.length > 0 ? pages : [{ pageNumber: 1, width: 900, height: 1200 }]).map((page) => (
            <div key={page.pageNumber} className="mx-auto w-fit rounded-lg bg-white p-3 shadow">
              <div className="mb-2 text-xs font-medium text-gray-500">Page {page.pageNumber}</div>
              <div style={{ width: page.width * zoomLevel, height: page.height * zoomLevel }}>
                <div
                  className="relative origin-top-left"
                  style={{
                    width: page.width,
                    height: page.height,
                    transform: `scale(${zoomLevel})`,
                  }}
                >
                  {(documentKind === "pdf" || documentKind === "image") && page.previewUrl && (
                    <img src={page.previewUrl} alt={`${title} page ${page.pageNumber}`} className="absolute inset-0 h-full w-full bg-white object-contain" />
                  )}
                  {documentKind === "docx" && (
                    <div
                      className="absolute inset-0 overflow-hidden bg-white px-12 py-10 text-gray-900"
                      style={{ fontSize: 16, lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: docxHtml }}
                    />
                  )}
                  <canvas ref={(element) => { annotationCanvasRefs.current[page.pageNumber] = element; }} className="pointer-events-none absolute inset-0" />
                  <div
                    data-page-number={page.pageNumber}
                    className="absolute inset-0"
                    style={{
                      touchAction:
                        editable && (tool === "pen" || tool === "highlighter" || tool === "eraser")
                          ? "none"
                          : "pan-x pan-y pinch-zoom",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      cursor: !editable
                        ? "not-allowed"
                        : tool === "eraser"
                        ? "cell"
                        : tool === "text"
                        ? "text"
                        : tool === "cursor"
                        ? "default"
                        : "crosshair",
                    }}
                    onClick={(event) => handlePageClick(event, page.pageNumber)}
                    onTouchStartCapture={handlePaperTouchStartCapture}
                    onTouchMoveCapture={handlePaperTouchMoveCapture}
                    onTouchEndCapture={handlePaperTouchEndCapture}
                    onTouchCancelCapture={handlePaperTouchEndCapture}
                    onPointerDown={(event) => handlePointerDown(event, page.pageNumber)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                  >
                    {editingText?.page === page.pageNumber && (() => {
                      const estimatedLineCount = Math.max(1, editingText.value.split(/\r?\n/).length);
                      const estimatedTextHeight = Math.max(
                        76,
                        estimatedLineCount * editingText.fontSize * 1.35 + 28
                      );
                      const toolbarWidth = Math.min(Math.max(540, page.width - 24), 960);
                      const toolbarLeft = Math.min(
                        Math.max(12, editingText.x),
                        Math.max(12, page.width - toolbarWidth - 12)
                      );
                      const toolbarTop =
                        editingText.y >= 104
                          ? Math.max(12, editingText.y - 92)
                          : editingText.y + estimatedTextHeight + 18;
                      const AlignmentIcon = activeTextAlignmentOption.Icon;

                      return (
                        <>
                          <div
                            className="absolute z-30 flex items-stretch overflow-visible rounded-[18px] border border-slate-300 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
                            style={{ left: toolbarLeft, top: toolbarTop, width: toolbarWidth }}
                            onClick={(event) => event.stopPropagation()}
                            onPointerDown={(event) => event.stopPropagation()}
                          >
                            <div className="relative flex border-r border-slate-200">
                              <button
                                type="button"
                                title="Text color"
                                aria-label="Open text color picker"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() =>
                                  setTextToolbarMenu((current) =>
                                    current === "color" ? null : "color"
                                  )
                                }
                                className={[
                                  "flex h-[74px] min-w-[168px] items-center justify-between px-5 transition",
                                  textToolbarMenu === "color"
                                    ? "bg-slate-100"
                                    : "bg-white hover:bg-slate-50",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "h-10 w-10 rounded-full border-2",
                                    color === "#ffffff" ? "border-slate-300" : "border-white/80",
                                  ].join(" ")}
                                  style={{ backgroundColor: color }}
                                />
                                <ChevronDown className="h-4 w-4 text-slate-700" />
                              </button>
                              {textToolbarMenu === "color" && (
                                <div className="absolute left-0 top-full mt-2 rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                                  <div className="grid grid-cols-8 gap-3">
                                    {TEXT_COLOR_DROPDOWN_SWATCHS.map(({ value, label }) => (
                                      <button
                                        key={`${editingText.page}-${label}`}
                                        type="button"
                                        title={label}
                                        aria-label={`Set text color to ${label.toLowerCase()}`}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => {
                                          setColor(value);
                                          setTextToolbarMenu(null);
                                        }}
                                        className={[
                                          "h-11 w-11 rounded-full border-2 transition",
                                          value === "#ffffff" ? "border-slate-300" : "border-white/70",
                                          color === value
                                            ? "ring-4 ring-[#8d72ff] ring-offset-2"
                                            : "hover:scale-105",
                                        ].join(" ")}
                                        style={{ backgroundColor: value }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              title="Bold"
                              aria-label="Toggle bold"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                const nextFontWeight =
                                  activeTextFontWeight === "bold" ? "normal" : "bold";
                                setTextFontWeight(nextFontWeight);
                                setTextToolbarMenu(null);
                                setEditingText((current) =>
                                  current ? { ...current, fontWeight: nextFontWeight } : current
                                );
                              }}
                              className={[
                                "flex h-[74px] min-w-[112px] items-center justify-center border-r border-slate-200 transition",
                                activeTextFontWeight === "bold"
                                  ? "bg-slate-100 text-black"
                                  : "bg-white text-slate-800 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              <Bold className="h-6 w-6" />
                            </button>

                            <button
                              type="button"
                              title="Underline"
                              aria-label="Toggle underline"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                const nextUnderline = !activeTextUnderline;
                                setTextUnderline(nextUnderline);
                                setTextToolbarMenu(null);
                                setEditingText((current) =>
                                  current ? { ...current, underline: nextUnderline } : current
                                );
                              }}
                              className={[
                                "flex h-[74px] min-w-[112px] items-center justify-center border-r border-slate-200 transition",
                                activeTextUnderline
                                  ? "bg-slate-100 text-black"
                                  : "bg-white text-slate-800 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              <Underline className="h-6 w-6" />
                            </button>

                            <div className="relative flex border-r border-slate-200">
                              <button
                                type="button"
                                title="Text alignment"
                                aria-label="Open text alignment options"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() =>
                                  setTextToolbarMenu((current) =>
                                    current === "align" ? null : "align"
                                  )
                                }
                                className={[
                                  "flex h-[74px] min-w-[168px] items-center justify-center gap-3 px-5 transition",
                                  textToolbarMenu === "align"
                                    ? "bg-slate-100"
                                    : "bg-white hover:bg-slate-50",
                                ].join(" ")}
                              >
                                <AlignmentIcon className="h-6 w-6 text-slate-800" />
                                <ChevronDown className="h-4 w-4 text-slate-700" />
                              </button>
                              {textToolbarMenu === "align" && (
                                <div className="absolute left-0 top-full mt-2 flex rounded-[18px] border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                                  {TEXT_ALIGNMENT_OPTIONS.map(({ value, label, Icon }) => (
                                    <button
                                      key={value}
                                      type="button"
                                      title={label}
                                      aria-label={label}
                                      onMouseDown={(event) => event.preventDefault()}
                                      onClick={() => {
                                        setTextAlignment(value);
                                        setTextToolbarMenu(null);
                                        setEditingText((current) =>
                                          current ? { ...current, textAlign: value } : current
                                        );
                                      }}
                                      className={[
                                        "flex h-24 w-24 items-center justify-center rounded-[14px] transition",
                                        value === activeTextAlignment
                                          ? "bg-black text-white"
                                          : "bg-white text-slate-800 hover:bg-slate-100",
                                      ].join(" ")}
                                    >
                                      <Icon className="h-8 w-8" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="relative flex border-r border-slate-200">
                              <button
                                type="button"
                                title="Text size"
                                aria-label="Open text size options"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() =>
                                  setTextToolbarMenu((current) =>
                                    current === "size" ? null : "size"
                                  )
                                }
                                className={[
                                  "flex h-[74px] min-w-[258px] items-center justify-between px-6 text-left transition",
                                  textToolbarMenu === "size"
                                    ? "bg-slate-100"
                                    : "bg-white hover:bg-slate-50",
                                ].join(" ")}
                              >
                                <span className="text-[18px] font-medium text-slate-900">
                                  {activeTextSizeOption?.label ?? `${activeTextFontSize}px`}
                                </span>
                                <ChevronDown className="h-4 w-4 text-slate-700" />
                              </button>
                              {textToolbarMenu === "size" && (
                                <div className="absolute left-0 top-full mt-2 w-[320px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                                  {TEXT_SIZE_DROPDOWN_OPTIONS.map(({ label, value }) => (
                                    <button
                                      key={label}
                                      type="button"
                                      title={`${label} text`}
                                      aria-label={`Use ${label.toLowerCase()} text size`}
                                      onMouseDown={(event) => event.preventDefault()}
                                      onClick={() => {
                                        setTextFontSize(value);
                                        setTextToolbarMenu(null);
                                        setEditingText((current) =>
                                          current ? { ...current, fontSize: value } : current
                                        );
                                      }}
                                      className={[
                                        "flex w-full items-center px-6 py-4 text-left text-[18px] transition",
                                        activeTextFontSize === value
                                          ? "bg-black text-white"
                                          : "bg-white text-slate-900 hover:bg-slate-100",
                                      ].join(" ")}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              title="Delete text"
                              aria-label="Delete text"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                setTextToolbarMenu(null);
                                deleteEditingText();
                              }}
                              className="flex h-[74px] min-w-[118px] items-center justify-center text-slate-900 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-7 w-7" />
                            </button>
                          </div>

                          <div
                            className="absolute z-20 rounded-[20px] border-[3px] border-[#6d5efc] bg-white/95 shadow-[0_18px_40px_rgba(109,94,252,0.18)]"
                            style={{ left: editingText.x, top: editingText.y, width: editingText.width }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setTextToolbarMenu(null);
                            }}
                            onPointerDown={(event) => event.stopPropagation()}
                          >
                            <Input.TextArea
                              autoFocus
                              value={editingText.value}
                              onChange={(event) => {
                                setTextToolbarMenu(null);
                                setEditingText({ ...editingText, value: event.target.value });
                              }}
                              onBlur={commitEditingText}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                  event.preventDefault();
                                  setEditingText(null);
                                }
                                if (event.key === "Enter" && !event.shiftKey) {
                                  event.preventDefault();
                                  commitEditingText();
                                }
                              }}
                              placeholder="Type here..."
                              autoSize={{ minRows: 1, maxRows: 10 }}
                              className="!w-full rounded-[16px] !border-0 !bg-transparent px-5 py-4"
                              style={{
                                color,
                                fontSize: editingText.fontSize,
                                fontWeight: editingText.fontWeight === "bold" ? 700 : 400,
                                textAlign: editingText.textAlign,
                                textDecorationLine: editingText.underline ? "underline" : "none",
                                resize: "none",
                              }}
                            />
                            <span
                              className="absolute left-[-9px] top-1/2 h-10 w-4 -translate-y-1/2 cursor-ew-resize rounded-full border-[3px] border-[#6d5efc] bg-white shadow"
                              title="Drag to make the text box wider"
                              onPointerDown={(event) => startResizeTextAnnotation(event, editingText, "left")}
                            />
                            <span
                              className="absolute right-[-9px] top-1/2 h-10 w-4 -translate-y-1/2 cursor-ew-resize rounded-full border-[3px] border-[#6d5efc] bg-white shadow"
                              title="Drag to make the text box wider"
                              onPointerDown={(event) => startResizeTextAnnotation(event, editingText, "right")}
                            />
                          </div>
                        </>
                      );
                    })()}
                    {canEditSelectedStroke &&
                      selectedPenAnnotation?.page === page.pageNumber &&
                      selectedPenOverlayBounds && (
                        <div
                          className="pointer-events-none absolute z-20"
                          style={{
                            left: selectedPenOverlayBounds.left,
                            top: selectedPenOverlayBounds.top,
                            width: selectedPenOverlayBounds.width,
                            height: selectedPenOverlayBounds.height,
                          }}
                        >
                          <div
                            className="pointer-events-auto absolute inset-0 cursor-move rounded-[24px] border-[3px] border-[#6d5efc] bg-[#6d5efc]/5 shadow-[0_18px_40px_rgba(109,94,252,0.16)]"
                            title="Hold and move handwriting"
                            onPointerDown={startDragSelectedPen}
                          />
                          <span
                            className="pointer-events-auto absolute left-[-9px] top-1/2 h-10 w-4 -translate-y-1/2 cursor-ew-resize rounded-full border-[3px] border-[#6d5efc] bg-white shadow"
                            title="Stretch handwriting"
                            onPointerDown={(event) => startResizeSelectedPen(event, "left")}
                          />
                          <span
                            className="pointer-events-auto absolute right-[-9px] top-1/2 h-10 w-4 -translate-y-1/2 cursor-ew-resize rounded-full border-[3px] border-[#6d5efc] bg-white shadow"
                            title="Stretch handwriting"
                            onPointerDown={(event) => startResizeSelectedPen(event, "right")}
                          />
                          <button
                            type="button"
                            className="pointer-events-auto absolute -top-12 right-0 flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow transition hover:bg-red-50"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              deleteSelectedPenAnnotation();
                            }}
                            onPointerDown={(event) => event.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    {(textAnnotationsByPage.get(page.pageNumber) || []).map((annotation) => {
                        const isEditableText = editable && activeAnnotations.some((item) => item.id === annotation.id);
                        const isBeingEdited = editingText?.id === annotation.id;
                        if (isBeingEdited) return null;
                        return (
                          <div
                            key={annotation.id}
                            className="group absolute whitespace-pre-wrap break-words rounded-2xl border border-transparent bg-white/70 px-4 py-3 leading-snug shadow-sm transition"
                            style={{
                              left: annotation.x,
                              top: annotation.y,
                              width: annotation.width ?? TEXT_ANNOTATION_DEFAULT_WIDTH,
                              color: annotation.color,
                              fontSize: annotation.fontSize,
                              fontWeight: annotation.fontWeight === "bold" ? 700 : 400,
                              textAlign: annotation.textAlign ?? "left",
                              textDecorationLine: annotation.underline ? "underline" : "none",
                              cursor: !isEditableText
                                ? "default"
                                : tool === "eraser"
                                ? "cell"
                                : tool === "cursor"
                                ? "move"
                                : tool === "text"
                                ? "text"
                                : "default",
                              touchAction: "none",
                              pointerEvents:
                                isEditableText && (tool === "cursor" || tool === "eraser" || tool === "text")
                                  ? "auto"
                                  : "none",
                            }}
                            onClick={(event) => event.stopPropagation()}
                            onDoubleClick={(event) => {
                              if (tool !== "cursor" && tool !== "text") return;
                              event.stopPropagation();
                              startEditTextAnnotation(annotation);
                            }}
                            onPointerDown={(event) => handleTextPointerDown(event, annotation)}
                            onPointerMove={handleTextPointerMove}
                            onPointerUp={handleTextPointerUp}
                            onPointerCancel={handleTextPointerUp}
                          >
                            {annotation.text}
                            {isEditableText && tool === "cursor" && (
                              <>
                                <span
                                  className="absolute left-[-9px] top-1/2 h-10 w-4 -translate-y-1/2 cursor-ew-resize rounded-full border-[3px] border-[#6d5efc] bg-white opacity-0 shadow transition group-hover:opacity-100"
                                  title="Drag to make the text box wider"
                                  onPointerDown={(event) => startResizeTextAnnotation(event, annotation, "left")}
                                />
                                <span
                                  className="absolute right-[-9px] top-1/2 h-10 w-4 -translate-y-1/2 cursor-ew-resize rounded-full border-[3px] border-[#6d5efc] bg-white opacity-0 shadow transition group-hover:opacity-100"
                                  title="Drag to make the text box wider"
                                  onPointerDown={(event) => startResizeTextAnnotation(event, annotation, "right")}
                                />
                              </>
                            )}
                            {isEditableText && tool === "cursor" && (
                              <button
                                type="button"
                                className="absolute -top-12 right-0 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 opacity-0 shadow transition group-hover:opacity-100"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  startEditTextAnnotation(annotation);
                                }}
                                onPointerDown={(event) => event.stopPropagation()}
                              >
                                <Type className="h-4 w-4" />
                                Edit text
                              </button>
                            )}
                            {isEditableText && tool === "eraser" && (
                              <button
                                type="button"
                                className="absolute -top-12 right-0 flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 opacity-0 shadow transition group-hover:opacity-100"
                                title="Drag to make the text box wider"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  deleteTextAnnotation(annotation);
                                }}
                                onPointerDown={(event) => event.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdfAssessmentAnnotator;
