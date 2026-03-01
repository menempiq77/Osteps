import api from "@/services/api";
import { fetchSubjects } from "@/services/subjectsApi";
import type { SubjectBrief, SubjectContextResponse } from "@/types/subjectContext";

const normalizeSubjects = (raw: any): SubjectBrief[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      id: Number(item?.id),
      name: String(item?.name ?? ""),
      code: item?.code ?? null,
    }))
    .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.name.trim().length > 0);
};

const extractContext = (payload: any): SubjectContextResponse => {
  const root = payload?.data ?? payload ?? {};
  const assigned = normalizeSubjects(root?.assigned_subjects ?? root?.subjects ?? []);
  const defaultId = Number(root?.default_subject_id ?? root?.last_subject_id ?? 0);

  return {
    assigned_subjects: assigned,
    default_subject_id: Number.isFinite(defaultId) && defaultId > 0 ? defaultId : null,
    subject_roles: Array.isArray(root?.subject_roles) ? root.subject_roles : [],
  };
};

export const fetchMySubjectContext = async (): Promise<SubjectContextResponse> => {
  try {
    const res = await api.get("/subjects/my-context");
    const normalized = extractContext(res.data);
    if (normalized.assigned_subjects.length > 0) return normalized;
  } catch {
    // fallback below
  }

  // Fallback for older backend: school-wide subjects list.
  const subjects = normalizeSubjects(await fetchSubjects());
  return {
    assigned_subjects: subjects,
    default_subject_id: subjects[0]?.id ?? null,
    subject_roles: [],
  };
};

export const setLastSubject = async (subjectId: number): Promise<void> => {
  try {
    await api.post("/subjects/set-last", { subject_id: subjectId });
  } catch {
    // non-blocking for legacy backend
  }
};
