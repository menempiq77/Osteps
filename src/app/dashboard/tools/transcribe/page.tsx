"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, Spin, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { RootState } from "@/store/store";
import {
  fetchYoutubeCaptionFallback,
  startTranscribeFile,
  startTranscribeUrl,
} from "@/services/transcribeApi";

const { TextArea } = Input;
const allowedRoles = new Set(["SCHOOL_ADMIN", "HOD", "TEACHER"]);

const getTranscriptText = (payload: any): string => {
  if (!payload) return "";
  return (
    payload.text ||
    payload.data?.text ||
    payload.transcript ||
    payload.result?.text ||
    payload.data?.transcript ||
    ""
  );
};

const isYoutubeUrl = (value: string): boolean => {
  const v = value.toLowerCase();
  return v.includes("youtube.com") || v.includes("youtu.be");
};

export default function TranscribePage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [lastError, setLastError] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const canAccess = currentUser && allowedRoles.has(currentUser.role);
  const canSubmitFile = !!selectedFile && !loading;
  const canSubmitUrl = sourceUrl.trim().length > 0 && !loading;

  const uploadList = useMemo(
    () =>
      selectedFile
        ? [
            {
              uid: selectedFile.name,
              name: selectedFile.name,
              status: "done" as const,
            },
          ]
        : [],
    [selectedFile]
  );

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    setSelectedFile(file);
    return false;
  };

  const handleTranscribeFile = async () => {
    if (!selectedFile) {
      messageApi.warning("Choose a file first.");
      return;
    }

    try {
      setLoading(true);
      setLoadingLabel("Transcribing file… this can take a minute for long media.");
      setTranscript("");
      setLastError("");
      const payload = await startTranscribeFile(selectedFile);
      const text = getTranscriptText(payload);
      if (!text.trim()) throw new Error("No speech could be detected in this file.");
      setTranscript(text);
      messageApi.success("Transcription completed.");
    } catch (error: any) {
      const errorMessage =
        error?.details?.message || error?.message || "Failed to transcribe file.";
      setLastError(errorMessage);
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
      setLoadingLabel("");
    }
  };

  const handleTranscribeUrl = async () => {
    const url = sourceUrl.trim();
    if (!url) {
      messageApi.warning("Paste a media URL first.");
      return;
    }

    try {
      setLoading(true);
      setLoadingLabel("Fetching media & transcribing… this can take a minute.");
      setTranscript("");
      setLastError("");
      const payload = await startTranscribeUrl(url);
      const text = getTranscriptText(payload);
      if (!text.trim()) throw new Error("No speech could be detected in this media.");
      setTranscript(text);
      messageApi.success("Transcription completed.");
    } catch (error: any) {
      const errorMessage: string =
        error?.details?.message || error?.message || "Failed to transcribe URL.";

      // For YouTube, fall back to the video's published captions if audio
      // transcription was blocked (YouTube often rate-limits server downloads).
      if (isYoutubeUrl(url)) {
        try {
          setLoadingLabel("Trying YouTube captions…");
          const fallback = await fetchYoutubeCaptionFallback(url);
          const text = fallback.text || "";
          if (text.trim()) {
            setTranscript(text);
            messageApi.success(
              `Transcript loaded from YouTube captions (${fallback.langCode || "auto"}).`
            );
            return;
          }
        } catch {
          /* fall through to original error */
        }
      }

      setLastError(errorMessage);
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
      setLoadingLabel("");
    }
  };

  const handleDownloadTranscript = () => {
    const text = (transcript || "").trim();
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transcript-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!canAccess) {
    return (
      <div className="p-3 md:p-6">
        {contextHolder}
        <h1 className="text-2xl font-semibold text-gray-900">Transcribe</h1>
        <p className="mt-2 text-gray-600">You do not have access to this tool.</p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {contextHolder}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Transcribe</h1>
        <p className="mt-2 text-gray-600">
          Upload audio/video or paste a link (YouTube, Instagram, Facebook,
          TikTok or any direct media URL) to generate a transcript.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
          <div>
            <div className="mb-2 text-sm font-medium text-gray-700">From File</div>
            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              fileList={uploadList}
              onRemove={() => setSelectedFile(null)}
              accept="audio/*,video/*"
            >
              <Button disabled={loading}>Choose File</Button>
            </Upload>
            <Button
              className="mt-3 !bg-green-600"
              type="primary"
              onClick={handleTranscribeFile}
              disabled={!canSubmitFile}
            >
              {loading ? <Spin size="small" /> : "Transcribe File"}
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="mb-2 text-sm font-medium text-gray-700">From URL</div>
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=…  or  https://example.com/audio.mp3"
              disabled={loading}
              onPressEnter={handleTranscribeUrl}
            />
            <Button
              className="mt-3"
              onClick={handleTranscribeUrl}
              disabled={!canSubmitUrl}
            >
              {loading ? <Spin size="small" /> : "Transcribe URL"}
            </Button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Spin size="small" />
              {loadingLabel || "Processing…"}
            </div>
          )}

          {!loading && lastError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {lastError}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
            <div className="flex items-center gap-2">
              <Button onClick={handleDownloadTranscript} disabled={!transcript}>
                Download .txt
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(transcript || "");
                  messageApi.success("Transcript copied.");
                }}
                disabled={!transcript}
              >
                Copy
              </Button>
            </div>
          </div>
          <TextArea
            className="mt-3"
            value={transcript}
            placeholder="Your transcript will appear here."
            autoSize={{ minRows: 12 }}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
