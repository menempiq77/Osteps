"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, Modal, Select, message, Breadcrumb } from "antd";
import {
  AudioOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { addStudentTaskMarks, fetchStudentTasks } from "@/services/api";
import { updateQuizSubmissionTeacherMark } from "@/services/quizApi";
import { fetchStudents } from "@/services/studentsApi";
import Link from "next/link";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { IMG_BASE_URL } from "@/lib/config";

interface Task {
  id: number;
  assessment_id: number;
  task_name: string;
  allocated_marks: string;
  task_type: string;
  description: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

interface StudentAssessmentTask {
  id: number;
  student_id: number;
  assessment_id: number;
  task_id: number;
  task: Task;
  self_assessment_mark: string;
  additional_notes: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  teacher_assessment_score?: string;
  teacher_feedback?: string;
  submission_type: string;
  teacher_assessment_marks?: string;
}

interface StudentOption {
  id: string;
  student_name: string;
}

const toStudentOption = (value: unknown): StudentOption | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, any>;
  const id = row?.id ?? row?.student_id;
  if (id == null || String(id).trim() === "") return null;
  return {
    id: String(id),
    student_name:
      String(
        row?.student_name ??
          row?.name ??
          row?.student?.student_name ??
          row?.student?.name ??
          row?.user?.name ??
          `Student ${id}`
      ).trim() || `Student ${id}`,
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

export default function AssessmentDrawer() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const assessmentId = params.assessmentId;
  const classId = searchParams.get("classId");
  const subjectClassId = searchParams.get("subjectClassId");
  const { activeSubjectId, canUseSubjectContext, toSubjectHref } = useSubjectContext();

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
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [assementTasks, setAssesmentTasks] = useState<StudentAssessmentTask[]>(
    []
  );
  const [inputError, setInputError] = useState(false);
  const [quizTeacherMarkOpenId, setQuizTeacherMarkOpenId] = useState<number | null>(null);
  const [quizTeacherMark, setQuizTeacherMark] = useState<string>("");

  const [formValues, setFormValues] = useState<{
    marks: string;
    feedback: string;
  }>({ marks: "", feedback: "" });

  const loadStudentTasks = async (assessmentId: number) => {
    try {
      setLoading(true);
      const data = await fetchStudentTasks(
        Number(assessmentId),
        canUseSubjectContext ? activeSubjectId ?? undefined : undefined
      );
      setAssesmentTasks(data);
      setError(null);
    } catch (err) {
      setError("Failed to load Assessment Tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!assessmentId) return;
    if (canUseSubjectContext && !activeSubjectId) return;
    loadStudentTasks(Number(assessmentId));
  }, [assessmentId, activeSubjectId, canUseSubjectContext]);

  useEffect(() => {
    if (!assessmentId) return;

    const currentAssessmentId = Number(assessmentId);
    if (!Number.isFinite(currentAssessmentId) || currentAssessmentId <= 0) return;

    const refreshTasks = () => {
      if (canUseSubjectContext && !activeSubjectId) return;
      loadStudentTasks(currentAssessmentId);
    };

    const handleMarkUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ assessmentId?: number }>).detail;
      if (Number(detail?.assessmentId) !== currentAssessmentId) return;
      refreshTasks();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "osteps:assessment-mark-updated" || !event.newValue) return;
      try {
        const payload = JSON.parse(event.newValue) as { assessmentId?: number };
        if (Number(payload?.assessmentId) !== currentAssessmentId) return;
        refreshTasks();
      } catch {
        /* ignore malformed storage events */
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshTasks();
      }
    };

    window.addEventListener("osteps:assessment-mark-updated", handleMarkUpdate as EventListener);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refreshTasks);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("osteps:assessment-mark-updated", handleMarkUpdate as EventListener);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refreshTasks);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [assessmentId, activeSubjectId, canUseSubjectContext]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // Pass 1: with subject_class_id filter
      let studentsData = await fetchStudents(
        classId,
        canUseSubjectContext ? activeSubjectId ?? undefined : undefined,
        subjectClassId ?? undefined
      );
      // Pass 2: if empty and subject_class_id was applied, retry without it
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      loadStudents();
    }
  }, [classId]);

  const handleStudentChange = (value: string) => {
    setSelectedStudentId(value);
  };

  const studentOptions = buildStudentOptions(students, assementTasks);

  useEffect(() => {
    if (studentOptions.length === 0) {
      if (!selectedStudentId) return;
      setSelectedStudentId(null);
      return;
    }

    const hasCurrentSelection = selectedStudentId
      ? studentOptions.some((student) => student.id === String(selectedStudentId))
      : false;
    if (hasCurrentSelection) return;

    const firstSubmitter = assementTasks.find((task) => task?.student_id != null);
    const preferredStudentId =
      firstSubmitter?.student_id != null
        ? String(firstSubmitter.student_id)
        : studentOptions[0]?.id ?? null;

    if (preferredStudentId) {
      setSelectedStudentId(preferredStudentId);
    }
  }, [assementTasks, selectedStudentId, studentOptions]);

  const toggleAssessment = (taskId: number) => {
    setAssessmentOpenTaskId((prev) => (prev === taskId ? null : taskId));
    // Reset form values when opening a new assessment
    if (assessmentOpenTaskId !== taskId) {
      const task = assementTasks.find((t) => t.id === taskId);
      setFormValues({
        marks: task?.teacher_assessment_marks || "",
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
      await updateQuizSubmissionTeacherMark(submissionId, parseInt(quizTeacherMark || "0"));
      message.success("Quiz marks updated");
      setQuizTeacherMarkOpenId(null);
      setQuizTeacherMark("");
      loadStudentTasks(assessmentId);
    } catch (err) {
      message.error("Failed to update quiz marks");
    }
  };

  const handleAssessmentSubmit = async (taskId: number) => {
    try {
      const task = assementTasks.find((t) => t.id === taskId);
      if (!task) return;

      await addStudentTaskMarks(selectedStudentId, {
        assessment_id: task.assessment_id,
        task_id: task.task_id,
        teacher_assessment_marks: parseInt(formValues.marks || "0"),
        teacher_assessment_feedback: formValues.feedback || "",
      });

      message.success("Assessment submitted successfully");
      setAssessmentOpenTaskId(null);
      loadStudentTasks(assessmentId);
    } catch (err) {
      console.error("Failed to submit assessment:", err);
      message.error("Failed to submit assessment");
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

  const filteredTasks = selectedStudentId
    ? assementTasks.filter(
        (task) => task.student_id === Number(selectedStudentId)
      )
    : assementTasks;

  const handleViewQuiz = (task: any) => {
    const params = new URLSearchParams();
    if (classId) params.set("classId", String(classId));
    if (subjectClassId) params.set("subjectClassId", String(subjectClassId));
    const nextHref = `/dashboard/student_assesments/quiz/${task.quiz.id}?${params.toString()}`;
    router.push(canUseSubjectContext && activeSubjectId ? toSubjectHref(nextHref) : nextHref);
  };

  const fileUrlForDocument = (path: string | null | undefined) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const cleanPath = String(path).replace(/^\/+/, "");
    return cleanPath.startsWith("storage/")
      ? `${IMG_BASE_URL}/${cleanPath}`
      : `${IMG_BASE_URL}/storage/${cleanPath}`;
  };

  const openTeacherDocumentWorkspace = (task: StudentAssessmentTask) => {
    const sourcePath = task.task?.file_path || task.file_path;
    const params = new URLSearchParams({
      assessmentId: String(task.assessment_id),
      taskId: String(task.task_id),
      studentId: String(task.student_id),
      role: "teacher",
      fileUrl: fileUrlForDocument(sourcePath),
      title: task.task?.task_name || "PDF Assessment",
      maxMarks: String(task.task?.allocated_marks || 0),
      teacherMarks: String(task.teacher_assessment_score || task.teacher_assessment_marks || ""),
      teacherFeedback: String(task.teacher_feedback || ""),
    });
    router.push(`/dashboard/assessment-document?${params.toString()}`);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-3 md:p-6">
        <Breadcrumb
          items={[
            {
              title: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              title: (
                <Link href={canUseSubjectContext && activeSubjectId ? toSubjectHref("/dashboard/student_assesments") : "/dashboard/student_assesments"}>
                  Assessments
                </Link>
              ),
            },
            {
              title: <span>Tasks</span>,
            },
          ]}
          className="!mb-6"
        />
        <h1 className="font-semibold mb-6">Tasks Submitted by Students</h1>
        <div className="max-w-xs mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Students
          </label>
          <Select
            value={selectedStudentId ?? undefined}
            onChange={handleStudentChange}
            placeholder="Select student"
            style={{ width: "100%" }}
          >
            {studentOptions.map((student) => (
              <Select.Option key={student.id} value={student.id}>
                {student.student_name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="space-y-2.5">
          {filteredTasks?.length > 0 ? (
            filteredTasks?.map((task) => (
              <div
                key={task.id}
                className="rounded-md border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                {/* Task Header */}
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-start gap-2.5">
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
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 pl-2">
                    <span className="whitespace-nowrap text-[11px] text-gray-500">
                      Allocated marks {task?.submission_type === "quiz"
                        ? ((task?.quiz as any)?.quiz_queston?.reduce((sum: number, question: any) => sum + (parseFloat(question?.marks) || 0), 0) || 0)
                        : task?.task?.allocated_marks}
                    </span>
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

                {/* Assessment Summary */}
                {task?.submission_type !== "quiz" ? (
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-gray-600">
                        Self <span className="font-semibold text-blue-700">{task?.self_assessment_mark}/{task?.task?.allocated_marks}</span>
                      </span>
                      <span className="text-gray-600">
                        Teacher <span className="font-semibold text-green-700">{task?.teacher_assessment_score ? `${task?.teacher_assessment_score}/${task?.task?.allocated_marks}` : "Pending"}</span>
                      </span>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
                      {task?.status && (
                        <span
                          className={`rounded-full px-2 py-1 font-medium ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-700"
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
                          onClick={() => toggleAssessment(task.id)}
                          className={`!h-auto !px-0 text-xs ${
                            assessmentOpenTaskId === task.id
                              ? "text-gray-500"
                              : "text-green-600 hover:text-green-800"
                          }`}
                          disabled={!selectedStudentId}
                        >
                          {assessmentOpenTaskId === task.id ? (
                            <span>Hide</span>
                          ) : (
                            <span>
                              {task?.teacher_assessment_score !== null
                                ? "Update Marks"
                                : "Mark Assessment"}
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (() => {
                  const quizTotal = (task?.quiz as any)?.quiz_queston?.reduce((s: number, q: any) => s + (parseFloat(q.marks) || 0), 0) || 0;
                  return (
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
                      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="text-gray-600">
                          Self <span className="font-semibold text-blue-700">{task?.self_assessment_mark ?? "–"}{quizTotal ? `/${quizTotal}` : ""}</span>
                        </span>
                        <span className="text-gray-600">
                          Teacher <span className="font-semibold text-green-700">{task?.teacher_assessment_mark != null ? `${task.teacher_assessment_mark}${quizTotal ? `/${quizTotal}` : ""}` : "Pending"}</span>
                        </span>
                      </div>
                      <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
                        {task?.status && (
                          <span className={`rounded-full px-2 py-1 font-medium ${task.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        )}
                        {currentUser?.role !== "STUDENT" && (
                          <Button
                            type="text"
                            size="small"
                            onClick={() => {
                              setQuizTeacherMarkOpenId(prev => prev === task.id ? null : task.id);
                              setQuizTeacherMark(String(task?.teacher_assessment_mark ?? ""));
                            }}
                            className={`!h-auto !px-0 text-xs ${quizTeacherMarkOpenId === task.id ? "text-gray-500" : "text-green-600 hover:text-green-800"}`}
                            disabled={!selectedStudentId}
                          >
                            {quizTeacherMarkOpenId === task.id ? <span>Hide</span> : <span>{task?.teacher_assessment_mark != null ? "Update Marks" : "Mark Quiz"}</span>}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })()}

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
                    <span
                      title={task?.additional_notes}
                      className="truncate max-w-[300px] inline-block"
                    >
                      <strong>Student Note: </strong>
                      {task?.additional_notes}
                    </span>
                  )}
                </div>

                {/* Quiz Teacher Mark Form */}
                {quizTeacherMarkOpenId === task.id && (
                  <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Teacher Marks</label>
                      <Input
                        type="number" min="0"
                        value={quizTeacherMark}
                        onChange={(e) => setQuizTeacherMark(e.target.value)}
                        className="w-24"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => setQuizTeacherMarkOpenId(null)}>Cancel</Button>
                      <Button type="primary" className="!bg-primary !text-white !border-0" onClick={() => handleQuizTeacherMarkSubmit(task.id)}>Save</Button>
                    </div>
                  </div>
                )}

                {/* Assessment Form */}
                {assessmentOpenTaskId === task.id && (
                  <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
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
                        className="hover:bg-gray-100"
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
              {assementTasks.length > 0
                ? "No tasks found for the selected student."
                : "No tasks found."}
            </div>
          )}
        </div>
      </div>

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
                  Max Marks: {viewingTask.task.allocated_marks}
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
                <div className="p-4 border rounded-lg bg-gray-50">
                  <FilePdfOutlined className="text-red-500 text-2xl mb-2" />
                  <p className="text-gray-700 mb-3">
                    PDF document available for online marking or download
                  </p>
                  <Button
                    type="primary"
                    className="mb-3 !bg-primary !border-primary"
                    onClick={() => openTeacherDocumentWorkspace(viewingTask)}
                  >
                    Mark online on PDF
                  </Button>
                  <a
                    href={`https://dashboard.osteps.com/${viewingTask.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Download PDF
                  </a>
                </div>
              ) : viewingTask.task?.task_type.toLowerCase() === "video" ? (
                <video
                  controls
                  className="w-full rounded-lg border"
                  style={{ maxHeight: "400px" }}
                >
                  <source
                    src={`https://dashboard.osteps.com/${viewingTask.file_path}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : viewingTask.task?.task_type.toLowerCase() === "audio" ? (
                <audio controls className="w-full">
                  <source
                    src={`https://dashboard.osteps.com/${viewingTask.file_path}`}
                    type="audio/mpeg"
                  />
                  Your browser does not support the audio element.
                </audio>
              ) : viewingTask.task?.task_type.toLowerCase() === "url" ? (
                <div className="p-4 border rounded-lg bg-blue-50">
                  <LinkOutlined className="text-blue-500 text-2xl mb-2" />
                  <p className="text-gray-700 mb-3">URL Submission</p>
                  <a
                    href={viewingTask.task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                  >
                    {viewingTask.task.url}
                  </a>
                </div>
              ) : viewingTask.file_path ? (
                <a
                  href={`https://dashboard.osteps.com/${viewingTask.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View File
                </a>
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
