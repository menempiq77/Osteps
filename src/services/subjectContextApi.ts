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
      class_label: item?.class_label ?? null,
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

export const fetchMySubjectContext = async (options?: {
  role?: string;
  knownSubjects?: Array<{ id: number; name: string; code?: string | null }>;
  studentId?: number | null;
  studentClassId?: number | null;
}): Promise<SubjectContextResponse> => {
  const roleKey = String(options?.role || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  const isSchoolAdmin = roleKey === "SCHOOL_ADMIN";
  const isStudent = roleKey === "STUDENT";

  try {
    const res = await api.get("/subjects/my-context");
    const normalized = extractContext(res.data);
    if (normalized.assigned_subjects.length > 0) return normalized;
  } catch {
    // fallback below
  }

  // For students: fetch their enrolled subjects from class student list.
  if (isStudent) {
    const sid = Number(options?.studentId ?? 0);
    const classId = Number(options?.studentClassId ?? 0);
    if (Number.isFinite(classId) && classId > 0 && Number.isFinite(sid) && sid > 0) {
      try {
        const res = await api.get(`/get-student/${classId}`);
        const students: any[] = res.data?.data ?? res.data ?? [];
        const me = Array.isArray(students)
          ? students.find((s: any) => Number(s?.id) === sid)
          : null;
        if (me?.subjects) {
          const enrolled = normalizeSubjects(me.subjects);
          if (enrolled.length > 0) {
            return {
              assigned_subjects: enrolled,
              default_subject_id: enrolled[0]?.id ?? null,
              subject_roles: [],
            };
          }
        }
      } catch {
        // continue to other fallbacks
      }
    }

    // Use knownSubjects from login response if available.
    const known = normalizeSubjects(options?.knownSubjects ?? []);
    if (known.length > 0) {
      return {
        assigned_subjects: known,
        default_subject_id: known[0]?.id ?? null,
        subject_roles: [],
      };
    }

    // Last resort: fetch all school subjects so student isn't stuck.
    try {
      const subjects = normalizeSubjects(await fetchSubjects());
      return {
        assigned_subjects: subjects,
        default_subject_id: subjects[0]?.id ?? null,
        subject_roles: [],
      };
    } catch {
      return { assigned_subjects: [], default_subject_id: null, subject_roles: [] };
    }
  }

  // Strict privacy fallback: only School Admin can fallback to school-wide subjects.
  if (!isSchoolAdmin) {
    return {
      assigned_subjects: [],
      default_subject_id: null,
      subject_roles: [],
    };
  }

  // Legacy fallback for School Admin only.
  try {
    const subjects = normalizeSubjects(await fetchSubjects());
    return {
      assigned_subjects: subjects,
      default_subject_id: subjects[0]?.id ?? null,
      subject_roles: [],
    };
  } catch {
    // If backend is unreachable/misconfigured, keep a safe empty response.
    return {
      assigned_subjects: [],
      default_subject_id: null,
      subject_roles: [],
    };
  }
};

export const setLastSubject = async (subjectId: number): Promise<void> => {
  try {
    await api.post("/subjects/set-last", { subject_id: subjectId });
  } catch {
    // non-blocking for legacy backend
  }
};
