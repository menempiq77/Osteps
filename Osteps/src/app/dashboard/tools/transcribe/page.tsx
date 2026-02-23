"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, Spin, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { RootState } from "@/store/store";
import {
  fetchYoutubeCaptionFallback,
  getTranscribeStatus,
  startTranscribeFile,
  startTranscribeUrl,
} from "@/services/transcribeApi";

const { TextArea } = Input;
const allowedRoles = new Set(["SCHOOL_ADMIN", "HOD", "TEACHER"]);
const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 120; // ~5 minutes

type TranscribeStartResponse = Record<string, any>;
type TranscribeStatusResponse = Record<string, any>;

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

const getJobId = (payload: any): string | null => {
  const raw = payload?.job_id || payload?.jobId || payload?.id || null;
  return raw ? String(raw) : null;
};

const getStatusLabel = (payload: any): string => {
  const statusRaw =
    payload?.status || payload?.state || payload?.job_status || payload?.data?.status;
  return String(statusRaw || "").toLowerCase();
};

const isDoneStatus = (payload: any): boolean => {
  const status = getStatusLabel(payload);
  if (!status) return false;
  return ["done", "completed", "success", "finished"].includes(status);
};

const isFailedStatus = (payload: any): boolean => {
  const status = getStatusLabel(payload);
  if (!status) return false;
  return ["failed", "error", "cancelled", "canceled"].includes(status);
};

const hasTranscript = (payload: any): boolean => getTranscriptText(payload).trim().length > 0;

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

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
  const [youtubeDebug, setYoutubeDebug] = useState<any>(null);
  const [lastUrlError, setLastUrlError] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const canAccess = currentUser && allowedRoles.has(currentUser.role);
  const canSubmitFile = !!selectedFile && !loading;
  const canSubmitUrl = sourceUrl.trim().length > 0 && !loading;
  const youtubeUrlBlocked = isYoutubeUrl(sourceUrl.trim());

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

  const resolveTranscript = async (startPayload: TranscribeStartResponse) => {
    if (hasTranscript(startPayload)) {
      return getTranscriptText(startPayload);
    }

    const jobId = getJobId(startPayload);
    if (!jobId) {
      throw new Error("No transcript or job id returned by the server.");
    }

    for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt += 1) {
      setLoadingLabel(`Processing... (${attempt}/${MAX_POLL_ATTEMPTS})`);
      const statusPayload: TranscribeStatusResponse = await getTranscribeStatus(jobId);

      if (hasTranscript(statusPayload) || isDoneStatus(statusPayload)) {
        const text = getTranscriptText(statusPayload);
        if (text.trim().length) return text;
      }

      if (isFailedStatus(statusPayload)) {
        const errorMessage =
          statusPayload?.message ||
          statusPayload?.msg ||
          "Transcription failed on server.";
        throw new Error(errorMessage);
      }

      await sleep(POLL_INTERVAL_MS);
    }

    throw new Error("Transcription is taking too long. Please try again.");
  };

  const handleTranscribeFile = async () => {
    if (!selectedFile) {
      messageApi.warning("Choose a file first.");
      return;
    }

    try {
      setLoading(true);
      setLoadingLabel("Uploading file...");
      setTranscript("");
      setYoutubeDebug(null);
      const startPayload = await startTranscribeFile(selectedFile);
      const text = await resolveTranscript(startPayload);
      setTranscript(text);
      messageApi.success("Transcription completed.");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        "Failed to transcribe file.";
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
    if (isYoutubeUrl(url)) {
      messageApi.warning(
        "YouTube URL transcription is disabled here due to subtitle rate limits. Please upload audio/video file instead."
      );
      setLastUrlError(
        "YouTube URL transcription is disabled for stability. Use file upload."
      );
      return;
    }

    try {
      setLoading(true);
      setLoadingLabel("Submitting URL...");
      setTranscript("");
      setYoutubeDebug(null);
      setLastUrlError("");
      const startPayload = await startTranscribeUrl(url);
      const text = await resolveTranscript(startPayload);
      setTranscript(text);
      messageApi.success("Transcription completed.");
    } catch (error: any) {
      const errorMessage: string =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        "Failed to transcribe URL.";

      const normalized = errorMessage.toLowerCase();
      const shouldTryYoutubeFallback =
        url.includes("youtube.com") ||
        url.includes("youtu.be") ||
        normalized.includes("subtitle") ||
        normalized.includes("caption");

      if (shouldTryYoutubeFallback) {
        try {
          setLoadingLabel("Trying YouTube captions fallback...");
          const fallback = await fetchYoutubeCaptionFallback(url);
          setTranscript(fallback.text || "");
          setYoutubeDebug(fallback?.debug || null);
          messageApi.success(
            `Transcript loaded from YouTube captions (${fallback.langCode}).`
          );
          return;
        } catch (fallbackError: any) {
          const fallbackMessage =
            fallbackError?.message || "YouTube caption fallback failed.";
          setYoutubeDebug(fallbackError?.details?.debug || null);
          setLastUrlError(`${errorMessage} ${fallbackMessage}`);
          messageApi.error(`${errorMessage} ${fallbackMessage}`);
          return;
        }
      }

      setLastUrlError(errorMessage);
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
    link.download = `transcript-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.txt`;
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
          Upload audio/video or paste a media URL to generate a transcript.
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
              placeholder="https://example.com/audio-or-video"
              disabled={loading}
            />
            {youtubeUrlBlocked && (
              <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                YouTube links are disabled for URL transcription in this tool.
                Download the media audio/video and use <strong>From File</strong>.
              </div>
            )}
            <Button
              className="mt-3"
              onClick={handleTranscribeUrl}
              disabled={!canSubmitUrl || youtubeUrlBlocked}
            >
              {loading ? <Spin size="small" /> : "Transcribe URL"}
            </Button>
          </div>

          {loading && (
            <div className="text-sm text-gray-500">{loadingLabel || "Processing..."}</div>
          )}

          {(youtubeDebug || lastUrlError) && (
            <details className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                YouTube caption debug
              </summary>
              {lastUrlError && (
                <div className="mt-2 text-xs text-red-600">{lastUrlError}</div>
              )}
              {youtubeDebug && (
                <pre className="mt-2 max-h-56 overflow-auto text-[11px] text-gray-700 whitespace-pre-wrap break-words">
{JSON.stringify(youtubeDebug, null, 2)}
                </pre>
              )}
            </details>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Transcript</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDownloadTranscript}
                disabled={!transcript}
              >
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
