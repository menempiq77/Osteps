"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Input, InputNumber, Modal, message, Select, Spin, Tag } from "antd";
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
import type { AiDraftMarkResponse } from "@/services/aiMarkingApi";
import { addStudentTaskMarks, uploadTaskByStudent } from "@/services/api";
import { fetchStudentProfileData } from "@/services/studentsApi";
import { resolveExamWindow } from "@/lib/taskTypeMetadata";

type Tool = "pen" | "text" | "eraser";
type DocumentKind = "pdf" | "docx" | "image";

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

const COLORS = ["#111827", "#dc2626", "#2563eb", "#16a34a", "#9333ea"];
const AUTOSAVE_DELAY_MS = 5000;
const LIVE_SYNC_INTERVAL_MS = 1200;
const REMOTE_SYNC_INTERVAL_MS = 1500;
const SELF_ASSESSMENT_AUTOSAVE_DELAY_MS = 1200;
const TEACHER_DRAFT_AUTOSAVE_DELAY_MS = 1200;
const AI_PAGE_IMAGE_MAX_COUNT = 3;
const AI_PAGE_IMAGE_MAX_WIDTH = 1400;
const AI_PAGE_IMAGE_JPEG_QUALITY = 0.9;
const ERASER_RADIUS = 28;
const TEXT_ERASER_PADDING = 18;
const TEXT_ANNOTATION_MAX_WIDTH = 360;
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

  return {
    suggestedMark: Number.isFinite(suggestedMark) ? suggestedMark : null,
    feedback: String(raw.feedback ?? "").trim(),
    rationale: String(raw.rationale ?? "").trim(),
    confidence,
    sourcePolicy: String(raw.sourcePolicy ?? "").trim(),
    warnings,
  };
};

const isAiDraftFailureText = (value: string) =>
  /(?:ai draft mark could not finish|local model reached the time limit|timed out|time limit|could not draft a safe mark|could not reliably read|cannot read|could not read|unreadable|mark manually|no cloud vision key|no reliable visual|not valid json)/i.test(
    value
  );

const isFailedAiDraft = (draft: AiDraftMarkResponse | null) => {
  if (!draft) return true;
  if (draft.suggestedMark == null) return true;

  const text = [draft.feedback, draft.rationale, ...(draft.warnings || [])]
    .join(" ")
    .toLowerCase();
  return isAiDraftFailureText(text);
};

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

const getSafePenPoints = (annotation: { points?: Array<{ x?: number; y?: number }> | null }) =>
  Array.isArray(annotation.points)
    ? annotation.points.filter(
        (point): point is { x: number; y: number } =>
          point != null && Number.isFinite(point.x) && Number.isFinite(point.y)
      )
    : [];

const drawPen = (context: CanvasRenderingContext2D, annotation: PenAnnotation) => {
  const points = getSafePenPoints(annotation);
  if (points.length < 2) return;
  context.save();
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

  const fontSize = annotation.fontSize || 16;
  const lineHeight = fontSize * 1.22;
  context.save();
  context.fillStyle = annotation.color || "#111827";
  context.font = `${fontSize}px Arial, sans-serif`;
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
      if (context.measureText(testLine).width > maxWidth && line) {
        context.fillText(line, annotation.x, y);
        line = word;
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      context.fillText(line, annotation.x, y);
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

const textTouchesEraser = (annotation: TextAnnotation, point: { x: number; y: number }) => {
  const text = String(annotation.text ?? "");
  const lineCount = Math.max(1, text.split("\n").length);
  const height = annotation.fontSize * 1.45 * lineCount;
  return (
    point.x >= annotation.x - TEXT_ERASER_PADDING &&
    point.x <= annotation.x + TEXT_ANNOTATION_MAX_WIDTH + TEXT_ERASER_PADDING &&
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
  const [textFontSize, setTextFontSize] = useState(role === "teacher" ? 18 : 16);
  const [saving, setSaving] = useState(false);
  const [autosaveQueued, setAutosaveQueued] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [changingStudentLock, setChangingStudentLock] = useState(false);
  const [exportingPaper, setExportingPaper] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);
  const [aiDraftPreview, setAiDraftPreview] = useState<AiDraftMarkResponse | null>(null);
  const [selfAssessmentMark, setSelfAssessmentMark] = useState<number | null>(initialSelfAssessmentMark);
  const [teacherMarks, setTeacherMarks] = useState(initialTeacherMarks);
  const [teacherFeedback, setTeacherFeedback] = useState(initialTeacherFeedback);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [zoomLevel, setZoomLevel] = useState(1);
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
  const examContainerRef = useRef<HTMLDivElement | null>(null);
  const activeStrokeRef = useRef<PenAnnotation | null>(null);
  const activeAnnotationsRef = useRef<AssessmentDocumentAnnotation[]>([]);
  const erasingRef = useRef(false);
  const draggingTextRef = useRef<DraggingText | null>(null);
  const annotationCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selfAssessmentSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const teacherDraftSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAutosaveRef = useRef<AssessmentDocumentAnnotation[] | null>(null);
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
  const clientSaveSeqRef = useRef(0);

  const localDraftKey = useMemo(
    () => getDocumentDraftKey(assessmentId, taskId, studentId, role),
    [assessmentId, role, studentId, taskId]
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
    !savedDocumentUrl && currentDocumentUrl && studentAnnotations.length > 0
  );
  const editable = role === "teacher" || (!studentLocked && !examEditingLocked && !documentIdentityUnverified);
  const oppositeLayer = role === "teacher" ? "student" : "teacher";
  const documentLoaded = Boolean(state);
  const safeReturnTo = sanitizeReturnToPath(returnTo);
  const zoomPercent = Math.round(zoomLevel * 100);
  const canOpenOriginalFile = !(role === "student" && examWindow.examMode);
  const displayStudentName = currentStudentName || teacherExamStudentInfo?.studentName || "Selected student";
  const canDownloadSubmittedPaper = role === "teacher" && documentLoaded && (studentLocked || state?.status === "submitted" || state?.status === "marked");
  const hasReadableStudentAnswer = studentAnnotations.some(
    (annotation) =>
      (annotation.type === "text" && String(annotation.text ?? "").trim().length > 0) ||
      (annotation.type === "pen" && getSafePenPoints(annotation).length > 0)
  );
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
      messageApi.warning("Screenshots/printing are not allowed during exam mode. This attempt has been recorded.");
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

      if (!printScreenAttempt && !printAttempt) return;

      event.preventDefault();
      event.stopPropagation();
      recordScreenshotAttempt(
        printAttempt
          ? "Print attempt detected during exam mode."
          : "Screenshot attempt detected during exam mode."
      );
    };

    const handleBeforePrint = () => {
      recordScreenshotAttempt("Print/screenshot attempt detected during exam mode.");
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("beforeprint", handleBeforePrint);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("beforeprint", handleBeforePrint);
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
    (nextAnnotations: AssessmentDocumentAnnotation[]) => {
      activeAnnotationsRef.current = nextAnnotations;
      persistLocalDraft(nextAnnotations);
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
      queueAutosave(nextAnnotations);
    },
    [persistLocalDraft, queueAutosave, role]
  );

  const setLayerAnnotationsLocally = useCallback(
    (nextAnnotations: AssessmentDocumentAnnotation[]) => {
      activeAnnotationsRef.current = nextAnnotations;
      persistLocalDraft(nextAnnotations);
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
    [persistLocalDraft, role]
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
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
            saveAnnotations(storedDraft.annotations, undefined, {
              syncState: false,
              silent: true,
              metadata: { restoredFromLocalDraft: true },
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
            setSelfAssessmentMark(savedSelfAssessmentMark);
            lastSavedSelfAssessmentRef.current = savedSelfAssessmentMark;
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
  }, [assessmentId, taskId, studentId, messageApi, getAnnotationsSignature, oppositeLayer, role, localDraftKey, saveAnnotations]);

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
      if (activeStroke?.page === page.pageNumber) drawPen(context, activeStroke);
    }
  }, [pages, studentAnnotations, teacherAnnotations, activeStroke]);

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

  const eraseAtPoint = useCallback(
    (pageNumber: number, point: { x: number; y: number }) => {
      const currentAnnotations = activeAnnotationsRef.current;
      const nextAnnotations = currentAnnotations.filter((annotation) => {
        if (annotation.page !== pageNumber) return true;
        if (annotation.type === "text") return !textTouchesEraser(annotation, point);
        return !penTouchesEraser(annotation, point);
      });

      if (nextAnnotations.length === currentAnnotations.length) return;
      setLayerAnnotationsLocally(nextAnnotations);
      queueAutosave(nextAnnotations);
    },
    [queueAutosave, setLayerAnnotationsLocally]
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, pageNumber: number) => {
    if (!editable || tool === "text") return;
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget;
    const point = getPointerPoint(event, target, zoomLevel);

    if (tool === "eraser") {
      target.setPointerCapture(event.pointerId);
      erasingRef.current = true;
      eraseAtPoint(pageNumber, point);
      return;
    }

    target.setPointerCapture(event.pointerId);
    const nextStroke: PenAnnotation = {
      id: makeId(),
      type: "pen",
      page: pageNumber,
      color,
      width: penWidth,
      points: [point],
    };
    activeStrokeRef.current = nextStroke;
    setActiveStroke(nextStroke);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
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
    if (erasingRef.current) {
      event.preventDefault();
      event.stopPropagation();
      erasingRef.current = false;
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
    if (!editable || tool !== "text") return;
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
              }
            : annotation
        )
      );
      setTextFontSize(editingText.fontSize);
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
    };
    setLayerAnnotations([...activeAnnotations, annotation]);
    setTextFontSize(editingText.fontSize);
    setEditingText(null);
  };

  const startEditTextAnnotation = (annotation: TextAnnotation) => {
    if (!editable || !activeAnnotations.some((item) => item.id === annotation.id)) return;
    setTextFontSize(annotation.fontSize);
    setEditingText({
      id: annotation.id,
      page: annotation.page,
      x: annotation.x,
      y: annotation.y,
      value: annotation.text,
      fontSize: annotation.fontSize,
    });
  };

  const deleteTextAnnotation = (annotation: TextAnnotation) => {
    if (!editable || !activeAnnotations.some((item) => item.id === annotation.id)) return;
    if (editingText?.id === annotation.id) setEditingText(null);
    setLayerAnnotations(activeAnnotations.filter((item) => item.id !== annotation.id));
  };

  const handleTextPointerDown = (event: React.PointerEvent<HTMLDivElement>, annotation: TextAnnotation) => {
    if (!editable || !activeAnnotations.some((item) => item.id === annotation.id)) return;
    event.preventDefault();
    event.stopPropagation();
    if (tool === "eraser") {
      deleteTextAnnotation(annotation);
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
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
    const draggingText = draggingTextRef.current;
    if (!draggingText) return;
    event.preventDefault();
    event.stopPropagation();
    draggingTextRef.current = null;
    setLayerAnnotations(
      activeAnnotations.map((annotation) =>
        annotation.id === draggingText.id && annotation.type === "text"
          ? { ...annotation, x: draggingText.x, y: draggingText.y }
          : annotation
      )
    );
  };

  const undo = () => {
    if (!editable || activeAnnotations.length === 0) return;
    setLayerAnnotations(activeAnnotations.slice(0, -1));
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
    if (rendering || pages.length === 0) {
      messageApi.info("Wait for the paper to finish rendering before using AI Draft Mark.");
      return;
    }

    setAiDrafting(true);
    setAiDraftPreview(null);
    try {
      const pageImages = await buildAiPageSnapshots();
      const draft = await draftAssessmentMark({
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
        messageApi.warning("AI could not draft a safe mark. Your current mark and feedback were not changed.");
        return;
      }

      const nextTeacherMarks = String(normalizedDraft.suggestedMark);
      const nextTeacherFeedback = normalizedDraft.feedback.trim();

      setTeacherMarks(nextTeacherMarks);
      setTeacherFeedback(nextTeacherFeedback);
      setAiDraftPreview(normalizedDraft);
      persistLocalDraft(getCurrentLayerSnapshot(), {
        ...(state?.metadata && typeof state.metadata === "object" ? state.metadata : {}),
        teacherMarks: nextTeacherMarks,
        teacherFeedback: nextTeacherFeedback,
        aiDraftPreview: normalizedDraft,
      });
      messageApi.success("AI draft added. Review it before saving the markbook mark.");
    } catch (error) {
      console.error(error);
      messageApi.error(error instanceof Error ? error.message : "Could not create an AI draft mark.");
    } finally {
      setAiDrafting(false);
    }
  };

  const requestAiDraftMark = () => {
    const hasOnlyPreviousFailedAiFeedback = !teacherMarks.trim() && isAiDraftFailureText(teacherFeedback);
    if (!hasOnlyPreviousFailedAiFeedback && (teacherMarks.trim() || teacherFeedback.trim())) {
      Modal.confirm({
        title: "Replace current draft mark?",
        content: "AI Draft Mark will replace the unsaved mark and feedback fields on this screen only. It will not save the markbook mark.",
        okText: "Create AI draft",
        cancelText: "Cancel",
        onOk: () => applyAiDraftMark(),
      });
      return;
    }

    void applyAiDraftMark();
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
    if (rendering || pages.length === 0) return [] as string[];

    const answeredPageNumbers = Array.from(
      new Set(
        studentAnnotations
          .map((annotation) => Number(annotation.page || 0))
          .filter((pageNumber) => Number.isFinite(pageNumber) && pageNumber > 0)
      )
    ).sort((left, right) => left - right);

    const candidatePages =
      answeredPageNumbers.length > 0
        ? pages.filter((page) => answeredPageNumbers.includes(page.pageNumber))
        : pages.slice(0, 2);

    const snapshots: string[] = [];
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
    }

    return snapshots;
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
      <div className="sticky top-0 z-20 border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
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
            <div className="flex flex-wrap items-center gap-2">
              <Select<Tool> value={tool} onChange={setTool} disabled={!editable} style={{ width: 110 }} options={[{ value: "pen", label: "Pen" }, { value: "text", label: "Text" }, { value: "eraser", label: "Eraser" }]} />
              <Select value={color} onChange={setColor} disabled={!editable} style={{ width: 120 }} options={COLORS.map((value) => ({ value, label: <span style={{ color: value }}>● {value}</span> }))} />
              <InputNumber min={1} max={12} value={penWidth} onChange={(value) => setPenWidth(Number(value || 3))} disabled={!editable || tool !== "pen"} className="w-20" />
              <InputNumber min={MIN_TEXT_FONT_SIZE} max={MAX_TEXT_FONT_SIZE} value={textFontSize} onChange={(value) => {
                const nextFontSize = Number(value || (role === "teacher" ? 18 : 16));
                setTextFontSize(nextFontSize);
                setEditingText((current) => (current ? { ...current, fontSize: nextFontSize } : current));
              }} disabled={!editable || tool !== "text"} className="w-24" placeholder="Text size" />
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
              <Button onClick={undo} disabled={!editable || activeAnnotations.length === 0}>Undo</Button>
              <Button onClick={saveNow} disabled={!editable} loading={saving}>Save now</Button>
            </div>

            {role === "student" ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-2">
                <InputNumber min={0} max={maxMarks} value={selfAssessmentMark ?? undefined} onChange={(value) => setSelfAssessmentMark(value == null ? null : Number(value))} placeholder={examWindow.examMode ? "Predicted mark" : "Self mark"} disabled={!editable} className="w-32" />
                <Button type="primary" onClick={finishStudentWork} loading={finishing} disabled={!editable}>{examWindow.examMode ? "Submit exam" : "Submit work"}</Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-2">
                <Button
                  onClick={toggleStudentEditingLock}
                  loading={changingStudentLock}
                  type={studentLocked ? "default" : "primary"}
                  danger={!studentLocked}
                >
                  {studentLocked ? "Open for student edits" : "Lock student editing"}
                </Button>
                <Input className="w-24" placeholder="Marks" value={teacherMarks} onChange={(event) => setTeacherMarks(event.target.value)} />
                <Button
                  onClick={requestAiDraftMark}
                  loading={aiDrafting}
                  disabled={!hasReadableStudentAnswer}
                  title="Draft marks and feedback with the local Ollama AI marker. Teacher review is still required."
                >
                  AI Draft Mark
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

      <div className={shouldEnforceExamScreen ? "h-[calc(100vh-85px)] overflow-auto p-4" : "mx-auto max-w-7xl p-4"}>
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
            message="AI Draft Mark is available on this marking screen"
            description={
              hasReadableStudentAnswer
                ? "Use it to draft a suggested mark plus WWW and EBI feedback from the exam paper, the student's typed text, and the student's writing on the page. It only prepares the draft; it does not save the markbook mark."
                : "AI Draft Mark needs student writing or typed answers on the paper before it can create a draft."
            }
            action={
              <Button
                size="small"
                type="primary"
                onClick={requestAiDraftMark}
                loading={aiDrafting}
                disabled={!hasReadableStudentAnswer}
              >
                AI Draft Mark
              </Button>
            }
          />
        ) : null}
        {role === "teacher" && aiDraftPreview ? (
          <Alert
            className="mb-4"
            type={isFailedAiDraft(aiDraftPreview) ? "warning" : "success"}
            showIcon
            closable
            onClose={() => setAiDraftPreview(null)}
            message={
              isFailedAiDraft(aiDraftPreview)
                ? "AI could not draft a safe mark"
                : aiDraftPreview.suggestedMark != null
                ? `AI draft ready: suggested mark ${aiDraftPreview.suggestedMark}${maxMarks ? ` / ${maxMarks}` : ""}`
                : "AI draft ready"
            }
            description={
              <div className="space-y-2 text-sm text-gray-700">
                <p className="whitespace-pre-wrap">{aiDraftPreview.feedback}</p>
                {aiDraftPreview.rationale ? (
                  <p className="whitespace-pre-wrap text-gray-600">
                    AI rationale for teacher review: {aiDraftPreview.rationale}
                  </p>
                ) : null}
                {aiDraftPreview.warnings.length > 0 ? (
                  <p className="whitespace-pre-wrap text-amber-700">
                    Warnings: {aiDraftPreview.warnings.join("; ")}
                  </p>
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
            message="Screenshots and printing are not allowed in exam mode."
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

        <div className="space-y-6 overflow-x-auto pb-10">
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
                      touchAction: "none",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      cursor: !editable ? "not-allowed" : tool === "eraser" ? "cell" : tool === "text" ? "text" : "crosshair",
                    }}
                    onClick={(event) => handlePageClick(event, page.pageNumber)}
                    onPointerDown={(event) => handlePointerDown(event, page.pageNumber)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                  >
                    {editingText?.page === page.pageNumber && (
                      <Input.TextArea
                        autoFocus
                        value={editingText.value}
                        onChange={(event) => setEditingText({ ...editingText, value: event.target.value })}
                        onBlur={commitEditingText}
                        onClick={(event) => event.stopPropagation()}
                        onPointerDown={(event) => event.stopPropagation()}
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
                        placeholder="Type here"
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        className="absolute z-20 w-72 rounded border-blue-500 bg-white/95 shadow-lg"
                        style={{ left: editingText.x, top: editingText.y, color, fontSize: editingText.fontSize }}
                      />
                    )}
                    {(textAnnotationsByPage.get(page.pageNumber) || []).map((annotation) => {
                        const isEditableText = editable && activeAnnotations.some((item) => item.id === annotation.id);
                        const isBeingEdited = editingText?.id === annotation.id;
                        if (isBeingEdited) return null;
                        return (
                          <div
                            key={annotation.id}
                            className="group absolute max-w-[360px] whitespace-pre-wrap rounded bg-white/70 px-1 leading-snug shadow-sm"
                            style={{
                              left: annotation.x,
                              top: annotation.y,
                              color: annotation.color,
                              fontSize: annotation.fontSize,
                              cursor: isEditableText ? (tool === "eraser" ? "not-allowed" : "move") : "default",
                              touchAction: "none",
                            }}
                            onClick={(event) => event.stopPropagation()}
                            onDoubleClick={(event) => {
                              event.stopPropagation();
                              startEditTextAnnotation(annotation);
                            }}
                            onPointerDown={(event) => handleTextPointerDown(event, annotation)}
                            onPointerMove={handleTextPointerMove}
                            onPointerUp={handleTextPointerUp}
                            onPointerCancel={handleTextPointerUp}
                          >
                            {isEditableText && (
                              <span className="absolute -top-7 left-0 z-30 flex gap-1 rounded bg-white/95 p-1 text-[11px] shadow">
                                <button
                                  type="button"
                                  className="rounded bg-blue-600 px-2 py-0.5 text-white"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    startEditTextAnnotation(annotation);
                                  }}
                                  onPointerDown={(event) => event.stopPropagation()}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="rounded bg-red-600 px-2 py-0.5 text-white"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    deleteTextAnnotation(annotation);
                                  }}
                                  onPointerDown={(event) => event.stopPropagation()}
                                >
                                  Delete
                                </button>
                              </span>
                            )}
                            {annotation.text}
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
