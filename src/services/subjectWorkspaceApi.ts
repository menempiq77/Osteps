import api from "@/services/api";

export type SubjectClassPayload = {
  subject_id: number;
  year_id?: number;
  name: string;
  base_class_label?: string;
};

type AssignStudentsToSubjectsPayload = {
  subjectIds: number[];
  studentIds: number[];
  subjects?: Array<{ id: number; name?: string | null }>;
  subjectClassIds?: number[];
};

const getBackendErrorMessage = (error: any): string => {
  return String(
    error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.message ||
      "Subject workspace request failed."
  );
};

export const isMissingSubjectWorkspaceRoute = (error: any): boolean => {
  const status = Number(error?.response?.status ?? 0);
  const message = getBackendErrorMessage(error).toLowerCase();
  return (
    status === 404 ||
    (message.includes("subject-classes") &&
      (message.includes("route") ||
        message.includes("endpoint") ||
        message.includes("url") ||
        message.includes("not found") ||
        message.includes("could not be found")))
  );
};

export const fetchSubjectClasses = async (params: { subject_id: number; year_id?: number }) => {
  const res = await api.get("/subject-classes", { params });
  return res?.data?.data ?? [];
};

export const createSubjectClass = async (payload: SubjectClassPayload) => {
  const res = await api.post("/subject-classes", payload);
  return res.data;
};

export const enrollStudentsToSubjectClass = async (payload: { subject_class_id: number; student_ids: number[] }) => {
  const res = await api.post("/subject-classes/enroll-students", payload);
  return res.data;
};

export const syncStudentsSubjects = async (payload: {
  student_ids: number[];
  subject_ids: number[];
}) => {
  const res = await api.post("/subject-classes/sync-students-subjects", payload);
  return res.data;
};

export const assignStaffSubjects = async (payload: {
  user_id: number;
  subject_ids: number[];
  role_scope: "HOD" | "TEACHER";
}) => {
  const res = await api.post("/subjects/assign-staff", payload);
  return res.data;
};

export const fetchStaffSubjectAssignments = async (roleScope?: "HOD" | "TEACHER") => {
  const res = await api.get("/subjects/staff-assignments", {
    params: roleScope ? { role_scope: roleScope } : {},
  });
  return res?.data?.data ?? [];
};

const ensureDefaultSubjectClass = async (
  subjectId: number,
  subjectName?: string | null
): Promise<{ id: number; name?: string | null }> => {
  try {
    const existing = await fetchSubjectClasses({ subject_id: Number(subjectId) });
    if (Array.isArray(existing) && existing.length > 0) {
      return existing[0];
    }

    await createSubjectClass({
      subject_id: Number(subjectId),
      name: `${String(subjectName || `Subject ${subjectId}`)} - Default`,
      base_class_label: "Default",
    });

    const refreshed = await fetchSubjectClasses({ subject_id: Number(subjectId) });
    if (Array.isArray(refreshed) && refreshed.length > 0) {
      return refreshed[0];
    }

    throw new Error(`No subject class available for subject ${subjectId}.`);
  } catch (error: any) {
    if (isMissingSubjectWorkspaceRoute(error)) {
      throw new Error(
        "Student-to-subject assignment needs the subject workspace backend routes to be deployed first. Missing routes: /subject-classes and/or /subject-classes/enroll-students."
      );
    }
    throw new Error(getBackendErrorMessage(error));
  }
};

export const assignStudentsToSubjects = async ({
  subjectIds,
  studentIds,
  subjects = [],
  subjectClassIds = [],
}: AssignStudentsToSubjectsPayload) => {
  const uniqueSubjectIds = Array.from(
    new Set(subjectIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))
  );
  const uniqueSubjectClassIds = Array.from(
    new Set(subjectClassIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))
  );
  const uniqueStudentIds = Array.from(
    new Set(studentIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))
  );

  if (uniqueSubjectIds.length === 0 && uniqueSubjectClassIds.length === 0) {
    throw new Error("Please choose at least one subject or subject class.");
  }
  if (uniqueStudentIds.length === 0) {
    throw new Error("Please choose at least one student.");
  }

  const results = [] as Array<{ subjectId: number; subjectClassId: number }>;
  const processedSubjectIds = new Set<number>();

  if (uniqueSubjectClassIds.length > 0) {
    const lookupSubjectIds =
      uniqueSubjectIds.length > 0
        ? uniqueSubjectIds
        : Array.from(
            new Set(
              subjects
                .map((subject) => Number(subject.id))
                .filter((id) => Number.isFinite(id) && id > 0)
            )
          );
    const subjectClassRows = await Promise.all(
      lookupSubjectIds.map((subjectId) => fetchSubjectClasses({ subject_id: Number(subjectId) }))
    );
    const flatSubjectClasses = subjectClassRows.flat();

    for (const subjectClassId of uniqueSubjectClassIds) {
      const selectedClass = flatSubjectClasses.find(
        (item) => Number(item?.id) === Number(subjectClassId)
      );

      if (!selectedClass) {
        throw new Error(`Selected subject class ${subjectClassId} is no longer available.`);
      }

      await enrollStudentsToSubjectClass({
        subject_class_id: Number(subjectClassId),
        student_ids: uniqueStudentIds,
      });

      const resolvedSubjectId = Number(selectedClass.subject_id);
      if (Number.isFinite(resolvedSubjectId) && resolvedSubjectId > 0) {
        processedSubjectIds.add(resolvedSubjectId);
        results.push({ subjectId: resolvedSubjectId, subjectClassId: Number(subjectClassId) });
      }
    }
  }

  for (const subjectId of uniqueSubjectIds) {
    if (processedSubjectIds.has(subjectId)) continue;
    const subjectName =
      subjects.find((subject) => Number(subject.id) === Number(subjectId))?.name ?? null;
    const subjectClass = await ensureDefaultSubjectClass(subjectId, subjectName);
    await enrollStudentsToSubjectClass({
      subject_class_id: Number(subjectClass.id),
      student_ids: uniqueStudentIds,
    });
    results.push({ subjectId, subjectClassId: Number(subjectClass.id) });
  }

  await syncStudentsSubjects({
    student_ids: uniqueStudentIds,
    subject_ids: Array.from(new Set(results.map((item) => Number(item.subjectId)).filter((id) => id > 0))),
  });

  return results;
};

export const checkSubjectWorkspaceAvailability = async (subjectId: number): Promise<{
  available: boolean;
  message?: string;
}> => {
  try {
    await fetchSubjectClasses({ subject_id: Number(subjectId) });
    return { available: true };
  } catch (error: any) {
    if (isMissingSubjectWorkspaceRoute(error)) {
      return {
        available: false,
        message:
          "Student-to-subject assignment is not available yet because the backend subject workspace routes are not deployed.",
      };
    }

    return {
      available: true,
      message: getBackendErrorMessage(error),
    };
  }
};
