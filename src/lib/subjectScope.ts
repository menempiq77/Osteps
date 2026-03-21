const SUBJECT_STORAGE_KEY = "osteps-active-subject-id";
const SUBJECT_NAME_STORAGE_KEY = "osteps-active-subject-name";
const SUBJECT_CONTEXT_FLAG =
  process.env.NEXT_PUBLIC_SUBJECT_CONTEXT_ENABLED !== "false";

export const isSubjectContextEnabled = (): boolean => SUBJECT_CONTEXT_FLAG;

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

export const getStoredSubjectName = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SUBJECT_NAME_STORAGE_KEY);
    return raw ? raw.trim() : null;
  } catch {
    return null;
  }
};

export const shouldUseLegacyUnscopedSubjectData = (subjectId?: number | null): boolean => {
  if (!isSubjectContextEnabled()) return true;
  return false;
};

export const resolveScopedSubjectId = (subjectId?: number | null): number | null => {
  if (!isSubjectContextEnabled()) return null;
  const resolved = subjectId ?? getStoredSubjectId();
  if (!resolved) return null;
  if (shouldUseLegacyUnscopedSubjectData(resolved)) return null;
  return resolved;
};

export const storeSubjectId = (subjectId: number, subjectName?: string | null): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SUBJECT_STORAGE_KEY, String(subjectId));
    let normalizedSubjectName = "";
    if (typeof subjectName === "string") {
      normalizedSubjectName = subjectName.trim();
      window.localStorage.setItem(SUBJECT_NAME_STORAGE_KEY, normalizedSubjectName);
    }
    document.cookie = `osteps_subject_id=${subjectId}; path=/; max-age=${60 * 60 * 24 * 365}`;
    if (normalizedSubjectName) {
      document.cookie = `osteps_subject_name=${encodeURIComponent(normalizedSubjectName)}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
  } catch {
    // ignore
  }
};

export const withSubjectQuery = <T extends Record<string, unknown>>(params?: T, subjectId?: number | null): T & { subject_id?: number } => {
  const resolved = resolveScopedSubjectId(subjectId);
  if (!resolved) {
    return { ...(params ?? ({} as T)) };
  }
  return {
    ...(params ?? ({} as T)),
    subject_id: resolved,
  };
};

export const withSubjectPayload = <T extends Record<string, unknown>>(payload: T, subjectId?: number | null): T & { subject_id?: number } => {
  const resolved = resolveScopedSubjectId(subjectId);
  if (!resolved) return payload;
  return {
    ...payload,
    subject_id: resolved,
  };
};

export { SUBJECT_STORAGE_KEY, SUBJECT_NAME_STORAGE_KEY };
