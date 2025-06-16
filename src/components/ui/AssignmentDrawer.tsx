"use client";
import React, { useState } from "react";
import { Drawer, Button, Form, message, InputNumber } from "antd";
import {
  UploadOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { uploadTaskByStudent } from "@/services/api";

interface Task {
  id: string;
  name: string;
  type: "audio" | "video" | "pdf";
  url?: string;
  status: string;
  mark?: string;
  comment?: string;
  selfAssessment?: number;
  allocated_marks: number;
  task_type?: string;
}

interface AssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject: string;
  selectedTask?: Task | null;
  assessmentId?: number;
}

const AssignmentDrawer: React.FC<AssignmentDrawerProps> = ({
  isOpen,
  onClose,
  selectedSubject,
  selectedTask,
  assessmentId,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log("Selected file:", selectedFile);
      setFile(selectedFile)
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (values: any) => {
    if (!file) {
      message.error("Please upload a file before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("task_id", selectedTask?.id || "");
      formData.append("self_assessment_mark", values.selfAssessment.toString());
      formData.append("additional_notes", values.notes || "");
      formData.append("file_path", file); // Ensure the file is appended

      await uploadTaskByStudent(formData, assessmentId);

      message.success("Assignment submitted successfully!");
      onClose();
      form.resetFields(); // Reset form on success
      setFile(null); // Reset file state
    } catch (error) {
      console.error("Error submitting assignment:", error);
      message.error("Failed to submit assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFileIcon = () => {
    if (!selectedTask) return null;

    switch (selectedTask.type) {
      case "audio":
        return <PlayCircleOutlined className="text-blue-500 text-4xl" />;
      case "video":
        return <PlayCircleOutlined className="text-purple-500 text-4xl" />;
      case "pdf":
        return <FilePdfOutlined className="text-red-500 text-4xl" />;
      default:
        return <FileTextOutlined className="text-gray-500 text-4xl" />;
    }
  };

  const renderFilePreview = () => {
    if (!selectedTask?.url) return null;

    switch (selectedTask.type) {
      case "audio":
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <audio controls className="w-full">
              <source src={selectedTask.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case "video":
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <video controls className="w-full" style={{ maxHeight: 400 }}>
              <source src={selectedTask.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "pdf":
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FilePdfOutlined className="text-red-500 text-2xl mr-2" />
              <a
                href={selectedTask.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Submitted PDF
              </a>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderUploadArea = () => {
    if (selectedTask?.status === "completed") return null;

    return (
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-400"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            {renderFileIcon()}
            <div className="text-center">
              <p className="font-medium text-gray-700">
                {file
                  ? file.name
                  : `Drag & drop your ${selectedTask?.task_type} file here`}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : `or click to browse files (${selectedTask?.task_type?.toUpperCase()} only)`}
              </p>
            </div>
          </div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept={
              selectedTask?.type === "audio"
                ? "audio/*"
                : selectedTask?.type === "video"
                ? "video/*"
                : "application/pdf"
            }
          />
          <div className="mt-4">
            {file ? (
              <Button
                type="default"
                danger
                onClick={removeFile}
                className="mr-2"
              >
                Remove File
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="!bg-primary !border-primary"
              >
                <UploadOutlined /> Select File
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span className="font-medium">{selectedSubject}</span>
          <span className="text-sm font-normal text-gray-500">
            {selectedTask?.name}
          </span>
        </div>
      }
      placement="right"
      onClose={() => {
        form.resetFields();
        setFile(null);
        onClose();
      }}
      open={isOpen}
      width={600}
      footer={
        selectedTask?.status !== "completed" ? (
          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isSubmitting}
              className="w-full !bg-primary !border-primary"
            >
              Submit Assignment
            </Button>
          </div>
        ) : null
      }
    >
      {selectedTask && (
        <div className="space-y-6 h-full flex flex-col">
          <div>
            <h4 className="font-medium text-gray-800">Task Description</h4>
            <p className="text-gray-600">{selectedTask.name}</p>
          </div>

          {selectedTask.status === "completed" ? (
            <>
              <div>
                <h4 className="font-medium text-gray-800">Your Submission</h4>
                {renderFilePreview()}
              </div>

              {selectedTask.selfAssessment && (
                <div>
                  <h4 className="font-medium text-gray-800">Self Assessment</h4>
                  <p className="text-gray-600">{selectedTask.selfAssessment}</p>
                </div>
              )}

              {selectedTask.mark && (
                <div>
                  <h4 className="font-medium text-gray-800">Grade</h4>
                  <p className="text-gray-600">{selectedTask.mark}</p>
                </div>
              )}

              {selectedTask.comment && (
                <div>
                  <h4 className="font-medium text-gray-800">Feedback</h4>
                  <p className="text-gray-600">{selectedTask.comment}</p>
                </div>
              )}
            </>
          ) : (
            // In the Form section of the AssignmentDrawer component
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1">
                <div className="mb-8">{renderUploadArea()}</div>

                {/* Add self-assessment field */}
                <Form.Item
                  label={`Self-Assessment (Rate your work out of ${selectedTask.allocated_marks})`}
                  name="selfAssessment"
                  rules={[
                    { required: true, message: "Please rate your work" },
                    {
                      type: "number",
                      min: 0,
                      max: selectedTask?.allocated_marks,
                      message: `Rating must be between 0 and ${selectedTask.allocated_marks}`,
                    },
                  ]}
                  className="mt-4"
                >
                  <InputNumber
                    min={0}
                    max={selectedTask.allocated_marks}
                    step={0.5}
                    className="w-full"
                    placeholder={`Enter your rating (0-${selectedTask.allocated_marks})`}
                    style={{
                      width: "100%",
                    }}
                    onKeyPress={(e) => {
                      const value = parseFloat(e.currentTarget.value + e.key);
                      if (
                        isNaN(value) ||
                        value > selectedTask.allocated_marks
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Additional Notes"
                  name="notes"
                  className="mt-4"
                >
                  <textarea
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    placeholder="Explain your rating or add any comments..."
                  />
                </Form.Item>
              </div>
            </Form>
          )}
        </div>
      )}
    </Drawer>
  );
};

export default AssignmentDrawer;
