export type StructuredTaskType = {
  kind?: string | null;
  examMode?: boolean | number | string | null;
  exam_mode?: boolean | number | string | null;
  examStartAt?: string | null;
  exam_start_at?: string | null;
  examDurationMinutes?: number | string | null;
  exam_duration_minutes?: number | string | null;
  examEndAt?: string | null;
  exam_end_at?: string | null;
};

export type NormalizedTaskTypeFields = {
  task_type: string;
  task_type_config: StructuredTaskType | null;
  exam_mode: boolean;
  exam_start_at: string | null;
  exam_duration_minutes: number | null;
  exam_end_at: string | null;
};

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const asTrimmedString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const asFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const numericValue = Number(trimmed);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const asBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value !== "string") return false;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
};

const parseMaybeJson = (value: string): unknown => {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const looksJson =
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'));

  if (!looksJson) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
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

export const normalizeTaskTypeValue = (value: unknown): NormalizedTaskTypeFields => {
  if (typeof value === "string") {
    const parsedValue = parseMaybeJson(value);
    if (parsedValue !== value) {
      return normalizeTaskTypeValue(parsedValue);
    }

    const kind = (asTrimmedString(value) || "").toLowerCase();
    return {
      task_type: kind === "null" ? "" : kind,
      task_type_config: null,
      exam_mode: false,
      exam_start_at: null,
      exam_duration_minutes: null,
      exam_end_at: null,
    };
  }

  if (!isRecord(value)) {
    return {
      task_type: "",
      task_type_config: null,
      exam_mode: false,
      exam_start_at: null,
      exam_duration_minutes: null,
      exam_end_at: null,
    };
  }

  const taskType = (asTrimmedString(value.kind ?? value.type ?? value.value) || "").toLowerCase();
  const examMode = asBoolean(value.examMode ?? value.exam_mode);
  const examStartAt = asTrimmedString(value.examStartAt ?? value.exam_start_at);
  const examDurationMinutes = asFiniteNumber(
    value.examDurationMinutes ?? value.exam_duration_minutes
  );
  const examEndAt =
    asTrimmedString(value.examEndAt ?? value.exam_end_at) ||
    buildExamEndAt(examStartAt, examDurationMinutes);

  return {
    task_type: taskType,
    task_type_config: {
      kind: taskType || null,
      ...(examMode ? { exam_mode: true } : {}),
      ...(examStartAt ? { exam_start_at: examStartAt } : {}),
      ...(examDurationMinutes != null
        ? { exam_duration_minutes: examDurationMinutes }
        : {}),
      ...(examEndAt ? { exam_end_at: examEndAt } : {}),
    },
    exam_mode: examMode,
    exam_start_at: examStartAt,
    exam_duration_minutes: examDurationMinutes,
    exam_end_at: examEndAt,
  };
};

export const buildTaskTypeValue = ({
  taskType,
  examMode,
  examStartAt,
  examDurationMinutes,
}: {
  taskType: string | null;
  examMode?: boolean;
  examStartAt?: string | null;
  examDurationMinutes?: number | null;
}): string | StructuredTaskType | null => {
  const normalizedTaskType = (taskType || "").trim().toLowerCase();
  if (!normalizedTaskType) return null;
  if (!examMode) return normalizedTaskType;

  const normalizedExamStartAt = asTrimmedString(examStartAt);
  const normalizedDurationMinutes = asFiniteNumber(examDurationMinutes);
  const examEndAt = buildExamEndAt(
    normalizedExamStartAt,
    normalizedDurationMinutes
  );

  return {
    kind: normalizedTaskType,
    exam_mode: true,
    ...(normalizedExamStartAt ? { exam_start_at: normalizedExamStartAt } : {}),
    ...(normalizedDurationMinutes != null
      ? { exam_duration_minutes: normalizedDurationMinutes }
      : {}),
    ...(examEndAt ? { exam_end_at: examEndAt } : {}),
  };
};

export const normalizeTaskRecord = <T extends Record<string, unknown>>(
  task: T
): T & NormalizedTaskTypeFields => {
  const rawTaskType = task.task_type_config ?? task.task_type;
  const normalizedTaskType = normalizeTaskTypeValue(rawTaskType);

  const examMode =
    asBoolean(task.exam_mode) || normalizedTaskType.exam_mode;
  const examStartAt =
    asTrimmedString(task.exam_start_at) || normalizedTaskType.exam_start_at;
  const examDurationMinutes =
    asFiniteNumber(task.exam_duration_minutes) ??
    normalizedTaskType.exam_duration_minutes;
  const examEndAt =
    asTrimmedString(task.exam_end_at) ||
    normalizedTaskType.exam_end_at ||
    buildExamEndAt(examStartAt, examDurationMinutes);

  return {
    ...task,
    task_type: normalizedTaskType.task_type,
    task_type_config: normalizedTaskType.task_type_config,
    exam_mode: examMode,
    exam_start_at: examStartAt,
    exam_duration_minutes: examDurationMinutes,
    exam_end_at: examEndAt,
  };
};

export const resolveExamWindow = (
  value: Partial<NormalizedTaskTypeFields> | null | undefined,
  nowMs = Date.now()
): ExamWindow => {
  if (!value?.exam_mode) {
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

  const startAt = value.exam_start_at || null;
  const endAt =
    value.exam_end_at || buildExamEndAt(startAt, value.exam_duration_minutes ?? null);
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
    untilOpenMs: null,
  };
};