// Persists assessment-task / quiz percentage weights on the client.
//
// The Laravel backend does not reliably store a percentage weight for quiz
// assignments (the assign-task-quiz endpoint ignores it), so weights set in the
// Assessment Tasks drawer would be lost on reload and never reach the markbook.
// This module keeps a small localStorage-backed map so the drawer and the
// markbook resolve the same weight for a task, regardless of backend support.

const STORE_KEY = "osteps-assessment-task-weights";

type WeightStore = Record<string, number>;

export type WeightTarget = {
  assessmentId?: number | string | null;
  taskId?: number | string | null;
  quizId?: number | string | null;
};

function readStore(): WeightStore {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? (parsed as WeightStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: WeightStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* ignore storage write failures */
  }
}

const isPositiveId = (value: unknown): boolean =>
  value != null && Number.isFinite(Number(value)) && Number(value) > 0;

// Lookup keys ordered from most specific (assessment-scoped) to least specific.
// Task keys take priority over quiz keys so an explicitly edited task wins.
function keysFor(target: WeightTarget): string[] {
  const keys: string[] = [];
  const aid = target.assessmentId;
  const hasAssessment = isPositiveId(aid);

  if (isPositiveId(target.taskId)) {
    if (hasAssessment) keys.push(`a${aid}-task-${target.taskId}`);
    keys.push(`task-${target.taskId}`);
  }
  if (isPositiveId(target.quizId)) {
    if (hasAssessment) keys.push(`a${aid}-quiz-${target.quizId}`);
    keys.push(`quiz-${target.quizId}`);
  }
  return keys;
}

export function setStoredWeight(target: WeightTarget, weight: number) {
  const keys = keysFor(target);
  if (keys.length === 0) return;
  const value = Number.isFinite(weight) ? weight : 0;
  const store = readStore();
  keys.forEach((key) => {
    store[key] = value;
  });
  writeStore(store);
}

export function getStoredWeight(target: WeightTarget): number | null {
  const store = readStore();
  for (const key of keysFor(target)) {
    const value = store[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

// Resolves the effective weight for a task: a locally-saved weight (the user's
// most recent intent on this device) takes precedence, otherwise the backend
// value is used.
export function resolveWeight(
  backendWeight: unknown,
  target: WeightTarget
): number {
  const stored = getStoredWeight(target);
  if (stored != null) return stored;
  const parsed = Number(backendWeight);
  return Number.isFinite(parsed) ? parsed : 0;
}
