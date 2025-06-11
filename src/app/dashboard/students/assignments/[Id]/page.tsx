"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, CalendarIcon } from "@radix-ui/react-icons";
import { useParams } from "next/navigation";
import AssignmentDrawer from "@/components/ui/AssignmentDrawer";
import { Alert, Button, Card, Spin } from "antd";
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
  status?: string;
  mark?: string;
  comment?: string;
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const assignmentId = params.Id as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await fetchTasks(assignmentId);
      const tasksWithStatus = fetchedTasks?.map((task: Task) => ({
        ...task,
        status: task.status || "not-started",
      }));
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

  const handleOpenDrawer = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="p-3 md:p-6">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      </div>
    );

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto">
      <Link href="/dashboard/students/assignments/">
        <Button
          icon={<ChevronLeftIcon />}
          className="mb-6 text-gray-700 border border-gray-300 hover:bg-gray-100 flex items-center gap-1"
        >
          Back to Assessments
        </Button>
      </Link>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Tasks</h2>
          <p className="text-gray-500 text-sm mt-1">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} in this
            assessment
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center shadow-sm">
            <p className="text-gray-500">No tasks found for this assessment</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks?.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900 mb-1">
                        {task.task_name}
                      </h3>
                      <p className="font-normal text-base text-gray-700 mb-1">
                        {task.description || "No description provided."}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        <span>
                          Due: {new Date(task.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        task.status || "not-started"
                      )}`}
                    >
                      {(task.status || "not-started")?.replace("-", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium">{task.task_type}</span>
                    </div>
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

                  {(task.mark || task.comment) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {task.mark && (
                        <div className="mb-2">
                          <span className="text-gray-500">Grade:</span>
                          <span className="ml-2 font-medium">{task.mark}</span>
                        </div>
                      )}
                      {task.comment && (
                        <div>
                          <span className="text-gray-500">Feedback:</span>
                          <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">
                            {task.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className={`bg-green-50 px-5 py-3 flex justify-end ${
                    !!task?.url && "hidden"
                  }`}
                >
                  <Button
                    type={task.status === "completed" ? "default" : "primary"}
                    className="flex items-center gap-1 !bg-primary !border-primary !text-white"
                    onClick={() => handleOpenDrawer(task)}
                  >
                    {task.status === "completed"
                      ? "View Submission"
                      : "Submit Work"}
                  </Button>
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
      />
    </div>
  );
}
