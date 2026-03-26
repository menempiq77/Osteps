"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Drawer,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { RootState } from "@/store/store";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { addStudent, deleteStudent, fetchStudentProfileData, fetchStudents, updateStudent } from "@/services/studentsApi";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { filterStudentsBySubjectScope } from "@/lib/subjectStudentScope";
import {
  type StudentHintBucket,
  matchesSubjectStudentHint,
  readSubjectStudentHints,
} from "@/lib/subjectStudentHints";
import { resolveSubjectClassLinkedIdWithFallback } from "@/lib/subjectClassResolution";
import { extractSubjectIdFromPath, toSubjectScopedPath } from "@/lib/subjectRouting";
import { readStudentProfileOverride, writeStudentProfileOverride } from "@/lib/studentProfileOverrides";
import {
  assignStudentsToSubjects,
  checkSubjectWorkspaceAvailability,
  fetchSubjectClasses,
} from "@/services/subjectWorkspaceApi";

type StudentListRow = {
  key: string;
  enrollmentStudentId: string;
  studentId: string;
  profileId: string;
  updateIds: string[];
  name: string;
  userName: string;
  email: string;
  yearId: number;
  yearGroup: string;
  yearGroups: string[];
  yearIds: number[];
  className: string;
  classNames: string[];
  classId: number;
  classFilterOptions: Array<{ value: string; label: string }>;
  subjectClassId?: number;
  status: "active" | "inactive" | "suspended";
  gender: "Male" | "Female" | "Unknown";
  genderRaw: "male" | "female" | "";
  nationality: string;
  subjectIds: number[];
  subjectNames: string[];
  currentAssignments: Array<{
    subjectId?: number;
    subjectName: string;
    subjectClassId?: number;
    subjectClassName: string;
    baseClassLabel: string;
    yearLabel: string;
    linkedClassId?: number;
  }>;
  isSen: boolean;
  senDetails: string;
};

type YearItem = {
  id: number | string;
  name?: string;
};

type ClassItem = {
  id: number | string;
  class_name?: string;
  name?: string;
  year_id?: number | string;
  year_name?: string;
  subject_class_id?: number | string;
  linked_class_id?: number | string;
  year?: { id?: number | string; name?: string };
};

type SubjectClassRow = {
  id?: number | string;
  subject_id?: number | string | null;
  class_id?: number | string | null;
  base_class_id?: number | string | null;
  year_id?: number | string | null;
  name?: string | null;
  base_class_label?: string | null;
  class?: { id?: number | string | null; class_name?: string | null; year_id?: number | string | null } | null;
  classes?: { id?: number | string | null; class_name?: string | null; year_id?: number | string | null } | null;
  base_class?: { id?: number | string | null; class_name?: string | null; year_id?: number | string | null } | null;
};

type SubjectClassOption = {
  id: number;
  subjectId: number;
  name: string;
  yearId: number;
  baseClassLabel: string;
  linkedClassId?: number;
};

const normalizeGender = (raw: unknown): "Male" | "Female" | "Unknown" => {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) return "Unknown";
  if (["male", "m", "boy"].includes(value)) return "Male";
  if (["female", "f", "girl"].includes(value)) return "Female";
  return "Unknown";
};

const normalizeGenderRaw = (raw: unknown): "male" | "female" | "" => {
  const value = String(raw ?? "").trim().toLowerCase();
  if (["male", "m", "boy"].includes(value)) return "male";
  if (["female", "f", "girl"].includes(value)) return "female";
  return "";
};

const displaySubjectName = (value: unknown): string =>
  String(value ?? "").replace(/islamiat/gi, "Islamic").trim();

const SUBJECT_HINTS_STORAGE_KEY = "subject-student-hints-v1";

const normalizeClassLabel = (value: unknown) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const uniqueNonEmptyStrings = (values: Array<unknown>): string[] =>
  Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  );

const getRowYearGroups = (row: Partial<StudentListRow>): string[] => {
  if (Array.isArray(row.yearGroups) && row.yearGroups.length > 0) {
    return uniqueNonEmptyStrings(row.yearGroups);
  }
  return uniqueNonEmptyStrings([row.yearGroup]);
};

const getRowYearIds = (row: Partial<StudentListRow>): number[] => {
  if (Array.isArray(row.yearIds) && row.yearIds.length > 0) {
    return Array.from(
      new Set(
        row.yearIds
          .map((value) => Number(value))
          .filter((value) => Number.isFinite(value) && value > 0)
      )
    );
  }

  const fallback = Number(row.yearId);
  return Number.isFinite(fallback) && fallback > 0 ? [fallback] : [];
};

const getRowClassNames = (row: Partial<StudentListRow>): string[] => {
  if (Array.isArray(row.classNames) && row.classNames.length > 0) {
    return uniqueNonEmptyStrings(row.classNames);
  }
  return uniqueNonEmptyStrings([row.className]);
};

const getRowClassFilterOptions = (
  row: Partial<StudentListRow>
): Array<{ value: string; label: string }> => {
  if (Array.isArray(row.classFilterOptions) && row.classFilterOptions.length > 0) {
    return row.classFilterOptions.filter((option) => option?.value && option?.label);
  }

  const fallbackValue = String(row.subjectClassId ?? row.classId ?? "").trim();
  const fallbackLabel = String(row.className ?? "").trim();
  return fallbackValue && fallbackLabel ? [{ value: fallbackValue, label: fallbackLabel }] : [];
};


const resolveSubjectClassLinkedId = (row: SubjectClassRow): string =>
  String(
    row.class_id ??
      row.base_class_id ??
      row.class?.id ??
      row.classes?.id ??
      row.base_class?.id ??
      ""
  ).trim();

const extractSubjectClassCandidateIds = (row: SubjectClassRow): string[] => {
  return Array.from(
    new Set(
      [
        row.id,
        row.class_id,
        row.base_class_id,
        row.class?.id,
        row.classes?.id,
        row.base_class?.id,
      ]
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  );
};

const resolveSubjectClassYearId = (row: SubjectClassRow): number =>
  Number(
    row.year_id ??
      row.class?.year_id ??
      row.classes?.year_id ??
      row.base_class?.year_id ??
      0
  );

const resolveSubjectClassLabel = (row: SubjectClassRow): string =>
  String(
    row.base_class_label ??
      row.class?.class_name ??
      row.classes?.class_name ??
      row.base_class?.class_name ??
      row.name ??
      ""
  ).trim();

const extractStudentSubjectClassIds = (student: Record<string, any>) =>
  [
    student?.subject_class_id,
    student?.subjectClassId,
    student?.pivot?.subject_class_id,
    ...(Array.isArray(student?.subjects)
      ? (student.subjects as Array<Record<string, unknown>>).map((s) => s?.subject_class_id)
      : []),
  ]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

export default function AllStudentsPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const preselectedYearId = searchParams.get("yearId") || "";
  const preselectedClassId = searchParams.get("classId") || "";
  const preselectedSubjectClassLabel = searchParams.get("subjectClassLabel") || "";
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const role = currentUser?.role;
  const canView = role === "SCHOOL_ADMIN" || role === "HOD" || role === "TEACHER";
  const canEdit = role === "SCHOOL_ADMIN";
  const isSchoolAdmin = role === "SCHOOL_ADMIN";
  const schoolId = Number((currentUser as { school?: number | string } | null)?.school ?? 0);
  const { subjects, activeSubjectId, activeSubject, canUseSubjectContext } = useSubjectContext();
  const pathSubjectId = Number(extractSubjectIdFromPath(pathname) ?? 0);
  const scopedSubjectId = Number.isFinite(pathSubjectId) && pathSubjectId > 0
    ? pathSubjectId
    : Number(activeSubjectId ?? 0);
  const isPathSubjectScoped = Number.isFinite(pathSubjectId) && pathSubjectId > 0;
  const isSubjectWorkspaceMode = canUseSubjectContext && isPathSubjectScoped && scopedSubjectId > 0;
  const [messageApi, contextHolder] = message.useMessage();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const [nameFilter, setNameFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [yearIdFilter, setYearIdFilter] = useState<string>(preselectedYearId);
  const [classFilters, setClassFilters] = useState<string[]>(
    preselectedClassId ? [preselectedClassId] : []
  );
  const [genderFilters, setGenderFilters] = useState<Array<"Male" | "Female" | "Unknown">>([]);
  const [editingStudent, setEditingStudent] = useState<StudentListRow | null>(null);
  const [editingStudents, setEditingStudents] = useState<StudentListRow[]>([]);
  const [deletingStudent, setDeletingStudent] = useState<StudentListRow | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [assignFeatureAvailable, setAssignFeatureAvailable] = useState<boolean | null>(null);
  const [assignFeatureMessage, setAssignFeatureMessage] = useState("");
  const [assignScope, setAssignScope] = useState<"selected" | "filtered" | "all_filtered">(
    "selected"
  );
  const [assignForm] = Form.useForm();
  const selectedAssignSubjectIds = Form.useWatch("subject_ids", assignForm) as number[] | undefined;
  const [reassignMode, setReassignMode] = useState(false);


  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery<StudentListRow[]>({
    queryKey: [
      "all-students-list",
      role,
      schoolId,
      isSubjectWorkspaceMode ? scopedSubjectId : "school",
      String(activeSubject?.name ?? ""),
      subjects
        .map((subject) => `${Number(subject.id)}:${displaySubjectName(subject.name)}`)
        .sort()
        .join(","),
    ],
    enabled: canView,
    queryFn: async (): Promise<StudentListRow[]> => {
      let years: YearItem[] = [];
      if (schoolId > 0) {
        years = (await fetchYearsBySchool(schoolId)) || [];
      }

      const allBaseClassRows = (
        await Promise.all(
          (years || []).map(async (year) => {
            try {
              return (await fetchClasses(String(year.id))) as ClassItem[];
            } catch {
              return [] as ClassItem[];
            }
          })
        )
      ).flat();

      const baseClassById = new Map<string, ClassItem>(
        allBaseClassRows
          .map((row) => {
            const id = String(row?.id ?? "").trim();
            return id ? ([id, row] as const) : null;
          })
          .filter((entry): entry is readonly [string, ClassItem] => Boolean(entry))
      );

      const yearNameById = new Map<string, string>(
        years.map((year) => [String(year.id), String(year.name ?? "")])
      );

      const subjectIdToName = new Map<number, string>(
        subjects
          .map((subject) => {
            const id = Number(subject.id);
            const name = displaySubjectName(subject.name);
            return Number.isFinite(id) && id > 0 && name ? ([id, name] as const) : null;
          })
          .filter((entry): entry is readonly [number, string] => Boolean(entry))
      );

      const subjectClassIdToSubject = new Map<
        string,
        {
          id: number;
          name: string;
          subjectClassId?: number;
          subjectClassName: string;
          baseClassLabel: string;
          yearId: number;
          yearLabel: string;
          linkedClassId?: number;
        }
      >();
      const linkedClassToSubjects = new Map<string, Set<string>>();

      const hintEntriesBySubject = new Map<string, { subjectId: number; subjectName: string; bucket: StudentHintBucket }>();
      if (typeof window !== "undefined") {
        try {
          const rawHints = window.localStorage.getItem(SUBJECT_HINTS_STORAGE_KEY);
          const parsedHints = rawHints ? JSON.parse(rawHints) : {};
          if (parsedHints && typeof parsedHints === "object") {
            Object.keys(parsedHints).forEach((scopeKey) => {
              const [subjectIdPart] = String(scopeKey).split(":");
              const parsedSubjectId = Number(subjectIdPart ?? 0);
              const subjectName = subjectIdToName.get(parsedSubjectId);
              if (!subjectName || !Number.isFinite(parsedSubjectId) || parsedSubjectId <= 0) return;
              const bucket = readSubjectStudentHints(scopeKey);
              if (
                bucket.ids.length === 0 &&
                bucket.usernames.length === 0 &&
                bucket.emails.length === 0 &&
                bucket.names.length === 0
              ) {
                return;
              }
              hintEntriesBySubject.set(scopeKey, {
                subjectId: parsedSubjectId,
                subjectName,
                bucket,
              });
            });
          }
        } catch {
          // ignore hint-store parsing errors
        }
      }

      if (subjects.length > 0) {
        const allSubjectClassRows = await Promise.all(
          subjects.map(async (subject) => {
            const subjectId = Number(subject.id);
            const subjectName = displaySubjectName(subject.name);
            if (!Number.isFinite(subjectId) || subjectId <= 0) {
              return [] as Array<{
                row: SubjectClassRow;
                subjectId: number;
                subjectName: string;
              }>;
            }
            try {
              const rows = (await fetchSubjectClasses({ subject_id: subjectId })) as SubjectClassRow[];
              return (Array.isArray(rows) ? rows : []).map((row) => ({
                row,
                subjectId,
                subjectName,
              }));
            } catch {
              return [] as Array<{ row: SubjectClassRow; subjectId: number; subjectName: string }>;
            }
          })
        );

        allSubjectClassRows.flat().forEach((entry) => {
          const row = entry?.row as SubjectClassRow;
          const resolvedSubjectId = Number(entry?.subjectId ?? 0);
          const subjectName = String(entry?.subjectName ?? "").trim();
          if (!subjectName || !Number.isFinite(resolvedSubjectId) || resolvedSubjectId <= 0 || !row) return;

          const resolvedYearId = resolveSubjectClassYearId(row);
          const resolvedBaseClassLabel = resolveSubjectClassLabel(row);
          const resolvedLinkedClassId = Number(resolveSubjectClassLinkedId(row) || 0) || undefined;
          const resolvedSubjectClassId = Number(row.id ?? 0) || undefined;
          const resolvedSubjectClassName = String(
            row.name || resolvedBaseClassLabel || `Class ${resolvedSubjectClassId || ""}`
          ).trim();
          const resolvedYearLabel =
            yearNameById.get(String(resolvedYearId)) ||
            String(
              row.class?.year_id ?? row.classes?.year_id ?? row.base_class?.year_id ?? ""
            ) ||
            (resolvedYearId > 0 ? `Year ${resolvedYearId}` : "Unknown");

          extractSubjectClassCandidateIds(row).forEach((candidateId) => {
            subjectClassIdToSubject.set(candidateId, {
              id: resolvedSubjectId,
              name: subjectName,
              subjectClassId: resolvedSubjectClassId,
              subjectClassName: resolvedSubjectClassName,
              baseClassLabel: resolvedBaseClassLabel,
              yearId: resolvedYearId,
              yearLabel: resolvedYearLabel,
              linkedClassId: resolvedLinkedClassId,
            });
          });

          const linkedId = resolveSubjectClassLinkedId(row);
          if (!linkedId) return;
          const bucket = linkedClassToSubjects.get(linkedId) ?? new Set<string>();
          bucket.add(subjectName);
          linkedClassToSubjects.set(linkedId, bucket);
        });
      }

      let classList: ClassItem[] = [];

      if (isSubjectWorkspaceMode && activeSubjectId) {
        const subjectClasses = (await fetchSubjectClasses({
          subject_id: Number(scopedSubjectId),
        })) as SubjectClassRow[];

        classList = await Promise.all(
          (Array.isArray(subjectClasses) ? subjectClasses : []).map(async (row) => {
            const subjectClassId = String(row?.id ?? "").trim();
            const linkedClassId = await resolveSubjectClassLinkedIdWithFallback(
              row,
              Number(scopedSubjectId)
            );
            const yearId = resolveSubjectClassYearId(row);
            const classLabel = resolveSubjectClassLabel(row);

            return {
              id: linkedClassId || subjectClassId,
              class_name: classLabel || `Class ${subjectClassId || ""}`,
              year_id: yearId,
              year_name: yearNameById.get(String(yearId)) || "Unknown",
              subject_class_id: subjectClassId,
              linked_class_id: linkedClassId || undefined,
            } as ClassItem;
          })
        );
      } else if (role === "TEACHER") {
        const assigned = await fetchAssignYears();
        classList = (assigned || [])
          .map((entry: { classes?: ClassItem }) => entry.classes)
          .filter((cls: ClassItem | undefined): cls is ClassItem => Boolean(cls));
      } else {
        classList = allBaseClassRows;
      }

      const uniqueClasses = Array.from(
        new Map(
          classList.map((cls) => [
            String(cls.subject_class_id ?? cls.id),
            cls,
          ])
        ).values()
      );

      const byClass = await Promise.all(
        uniqueClasses.map(async (cls) => {
          const className = String(cls.class_name ?? `Class ${cls.id}`);
          const classYearId = cls.year_id ?? cls.year?.id;
          const yearName =
            cls.year_name ??
            cls.year?.name ??
            (classYearId != null ? yearNameById.get(String(classYearId)) : undefined) ??
            "Unknown";

          try {
            const linkedClassId = String(cls.linked_class_id ?? cls.id ?? "").trim();
            if (!linkedClassId) return [] as StudentListRow[];

            const classStudents = (await fetchStudents(
              linkedClassId,
              isSubjectWorkspaceMode ? Number(scopedSubjectId) : undefined
            )) as Array<Record<string, unknown>>;

            const studentRows = Array.isArray(classStudents) ? classStudents : [];
            const subjectClassId = String(cls.subject_class_id ?? "").trim();

            const inScopeRows = isSubjectWorkspaceMode
              ? filterStudentsBySubjectScope(studentRows, {
                  subjectId: Number(scopedSubjectId),
                  subjectName: activeSubject?.name,
                  subjectClassId,
                })
              : studentRows;

            const scopedStudents = inScopeRows;

            return scopedStudents.flatMap((student): StudentListRow[] => {
                const primaryId = String(student.id ?? "").trim();
                const fallbackId = String(student.student_id ?? "").trim();
                const canonicalStudentId = fallbackId || primaryId;
                const updateIds = Array.from(
                  new Set([canonicalStudentId, fallbackId, primaryId].filter(Boolean))
                );
                const sid = canonicalStudentId || updateIds[0] || "";
                const profileId = primaryId || fallbackId || sid;

                const rawSubjects = Array.isArray(student.subjects)
                  ? student.subjects
                  : student.subject_name
                    ? [student.subject_name]
                    : student.subject
                      ? [student.subject]
                      : [];

                const subjectNames = rawSubjects
                  .map((item: any) => {
                    if (typeof item === "string") return item;
                    if (item && typeof item === "object") return String(item.name ?? item.subject_name ?? "");
                    return "";
                  })
                  .map((name: string) => displaySubjectName(name))
                  .filter(Boolean);
                const subjectIds = rawSubjects
                  .map((item: any) => {
                    if (item && typeof item === "object") {
                      const value = Number(item.id ?? item.subject_id);
                      return Number.isFinite(value) && value > 0 ? value : null;
                    }
                    return null;
                  })
                  .filter((value: number | null): value is number => Number.isFinite(value as number));

                const studentSubjectClassCandidates = extractStudentSubjectClassIds(student as Record<string, any>);
                const inferredFromSubjectClass = studentSubjectClassCandidates
                  .map((candidateId) => subjectClassIdToSubject.get(candidateId))
                  .filter(
                    (entry): entry is {
                      id: number;
                      name: string;
                      subjectClassId?: number;
                      subjectClassName: string;
                      baseClassLabel: string;
                      yearId: number;
                      yearLabel: string;
                      linkedClassId?: number;
                    } =>
                      Boolean(entry && Number.isFinite(entry.id) && entry.id > 0 && entry.name)
                  );

                if (subjectNames.length === 0 && inferredFromSubjectClass.length > 0) {
                  const inferredNames = Array.from(new Set(inferredFromSubjectClass.map((entry) => entry.name)));
                  const inferredIds = Array.from(new Set(inferredFromSubjectClass.map((entry) => entry.id)));
                  subjectNames.push(...inferredNames);
                  subjectIds.push(...inferredIds);
                }

                if (subjectNames.length === 0) {
                  const classSubjectNames = Array.from(
                    linkedClassToSubjects.get(String(linkedClassId)) ?? []
                  );
                  if (classSubjectNames.length === 1) {
                    subjectNames.push(classSubjectNames[0]);
                  }
                }

                if (subjectNames.length === 0 && hintEntriesBySubject.size > 0) {
                  const hintMatches = Array.from(hintEntriesBySubject.values()).filter((entry) =>
                    matchesSubjectStudentHint(student as Record<string, any>, entry.bucket)
                  );
                  const inferredHintNames = Array.from(new Set(hintMatches.map((entry) => entry.subjectName)));
                  const inferredHintIds = Array.from(new Set(hintMatches.map((entry) => entry.subjectId)));
                  if (inferredHintNames.length === 1) {
                    subjectNames.push(inferredHintNames[0]);
                  }
                  if (inferredHintIds.length === 1) {
                    subjectIds.push(inferredHintIds[0]);
                  }
                }

                const fromApiGender = normalizeGenderRaw(
                  student.gender ??
                    student.student_gender ??
                    student.sex ??
                    student.student_sex ??
                    student.studentGender ??
                    student.studentSex
                );
                const rawGender = fromApiGender;
                const nationalityFromApi = String(
                  student.nationality ??
                    student.student_nationality ??
                    student.studentNationality ??
                    student.country ??
                    student.citizenship ??
                    ""
                ).trim();
                const nationality = nationalityFromApi;
                const override = readStudentProfileOverride([primaryId, fallbackId]);
                const isSen =
                  typeof override?.isSen === "boolean"
                    ? override.isSen
                    : Boolean(student.is_sen ?? student.isSen ?? false);
                const senDetails =
                  typeof override?.senDetails === "string"
                    ? override.senDetails
                    : String(student.sen_details ?? student.senDetails ?? "");

                // Extract actual student class_id from API response (not the grouping class)
                const actualStudentClassId = Number(
                  student.class_id ?? 
                  student.classId ?? 
                  student.studentClassId ?? 
                  linkedClassId ?? 
                  0
                );
                const studentSchoolId = Number(student.school_id ?? student.schoolId ?? 0);
                if (schoolId > 0 && studentSchoolId > 0 && studentSchoolId !== schoolId) {
                  return [] as StudentListRow[];
                }
                const actualClass = baseClassById.get(String(actualStudentClassId));
                const actualClassName = String(
                  actualClass?.class_name ?? actualClass?.name ?? className
                );
                const actualYearId = Number(
                  actualClass?.year_id ?? actualClass?.year?.id ?? classYearId ?? 0
                );
                const actualYearName =
                  yearNameById.get(String(actualYearId)) ||
                  actualClass?.year_name ||
                  actualClass?.year?.name ||
                  yearName;

                const currentAssignments = Array.from(
                  new Map(
                    inferredFromSubjectClass.map((entry) => {
                      const assignment = {
                        subjectId: entry.id,
                        subjectName: entry.name,
                        subjectClassId: entry.subjectClassId,
                        subjectClassName: entry.subjectClassName || actualClassName,
                        baseClassLabel: entry.baseClassLabel || actualClassName,
                        yearLabel: entry.yearLabel || actualYearName,
                        linkedClassId: entry.linkedClassId,
                      };
                      return [
                        `${assignment.subjectId || assignment.subjectName}-${assignment.subjectClassId || assignment.subjectClassName}`,
                        assignment,
                      ];
                    })
                  ).values()
                );

                if (currentAssignments.length === 0 && subjectNames.length > 0) {
                  currentAssignments.push(
                    ...Array.from(
                      new Map(
                        subjectNames.map((subjectName, index) => {
                          const assignment = {
                            subjectId: subjectIds[index],
                            subjectName,
                            subjectClassId: undefined,
                            subjectClassName: actualClassName,
                            baseClassLabel: actualClassName,
                            yearLabel: actualYearName,
                            linkedClassId: actualStudentClassId || undefined,
                          };
                          return [
                            `${assignment.subjectId || assignment.subjectName}-${assignment.subjectClassName}`,
                            assignment,
                          ];
                        })
                      ).values()
                    )
                  );
                }

                const yearGroups = uniqueNonEmptyStrings([
                  ...currentAssignments.map((entry) => entry.yearLabel),
                  actualYearName,
                ]);
                const yearIds = Array.from(
                  new Set(
                    [
                      ...inferredFromSubjectClass.map((entry) => Number(entry.yearId)),
                      actualYearId,
                    ].filter((value) => Number.isFinite(value) && value > 0)
                  )
                );
                const classNames = uniqueNonEmptyStrings([
                  ...currentAssignments.map((entry) => entry.baseClassLabel || entry.subjectClassName),
                  actualClassName,
                ]);
                const classFilterOptions = Array.from(
                  new Map(
                    [
                      ...currentAssignments.map((entry) => ({
                        value: String(entry.subjectClassId ?? entry.linkedClassId ?? "").trim(),
                        label: String(entry.baseClassLabel || entry.subjectClassName || actualClassName).trim(),
                      })),
                      {
                        value: String(actualStudentClassId || "").trim(),
                        label: actualClassName,
                      },
                    ]
                      .filter((entry) => entry.value && entry.label)
                      .map((entry) => [entry.value, entry])
                  ).values()
                );

                return [{
                  key: `${cls.id}-${student.id ?? student.student_id ?? Math.random()}`,
                  enrollmentStudentId: primaryId || fallbackId || "",
                  studentId: sid,
                  profileId,
                  updateIds,
                  name: String(student.student_name ?? student.name ?? "Unknown Student"),
                  userName: String(student.user_name ?? student.username ?? ""),
                  email: String(student.email ?? ""),
                  nationality,
                  subjectIds,
                  subjectNames,
                  currentAssignments,
                  isSen,
                  senDetails,
                  yearId: actualYearId,
                  yearGroup: actualYearName,
                  yearGroups,
                  yearIds,
                  className: actualClassName,
                  classNames,
                  classId: actualStudentClassId,
                  classFilterOptions,
                  subjectClassId: Number(cls.subject_class_id ?? 0) || undefined,
                  status: String(student.status ?? "active").toLowerCase() as
                    | "active"
                    | "inactive"
                    | "suspended",
                  gender:
                    rawGender === "male"
                      ? "Male"
                      : rawGender === "female"
                        ? "Female"
                        : "Unknown",
                  genderRaw: rawGender,
                }];
              });
          } catch {
            return [] as StudentListRow[];
          }
        })
      );

      const flattenedRows = byClass.flat() as StudentListRow[];
      return Array.from(
        new Map<string, StudentListRow>(
          flattenedRows.map((row) => [
            `${row.enrollmentStudentId || row.studentId || row.profileId}-${row.classId}`,
            row,
          ])
        ).values()
        ).sort((a, b) => (getRowYearGroups(a)[0] || a.yearGroup).localeCompare(getRowYearGroups(b)[0] || b.yearGroup) || a.name.localeCompare(b.name));
    },
  });

  const yearOptions = useMemo(() => {
      return Array.from(new Set(students.flatMap((row) => getRowYearGroups(row))))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [students]);

  const filteredStudents = useMemo(() => {
    const q = nameFilter.trim().toLowerCase();
    const wantedSubjectClassLabel = preselectedSubjectClassLabel.trim().toLowerCase();
    return students.filter((row) => {
      const nameMatch = !q || row.name.toLowerCase().includes(q);
      const yearMatch =
        yearFilter === "all" ||
        getRowYearGroups(row).includes(yearFilter);
      const yearIdMatch =
        !yearIdFilter ||
        getRowYearIds(row).some((value) => String(value) === yearIdFilter);
      const classMatch =
        classFilters.length === 0 ||
        getRowClassFilterOptions(row).some((option) => classFilters.includes(option.value)) ||
        classFilters.includes(String((row as any).subjectClassId ?? row.classId)) ||
        classFilters.includes(String(row.classId));
      const subjectClassMatch =
        !wantedSubjectClassLabel ||
        getRowClassNames(row).some(
          (name) => name.trim().toLowerCase() === wantedSubjectClassLabel
        );
      const genderMatch =
        genderFilters.length === 0 || genderFilters.includes(row.gender);
      return (
        nameMatch &&
        yearMatch &&
        yearIdMatch &&
        classMatch &&
        subjectClassMatch &&
        genderMatch
      );
    });
  }, [
    students,
    nameFilter,
    yearFilter,
    yearIdFilter,
    classFilters,
    genderFilters,
    preselectedSubjectClassLabel,
  ]);

  const classOptions = useMemo(() => {
    const unique = Array.from(
      new Map(
        students
          .flatMap((row) =>
            getRowClassFilterOptions(row).length > 0
              ? getRowClassFilterOptions(row)
              : [{ value: String(row.subjectClassId ?? row.classId), label: row.className }]
          )
          .map((option) => [option.value, option.label])
      ).entries()
    );
    return unique
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }, [students]);

  const classTransferOptions = useMemo(() => {
    const unique = Array.from(
      new Map(
        students
          .filter((row) => Number.isFinite(Number(row.classId)) && Number(row.classId) > 0)
          .map((row) => [
            String(row.classId),
            `${row.className}${row.yearGroup ? ` (${row.yearGroup})` : ""}`,
          ])
      ).entries()
    );

    return unique
      .map(([value, label]) => ({ value: Number(value), label }))
      .sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }, [students]);

  const assignSubjectOptions = useMemo(() => {
    const normalized = subjects
      .map((subject) => {
        const value = Number(subject.id);
        const baseLabel = String(subject.name || "").replace(/islamiat/gi, "Islamic").trim();
        return {
          value,
          baseLabel,
        };
      })
      .filter((item) => Number.isFinite(item.value) && item.value > 0 && !!item.baseLabel);

    const duplicateCounts = new Map<string, number>();
    normalized.forEach((item) => {
      const key = item.baseLabel.toLowerCase();
      duplicateCounts.set(key, (duplicateCounts.get(key) || 0) + 1);
    });

    return normalized
      .map((item) => {
        const key = item.baseLabel.toLowerCase();
        const isDuplicateName = (duplicateCounts.get(key) || 0) > 1;
        return {
          label: isDuplicateName ? `${item.baseLabel} (#${item.value})` : item.baseLabel,
          value: item.value,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [subjects]);

  const { data: assignSubjectClasses = [] } = useQuery<SubjectClassOption[]>({
    queryKey: [
      "assign-subject-classes",
      assignDrawerOpen,
      addStudentOpen,
      !!editingStudent,
      subjects.map((subject) => Number(subject.id)).join(","),
    ],
    enabled: isSchoolAdmin && (assignDrawerOpen || addStudentOpen || !!editingStudent) && subjects.length > 0,
    queryFn: async () => {
      const rows = await Promise.all(
        subjects.map(async (subject) => {
          const subjectId = Number(subject.id);
          if (!Number.isFinite(subjectId) || subjectId <= 0) return [] as SubjectClassOption[];
          try {
            const items = await fetchSubjectClasses({ subject_id: subjectId });
            return (Array.isArray(items) ? items : [])
              .map((item: any) => ({
                id: Number(item.id),
                subjectId,
                name: String(item.name || `Class ${item.id}`),
                yearId: Number(item.year_id ?? 0),
                baseClassLabel: String(item.base_class_label || ""),
                linkedClassId: Number(
                  item.linked_class_id ??
                    item.linkedClassId ??
                    item.linkedClass?.id ??
                    item.linked_class?.id ??
                    item.classId ??
                    item.class_id_value ??
                    item.class_id ??
                    item.class?.class_id ??
                    item.classes?.class_id ??
                    item.base_class?.class_id ??
                    item.base_class_id ??
                    item.baseClassId ??
                    item.class?.id ??
                    item.classes?.id ??
                    item.base_class?.id ??
                    0
                ),
              }))
              .filter((item) => {
                // Exclude archived classes (is_active=0 or null). If is_active is absent
                // (old backend without the column), include the class (backward compat).
                const isActive = item.is_active === undefined || Number(item.is_active) === 1;
                return Number.isFinite(item.id) && item.id > 0 && isActive;
              });
          } catch {
            return [] as SubjectClassOption[];
          }
        })
      );

      return rows
        .flat()
        .filter((item) => Number.isFinite(item.id) && item.id > 0)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  const selectedStudents = useMemo(() => {
    const keySet = new Set(selectedRowKeys.map((key) => String(key)));
    return students.filter((row) => keySet.has(String(row.key)));
  }, [students, selectedRowKeys]);

  const filteredAssignSubjectClassOptions = useMemo(() => {
    const allowedSubjectIds = new Set(
      (Array.isArray(selectedAssignSubjectIds) ? selectedAssignSubjectIds : [])
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0)
    );

    const candidateItems = assignSubjectClasses.filter(
      (item) => allowedSubjectIds.size === 0 || allowedSubjectIds.has(Number(item.subjectId))
    );

    let finalItems: typeof candidateItems;

    const hasMultipleSubjectsSelected =
      Array.isArray(selectedAssignSubjectIds) && selectedAssignSubjectIds.length > 1;

    if (reassignMode || hasMultipleSubjectsSelected) {
      // Show ALL classes for the selected subject(s) — no year/class restriction
      finalItems = candidateItems;
    } else {
      const assignmentScopeRows =
        assignScope === "selected" && selectedStudents.length > 0
          ? selectedStudents
          : students;
      const scopedYearIds = Array.from(
        new Set(
          assignmentScopeRows
            .flatMap((row) => getRowYearIds(row))
            .filter((id) => Number.isFinite(id) && id > 0)
        )
      );
      const singleScopedYearId = scopedYearIds.length === 1 ? scopedYearIds[0] : 0;

      const scopedClassLabels = Array.from(
        new Set(
          assignmentScopeRows
            .flatMap((row) => getRowClassNames(row))
            .map((value) => normalizeClassLabel(value))
            .filter(Boolean)
        )
      );
      const singleScopedClassLabel = scopedClassLabels.length === 1 ? scopedClassLabels[0] : "";

      const exactMatches = candidateItems.filter((item) => {
        const yearMatches =
          !singleScopedYearId || Number(item.yearId) === Number(singleScopedYearId);
        const classMatches =
          !singleScopedClassLabel ||
          normalizeClassLabel(item.baseClassLabel || item.name) === singleScopedClassLabel;
        return yearMatches && classMatches;
      });

      const yearMatches = candidateItems.filter(
        (item) => !singleScopedYearId || Number(item.yearId) === Number(singleScopedYearId)
      );

      finalItems =
        exactMatches.length > 0
          ? exactMatches
          : yearMatches.length > 0
          ? yearMatches
          : candidateItems;
    }

    return finalItems
      .map((item) => {
        const subjectName =
          assignSubjectOptions.find((option) => Number(option.value) === Number(item.subjectId))?.label ||
          `Subject ${item.subjectId}`;
        const yearName =
          students.find((row) =>
            getRowYearIds(row).some(
              (yearId) => Number(yearId) === Number(item.yearId)
            )
          ) && getRowYearGroups(
            students.find((row) =>
              getRowYearIds(row).some((yearId) => Number(yearId) === Number(item.yearId))
            ) as Partial<StudentListRow>
          )[0] ||
          students.find((row) => Number(row.yearId) === Number(item.yearId))?.yearGroup ||
          (item.yearId > 0 ? `Year ${item.yearId}` : "No year");
        const detail = item.baseClassLabel ? `, ${item.baseClassLabel}` : "";
        return {
          label: `${subjectName} - ${item.name} (${yearName}${detail})`,
          value: item.id,
        };
      });
  }, [
    assignSubjectClasses,
    selectedAssignSubjectIds,
    assignSubjectOptions,
    selectedStudents,
    assignScope,
    reassignMode,
    students,
  ]);

  const assignPreviewRows = useMemo(() => {
    if (assignScope !== "selected") return [] as StudentListRow[];
    return selectedStudents;
  }, [assignScope, selectedStudents]);

  const buildStudentProfileHref = (record: StudentListRow) => {
    return `/dashboard/students/all-students/profile/${record.profileId}`;
  };

  const resetFilters = () => {
    setNameFilter("");
    setYearFilter("all");
    setYearIdFilter("");
    setClassFilters([]);
    setGenderFilters([]);
  };

  const pageTitle =
    isSubjectWorkspaceMode && activeSubject?.name
      ? `${displaySubjectName(activeSubject.name)} Students`
      : "All Students";

  const openAssignDrawer = () => {
    if (!isSchoolAdmin) {
      messageApi.warning("Only School Admin can assign students to subjects.");
      return;
    }
    setAssignScope(selectedRowKeys.length > 0 ? "selected" : "all_filtered");
    assignForm.resetFields();
    setReassignMode(false);
    setAssignFeatureAvailable(null);
    setAssignFeatureMessage("");
    setAssignDrawerOpen(true);
    void probeAssignFeature();
  };

  const openAssignForStudent = (record: StudentListRow) => {
    if (!isSchoolAdmin) {
      messageApi.warning("Only School Admin can assign students to subjects.");
      return;
    }
    setSelectedRowKeys([record.key]);
    setAssignScope("selected");
    assignForm.resetFields();
    setReassignMode(false);
    setAssignFeatureAvailable(null);
    setAssignFeatureMessage("");
    setAssignDrawerOpen(true);
    void probeAssignFeature();
  };

  const probeAssignFeature = async () => {
    const fallbackSubjectId = Number(subjects[0]?.id ?? 0);
    if (!fallbackSubjectId) {
      setAssignFeatureAvailable(false);
      setAssignFeatureMessage("No subjects are available yet for assignment.");
      return;
    }

    const result = await checkSubjectWorkspaceAvailability(fallbackSubjectId);
    setAssignFeatureAvailable(result.available);
    setAssignFeatureMessage(result.message || "");
  };

  const selectAllFiltered = () => {
    if (!isSchoolAdmin) return;
    setSelectedRowKeys(filteredStudents.map((row) => row.key));
    messageApi.success(`Selected ${filteredStudents.length} students (from current filters).`);
  };

  const restoreSelectedClassesFromList = async () => {
    if (!isSchoolAdmin) return;

    const selected = filteredStudents.filter((row) => new Set(selectedRowKeys).has(row.key));
    if (selected.length === 0) {
      messageApi.warning("Select at least one student first.");
      return;
    }

    setRestoreLoading(true);
    let restoredCount = 0;

    try {
      for (const row of selected) {
        const payload: Record<string, unknown> = {
          student_name: row.name,
          user_name: row.userName,
          email: row.email,
          class_id: row.classId,
          status: row.status,
          nationality: row.nationality || "",
          student_nationality: row.nationality || "",
          country: row.nationality || "",
          is_sen: row.isSen,
          sen_details: row.isSen ? String(row.senDetails || "").trim() : "",
          password: "",
        };

        if (row.genderRaw) {
          payload.gender = row.genderRaw;
          payload.student_gender = row.genderRaw;
          payload.sex = row.genderRaw;
          payload.student_sex = row.genderRaw;
        }

        const candidateIds = row.updateIds?.length ? row.updateIds : [row.studentId];
        const [firstId, ...fallbackIds] = candidateIds.filter(Boolean);
        if (!firstId) continue;

        try {
          await updateStudent(firstId, payload as any);
          restoredCount += 1;
        } catch {
          for (const fallbackId of fallbackIds) {
            try {
              await updateStudent(fallbackId, payload as any);
              restoredCount += 1;
              break;
            } catch {
              // try next fallback id
            }
          }
        }
      }

      if (restoredCount > 0) {
        messageApi.success(`Restored class for ${restoredCount} selected student${restoredCount === 1 ? "" : "s"}.`);
      } else {
        messageApi.warning("No selected students were restored.");
      }

      await queryClient.invalidateQueries({ queryKey: ["all-students-list"] });
      await queryClient.refetchQueries({ queryKey: ["all-students-list"], type: "active" });
    } catch (error: any) {
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to restore classes.");
    } finally {
      setRestoreLoading(false);
    }
  };

  const autoRestoreAllMisplaced = async () => {
    if (!isSchoolAdmin) {
      messageApi.warning("Only School Admin can restore classes.");
      return;
    }

    const confirmed = await Modal.confirm({
      title: "Auto-Restore All Misplaced Students",
      content: `This will restore ${students.length} students to their correct classes based on the All Students list. This process cannot be undone easily. Continue?`,
      okText: "Yes, Restore All",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
    });

    if (!confirmed) return;

    setRestoreLoading(true);
    let restoredCount = 0;

    try {
      for (const row of students) {
        const payload: Record<string, unknown> = {
          student_name: row.name,
          user_name: row.userName,
          email: row.email,
          class_id: row.classId,
          status: row.status,
          nationality: row.nationality || "",
          student_nationality: row.nationality || "",
          country: row.nationality || "",
          is_sen: row.isSen,
          sen_details: row.isSen ? String(row.senDetails || "").trim() : "",
          password: "",
        };

        if (row.genderRaw) {
          payload.gender = row.genderRaw;
          payload.student_gender = row.genderRaw;
          payload.sex = row.genderRaw;
          payload.student_sex = row.genderRaw;
        }

        const candidateIds = row.updateIds?.length ? row.updateIds : [row.studentId];
        const [firstId, ...fallbackIds] = candidateIds.filter(Boolean);
        if (!firstId) continue;

        try {
          await updateStudent(firstId, payload as any);
          restoredCount += 1;
        } catch {
          for (const fallbackId of fallbackIds) {
            try {
              await updateStudent(fallbackId, payload as any);
              restoredCount += 1;
              break;
            } catch {
              // try next fallback id
            }
          }
        }
      }

      messageApi.success(`Restored ${restoredCount} students to correct classes. All misplaced students should now be in the right places.`);
      await queryClient.invalidateQueries({ queryKey: ["all-students-list"] });
      await queryClient.refetchQueries({ queryKey: ["all-students-list"], type: "active" });
    } catch (error: any) {
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to auto-restore students.");
    } finally {
      setRestoreLoading(false);
    }
  };

  const submitAssign = async () => {
    if (!isSchoolAdmin) return;
    if (assignFeatureAvailable === false) {
      messageApi.error(assignFeatureMessage || "Student-to-subject assignment is not available.");
      return;
    }
    const values = await assignForm.validateFields();
    let subjectIds: number[] = Array.from(
      new Set(
        (Array.isArray(values.subject_ids) ? values.subject_ids : [])
          .map((id: unknown) => Number(id))
          .filter((id: number) => Number.isFinite(id) && id > 0)
      )
    );
    const selectedSubjectClassIds = Array.from(
      new Set(
        (Array.isArray(values.subject_class_id)
          ? values.subject_class_id
          : [values.subject_class_id]
        )
          .map((id: unknown) => Number(id))
          .filter((id: number) => Number.isFinite(id) && id > 0)
      )
    );
    const subjectClassIds = selectedSubjectClassIds;
    if (subjectIds.length === 0 && subjectClassIds.length === 0) {
      messageApi.warning("Please choose at least one subject or class.");
      return;
    }

    const targetRows =
      assignScope === "selected"
        ? filteredStudents.filter((row) => new Set(selectedRowKeys).has(row.key))
        : filteredStudents;

    const studentIds: number[] = Array.from(
      new Set(
        targetRows
          .map((row) => Number(row.enrollmentStudentId || row.studentId || row.profileId))
          .filter((id) => Number.isFinite(id) && id > 0)
      )
    );
    if (studentIds.length === 0) {
      messageApi.warning("No students selected.");
      return;
    }

    let selectedSubjectClassNames: string[] = [];
    let allowCrossClassAssign = false;

    if (selectedSubjectClassIds.length > 0) {
      const selectedSubjectClasses = selectedSubjectClassIds
        .map((id) => assignSubjectClasses.find((item) => Number(item.id) === Number(id)))
        .filter((item): item is SubjectClassOption => Boolean(item));

      if (selectedSubjectClasses.length !== selectedSubjectClassIds.length) {
        messageApi.error("One or more selected subject classes are no longer available.");
        return;
      }

      selectedSubjectClassNames = selectedSubjectClasses
        .map((item) => String(item.name || "").trim())
        .filter(Boolean);

      allowCrossClassAssign =
        selectedSubjectClasses.some((selectedSubjectClass) => {
          const mismatchedRows = targetRows.filter((row) => {
            const yearMismatch =
              Number(selectedSubjectClass.yearId) > 0 &&
              Number(row.yearId) > 0 &&
              Number(row.yearId) !== Number(selectedSubjectClass.yearId);
            const classMismatch =
              selectedSubjectClass.baseClassLabel &&
              normalizeClassLabel(row.className) !==
                normalizeClassLabel(selectedSubjectClass.baseClassLabel);
            return yearMismatch || classMismatch;
          });

          return mismatchedRows.length > 0;
        }) && !reassignMode;

      // When a specific class is chosen, infer its subject from the class itself.
      subjectIds = [];
    }

    setAssignLoading(true);
    try {
      await assignStudentsToSubjects({
        subjectIds,
        studentIds,
        subjects: subjects.map((subject) => ({
          id: Number(subject.id),
          name: displaySubjectName(subject.name),
        })),
        subjectClassIds,
        forceReassign: reassignMode,
        allowCrossClass: allowCrossClassAssign,
      });

      if (subjectClassIds.length > 0) {
        const actionLabel = reassignMode ? "Reassigned" : "Assigned";
        const classLabel =
          selectedSubjectClassNames.length === 0
            ? " the selected class"
            : selectedSubjectClassNames.length === 1
            ? ` class ${selectedSubjectClassNames[0]}`
            : ` ${selectedSubjectClassNames.length} classes`;
        messageApi.success(
          `${actionLabel} ${studentIds.length} student${studentIds.length === 1 ? "" : "s"} to${classLabel}.`
        );
      } else {
        messageApi.success(
          `Assigned ${studentIds.length} student${studentIds.length === 1 ? "" : "s"} to ${subjectIds.length} subject${subjectIds.length === 1 ? "" : "s"}.`
        );
      }
      setAssignDrawerOpen(false);
      setSelectedRowKeys([]);
      await queryClient.invalidateQueries({ queryKey: ["all-students-list"] });
    } catch (error: any) {
      messageApi.error(error?.response?.data?.msg || error?.message || "Failed to assign students.");
    } finally {
      setAssignLoading(false);
    }
  };

  const editMutation = useMutation({
    mutationFn: async (values: {
      student_name?: string;
      user_name?: string;
      email?: string;
      class_id?: number | string;
      status?: "active" | "inactive" | "suspended";
      gender?: "male" | "female";
      nationality?: string;
      is_sen?: boolean;
      sen_details?: string;
      password?: string;
    }) => {
      if (!canEdit) {
        throw new Error("Only School Admin can edit student information.");
      }
      if (!editingStudent) return;
      const nextName = values.student_name?.trim() || editingStudent.name;
      const nextUserName = values.user_name?.trim() || editingStudent.userName;
      const nextEmail = values.email?.trim() || editingStudent.email || "";
      const nextNationality =
        values.nationality != null
          ? String(values.nationality).trim()
          : editingStudent.nationality || "";
      const nextClassId =
        values.class_id != null && Number.isFinite(Number(values.class_id))
          ? Number(values.class_id)
          : editingStudent.classId;
      const nextIsSen =
        values.is_sen != null ? Boolean(values.is_sen) : editingStudent.isSen;
      const nextSenDetails = nextIsSen
        ? String(values.sen_details ?? editingStudent.senDetails ?? "").trim()
        : "";
      const nextStatus = values.status || editingStudent.status || "active";
      const nextGender = normalizeGenderRaw(values.gender ?? editingStudent.genderRaw);

      const payload: Record<string, unknown> = {
        student_name: nextName,
        user_name: nextUserName,
        email: nextEmail,
        class_id: nextClassId,
        status: nextStatus,
        nationality: nextNationality,
        student_nationality: nextNationality,
        country: nextNationality,
        is_sen: nextIsSen,
        sen_details: nextSenDetails,
        // Backend currently expects password key to always exist on update.
        password: values.password?.trim() || "",
      };
      if (nextGender) {
        payload.gender = nextGender;
        payload.student_gender = nextGender;
        payload.sex = nextGender;
        payload.student_sex = nextGender;
      }

      const candidateIds = editingStudent.updateIds?.length
        ? editingStudent.updateIds
        : [editingStudent.studentId];
      const [firstId, ...fallbackIds] = candidateIds.filter(Boolean);
      if (!firstId) {
        throw new Error("Missing student id for update.");
      }

      try {
        return await updateStudent(firstId, payload as any);
      } catch (firstError) {
        for (const id of fallbackIds) {
          try {
            return await updateStudent(id, payload as any);
          } catch {
            // try next id
          }
        }
        throw firstError;
      }
    },
    onSuccess: async (_data, values) => {
      if (editingStudent) {
        const nextIsSen =
          values.is_sen != null ? Boolean(values.is_sen) : editingStudent.isSen;
        const nextSenDetails = nextIsSen
          ? String(values.sen_details ?? editingStudent.senDetails ?? "").trim()
          : "";
        writeStudentProfileOverride(
          [editingStudent.profileId, ...(editingStudent.updateIds || []), editingStudent.studentId],
          {
            isSen: nextIsSen,
            senDetails: nextSenDetails,
          }
        );
      }
      messageApi.success("Student updated successfully.");
      setEditingStudent(null);
      editForm.resetFields();
      await queryClient.invalidateQueries({
        queryKey: ["all-students-list"],
      });
      await queryClient.refetchQueries({
        queryKey: ["all-students-list"],
        type: "active",
      });
    },
    onError: (error: unknown) => {
      const message =
        (error as { message?: string })?.message?.trim() || "Failed to update student.";
      messageApi.error(message);
    },
  });

  const bulkEditMutation = useMutation({
    mutationFn: async (
      values: Array<{
        student_name?: string;
        user_name?: string;
        email?: string;
        class_id?: number | string;
        status?: "active" | "inactive" | "suspended";
        gender?: "male" | "female";
        nationality?: string;
        is_sen?: boolean;
        sen_details?: string;
        password?: string;
      }>
    ) => {
      if (!canEdit) {
        throw new Error("Only School Admin can edit student information.");
      }
      if (!editingStudents.length) {
        throw new Error("No students selected for bulk edit.");
      }

      let successCount = 0;
      let failedCount = 0;
      let firstErrorMessage = "";

      for (let index = 0; index < editingStudents.length; index += 1) {
        const student = editingStudents[index];
        const rowValues = values[index] || {};

        const nextName = rowValues.student_name?.trim() || student.name;
        const nextUserName = rowValues.user_name?.trim() || student.userName;
        const nextEmail = rowValues.email?.trim() || student.email || "";
        const nextNationality =
          rowValues.nationality != null
            ? String(rowValues.nationality).trim()
            : student.nationality || "";
        const nextClassId =
          rowValues.class_id != null && Number.isFinite(Number(rowValues.class_id))
            ? Number(rowValues.class_id)
            : student.classId;
        const nextIsSen =
          rowValues.is_sen != null ? Boolean(rowValues.is_sen) : student.isSen;
        const nextSenDetails = nextIsSen
          ? String(rowValues.sen_details ?? student.senDetails ?? "").trim()
          : "";
        const nextStatus = rowValues.status || student.status || "active";
        const nextGender = normalizeGenderRaw(rowValues.gender ?? student.genderRaw);

        const payload: Record<string, unknown> = {
          student_name: nextName,
          user_name: nextUserName,
          email: nextEmail,
          class_id: nextClassId,
          status: nextStatus,
          nationality: nextNationality,
          student_nationality: nextNationality,
          country: nextNationality,
          is_sen: nextIsSen,
          sen_details: nextSenDetails,
          password: rowValues.password?.trim() || "",
        };
        if (nextGender) {
          payload.gender = nextGender;
          payload.student_gender = nextGender;
          payload.sex = nextGender;
          payload.student_sex = nextGender;
        }

        const candidateIds = student.updateIds?.length ? student.updateIds : [student.studentId];
        const [firstId, ...fallbackIds] = candidateIds.filter(Boolean);

        if (!firstId) {
          failedCount += 1;
          if (!firstErrorMessage) {
            firstErrorMessage = `Missing student id for ${student.name}.`;
          }
          continue;
        }

        try {
          await updateStudent(firstId, payload as any);
          successCount += 1;
        } catch (firstError: any) {
          let updated = false;
          for (const fallbackId of fallbackIds) {
            try {
              await updateStudent(fallbackId, payload as any);
              successCount += 1;
              updated = true;
              break;
            } catch {
              // try next fallback id
            }
          }

          if (!updated) {
            failedCount += 1;
            if (!firstErrorMessage) {
              firstErrorMessage =
                firstError?.response?.data?.msg ||
                firstError?.response?.data?.message ||
                firstError?.message ||
                `Failed to update ${student.name}.`;
            }
          }
        }
      }

      return { successCount, failedCount, firstErrorMessage };
    },
    onSuccess: async ({ successCount, failedCount, firstErrorMessage }) => {
      editingStudents.forEach((student, index) => {
        const rowValues = editForm.getFieldValue(["students", index]) || {};
        const nextIsSen =
          rowValues.is_sen != null ? Boolean(rowValues.is_sen) : student.isSen;
        const nextSenDetails = nextIsSen
          ? String(rowValues.sen_details ?? student.senDetails ?? "").trim()
          : "";
        writeStudentProfileOverride(
          [student.profileId, ...(student.updateIds || []), student.studentId],
          {
            isSen: nextIsSen,
            senDetails: nextSenDetails,
          }
        );
      });

      if (failedCount === 0) {
        messageApi.success(`Updated ${successCount} student${successCount === 1 ? "" : "s"} successfully.`);
      } else if (successCount > 0) {
        messageApi.warning(
          `Updated ${successCount} student${successCount === 1 ? "" : "s"}; ${failedCount} failed.${
            firstErrorMessage ? ` ${firstErrorMessage}` : ""
          }`
        );
      } else {
        messageApi.error(firstErrorMessage || "Failed to update selected students.");
      }

      setEditingStudents([]);
      setSelectedRowKeys([]);
      editForm.resetFields();
      await queryClient.invalidateQueries({ queryKey: ["all-students-list"] });
      await queryClient.refetchQueries({ queryKey: ["all-students-list"], type: "active" });
    },
    onError: (error: unknown) => {
      const msg =
        (error as { message?: string })?.message?.trim() ||
        "Failed to update selected students.";
      messageApi.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (student: StudentListRow) => {
      if (!canEdit) throw new Error("Only School Admin can delete students.");
      return deleteStudent(student.studentId);
    },
    onSuccess: async () => {
      messageApi.success("Student deleted successfully.");
      setDeletingStudent(null);
      setDeleteConfirmText("");
      await queryClient.invalidateQueries({ queryKey: ["all-students-list"] });
      await queryClient.refetchQueries({ queryKey: ["all-students-list"], type: "active" });
    },
    onError: (error: unknown) => {
      const msg = (error as { message?: string })?.message?.trim() || "Failed to delete student.";
      messageApi.error(msg);
    },
  });

  const handleAddStudents = async () => {
    if (!canEdit) {
      messageApi.warning("Only School Admin can add students.");
      return;
    }
    let values: { students?: Array<Record<string, unknown>> };
    try {
      values = await addForm.validateFields();
    } catch {
      return;
    }
    const rows = Array.isArray(values?.students) ? values.students : [];
    const payloadRows = rows
      .filter((row) => row && row.student_name && row.user_name && row.password)
      .map((row) => {
        const selectedSubjectIds = Array.from(
          new Set(
            (Array.isArray(row.subject_ids) ? row.subject_ids : [])
              .map((id) => Number(id))
              .filter((id) => Number.isFinite(id) && id > 0)
          )
        );

        const selectedSubjectClassIds = Array.from(
          new Set(
            (
              Array.isArray(row.class_ids)
                ? row.class_ids
                : Array.isArray(row.subject_class_ids)
                ? row.subject_class_ids
                : []
            )
              .map((id) => Number(id))
              .filter((id) => Number.isFinite(id) && id > 0)
          )
        );

        /* Use the subject-class id itself as the class_id fallback.
           The backend addStudent accepts class_id for base-class placement,
           but subject-class enrollment is handled separately via
           assignStudentsToSubjects → enrollStudentsToSubjectClass. */
        const resolvedClassId = Number(
          selectedSubjectClassIds[0] ?? row.class_id ?? 0
        );

        return {
          payload: {
            student_name: String(row.student_name).trim(),
            user_name: String(row.user_name).trim(),
            email: row.email ? String(row.email).trim() : "",
            password: String(row.password),
            class_id: resolvedClassId,
            subject_class_id: selectedSubjectClassIds.length > 0 ? selectedSubjectClassIds[0] : undefined,
            status: String(row.status || "active"),
            gender: row.gender ? String(row.gender) : undefined,
            student_gender: row.gender ? String(row.gender) : undefined,
            nationality: row.nationality ? String(row.nationality).trim() : undefined,
            is_sen: !!row.is_sen,
            sen_details: row.is_sen && row.sen_details ? String(row.sen_details).trim() : "",
          },
          subjectIds: selectedSubjectIds,
          subjectClassIds: selectedSubjectClassIds,
          classId: resolvedClassId,
        };
      });

    if (payloadRows.length === 0) {
      messageApi.warning("Please fill in at least one student.");
      return;
    }

    const subjectId = scopedSubjectId > 0 ? scopedSubjectId : null;

    let successCount = 0;
    let failedCount = 0;
    let assignmentWarningCount = 0;
    let firstErrorMessage = "";
    setAddSubmitting(true);
    for (const row of payloadRows) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const added = await addStudent(row.payload, subjectId);
        successCount += 1;

        if (row.subjectIds.length > 0 || row.subjectClassIds.length > 0) {
          const createdStudentId = Number(
            (added as any)?.id ??
              (added as any)?.student_id ??
              (added as any)?.studentId ??
              (added as any)?.data?.id ??
              (added as any)?.data?.student_id ??
              0
          );

          if (!Number.isFinite(createdStudentId) || createdStudentId <= 0) {
            assignmentWarningCount += 1;
            continue;
          }

          try {
            // eslint-disable-next-line no-await-in-loop
            await assignStudentsToSubjects({
              subjectIds: row.subjectIds,
              studentIds: [createdStudentId],
              subjects: subjects.map((subject) => ({
                id: Number(subject.id),
                name: displaySubjectName(subject.name),
              })),
              subjectClassIds: row.subjectClassIds,
              forceReassign: false,
              allowCrossClass: true,
            });
          } catch {
            assignmentWarningCount += 1;
          }
        }
      } catch (error: unknown) {
        failedCount += 1;
        if (!firstErrorMessage) {
          firstErrorMessage =
            (error as { message?: string })?.message?.trim() ||
            "Failed to add one or more students.";
        }
      }
    }
    setAddSubmitting(false);

    if (successCount > 0) {
      await queryClient.invalidateQueries({ queryKey: ["all-students-list"] });
      await queryClient.refetchQueries({ queryKey: ["all-students-list"], type: "active" });
      setAddStudentOpen(false);
      addForm.resetFields();
    }
    if (failedCount === 0 && assignmentWarningCount === 0) {
      messageApi.success(`Added ${successCount} student${successCount === 1 ? "" : "s"} successfully.`);
    } else if (failedCount === 0 && assignmentWarningCount > 0) {
      messageApi.warning(
        `Added ${successCount} student${successCount === 1 ? "" : "s"}; subject assignment pending for ${assignmentWarningCount}.`
      );
    } else if (successCount > 0) {
      messageApi.warning(
        `Added ${successCount} student${successCount === 1 ? "" : "s"}, ${failedCount} failed${
          assignmentWarningCount > 0 ? `, ${assignmentWarningCount} assignment warning${assignmentWarningCount === 1 ? "" : "s"}` : ""
        }.`
      );
    } else {
      messageApi.error(firstErrorMessage || "Failed to add students.");
    }
  };

  const openEdit = (record: StudentListRow) => {
    if (!canEdit) {
      messageApi.warning("Only School Admin can edit student information.");
      return;
    }

    if (selectedRowKeys.length > 1) {
      openBulkEdit();
      return;
    }

    setEditingStudents([]);
    setEditingStudent(record);
    editForm.setFieldsValue({
      student_name: record.name,
      user_name: record.userName,
      email: record.email,
      class_id: record.classId,
      subject_ids: record.subjectIds?.filter((id) => Number.isFinite(id) && id > 0) || [],
      class_ids: [],
      status: record.status,
      gender: record.genderRaw || undefined,
      nationality: record.nationality || "",
      is_sen: record.isSen,
      sen_details: record.senDetails || "",
      password: "",
    });

    const candidateProfileIds = Array.from(
      new Set([record.profileId, ...(record.updateIds || []), record.studentId].filter(Boolean))
    );

    void (async () => {
      for (const candidateId of candidateProfileIds) {
        try {
          const profile = (await fetchStudentProfileData(
            candidateId,
            isSubjectWorkspaceMode ? Number(scopedSubjectId) : undefined
          )) as Record<string, unknown> | null;

          if (!profile || typeof profile !== "object") {
            continue;
          }

          const nextNationality = String(
            profile.nationality ??
              profile.student_nationality ??
              profile.studentNationality ??
              profile.country ??
              profile.citizenship ??
              record.nationality ??
              ""
          ).trim();
          const nextIsSen = Boolean(profile.is_sen ?? profile.isSen ?? record.isSen);
          const override = readStudentProfileOverride([candidateId, record.profileId, ...(record.updateIds || [])]);
          const nextSenDetails = String(
            typeof override?.senDetails === "string"
              ? override.senDetails
              : profile.sen_details ?? profile.senDetails ?? record.senDetails ?? ""
          ).trim();
          const resolvedIsSen =
            typeof override?.isSen === "boolean" ? override.isSen : nextIsSen;
          const nextGender = normalizeGenderRaw(
            profile.gender ??
              profile.student_gender ??
              profile.sex ??
              profile.student_sex ??
              profile.studentGender ??
              profile.studentSex ??
              record.genderRaw
          );

          const hydratedRecord: StudentListRow = {
            ...record,
            name: String(profile.student_name ?? profile.name ?? record.name),
            userName: String(profile.user_name ?? profile.username ?? record.userName),
            email: String(profile.email ?? record.email),
            nationality: nextNationality,
            isSen: resolvedIsSen,
            senDetails: nextSenDetails,
            gender: nextGender === "male" ? "Male" : nextGender === "female" ? "Female" : "Unknown",
            genderRaw: nextGender,
            status: String(profile.status ?? record.status).toLowerCase() as
              | "active"
              | "inactive"
              | "suspended",
          };

          setEditingStudent(hydratedRecord);
          editForm.setFieldsValue({
            student_name: hydratedRecord.name,
            user_name: hydratedRecord.userName,
            email: hydratedRecord.email,
            class_id: hydratedRecord.classId,
            subject_ids: hydratedRecord.subjectIds?.filter((id) => Number.isFinite(id) && id > 0) || [],
            class_ids: [],
            status: hydratedRecord.status,
            gender: hydratedRecord.genderRaw || undefined,
            nationality: hydratedRecord.nationality || "",
            is_sen: hydratedRecord.isSen,
            sen_details: hydratedRecord.senDetails || "",
            password: "",
          });
          return;
        } catch {
          // Try the next candidate id.
        }
      }
    })();
  };

  const openBulkEdit = () => {
    if (!canEdit) {
      messageApi.warning("Only School Admin can edit student information.");
      return;
    }

    if (selectedStudents.length === 0) {
      messageApi.warning("Select at least one student first.");
      return;
    }

    setEditingStudent(null);
    setEditingStudents(selectedStudents);
    editForm.setFieldsValue({
      students: selectedStudents.map((student) => ({
        student_name: student.name,
        user_name: student.userName,
        email: student.email,
        class_id: student.classId,
        status: student.status,
        gender: student.genderRaw || undefined,
        nationality: student.nationality || "",
        is_sen: student.isSen,
        sen_details: student.senDetails || "",
        password: "",
      })),
    });
  };

  const handleSaveEdit = async () => {
    if (!canEdit) {
      messageApi.warning("Only School Admin can edit student information.");
      return;
    }
    try {
      if (editingStudents.length > 0) {
        const values = await editForm.validateFields();
        const rows = Array.isArray(values?.students) ? values.students : [];
        bulkEditMutation.mutate(rows);
        return;
      }

      const values = await editForm.validateFields();

      /* Resolve class_id from subject class selection, like Add Students flow. */
      const selectedSubjectClassIds = Array.from(
        new Set(
          (Array.isArray(values.class_ids) ? values.class_ids : [])
            .map((id: unknown) => Number(id))
            .filter((id: number) => Number.isFinite(id) && id > 0)
        )
      );
      if (selectedSubjectClassIds.length > 0) {
        values.class_id = selectedSubjectClassIds[0];
      }

      editMutation.mutate(values, {
        onSuccess: async () => {
          /* After update, sync subject assignments if subjects/classes were selected. */
          const editSubjectIds = Array.from(
            new Set(
              (Array.isArray(values.subject_ids) ? values.subject_ids : [])
                .map((id: unknown) => Number(id))
                .filter((id: number) => Number.isFinite(id) && id > 0)
            )
          );
          if ((editSubjectIds.length > 0 || selectedSubjectClassIds.length > 0) && editingStudent) {
            const studentId = Number(
              editingStudent.studentId || editingStudent.profileId
            );
            if (Number.isFinite(studentId) && studentId > 0) {
              try {
                await assignStudentsToSubjects({
                  subjectIds: editSubjectIds,
                  studentIds: [studentId],
                  subjects: subjects.map((s) => ({ id: Number(s.id), name: displaySubjectName(s.name) })),
                  subjectClassIds: selectedSubjectClassIds,
                  forceReassign: false,
                  allowCrossClass: true,
                });
              } catch {
                messageApi.warning("Student updated but subject assignment may need manual sync.");
              }
            }
          }
        },
      });
    } catch {
      // validation message handled by antd
    }
  };

  if (!canView) {
    return (
      <div className="p-6">
        <Card>
          <Typography.Text>You do not have access to this page.</Typography.Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>{pageTitle}</span> },
        ]}
        className="mb-4"
      />

      <Card className="border border-[#D6EFE2] mb-4">
        <Typography.Title level={3} className="!mb-1">
          {pageTitle}
        </Typography.Title>
        <Typography.Text className="text-gray-500">
          View and filter students by name, year group, class, and gender.
        </Typography.Text>
        {yearIdFilter && (
          <Typography.Text className="block text-emerald-700 text-sm mt-1">
            Year filter applied from previous page.
          </Typography.Text>
        )}
        {classFilters.length > 0 && (
          <Typography.Text className="block text-emerald-700 text-sm mt-1">
            Class filter applied from previous page.
          </Typography.Text>
        )}
      </Card>

      <Card className="border border-[#D6EFE2]">
        <Space wrap size={12} className="mb-4">
          <Input
            placeholder="Search by student name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />

          <Select
            value={yearFilter}
            onChange={(value) => setYearFilter(value)}
            style={{ width: 220 }}
            options={[
              { label: "All Year Groups", value: "all" },
              ...yearOptions.map((year) => ({ label: year, value: year })),
            ]}
          />

          <Select
            mode="multiple"
            value={classFilters}
            onChange={(value) => setClassFilters(value)}
            style={{ width: 280 }}
            placeholder="Filter by class (multi-select)"
            options={classOptions}
            maxTagCount="responsive"
            allowClear
          />

          <Select
            mode="multiple"
            value={genderFilters}
            onChange={(value) =>
              setGenderFilters(value as Array<"Male" | "Female" | "Unknown">)
            }
            style={{ width: 260 }}
            placeholder="Filter by gender (multi-select)"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Unknown", value: "Unknown" },
            ]}
            maxTagCount="responsive"
            allowClear
          />

          <Button onClick={resetFilters}>Reset Filters</Button>
          {isSchoolAdmin && (
            <>
              <Button
                type="primary"
                style={{ backgroundColor: "#16a34a", borderColor: "#16a34a" }}
                onClick={() => { addForm.resetFields(); setAddStudentOpen(true); }}
              >
                + Add Student
              </Button>
              <Button onClick={() => setSelectedRowKeys([])} disabled={selectedRowKeys.length === 0}>
                Clear selection ({selectedRowKeys.length})
              </Button>
              <Button onClick={selectAllFiltered} disabled={filteredStudents.length === 0}>
                Select all (filtered) ({filteredStudents.length})
              </Button>
              <Button onClick={openBulkEdit} disabled={selectedRowKeys.length === 0}>
                Edit selected ({selectedRowKeys.length})
              </Button>
            </>
          )}
        </Space>

        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Typography.Text type="danger">
            Failed to load students. Please try again.
          </Typography.Text>
        ) : (
          <>
            <Typography.Text className="block text-gray-500 mb-3">
              Showing {filteredStudents.length} of {students.length} students
            </Typography.Text>
            <Table<StudentListRow>
              rowKey="key"
              dataSource={filteredStudents}
              pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              rowSelection={
                isSchoolAdmin
                  ? {
                      selectedRowKeys,
                      onChange: (keys) => setSelectedRowKeys(keys),
                    }
                  : undefined
              }
              columns={[
                {
                  title: "Student Name",
                  dataIndex: "name",
                  key: "name",
                  render: (_: unknown, record: StudentListRow) => (
                    <Link
                      href={buildStudentProfileHref(record)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {record.name}
                    </Link>
                  ),
                },
                {
                  title: "Year Group",
                  dataIndex: "yearGroup",
                  key: "yearGroup",
                  render: (_: unknown, record: StudentListRow) => {
                    const values = getRowYearGroups(record);
                    return (
                      <Space size={[4, 4]} wrap>
                        {values.map((value) => (
                          <Tag key={value}>{value}</Tag>
                        ))}
                      </Space>
                    );
                  },
                },
                {
                  title: "Class",
                  dataIndex: "className",
                  key: "className",
                  render: (_: unknown, record: StudentListRow) => {
                    const values = getRowClassNames(record);
                    return (
                      <Space size={[4, 4]} wrap>
                        {values.map((value) => (
                          <Tag key={value}>{value}</Tag>
                        ))}
                      </Space>
                    );
                  },
                },
                {
                  title: "Subjects",
                  dataIndex: "subjectNames",
                  key: "subjectNames",
                  render: (value: string[]) => {
                    if (!Array.isArray(value) || value.length === 0) return <Tag>Not linked</Tag>;
                    return (
                      <Space size={[4, 4]} wrap>
                        {value.map((name) => (
                          <Tag key={name}>{name}</Tag>
                        ))}
                      </Space>
                    );
                  },
                },
                {
                  title: "Gender",
                  dataIndex: "gender",
                  key: "gender",
                  render: (value: StudentListRow["gender"]) => {
                    if (value === "Male") return <Tag color="blue">Male</Tag>;
                    if (value === "Female") return <Tag color="magenta">Female</Tag>;
                    return <Tag>Unknown</Tag>;
                  },
                },
                {
                  title: "Action",
                  key: "action",
                  render: (_: unknown, record: StudentListRow) => (
                    <Space size={8}>
                      <Link
                        href={buildStudentProfileHref(record)}
                      >
                        <Button
                          size="small"
                          style={{
                            backgroundColor: "#d4af37",
                            borderColor: "#d4af37",
                            color: "#fff",
                          }}
                        >
                          View
                        </Button>
                      </Link>
                      {canEdit ? (
                        <>
                          <Button
                            size="small"
                            style={{
                              backgroundColor: "#fde2e2",
                              borderColor: "#f5b5b5",
                              color: "#b42318",
                            }}
                            onClick={() => openAssignForStudent(record)}
                          >
                            Assign
                          </Button>
                          <Button size="small" onClick={() => openEdit(record)}>
                            Edit
                          </Button>
                          <Button
                            size="small"
                            danger
                            onClick={() => setDeletingStudent(record)}
                          >
                            Delet
                          </Button>
                        </>
                      ) : null}
                    </Space>
                  ),
                },
              ]}
            />
          </>
        )}
      </Card>

      {isSchoolAdmin && (
        <Drawer
          title="Assign selected students to one or more subjects"
          open={assignDrawerOpen}
          onClose={() => setAssignDrawerOpen(false)}
          width={420}
          destroyOnClose
        >
          <Form layout="vertical" form={assignForm} initialValues={{ scope: assignScope }}>
            {assignFeatureAvailable === false && assignFeatureMessage ? (
              <Alert
                className="mb-4"
                type="warning"
                showIcon
                message="Assignment unavailable"
                description={assignFeatureMessage}
              />
            ) : null}

            {assignPreviewRows.length > 0 ? (
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Typography.Title level={5} className="!mb-3">
                  Current Assignments
                </Typography.Title>
                <div className="space-y-3">
                  {assignPreviewRows.map((student) => (
                    <div key={student.key} className="rounded-lg border border-slate-200 bg-white p-3">
                      <div className="text-sm font-semibold text-slate-800">{student.name}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {student.currentAssignments.length > 0 ? (
                          student.currentAssignments.map((assignment) => (
                            <Tag key={`${student.key}-${assignment.subjectId || assignment.subjectName}-${assignment.subjectClassId || assignment.subjectClassName}`} color="blue">
                              {assignment.subjectName} - {assignment.subjectClassName}
                              {assignment.baseClassLabel && assignment.baseClassLabel !== assignment.subjectClassName
                                ? ` (${assignment.baseClassLabel})`
                                : ""}
                            </Tag>
                          ))
                        ) : (
                          <Tag>Not linked</Tag>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : assignScope !== "selected" ? (
              <Alert
                className="mb-4"
                type="info"
                showIcon
                message="Current assignments preview"
                description="Current subject/class details are shown when you assign selected students."
              />
            ) : null}

            <Form.Item label="Assign scope">
              <Radio.Group value={assignScope} onChange={(e) => setAssignScope(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="selected" disabled={selectedRowKeys.length === 0}>
                    Selected only ({selectedRowKeys.length})
                  </Radio>
                  <Radio value="all_filtered">
                    All in current filters ({filteredStudents.length})
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="subject_ids"
              label="Subjects"
            >
              <Select
                mode="multiple"
                showSearch
                optionFilterProp="label"
                placeholder="Select one or more subjects"
                options={assignSubjectOptions}
                maxTagCount="responsive"
              />
            </Form.Item>

            <Form.Item name="subject_class_id" label="Existing Class">
              <Select
                mode="multiple"
                showSearch
                optionFilterProp="label"
                placeholder="Select one or more existing subject classes"
                options={filteredAssignSubjectClassOptions}
                allowClear
                maxTagCount="responsive"
              />
            </Form.Item>

            <Checkbox
              checked={reassignMode}
              onChange={(e) => {
                setReassignMode(e.target.checked);
                assignForm.setFieldValue("subject_class_id", []);
              }}
              className="mb-4"
            >
              Move to a different class (show all classes)
            </Checkbox>

            <Typography.Text type="secondary" className="block mb-4">
              {reassignMode
                ? "Reassign mode: select any class to move the student(s). Their old enrollment in the same subject will be deactivated."
                : "You can now assign students to any existing subject class. If you choose only a subject and no class, the system will still use that subject\u0027s default class."}
            </Typography.Text>

            <Space>
              <Button onClick={() => setAssignDrawerOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                loading={assignLoading || assignFeatureAvailable === null}
                disabled={assignFeatureAvailable === false}
                onClick={submitAssign}
              >
                {reassignMode ? "Reassign" : "Assign"}
              </Button>
            </Space>
          </Form>
        </Drawer>
      )}

      <Modal
        title={
          editingStudents.length > 0
            ? `Edit Selected Students (${editingStudents.length})`
            : `Edit Student${editingStudent ? `: ${editingStudent.name}` : ""}`
        }
        open={!!editingStudent || editingStudents.length > 0}
        onCancel={() => {
          setEditingStudent(null);
          setEditingStudents([]);
          editForm.resetFields();
        }}
        onOk={handleSaveEdit}
        confirmLoading={editMutation.isPending || bulkEditMutation.isPending}
        okText="Save"
        width={editingStudents.length > 0 ? 860 : 620}
      >
        <Form form={editForm} layout="vertical">
          {editingStudents.length > 0 ? (
            <Form.List name="students">
              {(fields) => (
                <Space direction="vertical" size={16} className="w-full">
                  {fields.map((field, index) => {
                    const currentStudent = editingStudents[index];
                    return (
                      <div
                        key={field.key}
                        className="rounded-lg border border-[#D6EFE2] p-4"
                      >
                        <Typography.Text strong className="block mb-3">
                          {currentStudent?.name || `Student ${index + 1}`}
                        </Typography.Text>

                        <Form.Item name={[field.name, "student_name"]} label="Student Name">
                          <Input />
                        </Form.Item>

                        <Form.Item name={[field.name, "user_name"]} label="Username">
                          <Input />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, "email"]}
                          label="Email"
                          rules={[{ type: "email", message: "Please enter a valid email" }]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item name={[field.name, "class_id"]} label="Class">
                          <Select
                            showSearch
                            optionFilterProp="label"
                            options={classTransferOptions}
                            placeholder="Select class"
                          />
                        </Form.Item>

                        <Form.Item name={[field.name, "status"]} label="Status">
                          <Select
                            allowClear
                            options={[
                              { label: "Active", value: "active" },
                              { label: "Inactive", value: "inactive" },
                              { label: "Suspended", value: "suspended" },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item name={[field.name, "gender"]} label="Gender">
                          <Select
                            allowClear
                            options={[
                              { label: "Male", value: "male" },
                              { label: "Female", value: "female" },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item name={[field.name, "nationality"]} label="Nationality">
                          <Input placeholder="e.g. British, Emirati, Egyptian" />
                        </Form.Item>

                        <Form.Item name={[field.name, "is_sen"]} valuePropName="checked">
                          <Checkbox>SEN student</Checkbox>
                        </Form.Item>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, nextValues) =>
                            prevValues?.students?.[field.name]?.is_sen !==
                            nextValues?.students?.[field.name]?.is_sen
                          }
                        >
                          {({ getFieldValue }) =>
                            getFieldValue(["students", field.name, "is_sen"]) ? (
                              <Form.Item
                                name={[field.name, "sen_details"]}
                                label="SEN Details"
                                rules={[{ required: true, message: "Please add SEN details." }]}
                              >
                                <Input.TextArea
                                  rows={3}
                                  placeholder="Support plan, accommodations, key notes..."
                                />
                              </Form.Item>
                            ) : null
                          }
                        </Form.Item>

                        <Form.Item
                          name={[field.name, "password"]}
                          label="Password (Optional)"
                          extra="Leave empty to keep current password."
                        >
                          <Input.Password />
                        </Form.Item>
                      </div>
                    );
                  })}
                </Space>
              )}
            </Form.List>
          ) : (
            <>
              <Form.Item name="student_name" label="Student Name">
                <Input />
              </Form.Item>

              <Form.Item name="user_name" label="Username">
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Please enter a valid email" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="subject_ids" label="Subjects">
                <Select
                  mode="multiple"
                  showSearch
                  optionFilterProp="label"
                  options={assignSubjectOptions}
                  placeholder="Select one or more subjects"
                  maxTagCount="responsive"
                />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, nextValues) =>
                  JSON.stringify(prevValues?.subject_ids || []) !==
                  JSON.stringify(nextValues?.subject_ids || [])
                }
              >
                {({ getFieldValue }) => {
                  const editSubjectIds = Array.from(
                    new Set(
                      (Array.isArray(getFieldValue("subject_ids"))
                        ? getFieldValue("subject_ids")
                        : []
                      )
                        .map((id: unknown) => Number(id))
                        .filter((id: number) => Number.isFinite(id) && id > 0)
                    )
                  );
                  const allowedSubjectIds = new Set(editSubjectIds);
                  const editSubjectClassOptions = assignSubjectClasses
                    .filter(
                      (item) =>
                        allowedSubjectIds.size === 0 ||
                        allowedSubjectIds.has(Number(item.subjectId))
                    )
                    .map((item) => {
                      const subjectName =
                        assignSubjectOptions.find(
                          (option) => Number(option.value) === Number(item.subjectId)
                        )?.label || `Subject ${item.subjectId}`;
                      const detail = item.baseClassLabel ? ` (${item.baseClassLabel})` : "";
                      return {
                        value: item.id,
                        label: `${subjectName} - ${item.name}${detail}`,
                      };
                    });

                  return (
                    <Form.Item name="class_ids" label="Class">
                      <Select
                        mode="multiple"
                        showSearch
                        optionFilterProp="label"
                        options={editSubjectClassOptions}
                        placeholder="Select one or more classes related to selected subject(s)"
                        maxTagCount="responsive"
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>

              <Form.Item name="status" label="Status">
                <Select
                  allowClear
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                    { label: "Suspended", value: "suspended" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="gender" label="Gender">
                <Select
                  allowClear
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="nationality" label="Nationality">
                <Input placeholder="e.g. British, Emirati, Egyptian" />
              </Form.Item>

              <Form.Item name="is_sen" valuePropName="checked">
                <Checkbox>SEN student</Checkbox>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, nextValues) =>
                  prevValues?.is_sen !== nextValues?.is_sen
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("is_sen") ? (
                    <Form.Item
                      name="sen_details"
                      label="SEN Details"
                      rules={[{ required: true, message: "Please add SEN details." }]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="Support plan, accommodations, key notes..."
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>

              <Form.Item
                name="password"
                label="Password (Optional)"
                extra="Leave empty to keep current password."
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        title="Add New Students"
        open={addStudentOpen}
        onCancel={() => {
          setAddStudentOpen(false);
          addForm.resetFields();
        }}
        onOk={handleAddStudents}
        confirmLoading={addSubmitting}
        okText="Add Students"
        okButtonProps={{ style: { backgroundColor: "#16a34a", borderColor: "#16a34a" } }}
        width={600}
        destroyOnClose
      >
        <Form
          form={addForm}
          layout="vertical"
          initialValues={{ students: [{ status: "active", is_sen: false }] }}
        >
          <Form.List name="students">
            {(fields, { add, remove }) => (
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                {fields.map((field, idx) => (
                  <div key={field.key} className="rounded-xl border border-[#D6EFE2] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <Typography.Text strong>Student {idx + 1}</Typography.Text>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <Form.Item
                      name={[field.name, "student_name"]}
                      label="Student Name"
                      rules={[{ required: true, message: "Student name is required." }]}
                    >
                      <Input placeholder="Full name" />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "user_name"]}
                      label="Username"
                      rules={[{ required: true, message: "Username is required." }]}
                    >
                      <Input autoComplete="off" />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "email"]}
                      label="Email (Optional)"
                      rules={[{ type: "email", message: "Please enter a valid email." }]}
                    >
                      <Input placeholder="student@school.com" />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "password"]}
                      label="Password"
                      rules={[{ required: true, message: "Password is required." }]}
                    >
                      <Input.Password autoComplete="new-password" />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "subject_ids"]}
                      label="Subjects"
                      rules={[{ required: true, message: "Please select at least one subject." }]}
                    >
                      <Select
                        mode="multiple"
                        showSearch
                        optionFilterProp="label"
                        options={assignSubjectOptions}
                        placeholder="Select one or more subjects"
                        maxTagCount="responsive"
                      />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, nextValues) =>
                        JSON.stringify(prevValues?.students?.[field.name]?.subject_ids || []) !==
                        JSON.stringify(nextValues?.students?.[field.name]?.subject_ids || [])
                      }
                    >
                      {({ getFieldValue }) => {
                        const rowSubjectIds = Array.from(
                          new Set(
                            (Array.isArray(getFieldValue(["students", field.name, "subject_ids"]))
                              ? getFieldValue(["students", field.name, "subject_ids"])
                              : [])
                              .map((id: unknown) => Number(id))
                              .filter((id: number) => Number.isFinite(id) && id > 0)
                          )
                        );
                        const allowedSubjectIds = new Set(rowSubjectIds);
                        const rowSubjectClassOptions = assignSubjectClasses
                          .filter(
                            (item) =>
                              allowedSubjectIds.size === 0 ||
                              allowedSubjectIds.has(Number(item.subjectId))
                          )
                          .map((item) => {
                            const subjectName =
                              assignSubjectOptions.find(
                                (option) => Number(option.value) === Number(item.subjectId)
                              )?.label || `Subject ${item.subjectId}`;
                            const detail = item.baseClassLabel ? ` (${item.baseClassLabel})` : "";
                            return {
                              value: item.id,
                              label: `${subjectName} - ${item.name}${detail}`,
                            };
                          });

                        return (
                          <Form.Item
                            name={[field.name, "class_ids"]}
                            label="Class"
                            rules={[{ required: true, message: "Please select one or more classes." }]}
                          >
                            <Select
                              mode="multiple"
                              showSearch
                              optionFilterProp="label"
                              options={rowSubjectClassOptions}
                              placeholder="Select one or more classes related to selected subject(s)"
                              maxTagCount="responsive"
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>

                    <Form.Item name={[field.name, "status"]} label="Status" initialValue="active">
                      <Select
                        options={[
                          { label: "Active", value: "active" },
                          { label: "Inactive", value: "inactive" },
                          { label: "Suspended", value: "suspended" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      name={[field.name, "gender"]}
                      label="Gender"
                      rules={[{ required: true, message: "Please select gender." }]}
                    >
                      <Select
                        placeholder="Select gender"
                        options={[
                          { label: "Male", value: "male" },
                          { label: "Female", value: "female" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item name={[field.name, "nationality"]} label="Nationality">
                      <Input placeholder="e.g. British, Emirati, Egyptian" />
                    </Form.Item>

                    <Form.Item name={[field.name, "is_sen"]} valuePropName="checked">
                      <Checkbox>SEN student</Checkbox>
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, next) =>
                        prev?.students?.[field.name]?.is_sen !== next?.students?.[field.name]?.is_sen
                      }
                    >
                      {({ getFieldValue }) =>
                        getFieldValue(["students", field.name, "is_sen"]) ? (
                          <Form.Item
                            name={[field.name, "sen_details"]}
                            label="SEN Details"
                            rules={[{ required: true, message: "Please add SEN details." }]}
                          >
                            <Input.TextArea rows={3} placeholder="Support plan, accommodations, key notes..." />
                          </Form.Item>
                        ) : null
                      }
                    </Form.Item>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add({ status: "active", is_sen: false })}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Another Student
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
          <Modal
            title="Permanently Delete Student"
            open={!!deletingStudent}
            onCancel={() => { setDeletingStudent(null); setDeleteConfirmText(""); }}
            onOk={() => { if (deletingStudent) deleteMutation.mutate(deletingStudent); }}
            confirmLoading={deleteMutation.isPending}
            okText="Yes, Delete Forever"
        okButtonProps={{ danger: true, disabled: deleteConfirmText !== "DELETE" }}
        width={480}
      >
        {deletingStudent ? (
          <div className="space-y-4">
            <p>
              You are about to <strong>permanently delete</strong> the student record for{" "}
              <strong>{deletingStudent.name}</strong>. This cannot be undone and all data will be lost.
            </p>
            <p className="text-sm text-gray-500">
              To confirm, type <strong>DELETE</strong> in the box below:
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              status={deleteConfirmText && deleteConfirmText !== "DELETE" ? "error" : undefined}
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
