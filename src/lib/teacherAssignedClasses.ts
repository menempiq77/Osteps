type TeacherAssignedClassOption = {
  id: string;
  class_name: string;
  subject_class_id: string | null;
  year_id: number;
  year_name: string;
};

const normalizeClassLabel = (value: unknown) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const buildClassYearKey = (classLabel: unknown, yearId: unknown) => {
  const normalizedLabel = normalizeClassLabel(classLabel);
  const normalizedYearId = Number(yearId ?? 0);
  if (!normalizedLabel || !Number.isFinite(normalizedYearId) || normalizedYearId <= 0) {
    return "";
  }
  return `${normalizedLabel}::${normalizedYearId}`;
};

export const getAssignedClassesFromRows = (assignedYears: any[]): any[] =>
  (Array.isArray(assignedYears) ? assignedYears : [])
    .flatMap((item: any) => {
      const classesValue = item?.classes;
      return Array.isArray(classesValue) ? classesValue : classesValue ? [classesValue] : [];
    })
    .filter((cls: any) => Boolean(cls));

const toTeacherAssignedClassOption = (
  assignedClass: any,
  subjectClass?: any
): TeacherAssignedClassOption | null => {
  const classId = String(assignedClass?.id ?? assignedClass?.class_id ?? "").trim();
  const yearId = Number(
    assignedClass?.year_id ??
      assignedClass?.year?.id ??
      subjectClass?.year_id ??
      subjectClass?.year?.id ??
      0
  );

  if (!classId || !Number.isFinite(yearId) || yearId <= 0) {
    return null;
  }

  return {
    id: classId,
    class_name:
      String(
        assignedClass?.class_name ??
          assignedClass?.name ??
          subjectClass?.base_class_label ??
          subjectClass?.name ??
          ""
      ).trim() || `Class ${classId}`,
    subject_class_id:
      subjectClass?.id != null && String(subjectClass.id).trim().length > 0
        ? String(subjectClass.id)
        : null,
    year_id: yearId,
    year_name:
      String(
        assignedClass?.year?.name ??
          assignedClass?.year_name ??
          subjectClass?.year?.name ??
          ""
      ).trim() || `Year ${yearId}`,
  };
};

export const buildTeacherAssignedClassOptions = (
  assignedYears: any[],
  subjectClasses?: any[]
): TeacherAssignedClassOption[] => {
  const assignedClasses = getAssignedClassesFromRows(assignedYears);
  const subjectClassByKey = new Map<string, any>();

  (Array.isArray(subjectClasses) ? subjectClasses : []).forEach((row: any) => {
    const key = buildClassYearKey(
      row?.base_class_label ?? row?.name ?? "",
      row?.year_id ?? row?.year?.id
    );
    if (key && !subjectClassByKey.has(key)) {
      subjectClassByKey.set(key, row);
    }
  });

  const scopedOptions = assignedClasses
    .map((assignedClass: any) => {
      const key = buildClassYearKey(
        assignedClass?.class_name ?? assignedClass?.name ?? "",
        assignedClass?.year_id ?? assignedClass?.year?.id
      );
      const subjectClass = key ? subjectClassByKey.get(key) : undefined;

      if ((Array.isArray(subjectClasses) ? subjectClasses.length : 0) > 0 && !subjectClass) {
        return null;
      }

      return toTeacherAssignedClassOption(assignedClass, subjectClass);
    })
    .filter((item): item is TeacherAssignedClassOption => Boolean(item));

  return Array.from(new Map(scopedOptions.map((item) => [item.id, item])).values());
};

export const buildYearOptionsFromTeacherClasses = (classes: TeacherAssignedClassOption[]) =>
  Array.from(
    new Map(
      (Array.isArray(classes) ? classes : [])
        .map((cls) => {
          const yearId = Number(cls?.year_id ?? 0);
          if (!Number.isFinite(yearId) || yearId <= 0) return null;
          return [yearId, { id: yearId, name: cls?.year_name || `Year ${yearId}` }] as const;
        })
        .filter((entry): entry is readonly [number, { id: number; name: string }] => Boolean(entry))
    ).values()
  ).sort((left, right) => Number(left.id) - Number(right.id));

export const filterTeacherClassesByYear = (
  classes: TeacherAssignedClassOption[],
  selectedYear: string | number
) =>
  (Array.isArray(classes) ? classes : []).filter(
    (cls) => Number(cls?.year_id ?? 0) === Number(selectedYear)
  );
