"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import AssignmentDrawer from "@/components/ui/AssignmentDrawer";
import { Breadcrumb, Button, Spin, Tooltip } from "antd";
import { fetchTasks } from "@/services/api";
import { fetchAssessmentDocument } from "@/services/documentAssessmentApi";
import { requestDocumentFullscreenFromGesture } from "@/lib/browserFullscreen";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IMG_BASE_URL } from "@/lib/config";
import dayjs from "dayjs";
import { resolveExamWindow } from "@/lib/taskTypeMetadata";

interface Task {
  id: number;
  assessment_id: number;
  task_name: string;
  description: string;
  allocated_marks: string;
  task_type: string;
  task_type_config?: unknown;
  url: string | null;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  exam_mode?: boolean;
  exam_start_at?: string | null;
  exam_duration_minutes?: number | null;
  exam_end_at?: string | null;
  status?: string;
  mark?: string;
  comment?: string;
  type?: string;
  self_assessment_marks?: number;
  teacher_assessment_marks?: number;
  teacher_feedback?: string;
  file_path?: string;
}
interface CurrentUser {
  student?: string;
}

const ONLINE_DOCUMENT_TYPES = new Set([
  "pdf",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
]);

const normalizeMarkValue = (value: unknown) => {
  if (value == null || value === "") return null;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const getCurrentReturnToPath = () => {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}`;
};

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.Id as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };
  const studentId = currentUser?.student;

  const isDueDateExpired = (dueDate?: string | null) => {
    if (!dueDate) return false;

    const today = new Date();
    const due = new Date(dueDate);

    if (Number.isNaN(due.getTime())) {
      return false;
    }

    // Reset times to midnight
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  const hydrateTaskSelfAssessmentMark = async (
    task: any,
    fallbackSelfAssessmentMark: unknown
  ) => {
    const normalizedFallback = normalizeMarkValue(fallbackSelfAssessmentMark);
    const taskType = String(task?.task_type || "").toLowerCase();

    if (
      task?.type !== "task" ||
      !studentId ||
      !task?.file_path ||
      !ONLINE_DOCUMENT_TYPES.has(taskType)
    ) {
      return normalizedFallback;
    }

    try {
      const documentState = await fetchAssessmentDocument(assignmentId, task.id, studentId);
      const savedSelfAssessmentMark = normalizeMarkValue(
        documentState?.metadata?.selfAssessmentMark
      );
      return savedSelfAssessmentMark ?? normalizedFallback;
    } catch (error) {
      console.error("Could not load saved self mark for task card:", error);
      return normalizedFallback;
    }
  };

  const mapTaskWithStudentData = async (task: any) => {
    if (task.type === "task") {
      const studentTask = task.student_assessment_tasks?.find(
        (st: any) => st.student_id === studentId
      );
      const selfAssessmentMark = await hydrateTaskSelfAssessmentMark(
        task,
        studentTask?.self_assessment_mark
      );

      return {
        ...task,
        status: studentTask?.status || "not-started",
        self_assessment_marks: selfAssessmentMark ?? 0,
        additional_notes: studentTask?.additional_notes || "",
        teacher_assessment_marks: studentTask?.teacher_assessment_score || 0,
        teacher_feedback: studentTask?.teacher_feedback || null,
      };
    }

    if (task.type === "quiz" && task.quiz) {
      const submission = task.quiz.submissions?.find(
        (sub: any) => sub.student_id === studentId
      );

      const totalMarks = submission?.answers?.reduce(
        (sum: number, ans: any) => sum + (parseFloat(ans.marks) || 0),
        0
      );

      const totalPossibleMarks = task.quiz.quiz_queston?.reduce(
        (sum: number, q: any) => sum + (parseFloat(q.marks) || 0),
        0
      );

      const comments =
        submission?.answers
          ?.filter((a: any) => a.comment)
          ?.map((a: any) => {
            const question = task.quiz.quiz_queston?.find(
              (q: any) => q.id === a.quiz_question_id
            );
            return {
              question_id: a.quiz_question_id,
              question_text: question?.question_text || "Untitled question",
              comment: a.comment,
            };
          }) || [];

      return {
        ...task,
        status: submission?.status || "not-started",
        obtained_marks: totalMarks || 0,
        total_marks: totalPossibleMarks || 0,
        quiz_comments: comments,
        self_assessment_marks: submission?.self_assessment_mark ?? null,
        teacher_assessment_marks: submission?.teacher_assessment_mark ?? null,
      };
    }

    return task;
  };

  const enrichTasksWithStudentData = async (fetchedTasks: any[] | null | undefined) => {
    return Promise.all((fetchedTasks || []).map((task) => mapTaskWithStudentData(task)));
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await fetchTasks(assignmentId);

      const tasksWithStudentData = await enrichTasksWithStudentData(fetchedTasks);

      console.log(tasksWithStudentData, "tasksWithStudentData");
      setTasks(tasksWithStudentData);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [assignmentId, studentId]);

  const loadTasksSilently = async () => {
    try {
      const fetchedTasks = await fetchTasks(assignmentId);
      const tasksWithStudentData = await enrichTasksWithStudentData(fetchedTasks);
      setTasks(tasksWithStudentData);
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    }
  };

  const buildOnlineDocumentHref = (task: Task) => {
    const params = new URLSearchParams({
      assessmentId: String(assignmentId),
      taskId: String(task.id),
      studentId: String(studentId || ""),
      role: "student",
      fileUrl: `${IMG_BASE_URL}/storage/${task.file_path}`,
      title: task.task_name || "Online Assessment",
      maxMarks: String(task.allocated_marks || 0),
    });

    const returnTo = getCurrentReturnToPath();
    if (returnTo) {
      params.set("returnTo", returnTo);
    }

    if (task.self_assessment_marks != null && task.self_assessment_marks !== "") {
      params.set("selfAssessmentMark", String(task.self_assessment_marks));
    }

    if (task.exam_mode) {
      params.set("examMode", "1");
      if (task.exam_start_at) params.set("examStartAt", task.exam_start_at);
      if (task.exam_duration_minutes != null) {
        params.set("examDurationMinutes", String(task.exam_duration_minutes));
      }
      if (task.exam_end_at) params.set("examEndAt", task.exam_end_at);
    }

    return `/dashboard/assessment-document?${params.toString()}`;
  };

  const supportsOnlineAnswer = (task: Task) => {
    const taskType = String(task?.task_type || "").toLowerCase();
    return Boolean(task.file_path && studentId && ONLINE_DOCUMENT_TYPES.has(taskType));
  };

  const getExamAccessMessage = (task: Task) => {
    const examWindow = resolveExamWindow(task);
    if (!examWindow.examMode) return null;
    if (examWindow.state === "scheduled" && examWindow.startAt) {
      return `Exam opens ${dayjs(examWindow.startAt).format("DD MMM YYYY, HH:mm")}`;
    }
    if (examWindow.state === "ended") {
      return "This exam window has ended.";
    }
    if (examWindow.state === "invalid") {
      return "Exam timing needs to be fixed by your teacher.";
    }
    return null;
  };

  const handleOpenOnlineDocument = async (task: Task) => {
    const href = buildOnlineDocumentHref(task);
    const examWindow = resolveExamWindow(task);

    if (task.exam_mode && examWindow.state === "open") {
      await requestDocumentFullscreenFromGesture();
    }

    router.push(href);
  };

  const handleOpenDrawer = async (task: Task) => {
    if (task.type === "quiz") {
      router.push(`/dashboard/students/assignments/${assignmentId}/task-quiz/${task?.quiz?.id}`);
    } else {
      const examWindow = resolveExamWindow(task);
      if (supportsOnlineAnswer(task) && task.exam_mode && examWindow.state === "open") {
        await handleOpenOnlineDocument(task);
        return;
      }
      setSelectedTask(task);
      setIsDrawerOpen(true);
    }
  };
  const getStatusBadge = (status: string = "not-completed") => {
    const isCompleted = status.toLowerCase() === "completed";

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          isCompleted
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {isCompleted ? "Completed" : "Not Completed"}
      </span>
    );
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: (
              <Link href="/dashboard/students/assignments">Assesments</Link>
            ),
          },
          {
            title: <span>Tasks</span>,
          },
        ]}
        className="!mb-2"
      />

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Tasks</h2>
          <p className="text-gray-500 text-sm mt-1">
            {tasks?.length || 0} task{tasks?.length !== 1 ? "s" : ""} in this
            assessment
          </p>
        </div>

        {tasks?.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center shadow-sm">
            <p className="text-gray-500">No tasks found for this assessment</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks?.map((task, index) => {
              const examWindow = resolveExamWindow(task);
              const examAccessMessage = getExamAccessMessage(task);
              const onlineAnswerAvailable = supportsOnlineAnswer(task);
              const dueDateApplies = !task.exam_mode;
              const examAccessBlocked =
                onlineAnswerAvailable && examWindow.examMode && examWindow.state !== "open";
              const actionDisabledReason =
                dueDateApplies &&
                isDueDateExpired(task.due_date) &&
                task.status !== "completed"
                  ? "The due date for this task has expired"
                  : examAccessMessage;
              const actionLabel =
                task?.type === "quiz"
                  ? "View Quiz"
                  : task.exam_mode && onlineAnswerAvailable
                  ? task.status === "completed"
                    ? "Continue Exam"
                    : examAccessBlocked
                    ? examWindow.state === "scheduled"
                      ? "Exam Locked"
                      : "Exam Closed"
                    : "Open Exam"
                  : task.status === "completed" && !isDueDateExpired(task.due_date)
                  ? "Edit Submission"
                  : task.status === "completed"
                  ? "Submitted"
                  : "Submit Work";

              return (
                <div
                  key={index}
                  className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold leading-snug text-gray-900">
                        {task?.task_name || task?.quiz?.name || "Untitled Task"}
                    </h3>
                    {task?.type !== "quiz" && (
                      <p className="mt-1 text-sm text-gray-600">
                        {task.description || "No description provided."}
                      </p>
                    )}
                    {task?.type !== "quiz" && (
                      task.exam_mode ? (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-700">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {examWindow.startAt
                              ? `Exam opens ${dayjs(examWindow.startAt).format("DD MMM YYYY, HH:mm")}`
                              : "Scheduled exam"}
                            {examWindow.endAt
                              ? ` and closes ${dayjs(examWindow.endAt).format("DD MMM YYYY, HH:mm")}`
                              : ""}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Due {new Date(task.due_date || "").toLocaleDateString()}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="shrink-0 pl-2 text-right">
                    <div className="text-[11px] text-gray-500">
                      Allocated marks {task?.type === "quiz" ? task?.total_marks || 0 : task?.allocated_marks || 0}
                    </div>
                    <div className="mt-2 flex justify-end">{getStatusBadge(task.status)}</div>
                  </div>
                </div>

                {(task.file_path || task.url) && (
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {task.file_path && !task.exam_mode && (
                      <>
                        <a
                          href={`${IMG_BASE_URL}/storage/${task.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          Attached document
                        </a>
                        {onlineAnswerAvailable && !examAccessBlocked && (
                          <Button
                            size="small"
                            type="link"
                            className="!h-auto !px-0 text-xs"
                            onClick={() => void handleOpenOnlineDocument(task)}
                          >
                            Answer online
                          </Button>
                        )}
                      </>
                    )}
                    {task.file_path && task.exam_mode && (
                      <span className="text-xs font-medium text-amber-700">
                        This exam document opens only inside exam mode.
                      </span>
                    )}
                    {examAccessMessage && (
                      <span className="text-xs font-medium text-amber-700">
                        {examAccessMessage}
                      </span>
                    )}
                    {task.url && !task.exam_mode && (
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        View attached document
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-gray-100 pt-2 text-sm">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-gray-600">
                      {task.type === "quiz" ? (
                        <>
                          <span>
                            Quiz marks <span className="font-semibold text-gray-900">{task?.obtained_marks || 0} / {task?.total_marks || 0}</span>
                          </span>
                          {task?.self_assessment_marks != null && (
                            <span>
                              Self <span className="font-semibold text-blue-700">{task.self_assessment_marks} / {task?.total_marks || 0}</span>
                            </span>
                          )}
                          {task?.teacher_assessment_marks != null && (
                            <span>
                              Teacher <span className="font-semibold text-green-700">{task.teacher_assessment_marks} / {task?.total_marks || 0}</span>
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span>
                            Self <span className="font-semibold text-blue-700">{task?.self_assessment_marks || 0} / {task?.allocated_marks || 0}</span>
                          </span>
                          <span>
                            Teacher <span className="font-semibold text-green-700">{task?.teacher_assessment_marks || 0} / {task?.allocated_marks || 0}</span>
                          </span>
                        </>
                      )}
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      Type: {task?.type === "quiz"
                        ? "Quiz"
                        : !task?.task_type || task?.task_type === "null"
                        ? "N/A"
                        : task.exam_mode && task.task_type === "pdf"
                        ? "PDF EXAM"
                        : task.task_type.toUpperCase()}
                    </span>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    {actionDisabledReason ? (
                      <Tooltip title={actionDisabledReason}>
                        <Button
                          size="small"
                          type="default"
                          className="!h-8 rounded-md"
                          disabled
                        >
                          {actionLabel}
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button
                        size="small"
                        type="primary"
                        className="!h-8 rounded-md"
                        onClick={() => handleOpenDrawer(task)}
                        disabled={
                          !task.exam_mode &&
                          task.status === "completed" &&
                          isDueDateExpired(task.due_date)
                        }
                      >
                        {actionLabel}
                      </Button>
                    )}
                  </div>
                </div>

                {task?.quiz_comments?.length > 0 && (
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <strong className="block text-gray-800">Comments:</strong>
                    {task?.quiz_comments?.map((c: any, idx: number) => (
                      <div key={idx} className="mb-1">
                        <p className="font-medium text-gray-800">
                          Q{idx + 1}: {c.question_text}
                        </p>
                        <p className="border-l border-gray-300 pl-2 text-gray-600">
                          💬 {c.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {task.teacher_feedback && (
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Teacher Feedback:</strong> {task.teacher_feedback}
                  </p>
                )}

                {task.additional_notes && (
                  <p className="mt-1 text-sm text-gray-600">
                    <strong>Student Note:</strong> {task.additional_notes}
                  </p>
                )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AssignmentDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          void loadTasksSilently();
        }}
        selectedSubject={selectedTask?.task_name || "Task"}
        selectedTask={selectedTask}
        assessmentId={assignmentId}
        canEditSubmission={
          !!selectedTask &&
          selectedTask?.type !== "quiz" &&
          !selectedTask?.exam_mode &&
          !isDueDateExpired(selectedTask?.due_date)
        }
      />
    </div>
  );
}
