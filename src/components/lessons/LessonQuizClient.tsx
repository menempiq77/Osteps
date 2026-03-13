"use client";

import { useMemo, useState } from "react";

export type LessonQuizQuestion = {
  prompt: string | { en: string; ar: string };
  options: Array<string | { en: string; ar: string }>;
  correctIndex: number;
  explanation?: string | { en: string; ar: string };
};

type Props = {
  lessonSlug: string;
  unlocked: boolean;
  questions: LessonQuizQuestion[];
  onPass?: () => void;
  onResetProgress?: () => void;
  presentationMode?: boolean;
};

const QUIZ_STORAGE_PREFIX = "islamic_curriculum_lesson_quiz_v1";

type StoredQuizState = {
  passed: boolean;
  score: number;
  total: number;
  completedAt: string;
  answers: Array<number | null>;
};

function quizKey(lessonSlug: string) {
  return `${QUIZ_STORAGE_PREFIX}:${lessonSlug}`;
}

function getText(value: string | { en: string; ar: string }, language: "en" | "ar"): string {
  if (typeof value === "string") return value;
  return value[language] || value.en;
}

export default function LessonQuizClient({
  lessonSlug,
  unlocked,
  questions,
  onPass,
  onResetProgress,
  presentationMode = false,
}: Props) {
  const stored = useMemo(() => {
    if (typeof window === "undefined") return null as StoredQuizState | null;

    try {
      const raw = window.localStorage.getItem(quizKey(lessonSlug));
      if (!raw) return null;
      return JSON.parse(raw) as StoredQuizState;
    } catch {
      return null;
    }
  }, [lessonSlug]);

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => stored?.answers ?? Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(Boolean(stored));
  const [score, setScore] = useState<number | null>(stored?.score ?? null);
  const [passed, setPassed] = useState(Boolean(stored?.passed));
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const passMark = Math.ceil(questions.length * 0.7);

  function submitQuiz() {
    if (!unlocked) return;

    const nextScore = questions.reduce(
      (total, question, index) => total + (answers[index] === question.correctIndex ? 1 : 0),
      0
    );
    const nextPassed = nextScore >= passMark;
    const payload: StoredQuizState = {
      passed: nextPassed,
      score: nextScore,
      total: questions.length,
      completedAt: new Date().toISOString(),
      answers,
    };

    try {
      window.localStorage.setItem(quizKey(lessonSlug), JSON.stringify(payload));
      window.dispatchEvent(new Event("lesson-progress-updated"));
    } catch {
      // ignore
    }

    setSubmitted(true);
    setScore(nextScore);
    setPassed(nextPassed);

    if (nextPassed) onPass?.();
  }

  function resetQuiz() {
    try {
      window.localStorage.removeItem(quizKey(lessonSlug));
      window.dispatchEvent(new Event("lesson-progress-updated"));
    } catch {
      // ignore
    }

    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(null);
    setPassed(false);
    setActiveQuestionIndex(0);
    onResetProgress?.();
  }

  const activeQuestion = questions[activeQuestionIndex];

  function renderQuestion(question: LessonQuizQuestion, index: number) {
    return (
      <div key={`${lessonSlug}-q-${index}`} className="rounded-lg border border-gray-200 p-4">
        <div className="mb-3 text-sm font-black text-gray-900">
          {index + 1}. {getText(question.prompt, "en")}
        </div>
        <div dir="rtl" className="mb-3 text-sm font-semibold text-slate-700">
          {getText(question.prompt, "ar")}
        </div>

        <div className="grid gap-2">
          {question.options.map((option, optionIndex) => {
            const id = `${lessonSlug}-q-${index}-option-${optionIndex}`;
            return (
              <label
                key={id}
                htmlFor={id}
                className={
                  "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 text-sm font-bold " +
                  (answers[index] === optionIndex
                    ? "border-teal-300 bg-teal-50 text-teal-900"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50") +
                  (passed ? " cursor-not-allowed opacity-80" : "")
                }
              >
                <input
                  id={id}
                  type="radio"
                  name={`${lessonSlug}-q-${index}`}
                  checked={answers[index] === optionIndex}
                  disabled={passed}
                  onChange={() => {
                    if (passed) return;
                    const next = answers.slice();
                    next[index] = optionIndex;
                    setAnswers(next);
                  }}
                  className="mt-1"
                />
                <span className="flex-1">
                  <span className="block">{getText(option, "en")}</span>
                  <span dir="rtl" className="mt-1 block text-slate-600">
                    {getText(option, "ar")}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        {submitted && score !== null && question.explanation ? (
          <div
            className={
              "mt-3 rounded-md px-3 py-2 text-sm font-semibold " +
              (answers[index] === question.correctIndex
                ? "bg-green-50 text-green-700"
                : "bg-rose-50 text-rose-700")
            }
          >
            <div>{getText(question.explanation, "en")}</div>
            <div dir="rtl" className="mt-1">
              {getText(question.explanation, "ar")}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-2 text-xl font-black text-gray-900">Quiz (10 questions)</div>
      <div className="mb-5 text-sm font-bold text-gray-700">
        Pass requirement: at least {passMark}/{questions.length}.
      </div>

      {!unlocked && !passed ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
          Complete all lesson parts above first to unlock the quiz.
        </div>
      ) : null}

      {unlocked || passed ? (
        <div className="grid gap-4">
          {presentationMode ? (
            <div className="grid gap-4">
              <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                <span>
                  Question {activeQuestionIndex + 1} of {questions.length}
                </span>
                <span>{answers.filter((answer) => answer !== null).length} answered</span>
              </div>

              {renderQuestion(activeQuestion, activeQuestionIndex)}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveQuestionIndex((current) => Math.max(current - 1, 0))}
                  disabled={activeQuestionIndex === 0}
                  className="rounded-lg border-2 border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous question
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  {!passed && activeQuestionIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveQuestionIndex((current) => Math.min(current + 1, questions.length - 1))
                      }
                      className="rounded-lg border-2 border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                    >
                      Next question
                    </button>
                  ) : null}

                  {!passed && activeQuestionIndex === questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={submitQuiz}
                      disabled={!unlocked}
                      className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit Quiz
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="rounded-lg border-2 border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
                  >
                    Reset quiz
                  </button>
                </div>
              </div>
            </div>
          ) : (
            questions.map((question, index) => renderQuestion(question, index))
          )}

          <div className="flex flex-wrap items-center gap-3">
            {!presentationMode && !passed ? (
              <button
                type="button"
                onClick={submitQuiz}
                disabled={!unlocked}
                className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Quiz
              </button>
            ) : null}

            {submitted && score !== null ? (
              <div className="text-sm font-black text-gray-900">
                Score: {score}/{questions.length} {passed ? "(Passed)" : "(Try again)"}
              </div>
            ) : null}

          </div>
        </div>
      ) : null}
    </div>
  );
}
