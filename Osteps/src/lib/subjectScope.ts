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

export const resolveScopedSubjectId = (
  subjectId?: number | null
): number | null => {
  const explicitId = Number(subjectId ?? 0);
  if (Number.isFinite(explicitId) && explicitId > 0) {
    return explicitId;
  }
  return getStoredSubjectId();
};

export const withSubjectQuery = <T extends Record<string, unknown>>(
  params?: T,
  subjectId?: number | null
): T & { subject_id?: number } => {
  const resolvedSubjectId = resolveScopedSubjectId(subjectId);
  if (!resolvedSubjectId) {
    return { ...(params ?? ({} as T)) };
  }

  return {
    ...(params ?? ({} as T)),
    subject_id: resolvedSubjectId,
  };
};

export { SUBJECT_STORAGE_KEY };