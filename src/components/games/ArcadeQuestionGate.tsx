"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ArcadeQuestion } from "./useArcadeQuestionPool";

type AnswerState = "idle" | "correct" | "wrong";

type ArcadeQuestionGateProps = {
  gameId: string;
  gameTitle: string;
  completedLevel: number;
  nextLevelLabel: string;
  questions: ArcadeQuestion[];
  isLoading: boolean;
  errorMessage: string | null;
  isPreview: boolean;
  subjectName: string | null;
  onPassed: () => void;
  onBack: () => void;
  onRetryLoad: () => void;
};

const QUESTION_COUNT = 5;

const hashText = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const selectQuestions = (
  questions: ArcadeQuestion[],
  gameId: string,
  completedLevel: number,
) => {
  if (questions.length === 0) return [];
  const ordered = [...questions].sort(
    (left, right) =>
      hashText(`${gameId}:${completedLevel}:${left.id}`) -
      hashText(`${gameId}:${completedLevel}:${right.id}`),
  );
  return Array.from(
    { length: QUESTION_COUNT },
    (_, index) => ordered[index % ordered.length],
  );
};

export default function ArcadeQuestionGate({
  gameId,
  gameTitle,
  completedLevel,
  nextLevelLabel,
  questions,
  isLoading,
  errorMessage,
  isPreview,
  subjectName,
  onPassed,
  onBack,
  onRetryLoad,
}: ArcadeQuestionGateProps) {
  const selectedQuestions = useMemo(
    () => selectQuestions(questions, gameId, completedLevel),
    [completedLevel, gameId, questions],
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");

  useEffect(() => {
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setAnswerState("idle");
  }, [completedLevel, gameId, selectedQuestions.length]);

  const question = selectedQuestions[questionIndex];
  const correctCount = questionIndex + (answerState === "correct" ? 1 : 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[30px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 p-6 text-center">
        <div>
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-500" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            Preparing your challenge
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-500">
            Loading questions from your completed tracker topics…
          </p>
        </div>
      </div>
    );
  }

  if (errorMessage || !question) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[30px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 text-center">
        <div className="max-w-lg">
          <BookOpenCheck className="mx-auto h-14 w-14 text-amber-500" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            More completed-topic questions are needed
          </h2>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
            {errorMessage ??
              "Complete at least one tracker topic, then return to unlock the next level."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onRetryLoad}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-black text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Check again
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chooseOption = (optionId: string, correct: boolean) => {
    if (answerState === "correct") return;
    setSelectedOptionId(optionId);
    setAnswerState(correct ? "correct" : "wrong");
  };

  const continueChallenge = () => {
    if (answerState !== "correct") return;
    if (questionIndex === QUESTION_COUNT - 1) {
      onPassed();
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedOptionId(null);
    setAnswerState("idle");
  };

  return (
    <div className="overflow-hidden rounded-[30px] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-fuchsia-50 shadow-[0_24px_70px_rgba(79,70,229,0.15)]">
      <div className="bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 px-5 py-5 text-white sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100">
              Level {completedLevel} knowledge gate
            </p>
            <h1 className="mt-1 text-2xl font-black">
              Answer five to unlock {nextLevelLabel}
            </h1>
            <p className="mt-1 text-xs font-bold text-indigo-100">
              {isPreview
                ? "Admin preview questions"
                : `From completed ${subjectName ? `${subjectName} ` : ""}tracker topics`}
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-center backdrop-blur">
            <p className="text-2xl font-black">
              {correctCount}/{QUESTION_COUNT}
            </p>
            <p className="text-[9px] font-black uppercase tracking-wider text-indigo-100">
              Correct
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {Array.from({ length: QUESTION_COUNT }, (_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full ${
                index < correctCount ? "bg-yellow-300" : "bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="rounded-[26px] border border-white bg-white/85 p-5 shadow-lg sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-500">
                Question {questionIndex + 1} of {QUESTION_COUNT}
              </p>
              <h2 className="mt-3 text-xl font-black leading-8 text-slate-900 sm:text-2xl">
                {question.prompt}
              </h2>
            </div>
            <BookOpenCheck className="h-7 w-7 shrink-0 text-cyan-500" />
          </div>

          <p className="mt-2 text-xs font-bold text-slate-400">
            From: {question.sourceLabel}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, index) => {
              const selected = selectedOptionId === option.id;
              const correctSelection = selected && answerState === "correct";
              const wrongSelection = selected && answerState === "wrong";
              return (
                <button
                  key={`${question.id}-${option.id}-${index}`}
                  type="button"
                  onClick={() => chooseOption(option.id, option.correct)}
                  disabled={answerState === "correct"}
                  className={`min-h-[64px] rounded-2xl border-2 px-4 py-3 text-left text-sm font-black transition ${
                    correctSelection
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : wrongSelection
                        ? "border-rose-400 bg-rose-50 text-rose-800"
                        : "border-slate-100 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                  } disabled:cursor-default`}
                >
                  <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs shadow-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.text}
                </button>
              );
            })}
          </div>

          <div className="mt-5 min-h-[52px]">
            {answerState === "correct" ? (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                Correct! The next question is ready.
              </div>
            ) : answerState === "wrong" ? (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700">
                <XCircle className="h-5 w-5" />
                Not yet—choose another answer. There is no penalty.
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700">
                <Sparkles className="h-5 w-5" />
                Every answer must be correct before the next level opens.
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={continueChallenge}
              disabled={answerState !== "correct"}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-35"
            >
              {questionIndex === QUESTION_COUNT - 1
                ? `Unlock ${nextLevelLabel}`
                : "Next question"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs font-bold text-slate-500">
          {gameTitle} retries, question retries, and level gates never cost
          extra coins or remove game lives.
        </p>
      </div>
    </div>
  );
}
