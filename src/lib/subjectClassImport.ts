import {
  createSubjectClass,
  enrollStudentsToSubjectClass,
  fetchSubjectClasses,
} from "@/services/subjectWorkspaceApi";
import { fetchBaseClassStudents } from "@/services/studentsApi";
import {
  resolveSubjectClassLinkedIdWithFallback,
  writeSubjectClassBaseEntry,
} from "@/lib/subjectClassResolution";

export type SubjectClassImportRow = {
  id?: number | string | null;
  year_id?: number | string | null;
  name?: string | null;
  base_class_label?: string | null;
  is_active?: number | boolean | null;
  class_id?: number | string | null;
  base_class_id?: number | string | null;
  class?: { id?: number | string | null; year_id?: number | string | null } | null;
  classes?: { id?: number | string | null; year_id?: number | string | null } | null;
  base_class?: { id?: number | string | null; year_id?: number | string | null } | null;
};

export const resolveClassYearId = (row: SubjectClassImportRow): number =>
  Number(row?.year_id ?? row?.class?.year_id ?? row?.classes?.year_id ?? row?.base_class?.year_id ?? 0);

export const resolveClassLabel = (row: SubjectClassImportRow): string =>
  String(row?.base_class_label ?? row?.name ?? "").trim();

export const isSubjectClassActive = (row: SubjectClassImportRow): boolean =>
  row?.is_active === undefined ? true : Number(row.is_active) === 1;

const normalizeLabel = (value: unknown) =>
  String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase();

/**
 * Recreates a subject-class under another subject and re-enrolls the students of
 * its base class, so a subject can take over a twin subject's class roster.
 * Returns the subject-class id in the target subject.
 */
export const importSubjectClassIntoSubject = async (params: {
  sourceSubjectId: number;
  targetSubjectId: number;
  sourceClass: SubjectClassImportRow;
}): Promise<number> => {
  const { sourceSubjectId, targetSubjectId, sourceClass } = params;
  const classLabel = resolveClassLabel(sourceClass);
  const yearId = resolveClassYearId(sourceClass);
  if (!classLabel) throw new Error("The class has no name to copy.");

  const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
    sourceClass,
    sourceSubjectId
  );

  const targetRows = (await fetchSubjectClasses({
    subject_id: targetSubjectId,
    include_inactive: true,
  })) as SubjectClassImportRow[];
  const existing = (Array.isArray(targetRows) ? targetRows : []).find(
    (row) =>
      resolveClassYearId(row) === yearId &&
      normalizeLabel(resolveClassLabel(row)) === normalizeLabel(classLabel) &&
      isSubjectClassActive(row)
  );

  let targetSubjectClassId = Number(existing?.id ?? 0);
  if (!targetSubjectClassId) {
    const response = await createSubjectClass({
      subject_id: targetSubjectId,
      year_id: yearId,
      name: classLabel,
      base_class_label: classLabel,
    });
    targetSubjectClassId = Number(response?.data?.id ?? response?.id ?? 0);
    if (!Number.isFinite(targetSubjectClassId) || targetSubjectClassId <= 0) {
      throw new Error("The new subject class could not be created.");
    }
  }

  if (linkedClassId) {
    writeSubjectClassBaseEntry(
      targetSubjectId,
      String(targetSubjectClassId),
      String(linkedClassId)
    );

    const baseStudents = await fetchBaseClassStudents(linkedClassId);
    const studentIds = Array.from(
      new Set(
        (Array.isArray(baseStudents) ? baseStudents : [])
          .map((student: any) => Number(student?.id ?? student?.student_id ?? 0))
          .filter((id) => Number.isFinite(id) && id > 0)
      )
    );
    if (studentIds.length > 0) {
      await enrollStudentsToSubjectClass({
        subject_class_id: targetSubjectClassId,
        student_ids: studentIds,
      });
    }
  }

  return targetSubjectClassId;
};
