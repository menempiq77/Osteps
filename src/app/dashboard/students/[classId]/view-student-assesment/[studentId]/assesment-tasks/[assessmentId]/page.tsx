"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, Modal, Rate, Select, message } from "antd";
import { useForm } from "react-hook-form";
import {
  AudioOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { addStudentTaskMarks, fetchStudentTasks } from "@/services/api";
import { fetchStudents } from "@/services/studentsApi";

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

export default function AssessmentDrawer() {
  const router = useRouter();
  const { classId, assessmentId } = useParams();
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
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [assementTasks, setAssesmentTasks] = useState<StudentAssessmentTask[]>(
    []
  );
  const [inputError, setInputError] = useState(false);

  const [formValues, setFormValues] = useState<{
    marks: string;
    feedback: string;
  }>({ marks: "", feedback: "" });

  const loadStudentTasks = async (assessmentId: number) => {
    try {
      setLoading(true);
      const data = await fetchStudentTasks(assessmentId);
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
    loadStudentTasks(assessmentId);
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await fetchStudents(classId);
      setStudents(studentsData);
      if (studentsData.length > 0) {
        setSelectedStudentId(studentsData[0].id);
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
      default:
        return null;
    }
  };

  const filteredTasks = assementTasks.filter(
    (task) => task.student_id === Number(selectedStudentId)
  );

  const handleViewQuiz = (task: any) => {
    router.push(
      `/dashboard/students/${classId}/view-student-assesment/${selectedStudentId}/quiz/${task.quiz.id}`
    );
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-3 md:p-6">
        <h1 className="font-semibold mb-6">Tasks Submitted by Students</h1>
        <div className="max-w-xs mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Students
          </label>
          <Select
            value={selectedStudentId}
            onChange={handleStudentChange}
            placeholder="Select student"
            style={{ width: "100%" }}
          >
            {students.map((student) => (
              <Select.Option key={student.id} value={student.id}>
                {student.student_name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="space-y-3">
          {filteredTasks?.length > 0 ? (
            filteredTasks?.map((task) => (
              <div
                key={task.id}
                className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Task Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getTaskTypeIcon(task?.task?.task_type)}
                    </div>
                    <div>
                      {task?.submission_type !== "quiz" && (
                        <h3 className="text-base font-semibold text-gray-800 ">
                          {task?.task?.task_name}
                        </h3>
                      )}
                      {task?.submission_type === "quiz" && (
                        <h3
                          onClick={() => handleViewQuiz(task)}
                          className="text-base font-semibold text-gray-800 cursor-pointer hover:underline"
                        >
                          {task?.quiz?.name}
                        </h3>
                      )}
                      {task?.submission_type !== "quiz" && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Allocated Marks:{" "}
                            <span className="font-medium">
                              {task?.task?.allocated_marks}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="small"
                    type="text"
                    onClick={() => setViewingTask(task)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Button>
                </div>

                {/* Assessment Summary */}
                {task?.submission_type !== "quiz" && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Student Assessment */}
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-700">
                          SELF
                        </span>
                        <span className="text-xs font-medium text-blue-700">
                          {task?.self_assessment_mark}/
                          {task?.task?.allocated_marks}
                        </span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{
                            width: `${
                              (parseInt(task?.self_assessment_mark || "0") /
                                parseInt(task?.task?.allocated_marks)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Teacher Assessment */}
                    <div
                      className={`p-3 rounded-md border ${
                        task?.teacher_assessment_marks
                          ? "bg-green-50 border-green-100"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          TEACHER
                        </span>
                        {task?.teacher_assessment_score ? (
                          <span className="text-sm font-semibold text-green-600">
                            {task?.teacher_assessment_score}/
                            {task?.task?.allocated_marks}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">Pending</span>
                        )}
                      </div>
                      {task?.teacher_assessment_score ? (
                        <div className="w-full bg-green-100 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{
                              width: `${
                                (parseInt(
                                  task?.teacher_assessment_score || "0"
                                ) /
                                  parseInt(task?.task?.allocated_marks)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      ) : (
                        <div className="w-full bg-gray-200 rounded-full h-1.5"></div>
                      )}
                    </div>
                  </div>
                )}

                {task?.submission_type === "quiz" && (
                  <div className="bg-primary inline py-0.5 text-white text-sm rounded-full px-3 ">
                    {task?.submission_type}
                  </div>
                )}

                {/* Assessment Form Toggle */}
                {task?.submission_type !== "quiz" && (
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <div className="text-sm text-gray-500">
                      {task?.additional_notes && (
                        <span className="truncate max-w-[180px] inline-block">
                          {task?.additional_notes}
                        </span>
                      )}
                    </div>
                    {currentUser?.role !== "STUDENT" && (
                      <Button
                        type="text"
                        size="small"
                        onClick={() => toggleAssessment(task.id)}
                        className={`text-sm ${
                          assessmentOpenTaskId === task.id
                            ? "text-gray-500"
                            : "text-green-600 hover:text-green-800"
                        }`}
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
                )}

                {/* Assessment Form */}
                {assessmentOpenTaskId === task.id && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          min="0"
                          max={task.task.allocated_marks}
                          className={`w-20 ${
                            inputError ? "border-red-500" : ""
                          }`}
                        />
                        {inputError && (
                          <p className="text-red-500 text-xs mt-1">
                            Marks cannot exceed {task.task.allocated_marks}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
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
              No tasks found for this student.
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

            {viewingTask?.file_path && (
              <div className="mt-4">
                {viewingTask.task?.task_type.toLowerCase() === "pdf" ? (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <FilePdfOutlined className="text-red-500 text-2xl mb-2" />
                    <p className="text-gray-700 mb-3">
                      PDF document available for download
                    </p>
                    <a
                      href={viewingTask.file_path}
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
                    <source src={viewingTask.file_path} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : viewingTask.task?.task_type.toLowerCase() === "audio" ? (
                  <audio controls className="w-full">
                    <source src={viewingTask.file_path} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <a
                    href={viewingTask.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
