"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Alert, Breadcrumb, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import PdfAssessmentAnnotator from "@/components/assessment/PdfAssessmentAnnotator";
import type { AssessmentDocumentLayer } from "@/services/documentAssessmentApi";
import { fetchStudentTasks, fetchTasks } from "@/services/api";
import { fetchStudentProfileData } from "@/services/studentsApi";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { IMG_BASE_URL } from "@/lib/config";
import { resolveExamWindow } from "@/lib/taskTypeMetadata";
import dayjs from "dayjs";
import type { RootState } from "@/store/store";

const asRole = (value: string | null): AssessmentDocumentLayer =>
  value === "teacher" ? "teacher" : "student";

type AssessmentDocumentStudentTask = {
  id?: number | string;
  student_id?: number | string;
  student_name?: string;
  name?: string;
  status?: string;
  assessment_id?: number | string;
  task_id?: number | string;
  task?: {
    id?: number | string;
    task_name?: string;
    allocated_marks?: number | string;
    file_path?: string | null;
  } | null;
  file_path?: string | null;
  teacher_assessment_score?: number | string | null;
  teacher_assessment_marks?: number | string | null;
  teacher_feedback?: string | null;
  student?: { student_name?: string; name?: string } | null;
  students?: { student_name?: string; name?: string; first_name?: string; last_name?: string } | null;
  user?: { name?: string } | null;
};

type TeacherStudentOption = {
  value: string;
  label: string;
  status?: string;
};

const isPlaceholderStudentName = (value: string) =>
  !value.trim() || /^selected student$/i.test(value.trim());

const getStudentNameFromProfile = (profile: any) => {
  const directName = String(
    profile?.student_name ??
      profile?.name ??
      profile?.user_name ??
      profile?.user?.name ??
      ""
  ).trim();
  if (!isPlaceholderStudentName(directName)) return directName;

  const combinedName = [profile?.first_name, profile?.middle_name, profile?.last_name]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");
  return isPlaceholderStudentName(combinedName) ? "" : combinedName;
};

const getStudentNameFromTask = (
  task: AssessmentDocumentStudentTask,
  resolvedNamesById?: Record<string, string>
) => {
  const studentId = task.student_id == null ? "" : String(task.student_id);
  const resolvedName = studentId ? resolvedNamesById?.[studentId] : "";
  if (resolvedName && !isPlaceholderStudentName(resolvedName)) return resolvedName;

  const directName = String(
    task.student_name ??
      task.name ??
      task.student?.student_name ??
      task.student?.name ??
      task.students?.student_name ??
      task.students?.name ??
      task.user?.name ??
      ""
  ).trim();
  if (!isPlaceholderStudentName(directName)) return directName;

  const combinedName = [task.students?.first_name, task.students?.last_name]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");
  if (!isPlaceholderStudentName(combinedName)) return combinedName;

  return studentId ? `Student ${studentId}` : "Student";
};

const fileUrlForDocument = (path: string | null | undefined) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = String(path).replace(/^\/+/, "");
  return cleanPath.startsWith("storage/")
    ? `${IMG_BASE_URL}/${cleanPath}`
    : `${IMG_BASE_URL}/storage/${cleanPath}`;
};

export default function AssessmentDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, activeSubject, canUseSubjectContext } = useSubjectContext();
  const assessmentId = searchParams.get("assessmentId") || "";
  const taskId = searchParams.get("taskId") || "";
  const role = asRole(searchParams.get("role"));
  const requestedStudentId = searchParams.get("studentId") || "";
  const requestedStudentName = String(searchParams.get("studentName") || "").trim();
  const authenticatedStudentId = String(currentUser?.student || "").trim();
  const studentId = role === "student" ? authenticatedStudentId : requestedStudentId;
  const fileUrl = searchParams.get("fileUrl") || "";
  const title = searchParams.get("title") || "PDF Assessment";
  const maxMarksParam = searchParams.get("maxMarks");
  const maxMarks = maxMarksParam ? Number(maxMarksParam) : undefined;
  const initialSelfAssessmentMarkParam = searchParams.get("selfAssessmentMark");
  const initialSelfAssessmentMark =
    initialSelfAssessmentMarkParam != null && initialSelfAssessmentMarkParam !== ""
      ? Number(initialSelfAssessmentMarkParam)
      : null;
  const returnTo = searchParams.get("returnTo");
  const teacherMarks = searchParams.get("teacherMarks") || "";
  const teacherFeedback = searchParams.get("teacherFeedback") || "";
  const autoDownloadTeacherPaper = role === "teacher" && searchParams.get("autoDownload") === "1";
  const fallbackExamMode = searchParams.get("examMode") === "1";
  const fallbackExamStartAt = searchParams.get("examStartAt") || null;
  const fallbackExamDurationMinutes = searchParams.get("examDurationMinutes");
  const fallbackExamEndAt = searchParams.get("examEndAt") || null;
  const fallbackExamConfig = useMemo(
    () => ({
      exam_mode: fallbackExamMode,
      exam_start_at: fallbackExamStartAt,
      exam_duration_minutes: fallbackExamDurationMinutes
        ? Number(fallbackExamDurationMinutes)
        : null,
      exam_end_at: fallbackExamEndAt,
    }),
    [
      fallbackExamDurationMinutes,
      fallbackExamEndAt,
      fallbackExamMode,
      fallbackExamStartAt,
    ]
  );
  const [resolvedExamConfig, setResolvedExamConfig] = useState(fallbackExamConfig);
  const [checkingExamAccess, setCheckingExamAccess] = useState(role === "student");
  const [teacherStudentTasks, setTeacherStudentTasks] = useState<AssessmentDocumentStudentTask[]>([]);
  const [teacherStudentTasksLoading, setTeacherStudentTasksLoading] = useState(false);
  const [teacherStudentNamesById, setTeacherStudentNamesById] = useState<Record<string, string>>({});

  const waitingForStudentSession = role === "student" && !authenticatedStudentId;
  const missing = !assessmentId || !taskId || !studentId || !fileUrl;
  const examWindow = resolveExamWindow(resolvedExamConfig);
  const isStudentExamRoute = role === "student" && (fallbackExamMode || resolvedExamConfig.exam_mode);

  useEffect(() => {
    if (role !== "student" || !authenticatedStudentId || !requestedStudentId) return;
    if (String(requestedStudentId) === String(authenticatedStudentId)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("studentId", authenticatedStudentId);
    router.replace(`/dashboard/assessment-document?${params.toString()}`);
  }, [authenticatedStudentId, requestedStudentId, role, router, searchParams]);

  useEffect(() => {
    setResolvedExamConfig(fallbackExamConfig);
  }, [fallbackExamConfig]);

  useEffect(() => {
    if (role !== "teacher" || !assessmentId || !taskId) {
      setTeacherStudentTasks([]);
      setTeacherStudentTasksLoading(false);
      return;
    }

    let cancelled = false;

    const loadTeacherStudentTasks = async () => {
      setTeacherStudentTasksLoading(true);
      try {
        const rows = await fetchStudentTasks(
          Number(assessmentId),
          canUseSubjectContext ? activeSubjectId : undefined
        );
        if (cancelled) return;
        const matchingRows = (rows || []).filter((row: AssessmentDocumentStudentTask) => {
          const rowTaskId = row.task_id ?? row.task?.id;
          return String(rowTaskId) === String(taskId);
        });
        setTeacherStudentTasks(matchingRows);
      } catch (error) {
        console.error("Failed to load student papers for assessment document:", error);
        if (!cancelled) setTeacherStudentTasks([]);
      } finally {
        if (!cancelled) setTeacherStudentTasksLoading(false);
      }
    };

    void loadTeacherStudentTasks();

    return () => {
      cancelled = true;
    };
  }, [activeSubjectId, assessmentId, canUseSubjectContext, role, taskId]);

  useEffect(() => {
    if (role !== "teacher" || teacherStudentTasks.length === 0) return;

    const missingNameIds = Array.from(
      new Set(
        teacherStudentTasks
          .map((task) => String(task.student_id ?? "").trim())
          .filter(Boolean)
          .filter((id) => {
            if (teacherStudentNamesById[id]) return false;
            const task = teacherStudentTasks.find((row) => String(row.student_id) === id);
            if (!task) return false;
            return /^student \d+$/i.test(getStudentNameFromTask(task));
          })
      )
    );

    if (missingNameIds.length === 0) return;

    let cancelled = false;
    const loadNames = async () => {
      const entries = await Promise.all(
        missingNameIds.slice(0, 80).map(async (id) => {
          try {
            const profile = await fetchStudentProfileData(id, canUseSubjectContext ? activeSubjectId : undefined);
            const name = getStudentNameFromProfile(profile);
            return name ? ([id, name] as const) : null;
          } catch {
            return null;
          }
        })
      );
      if (cancelled) return;
      const nextNames = Object.fromEntries(entries.filter(Boolean) as Array<readonly [string, string]>);
      if (Object.keys(nextNames).length > 0) {
        setTeacherStudentNamesById((current) => ({ ...current, ...nextNames }));
      }
    };

    void loadNames();

    return () => {
      cancelled = true;
    };
  }, [activeSubjectId, canUseSubjectContext, role, teacherStudentNamesById, teacherStudentTasks]);

  useEffect(() => {
    if (missing || role !== "student") {
      setCheckingExamAccess(false);
      return;
    }

    let cancelled = false;

    const loadTaskConfig = async () => {
      setCheckingExamAccess(true);
      try {
        const tasks = await fetchTasks(Number(assessmentId));
        const matchingTask = tasks.find(
          (task: any) => Number(task?.id) === Number(taskId) && task?.type === "task"
        );

        if (!cancelled && matchingTask) {
          setResolvedExamConfig({
            exam_mode: Boolean(matchingTask.exam_mode),
            exam_start_at: matchingTask.exam_start_at || null,
            exam_duration_minutes: matchingTask.exam_duration_minutes ?? null,
            exam_end_at: matchingTask.exam_end_at || null,
          });
        }
      } catch (error) {
        console.error("Failed to verify exam schedule:", error);
      } finally {
        if (!cancelled) setCheckingExamAccess(false);
      }
    };

    void loadTaskConfig();

    return () => {
      cancelled = true;
    };
  }, [assessmentId, missing, role, taskId]);

  const getExamAccessMessage = () => {
    if (!examWindow.examMode) return null;
    if (examWindow.state === "scheduled" && examWindow.startAt) {
      return `This exam opens on ${dayjs(examWindow.startAt).format("DD MMM YYYY, HH:mm")}.`;
    }
    if (examWindow.state === "ended") {
      return "This exam window has ended.";
    }
    if (examWindow.state === "invalid") {
      return "This exam has incomplete timing settings. Ask your teacher to update the task.";
    }
    return null;
  };

  const teacherStudentOptions = useMemo<TeacherStudentOption[]>(() => {
    const byId = new Map<string, TeacherStudentOption>();
    for (const task of teacherStudentTasks) {
      const optionStudentId = task.student_id;
      if (optionStudentId == null || String(optionStudentId).trim() === "") continue;
      const value = String(optionStudentId);
      if (byId.has(value)) continue;
      byId.set(value, {
        value,
        label: getStudentNameFromTask(task, teacherStudentNamesById),
      });
    }
    if (
      role === "teacher" &&
      studentId &&
      requestedStudentName &&
      !isPlaceholderStudentName(requestedStudentName) &&
      !byId.has(String(studentId))
    ) {
      byId.set(String(studentId), {
        value: String(studentId),
        label: requestedStudentName,
        status: "draft",
      });
    }
    return Array.from(byId.values()).sort((left, right) => left.label.localeCompare(right.label));
  }, [requestedStudentName, role, studentId, teacherStudentNamesById, teacherStudentTasks]);

  const currentTeacherStudentTask = useMemo(() => {
    return teacherStudentTasks.find((task) => String(task.student_id) === String(studentId)) || null;
  }, [studentId, teacherStudentTasks]);

  const currentTeacherStudentName = useMemo(() => {
    if (currentTeacherStudentTask) return getStudentNameFromTask(currentTeacherStudentTask, teacherStudentNamesById);
    return teacherStudentOptions.find((option) => option.value === studentId)?.label || requestedStudentName || undefined;
  }, [currentTeacherStudentTask, requestedStudentName, studentId, teacherStudentNamesById, teacherStudentOptions]);

  const handleTeacherStudentChange = (nextStudentId: string) => {
    const nextTask = teacherStudentTasks.find((task) => String(task.student_id) === String(nextStudentId));
    if (!nextTask) return;

    const sourcePath = nextTask.task?.file_path || nextTask.file_path || "";
    const params = new URLSearchParams(searchParams.toString());
    params.set("assessmentId", String(nextTask.assessment_id || assessmentId));
    params.set("taskId", String(nextTask.task_id || taskId));
    params.set("studentId", String(nextTask.student_id));
    params.set("studentName", getStudentNameFromTask(nextTask, teacherStudentNamesById));
    params.set("role", "teacher");
    params.set("fileUrl", fileUrlForDocument(sourcePath) || fileUrl);
    params.set("title", nextTask.task?.task_name || title || "PDF Assessment");
    params.set("maxMarks", String(nextTask.task?.allocated_marks || maxMarks || 0));
    params.set("teacherMarks", String(nextTask.teacher_assessment_score || nextTask.teacher_assessment_marks || ""));
    params.set("teacherFeedback", String(nextTask.teacher_feedback || ""));
    params.delete("autoDownload");
    router.push(`/dashboard/assessment-document?${params.toString()}`);
  };

  return (
    <div className={isStudentExamRoute ? "bg-slate-100" : "min-h-screen bg-slate-100"}>
      {!isStudentExamRoute && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <Breadcrumb
            items={[
              { title: <Link href="/dashboard">Dashboard</Link> },
              { title: <span>Online PDF Assessment</span> },
            ]}
            className="!mb-3"
          />
        </div>
      )}

      {waitingForStudentSession ? (
        <div className={isStudentExamRoute ? "flex items-center justify-center gap-3 p-8" : "mx-auto flex max-w-3xl items-center justify-center gap-3 p-8"}>
          <Spin />
          <span className="text-sm text-gray-600">Checking student session...</span>
        </div>
      ) : missing ? (
        <div className={isStudentExamRoute ? "p-4" : "mx-auto max-w-3xl p-4"}>
          <Alert
            type="error"
            showIcon
            message="Cannot open the online PDF workspace"
            description="Missing assessment, task, student or file information. Open it again from the assessment task page."
          />
        </div>
      ) : checkingExamAccess ? (
        <div className={isStudentExamRoute ? "flex items-center justify-center gap-3 p-8" : "mx-auto flex max-w-3xl items-center justify-center gap-3 p-8"}>
          <Spin />
          <span className="text-sm text-gray-600">Checking exam access...</span>
        </div>
      ) : role === "student" && examWindow.examMode && examWindow.state !== "open" ? (
        <div className={isStudentExamRoute ? "p-4" : "mx-auto max-w-3xl p-4"}>
          <Alert
            type={examWindow.state === "ended" ? "warning" : "info"}
            showIcon
            message="This exam is not currently open"
            description={getExamAccessMessage()}
          />
        </div>
      ) : (
        <PdfAssessmentAnnotator
          assessmentId={assessmentId}
          taskId={taskId}
          studentId={studentId}
          role={role}
          fileUrl={fileUrl}
          title={title}
          maxMarks={Number.isFinite(maxMarks) ? maxMarks : undefined}
          initialSelfAssessmentMark={
            Number.isFinite(initialSelfAssessmentMark ?? NaN)
              ? initialSelfAssessmentMark
              : null
          }
          initialTeacherMarks={teacherMarks}
          initialTeacherFeedback={teacherFeedback}
          examMode={resolvedExamConfig.exam_mode}
          examStartAt={resolvedExamConfig.exam_start_at || undefined}
          examDurationMinutes={resolvedExamConfig.exam_duration_minutes ?? undefined}
          examEndAt={resolvedExamConfig.exam_end_at || undefined}
          returnTo={returnTo}
          currentStudentName={role === "teacher" ? currentTeacherStudentName : undefined}
          subjectName={activeSubject?.name}
          studentSwitcherOptions={role === "teacher" ? teacherStudentOptions : undefined}
          studentSwitcherLoading={teacherStudentTasksLoading}
          onStudentChange={role === "teacher" ? handleTeacherStudentChange : undefined}
          autoDownloadTeacherPaper={autoDownloadTeacherPaper}
        />
      )}
    </div>
  );
}
