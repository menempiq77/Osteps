"use client";

import React from "react";
import { Image } from "antd";
import { BookOpen, ExternalLink } from "lucide-react";
import { buildStorageUrl } from "@/lib/submissionAttachments";
import QuizAudioPlayer from "@/components/quiz/QuizAudioPlayer";

export type QuizMediaDisplayQuestion = {
  type: string;
  correct_answer?: unknown;
};

type Props = {
  question: QuizMediaDisplayQuestion;
  answer: unknown;
};

const parseAnswer = (answer: unknown): Record<string, unknown> => {
  if (!answer) return {};
  if (typeof answer === "string") {
    try {
      const parsed = JSON.parse(answer);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  if (typeof answer === "object") return answer as Record<string, unknown>;
  return {};
};

export default function QuizMediaAnswerDisplay({ question, answer }: Props) {
  const data = parseAnswer(answer);

  if (question.type === "recording") {
    const audio = String(data.audio || "");
    if (!audio) {
      return <span className="text-sm text-gray-400">No recording submitted.</span>;
    }
    return <QuizAudioPlayer src={buildStorageUrl(audio)} className="w-full max-w-sm" />;
  }

  if (question.type === "image_upload") {
    const images = Array.isArray(data.images) ? (data.images as string[]) : [];
    const comment = String(data.comment || "");
    return (
      <div className="space-y-3">
        {images.length > 0 ? (
          <Image.PreviewGroup>
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <Image
                  key={index}
                  src={buildStorageUrl(img)}
                  alt={`Submitted image ${index + 1}`}
                  width={96}
                  height={96}
                  className="rounded-lg border border-gray-200 object-cover"
                />
              ))}
            </div>
          </Image.PreviewGroup>
        ) : (
          <span className="text-sm text-gray-400">No images submitted.</span>
        )}
        {comment && (
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            <span className="font-medium">Comment:</span> {comment}
          </p>
        )}
      </div>
    );
  }

  if (question.type === "reading") {
    const response = String(data.response || "");
    const bookUrl = buildStorageUrl(String(question.correct_answer || ""));
    return (
      <div className="space-y-2">
        {bookUrl && (
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <BookOpen size={14} /> Open reading material <ExternalLink size={12} />
          </a>
        )}
        {response ? (
          <p className="whitespace-pre-wrap text-sm text-gray-700">
            <span className="font-medium">Response:</span> {response}
          </p>
        ) : (
          <span className="text-sm text-gray-400">No response submitted.</span>
        )}
      </div>
    );
  }

  return null;
}
