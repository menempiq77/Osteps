"use client";
import React, { useState } from "react";
import { Drawer, Input, Button, Modal } from "antd";
import { useForm } from "react-hook-form";

interface Task {
  id: number;
  name: string;
  isAudio: boolean;
  isVideo: boolean;
  isPdf: boolean;
  dueDate: string;
  mark?: string;
  comment?: string;
  fileUrl?: string;
}

interface AssessmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject: string;
}

export default function AssessmentDrawer({
  isOpen,
  onClose,
  selectedSubject,
}: AssessmentDrawerProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Memorisation",
      isAudio: true,
      isVideo: false,
      isPdf: false,
      dueDate: "2023-05-15",
      fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: 2,
      name: "Extraction & Summarization",
      isAudio: false,
      isVideo: false,
      isPdf: true,
      dueDate: "2023-05-20",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 3,
      name: "Recitation",
      isAudio: true,
      isVideo: false,
      isPdf: false,
      dueDate: "2023-05-25",
      fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: 4,
      name: "Tajweed",
      isAudio: false,
      isVideo: true,
      isPdf: false,
      dueDate: "2023-05-25",
      fileUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ]);

  const [assessmentOpenTaskId, setAssessmentOpenTaskId] = useState<
    number | null
  >(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<Omit<Task, "id">>();

  const toggleAssessment = (taskId: number) => {
    setAssessmentOpenTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const updateTaskAssessment = (
    taskId: number,
    field: "mark" | "comment",
    value: string
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, [field]: value } : task
      )
    );
  };

  const getTaskTypeClass = (task: Task) => {
    if (task.isAudio) return "bg-blue-100 text-blue-800";
    if (task.isVideo) return "bg-purple-100 text-purple-800";
    if (task.isPdf) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getTaskTypeLabel = (task: Task) => {
    if (task.isAudio) return "Audio";
    if (task.isVideo) return "Video";
    if (task.isPdf) return "PDF";
    return "Other";
  };

  return (
    <>
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span>{selectedSubject}</span>
          </div>
        }
        placement="right"
        onClose={onClose}
        open={isOpen}
        width={500}
      >
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">
            Tasks for this assesment:
          </h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{task.name}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getTaskTypeClass(
                      task
                    )}`}
                  >
                    {getTaskTypeLabel(task)}
                  </span>
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>

                <div className="mt-2 flex gap-4">
                  <Button
                    size="small"
                    type="link"
                    onClick={() => toggleAssessment(task.id)}
                    className="p-0"
                  >
                    {assessmentOpenTaskId === task.id
                      ? "Hide Assessment"
                      : "Add Assessment"}
                  </Button>

                  <Button
                    size="small"
                    type="link"
                    onClick={() => setViewingTask(task)}
                    className="p-0"
                  >
                    View
                  </Button>
                </div>

                {assessmentOpenTaskId === task.id && (
                  <div className="mt-3 space-y-2">
                    <div className="mb-2">
                      <Input
                        placeholder="Enter mark"
                        value={task.mark || ""}
                        onChange={(e) =>
                          updateTaskAssessment(task.id, "mark", e.target.value)
                        }
                      />
                    </div>
                    <Input.TextArea
                      placeholder="Enter comment"
                      value={task.comment || ""}
                      rows={3}
                      onChange={(e) =>
                        updateTaskAssessment(task.id, "comment", e.target.value)
                      }
                    />
                    <div className="flex justify-end pt-4">
                      <Button type="primary">Submit Assessment</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      {/* View Modal */}
      <Modal
        title={`View: ${viewingTask?.name}`}
        open={!!viewingTask}
        onCancel={() => setViewingTask(null)}
        footer={null}
        width={600}
        centered
      >
        {viewingTask?.isAudio && (
          <audio controls className="w-full">
            <source src={viewingTask.fileUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {viewingTask?.isVideo && (
          <video controls className="w-full mt-2" style={{ maxHeight: 400 }}>
            <source src={viewingTask.fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {viewingTask?.isPdf && (
          <div className="mt-4">
            <p className="text-gray-700 mb-2">
              Click below to download the PDF:
            </p>
            <a
              href={viewingTask.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="text-blue-600 underline"
            >
              {viewingTask.fileUrl}
            </a>
          </div>
        )}
      </Modal>
    </>
  );
}
