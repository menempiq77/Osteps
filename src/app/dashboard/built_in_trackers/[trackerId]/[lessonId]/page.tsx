"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Coins,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { STUDENT_COINS_UPDATED_EVENT } from "@/components/dashboard/StudentCoinWallet";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  QUESTIONS_PER_LESSON,
  getBuiltInLesson,
  getBuiltInTracker,
  supportsBuiltInTrackers,
} from "@/lib/builtinTrackers";
import {
  useBuiltInTrackerProgress,
  type BuiltInAttemptOutcome,
} from "@/hooks/useBuiltInTrackerProgress";

type ShuffledQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

const shuffleOptions = (options: string[], correctIndex: number) => {
  const indexes = options.map((_, index) => index);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }

  return {
    options: indexes.map((index) => options[index]),
    correctIndex: indexes.indexOf(correctIndex),
  };
};

export default function BuiltInLessonPage() {
  const params = useParams<{ trackerId: string; lessonId: string }>();
  const searchParams = useSearchParams();
  const { activeSubject, loading } = useSubjectContext();
  const subjectId = searchParams.get("subject_id");
  const subjectQuery = subjectId ? `?subject_id=${subjectId}` : "";
  const trackerId = String(params?.trackerId ?? "");
  const lessonId = String(params?.lessonId ?? "");
  const tracker = getBuiltInTracker(trackerId);
  const lesson = getBuiltInLesson(tracker, lessonId);
  const allowed = supportsBuiltInTrackers(activeSubject?.name);

  const [stage, setStage] = useState<"story" | "quiz" | "result">("story");
  const [attempt, setAttempt] = useState(0);
  const [hasRead, setHasRead] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<
    (BuiltInAttemptOutcome & { score: number }) | null
  >(null);

  const { progress, isStudent, recordAttempt } = useBuiltInTrackerProgress(
    trackerId,
    {
      passMark: tracker?.passMark ?? 7,
      totalQuestions: QUESTIONS_PER_LESSON,
    }
  );

  const questions = useMemo<ShuffledQuestion[]>(() => {
    if (!lesson) return [];
    return lesson.questions.map((question) => {
      const shuffled = shuffleOptions(question.options, question.correctIndex);
      return {
        id: question.id,
        question: question.question,
        options: shuffled.options,
        correctIndex: shuffled.correctIndex,
      };
    });
    // A new attempt reshuffles the options.
  }, [lesson, attempt]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!tracker || !lesson || !allowed) {
    return (
      <div className="p-3 md:p-6">
        <Link
          href={`/dashboard/built_in_trackers${subjectQuery}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Built-in Trackers
        </Link>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-semibold text-amber-900">
          This story is not available for this subject.
        </div>
      </div>
    );
  }

  const lessonIndex = tracker.lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = tracker.lessons[lessonIndex + 1];
  const lessonProgress = progress[lesson.id];
  const currentQuestion = questions[questionIndex];
  const selected = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredCount = questions.filter(
    (question) => answers[question.id] !== undefined
  ).length;

  const startQuiz = () => {
    setAnswers({});
    setQuestionIndex(0);
    setOutcome(null);
    setStage("quiz");
  };

  const retry = () => {
    setAttempt((value) => value + 1);
    setAnswers({});
    setQuestionIndex(0);
    setOutcome(null);
    setHasRead(false);
    setStage("story");
  };

  const submitQuiz = async () => {
    const score = questions.reduce(
      (total, question) =>
        answers[question.id] === question.correctIndex ? total + 1 : total,
      0
    );
    setSubmitting(true);
    try {
      const result = await recordAttempt(lesson.id, score);
      setOutcome({ ...result, score });
      if (result.awarded && typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(STUDENT_COINS_UPDATED_EVENT, {
            detail: { amount: result.coinsEarned },
          })
        );
      }
      setStage("result");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3 md:p-6">
      <Link
        href={`/dashboard/built_in_trackers/${tracker.id}${subjectQuery}`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {tracker.name}
      </Link>

      <div
        className={`overflow-hidden rounded-3xl bg-gradient-to-r ${lesson.accent} p-6 text-white shadow-lg`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
              {lesson.emoji}
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                {tracker.lessonLabel} {lessonIndex + 1} of{" "}
                {tracker.lessons.length}
              </div>
              <h1 className="text-2xl font-extrabold md:text-3xl">
                {lesson.name}
              </h1>
              <p className="text-sm text-white/90" dir="rtl">
                {lesson.arabicName}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold backdrop-blur">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              {tracker.coinReward} coins for {tracker.passMark}/
              {QUESTIONS_PER_LESSON}
            </div>
            {lessonProgress?.passed && (
              <div className="mt-1 flex items-center gap-2 text-white/90">
                <CheckCircle2 className="h-4 w-4" />
                Best score {lessonProgress.best_score}/{QUESTIONS_PER_LESSON}
              </div>
            )}
          </div>
        </div>
      </div>

      {stage === "story" && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
              <BookOpen className="h-4 w-4" />
              {lesson.title}
            </div>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-700">
              {lesson.story.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              <input
                type="checkbox"
                checked={hasRead}
                onChange={(event) => setHasRead(event.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              I have read the whole story carefully.
            </label>

            <button
              type="button"
              disabled={!hasRead}
              onClick={startQuiz}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              Start the {QUESTIONS_PER_LESSON} questions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
                <Lightbulb className="h-4 w-4" />
                What we learn
              </div>
              <ul className="mt-3 space-y-2 text-sm text-amber-900">
                {lesson.lessons.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
              <p className="font-bold text-slate-800">How it works</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Read the story from start to end.</li>
                <li>Answer {QUESTIONS_PER_LESSON} multiple choice questions.</li>
                <li>
                  Score {tracker.passMark} or more to collect{" "}
                  {tracker.coinReward} coins.
                </li>
                <li>You can try again as many times as you like.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {stage === "quiz" && currentQuestion && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              Question {questionIndex + 1} of {questions.length}
            </span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${lesson.accent} transition-all duration-300`}
              style={{
                width: `${((questionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-800">
            {currentQuestion.question}
          </h2>

          <div className="mt-4 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selected === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setAnswers((current) => ({
                      ...current,
                      [currentQuestion.id]: index,
                    }))
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))}
              disabled={questionIndex === 0}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {questionIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setQuestionIndex((index) => index + 1)}
                disabled={selected === undefined}
                className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Next question
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitQuiz}
                disabled={answeredCount < questions.length || submitting}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Finish and see my score
              </button>
            )}
          </div>
        </div>
      )}

      {stage === "result" && outcome && (
        <div className="mt-6 space-y-4">
          <div
            className={`overflow-hidden rounded-3xl p-6 text-center text-white shadow-lg ${
              outcome.passed
                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                : "bg-gradient-to-br from-orange-500 to-rose-600"
            }`}
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-3xl font-extrabold backdrop-blur">
              {outcome.score}/{questions.length}
            </div>
            <h2 className="mt-4 text-2xl font-extrabold">
              {outcome.passed
                ? "MashaAllah, you passed!"
                : "Good try — read it once more!"}
            </h2>
            <p className="mt-2 text-sm text-white/90">
              {outcome.passed
                ? `You needed ${tracker.passMark}/${questions.length} and you got ${outcome.score}.`
                : `You need ${tracker.passMark}/${questions.length} to collect coins. Read the story again and try once more — you can do it!`}
            </p>

            {outcome.passed && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-bold backdrop-blur">
                <Coins className="h-4 w-4" />
                {outcome.awarded
                  ? `+${outcome.coinsEarned} coins added to your wallet`
                  : isStudent
                  ? "You already collected the coins for this prophet"
                  : `Students collect ${tracker.coinReward} coins here`}
              </div>
            )}

            {isStudent && !outcome.synced && (
              <p className="mt-3 text-xs text-white/80">
                Your score was saved on this device, but the coin wallet could
                not be reached. Try again later to collect your coins.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-800">Your answers</p>
            <div className="mt-3 space-y-3">
              {questions.map((question, index) => {
                const chosen = answers[question.id];
                const correct = chosen === question.correctIndex;
                return (
                  <div
                    key={question.id}
                    className={`rounded-2xl border p-4 text-sm ${
                      correct
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-rose-200 bg-rose-50"
                    }`}
                  >
                    <div className="flex items-start gap-2 font-semibold text-slate-800">
                      {correct ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                      )}
                      <span>
                        {index + 1}. {question.question}
                      </span>
                    </div>
                    {!correct && (
                      <p className="mt-2 pl-6 text-slate-600">
                        Correct answer:{" "}
                        <span className="font-semibold text-emerald-700">
                          {question.options[question.correctIndex]}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Read again and retry
            </button>
            {nextLesson && (
              <Link
                href={`/dashboard/built_in_trackers/${tracker.id}/${nextLesson.id}${subjectQuery}`}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Next: {nextLesson.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href={`/dashboard/built_in_trackers/${tracker.id}${subjectQuery}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-900"
            >
              Back to all {tracker.lessonLabelPlural.toLowerCase()}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
