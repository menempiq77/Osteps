import api from "@/services/api";
import { fetchSubjects } from "@/services/subjectsApi";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { fetchAssignYears } from "@/services/yearsApi";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
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

const normalizeSubjectName = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/islamiat/g, "islamic")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const resolveSubjectsFromNames = (names: string[], subjectPool: SubjectBrief[]): SubjectBrief[] => {
  if (names.length === 0 || subjectPool.length === 0) return [];

  const poolByNormalized = new Map<string, SubjectBrief>();
  subjectPool.forEach((subject) => {
    const normalizedName = normalizeSubjectName(subject.name);
    if (normalizedName && !poolByNormalized.has(normalizedName)) {
      poolByNormalized.set(normalizedName, subject);
    }
  });

  return Array.from(
    new Map(
      names
        .map((name) => poolByNormalized.get(normalizeSubjectName(name)))
        .filter((subject): subject is SubjectBrief => Boolean(subject))
        .map((subject) => [subject.id, subject])
    ).values()
  );
};

const fetchTeacherAssignedSubjectsFromClasses = async (): Promise<SubjectBrief[]> => {
  const [schoolSubjectsRaw, assignYears] = await Promise.all([fetchSubjects(), fetchAssignYears()]);
  const schoolSubjects = normalizeSubjects(schoolSubjectsRaw);
  if (schoolSubjects.length === 0) return [];

  const assignedClassIds = new Set<number>(
    (Array.isArray(assignYears) ? assignYears : [])
      .flatMap((item: any) => {
        const classesValue = item?.classes;
        if (Array.isArray(classesValue)) return classesValue;
        return classesValue ? [classesValue] : [];
      })
      .map((cls: any) => Number(cls?.id ?? cls?.class_id ?? cls?.classId ?? 0))
      .filter((id: number) => Number.isFinite(id) && id > 0)
  );

  if (assignedClassIds.size === 0) return [];

  const matchingSubjects = await Promise.all(
    schoolSubjects.map(async (subject) => {
      try {
        const subjectClasses = await fetchSubjectClasses({
          subject_id: Number(subject.id),
          include_inactive: true,
        });

        const linkedClassIds = await Promise.all(
          (Array.isArray(subjectClasses) ? subjectClasses : []).map((row: any) =>
            resolveSubjectClassLinkedIdWithFallback(row, Number(subject.id))
          )
        );

        const hasAssignedClass = linkedClassIds.some((linkedClassId) =>
          assignedClassIds.has(Number(linkedClassId || 0))
        );

        return hasAssignedClass ? subject : null;
      } catch {
        return null;
      }
    })
  );

  return matchingSubjects.filter((subject): subject is SubjectBrief => Boolean(subject));
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
  userId?: string | number | null;
  email?: string | null;
}): Promise<SubjectContextResponse> => {
  const roleKey = String(options?.role || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  const isSchoolAdmin = roleKey === "SCHOOL_ADMIN";
  const isStudent = roleKey === "STUDENT";
  const isStaffWorkspaceRole = ["ADMIN", "HOD", "TEACHER"].includes(roleKey);
  const known = normalizeSubjects(options?.knownSubjects ?? []);

  console.log("[SubjectContext] bootstrap — role:", roleKey, "known:", known.length, "userId:", options?.userId);

  try {
    const res = await api.get("/subjects/my-context");
    const normalized = extractContext(res.data);
    console.log("[SubjectContext] /subjects/my-context returned", normalized.assigned_subjects.length, "subjects:", normalized.assigned_subjects.map(s => s.name));
    if (normalized.assigned_subjects.length > 0) return normalized;
  } catch (err: any) {
    console.warn("[SubjectContext] /subjects/my-context failed:", err?.response?.status, err?.message);
  }

  if (known.length > 0) {
    console.log("[SubjectContext] using knownSubjects from login:", known.map(s => s.name));
    return {
      assigned_subjects: known,
      default_subject_id: known[0]?.id ?? null,
      subject_roles: [],
    };
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

  if (isStaffWorkspaceRole) {
    // Attempt 1: derive from teacher's assigned classes ↔ subject-class mappings
    try {
      const subjects = await fetchTeacherAssignedSubjectsFromClasses();
      console.log("[SubjectContext] class-based derivation returned", subjects.length, "subjects:", subjects.map(s => s.name));
      if (subjects.length > 0) {
        return {
          assigned_subjects: subjects,
          default_subject_id: subjects[0]?.id ?? null,
          subject_roles: [],
        };
      }
    } catch (err: any) {
      console.warn("[SubjectContext] class-based derivation failed:", err?.message);
    }

    // Attempt 2: show all school subjects as last resort for authenticated staff
    // (ensures teachers are never stuck on empty subject cards)
    console.log("[SubjectContext] falling back to all school subjects for staff role:", roleKey);
    try {
      const subjects = normalizeSubjects(await fetchSubjects());
      if (subjects.length > 0) {
        return {
          assigned_subjects: subjects,
          default_subject_id: subjects[0]?.id ?? null,
          subject_roles: [],
        };
      }
    } catch (err: any) {
      console.warn("[SubjectContext] fetchSubjects fallback failed:", err?.message);
    }
  }

  // Strict privacy fallback: only School Admin can fallback to school-wide subjects.
  if (!isSchoolAdmin) {
    console.warn("[SubjectContext] strict fallback — returning empty for role:", roleKey);
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
