"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, Upload, message, Spin } from "antd";
import type { UploadProps } from "antd";
import { RootState } from "@/store/store";
import { getTranscribeStatus, startTranscribeFile } from "@/services/transcribeApi";

const { TextArea } = Input;

const allowedRoles = new Set(["SCHOOL_ADMIN", "HOD", "TEACHER"]);

const getTranscriptText = (payload: any) => {
  if (!payload) return "";
  return (
    payload.text ||
    payload.data?.text ||
    payload.transcript ||
    payload.result?.text ||
    ""
  );
};

export default function TranscribePage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const canAccess = currentUser && allowedRoles.has(currentUser.role);

  const handleFileUpload: UploadProps["beforeUpload"] = (file) => {
    setSelectedFile(file);
    return false;
  };

  const pollTranscription = async (jobId: string) => {
    try {
      const response = await getTranscribeStatus(jobId);
      if (response?.status === "done") {
        const text = getTranscriptText(response);
        setTranscript(text);
        messageApi.success("Transcription completed");
        setLoading(false);
        return;
      }
      if (response?.status === "failed") {
        messageApi.error(response?.message || "Transcription failed");
        setLoading(false);
        return;
      }
      setTimeout(() => pollTranscription(jobId), 3000);
    } catch (error) {
      messageApi.error("Failed to check transcription status");
      setLoading(false);
    }
  };

  const handleTranscribeFile = async () => {
      const response = await startTranscribeFile(selectedFile);
      const jobId = response?.job_id || response?.jobId || response?.id;
      if (!jobId) {
        messageApi.error("Failed to start transcription");
        setLoading(false);
        return;
      }
      messageApi.info("Processing... this may take a few minutes.");
      pollTranscription(jobId);

    try {
      setLoading(true);
      const response = await transcribeFile(selectedFile);
      const text = getTranscriptText(response);
      setTranscript(text);
      messageApi.success("Transcription completed");
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Failed to transcribe file";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  if (!canAccess) {
    return (
      <div className="p-3 md:p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Transcribe</h1>
        <p className="mt-2 text-gray-600">
          You do not have access to this tool.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Transcribe</h1>
        <p className="mt-2 text-gray-600">
          Upload audio/video to generate a transcript. Longer files can take a
          few minutes to finish.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <Upload
              beforeUpload={handleFileUpload}
              maxCount={1}
              fileList={selectedFile ? [
                {
                  uid: selectedFile.name,
                  name: selectedFile.name,
                  status: "done",
                },
              ] : []}
              onRemove={() => setSelectedFile(null)}
            >
              <Button>Choose File</Button>
            </Upload>
            <Button
              type="primary"
              className="!bg-green-600"
              onClick={handleTranscribeFile}
              disabled={loading}
            >
              {loading ? <Spin size="small" /> : "Transcribe File"}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(transcript || "");
                messageApi.success("Transcript copied");
              }}
              disabled={!transcript}
            >
              Copy
            </Button>
          </div>
          <TextArea
            className="mt-3"
            value={transcript}
            placeholder="Your transcript will appear here."
            autoSize={{ minRows: 10 }}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
