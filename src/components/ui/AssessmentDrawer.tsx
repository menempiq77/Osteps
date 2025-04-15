"use client";
import React, { useState } from "react";
import { Drawer, Input, Button, Modal, Rate } from "antd";
import { useForm } from "react-hook-form";
import {
  AudioOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

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
  selfRating?: number;
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
      selfRating: 7,
      mark: "8",
      comment: "Good effort, but needs improvement in clarity.",
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
      selfRating: 6,
      mark: "",
      comment: "",
    },
    {
      id: 3,
      name: "Recitation",
      isAudio: true,
      isVideo: false,
      isPdf: false,
      dueDate: "2023-05-25",
      fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      selfRating: 8,
      mark: "",
      comment: "",
    },
    {
      id: 4,
      name: "Tajweed",
      isAudio: false,
      isVideo: true,
      isPdf: false,
      dueDate: "2023-05-25",
      fileUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      selfRating: 7,
      mark: "",
      comment: "",
    },
  ]);

  const [assessmentOpenTaskId, setAssessmentOpenTaskId] = useState<
    number | null
  >(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

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

  const getTaskTypeIcon = (task: Task) => {
    if (task.isAudio) return <AudioOutlined className="text-blue-500" />;
    if (task.isVideo)
      return <VideoCameraOutlined className="text-purple-500" />;
    if (task.isPdf) return <FilePdfOutlined className="text-red-500" />;
    return null;
  };

  return (
    <>
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{selectedSubject}</span>
            <span className="text-sm text-gray-500">{tasks.length} tasks</span>
          </div>
        }
        placement="right"
        onClose={onClose}
        open={isOpen}
        width={500}
      >
        <div className="space-y-4">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Task Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getTaskTypeIcon(task)}</div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        {task.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          <span className="font-medium">Due:</span>{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
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
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Student Assessment */}
                  <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-blue-700">
                        SELF
                      </span>
                      <span className="text-xs font-medium text-blue-700">
                        {task.selfRating}/10
                      </span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${(task.selfRating || 0) * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Teacher Assessment */}
                  <div
                    className={`p-3 rounded-md border ${
                      task.mark
                        ? "bg-green-50 border-green-100"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        TEACHER
                      </span>
                      {task.mark ? (
                        <span className="text-sm font-semibold text-green-600">
                          {task.mark}/10
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Pending</span>
                      )}
                    </div>
                    {task.mark ? (
                      <div className="w-full bg-green-100 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${parseInt(task.mark) * 10}%` }}
                        ></div>
                      </div>
                    ) : (
                      <div className="w-full bg-gray-200 rounded-full h-1.5"></div>
                    )}
                  </div>
                </div>

                {/* Assessment Form Toggle */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <div className="text-sm text-gray-500">
                    {task.comment && (
                      <span className="truncate max-w-[180px] inline-block">
                        {task.comment}
                      </span>
                    )}
                  </div>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => toggleAssessment(task.id)}
                    className={`text-sm ${
                      assessmentOpenTaskId === task.id
                        ? "text-gray-500"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    {assessmentOpenTaskId === task.id ? (
                      <span className="flex items-center gap-1">
                        <span>Hide Assessment</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span>{task.mark ? "Update Assessment" : "Add Assessment"}</span>
                      </span>
                    )}
                  </Button>
                </div>

                {/* Assessment Form */}
                {assessmentOpenTaskId === task.id && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assessment Score
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          placeholder="0-10"
                          value={task.mark || ""}
                          onChange={(e) =>
                            updateTaskAssessment(
                              task.id,
                              "mark",
                              e.target.value
                            )
                          }
                          type="number"
                          min="0"
                          max="10"
                          className="w-20"
                        />
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${parseInt(task.mark || "0") * 10}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback Comments
                      </label>
                      <Input.TextArea
                        placeholder="Provide detailed feedback..."
                        value={task.comment || ""}
                        rows={3}
                        onChange={(e) =>
                          updateTaskAssessment(
                            task.id,
                            "comment",
                            e.target.value
                          )
                        }
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
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Submit Assessment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Drawer>

      <Modal
        title={`View Task: ${viewingTask?.name}`}
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
                  Due: {new Date(viewingTask.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getTaskTypeIcon(viewingTask)}
                <span className="text-sm font-medium">
                  {viewingTask.isAudio
                    ? "Audio"
                    : viewingTask.isVideo
                    ? "Video"
                    : "PDF"}{" "}
                  Task
                </span>
              </div>
            </div>

            {viewingTask.isAudio && (
              <div className="mt-4">
                <audio controls className="w-full">
                  <source src={viewingTask.fileUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {viewingTask.isVideo && (
              <div className="mt-4">
                <video
                  controls
                  className="w-full rounded-lg border"
                  style={{ maxHeight: "400px" }}
                >
                  <source src={viewingTask.fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {viewingTask.isPdf && (
              <div className="mt-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <FilePdfOutlined className="text-red-500 text-2xl mb-2" />
                  <p className="text-gray-700 mb-3">
                    PDF document available for download
                  </p>
                  <a
                    href={viewingTask.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
