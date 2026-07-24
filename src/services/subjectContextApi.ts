import api from "@/services/api";
import { fetchSubjects } from "@/services/subjectsApi";
import { fetchSubjectClasses, fetchStaffSubjectAssignments } from "@/services/subjectWorkspaceApi";
import { fetchAssignYears } from "@/services/yearsApi";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
import { normalizeSubjectImageUrl } from "@/lib/subjectImage";
import type { SubjectBrief, SubjectContextResponse } from "@/types/subjectContext";

const normalizeSubjects = (raw: any): SubjectBrief[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      id: Number(item?.id),
      name: String(item?.name ?? ""),
      code: item?.code ?? null,
      class_label: item?.class_label ?? null,
      dashboard_image_url: normalizeSubjectImageUrl(item?.dashboard_image_url),
    }))
    .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.name.trim().length > 0);
};

const dedupeSubjects = (subjects: SubjectBrief[]): SubjectBrief[] =>
  Array.from(
    new Map(
      subjects
        .filter((subject) => Number.isFinite(Number(subject.id)) && Number(subject.id) > 0)
        .map((subject) => [Number(subject.id), subject])
    ).values()
  );

const normalizeStaffAssignmentSubjects = (raw: any): SubjectBrief[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      id: Number(item?.subject_id ?? item?.subject?.id ?? 0),
      name: String(item?.subject_name ?? item?.subject?.name ?? ""),
      code: item?.subject_code ?? item?.subject?.code ?? null,
      class_label: null,
      dashboard_image_url: normalizeSubjectImageUrl(
        item?.dashboard_image_url ?? item?.subject?.dashboard_image_url
      ),
    }))
    .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.name.trim().length > 0);
};

const normalizeSubjectRoles = (raw: any): Array<{ subject_id: number; role_scope: string }> => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      subject_id: Number(item?.subject_id ?? item?.id ?? 0),
      role_scope: String(item?.role_scope ?? "").trim().toUpperCase(),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.subject_id) &&
        item.subject_id > 0 &&
        item.role_scope.length > 0
    );
};

const dedupeSubjectRoles = (roles: Array<{ subject_id: number; role_scope: string }>) =>
  Array.from(new Map(roles.map((role) => [`${role.subject_id}:${role.role_scope}`, role])).values());

const filterSubjectsBySubjectRoles = (
  subjects: SubjectBrief[],
  subjectRoles: Array<{ subject_id: number; role_scope: string }>
) => {
  if (subjectRoles.length === 0) return subjects;
  const allowedSubjectIds = new Set(subjectRoles.map((role) => role.subject_id));
  return subjects.filter((subject) => allowedSubjectIds.has(Number(subject.id)));
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
  const subjectRoles = normalizeSubjectRoles(root?.subject_roles);

  return {
    assigned_subjects: assigned,
    default_subject_id: Number.isFinite(defaultId) && defaultId > 0 ? defaultId : null,
    subject_roles: subjectRoles,
  };
};

// A subject is "archived" when ALL of its subject-classes are inactive, so the
// active-only subject-classes call returns nothing. Students must never see an
// archived subject in their workspace, so drop any subject with no active class.
// On a transient error we keep the subject to avoid hiding it by mistake.
const filterToSubjectsWithActiveClasses = async (
  subjects: SubjectBrief[]
): Promise<SubjectBrief[]> => {
  if (subjects.length === 0) return [];
  // undefined is_active => backend has no column, treat as active (don't hide);
  // null/0 => archived; 1 => active. Mirrors the Classes/Years/subject-cards pages.
  const isActive = (row: any) =>
    row?.is_active === undefined ? true : Number(row?.is_active) === 1;
  const results = await Promise.all(
    subjects.map(async (subject) => {
      try {
        // Ask for every class (incl. inactive) so we can decide by is_active,
        // because the list endpoint returns archived classes too.
        const classes = await fetchSubjectClasses({
          subject_id: Number(subject.id),
          include_inactive: true,
        });
        const hasActiveClass =
          Array.isArray(classes) && classes.some((row) => isActive(row));
        return hasActiveClass ? subject : null;
      } catch {
        return subject;
      }
    })
  );
  return results.filter((subject): subject is SubjectBrief => Boolean(subject));
};

// Derive which subjects are linked to a specific base class (for student impersonation).
const fetchStudentSubjectsFromBaseClass = async (studentClassId: number): Promise<SubjectBrief[]> => {
  const allSubjects = normalizeSubjects(await fetchSubjects());
  if (allSubjects.length === 0) return [];

  const results = await Promise.all(
    allSubjects.map(async (subject) => {
      try {
        const subjectClasses = await fetchSubjectClasses({ subject_id: Number(subject.id) });
        const linked = (Array.isArray(subjectClasses) ? subjectClasses : []).some((sc: any) => {
          const linkedId = Number(
            sc.class_id ?? sc.base_class_id ?? sc.class?.id ?? sc.classes?.id ?? sc.base_class?.id ?? 0
          );
          return linkedId === studentClassId;
        });
        return linked ? subject : null;
      } catch {
        return null;
      }
    })
  );

  return results.filter((s): s is SubjectBrief => Boolean(s));
};

export const fetchMySubjectContext = async (options?: {
  role?: string;
  knownSubjects?: Array<{
    id: number;
    name: string;
    code?: string | null;
    dashboard_image_url?: string | null;
  }>;
  knownSubjectRoles?: Array<{ subject_id: number; role_scope: string }>;
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
  const canDeriveSubjectsFromClasses = roleKey === "TEACHER";
  const known = normalizeSubjects(options?.knownSubjects ?? []);
  const knownSubjectRoles = normalizeSubjectRoles(options?.knownSubjectRoles ?? []);

  console.log("[SubjectContext] bootstrap — role:", roleKey, "known:", known.length, "userId:", options?.userId);

  // For staff roles, collect subjects from ALL sources and merge so no assignment is lost.
  if (isStaffWorkspaceRole) {
    // When impersonating: the admin token would return ALL school subjects from every API source.
    // Use only the knownSubjects passed at impersonation time (teacher's actual assigned subjects).
    const isAdminImpersonatingStaff =
      typeof window !== "undefined" && !!localStorage.getItem("osteps_impersonating_admin");
    if (isAdminImpersonatingStaff) {
      if (known.length > 0) {
        const filteredKnown = filterSubjectsBySubjectRoles(known, knownSubjectRoles);
        const finalKnown = knownSubjectRoles.length > 0 ? filteredKnown : known;
        console.log("[SubjectContext] impersonation staff — using knownSubjects only:", finalKnown.map(s => s.name));
        return {
          assigned_subjects: finalKnown,
          default_subject_id: finalKnown[0]?.id ?? null,
          subject_roles: knownSubjectRoles,
        };
      }
      return { assigned_subjects: [], default_subject_id: null, subject_roles: [] };
    }

    const seenIds = new Set<number>();
    const merged: SubjectBrief[] = [];
    const addUnique = (list: SubjectBrief[]) => {
      for (const s of list) {
        if (!seenIds.has(s.id)) {
          seenIds.add(s.id);
          merged.push(s);
        }
      }
    };

    // Source 1: backend /subjects/my-context
    let apiDefaultId: number | null = null;
    let apiSubjectRoles: Array<{ subject_id: number; role_scope: string }> = [];
    try {
      const res = await api.get("/subjects/my-context");
      const normalized = extractContext(res.data);
      console.log("[SubjectContext] /subjects/my-context returned", normalized.assigned_subjects.length, "subjects:", normalized.assigned_subjects.map(s => s.name));
      addUnique(normalized.assigned_subjects);
      apiDefaultId = normalized.default_subject_id;
      apiSubjectRoles = normalized.subject_roles;
    } catch (err: any) {
      console.warn("[SubjectContext] /subjects/my-context failed:", err?.response?.status, err?.message);
    }

    if (roleKey === "HOD") {
      try {
        const currentUserId = Number(options?.userId ?? 0);
        const assignmentRows = await fetchStaffSubjectAssignments("HOD");
        const ownAssignmentRows = (Array.isArray(assignmentRows) ? assignmentRows : []).filter(
          (row: any) =>
            Number(row?.user_id ?? row?.userId ?? 0) === currentUserId &&
            String(row?.role_scope ?? "").trim().toUpperCase() === "HOD"
        );
        const authoritativeSubjects = normalizeStaffAssignmentSubjects(ownAssignmentRows);
        if (authoritativeSubjects.length > 0) {
          const authoritativeRoles = authoritativeSubjects.map((subject) => ({
            subject_id: subject.id,
            role_scope: "HOD",
          }));
          const finalSubjectRoles = dedupeSubjectRoles([
            ...apiSubjectRoles,
            ...knownSubjectRoles,
            ...authoritativeRoles,
          ]).filter((role) =>
            authoritativeSubjects.some((subject) => subject.id === role.subject_id)
          );
          const resolvedDefaultSubjectId =
            [apiDefaultId, authoritativeSubjects[0]?.id ?? null]
              .filter((value): value is number => Number.isFinite(value as number) && Number(value) > 0)
              .find((value) => authoritativeSubjects.some((subject) => subject.id === value)) ?? null;

          console.log(
            "[SubjectContext] HOD staff-assignments returned",
            authoritativeSubjects.length,
            "subjects:",
            authoritativeSubjects.map((subject) => subject.name)
          );

          return {
            assigned_subjects: authoritativeSubjects,
            default_subject_id: resolvedDefaultSubjectId,
            subject_roles: finalSubjectRoles,
          };
        }
      } catch (err: any) {
        console.warn("[SubjectContext] HOD staff-assignments failed:", err?.response?.status, err?.message);
      }
    }

    // Source 2: knownSubjects from login response
    if (known.length > 0) {
      console.log("[SubjectContext] merging knownSubjects from login:", known.map(s => s.name));
      addUnique(known);
    }

    // Teachers can derive subjects from class links when explicit subject assignments are incomplete.
    if (canDeriveSubjectsFromClasses) {
      try {
        const derived = await fetchTeacherAssignedSubjectsFromClasses();
        console.log("[SubjectContext] class-based derivation returned", derived.length, "subjects:", derived.map(s => s.name));
        addUnique(derived);
      } catch (err: any) {
        console.warn("[SubjectContext] class-based derivation failed:", err?.message);
      }
    }

    if (merged.length > 0) {
      const mergedSubjectRoles = dedupeSubjectRoles([...apiSubjectRoles, ...knownSubjectRoles]);
      const finalSubjects =
        mergedSubjectRoles.length > 0 ? filterSubjectsBySubjectRoles(merged, mergedSubjectRoles) : merged;
      const resolvedDefaultSubjectId =
        [apiDefaultId, finalSubjects[0]?.id ?? null]
          .filter((value): value is number => Number.isFinite(value as number) && Number(value) > 0)
          .find((value) => finalSubjects.some((subject) => subject.id === value)) ?? null;

      console.log("[SubjectContext] staff merged total:", finalSubjects.length, "subjects:", finalSubjects.map(s => s.name));
      return {
        assigned_subjects: finalSubjects,
        default_subject_id: resolvedDefaultSubjectId,
        subject_roles: mergedSubjectRoles,
      };
    }

    console.warn("[SubjectContext] strict staff fallback — returning empty for role:", roleKey);
    return { assigned_subjects: [], default_subject_id: null, subject_roles: [] };
  }

  // School Admin always gets ALL school subjects (so newly-created subjects are visible immediately).
  // We still call /subjects/my-context just to get default_subject_id / subject_roles.
  if (isSchoolAdmin) {
    let apiDefaultId: number | null = null;
    let apiSubjectRoles: any[] = [];
    try {
      const res = await api.get("/subjects/my-context");
      const ctx = extractContext(res.data);
      apiDefaultId = ctx.default_subject_id;
      apiSubjectRoles = ctx.subject_roles;
    } catch { /* not critical — we still fall back to fetchSubjects */ }
    try {
      const all = normalizeSubjects(await fetchSubjects());
      if (all.length > 0) {
        console.log("[SubjectContext] school-admin fetched all subjects:", all.map(s => s.name));
        return {
          assigned_subjects: all,
          default_subject_id: apiDefaultId ?? all[0]?.id ?? null,
          subject_roles: apiSubjectRoles,
        };
      }
    } catch (err: any) {
      console.warn("[SubjectContext] school-admin fetchSubjects failed:", err?.message);
    }
    return { assigned_subjects: [], default_subject_id: null, subject_roles: [] };
  }

  // When impersonating via admin token, /subjects/my-context returns all school subjects
  // (because the admin token has full access). Skip it and rely on class-based fetch instead.
  const isAdminImpersonating =
    typeof window !== "undefined" && !!localStorage.getItem("osteps_impersonating_admin");
  let apiContext: SubjectContextResponse | null = null;
  let myContextSucceeded = false;

  // Non-staff: try backend API first, then knownSubjects (skip when impersonating)
  if (!isAdminImpersonating) {
    try {
      const res = await api.get("/subjects/my-context");
      const normalized = extractContext(res.data);
      apiContext = normalized;
      myContextSucceeded = true;
      console.log("[SubjectContext] /subjects/my-context returned", normalized.assigned_subjects.length, "subjects:", normalized.assigned_subjects.map(s => s.name));
      // my-context is authoritative for both staff and students: the backend
      // returns only ACTIVE subjects, so archived subjects are already excluded.
      // Students can't query /subject-classes (403) to filter a broader list, so
      // this is the only reliable active-subject signal for them.
      if (normalized.assigned_subjects.length > 0) return normalized;
    } catch (err: any) {
      console.warn("[SubjectContext] /subjects/my-context failed:", err?.response?.status, err?.message);
    }
  }

  if (known.length > 0 && !isStudent) {
    console.log("[SubjectContext] using knownSubjects from login:", known.map(s => s.name));
    return {
      assigned_subjects: known,
      default_subject_id: known[0]?.id ?? null,
      subject_roles: [],
    };
  }

  // For students: fetch their enrolled subjects from class student list.
  if (isStudent) {
    // my-context is authoritative when it succeeds: a non-empty result already
    // returned above, so reaching here after a successful call means the student
    // has NO active subjects (all archived) — return empty rather than deriving
    // from class links (which can't be filtered for archived state; students 403
    // on /subject-classes). The derivation/last-resort paths below only run when
    // my-context actually errored, to avoid stranding the student.
    if (myContextSucceeded) {
      return { assigned_subjects: [], default_subject_id: null, subject_roles: [] };
    }
    const sid = Number(options?.studentId ?? 0);
    const classId = Number(options?.studentClassId ?? 0);
    const collectedSubjects: SubjectBrief[] = [
      ...(apiContext?.assigned_subjects ?? []),
      ...known,
    ];

    // Derive subjects from subject-classes linked to the student's base class.
    // This keeps each base class connected to its subject even when the student's
    // individual enrollment row is missing or stale.
    if (classId > 0) {
      try {
        const derived = await fetchStudentSubjectsFromBaseClass(classId);
        if (derived.length > 0) {
          console.log("[SubjectContext] class-based derivation:", derived.map(s => s.name));
          collectedSubjects.push(...derived);
        }
      } catch (err: any) {
        console.warn("[SubjectContext] class-based derivation failed:", err?.message);
      }
    }

    if (Number.isFinite(classId) && classId > 0 && Number.isFinite(sid) && sid > 0) {
      try {
        const res = await api.get(`/get-student/${classId}`);
        const students: any[] = res.data?.data ?? res.data ?? [];
        const me = Array.isArray(students)
          ? students.find((s: any) =>
              Number(s?.id) === sid ||
              Number(s?.student_id) === sid ||
              Number(s?.student?.id) === sid
            )
          : null;
        if (me?.subjects) {
          const enrolled = normalizeSubjects(me.subjects);
          if (enrolled.length > 0) {
            collectedSubjects.push(...enrolled);
          }
        }
      } catch {
        // continue to other fallbacks
      }
    }

    const mergedStudentSubjects = dedupeSubjects(collectedSubjects);
    if (mergedStudentSubjects.length > 0) {
      // Hide archived subjects (no active class) from the student workspace.
      const activeStudentSubjects = await filterToSubjectsWithActiveClasses(mergedStudentSubjects);
      const resolvedDefaultId =
        [apiContext?.default_subject_id ?? null, activeStudentSubjects[0]?.id ?? null]
          .filter((value): value is number => Number.isFinite(value as number) && Number(value) > 0)
          .find((value) => activeStudentSubjects.some((subject) => subject.id === value)) ?? null;
      return {
        assigned_subjects: activeStudentSubjects,
        default_subject_id: resolvedDefaultId,
        subject_roles: apiContext?.subject_roles ?? [],
      };
    }

    // Last resort (only reached when my-context errored — a successful my-context
    // returns above): fetch all school subjects so the student isn't stranded with
    // nothing due to a transient backend failure.
    // When impersonating, don't fall back to all subjects — return empty so we see only what the student sees.
    if (isAdminImpersonating) {
      return { assigned_subjects: [], default_subject_id: null, subject_roles: [] };
    }
    try {
      const subjects = await filterToSubjectsWithActiveClasses(
        normalizeSubjects(await fetchSubjects())
      );
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
