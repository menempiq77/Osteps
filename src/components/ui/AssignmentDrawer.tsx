"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { ExternalLink, Mic, Paperclip, Square, Trash2, X } from "lucide-react";
import { uploadTaskByStudent } from "@/services/api";
import { IMG_BASE_URL } from "@/lib/config";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { requestDocumentFullscreenFromGesture } from "@/lib/browserFullscreen";
import { resolveExamWindow } from "@/lib/taskTypeMetadata";
import { isSubmittedStatus } from "@/lib/studentSubmissionStatus";
import {
  SubmissionAttachment,
  parseSubmissionAttachments,
  serializeKeptSubmissionAttachments,
} from "@/lib/submissionAttachments";

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
  has_submission?: boolean;
  submitted_file_path?: string | null;
  submitted_file_paths?: unknown;
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

const formatRecordingTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const getSupportedAudioMimeType = () => {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return "";
  }

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
};

const getAudioFileExtension = (mimeType: string) => {
  if (mimeType.includes("mp4")) return "m4a";
  if (mimeType.includes("ogg")) return "ogg";
  return "webm";
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
  const [existingAttachments, setExistingAttachments] = useState<SubmissionAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingPreviewUrl, setRecordingPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputError, setInputError] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingPreviewUrlRef = useRef<string | null>(null);
  const recordingPreviewUidRef = useRef<string | null>(null);
  const shouldSaveRecordingRef = useRef(false);
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser?: { student?: string | number };
  };

  const isNATask =
    !selectedTask?.task_type || selectedTask?.task_type === "null";
  const examWindow = resolveExamWindow(selectedTask);
  const isOnlineExamTask = Boolean(
    selectedTask?.exam_mode && selectedTask?.task_type === "pdf" && selectedTask?.file_path
  );
  const selectedTaskSubmitted = isSubmittedStatus(
    selectedTask?.status,
    selectedTask?.has_submission
  );
  const isAudioSubmissionTask =
    selectedTask?.task_type === "audio" || selectedTask?.type === "audio";

  const clearRecordingTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const stopRecordingStream = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  const resetRecordingState = () => {
    clearRecordingTimer();
    stopRecordingStream();
    setIsRecording(false);
    setRecordingSeconds(0);
    shouldSaveRecordingRef.current = false;
    recordingChunksRef.current = [];
    mediaRecorderRef.current = null;
  };

  const replaceRecordingPreviewUrl = (url: string | null) => {
    if (recordingPreviewUrlRef.current) {
      URL.revokeObjectURL(recordingPreviewUrlRef.current);
    }
    recordingPreviewUrlRef.current = url;
    if (!url) recordingPreviewUidRef.current = null;
    setRecordingPreviewUrl(url);
  };

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

  const addRecordingToFileList = (blob: Blob, mimeType: string) => {
    const safeTaskName = (selectedTask?.name || "recording")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "recording";
    const extension = getAudioFileExtension(mimeType || blob.type);
    const fileName = `${safeTaskName}-${dayjs().format("YYYYMMDD-HHmmss")}.${extension}`;
    const file = new File([blob], fileName, {
      type: mimeType || blob.type || "audio/webm",
    });
    const previewUrl = URL.createObjectURL(blob);
    const uid = `recording-${Date.now()}`;

    recordingPreviewUidRef.current = uid;
    replaceRecordingPreviewUrl(previewUrl);
    setFileList((current) => [
      ...current,
      {
        uid,
        name: fileName,
        status: "done",
        size: file.size,
        type: file.type,
        originFileObj: file as any,
      },
    ]);
    messageApi.success(
      `Recording added. Press ${selectedTaskSubmitted ? "Save Changes" : "Submit Assignment"} to save it.`
    );
  };

  const startAudioRecording = async () => {
    if (isRecording) return;

    if (
      typeof window === "undefined" ||
      typeof MediaRecorder === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      messageApi.error("This browser does not support direct audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedAudioMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];
      shouldSaveRecordingRef.current = false;

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        messageApi.error("Recording stopped because the microphone had a problem.");
        resetRecordingState();
      };

      recorder.onstop = () => {
        const chunks = recordingChunksRef.current;
        const shouldSave = shouldSaveRecordingRef.current;
        const finalMimeType = mimeType || chunks[0]?.type || "audio/webm";

        if (shouldSave && chunks.length > 0) {
          addRecordingToFileList(new Blob(chunks, { type: finalMimeType }), finalMimeType);
        }

        resetRecordingState();
      };

      setRecordingSeconds(0);
      setIsRecording(true);
      recorder.start();
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((seconds) => seconds + 1);
      }, 1000);
    } catch (error) {
      console.error("Unable to start audio recording:", error);
      resetRecordingState();
      messageApi.error("Allow microphone access to record directly from the website.");
    }
  };

  const stopAudioRecording = () => {
    const recorder = mediaRecorderRef.current;
    shouldSaveRecordingRef.current = true;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      resetRecordingState();
    }
  };

  const cancelAudioRecording = () => {
    const recorder = mediaRecorderRef.current;
    shouldSaveRecordingRef.current = false;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      resetRecordingState();
    }
  };

  useEffect(() => {
    return () => {
      shouldSaveRecordingRef.current = false;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      clearRecordingTimer();
      stopRecordingStream();
      if (recordingPreviewUrlRef.current) {
        URL.revokeObjectURL(recordingPreviewUrlRef.current);
        recordingPreviewUrlRef.current = null;
        recordingPreviewUidRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !selectedTask) return;
    cancelAudioRecording();
    replaceRecordingPreviewUrl(null);
    form.setFieldsValue({
      selfAssessment:
        selectedTask?.selfAssessment ?? selectedTask?.self_assessment_marks ?? undefined,
      notes: selectedTask?.additional_notes ?? "",
    });
    setExistingAttachments(
      parseSubmissionAttachments(
        selectedTask?.submitted_file_paths,
        selectedTask?.submitted_file_path
      )
    );
    setFileList([]);
  }, [isOpen, selectedTask, form]);

  const handleFileChange = (info: any) => {
    const newFileList = [...info.fileList].map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
    if (
      recordingPreviewUidRef.current &&
      !newFileList.some((file) => file.uid === recordingPreviewUidRef.current)
    ) {
      replaceRecordingPreviewUrl(null);
    }
  };

  const beforeUpload = (file: File) => {
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

    formData.append(
      "kept_file_paths",
      serializeKeptSubmissionAttachments(existingAttachments)
    );

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("file_paths[]", file.originFileObj, file.name);
      }
    });

    const response = await uploadTaskByStudent(formData, assessmentId);

    if (response?.status_code === 409) {
      messageApi.warning(
        response.message || "You have already submitted this task."
      );
      return;
    }

    messageApi.success(selectedTaskSubmitted ? "Submission updated successfully!" : "Task submitted successfully!");
    onClose();
    form.resetFields();
    setFileList([]);
    setExistingAttachments([]);
    replaceRecordingPreviewUrl(null);
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
    if (existingAttachments.length > 0) {
      return renderAttachmentList(false);
    }

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

  const renderAttachmentList = (editable: boolean) => {
    if (existingAttachments.length === 0) {
      return editable ? null : <p className="text-sm text-gray-500">No uploaded files saved yet.</p>;
    }

    return (
      <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-800">
            Uploaded files ({existingAttachments.length})
          </h4>
          {editable && (
            <span className="text-xs text-gray-500">
              Remove files you do not want to keep.
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {existingAttachments.map((attachment) => (
            <div
              key={attachment.path}
              className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-2"
            >
              <div className="min-w-0 flex items-center gap-2">
                <Paperclip className="h-4 w-4 shrink-0 text-gray-500" />
                <span className="truncate text-sm font-medium text-gray-700">
                  {attachment.name}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  size="small"
                  type="link"
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!h-7 !px-1 text-xs"
                >
                  <span className="inline-flex items-center gap-1">
                    View <ExternalLink className="h-3 w-3" />
                  </span>
                </Button>
                {editable && (
                  <Button
                    size="small"
                    danger
                    type="text"
                    className="!h-7 !px-1.5"
                    onClick={() =>
                      setExistingAttachments((current) =>
                        current.filter((item) => item.path !== attachment.path)
                      )
                    }
                    title="Remove this file from the saved submission"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAudioRecorder = () => {
    if (!isAudioSubmissionTask) return null;

    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-emerald-900">
              Record directly from the website
            </h4>
            <p className="text-xs text-emerald-800">
              Use this if you want to record your recitation now instead of uploading an audio file.
            </p>
          </div>
          {isRecording ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                Recording {formatRecordingTime(recordingSeconds)}
              </span>
              <Button
                type="primary"
                danger
                onClick={stopAudioRecording}
                className="inline-flex items-center gap-1"
              >
                <Square className="h-4 w-4" />
                Stop and use recording
              </Button>
              <Button onClick={cancelAudioRecording} className="inline-flex items-center gap-1">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="primary"
              onClick={() => void startAudioRecording()}
              className="!bg-primary !border-primary inline-flex items-center gap-1"
            >
              <Mic className="h-4 w-4" />
              Start recording
            </Button>
          )}
        </div>
        {recordingPreviewUrl && !isRecording && (
          <div className="mt-3 rounded-md border border-emerald-200 bg-white p-3">
            <p className="mb-2 text-xs font-semibold text-emerald-800">
              Latest recording preview
            </p>
            <audio controls src={recordingPreviewUrl} className="w-full" />
            <p className="mt-2 text-xs text-gray-500">
              The recording has been added to the new files list below. Remove it there if you do not want to submit it.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderUploadArea = () => {
    if ((!canEditSubmission && selectedTaskSubmitted) || isNATask) return null;
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
              {selectedTaskSubmitted ? "Continue exam" : "Start exam"}
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
        {renderAudioRecorder()}
        <Upload.Dragger
          name="file"
          multiple
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
                  ? `${fileList.length} new file${fileList.length === 1 ? "" : "s"} ready to save`
                  : `Drag & drop your ${selectedTask?.task_type} files here`}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {hasFile
                  ? "You can remove any selected file before saving."
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
          cancelAudioRecording();
          form.resetFields();
          setFileList([]);
          setExistingAttachments([]);
          replaceRecordingPreviewUrl(null);
          onClose();
        }}
        open={isOpen}
        width={600}
        footer={
          !isOnlineExamTask && (!selectedTaskSubmitted || canEditSubmission) ? (
            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={isSubmitting}
                disabled={isRecording}
                className="w-full !bg-primary !border-primary"
              >
                {selectedTaskSubmitted
                  ? "Save Changes"
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
            ) : selectedTaskSubmitted && !canEditSubmission ? (
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
                  {renderAttachmentList(true)}
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
