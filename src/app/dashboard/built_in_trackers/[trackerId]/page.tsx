"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  Flame,
  Lock,
  Play,
  Trophy,
} from "lucide-react";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  QUESTIONS_PER_LESSON,
  getBuiltInTracker,
  supportsBuiltInTrackers,
} from "@/lib/builtinTrackers";
import { useBuiltInTrackerProgress } from "@/hooks/useBuiltInTrackerProgress";
import { withHonorifics } from "@/lib/islamicHonorifics";
import { TreeProgress } from "@/components/builtInTrackers/TreeProgress";
import { AssignTrackerButton } from "@/components/builtInTrackers/AssignTrackerButton";

export default function BuiltInTrackerPage() {
  const params = useParams<{ trackerId: string }>();
  const searchParams = useSearchParams();
  const { activeSubject, loading } = useSubjectContext();
  const subjectId = searchParams.get("subject_id");
  const subjectQuery = subjectId ? `?subject_id=${subjectId}` : "";
  const trackerId = String(params?.trackerId ?? "");
  const tracker = getBuiltInTracker(trackerId);
  const allowed = supportsBuiltInTrackers(activeSubject?.name);

  const { progress, isStudent, coinBalance } = useBuiltInTrackerProgress(
    trackerId,
    {
      passMark: tracker?.passMark ?? 7,
      totalQuestions: QUESTIONS_PER_LESSON,
    }
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (!tracker || !allowed) {
    return (
      <div className="p-3 md:p-6">
        <Link
          href={`/dashboard/built_in_trackers${subjectQuery}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Built-in Trackers
        </Link>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <p className="text-sm font-semibold">
            This built-in tracker is not available for this subject.
          </p>
        </div>
      </div>
    );
  }

  const completed = tracker.lessons.filter(
    (lesson) => progress[lesson.id]?.passed
  ).length;
  const started = tracker.lessons.filter(
    (lesson) => (progress[lesson.id]?.attempts ?? 0) > 0
  ).length;
  const coinsEarned = tracker.lessons.reduce(
    (total, lesson) => total + (progress[lesson.id]?.coins_awarded ?? 0),
    0
  );
  const percent = Math.round((completed / tracker.lessons.length) * 100);

  return (
    <div className="p-3 md:p-6">
      <Link
        href={`/dashboard/built_in_trackers${subjectQuery}`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Built-in Trackers
      </Link>

      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${tracker.accent} p-6 text-white shadow-lg md:p-8`}
      >
        <div className="pointer-events-none absolute inset-0 bg-slate-950/15" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white drop-shadow">
              Built-in tracker
            </div>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold md:text-3xl">
              <span>{tracker.emoji}</span>
              {withHonorifics(tracker.name)}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white drop-shadow">
              {withHonorifics(tracker.description)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-extrabold">{completed}</div>
              <div className="text-[11px] uppercase tracking-wide text-white drop-shadow">
                Passed
              </div>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-extrabold">
                {tracker.lessons.length - completed}
              </div>
              <div className="text-[11px] uppercase tracking-wide text-white drop-shadow">
                Left
              </div>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-extrabold">{coinsEarned}</div>
              <div className="text-[11px] uppercase tracking-wide text-white drop-shadow">
                Coins
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="relative z-10 mb-1 flex items-center justify-between text-xs font-semibold text-white drop-shadow">
            <span>
              {completed} of {tracker.lessons.length} {tracker.lessonLabelPlural}{" "}
              completed
            </span>
            <span>{percent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="relative z-10 mt-3 text-sm font-medium text-white drop-shadow">
            {completed === tracker.lessons.length
              ? "MashaAllah! You have completed every story. Revise any of them any time."
              : started > completed
              ? "Great effort — finish the ones you started and score at least " +
                tracker.passMark +
                "/10 to collect coins!"
              : "Read a story, answer 10 questions, score " +
                tracker.passMark +
                "/10 or more and collect " +
                tracker.coinReward +
                " coins."}
          </p>
        </div>
      </div>

      {isStudent && coinBalance !== null && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
          <Coins className="h-4 w-4" />
          Your wallet: {coinBalance} coins
        </div>
      )}
      {!isStudent && (
        <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          You are viewing this as staff. Students see the same stories and
          quizzes, and collect {tracker.coinReward} coins for every prophet they
          pass with {tracker.passMark}/{QUESTIONS_PER_LESSON} or more.
        </div>
      )}
      {!isStudent && tracker.courseKey && (
        <div className="mt-4 max-w-md">
          <AssignTrackerButton
            courseKey={tracker.courseKey}
            trackerName={withHonorifics(tracker.name)}
          />
        </div>
      )}

      <div className="mt-6 max-w-3xl">
        <TreeProgress
          completed={completed}
          total={tracker.lessons.length}
          accent={tracker.accent}
          name={withHonorifics(tracker.name)}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tracker.lessons.map((lesson, index) => {
          const lessonProgress = progress[lesson.id];
          const passed = Boolean(lessonProgress?.passed);
          const attempts = lessonProgress?.attempts ?? 0;
          const bestScore = lessonProgress?.best_score ?? 0;

          return (
            <Link
              key={lesson.id}
              href={`/dashboard/built_in_trackers/${tracker.id}/${lesson.id}${subjectQuery}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${lesson.accent}`}
              />
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${lesson.accent} text-2xl`}
                >
                  {lesson.emoji}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                  #{index + 1}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold text-slate-800">
                {withHonorifics(lesson.name)}
              </h2>
              <p className="text-sm text-slate-400" dir="rtl">
                {lesson.arabicName}
              </p>
              <p className="mt-2 flex-1 text-sm text-slate-500">
                {withHonorifics(lesson.title)}
              </p>

              <div className="mt-4 flex items-center justify-between">
                {passed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Passed {bestScore}/{QUESTIONS_PER_LESSON}
                  </span>
                ) : attempts > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                    <Flame className="h-3.5 w-3.5" />
                    Best {bestScore}/{QUESTIONS_PER_LESSON}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                    <Play className="h-3.5 w-3.5" />
                    Not started
                  </span>
                )}
                {passed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Trophy className="h-3.5 w-3.5" />
                    {lessonProgress?.coins_awarded ?? 0}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <Lock className="h-3.5 w-3.5" />
                    {tracker.coinReward} coins
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
