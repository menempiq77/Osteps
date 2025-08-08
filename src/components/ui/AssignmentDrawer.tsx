"use client";
import React, { useState } from "react";
import {
  Drawer,
  Button,
  Form,
  message,
  InputNumber,
  Upload,
  UploadFile,
} from "antd";
import {
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputError, setInputError] = useState(false);

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    // Reset file list to only include the new file
    setFileList([
      {
        uid: file.name,
        name: file.name,
        status: "done",
        originFileObj: file,
      },
    ]);
    return false;
  };

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      messageApi.error("Please upload a file before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const file = fileList[0].originFileObj;

      formData.append("task_id", selectedTask?.id || "");
      formData.append("self_assessment_mark", values.selfAssessment.toString());
      formData.append("additional_notes", values.notes || "");
      if (file) {
        formData.append("file_path", file);
      }

      const response = await uploadTaskByStudent(formData, assessmentId);

      if (response?.status_code === 409) {
        messageApi.warning(response.message || "You have already submitted this task.");
        return;
      }

      messageApi.success("Task submitted successfully!");
      onClose();
      form.resetFields();
      setFileList([]);
    } catch (error: any) {
      // In case server throws error instead of returning JSON
      if (error?.response?.status_code === 409) {
        messageApi.warning("You have already submitted this task.");
      } else {
        console.error("Error submitting Task:", error);
        messageApi.error("Failed to submit Task. Please try again.");
      }
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

    const acceptType =
      selectedTask?.task_type === "audio"
        ? "audio/*"
        : selectedTask?.task_type === "video"
        ? "video/*"
        : "application/pdf";

    const hasFile = fileList.length > 0;
    const file = hasFile ? fileList[0] : null;

    return (
      <div className="space-y-4">
        <Upload.Dragger
          name="file"
          multiple={false}
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleFileChange}
          accept={acceptType}
          className="p-8"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            {renderFileIcon()}
            <div className="text-center">
              <p className="font-medium text-gray-700">
                {hasFile
                  ? file?.name
                  : `Drag & drop your ${selectedTask?.task_type} file here`}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {hasFile && file?.size
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : `or click to browse files (${selectedTask?.task_type?.toUpperCase()} only)`}
              </p>
            </div>
          </div>
        </Upload.Dragger>
      </div>
    );
  };

  return (
    <>
      {contextHolder}
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
          setFileList([]);
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
                    <h4 className="font-medium text-gray-800">
                      Self Assessment
                    </h4>
                    <p className="text-gray-600">
                      {selectedTask.selfAssessment}
                    </p>
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
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="flex-1 flex flex-col"
              >
                <div className="flex-1">
                  <div className="mb-8">{renderUploadArea()}</div>

                  <Form.Item
                    label={`Self-Assessment (Rate your work out of ${selectedTask.allocated_marks})`}
                    name="selfAssessment"
                    rules={[
                      { required: true, message: "Please rate your work" },
                    ]}
                    className="mt-4"
                  >
                    <div>
                      <InputNumber
                        min={0}
                        max={selectedTask.allocated_marks}
                        step={0.5}
                        className={`w-full ${
                          inputError ? "border-red-500" : ""
                        }`}
                        placeholder={`Enter your rating (0-${selectedTask.allocated_marks})`}
                        style={{ width: "100%" }}
                        onChange={(value) => {
                          if (
                            value === null ||
                            (value >= 0 &&
                              value <= selectedTask.allocated_marks)
                          ) {
                            setInputError(false);
                          } else {
                            setInputError(true);
                            setTimeout(() => setInputError(false), 2000);
                          }
                        }}
                        onKeyPress={(e) => {
                          const currentValue =
                            form.getFieldValue("selfAssessment") || 0;
                          const newValue = parseFloat(
                            currentValue.toString() + e.key
                          );
                          if (
                            isNaN(newValue) ||
                            newValue > selectedTask.allocated_marks
                          ) {
                            e.preventDefault();
                            setInputError(true);
                            setTimeout(() => setInputError(false), 2000);
                          }
                        }}
                      />
                      {inputError && (
                        <p className="text-red-500 text-xs mt-1">
                          Rating must be between 0 and{" "}
                          {selectedTask.allocated_marks}
                        </p>
                      )}
                    </div>
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
    </>
  );
};

export default AssignmentDrawer;
