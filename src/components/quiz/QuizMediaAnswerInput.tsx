"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Image, Input, Select, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { Mic, Square, Trash2, BookOpen, ExternalLink, Maximize2, AlertTriangle } from "lucide-react";
import { uploadQuizFile } from "@/services/quizApi";
import {
  AUTO_AUDIO_INPUT_ID,
  BASE_AUDIO_CONSTRAINTS,
  chooseAutoAudioInputDevice,
  createRecordingFile,
  formatRecordingTime,
  getAudioInputOptions,
  getSupportedAudioMimeType,
  isGenericMicrophoneLabel,
  type AudioInputDeviceOption,
} from "@/lib/audioRecording";
import { buildStorageUrl } from "@/lib/submissionAttachments";
import QuizAudioPlayer from "@/components/quiz/QuizAudioPlayer";

export type QuizMediaQuestion = {
  id: number;
  type: string;
  question_text?: string;
  correct_answer?: unknown;
};

type RecordingAnswer = { audio?: string; name?: string };
type ImageUploadAnswer = { images?: string[]; comment?: string };
type ReadingAnswer = { response?: string };

type Props = {
  question: QuizMediaQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
  subjectId?: number;
  disabled?: boolean;
};

const { TextArea } = Input;

export default function QuizMediaAnswerInput({
  question,
  value,
  onChange,
  subjectId,
  disabled = false,
}: Props) {
  if (question.type === "recording") {
    return (
      <RecordingInput
        value={(value as RecordingAnswer) || {}}
        onChange={onChange}
        subjectId={subjectId}
        disabled={disabled}
        questionText={question.question_text}
      />
    );
  }

  if (question.type === "image_upload") {
    return (
      <ImageUploadInput
        value={(value as ImageUploadAnswer) || {}}
        onChange={onChange}
        subjectId={subjectId}
        disabled={disabled}
      />
    );
  }

  if (question.type === "reading") {
    return (
      <ReadingInput
        value={(value as ReadingAnswer) || {}}
        onChange={onChange}
        bookUrl={buildStorageUrl(String(question.correct_answer || ""))}
        disabled={disabled}
      />
    );
  }

  return null;
}

/* ----------------------------- Recording ----------------------------- */

function RecordingInput({
  value,
  onChange,
  subjectId,
  disabled,
  questionText,
}: {
  value: RecordingAnswer;
  onChange: (value: unknown) => void;
  subjectId?: number;
  disabled?: boolean;
  questionText?: string;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");
  const [micLevel, setMicLevel] = useState(0);
  const [audioInputDevices, setAudioInputDevices] = useState<AudioInputDeviceOption[]>([]);
  const [selectedAudioInputId, setSelectedAudioInputId] = useState<string>(AUTO_AUDIO_INPUT_ID);
  const [activeMicrophoneLabel, setActiveMicrophoneLabel] = useState("");
  const [recordingWarning, setRecordingWarning] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeTypeRef = useRef<string>("");
  const localPreviewUrlRef = useRef<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserFrameRef = useRef<number | null>(null);
  const recordingPeakRef = useRef(0);

  const stopMicLevelMonitor = () => {
    if (analyserFrameRef.current !== null) {
      cancelAnimationFrame(analyserFrameRef.current);
      analyserFrameRef.current = null;
    }
    audioSourceRef.current?.disconnect();
    audioSourceRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }
    audioContextRef.current = null;
    setMicLevel(0);
  };

  const startMicLevelMonitor = (stream: MediaStream) => {
    stopMicLevelMonitor();
    recordingPeakRef.current = 0;

    const AudioContextConstructor =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;

    try {
      const audioContext = new AudioContextConstructor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.2;
      const source = audioContext.createMediaStreamSource(stream);
      const samples = new Uint8Array(analyser.fftSize);

      source.connect(analyser);
      audioContextRef.current = audioContext;
      audioSourceRef.current = source;

      if (audioContext.state === "suspended") {
        void audioContext.resume();
      }

      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (const sample of samples) {
          const normalized = (sample - 128) / 128;
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / samples.length);
        recordingPeakRef.current = Math.max(recordingPeakRef.current, rms);
        setMicLevel(Math.min(100, Math.round(rms * 450)));
        analyserFrameRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch (error) {
      console.warn("Unable to monitor microphone level:", error);
    }
  };

  const stopTracksAndTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopMicLevelMonitor();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  const setPreviewUrl = (url: string) => {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
    }
    localPreviewUrlRef.current = url;
    setLocalPreviewUrl(url);
  };

  useEffect(() => {
    return () => {
      stopTracksAndTimer();
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (isRecording || disabled) return;

    if (
      typeof window === "undefined" ||
      typeof MediaRecorder === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      messageApi.error("This browser does not support direct audio recording.");
      return;
    }

    setRecordingWarning("");

    try {
      const shouldAutoSelect = selectedAudioInputId === AUTO_AUDIO_INPUT_ID;
      let devices = await getAudioInputOptions();

      // Without permission the labels are blank; prompt once so we can pick the right mic.
      if (
        shouldAutoSelect &&
        (devices.length === 0 || devices.every((device) => isGenericMicrophoneLabel(device.label)))
      ) {
        const permissionStream = await navigator.mediaDevices.getUserMedia({
          audio: BASE_AUDIO_CONSTRAINTS,
        });
        permissionStream.getTracks().forEach((track) => track.stop());
        devices = await getAudioInputOptions();
      }
      setAudioInputDevices(devices);

      const autoDevice = shouldAutoSelect ? chooseAutoAudioInputDevice(devices) : null;
      const requestedDeviceId = shouldAutoSelect ? autoDevice?.deviceId || "" : selectedAudioInputId;
      const requestedAudioConstraints: MediaTrackConstraints = requestedDeviceId
        ? { ...BASE_AUDIO_CONSTRAINTS, deviceId: { exact: requestedDeviceId } }
        : BASE_AUDIO_CONSTRAINTS;

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: requestedAudioConstraints });
      } catch (deviceError) {
        if (!requestedDeviceId) throw deviceError;
        if (!shouldAutoSelect) setSelectedAudioInputId(AUTO_AUDIO_INPUT_ID);
        messageApi.warning("That microphone was unavailable, so another microphone was used automatically.");
        stream = await navigator.mediaDevices.getUserMedia({ audio: BASE_AUDIO_CONSTRAINTS });
      }

      const track = stream.getAudioTracks()[0];
      const trackDeviceId = track?.getSettings?.().deviceId || "";
      devices = await getAudioInputOptions();
      setAudioInputDevices(devices);
      const activeDevice = devices.find((device) => device.deviceId === trackDeviceId);
      setActiveMicrophoneLabel(
        activeDevice?.label || track?.label || (shouldAutoSelect ? "Auto-selected microphone" : "Selected microphone")
      );

      const mimeType = getSupportedAudioMimeType();
      mimeTypeRef.current = mimeType;
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recordingPeakRef.current = 0;

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const chunks = chunksRef.current;
        const soundDetected = recordingPeakRef.current > 0.015;
        stopTracksAndTimer();
        setIsRecording(false);
        if (!chunks.length) return;
        const file = createRecordingFile(
          chunks,
          mimeTypeRef.current ||
            (chunks[0] instanceof Blob ? chunks[0].type : "") ||
            "audio/webm"
        );
        // Play back instantly from a local blob URL (independent of upload/network).
        setPreviewUrl(URL.createObjectURL(file));

        if (!soundDetected) {
          setRecordingWarning(
            "No microphone sound was detected. Check that the right microphone is selected below (not a monitor/output device), that it is not muted, and that the browser has mic permission, then record again."
          );
          messageApi.warning("No microphone sound was detected in this recording.");
        }

        try {
          setUploading(true);
          const { url } = await uploadQuizFile(file, subjectId);
          onChange({ audio: url, name: file.name });
          if (soundDetected) {
            messageApi.success("Recording saved. Submit the quiz to keep it.");
          }
        } catch (error) {
          console.error("Recording upload failed:", error);
          messageApi.error("Could not upload the recording. Please try again.");
        } finally {
          setUploading(false);
        }
      };

      recorder.onerror = () => {
        messageApi.error("Recording stopped because the microphone had a problem.");
        stopTracksAndTimer();
        setIsRecording(false);
      };

      setSeconds(0);
      setIsRecording(true);
      startMicLevelMonitor(stream);
      recorder.start();
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (error) {
      console.error("Unable to start audio recording:", error);
      stopTracksAndTimer();
      setIsRecording(false);
      messageApi.error("Allow microphone access to record directly from the website.");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      stopTracksAndTimer();
      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    if (disabled) return;
    setPreviewUrl("");
    setRecordingWarning("");
    onChange({});
  };

  const deviceOptions = [
    { value: AUTO_AUDIO_INPUT_ID, label: "Automatic (recommended)" },
    ...audioInputDevices
      .filter((device) => device.deviceId)
      .map((device) => ({ value: device.deviceId, label: device.label })),
  ];

  return (
    <div className="space-y-3">
      {contextHolder}
      <div className="flex flex-wrap items-center gap-3">
        {!isRecording ? (
          <Button
            type="primary"
            icon={<Mic size={16} />}
            onClick={startRecording}
            loading={uploading}
            disabled={disabled}
            className="!flex !items-center !gap-2 !bg-rose-600 !border-rose-600 hover:!bg-rose-700 hover:!border-rose-700"
          >
            {value.audio ? "Record again" : "Start recording"}
          </Button>
        ) : (
          <Button
            danger
            icon={<Square size={16} />}
            onClick={stopRecording}
            className="!flex !items-center !gap-2"
          >
            Stop recording
          </Button>
        )}

        {isRecording && (
          <span className="flex items-center gap-2 text-sm font-medium text-rose-600">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-600" />
            Recording {formatRecordingTime(seconds)}
          </span>
        )}

        {uploading && <span className="text-sm text-gray-500">Saving recording…</span>}
      </div>

      {isRecording && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Mic level</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] duration-75"
                style={{ width: `${micLevel}%` }}
              />
            </div>
          </div>
          {activeMicrophoneLabel && (
            <p className="text-xs text-gray-400">Using: {activeMicrophoneLabel}</p>
          )}
          <p className="text-xs text-gray-400">
            Speak now — the bar above should move. If it stays flat, pick a different microphone below.
          </p>
        </div>
      )}

      {!disabled && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Microphone</span>
          <Select
            size="small"
            value={selectedAudioInputId}
            onChange={setSelectedAudioInputId}
            options={deviceOptions}
            disabled={isRecording}
            className="max-w-xs"
            onClick={async () => {
              if (audioInputDevices.length === 0) {
                setAudioInputDevices(await getAudioInputOptions());
              }
            }}
          />
        </div>
      )}

      {recordingWarning && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{recordingWarning}</span>
        </div>
      )}

      {(localPreviewUrl || value.audio) && !isRecording && (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center">
          <QuizAudioPlayer
            src={localPreviewUrl || buildStorageUrl(value.audio || "")}
            className="w-full sm:max-w-sm"
          />
          {!disabled && (
            <Button
              type="text"
              danger
              size="small"
              icon={<Trash2 size={14} />}
              onClick={clearRecording}
            >
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------- Image upload ---------------------------- */

function ImageUploadInput({
  value,
  onChange,
  subjectId,
  disabled,
}: {
  value: ImageUploadAnswer;
  onChange: (value: unknown) => void;
  subjectId?: number;
  disabled?: boolean;
}) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [comment, setComment] = useState<string>(value.comment || "");
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const initializedRef = useRef(false);

  // Seed the picture list from a previously stored answer (read-only / re-edit).
  useEffect(() => {
    if (initializedRef.current) return;
    if (Array.isArray(value.images) && value.images.length > 0) {
      setFileList(
        value.images.map((img, index) => ({
          uid: `existing-${index}`,
          name: `Image ${index + 1}`,
          status: "done",
          url: buildStorageUrl(img),
        })) as UploadFile[]
      );
    }
    initializedRef.current = true;
  }, [value.images]);

  const emitChange = (list: UploadFile[], nextComment: string) => {
    const images = list
      .filter((file) => file.status === "done")
      .map((file) => (file.response as { url?: string })?.url || file.url || "")
      .filter(Boolean);
    onChange({ images, comment: nextComment });
  };

  const customRequest: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const result = await uploadQuizFile(file as File, subjectId);
      onSuccess?.(result, file as unknown as XMLHttpRequest);
    } catch (error) {
      console.error("Image upload failed:", error);
      messageApi.error("Could not upload an image. Please try again.");
      onError?.(error as Error);
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: nextList }) => {
    setFileList(nextList);
    emitChange(nextList, comment);
  };

  const handleCommentChange = (next: string) => {
    setComment(next);
    emitChange(fileList, next);
  };

  // Show the picture inside the website instead of opening an external link.
  const handlePreview: UploadProps["onPreview"] = (file) => {
    const remote = (file.response as { url?: string })?.url;
    const src =
      file.url ||
      (remote ? buildStorageUrl(remote) : "") ||
      file.thumbUrl ||
      (file.originFileObj ? URL.createObjectURL(file.originFileObj as Blob) : "");
    if (!src) return;
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-3">
      {contextHolder}
      <Upload
        listType="picture-card"
        multiple
        accept="image/*"
        fileList={fileList}
        customRequest={customRequest}
        onChange={handleChange}
        onPreview={handlePreview}
        disabled={disabled}
      >
        {!disabled && fileList.length >= 12 ? null : !disabled ? (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <span className="text-lg leading-none">+</span>
            <span className="mt-1 text-xs">Add photo</span>
          </div>
        ) : null}
      </Upload>

      <TextArea
        rows={3}
        placeholder="Write a comment about your photos…"
        value={comment}
        onChange={(e) => handleCommentChange(e.target.value)}
        disabled={disabled}
      />

      {previewSrc && (
        <Image
          wrapperStyle={{ display: "none" }}
          src={previewSrc}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => {
              setPreviewOpen(visible);
              if (!visible) setPreviewSrc("");
            },
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------ Reading ------------------------------ */

function ReadingInput({
  value,
  onChange,
  bookUrl,
  disabled,
}: {
  value: ReadingAnswer;
  onChange: (value: unknown) => void;
  bookUrl: string;
  disabled?: boolean;
}) {
  const [response, setResponse] = useState<string>(value.response || "");

  const handleResponseChange = (next: string) => {
    setResponse(next);
    onChange({ response: next });
  };

  return (
    <div className="space-y-3">
      <ReadingMaterialViewer bookUrl={bookUrl} />

      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">Your response</p>
        <TextArea
          rows={4}
          placeholder="Write your response after reading…"
          value={response}
          onChange={(e) => handleResponseChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

/* ------------------------- Reading material -------------------------- */

export function ReadingMaterialViewer({ bookUrl }: { bookUrl: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isImage = /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(bookUrl);

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
  };

  if (!bookUrl) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
        No reading material has been attached to this question yet.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <div className="flex items-center justify-between gap-2 bg-gray-50 px-3 py-2">
        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <BookOpen size={16} /> Reading material
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={enterFullscreen}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Maximize2 size={14} /> Full screen
          </button>
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Open in new tab <ExternalLink size={14} />
          </a>
        </div>
      </div>
      {isImage ? (
        <div className="flex max-h-[70vh] flex-1 justify-center overflow-auto bg-neutral-100 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bookUrl} alt="Reading material" className="max-w-full object-contain" />
        </div>
      ) : (
        <iframe
          src={bookUrl}
          title="Reading material"
          className="h-[70vh] w-full flex-1 bg-neutral-100"
        />
      )}
    </div>
  );
}
