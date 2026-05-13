export type ExamWindowState = "disabled" | "scheduled" | "open" | "ended" | "invalid";

export type ExamWindow = {
  examMode: boolean;
  state: ExamWindowState;
  startAt: string | null;
  endAt: string | null;
  startAtMs: number | null;
  endAtMs: number | null;
  remainingMs: number | null;
  untilOpenMs: number | null;
};

type ExamWindowSource = {
  exam_mode?: boolean | number | string | null;
  exam_start_at?: string | null;
  exam_duration_minutes?: number | string | null;
  exam_end_at?: string | null;
};

const asBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value !== "string") return false;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
};

const asFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const numericValue = Number(trimmed);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const buildExamEndAt = (
  examStartAt: string | null,
  examDurationMinutes: number | null
): string | null => {
  if (!examStartAt || examDurationMinutes == null || examDurationMinutes <= 0) {
    return null;
  }

  const startAtMs = new Date(examStartAt).getTime();
  if (!Number.isFinite(startAtMs)) return null;

  return new Date(startAtMs + examDurationMinutes * 60 * 1000).toISOString();
};

export const resolveExamWindow = (
  value: ExamWindowSource | null | undefined,
  nowMs = Date.now()
): ExamWindow => {
  if (!asBoolean(value?.exam_mode)) {
    return {
      examMode: false,
      state: "disabled",
      startAt: null,
      endAt: null,
      startAtMs: null,
      endAtMs: null,
      remainingMs: null,
      untilOpenMs: null,
    };
  }

  const startAt = value?.exam_start_at || null;
  const endAt =
    value?.exam_end_at ||
    buildExamEndAt(startAt, asFiniteNumber(value?.exam_duration_minutes));
  const startAtMs = startAt ? new Date(startAt).getTime() : Number.NaN;
  const endAtMs = endAt ? new Date(endAt).getTime() : Number.NaN;

  if (!Number.isFinite(startAtMs) || !Number.isFinite(endAtMs) || endAtMs <= startAtMs) {
    return {
      examMode: true,
      state: "invalid",
      startAt,
      endAt,
      startAtMs: Number.isFinite(startAtMs) ? startAtMs : null,
      endAtMs: Number.isFinite(endAtMs) ? endAtMs : null,
      remainingMs: null,
      untilOpenMs: null,
    };
  }

  if (nowMs < startAtMs) {
    return {
      examMode: true,
      state: "scheduled",
      startAt,
      endAt,
      startAtMs,
      endAtMs,
      remainingMs: null,
      untilOpenMs: startAtMs - nowMs,
    };
  }

  if (nowMs >= endAtMs) {
    return {
      examMode: true,
      state: "ended",
      startAt,
      endAt,
      startAtMs,
      endAtMs,
      remainingMs: 0,
      untilOpenMs: null,
    };
  }

  return {
    examMode: true,
    state: "open",
    startAt,
    endAt,
    startAtMs,
    endAtMs,
    remainingMs: endAtMs - nowMs,
    untilOpenMs: 0,
  };
};