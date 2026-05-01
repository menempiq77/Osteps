"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Alert, Breadcrumb, Spin } from "antd";
import { useSearchParams } from "next/navigation";
import PdfAssessmentAnnotator from "@/components/assessment/PdfAssessmentAnnotator";
import type { AssessmentDocumentLayer } from "@/services/documentAssessmentApi";
import { fetchTasks } from "@/services/api";
import { resolveExamWindow } from "@/lib/taskTypeMetadata";
import dayjs from "dayjs";

const asRole = (value: string | null): AssessmentDocumentLayer =>
  value === "teacher" ? "teacher" : "student";

export default function AssessmentDocumentPage() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId") || "";
  const taskId = searchParams.get("taskId") || "";
  const studentId = searchParams.get("studentId") || "";
  const role = asRole(searchParams.get("role"));
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

  const missing = !assessmentId || !taskId || !studentId || !fileUrl;
  const examWindow = resolveExamWindow(resolvedExamConfig);
  const isStudentExamRoute = role === "student" && (fallbackExamMode || resolvedExamConfig.exam_mode);

  useEffect(() => {
    setResolvedExamConfig(fallbackExamConfig);
  }, [fallbackExamConfig]);

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

      {missing ? (
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
        />
      )}
    </div>
  );
}
