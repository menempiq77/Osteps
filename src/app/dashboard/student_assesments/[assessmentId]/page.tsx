"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Input, Button, Modal, Select, message, Breadcrumb, Checkbox, Tabs, Spin, DatePicker, InputNumber } from "antd";
import {
  AudioOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  LinkOutlined,
  CheckCircleFilled,
  UnlockOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { addStudentTaskMarks, fetchStudentTasks, fetchTasks, updateTask } from "@/services/api";
import { updateQuizSubmissionTeacherMark } from "@/services/quizApi";
import { fetchStudents } from "@/services/studentsApi";
import Link from "next/link";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { IMG_BASE_URL } from "@/lib/config";
import { fetchAssessmentDocument, saveAssessmentDocumentAnnotations } from "@/services/documentAssessmentApi";
import { downloadAnnotatedPdf, downloadFileAsBlob } from "@/lib/bulkPdfDownload";
import { buildTaskTypeValue, resolveExamWindow } from "@/lib/taskTypeMetadata";
import { parseSubmissionAttachments } from "@/lib/submissionAttachments";
import dayjs from "dayjs";

interface Student {
  id?: number | string;
  student_id?: number | string;
  student_name?: string;
  name?: string;
  user_name?: string;
  student?: {
    id?: number | string;
    student_name?: string;
    name?: string;
    user_name?: string;
  } | null;
}

interface Task {
  id: number;
  assessment_id: number;
  task_name: string;
  allocated_marks: string | number;
  task_type: string;
  task_type_config?: unknown;
  description: string;
  due_date?: string | null;
  file_path: string | null;
  url?: string | null;
  exam_mode?: boolean;
  exam_start_at?: string | null;
  exam_duration_minutes?: number | null;
  exam_end_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface StudentAssessmentTask {
  id: number;
  student_id: number;
  assessment_id: number;
  task_id: number;
  task: Task & { url?: string | null };
  student?: {
    id?: number | string;
    student_name?: string;
    name?: string;
    user_name?: string;
  } | null;
  self_assessment_mark: string;
  additional_notes: string;
  file_path: string;
  file_paths?: unknown;
  created_at: string;
  updated_at: string;
  teacher_assessment_score?: string;
  teacher_feedback?: string;
  submission_type: string;
  teacher_assessment_marks?: string;
  teacher_assessment_mark?: string | number | null;
  quiz?: {
    id: number;
    name?: string;
    quiz_queston?: Array<{ marks?: string | number | null }>;
  };
  status?: string;
}

type AssessmentTaskDefinition = Task & {
  type?: string;
  url?: string | null;
};

interface StudentOption {
  id: string;
  student_name: string;
}

const getWholeMark = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
};

const pickTeacherMarkValue = (task: StudentAssessmentTask) => {
  const candidates = [
    task?.teacher_assessment_score,
    task?.teacher_assessment_marks,
    task?.teacher_assessment_mark,
  ];

  for (const candidate of candidates) {
    if (candidate == null) continue;
    if (String(candidate).trim() === "") continue;
    return candidate;
  }

  return null;
};

const getSelfAssessmentLookupKey = (task: StudentAssessmentTask) =>
  `${task.assessment_id}:${task.task_id}:${task.student_id}`;

const hasSelfAssessmentValue = (value: unknown) =>
  value != null && String(value).trim() !== "";

const isPlaceholderStudentName = (value: string) =>
  /^student\s+\d+$/i.test(value.trim());

const toStudentOption = (value: unknown): StudentOption | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, any>;
  const id = row?.student_id ?? row?.student?.id ?? row?.id;
  if (id == null || String(id).trim() === "") return null;

  const studentName = String(
    row?.student_name ??
      row?.name ??
      row?.student?.student_name ??
      row?.student?.name ??
      row?.student?.user_name ??
      row?.user?.name ??
      ""
  ).trim();
  if (!studentName || isPlaceholderStudentName(studentName)) return null;

  return {
    id: String(id),
    student_name: studentName,
  };
};

const buildStudentOptions = (
  students: Student[],
  assessmentTasks: StudentAssessmentTask[]
): StudentOption[] => {
  const byId = new Map<string, StudentOption>();

  for (const student of students ?? []) {
    const option = toStudentOption(student);
    if (option) byId.set(option.id, option);
  }

  for (const task of assessmentTasks ?? []) {
    const option = toStudentOption(task);
    if (option && !byId.has(option.id)) {
      byId.set(option.id, option);
    }
  }

  return Array.from(byId.values());
};
const getTaskGroupKey = (task: StudentAssessmentTask) => {
  if (task?.submission_type === "quiz") {
    return `quiz:${task?.quiz?.id ?? task?.task_id}`;
  }
  return `task:${task?.task_id}`;
};

const getTaskGroupTitle = (task: StudentAssessmentTask) =>
  task?.submission_type === "quiz"
    ? task?.quiz?.name || task?.task?.task_name || "Quiz"
    : task?.task?.task_name || "Assessment Task";

const getTaskGroupType = (task: StudentAssessmentTask) =>
  task?.submission_type === "quiz"
    ? "Quiz"
    : task?.task?.task_type?.toLowerCase() === "pdf" && task?.task?.file_path
    ? "PDF Exam"
    : task?.task?.task_type || "Task";

const urlPattern = /(https?:\/\/[^\s<>'"]+|www\.[^\s<>'"]+)/gi;

const normalizeExternalUrl = (value: string) => {
  const trimmed = value.trim().replace(/[),.;]+$/g, "");
  return trimmed.toLowerCase().startsWith("http") ? trimmed : `https://${trimmed}`;
};

const renderClickableStudentNote = (value: string) => {
  const text = String(value || "");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let linkIndex = 0;

  text.replace(urlPattern, (match, _unused, offset) => {
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset));
    }

    linkIndex += 1;
    const href = normalizeExternalUrl(match);
    parts.push(
      <a
        key={`student-note-link-${offset}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 underline-offset-2 hover:bg-blue-100 hover:underline"
      >
        Open link{linkIndex > 1 ? ` ${linkIndex}` : ""} ↗
      </a>
    );

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};


export default function AssessmentDrawer() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const assessmentId = params.assessmentId;
  const classId = searchParams.get("classId");
  const subjectClassId = searchParams.get("subjectClassId");
  const tabFromUrl = searchParams.get("tab");
  const { activeSubjectId, canUseSubjectContext, toSubjectHref } =
    useSubjectContext();

  const [assessmentOpenTaskId, setAssessmentOpenTaskId] = useState<
    number | null
  >(null);
  const [viewingTask, setViewingTask] = useState<StudentAssessmentTask | null>(
    null
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentTasksLoaded, setStudentTasksLoaded] = useState(false);
  const [taskDefinitionsLoaded, setTaskDefinitionsLoaded] = useState(false);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTaskGroupKey, setActiveTaskGroupKey] = useState<string | null>(tabFromUrl);
  const [assementTasks, setAssesmentTasks] = useState<StudentAssessmentTask[]>(
    []
  );
  const [assessmentTaskDefinitions, setAssessmentTaskDefinitions] = useState<AssessmentTaskDefinition[]>([]);
  const [inputError, setInputError] = useState(false);
  const [quizTeacherMarkOpenId, setQuizTeacherMarkOpenId] = useState<number | null>(null);
  const [quizTeacherMark, setQuizTeacherMark] = useState<string>("");
  const [selectedDownloadTaskIds, setSelectedDownloadTaskIds] = useState<number[]>([]);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [bulkOpeningEdits, setBulkOpeningEdits] = useState(false);
  const [documentSelfAssessmentMarks, setDocumentSelfAssessmentMarks] = useState<Record<string, number>>({});
  const [examActionTask, setExamActionTask] = useState<StudentAssessmentTask | null>(null);
  const [examActionValues, setExamActionValues] = useState({
    examStartAt: "",
    examDurationMinutes: 60,
    dueDate: "",
    dueDateHasTime: false,
    openStudentEdits: true,
  });
  const [examActionSaving, setExamActionSaving] = useState(false);

  const [formValues, setFormValues] = useState<{
    marks: string;
    feedback: string;
  }>({ marks: "", feedback: "" });

  const loadDocumentSelfAssessmentMarks = async (tasks: StudentAssessmentTask[]) => {
    const candidates = tasks.filter(
      (task) =>
        task?.assessment_id &&
        task?.task_id &&
        task?.student_id &&
        String(task?.task?.task_type || "").toLowerCase().includes("pdf")
    );

    if (candidates.length === 0) {
      setDocumentSelfAssessmentMarks({});
      return;
    }

    const entries = await Promise.all(
      candidates.map(async (task) => {
        try {
          const documentState = await fetchAssessmentDocument(
            task.assessment_id,
            task.task_id,
            task.student_id
          );
          const parsed = Number(documentState?.metadata?.selfAssessmentMark);
          if (!Number.isFinite(parsed)) return null;
          return [getSelfAssessmentLookupKey(task), Math.trunc(parsed)] as const;
        } catch {
          return null;
        }
      })
    );

    setDocumentSelfAssessmentMarks(
      Object.fromEntries(entries.filter((entry): entry is readonly [string, number] => Boolean(entry)))
    );
  };

  const loadStudentTasks = async (assessmentId: number) => {
    try {
      setLoading(true);
      const data = await fetchStudentTasks(
        Number(assessmentId),
        canUseSubjectContext ? activeSubjectId ?? undefined : undefined
      );
      setAssesmentTasks(data);
      void loadDocumentSelfAssessmentMarks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load Assessment Tasks");
      console.error(err);
    } finally {
      setStudentTasksLoaded(true);
      setLoading(false);
    }
  };

  const loadAssessmentTaskDefinitions = async (assessmentId: number) => {
    try {
      const data = await fetchTasks(
        Number(assessmentId),
        canUseSubjectContext ? activeSubjectId ?? undefined : undefined
      );
      setAssessmentTaskDefinitions(
        (data || [])
          .filter((task: any) => String(task?.type || "task") === "task")
          .map((task: any) => ({
            id: Number(task?.id),
            assessment_id: Number(task?.assessment_id ?? assessmentId),
            task_name: String(task?.task_name || task?.name || "Assessment task"),
            allocated_marks: String(task?.allocated_marks ?? 0),
            task_type: String(task?.task_type || ""),
            task_type_config: task?.task_type_config ?? null,
            description: String(task?.description || ""),
            due_date: task?.due_date ?? null,
            file_path: task?.file_path ?? null,
            created_at: String(task?.created_at || ""),
            updated_at: String(task?.updated_at || ""),
            url: task?.url ?? null,
            exam_mode: Boolean(task?.exam_mode),
            exam_start_at: task?.exam_start_at ?? null,
            exam_duration_minutes:
              task?.exam_duration_minutes == null
                ? null
                : Number(task.exam_duration_minutes),
            exam_end_at: task?.exam_end_at ?? null,
            type: task?.type,
          }))
          .filter((task: AssessmentTaskDefinition) => Number.isFinite(task.id))
      );
    } catch (err) {
      console.error("Failed to load assessment task definitions", err);
      setAssessmentTaskDefinitions([]);
    } finally {
      setTaskDefinitionsLoaded(true);
    }
  };

  useEffect(() => {
    if (!assessmentId) return;
    if (canUseSubjectContext && !activeSubjectId) return;
    setStudentTasksLoaded(false);
    setTaskDefinitionsLoaded(false);
    loadStudentTasks(Number(assessmentId));
    loadAssessmentTaskDefinitions(Number(assessmentId));
  }, [assessmentId, activeSubjectId, canUseSubjectContext]);

  useEffect(() => {
    if (!assessmentId) return;

    const currentAssessmentId = Number(assessmentId);
    if (!Number.isFinite(currentAssessmentId) || currentAssessmentId <= 0) {
      return;
    }

    const refreshTasks = () => {
      if (canUseSubjectContext && !activeSubjectId) return;
      loadStudentTasks(currentAssessmentId);
      loadAssessmentTaskDefinitions(currentAssessmentId);
    };

    const handleMarkUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ assessmentId?: number }>).detail;
      if (Number(detail?.assessmentId) !== currentAssessmentId) return;
      refreshTasks();
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key !== "osteps:assessment-mark-updated" ||
        !event.newValue
      ) {
        return;
      }

      try {
        const payload = JSON.parse(event.newValue) as {
          assessmentId?: number;
        };
        if (Number(payload?.assessmentId) !== currentAssessmentId) return;
        refreshTasks();
      } catch {
        // ignore malformed storage events
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshTasks();
      }
    };

    window.addEventListener(
      "osteps:assessment-mark-updated",
      handleMarkUpdate as EventListener
    );
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refreshTasks);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener(
        "osteps:assessment-mark-updated",
        handleMarkUpdate as EventListener
      );
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refreshTasks);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [assessmentId, activeSubjectId, canUseSubjectContext]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      let studentsData = await fetchStudents(
        classId,
        canUseSubjectContext ? activeSubjectId ?? undefined : undefined,
        subjectClassId ?? undefined
      );

      if (!studentsData?.length && subjectClassId) {
        studentsData = await fetchStudents(
          classId,
          canUseSubjectContext ? activeSubjectId ?? undefined : undefined,
          undefined
        );
      }

      setStudents(studentsData);
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setStudentsLoaded(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      setStudentsLoaded(false);
      loadStudents();
    } else {
      setStudents([]);
      setStudentsLoaded(true);
    }
  }, [classId, activeSubjectId, canUseSubjectContext, subjectClassId]);

  const handleStudentChange = (value: string) => {
    setSelectedStudentId(value);
  };

  const classScopedStudentIds = React.useMemo(() => {
    if (!classId) return null;
    return new Set(
      (students ?? [])
        .map((student) => Number(toStudentOption(student)?.id))
        .filter((studentId) => Number.isFinite(studentId) && studentId > 0)
    );
  }, [classId, students]);

  const classScopedAssessmentTasks = React.useMemo(() => {
    if (!classId) return assementTasks;
    if (!classScopedStudentIds || classScopedStudentIds.size === 0) return [];
    return assementTasks.filter((task) =>
      classScopedStudentIds.has(Number(task.student_id))
    );
  }, [assementTasks, classId, classScopedStudentIds]);

  const studentOptions = React.useMemo(
    () => buildStudentOptions(students, classScopedAssessmentTasks),
    [students, classScopedAssessmentTasks]
  );

  const displayTasks = React.useMemo(() => {
    const submittedTaskKeys = new Set(
      classScopedAssessmentTasks.map((task) => `${task.task_id}:${task.student_id}`)
    );

    const unfinishedPdfTasks: StudentAssessmentTask[] = assessmentTaskDefinitions
      .filter((task) => String(task.task_type || "").toLowerCase() === "pdf")
      .flatMap((task) =>
        studentOptions
          .filter((student) => {
            const studentId = Number(student.id);
            return Number.isFinite(studentId) && !submittedTaskKeys.has(`${task.id}:${student.id}`);
          })
          .map((student) => ({
            id: -(Number(task.id) * 1000000 + Number(student.id)),
            student_id: Number(student.id),
            assessment_id: Number(task.assessment_id || assessmentId || 0),
            task_id: Number(task.id),
            task,
            student: {
              id: student.id,
              student_name: student.student_name,
            },
            self_assessment_mark: "",
            additional_notes:
              "Not submitted yet. Open the paper to view any autosaved draft work.",
            file_path: task.file_path || "",
            created_at: task.created_at || "",
            updated_at: task.updated_at || "",
            teacher_assessment_score: undefined,
            teacher_feedback: "",
            submission_type: "task",
            teacher_assessment_marks: undefined,
            teacher_assessment_mark: null,
            status: "not_submitted",
          }))
      );

    return [...classScopedAssessmentTasks, ...unfinishedPdfTasks];
  }, [classScopedAssessmentTasks, assessmentId, assessmentTaskDefinitions, studentOptions]);

  useEffect(() => {
    void loadDocumentSelfAssessmentMarks(displayTasks);
  }, [displayTasks]);

  useEffect(() => {
    if (!selectedStudentId) return;
    if (studentOptions.length === 0) {
      setSelectedStudentId(null);
      return;
    }

    const stillPresent = studentOptions.some(
      (student) => student.id === String(selectedStudentId)
    );
    if (!stillPresent) setSelectedStudentId(null);
  }, [selectedStudentId, studentOptions]);

  const getStudentNameForTask = (task: StudentAssessmentTask) =>
    studentOptions.find(
      (student) => Number(student.id) === Number(task.student_id)
    )?.student_name || `Student ${task.student_id}`;

  const getTaskSubmissionStats = (submissions: StudentAssessmentTask[]) => {
    const submittedIds = new Set(
      submissions
        .filter((task) => task.status !== "not_submitted")
        .map((task) => String(task.student_id ?? "").trim())
        .filter(Boolean)
    );
    const submittedNames = studentOptions
      .filter((student) => submittedIds.has(String(student.id)))
      .map((student) => student.student_name);
    const missingSubmittedNames = submissions
      .filter((task) => task.status !== "not_submitted")
      .filter(
        (task) =>
          !studentOptions.some(
            (student) => Number(student.id) === Number(task.student_id)
          )
      )
      .map(getStudentNameForTask);
    const notFinishedNames = studentOptions
      .filter((student) => !submittedIds.has(String(student.id)))
      .map((student) => student.student_name);

    return {
      submittedCount: submittedIds.size,
      notFinishedCount: notFinishedNames.length,
      totalCount: studentOptions.length || submittedIds.size,
      submittedNames: Array.from(new Set([...submittedNames, ...missingSubmittedNames])),
      notFinishedNames,
    };
  };

  const toggleAssessment = (taskId: number) => {
    setAssessmentOpenTaskId((prev) => (prev === taskId ? null : taskId));
    // Reset form values when opening a new assessment
    if (assessmentOpenTaskId !== taskId) {
      const task = displayTasks.find((t) => t.id === taskId);
      setFormValues({
        marks: String(task ? pickTeacherMarkValue(task) ?? "" : ""),
        feedback: task?.teacher_assessment_feedback || "",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuizTeacherMarkSubmit = async (submissionId: number) => {
    try {
      await updateQuizSubmissionTeacherMark(
        submissionId,
        parseInt(quizTeacherMark || "0")
      );
      message.success("Quiz marks updated");
      setQuizTeacherMarkOpenId(null);
      setQuizTeacherMark("");
      loadStudentTasks(Number(assessmentId));
    } catch (err) {
      message.error("Failed to update quiz marks");
    }
  };

  const handleAssessmentSubmit = async (taskId: number) => {
    try {
      const task = displayTasks.find((t) => t.id === taskId);
      if (!task) return;

      const markStudentId = selectedStudentId ?? String(task.student_id);
      await addStudentTaskMarks(markStudentId, {
        assessment_id: task.assessment_id,
        task_id: task.task_id,
        teacher_assessment_marks: parseInt(formValues.marks || "0"),
        teacher_assessment_feedback: formValues.feedback || "",
      });

      message.success("Assessment submitted successfully");
      setAssessmentOpenTaskId(null);
      loadStudentTasks(Number(assessmentId));
    } catch (err) {
      console.error("Failed to submit assessment:", err);
      message.error("Failed to submit assessment");
    }
  };

  const getTaskDefinitionForAction = (task: StudentAssessmentTask) => {
    const definition = assessmentTaskDefinitions.find(
      (item) => Number(item.id) === Number(task.task_id)
    );

    return {
      ...(task.task || {}),
      ...(definition || {}),
      id: Number(definition?.id ?? task.task_id ?? task.task?.id),
      assessment_id: Number(
        definition?.assessment_id ?? task.task?.assessment_id ?? task.assessment_id
      ),
    } as AssessmentTaskDefinition;
  };

  const isExamTask = (task: StudentAssessmentTask) => {
    if (task?.submission_type === "quiz") return false;
    const definition = getTaskDefinitionForAction(task);
    return (
      String(definition?.task_type || "").toLowerCase() === "pdf" &&
      Boolean(definition?.exam_mode)
    );
  };

  const isPdfTask = (task: StudentAssessmentTask | null) => {
    if (!task || task?.submission_type === "quiz") return false;
    const definition = getTaskDefinitionForAction(task);
    return String(definition?.task_type || "").toLowerCase() === "pdf";
  };

  const taskDueDateHasTime = (value?: string | null) => {
    const raw = String(value || "").trim();
    return /(?:T|\s)\d{1,2}:\d{2}/.test(raw);
  };

  const formatTaskDueDateValue = (value: dayjs.Dayjs, hasTime: boolean) =>
    hasTime ? value.format("YYYY-MM-DDTHH:mm:ssZ") : value.format("YYYY-MM-DD");

  const getTaskDueDateSummary = (task: StudentAssessmentTask) => {
    const definition = getTaskDefinitionForAction(task);
    const rawDueDate = String(definition.due_date || "").trim();
    if (!rawDueDate) return "No due date set";

    const parsedDueDate = dayjs(rawDueDate);
    if (!parsedDueDate.isValid()) return `Due ${rawDueDate}`;

    const hasTime = taskDueDateHasTime(rawDueDate);
    const label = parsedDueDate.format(hasTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY");
    const deadline = hasTime ? parsedDueDate : parsedDueDate.endOf("day");
    return deadline.isBefore(dayjs()) ? `Closed ${label}` : `Due ${label}`;
  };

  const getExamScheduleSummary = (task: StudentAssessmentTask) => {
    const definition = getTaskDefinitionForAction(task);
    const examWindow = resolveExamWindow(definition);
    if (!examWindow.examMode) return null;

    const startLabel = examWindow.startAt
      ? dayjs(examWindow.startAt).format("DD MMM YYYY, HH:mm")
      : "not set";
    const endLabel = examWindow.endAt
      ? dayjs(examWindow.endAt).format("DD MMM YYYY, HH:mm")
      : "not set";

    if (examWindow.state === "open") return `Exam open until ${endLabel}`;
    if (examWindow.state === "ended") return `Exam closed ${endLabel}`;
    if (examWindow.state === "scheduled") return `Exam opens ${startLabel}`;
    return "Exam timing needs updating";
  };

  const getTaskActionSummary = (task: StudentAssessmentTask) =>
    isExamTask(task) ? getExamScheduleSummary(task) : getTaskDueDateSummary(task);

  const openExamActionModal = (task: StudentAssessmentTask) => {
    const definition = getTaskDefinitionForAction(task);
    const dueDateHasTime = taskDueDateHasTime(definition.due_date);
    const currentDueDate = dayjs(definition.due_date || "").isValid()
      ? dayjs(definition.due_date || "")
      : dayjs();
    setExamActionTask(task);
    setExamActionValues({
      examStartAt:
        definition.exam_start_at || dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      examDurationMinutes: Number(definition.exam_duration_minutes || 60),
      dueDate: formatTaskDueDateValue(currentDueDate, dueDateHasTime),
      dueDateHasTime,
      openStudentEdits: isPdfTask(task),
    });
  };

  const appendTaskTypeValue = (formData: FormData, taskTypeValue: ReturnType<typeof buildTaskTypeValue>) => {
    if (taskTypeValue && typeof taskTypeValue === "object") {
      Object.entries(taskTypeValue).forEach(([key, value]) => {
        if (value == null || value === "") return;
        formData.append(`task_type[${key}]`, String(value));
      });
      return;
    }

    formData.append("task_type", typeof taskTypeValue === "string" ? taskTypeValue : "null");
  };

  const buildExamActionFormData = (
    task: StudentAssessmentTask,
    values: { examStartAt: string; examDurationMinutes: number }
  ) => {
    const definition = getTaskDefinitionForAction(task);
    const durationMinutes = Math.max(1, Number(values.examDurationMinutes) || 60);
    const taskTypeValue = buildTaskTypeValue({
      taskType: definition.task_type || "pdf",
      examMode: true,
      examStartAt: values.examStartAt,
      examDurationMinutes: durationMinutes,
    });
    const dueDate = dayjs(values.examStartAt)
      .add(durationMinutes, "minute")
      .format("YYYY-MM-DD");

    const formData = new FormData();
    formData.append("assessment_id", String(definition.assessment_id || task.assessment_id));
    formData.append("task_name", definition.task_name || task.task?.task_name || "Assessment task");
    formData.append("description", definition.description || "");
    formData.append("due_date", dueDate);
    formData.append("allocated_marks", String(definition.allocated_marks ?? task.task?.allocated_marks ?? 0));
    appendTaskTypeValue(formData, taskTypeValue);
    if (definition.url) formData.append("url", String(definition.url));
    if (canUseSubjectContext && activeSubjectId) {
      formData.append("subject_id", String(activeSubjectId));
    }
    return formData;
  };

  const buildDueDateActionFormData = (
    task: StudentAssessmentTask,
    dueDate: string
  ) => {
    const definition = getTaskDefinitionForAction(task);
    const formData = new FormData();
    formData.append("assessment_id", String(definition.assessment_id || task.assessment_id));
    formData.append("task_name", definition.task_name || task.task?.task_name || "Assessment task");
    formData.append("description", definition.description || "");
    formData.append("due_date", dueDate);
    formData.append("allocated_marks", String(definition.allocated_marks ?? task.task?.allocated_marks ?? 0));
    appendTaskTypeValue(formData, definition.task_type || "null");
    if (definition.url) formData.append("url", String(definition.url));
    if (canUseSubjectContext && activeSubjectId) {
      formData.append("subject_id", String(activeSubjectId));
    }
    return formData;
  };

  const openStudentEditsForTask = async (task: StudentAssessmentTask) => {
    if (!task?.assessment_id || !task?.task_id || !task?.student_id) return;

    const documentState = await fetchAssessmentDocument(
      task.assessment_id,
      task.task_id,
      task.student_id
    );

    await saveAssessmentDocumentAnnotations({
      assessmentId: task.assessment_id,
      taskId: task.task_id,
      studentId: task.student_id,
      layer: "teacher",
      annotations: documentState.teacherAnnotations || [],
      studentLocked: false,
      metadata: {
        ...documentState.metadata,
        reopenedFromStudentTaskCardAt: new Date().toISOString(),
      },
    });
  };

  const handleSaveExamAction = async (options: { closeNow?: boolean } = {}) => {
    if (!examActionTask) return;

    const definition = getTaskDefinitionForAction(examActionTask);
    const taskId = Number(definition.id || examActionTask.task_id);
    if (!Number.isFinite(taskId) || taskId <= 0) {
      message.error("This task cannot be updated right now.");
      return;
    }

    const actionIsExam = isExamTask(examActionTask);
    const nextExamValues = options.closeNow
      ? {
          examStartAt: dayjs().subtract(2, "minute").format("YYYY-MM-DDTHH:mm:ssZ"),
          examDurationMinutes: 1,
        }
      : {
          examStartAt: examActionValues.examStartAt,
          examDurationMinutes: examActionValues.examDurationMinutes,
        };
    const nextDueDate = options.closeNow
      ? formatTaskDueDateValue(dayjs().subtract(1, "day"), examActionValues.dueDateHasTime)
      : examActionValues.dueDate;

    if (actionIsExam) {
      if (!nextExamValues.examStartAt || !dayjs(nextExamValues.examStartAt).isValid()) {
        message.error("Please choose a valid exam opening time.");
        return;
      }

      if (!Number.isFinite(Number(nextExamValues.examDurationMinutes)) || Number(nextExamValues.examDurationMinutes) <= 0) {
        message.error("Please enter a valid exam duration.");
        return;
      }
    } else if (!nextDueDate || !dayjs(nextDueDate).isValid()) {
      message.error("Please choose a valid due date.");
      return;
    }

    try {
      setExamActionSaving(true);
      await updateTask(
        String(taskId),
        actionIsExam
          ? buildExamActionFormData(examActionTask, nextExamValues)
          : buildDueDateActionFormData(examActionTask, nextDueDate)
      );

      if (!options.closeNow && examActionValues.openStudentEdits && isPdfTask(examActionTask)) {
        await openStudentEditsForTask(examActionTask);
      }

      message.success(
        options.closeNow
          ? actionIsExam
            ? "Exam closed for students."
            : "Task closed for students."
          : actionIsExam
            ? isPdfTask(examActionTask) && examActionValues.openStudentEdits
              ? "Exam time updated and student edits opened."
              : "Exam time updated."
            : isPdfTask(examActionTask) && examActionValues.openStudentEdits
              ? "Due date updated and student edits opened."
              : "Due date updated."
      );
      setExamActionTask(null);
      await Promise.all([
        loadStudentTasks(Number(assessmentId)),
        loadAssessmentTaskDefinitions(Number(assessmentId)),
      ]);
    } catch (error) {
      console.error("Failed to update exam action:", error);
      message.error("Could not update the exam action.");
    } finally {
      setExamActionSaving(false);
    }
  };

  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType) {
      case "audio":
        return <AudioOutlined className="text-blue-500" />;
      case "video":
        return <VideoCameraOutlined className="text-purple-500" />;
      case "pdf":
        return <FilePdfOutlined className="text-red-500" />;
      case "url":
        return <LinkOutlined className="text-green-500" />;
      default:
        return null;
    }
  };

  const hasTeacherAssessmentScore = (task: StudentAssessmentTask) =>
    pickTeacherMarkValue(task) != null;

  const hasTeacherQuizMark = (task: StudentAssessmentTask) =>
    task.teacher_assessment_mark != null &&
    String(task.teacher_assessment_mark).trim() !== "";

  const getQuizTotalMarks = (task: StudentAssessmentTask) =>
    task.quiz?.quiz_queston?.reduce(
      (sum, question) => sum + (Number(question?.marks) || 0),
      0
    ) || 0;

  const taskGroups = React.useMemo(() => {
    const byKey = new Map<
      string,
      {
        key: string;
        title: string;
        type: string;
        taskType: string;
        submissions: StudentAssessmentTask[];
      }
    >();

    for (const task of displayTasks) {
      const key = getTaskGroupKey(task);
      if (!byKey.has(key)) {
        byKey.set(key, {
          key,
          title: getTaskGroupTitle(task),
          type: getTaskGroupType(task),
          taskType: task?.submission_type === "quiz" ? "quiz" : task?.task?.task_type || "",
          submissions: [],
        });
      }
      byKey.get(key)?.submissions.push(task);
    }

    return Array.from(byKey.values());
  }, [displayTasks]);

  const updateUrlTab = useCallback((tabKey: string | null) => {
    if (typeof window === "undefined" || !tabKey) return;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tabKey);
    window.history.replaceState(window.history.state, "", url.toString());
  }, []);

  useEffect(() => {
    if (taskGroups.length === 0) return;
    if (!activeTaskGroupKey || !taskGroups.some((group) => group.key === activeTaskGroupKey)) {
      const initialKey = tabFromUrl && taskGroups.some((g) => g.key === tabFromUrl)
        ? tabFromUrl
        : taskGroups[0].key;
      setActiveTaskGroupKey(initialKey);
      updateUrlTab(initialKey);
    }
  }, [activeTaskGroupKey, taskGroups, tabFromUrl, updateUrlTab]);

  const activeTaskGroup =
    taskGroups.find((group) => group.key === activeTaskGroupKey) || taskGroups[0];

  const tasksForSelectedTask = activeTaskGroup?.submissions || [];
  const activeTaskStats = getTaskSubmissionStats(tasksForSelectedTask);

  const filteredTasks = selectedStudentId
    ? tasksForSelectedTask.filter(
        (task) => task.student_id === Number(selectedStudentId)
      )
    : tasksForSelectedTask;
  const initialDataReady =
    studentTasksLoaded && taskDefinitionsLoaded && (!classId || studentsLoaded);

  const handleViewQuiz = (task: any) => {
    const params = new URLSearchParams();
    if (classId) params.set("classId", String(classId));
    if (subjectClassId) params.set("subjectClassId", String(subjectClassId));
    if (typeof window !== "undefined") {
      params.set("returnTo", `${window.location.pathname}${window.location.search}`);
    }
    const nextHref = `/dashboard/student_assesments/quiz/${task.quiz.id}?${params.toString()}`;
    router.push(
      canUseSubjectContext && activeSubjectId
        ? toSubjectHref(nextHref)
        : nextHref
    );
  };

  const fileUrlForDocument = (path: string | null | undefined) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const cleanPath = String(path).replace(/^\/+/, "");
    return cleanPath.startsWith("storage/")
      ? `${IMG_BASE_URL}/${cleanPath}`
      : `${IMG_BASE_URL}/storage/${cleanPath}`;
  };

  const getTaskSourceFilePath = (task: StudentAssessmentTask) => {
    const definition = getTaskDefinitionForAction(task);
    return definition.file_path || task.task?.file_path || task.file_path || "";
  };

  const getOriginalPdfUrlForTask = (task: StudentAssessmentTask) =>
    fileUrlForDocument(getTaskSourceFilePath(task));

  const buildTeacherDocumentWorkspaceUrl = (
    task: StudentAssessmentTask,
    options: { autoDownload?: boolean } = {}
  ) => {
    const definition = getTaskDefinitionForAction(task);
    const sourcePath = getTaskSourceFilePath(task);
    const studentName = getStudentNameForTask(task);
    const params = new URLSearchParams({
      assessmentId: String(task.assessment_id),
      taskId: String(task.task_id),
      studentId: String(task.student_id),
      studentName,
      role: "teacher",
      fileUrl: fileUrlForDocument(sourcePath),
      title: definition.task_name || task.task?.task_name || "PDF Assessment",
      maxMarks: String(definition.allocated_marks || task.task?.allocated_marks || 0),
      teacherMarks: String(
        pickTeacherMarkValue(task) ?? ""
      ),
      teacherFeedback: String(task.teacher_feedback || ""),
    });
    if (
      hasSelfAssessmentValue(getSelfAssessmentMarkForTask(task))
    ) {
      params.set("selfAssessmentMark", String(getSelfAssessmentMarkForTask(task)));
    }
    if (classId) params.set("classId", String(classId));
    if (subjectClassId) params.set("subjectClassId", String(subjectClassId));
    if (options.autoDownload) params.set("autoDownload", "1");
    if (activeTaskGroupKey) params.set("activeTab", activeTaskGroupKey);
    if (typeof window !== "undefined") {
      params.set("returnTo", `${window.location.pathname}${window.location.search}`);
    }
    return `/dashboard/assessment-document?${params.toString()}`;
  };

  const openTeacherDocumentWorkspace = (
    task: StudentAssessmentTask,
    options: { autoDownload?: boolean } = {}
  ) => {
    router.push(buildTeacherDocumentWorkspaceUrl(task, options));
  };

  const sanitizeDownloadName = (value: string) =>
    value
      .replace(/[\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120) || "student-task";

  const getSelfAssessmentMarkForTask = (task: StudentAssessmentTask) => {
    const documentMark = documentSelfAssessmentMarks[getSelfAssessmentLookupKey(task)];
    if (Number.isFinite(documentMark) && Number(documentMark) > 0) {
      return documentMark;
    }
    if (hasSelfAssessmentValue(task.self_assessment_mark)) {
      return task.self_assessment_mark;
    }
    return Number.isFinite(documentMark) ? documentMark : "";
  };

  const getSubmittedFileUrl = (task: StudentAssessmentTask) => {
    const taskType = String(task.task?.task_type || "").toLowerCase();
    if (taskType === "url") return task.task?.url || task.file_path || "";
    const attachments = parseSubmissionAttachments(task.file_paths, task.file_path);
    if (attachments.length > 0) return attachments[0].url;
    return fileUrlForDocument(
      task.file_path || (taskType !== "pdf" ? task.task?.file_path : "")
    );
  };

  // Resolve ONLY the student's own submitted media file. Never falls back to
  // task.task.file_path (the task's attached sample, which is identical for
  // every student) so the inline audio/video player plays the actual recording
  // for the student being viewed.
  const getStudentSubmissionMediaUrl = (task: StudentAssessmentTask) => {
    const attachments = parseSubmissionAttachments(task.file_paths, task.file_path);
    return attachments.length > 0 ? attachments[0].url : "";
  };

  const renderSubmissionAttachmentLinks = (
    task: StudentAssessmentTask,
    excludeUrl?: string
  ) => {
    const attachments = parseSubmissionAttachments(
      task.file_paths,
      task.file_path
    ).filter((attachment) => !excludeUrl || attachment.url !== excludeUrl);
    if (attachments.length === 0) return null;

    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
        <div className="mb-2 text-sm font-semibold text-gray-800">
          {excludeUrl ? "Other uploaded files" : "Student uploaded files"} ({attachments.length})
        </div>
        <div className="space-y-1.5">
          {attachments.map((attachment) => (
            <a
              key={attachment.path}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-md border border-gray-200 px-2.5 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:underline"
            >
              <span className="truncate">{attachment.name}</span>
              <span className="shrink-0 text-xs font-semibold">Open</span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const canBulkDownloadTask = (task: StudentAssessmentTask) => {
    if (task?.submission_type === "quiz") return Boolean(task?.quiz?.id);
    const taskType = String(task.task?.task_type || "").toLowerCase();
    if (taskType === "pdf") {
      return Boolean(task.student_id && getTaskSourceFilePath(task));
    }
    return Boolean(getSubmittedFileUrl(task));
  };

  const visibleDownloadableTasks = filteredTasks.filter(canBulkDownloadTask);
  const selectedDownloadTasks = visibleDownloadableTasks.filter((task) =>
    selectedDownloadTaskIds.includes(task.id)
  );
  const allVisibleDownloadsSelected =
    visibleDownloadableTasks.length > 0 &&
    visibleDownloadableTasks.every((task) =>
      selectedDownloadTaskIds.includes(task.id)
    );
  const someVisibleDownloadsSelected =
    visibleDownloadableTasks.some((task) =>
      selectedDownloadTaskIds.includes(task.id)
    ) && !allVisibleDownloadsSelected;

  const toggleDownloadTaskSelection = (taskId: number, checked: boolean) => {
    setSelectedDownloadTaskIds((current) =>
      checked
        ? Array.from(new Set([...current, taskId]))
        : current.filter((id) => id !== taskId)
    );
  };

  const toggleAllVisibleDownloads = (checked: boolean) => {
    const visibleIds = visibleDownloadableTasks.map((task) => task.id);
    setSelectedDownloadTaskIds((current) =>
      checked
        ? Array.from(new Set([...current, ...visibleIds]))
        : current.filter((id) => !visibleIds.includes(id))
    );
  };

  const triggerBrowserDownload = (
    url: string,
    fileName: string,
    openInNewTab = false
  ) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.rel = "noopener noreferrer";
    if (openInNewTab) {
      link.target = "_blank";
    } else {
      link.download = fileName;
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleBulkOpenEdits = async () => {
    const pdfTasks = selectedDownloadTasks.filter((task) => isPdfTask(task));
    if (pdfTasks.length === 0) {
      message.warning("Select at least one PDF exam task first.");
      return;
    }

    setBulkOpeningEdits(true);
    let openedCount = 0;
    let failedCount = 0;

    for (const task of pdfTasks) {
      try {
        await openStudentEditsForTask(task);
        openedCount++;
      } catch (err) {
        console.error(`Failed to open edits for student ${task.student_id}:`, err);
        failedCount++;
      }
    }

    if (openedCount > 0) {
      message.success(
        `Opened editing for ${openedCount} student${openedCount === 1 ? "" : "s"}.`
      );
    }
    if (failedCount > 0) {
      message.warning(
        `Failed to open editing for ${failedCount} student${failedCount === 1 ? "" : "s"}.`
      );
    }
    setBulkOpeningEdits(false);
  };

  const handleBulkDownload = async () => {
    if (selectedDownloadTasks.length === 0) {
      message.warning("Tick at least one visible task first.");
      return;
    }

    setBulkDownloading(true);
    let downloadedCount = 0;
    let skippedCount = 0;
    const total = selectedDownloadTasks.length;

    for (const task of selectedDownloadTasks) {
      const taskType = String(task.task?.task_type || "").toLowerCase();
      const studentName = sanitizeDownloadName(getStudentNameForTask(task));
      const taskName = sanitizeDownloadName(
        task.task?.task_name || task.quiz?.name || "Assessment Task"
      );

      try {
        if (task?.submission_type === "quiz") {
          if (task.quiz?.id) {
            const params = new URLSearchParams();
            if (classId) params.set("classId", String(classId));
            if (subjectClassId) {
              params.set("subjectClassId", String(subjectClassId));
            }
            const quizHref = `/dashboard/student_assesments/quiz/${task.quiz.id}?${params.toString()}`;
            triggerBrowserDownload(
              canUseSubjectContext && activeSubjectId
                ? toSubjectHref(quizHref)
                : quizHref,
              `${studentName} - ${taskName}`,
              true
            );
            downloadedCount += 1;
          } else {
            skippedCount += 1;
          }
          continue;
        }

        if (taskType === "pdf") {
          const pdfUrl = getOriginalPdfUrlForTask(task);
          if (!pdfUrl) {
            skippedCount += 1;
            continue;
          }
          message.loading({
            content: `Downloading ${downloadedCount + 1} of ${total}: ${studentName}...`,
            key: "bulk-download-progress",
            duration: 0,
          });
          await downloadAnnotatedPdf({
            assessmentId: String(task.assessment_id),
            taskId: String(task.task_id),
            studentId: String(task.student_id),
            studentName,
            taskName,
            pdfUrl,
          });
          downloadedCount += 1;
          continue;
        }

        const fileUrl = getSubmittedFileUrl(task);
        if (fileUrl) {
          await downloadFileAsBlob(fileUrl, `${studentName} - ${taskName}`);
          downloadedCount += 1;
        } else {
          skippedCount += 1;
        }
      } catch (err) {
        console.error(`Download failed for ${studentName}:`, err);
        skippedCount += 1;
      }
    }

    message.destroy("bulk-download-progress");

    if (downloadedCount > 0) {
      message.success(
        `Downloaded ${downloadedCount} paper${downloadedCount === 1 ? "" : "s"}.`
      );
    }
    if (skippedCount > 0) {
      message.warning(
        `${skippedCount} selected task${skippedCount === 1 ? "" : "s"} could not be downloaded.`
      );
    }
    setBulkDownloading(false);
  };

  const taskActionIsExam = examActionTask ? isExamTask(examActionTask) : false;
  const taskActionIsPdf = isPdfTask(examActionTask);
  const examActionEndAt =
    examActionValues.examStartAt && dayjs(examActionValues.examStartAt).isValid()
      ? dayjs(examActionValues.examStartAt).add(
          Math.max(1, Number(examActionValues.examDurationMinutes) || 60),
          "minute"
        )
      : null;
  const taskActionDueAt =
    examActionValues.dueDate && dayjs(examActionValues.dueDate).isValid()
      ? dayjs(examActionValues.dueDate)
      : null;
  const examActionCurrentSummary = examActionTask
    ? getTaskActionSummary(examActionTask)
    : null;

  if (!initialDataReady) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <Spin size="large" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading assessment tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-3 md:p-6">
        <Breadcrumb
          items={[
            {
              title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              title: <Link href="/dashboard/student_assesments">Assessments</Link>,
            },
            {
              title: <span>{activeTaskGroup?.title || "Tasks"}</span>,
            },
          ]}
          className="!mb-6"
        />
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Students by assessment task</h1>
              <p className="text-sm text-slate-500">
                Choose a task tab to see every student's submission for that specific task.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {taskGroups.length} tasks
            </span>
          </div>

          <Tabs
            activeKey={activeTaskGroup?.key}
            onChange={(key) => {
              setActiveTaskGroupKey(key);
              updateUrlTab(key);
              setSelectedDownloadTaskIds([]);
              setAssessmentOpenTaskId(null);
              setQuizTeacherMarkOpenId(null);
            }}
            tabBarGutter={8}
            items={taskGroups.map((group) => ({
              key: group.key,
              label: (
                <span className="flex items-center gap-2" title={`Submitted: ${getTaskSubmissionStats(group.submissions).submittedNames.join(", ") || "None"} | Not finished: ${getTaskSubmissionStats(group.submissions).notFinishedNames.join(", ") || "None"}`}>
                  {group.taskType === "quiz" ? null : getTaskTypeIcon(group.taskType)}
                  <span className="max-w-[210px] truncate">{group.title}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    Done {getTaskSubmissionStats(group.submissions).submittedCount}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    Not {getTaskSubmissionStats(group.submissions).notFinishedCount}
                  </span>
                </span>
              ),
            }))}
          />
        </div>

        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900">
              {activeTaskGroup?.title || "Select a task"}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {filteredTasks.length} shown / {activeTaskStats.submittedCount} submitted from {activeTaskStats.totalCount} student{activeTaskStats.totalCount === 1 ? "" : "s"}
            </div>
          </div>
          <div className="max-w-xs flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter student
            </label>
            <Select
              value={selectedStudentId ?? undefined}
              onChange={(value) => setSelectedStudentId(value ?? null)}
              placeholder="All students"
              allowClear
              style={{ width: "100%" }}
            >
              {studentOptions.map((student) => (
                <Select.Option key={student.id} value={student.id}>
                  {student.student_name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Checkbox
              checked={allVisibleDownloadsSelected}
              indeterminate={someVisibleDownloadsSelected}
              disabled={visibleDownloadableTasks.length === 0}
              onChange={(event) => toggleAllVisibleDownloads(event.target.checked)}
            >
              Select all visible
            </Checkbox>
            <Button
              type="primary"
              className="!bg-primary !border-primary"
              loading={bulkDownloading}
              disabled={selectedDownloadTasks.length === 0}
              onClick={handleBulkDownload}
            >
              Download selected ({selectedDownloadTasks.length})
            </Button>
            {activeTaskGroup?.taskType?.toLowerCase() === "pdf" && (
              <Button
                icon={<UnlockOutlined />}
                loading={bulkOpeningEdits}
                disabled={selectedDownloadTasks.length === 0}
                onClick={handleBulkOpenEdits}
                className="!border-blue-300 !text-blue-700 hover:!border-blue-500 hover:!text-blue-800"
              >
                Open student edits ({selectedDownloadTasks.filter((t) => isPdfTask(t)).length})
              </Button>
            )}
            <Button
              disabled={selectedDownloadTaskIds.length === 0}
              onClick={() => setSelectedDownloadTaskIds([])}
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-emerald-900">
                Submitted / finished
              </h2>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                {activeTaskStats.submittedCount}
              </span>
            </div>
            {activeTaskStats.submittedNames.length > 0 ? (
              <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {activeTaskStats.submittedNames.map((name) => (
                  <span
                    key={`submitted-${name}`}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-700">No students submitted this task yet.</p>
            )}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-amber-900">
                Not finished yet
              </h2>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-700 shadow-sm">
                {activeTaskStats.notFinishedCount}
              </span>
            </div>
            {activeTaskStats.notFinishedNames.length > 0 ? (
              <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {activeTaskStats.notFinishedNames.map((name) => (
                  <span
                    key={`missing-${name}`}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-800 shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-700">Everyone has submitted this task.</p>
            )}
          </div>
        </div>
        <div className="space-y-2.5">
          {filteredTasks?.length > 0 ? (
            filteredTasks?.map((task) => (
              <div
                key={task.id}
                className="rounded-md border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-start gap-2.5">
                    <Checkbox
                      className="mt-0.5"
                      checked={selectedDownloadTaskIds.includes(task.id)}
                      disabled={!canBulkDownloadTask(task)}
                      onChange={(event) =>
                        toggleDownloadTaskSelection(task.id, event.target.checked)
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                    <div className="mt-0.5">
                      {getTaskTypeIcon(task?.task?.task_type)}
                    </div>
                    <div className="min-w-0">
                      {task?.submission_type !== "quiz" && (
                        <h3 className="text-base font-semibold text-gray-800 leading-snug">
                          {task?.task?.task_name}
                        </h3>
                      )}
                      {task?.submission_type === "quiz" && (
                        <h3
                          onClick={() => handleViewQuiz(task)}
                          className="cursor-pointer text-base font-semibold leading-snug text-gray-800 hover:underline"
                        >
                          {task?.quiz?.name}
                        </h3>
                      )}
                      <p className="mt-1 text-sm font-semibold text-emerald-700">
                        Student: {getStudentNameForTask(task)}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 pl-2">
                    <span className="whitespace-nowrap text-[11px] text-gray-500">
                      Allocated marks {task?.submission_type === "quiz"
                        ? getWholeMark(getQuizTotalMarks(task))
                        : getWholeMark(task?.task?.allocated_marks)}
                    </span>
                    {currentUser?.role !== "STUDENT" && task?.submission_type !== "quiz" && (
                      <Button
                        size="small"
                        onClick={() => openExamActionModal(task)}
                        className="!h-auto border-emerald-200 !px-2 !py-1 text-xs font-semibold text-emerald-700 hover:!border-emerald-400 hover:!text-emerald-800"
                      >
                        Actions
                      </Button>
                    )}
                    {task?.submission_type === "quiz" ? (
                      <Button
                        size="small"
                        type="text"
                        onClick={() => handleViewQuiz(task)}
                        className="!px-0 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        type="text"
                        onClick={() => setViewingTask(task)}
                        className="!px-0 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>

                {task?.submission_type !== "quiz" ? (
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-gray-600">
                        Self <span className="font-semibold text-blue-700">{getWholeMark(getSelfAssessmentMarkForTask(task))}/{getWholeMark(task?.task?.allocated_marks)}</span>
                      </span>
                      <span className="text-gray-600">
                        Teacher <span className={`font-semibold ${hasTeacherAssessmentScore(task) ? "text-green-700" : "text-orange-500 status-pending-text"}`}>{hasTeacherAssessmentScore(task) ? `${getWholeMark(pickTeacherMarkValue(task))}/${getWholeMark(task?.task?.allocated_marks)}` : "Pending"}</span>
                      </span>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
                      {getTaskActionSummary(task) && (
                        <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">
                          {getTaskActionSummary(task)}
                        </span>
                      )}
                      {hasTeacherAssessmentScore(task) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 font-medium text-green-700">
                          <CheckCircleFilled className="text-green-600" />
                          Marked
                        </span>
                      )}
                      {task?.status && (
                        <span
                          className={`rounded-full px-2 py-1 font-medium ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : task.status === "not_submitted" || task.status === "pending"
                                ? "bg-orange-100 text-orange-700 status-pending-pill"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {task.status === "not_submitted"
                            ? "Not submitted"
                            : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      )}
                      {currentUser?.role !== "STUDENT" && (
                        <Button
                          type="text"
                          size="small"
                          onClick={() =>
                            task?.task?.task_type?.toLowerCase() === "pdf"
                              ? openTeacherDocumentWorkspace(task)
                              : toggleAssessment(task.id)
                          }
                          className={`!h-auto !px-0 text-xs ${
                            assessmentOpenTaskId === task.id
                              ? "text-gray-500"
                              : "text-green-600 hover:text-green-800"
                          }`}
                          disabled={!task?.student_id}
                        >
                          {assessmentOpenTaskId === task.id ? (
                            <span>Hide</span>
                          ) : (
                            <span>
                              {task.status === "not_submitted"
                                ? "View paper"
                                : hasTeacherAssessmentScore(task)
                                  ? "Update Marks"
                                  : "Mark Assessment"}
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-gray-600">
                        Self <span className="font-semibold text-blue-700">{getWholeMark(getSelfAssessmentMarkForTask(task))}{getQuizTotalMarks(task) ? `/${getWholeMark(getQuizTotalMarks(task))}` : ""}</span>
                      </span>
                      <span className="text-gray-600">
                        Teacher <span className={`font-semibold ${hasTeacherQuizMark(task) ? "text-green-700" : "text-orange-500 status-pending-text"}`}>{hasTeacherQuizMark(task) ? `${getWholeMark(task.teacher_assessment_mark)}${getQuizTotalMarks(task) ? `/${getWholeMark(getQuizTotalMarks(task))}` : ""}` : "Pending"}</span>
                      </span>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
                      {hasTeacherQuizMark(task) && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 font-medium text-green-700">
                          <CheckCircleFilled className="text-green-600" />
                          Marked
                        </span>
                      )}
                      {task?.status && (
                        <span
                          className={`rounded-full px-2 py-1 font-medium ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : task.status === "pending"
                                ? "bg-orange-100 text-orange-700 status-pending-pill"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      )}
                      {currentUser?.role !== "STUDENT" && (
                        <Button
                          type="text"
                          size="small"
                          onClick={() => {
                            setQuizTeacherMarkOpenId((prev) =>
                              prev === task.id ? null : task.id
                            );
                            setQuizTeacherMark(
                              String(task?.teacher_assessment_mark ?? "")
                            );
                          }}
                          className={`!h-auto !px-0 text-xs ${
                            quizTeacherMarkOpenId === task.id
                              ? "text-gray-500"
                              : "text-green-600 hover:text-green-800"
                          }`}
                          disabled={!task?.student_id}
                        >
                          {quizTeacherMarkOpenId === task.id ? (
                            <span>Hide</span>
                          ) : (
                            <span>
                              {hasTeacherQuizMark(task)
                                ? "Update Marks"
                                : "Mark Quiz"}
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 leading-relaxed">
                  {task?.teacher_feedback && (
                    <span
                      title={task?.teacher_feedback}
                      className="truncate max-w-[300px] inline-block"
                    >
                      <strong>Teacher Feedback: </strong>
                      {task?.teacher_feedback}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 leading-relaxed">
                  {task?.additional_notes && (
                    <span title={task?.additional_notes} className="break-words">
                      <strong>Student Note: </strong>
                      {renderClickableStudentNote(task?.additional_notes)}
                    </span>
                  )}
                </div>

                {quizTeacherMarkOpenId === task.id && (
                  <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Teacher Marks
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={quizTeacherMark}
                        onChange={(e) => setQuizTeacherMark(e.target.value)}
                        className="w-24"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => setQuizTeacherMarkOpenId(null)}>
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        className="!bg-primary !text-white !border-0"
                        onClick={() => handleQuizTeacherMarkSubmit(task.id)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}

                {assessmentOpenTaskId === task.id && (
                  <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
                    {task?.task?.task_type?.toLowerCase() === "audio" && (
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Student Recording
                        </label>
                        {getStudentSubmissionMediaUrl(task) ? (
                          <audio
                            key={getStudentSubmissionMediaUrl(task)}
                            controls
                            className="w-full"
                            src={getStudentSubmissionMediaUrl(task)}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          <p className="text-gray-500 italic text-sm">
                            No recording submitted.
                          </p>
                        )}
                      </div>
                    )}
                    {task?.task?.task_type?.toLowerCase() === "video" && (
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Student Recording
                        </label>
                        {getStudentSubmissionMediaUrl(task) ? (
                          <video
                            key={getStudentSubmissionMediaUrl(task)}
                            controls
                            className="w-full rounded-lg border"
                            style={{ maxHeight: "400px" }}
                            src={getStudentSubmissionMediaUrl(task)}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <p className="text-gray-500 italic text-sm">
                            No recording submitted.
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Marks
                      </label>
                      <Input
                        placeholder={`0-${task.task.allocated_marks}`}
                        value={formValues.marks}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            (Number(value) >= 0 &&
                              Number(value) <=
                                Number(task.task.allocated_marks))
                          ) {
                            handleInputChange("marks", value);
                            setInputError(false);
                          } else {
                            setInputError(true);
                            setTimeout(() => setInputError(false), 2000);
                          }
                        }}
                        type="number"
                        step="any"
                        min="0"
                        max={task.task.allocated_marks}
                        className={`w-20 ${inputError ? "border-red-500" : ""}`}
                      />
                      {inputError && (
                        <p className="text-red-500 text-xs mt-1">
                          Marks cannot exceed {task.task.allocated_marks}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Feedback Comments
                      </label>
                      <Input.TextArea
                        placeholder="Provide detailed feedback..."
                        value={formValues.feedback}
                        onChange={(e) =>
                          handleInputChange("feedback", e.target.value)
                        }
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setAssessmentOpenTaskId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        className="!bg-primary hover:bg-primary/90 !text-white !border-0"
                        onClick={() => handleAssessmentSubmit(task.id)}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 w-full p-4 shadow border border-gray-200">
              {tasksForSelectedTask.length > 0
                ? "No students found for the selected student filter."
                : "No students have submitted this task yet."}
            </div>
          )}
        </div>
      </div>

      <Modal
        title={`${taskActionIsExam ? "Exam" : "Task"} actions: ${examActionTask?.task?.task_name || "Assessment task"}`}
        open={!!examActionTask}
        onCancel={() => {
          if (!examActionSaving) setExamActionTask(null);
        }}
        footer={[
          <Button
            key="close-exam"
            danger
            loading={examActionSaving}
            onClick={() => handleSaveExamAction({ closeNow: true })}
          >
            {taskActionIsExam ? "Close exam now" : "Close task now"}
          </Button>,
          <Button
            key="cancel"
            disabled={examActionSaving}
            onClick={() => setExamActionTask(null)}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            className="!bg-primary !border-primary"
            loading={examActionSaving}
            onClick={() => handleSaveExamAction()}
          >
            {taskActionIsExam ? "Save / open exam" : "Save due date"}
          </Button>,
        ]}
        width={620}
        centered
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            <p className="font-semibold">Current status</p>
            <p>{examActionCurrentSummary || (taskActionIsExam ? "No exam window is set." : "No due date is set.")}</p>
          </div>

          {taskActionIsExam ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Exam opens at
                  </label>
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    value={
                      examActionValues.examStartAt
                        ? dayjs(examActionValues.examStartAt)
                        : undefined
                    }
                    onChange={(date) =>
                      setExamActionValues((current) => ({
                        ...current,
                        examStartAt: date ? date.format("YYYY-MM-DDTHH:mm:ssZ") : "",
                      }))
                    }
                    disabled={examActionSaving}
                    className="!w-full"
                    format="YYYY-MM-DD HH:mm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Exam duration (minutes)
                  </label>
                  <InputNumber
                    min={1}
                    value={examActionValues.examDurationMinutes}
                    onChange={(value) =>
                      setExamActionValues((current) => ({
                        ...current,
                        examDurationMinutes: Number(value || 1),
                      }))
                    }
                    disabled={examActionSaving}
                    className="!w-full"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="small"
                  onClick={() =>
                    setExamActionValues((current) => ({
                      ...current,
                      examStartAt: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
                      examDurationMinutes: current.examDurationMinutes || 60,
                      openStudentEdits: true,
                    }))
                  }
                  disabled={examActionSaving}
                >
                  Set open time to now
                </Button>
                {examActionEndAt && (
                  <span className="text-xs font-medium text-slate-500">
                    Students can work until {examActionEndAt.format("DD MMM YYYY, HH:mm")}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  {examActionValues.dueDateHasTime ? "Due date and time" : "Due date"}
                </label>
                <DatePicker
                  showTime={examActionValues.dueDateHasTime ? { format: "HH:mm" } : undefined}
                  value={taskActionDueAt || undefined}
                  onChange={(date) =>
                    setExamActionValues((current) => ({
                      ...current,
                      dueDate: date
                        ? formatTaskDueDateValue(date, current.dueDateHasTime)
                        : "",
                    }))
                  }
                  disabled={examActionSaving}
                  className="!w-full"
                  format={examActionValues.dueDateHasTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"}
                />
                <p className="mt-1 text-xs text-slate-500">
                  This task uses {examActionValues.dueDateHasTime ? "a date and time" : "a date-only deadline"}, so the same format will be kept.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="small"
                  onClick={() =>
                    setExamActionValues((current) => ({
                      ...current,
                      dueDate: formatTaskDueDateValue(dayjs(), current.dueDateHasTime),
                    }))
                  }
                  disabled={examActionSaving}
                >
                  {examActionValues.dueDateHasTime ? "Set deadline to now" : "Set due date to today"}
                </Button>
                {taskActionDueAt && (
                  <span className="text-xs font-medium text-slate-500">
                    Students can submit until {taskActionDueAt.format(examActionValues.dueDateHasTime ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY")}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p>
              {taskActionIsExam
                ? "Updating the exam window affects every student for this task."
                : "Updating the due date affects every student for this task."}
              {taskActionIsPdf ? " The checkbox below only opens PDF editing for this card's student." : ""}
            </p>
          </div>

          {taskActionIsPdf && (
            <Checkbox
              checked={examActionValues.openStudentEdits}
              onChange={(event) =>
                setExamActionValues((current) => ({
                  ...current,
                  openStudentEdits: event.target.checked,
                }))
              }
              disabled={examActionSaving || !examActionTask?.student_id}
            >
              Open {examActionTask ? getStudentNameForTask(examActionTask) : "this student"} for PDF edits after saving
            </Checkbox>
          )}
        </div>
      </Modal>

      <Modal
        title={`View Task: ${viewingTask?.task?.task_name}`}
        open={!!viewingTask}
        onCancel={() => setViewingTask(null)}
        footer={null}
        width={700}
        centered
      >
        {viewingTask && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">
                  Max Marks: {getWholeMark(viewingTask.task.allocated_marks)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getTaskTypeIcon(viewingTask.task?.task_type)}
                <span className="text-sm font-medium">
                  {viewingTask.task?.task_type} Task
                </span>
              </div>
            </div>

            {viewingTask.task.description && (
              <div className="mt-2">
                <p className="text-gray-700">{viewingTask.task.description}</p>
              </div>
            )}

            {/* File or URL Preview */}
            <div className="mt-4">
              {viewingTask.task?.task_type.toLowerCase() === "pdf" ? (
                <div className="rounded-lg border bg-gray-50 p-4">
                  <FilePdfOutlined className="mb-2 text-2xl text-red-500" />
                  <p className="mb-3 text-gray-700">
                    Open the answered paper in the marking workspace or download either PDF version directly.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="primary"
                      className="!bg-primary !border-primary"
                      onClick={() => {
                        setViewingTask(null);
                        openTeacherDocumentWorkspace(viewingTask);
                      }}
                    >
                      Open answered PDF
                    </Button>
                    <Button
                      onClick={() => {
                        setViewingTask(null);
                        openTeacherDocumentWorkspace(viewingTask, {
                          autoDownload: true,
                        });
                      }}
                    >
                      Download answered PDF
                    </Button>
                    {getOriginalPdfUrlForTask(viewingTask) && (
                      <a
                        href={getOriginalPdfUrlForTask(viewingTask)}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Download original PDF
                      </a>
                    )}
                  </div>
                  {renderSubmissionAttachmentLinks(viewingTask)}
                </div>
              ) : viewingTask.task?.task_type.toLowerCase() === "video" ? (
                <>
                  {getStudentSubmissionMediaUrl(viewingTask) ? (
                    <video
                      key={getStudentSubmissionMediaUrl(viewingTask)}
                      controls
                      className="w-full rounded-lg border"
                      style={{ maxHeight: "400px" }}
                      src={getStudentSubmissionMediaUrl(viewingTask)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className="text-gray-500 italic">
                      No recording submitted.
                    </p>
                  )}
                  {renderSubmissionAttachmentLinks(
                    viewingTask,
                    getStudentSubmissionMediaUrl(viewingTask)
                  )}
                </>
              ) : viewingTask.task?.task_type.toLowerCase() === "audio" ? (
                <>
                  {getStudentSubmissionMediaUrl(viewingTask) ? (
                    <audio
                      key={getStudentSubmissionMediaUrl(viewingTask)}
                      controls
                      className="w-full"
                      src={getStudentSubmissionMediaUrl(viewingTask)}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <p className="text-gray-500 italic">
                      No recording submitted.
                    </p>
                  )}
                  {renderSubmissionAttachmentLinks(
                    viewingTask,
                    getStudentSubmissionMediaUrl(viewingTask)
                  )}
                </>
              ) : viewingTask.task?.task_type.toLowerCase() === "url" ? (
                <div className="p-4 border rounded-lg bg-blue-50">
                  <LinkOutlined className="text-blue-500 text-2xl mb-2" />
                  <p className="text-gray-700 mb-3">URL Submission</p>
                  <a
                    href={getSubmittedFileUrl(viewingTask)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                  >
                    {getSubmittedFileUrl(viewingTask)}
                  </a>
                </div>
              ) : viewingTask.file_path || viewingTask.file_paths ? (
                renderSubmissionAttachmentLinks(viewingTask) || (
                  <a
                    href={getSubmittedFileUrl(viewingTask)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                )
              ) : (
                <p className="text-gray-500 italic">No file or URL provided.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
