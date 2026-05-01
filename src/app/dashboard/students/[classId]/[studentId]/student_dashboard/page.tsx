"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Input,
  message,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  LeftOutlined,
  RightOutlined,
  SaveOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { deleteBehaviour } from "@/services/behaviorApi";
import { fetchStudentProfileData, fetchStudents } from "@/services/studentsApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import { fetchClasses } from "@/services/classesApi";
import { readStudentProfileOverride } from "@/lib/studentProfileOverrides";
import { extractSubjectIdFromPath } from "@/lib/subjectRouting";
import { studentMatchesSubjectScope } from "@/lib/subjectStudentScope";
import ExamIncidentHistoryCard from "@/components/students/ExamIncidentHistoryCard";

type AnyObj = Record<string, any>;

type AssessmentRow = {
  key: string;
  termName: string;
  assessmentName: string;
  taskName: string;
  taskType: string;
  dueDate: string;
  allocatedMarks: number;
  submissionStatus: string;
  teacherScore: string;
};

type TrackerTopicRow = {
  key: string;
  trackerName: string;
  topicTitle: string;
  topicType: string;
  marks: number;
  completed: boolean;
};

function asArray<T = AnyObj>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toDateValue(value: unknown): number {
  const t = new Date(String(value ?? "")).getTime();
  return Number.isFinite(t) ? t : 0;
}

function toFiniteNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function isAttendanceRecord(row: AnyObj): boolean {
  const t = String(row?.behaviour?.name ?? "").toLowerCase();
  const d = String(row?.description ?? "").toLowerCase();
  return (
    t.includes("attendance") ||
    t.includes("present") ||
    t.includes("absent") ||
    d.includes("[attendance]")
  );
}

function isPresentRecord(row: AnyObj): boolean {
  const t = String(row?.behaviour?.name ?? "").toLowerCase();
  const d = String(row?.description ?? "").toLowerCase();
  return t.includes("present") || d.includes("present");
}

function isAbsentRecord(row: AnyObj): boolean {
  const t = String(row?.behaviour?.name ?? "").toLowerCase();
  const d = String(row?.description ?? "").toLowerCase();
  return t.includes("absent") || d.includes("absent");
}

export default function StudentProfilePage() {
  const params = useParams<{ classId?: string; studentId?: string }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const classId = String(params?.classId ?? "");
  const studentId = String(params?.studentId ?? "");
  const pathSubjectId = Number(extractSubjectIdFromPath(pathname) ?? 0);
  const querySubjectId = Number(searchParams.get("subject_id") ?? 0);
  const scopedSubjectId =
    Number.isFinite(pathSubjectId) && pathSubjectId > 0
      ? pathSubjectId
      : Number.isFinite(querySubjectId) && querySubjectId > 0
      ? querySubjectId
      : null;
  const { currentUser, token } = useSelector((state: RootState) => state.auth);
  const canManageAttendance =
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "HOD" ||
    currentUser?.role === "TEACHER";
  const [profileNote, setProfileNote] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentId);
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [classSwitchLoading, setClassSwitchLoading] = useState(false);
  const [redirectingBlockedStudent, setRedirectingBlockedStudent] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-profile-v2", classId, studentId, scopedSubjectId ?? "school"],
    queryFn: () => fetchStudentProfileData(studentId, scopedSubjectId),
    enabled: Boolean(studentId),
  });

  const { data: classStudentsData = [], isLoading: classStudentsLoading } = useQuery({
    queryKey: ["class-students-for-profile-switcher", classId, scopedSubjectId ?? "school"],
    queryFn: () => fetchStudents(classId, scopedSubjectId),
    enabled: Boolean(classId),
  });

  const schoolId = Number(
    currentUser?.school_id || currentUser?.school?.id || (data as AnyObj)?.school?.id || 0
  );
  const { data: yearsData = [] } = useQuery({
    queryKey: ["profile-switcher-years", currentUser?.role, schoolId],
    queryFn: async () => {
      if (schoolId > 0) {
        const years = (await fetchYearsBySchool(schoolId)) ?? [];
        if (Array.isArray(years) && years.length > 0) return years;
      }

      // For staff without school-scoped year access, use assigned years only.
      const assignedYears = (await fetchAssignYears()) ?? [];
      return Array.isArray(assignedYears) ? assignedYears : [];
    },
    enabled: Boolean(currentUser?.role) && schoolId > 0,
  });

  const { data: allClassesData = [] } = useQuery({
    queryKey: ["profile-switcher-all-classes", yearsData],
    queryFn: async () => {
      const years = asArray<AnyObj>(yearsData);
      if (years.length === 0) return [];
      const classLists = await Promise.all(
        years.map(async (year) => {
          const classes = (await fetchClasses(String(year?.id ?? ""))) ?? [];
          return asArray<AnyObj>(classes).map((cls) => ({
            id: String(cls?.id ?? ""),
            class_name: String(cls?.class_name ?? cls?.name ?? "Class"),
            year_name: String(year?.name ?? ""),
            year_id: String(cls?.year_id ?? year?.id ?? ""),
          }));
        })
      );
      return classLists.flat();
    },
    enabled: asArray(yearsData).length > 0,
  });

  const { data: noteData } = useQuery({
    queryKey: ["student-note", studentId],
    queryFn: async () => {
      const res = await fetch(`/api/students/${studentId}/notes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load note");
      return (await res.json()) as { note?: string };
    },
    enabled: Boolean(studentId),
  });

  useEffect(() => {
    setProfileNote(String(noteData?.note ?? ""));
  }, [noteData?.note]);

  useEffect(() => {
    setSelectedStudentId(studentId);
  }, [studentId]);

  const deleteAttendanceMutation = useMutation({
    mutationFn: (id: number) => deleteBehaviour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-profile-v2", classId, studentId],
      });
      message.success("Attendance record removed.");
    },
    onError: () => {
      message.error("Failed to remove attendance record.");
    },
  });

  const saveNoteMutation = useMutation({
    mutationFn: async (note: string) => {
      const res = await fetch(`/api/students/${studentId}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-note", studentId] });
      message.success("Note saved.");
    },
    onError: () => {
      message.error("Failed to save note.");
    },
  });

  const student = useMemo<AnyObj | null>(() => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    const baseStudent = data as AnyObj;
    const override = readStudentProfileOverride([studentId, baseStudent?.id]);
    if (!override) return baseStudent;

    return {
      ...baseStudent,
      is_sen:
        typeof override.isSen === "boolean" ? override.isSen : baseStudent?.is_sen,
      sen_details:
        typeof override.senDetails === "string"
          ? override.senDetails
          : baseStudent?.sen_details,
    } as AnyObj;
  }, [data]);

  const behaviourRecords = useMemo(() => {
    const rows = asArray<AnyObj>(student?.behaviour);
    return [...rows].sort(
      (a, b) =>
        toDateValue(b?.date ?? b?.created_at) -
        toDateValue(a?.date ?? a?.created_at)
    );
  }, [student]);

  const attendanceRecords = useMemo(
    () => behaviourRecords.filter((row) => isAttendanceRecord(row)),
    [behaviourRecords]
  );

  const behaviorOnlyRecords = useMemo(
    () => behaviourRecords.filter((row) => !isAttendanceRecord(row)),
    [behaviourRecords]
  );

  const attendancePresentCount = useMemo(
    () => attendanceRecords.filter((row) => isPresentRecord(row)).length,
    [attendanceRecords]
  );

  const attendanceAbsentCount = useMemo(
    () => attendanceRecords.filter((row) => isAbsentRecord(row)).length,
    [attendanceRecords]
  );

  const terms = asArray<AnyObj>(student?.class?.term);
  const assessments = terms.flatMap((term) =>
    asArray<AnyObj>(term?.assign_assessments).map((a) => ({ term, assignment: a }))
  );

  const tasks = assessments.flatMap(({ assignment }) =>
    asArray<AnyObj>(assignment?.assessment?.tasks)
  );

  const completedTasks = tasks.filter((task) => {
    const sub = asArray<AnyObj>(task?.student_assessment_tasks)[0];
    return String(sub?.status ?? "").toLowerCase() === "completed";
  }).length;

  const totalTasks = tasks.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const behaviorPoints = behaviorOnlyRecords.reduce(
    (sum, row) => sum + Number(row?.behaviour?.points ?? 0),
    0
  );

  const trackers = useMemo(() => {
    const classTrackers = asArray<AnyObj>(student?.class?.assign_trackers);
    const directTrackers = asArray<AnyObj>(student?.assign_trackers);
    const merged = [...classTrackers, ...directTrackers];
    const seen = new Set<string>();
    return merged.filter((row, index) => {
      const trackerId = row?.tracker_id ?? row?.tracker?.id ?? `tracker-${index}`;
      const studentKey = row?.student_id ? `student-${row.student_id}` : "class";
      const key = `${trackerId}-${studentKey}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [student]);

  const trackerPointsFromTrackers = trackers.reduce((sum, assigned) => {
    const topics = asArray<AnyObj>(assigned?.tracker?.topics);
    const completedMarks = topics.reduce((topicSum, topic) => {
      const isCompleted = asArray<AnyObj>(topic?.status_progress).some((sp) => sp?.is_completed);
      if (!isCompleted) return topicSum;
      return topicSum + toFiniteNumber(topic?.marks);
    }, 0);
    return sum + completedMarks;
  }, 0);

  const trackerPointsFromApi = toFiniteNumber(
    student?.tracker_points ?? student?.total_marks ?? student?.tracker_total_points
  );
  const hasTrackerPointsFromApi =
    student?.tracker_points !== undefined ||
    student?.total_marks !== undefined ||
    student?.tracker_total_points !== undefined;
  const trackerPoints = hasTrackerPointsFromApi
    ? trackerPointsFromApi
    : trackerPointsFromTrackers;
  const mindPoints = toFiniteNumber(student?.mind_points);
  const combinedPoints = toFiniteNumber(student?.total_points ?? trackerPoints + mindPoints);

  const trackerRows = trackers.map((assigned, index) => {
    const tracker = assigned?.tracker ?? {};
    const topics = asArray<AnyObj>(tracker?.topics);
    const done = topics.filter((topic) =>
      asArray<AnyObj>(topic?.status_progress).some((sp) => sp?.is_completed)
    ).length;
    return {
      id: String(
        assigned?.id ?? tracker?.id ?? `${tracker?.name ?? "tracker"}-${index}`
      ),
      name: String(tracker?.name ?? "Tracker"),
      done,
      total: topics.length,
    };
  });

  const trackerTopicTotal = useMemo(
    () => trackerRows.reduce((sum, row) => sum + Number(row.total || 0), 0),
    [trackerRows]
  );
  const trackerTopicDone = useMemo(
    () => trackerRows.reduce((sum, row) => sum + Number(row.done || 0), 0),
    [trackerRows]
  );
  const trackerTopicPending = Math.max(0, trackerTopicTotal - trackerTopicDone);
  const trackerCompletionPercent =
    trackerTopicTotal > 0 ? Math.round((trackerTopicDone / trackerTopicTotal) * 100) : 0;

  const storiesTrackerRows = useMemo(
    () =>
      trackerRows.filter((row) =>
        String(row.name || "").toLowerCase().includes("stories of the prophets")
      ),
    [trackerRows]
  );
  const storiesTopicTotal = useMemo(
    () => storiesTrackerRows.reduce((sum, row) => sum + Number(row.total || 0), 0),
    [storiesTrackerRows]
  );
  const storiesTopicDone = useMemo(
    () => storiesTrackerRows.reduce((sum, row) => sum + Number(row.done || 0), 0),
    [storiesTrackerRows]
  );
  const storiesTopicPending = Math.max(0, storiesTopicTotal - storiesTopicDone);
  const storiesCompletionPercent =
    storiesTopicTotal > 0 ? Math.round((storiesTopicDone / storiesTopicTotal) * 100) : 0;

  const behaviorSummary = useMemo(() => {
    const positive = behaviorOnlyRecords.filter(
      (row) => toFiniteNumber(row?.behaviour?.points) > 0
    ).length;
    const neutral = behaviorOnlyRecords.filter(
      (row) => toFiniteNumber(row?.behaviour?.points) === 0
    ).length;
    const needsWork = behaviorOnlyRecords.filter(
      (row) => toFiniteNumber(row?.behaviour?.points) < 0
    ).length;
    const total = behaviorOnlyRecords.length;
    const pct = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0);
    return {
      total,
      positive,
      neutral,
      needsWork,
      positivePct: pct(positive),
      neutralPct: pct(neutral),
      needsWorkPct: pct(needsWork),
    };
  }, [behaviorOnlyRecords]);

  const assessmentRows = useMemo<AssessmentRow[]>(() => {
    return assessments.flatMap(({ term, assignment }, indexA) => {
      const termName = String(term?.name ?? "Term");
      const assessmentName = String(assignment?.assessment?.name ?? "Assessment");
      const assignmentTasks = asArray<AnyObj>(assignment?.assessment?.tasks);

      return assignmentTasks.map((task, indexT) => {
        const submission = asArray<AnyObj>(task?.student_assessment_tasks)[0] ?? {};
        return {
          key: `${termName}-${assessmentName}-${indexA}-${indexT}`,
          termName,
          assessmentName,
          taskName: String(task?.task_name ?? "N/A"),
          taskType: String(task?.task_type ?? "N/A"),
          dueDate: String(task?.due_date ?? "N/A"),
          allocatedMarks: Number(task?.allocated_marks ?? 0),
          submissionStatus: String(submission?.status ?? "not_submitted"),
          teacherScore:
            submission?.teacher_assessment_score != null
              ? String(submission.teacher_assessment_score)
              : "N/A",
        };
      });
    });
  }, [assessments]);

  const yearClassIds = useMemo(() => {
    const all = asArray<AnyObj>(allClassesData);
    const byYear = selectedYearId
      ? all.filter((c) => String(c?.year_id ?? "") === selectedYearId)
      : [];
    return byYear
      .map((c) => String(c?.id ?? ""))
      .filter((id) => !!id);
  }, [allClassesData, selectedYearId]);

  const { data: yearStudentsData = [], isLoading: yearStudentsLoading } = useQuery({
    queryKey: [
      "year-students-for-profile-switcher",
      selectedYearId,
      yearClassIds.join(","),
      scopedSubjectId ?? "school",
    ],
    queryFn: async () => {
      if (!selectedYearId || yearClassIds.length === 0) return [];
      const perClass = await Promise.all(
        yearClassIds.map(async (cid) => {
          try {
            const rows = await fetchStudents(cid, scopedSubjectId);
            return asArray<AnyObj>(rows).map((s) => ({
              ...s,
              __source_class_id: cid,
            }));
          } catch {
            return [];
          }
        })
      );
      const flat = perClass.flat();
      const dedup = new Map<string, AnyObj>();
      flat.forEach((s) => {
        const id = String(s?.id ?? "");
        if (!id || dedup.has(id)) return;
        dedup.set(id, s);
      });
      return Array.from(dedup.values());
    },
    enabled: Boolean(selectedYearId) && yearClassIds.length > 0,
  });

  const switcherStudents = useMemo(() => {
    const source =
      selectedYearId && asArray<AnyObj>(yearStudentsData).length > 0
        ? asArray<AnyObj>(yearStudentsData)
        : asArray<AnyObj>(classStudentsData);

    return source.map((s) => ({
      id: String(s?.id ?? ""),
      name: String(s?.student_name ?? s?.name ?? `Student ${s?.id ?? ""}`),
      status: String(s?.status ?? "active").toLowerCase(),
      classId: String(s?.class_id ?? s?.class?.id ?? s?.__source_class_id ?? classId),
      className: String(s?.class?.class_name ?? s?.class_name ?? ""),
    }));
  }, [selectedYearId, yearStudentsData, classStudentsData, classId]);

  const filteredClassStudents = useMemo(() => {
    if (studentStatusFilter === "all") return switcherStudents;
    return switcherStudents.filter((s) => s.status === studentStatusFilter);
  }, [switcherStudents, studentStatusFilter]);

  const explicitScopedMatchInClassList = useMemo(() => {
    if (!scopedSubjectId) return true;
    const scopedRows = asArray<AnyObj>(classStudentsData);
    return scopedRows.some(
      (row) =>
        String(row?.id ?? "") === String(studentId) &&
        studentMatchesSubjectScope(row, {
          subjectId: Number(scopedSubjectId),
        })
    );
  }, [classStudentsData, scopedSubjectId, studentId]);

  const currentStudentIndex = useMemo(
    () => filteredClassStudents.findIndex((s) => s.id === studentId),
    [filteredClassStudents, studentId]
  );

  const navigateToStudent = (nextId: string) => {
    if (!nextId || nextId === studentId) return;
    const target =
      filteredClassStudents.find((s) => s.id === nextId) ??
      switcherStudents.find((s) => s.id === nextId);
    const nextClassId = String(target?.classId ?? classId);
    router.push(`/dashboard/students/${nextClassId}/${nextId}/student_dashboard`);
  };

  const navigateToClass = async (nextClassId: string) => {
    if (!nextClassId || nextClassId === classId) return;
    try {
      setClassSwitchLoading(true);
      const nextStudentsRaw = await fetchStudents(nextClassId, scopedSubjectId);
      const nextStudents = asArray<AnyObj>(nextStudentsRaw)
        .map((s) => ({
          id: String(s?.id ?? ""),
          status: String(s?.status ?? "active").toLowerCase(),
        }))
        .filter((s) => !!s.id);

      const filtered =
        studentStatusFilter === "all"
          ? nextStudents
          : nextStudents.filter((s) => s.status === studentStatusFilter);

      const target = (filtered[0] ?? nextStudents[0])?.id;
      if (!target) {
        message.warning("No students found in this class.");
        return;
      }

      router.push(`/dashboard/students/${nextClassId}/${target}/student_dashboard`);
    } finally {
      setClassSwitchLoading(false);
    }
  };

  const yearOptions = useMemo(() => {
    const classRows = asArray<AnyObj>(allClassesData);
    const validYearIds = new Set(
      classRows
        .map((row) => String(row?.year_id ?? "").trim())
        .filter(Boolean)
    );

    const unique = new Map<string, { value: string; label: string }>();
    asArray<AnyObj>(yearsData).forEach((year) => {
      const id = String(year?.id ?? "").trim();
      if (!id) return;
      if (!validYearIds.has(id)) return;
      if (unique.has(id)) return;

      const fallbackLabel = `Year ${id}`;
      const label = String(year?.name ?? fallbackLabel).trim() || fallbackLabel;
      unique.set(id, { value: id, label });
    });

    return Array.from(unique.values());
  }, [yearsData, allClassesData]);

  const classOptions = useMemo(() => {
    const all = asArray<AnyObj>(allClassesData);
    const filtered = selectedYearId
      ? all.filter((c) => String(c?.year_id ?? "") === selectedYearId)
      : all;

    const unique = new Map<string, { value: string; label: string }>();
    filtered.forEach((row) => {
      const id = String(row?.id ?? "").trim();
      if (!id || unique.has(id)) return;
      const label = row?.year_name
        ? `${String(row?.class_name ?? "Class")} (${String(row?.year_name)})`
        : String(row?.class_name ?? "Class");
      unique.set(id, { value: id, label });
    });

    return Array.from(unique.values());
  }, [allClassesData, selectedYearId]);

  const isStudentInActiveSubject = useMemo(() => {
    if (!student || !scopedSubjectId) return true;
    const subjects = asArray<AnyObj>(student?.subjects);
    const subjectIds = subjects
      .map((item) => Number(item?.id ?? item?.subject_id ?? 0))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (subjectIds.length === 0) {
      return explicitScopedMatchInClassList;
    }
    return subjectIds.includes(Number(scopedSubjectId));
  }, [student, scopedSubjectId, explicitScopedMatchInClassList]);

  useEffect(() => {
    if (isLoading) return;
    if (!scopedSubjectId) return;
    if (isStudentInActiveSubject) return;
    if (redirectingBlockedStudent) return;

    setRedirectingBlockedStudent(true);

    const scopedMatch = pathname.match(/^\/dashboard\/s\/(\d+)(\/[^/]+)?\//);
    const scopedPrefix = scopedMatch ? `/dashboard/s/${scopedMatch[1]}${scopedMatch[2] || ""}` : null;
    const fallbackPath = scopedPrefix
      ? `${scopedPrefix}/students/all`
      : "/dashboard/students/all-students";

    message.warning("This student is not available in the current subject workspace.");
    router.replace(fallbackPath);
  }, [
    isLoading,
    scopedSubjectId,
    isStudentInActiveSubject,
    redirectingBlockedStudent,
    pathname,
    router,
  ]);

  useEffect(() => {
    const currentClass = asArray<AnyObj>(allClassesData).find(
      (c) => String(c?.id ?? "") === classId
    );
    const currentYearId = String(currentClass?.year_id ?? "");
    if (currentYearId) {
      setSelectedYearId(currentYearId);
      return;
    }
    if (!selectedYearId && yearOptions.length > 0) {
      setSelectedYearId(String(yearOptions[0].value));
    }
  }, [allClassesData, classId, yearOptions, selectedYearId]);

  const handleYearChange = async (nextYearId: string) => {
    setSelectedYearId(nextYearId);
    const options = asArray<AnyObj>(allClassesData).filter(
      (c) => String(c?.year_id ?? "") === String(nextYearId)
    );
    if (options.length === 0) {
      message.warning("No classes found in this year group.");
      return;
    }
    const firstClassId = String(options[0]?.id ?? "");
    if (firstClassId && firstClassId !== classId) {
      await navigateToClass(firstClassId);
    }
  };

  const trackerTopicRows = useMemo<TrackerTopicRow[]>(() => {
    return trackers.flatMap((assigned, idxA) => {
      const tracker = assigned?.tracker ?? {};
      const trackerName = String(tracker?.name ?? "Tracker");
      const topics = asArray<AnyObj>(tracker?.topics);

      return topics.map((topic, idxT) => {
        const completed = asArray<AnyObj>(topic?.status_progress).some(
          (sp) => sp?.is_completed
        );

        return {
          key: `${trackerName}-${idxA}-${idxT}`,
          trackerName,
          topicTitle: String(topic?.title ?? "Untitled"),
          topicType: String(topic?.type ?? "topic"),
          marks: Number(topic?.marks ?? 0),
          completed,
        };
      });
    });
  }, [trackers]);

  const downloadCsv = (fileName: string, rows: string[][]) => {
    const esc = (value: string | number) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = rows.map((r) => r.map((c) => esc(c)).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAttendanceCsv = () => {
    const rows: string[][] = [["Date", "Type", "Description", "Points"]];
    attendanceRecords.forEach((row) => {
      rows.push([
        String(row?.date || row?.created_at || ""),
        String(row?.behaviour?.name || "Attendance"),
        String(row?.description || ""),
        String(row?.behaviour?.points ?? ""),
      ]);
    });
    downloadCsv(`student-${studentId}-attendance.csv`, rows);
  };

  const exportAssessmentsCsv = () => {
    const rows: string[][] = [
      [
        "Term",
        "Assessment",
        "Task",
        "Type",
        "Due Date",
        "Allocated Marks",
        "Submission",
        "Teacher Score",
      ],
    ];
    assessmentRows.forEach((row) => {
      rows.push([
        row.termName,
        row.assessmentName,
        row.taskName,
        row.taskType,
        row.dueDate,
        String(row.allocatedMarks),
        row.submissionStatus,
        row.teacherScore,
      ]);
    });
    downloadCsv(`student-${studentId}-assessments.csv`, rows);
  };

  const saveNote = () => {
    saveNoteMutation.mutate(profileNote);
  };

  const exportPdf = async () => {
    const res = await fetch(`/api/students/${studentId}/profile-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: student?.student_name,
        email: student?.email,
        className: student?.class?.class_name,
        status: student?.status,
        completedTasks,
        totalTasks,
        behaviorPoints,
        attendanceTotal: attendanceRecords.length,
        attendancePresent: attendancePresentCount,
        attendanceAbsent: attendanceAbsentCount,
      }),
    });
    if (!res.ok) {
      message.error("Failed to export PDF.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `student-${studentId}-profile.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <Alert
          type="error"
          showIcon
          message="Could not load student profile"
          description={error instanceof Error ? error.message : "Unknown error"}
        />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-4 md:p-6">
        <Alert type="warning" showIcon message="Student record not found." />
      </div>
    );
  }

  if (!isStudentInActiveSubject) {
    return (
      <div className="p-4 md:p-6">
        <Alert
          type="warning"
          showIcon
          message="This student is not available in the current subject workspace."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-3 md:p-6">
      <Card className="rounded-2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-semibold">
              {student?.student_name || "Student"}
            </div>
            <div className="text-gray-600">{student?.email || "No email"}</div>
            <div className="mt-2 flex gap-2">
              <Tag color="blue">ID: {student?.id ?? studentId}</Tag>
              <Tag color={student?.status === "active" ? "green" : "default"}>
                {String(student?.status || "unknown").toUpperCase()}
              </Tag>
            </div>
          </div>
          <div className="w-full md:max-w-[760px] space-y-2">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
              <Select
                showSearch
                value={selectedYearId || undefined}
                optionFilterProp="label"
                placeholder="Year group"
                onChange={(v) => {
                  void handleYearChange(v);
                }}
                options={yearOptions}
              />
              <Select
                value={studentStatusFilter}
                onChange={(v) => setStudentStatusFilter(v)}
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
              <Select
                showSearch
                value={selectedStudentId}
                loading={classStudentsLoading || yearStudentsLoading}
                optionFilterProp="label"
                placeholder="Search student"
                className="md:col-span-3"
                onChange={(v) => {
                  setSelectedStudentId(v);
                  navigateToStudent(v);
                }}
                options={filteredClassStudents.map((s) => ({
                  value: s.id,
                  label: s.className
                    ? `${s.name} (${s.status}) - ${s.className}`
                    : `${s.name} (${s.status})`,
                }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                icon={<LeftOutlined />}
                disabled={currentStudentIndex <= 0}
                onClick={() => {
                  if (currentStudentIndex > 0) {
                    navigateToStudent(filteredClassStudents[currentStudentIndex - 1].id);
                  }
                }}
              >
                Previous
              </Button>
              <Button
                icon={<RightOutlined />}
                iconPosition="end"
                disabled={
                  currentStudentIndex < 0 ||
                  currentStudentIndex >= filteredClassStudents.length - 1
                }
                onClick={() => {
                  if (
                    currentStudentIndex >= 0 &&
                    currentStudentIndex < filteredClassStudents.length - 1
                  ) {
                    navigateToStudent(filteredClassStudents[currentStudentIndex + 1].id);
                  }
                }}
              >
                Next
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Statistic
              title="Completed"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
            />
            <Statistic
              title="Total Tasks"
              value={totalTasks}
              prefix={<TeamOutlined />}
            />
            <Statistic
              title="Behaviour Points"
              value={behaviorPoints}
              prefix={<TrophyOutlined />}
            />
            <Statistic
              title="Class"
              value={student?.class?.class_name || "N/A"}
              prefix={<UserOutlined />}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
          <Card size="small">
            <Statistic title="Mind-upgrade Points" value={mindPoints} prefix={<TrophyOutlined />} />
          </Card>
          <Card size="small">
            <Statistic title="Tracker Points" value={trackerPoints} prefix={<TrophyOutlined />} />
          </Card>
          <Card size="small">
            <Statistic title="Combined Points" value={combinedPoints} prefix={<TrophyOutlined />} />
          </Card>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button icon={<DownloadOutlined />} onClick={exportAttendanceCsv}>
            Attendance CSV
          </Button>
          <Button icon={<DownloadOutlined />} onClick={exportAssessmentsCsv}>
            Assessments CSV
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={exportPdf}>
            Print / PDF
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Card size="small" title="Gender">
            <div className="font-medium text-gray-900">
              {String(
                student?.gender ??
                  student?.student_gender ??
                  student?.sex ??
                  student?.student_sex ??
                  "Unknown"
              ) || "Unknown"}
            </div>
          </Card>
          <Card size="small" title="Nationality">
            <div className="font-medium text-gray-900">
              {String(
                student?.nationality ??
                  student?.student_nationality ??
                  student?.country ??
                  student?.citizenship ??
                  "Not set"
              ) || "Not set"}
            </div>
          </Card>
          <Card size="small" title="SEN Status">
            <Tag color={student?.is_sen ? "gold" : "default"}>
              {student?.is_sen ? "SEN Student" : "No SEN Flag"}
            </Tag>
          </Card>
          <Card size="small" title="SEN Details">
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {String(student?.sen_details ?? student?.senDetails ?? "").trim() || "No SEN details saved."}
            </div>
          </Card>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Attendance Total" className="rounded-2xl">
            <Statistic value={attendanceRecords.length} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Present" className="rounded-2xl">
            <Statistic value={attendancePresentCount} valueStyle={{ color: "#389e0d" }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Absent" className="rounded-2xl">
            <Statistic value={attendanceAbsentCount} valueStyle={{ color: "#cf1322" }} />
          </Card>
        </Col>
      </Row>

      <Card title="Academic Progress" className="rounded-2xl">
        <Progress
          percent={progressPercent}
          status={progressPercent >= 100 ? "success" : "active"}
        />
        <div className="mt-2 text-sm text-gray-600">
          {completedTasks} / {totalTasks} tasks completed
        </div>
      </Card>

      <ExamIncidentHistoryCard studentId={studentId} title="Exam Exit History" />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tracker Progress Overview" className="rounded-2xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card size="small">
                <Statistic title="Completed Topics" value={trackerTopicDone} valueStyle={{ color: "#389e0d" }} />
              </Card>
              <Card size="small">
                <Statistic title="Pending Topics" value={trackerTopicPending} valueStyle={{ color: "#fa8c16" }} />
              </Card>
              <Card size="small">
                <Statistic title="Completion" value={trackerCompletionPercent} suffix="%" />
              </Card>
            </div>

            <div className="mt-4">
              <div className="mb-1 text-xs text-gray-500">All Tracker Topics</div>
              <Progress
                percent={trackerCompletionPercent}
                strokeColor={trackerCompletionPercent >= 70 ? "#52c41a" : trackerCompletionPercent >= 40 ? "#faad14" : "#ff4d4f"}
              />
            </div>

            <div className="mt-4 rounded-xl border bg-[#f9fbfa] p-3">
              <div className="text-sm font-semibold text-gray-800">Stories of the Prophets</div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <Tag color="green">Finished: {storiesTopicDone}</Tag>
                <Tag color="orange">Pending: {storiesTopicPending}</Tag>
                <Tag color="blue">Total: {storiesTopicTotal}</Tag>
              </div>
              <Progress
                className="mt-2"
                percent={storiesCompletionPercent}
                strokeColor={storiesCompletionPercent >= 70 ? "#52c41a" : storiesCompletionPercent >= 40 ? "#faad14" : "#ff4d4f"}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Behaviour Health" className="rounded-2xl">
            <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              <Card size="small">
                <Statistic title="Positive" value={behaviorSummary.positive} valueStyle={{ color: "#389e0d" }} />
              </Card>
              <Card size="small">
                <Statistic title="Neutral" value={behaviorSummary.neutral} valueStyle={{ color: "#595959" }} />
              </Card>
              <Card size="small">
                <Statistic title="Needs Work" value={behaviorSummary.needsWork} valueStyle={{ color: "#cf1322" }} />
              </Card>
            </div>

            <div className="space-y-2">
              <div>
                <div className="mb-1 text-xs text-gray-500">Positive ({behaviorSummary.positivePct}%)</div>
                <Progress percent={behaviorSummary.positivePct} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="mb-1 text-xs text-gray-500">Neutral ({behaviorSummary.neutralPct}%)</div>
                <Progress percent={behaviorSummary.neutralPct} strokeColor="#8c8c8c" />
              </div>
              <div>
                <div className="mb-1 text-xs text-gray-500">Needs Work ({behaviorSummary.needsWorkPct}%)</div>
                <Progress percent={behaviorSummary.needsWorkPct} strokeColor="#ff4d4f" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Attendance (Recent 10)" className="rounded-2xl">
            <div className="space-y-2">
              {attendanceRecords.slice(0, 10).map((row) => {
                const name = String(row?.behaviour?.name ?? "Attendance");
                const rowId = Number(row?.id);
                return (
                  <div
                    key={String(row?.id)}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-xs text-gray-500">
                        {row?.date || row?.created_at || "No date"}
                      </div>
                    </div>
                    <Space>
                      <Tag color={name.toLowerCase().includes("absent") ? "volcano" : "green"}>
                        {name}
                      </Tag>
                      {canManageAttendance && Number.isFinite(rowId) && (
                        <Popconfirm
                          title="Remove this attendance record?"
                          onConfirm={() => deleteAttendanceMutation.mutate(rowId)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            loading={deleteAttendanceMutation.isPending}
                          />
                        </Popconfirm>
                      )}
                    </Space>
                  </div>
                );
              })}
              {attendanceRecords.length === 0 && (
                <div className="text-sm text-gray-500">No attendance records.</div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Behaviour (Recent 10)" className="rounded-2xl">
            <div className="space-y-2">
              {behaviorOnlyRecords.slice(0, 10).map((row) => {
                const points = Number(row?.behaviour?.points ?? 0);
                return (
                  <div
                    key={String(row?.id)}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div>
                      <div className="font-medium">
                        {row?.behaviour?.name || "Behaviour"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {row?.description || "No description"}
                      </div>
                    </div>
                    <Tag color={points >= 0 ? "green" : "volcano"}>
                      {points >= 0 ? `+${points}` : points}
                    </Tag>
                  </div>
                );
              })}
              {behaviorOnlyRecords.length === 0 && (
                <div className="text-sm text-gray-500">No behaviour records.</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Assessments By Term" className="rounded-2xl">
        <Collapse
          items={terms.map((term, idx) => {
            const termName = String(term?.name ?? `Term ${idx + 1}`);
            const termRows = assessmentRows.filter((r) => r.termName === termName);

            return {
              key: termName,
              label: `${termName} (${termRows.length} tasks)`,
              children: (
                <Table<AssessmentRow>
                  rowKey="key"
                  size="small"
                  pagination={{ pageSize: 8 }}
                  scroll={{ x: 900 }}
                  columns={[
                    { title: "Assessment", dataIndex: "assessmentName", width: 180 },
                    { title: "Task", dataIndex: "taskName", width: 220 },
                    {
                      title: "Type",
                      dataIndex: "taskType",
                      width: 120,
                      render: (v: string) => <Tag>{String(v || "N/A")}</Tag>,
                    },
                    { title: "Due", dataIndex: "dueDate", width: 120 },
                    { title: "Marks", dataIndex: "allocatedMarks", width: 90 },
                    {
                      title: "Submission",
                      dataIndex: "submissionStatus",
                      width: 130,
                      render: (v: string) => {
                        const low = String(v || "not_submitted").toLowerCase();
                        const color = low === "completed" ? "green" : "orange";
                        return <Tag color={color}>{low.toUpperCase()}</Tag>;
                      },
                    },
                    { title: "Score", dataIndex: "teacherScore", width: 90 },
                  ]}
                  dataSource={termRows}
                />
              ),
            };
          })}
        />
      </Card>

      <Card title="Tracker Topic Drill-Down" className="rounded-2xl">
        <Table<TrackerTopicRow>
          rowKey="key"
          size="small"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
          columns={[
            { title: "Tracker", dataIndex: "trackerName", width: 180 },
            { title: "Topic", dataIndex: "topicTitle", width: 260 },
            {
              title: "Type",
              dataIndex: "topicType",
              width: 110,
              render: (v: string) => <Tag>{String(v || "topic").toUpperCase()}</Tag>,
            },
            { title: "Marks", dataIndex: "marks", width: 90 },
            {
              title: "Completed",
              dataIndex: "completed",
              width: 120,
              render: (v: boolean) => (
                <Tag color={v ? "green" : "default"}>{v ? "YES" : "NO"}</Tag>
              ),
            },
          ]}
          dataSource={trackerTopicRows}
        />
      </Card>

      <Card title="Teacher/Admin Notes" className="rounded-2xl">
        <div className="space-y-3">
          <Input.TextArea
            rows={4}
            value={profileNote}
            onChange={(e) => setProfileNote(e.target.value)}
            placeholder="Write private notes for this student (saved in browser for now)."
          />
          <Button type="primary" icon={<SaveOutlined />} onClick={saveNote}>
            Save Note
          </Button>
        </div>
      </Card>

      <Card title="Student Details" className="rounded-2xl">
        <Row gutter={[16, 12]}>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">Username</div>
            <div>{student?.user_name || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">Phone</div>
            <div>{student?.phone_number || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">Class ID</div>
            <div>{student?.class_id || classId || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">School</div>
            <div>{student?.school?.name || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">School Email</div>
            <div>{student?.school?.email || "N/A"}</div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-xs text-gray-500">Last Updated</div>
            <div>
              <CalendarOutlined className="mr-1" />
              {student?.updated_at || "N/A"}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
