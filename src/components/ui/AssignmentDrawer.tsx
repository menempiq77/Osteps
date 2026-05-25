"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { IMG_BASE_URL } from "@/lib/config";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { requestDocumentFullscreenFromGesture } from "@/lib/browserFullscreen";
import { resolveExamWindow } from "@/lib/taskTypeMetadata";

interface Task {
  id: string;
  name: string;
  type: "audio" | "video" | "pdf" | "url";
  url?: string;
  status: string;
  mark?: string;
  comment?: string;
  selfAssessment?: number;
  self_assessment_marks?: number;
  additional_notes?: string;
  allocated_marks: number;
  task_type?: string;
  task_type_config?: unknown;
  assessment_id?: number;
  description?: string;
  file_path?: string;
  exam_mode?: boolean;
  exam_start_at?: string | null;
  exam_duration_minutes?: number | null;
  exam_end_at?: string | null;
}

interface AssignmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject: string;
  selectedTask?: Task | null;
  assessmentId?: number;
  canEditSubmission?: boolean;
}

const getCurrentReturnToPath = () => {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}`;
};

const AssignmentDrawer: React.FC<AssignmentDrawerProps> = ({
  isOpen,
  onClose,
  selectedSubject,
  selectedTask,
  assessmentId,
  canEditSubmission = false,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputError, setInputError] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser?: { student?: string | number };
  };

  const isNATask =
    !selectedTask?.task_type || selectedTask?.task_type === "null";
  const examWindow = resolveExamWindow(selectedTask);
  const isOnlineExamTask = Boolean(
    selectedTask?.exam_mode && selectedTask?.task_type === "pdf" && selectedTask?.file_path
  );

  const buildOnlinePdfHref = () => {
    if (!selectedTask?.file_path || !assessmentId) return "#";
    const params = new URLSearchParams({
      assessmentId: String(assessmentId),
      taskId: String(selectedTask.id),
      studentId: String(currentUser?.student || ""),
      role: "student",
      fileUrl: `${IMG_BASE_URL}/storage/${selectedTask.file_path}`,
      title: selectedTask.name || "PDF Assessment",
      maxMarks: String(selectedTask.allocated_marks || 0),
    });

    const returnTo = getCurrentReturnToPath();
    if (returnTo) {
      params.set("returnTo", returnTo);
    }

    const existingSelfAssessment =
      selectedTask.selfAssessment ?? selectedTask.self_assessment_marks ?? undefined;
    if (existingSelfAssessment != null && String(existingSelfAssessment) !== "") {
      params.set("selfAssessmentMark", String(existingSelfAssessment));
    }

    if (selectedTask.exam_mode) {
      params.set("examMode", "1");
      if (selectedTask.exam_start_at) {
        params.set("examStartAt", selectedTask.exam_start_at);
      }
      if (selectedTask.exam_duration_minutes != null) {
        params.set(
          "examDurationMinutes",
          String(selectedTask.exam_duration_minutes)
        );
      }
      if (selectedTask.exam_end_at) {
        params.set("examEndAt", selectedTask.exam_end_at);
      }
    }

    return `/dashboard/assessment-document?${params.toString()}`;
  };

  const handleOpenOnlinePdf = async () => {
    const href = buildOnlinePdfHref();
    if (!href || href === "#") return;

    if (selectedTask?.exam_mode && examWindow.state === "open") {
      await requestDocumentFullscreenFromGesture();
    }

    onClose();
    router.push(href);
  };

  useEffect(() => {
    if (!isOpen || !selectedTask) return;
    form.setFieldsValue({
      selfAssessment:
        selectedTask?.selfAssessment ?? selectedTask?.self_assessment_marks ?? undefined,
      notes: selectedTask?.additional_notes ?? "",
    });
  }, [isOpen, selectedTask, form]);

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
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("task_id", selectedTask?.id || "");
    formData.append("additional_notes", values.notes || "");

    if (values.selfAssessment !== undefined) {
      formData.append(
        "self_assessment_mark",
        values.selfAssessment.toString()
      );
    }

    if (fileList[0]?.originFileObj) {
      formData.append("file_path", fileList[0].originFileObj);
    }

    const response = await uploadTaskByStudent(formData, assessmentId);

    if (response?.status_code === 409) {
      messageApi.warning(
        response.message || "You have already submitted this task."
      );
      return;
    }

    messageApi.success("Task submitted successfully!");
    onClose();
    form.resetFields();
    setFileList([]);
  } catch (error: any) {
    console.error("Error submitting Task:", error);
    messageApi.error("Failed to submit Task. Please try again.");
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
    // if (selectedTask?.status === "completed") return null;
    if ((!canEditSubmission && selectedTask?.status === "completed") || isNATask) return null;
    if (selectedTask?.task_type === "url") {
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            Open the attached URL, complete the task, then submit your self
            assessment below.
          </p>
        </div>
      );
    }

    const acceptType =
      selectedTask?.task_type === "audio"
        ? "audio/*"
        : selectedTask?.task_type === "video"
        ? "video/*"
        : "application/pdf";

    const hasFile = fileList.length > 0;
    const file = hasFile ? fileList[0] : null;

    if (isOnlineExamTask) {
      return (
        <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div>
            <p className="text-sm font-semibold text-amber-900">Scheduled PDF exam</p>
            {selectedTask.exam_start_at && (
              <p className="mt-1 text-sm text-amber-800">
                Opens {dayjs(selectedTask.exam_start_at).format("DD MMM YYYY, HH:mm")}
                {selectedTask.exam_duration_minutes
                  ? ` for ${selectedTask.exam_duration_minutes} minutes.`
                  : "."}
              </p>
            )}
          </div>

          {examWindow.state === "open" ? (
            <Button
              type="primary"
              className="!bg-primary !border-primary"
              onClick={() => void handleOpenOnlinePdf()}
            >
              {selectedTask.status === "completed" ? "Continue exam" : "Start exam"}
            </Button>
          ) : examWindow.state === "scheduled" && examWindow.startAt ? (
            <p className="text-sm text-amber-800">
              This exam becomes available at {dayjs(examWindow.startAt).format("DD MMM YYYY, HH:mm")}.
            </p>
          ) : examWindow.state === "ended" ? (
            <p className="text-sm text-red-700">
              This exam window has ended. Contact your teacher if you still need access.
            </p>
          ) : (
            <p className="text-sm text-red-700">
              The exam schedule is incomplete. Ask your teacher to update this task.
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {selectedTask?.task_type === "pdf" && selectedTask?.file_path && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="mb-3 text-sm text-blue-900">
              You can answer directly on your own online copy. It autosaves and locks when you press Finish.
            </p>
            <Button
              type="primary"
              className="!bg-primary !border-primary"
              href={buildOnlinePdfHref()}
            >
              Answer on PDF online
            </Button>
          </div>
        )}
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
          !isOnlineExamTask && (selectedTask?.status !== "completed" || canEditSubmission) ? (
            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={isSubmitting}
                className="w-full !bg-primary !border-primary"
              >
                {selectedTask?.status === "completed"
                  ? "Update Submission"
                  : "Submit Assignment"}
              </Button>
            </div>
          ) : null
        }
      >
        {selectedTask && (
          <div className="space-y-6 h-full flex flex-col">
            <div>
              <h4 className="font-medium text-gray-800">Task Description</h4>
              <p className="text-gray-600">{selectedTask.description}</p>
            </div>

            {isOnlineExamTask ? (
              <div className="space-y-4">
                {renderUploadArea()}
                {selectedTask.comment && (
                  <div>
                    <h4 className="font-medium text-gray-800">Feedback</h4>
                    <p className="text-gray-600">{selectedTask.comment}</p>
                  </div>
                )}
              </div>
            ) : selectedTask.status === "completed" && !canEditSubmission ? (
              <>
                <div>
                  <h4 className="font-medium text-gray-800">Your Submission</h4>
                  {renderFilePreview()}
                </div>

                {(selectedTask.selfAssessment !== undefined ||
                  selectedTask.self_assessment_marks !== undefined) && (
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Self Assessment
                    </h4>
                    <p className="text-gray-600">
                      {selectedTask.selfAssessment ?? selectedTask.self_assessment_marks}
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
