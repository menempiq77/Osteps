const normalizeText = (value: unknown) =>
  String(value ?? "")
    .replace(/islamiat/gi, "Islamic")
    .trim()
    .toLowerCase();

const extractSubjectsArray = (student: Record<string, any>) => {
  if (Array.isArray(student?.subjects)) return student.subjects;
  if (student?.subject_name) return [student.subject_name];
  if (student?.subject) return [student.subject];
  return [];
};

export const studentMatchesSubjectScope = (
  student: Record<string, any>,
  options: {
    subjectId?: number | null;
    subjectName?: string | null;
    subjectClassId?: string | number | null;
  }
): boolean => {
  const wantedSubjectId = Number(options.subjectId ?? 0);
  const wantedSubjectName = normalizeText(options.subjectName);
  const wantedSubjectClassId = String(options.subjectClassId ?? "").trim();

  const candidateSubjectClassIds = [
    student?.subject_class_id,
    student?.subjectClassId,
    student?.pivot?.subject_class_id,
  ]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  if (wantedSubjectClassId && candidateSubjectClassIds.length > 0) {
    return candidateSubjectClassIds.includes(wantedSubjectClassId);
  }

  const subjects = extractSubjectsArray(student);
  const subjectIds = subjects
    .map((item: any) => {
      if (item && typeof item === "object") {
        const value = Number(item.id ?? item.subject_id);
        return Number.isFinite(value) && value > 0 ? value : null;
      }
      return null;
    })
    .filter((value: number | null): value is number => Number.isFinite(value as number));

  if (wantedSubjectId > 0 && subjectIds.includes(wantedSubjectId)) {
    return true;
  }

  const subjectNames = subjects
    .map((item: any) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        return String(item.name ?? item.subject_name ?? "");
      }
      return "";
    })
    .map(normalizeText)
    .filter(Boolean);

  if (wantedSubjectName && subjectNames.includes(wantedSubjectName)) {
    return true;
  }

  return false;
};

export const filterStudentsBySubjectScope = <T extends Record<string, any>>(
  students: T[],
  options: {
    subjectId?: number | null;
    subjectName?: string | null;
    subjectClassId?: string | number | null;
  }
): T[] => {
  return (Array.isArray(students) ? students : []).filter((student) =>
    studentMatchesSubjectScope(student, options)
  );
};
