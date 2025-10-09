"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import AssignmentDrawer from "@/components/ui/AssignmentDrawer";
import { Breadcrumb, Button, Spin, Tooltip } from "antd";
import { fetchTasks } from "@/services/api";

interface Task {
  id: number;
  assessment_id: number;
  task_name: string;
  description: string;
  allocated_marks: string;
  task_type: string;
  url: string | null;
  created_at: string;
  updated_at: string;
  due_date: string;
  status?: string;
  mark?: string;
  comment?: string;
  type?: string;
  self_assessment_marks?: number;
  teacher_assessment_marks?: number;
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.Id as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const isDueDateExpired = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);

    // Reset times to midnight
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await fetchTasks(assignmentId);
      const tasksWithStatus = fetchedTasks?.map((task: Task) => ({
        ...task,
        status: task.status || "not-started",
      }));
      console.log(tasksWithStatus, "tasksWithStatus");
      setTasks(tasksWithStatus);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [assignmentId]);

  const handleOpenDrawer = async (task: Task) => {
    if (task.type === "quiz") {
      await router.push(
        `/dashboard/students/assignments/${assignmentId}/task-quiz/${task?.quiz?.id}`
      );
    } else {
      setSelectedTask(task);
      setIsDrawerOpen(true);
    }
  };
  const handleMarkAsComplete = async (task: Task) => {
    try {
      setLoading(true);

      // Example API call — replace with your actual endpoint
      await fetch(`/api/tasks/${task.id}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      // Update local state so UI updates instantly
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: "completed" } : t))
      );
    } catch (error) {
      console.error("Failed to mark task complete:", error);
    } finally {
      setLoading(false);
    }
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
            {tasks?.length} task{tasks?.length !== 1 ? "s" : ""} in this
            assessment
          </p>
        </div>

        {tasks?.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center shadow-sm">
            <p className="text-gray-500">No tasks found for this assessment</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks?.map((task, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-1">
                        {task?.task_name || task?.quiz?.name || "Untitled Task"}
                      </h3>
                      {task?.type !== "quiz" && (
                        <p className="font-normal text-base text-gray-700 mb-1">
                          {task.description || "No description provided."}
                        </p>
                      )}
                    </div>
                    {task?.type !== "quiz" && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-3 text-sm">
                    {/* Show Marks Info */}
                    {task?.type !== "quiz" && (
                      <div className="text-sm flex items-center gap-3">
                        {task?.task_type !== "url" && (
                          <>
                            <div>
                              <span className="text-gray-500">
                                Self Assessment:
                              </span>
                              <span className="ml-2 font-medium">
                                {task?.self_assessment_marks || 0} /{" "}
                                {task?.allocated_marks || 0}
                              </span>
                            </div>
                            <div className="text-gray-300">|</div>
                          </>
                        )}

                        <div>
                          <span className="text-gray-500">
                            Teacher Assessment:
                          </span>
                          <span className="ml-2 font-medium">
                            {task?.teacher_assessment_marks || 0} /{" "}
                            {task?.allocated_marks || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {task.url && (
                    <div className="mt-3">
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                      >
                        View attached document
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
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
                    </div>
                  )}
                </div>

                <div className="bg-green-50 px-5 py-3 flex justify-between">
                   <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium">
                        {task?.type !== "quiz" ? task?.task_type : "Quiz"}
                      </span>
                    </div>

                  {/* If task type is URL → show Mark as Complete */}
                  {task?.task_type === "url" ? (
                    <Button
                      type="default"
                      className={`flex items-center gap-1 !bg-primary !border-primary !text-white`}
                      onClick={() => handleMarkAsComplete(task)}
                      disabled={task.status === "completed"}
                    >
                      {task.status === "completed"
                        ? "Completed"
                        : "Mark as Complete"}
                    </Button>
                  ) : isDueDateExpired(task.due_date) &&
                    task.status !== "completed" ? (
                    <Tooltip title="The due date for this task has expired">
                      <Button
                        type="default"
                        className="flex items-center gap-1"
                        disabled
                      >
                        {task?.type !== "quiz" ? "Submit Work" : "View Quiz"}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      type="default"
                      className={`flex items-center gap-1 !bg-primary !border-primary !text-white`}
                      onClick={() => handleOpenDrawer(task)}
                    >
                      {task.status === "completed"
                        ? "View Submission"
                        : `${
                            task?.type !== "quiz" ? "Submit Work" : "View Quiz"
                          }`}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AssignmentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedSubject={selectedTask?.task_name || "Task"}
        selectedTask={selectedTask}
        assessmentId={assignmentId}
      />
    </div>
  );
}
