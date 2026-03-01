const SUBJECT_STORAGE_KEY = "osteps-active-subject-id";

export const getStoredSubjectId = (): number | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SUBJECT_STORAGE_KEY);
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
};

export const storeSubjectId = (subjectId: number): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, String(subjectId));
    document.cookie = `osteps_subject_id=${subjectId}; path=/; max-age=${60 * 60 * 24 * 365}`;
  } catch {
    // ignore
  }
};

export const withSubjectQuery = <T extends Record<string, unknown>>(params?: T, subjectId?: number | null): T & { subject_id?: number } => {
  const resolved = subjectId ?? getStoredSubjectId();
  if (!resolved) {
    return { ...(params ?? ({} as T)) };
  }
  return {
    ...(params ?? ({} as T)),
    subject_id: resolved,
  };
};

export const withSubjectPayload = <T extends Record<string, unknown>>(payload: T, subjectId?: number | null): T & { subject_id?: number } => {
  const resolved = subjectId ?? getStoredSubjectId();
  if (!resolved) return payload;
  return {
    ...payload,
    subject_id: resolved,
  };
};

export { SUBJECT_STORAGE_KEY };
