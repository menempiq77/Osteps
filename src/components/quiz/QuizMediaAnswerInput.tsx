"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { Mic, Square, Trash2, BookOpen, ExternalLink } from "lucide-react";
import { uploadQuizFile } from "@/services/quizApi";
import {
  createRecordingFile,
  formatRecordingTime,
  getSupportedAudioMimeType,
} from "@/lib/audioRecording";
import { buildStorageUrl } from "@/lib/submissionAttachments";

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
  const [messageApi, contextHolder] = message.useMessage();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeTypeRef = useRef<string>("");

  const stopTracksAndTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  useEffect(() => {
    return () => {
      stopTracksAndTimer();
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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      const mimeType = getSupportedAudioMimeType();
      mimeTypeRef.current = mimeType;
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const chunks = chunksRef.current;
        stopTracksAndTimer();
        setIsRecording(false);
        if (!chunks.length) return;
        const file = createRecordingFile(
          chunks,
          mimeTypeRef.current ||
            (chunks[0] instanceof Blob ? chunks[0].type : "") ||
            "audio/webm"
        );
        try {
          setUploading(true);
          const { url } = await uploadQuizFile(file, subjectId);
          onChange({ audio: url, name: file.name });
          messageApi.success("Recording saved. Submit the quiz to keep it.");
        } catch (error) {
          console.error("Recording upload failed:", error);
          messageApi.error("Could not upload the recording. Please try again.");
        } finally {
          setUploading(false);
        }
      };

      setSeconds(0);
      setIsRecording(true);
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
    onChange({});
  };

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

      {value.audio && !isRecording && (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center">
          <audio controls src={buildStorageUrl(value.audio)} className="w-full sm:max-w-sm" />
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
      {bookUrl ? (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="flex items-center justify-between gap-2 bg-gray-50 px-3 py-2">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <BookOpen size={16} /> Reading material
            </span>
            <a
              href={bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Open in new tab <ExternalLink size={14} />
            </a>
          </div>
          <iframe
            src={bookUrl}
            title="Reading material"
            className="h-[480px] w-full"
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
          No reading material has been attached to this question yet.
        </div>
      )}

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
