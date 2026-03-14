"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/app/LanguageContext";
import LessonQuizClient, { LessonQuizQuestion } from "./LessonQuizClient";

export type LessonSection = {
  title: string | { en: string; ar: string };
  body: string | { en: string; ar: string };
  learningObjective?: string | { en: string; ar: string };
  learningObjectives?: Array<string | { en: string; ar: string }>;
  successCriteria?: Array<string | { en: string; ar: string }>;
  infoBoxes?: Array<{
    label: string | { en: string; ar: string };
    lines: Array<string | { en: string; ar: string }>;
  }>;
  groupTasks?: {
    title?: string | { en: string; ar: string };
    instruction?: string | { en: string; ar: string };
    groups: Array<{
      slug: string;
      name: string | { en: string; ar: string };
      learningObjective: string | { en: string; ar: string };
      task: string | { en: string; ar: string };
      evidence: Array<string | { en: string; ar: string }>;
      sourceNotes: Array<string | { en: string; ar: string }>;
      memberRoles: Array<string | { en: string; ar: string }>;
      finalProduct: string | { en: string; ar: string };
    }>;
  };
  matchingActivity?: {
    title: string | { en: string; ar: string };
    instruction?: string | { en: string; ar: string };
    prompts: Array<{
      prompt: string | { en: string; ar: string };
      answer: string | { en: string; ar: string };
    }>;
  };
  image?: {
    src: string;
    alt: string | { en: string; ar: string };
    caption?: string | { en: string; ar: string };
  };
  callout?: {
    label: string | { en: string; ar: string };
    title: string | { en: string; ar: string };
    body: string | { en: string; ar: string };
  };
  responsePrompt?: {
    title: string | { en: string; ar: string };
    prompt: string | { en: string; ar: string };
    placeholder?: string | { en: string; ar: string };
    buttonLabel?: string | { en: string; ar: string };
  };
};

export type CourseLesson = {
  slug: string;
  name: string | { en: string; ar: string };
  shortIntro: string | { en: string; ar: string };
  sections: LessonSection[];
  quranSurahs?: string[];
  quizQuestions: LessonQuizQuestion[];
};

type LessonProgress = {
  currentSectionIndex: number;
  completedSectionIndices: number[];
  isLessonCompleted: boolean;
};

type Props = {
  lesson: CourseLesson;
};

const PROGRESS_PREFIX = "islamic_curriculum_lesson_progress_v1";
const QUIZ_PREFIX = "islamic_curriculum_lesson_quiz_v1";

const EMPTY_PROGRESS: LessonProgress = {
  currentSectionIndex: 0,
  completedSectionIndices: [],
  isLessonCompleted: false,
};

function progressKey(slug: string) {
  return `${PROGRESS_PREFIX}:${slug}`;
}

function quizKey(slug: string) {
  return `${QUIZ_PREFIX}:${slug}`;
}

function subscribeToProgress(callback: () => void) {
  const handleStorage = (e: StorageEvent) => {
    if (!e.key) return;
    if (e.key.startsWith(`${PROGRESS_PREFIX}:`) || e.key.startsWith(`${QUIZ_PREFIX}:`)) {
      callback();
    }
  };
  const handleProgress = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener("lesson-progress-updated", handleProgress);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("lesson-progress-updated", handleProgress);
  };
}

function getText(value: string | { en: string; ar: string }, language: "en" | "ar"): string {
  if (typeof value === "string") return value;
  return value[language] || value.en;
}

function getLessonProgress(slug: string): LessonProgress {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(progressKey(slug));
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LessonProgress>;
    return {
      currentSectionIndex:
        typeof parsed.currentSectionIndex === "number" ? parsed.currentSectionIndex : 0,
      completedSectionIndices: Array.isArray(parsed.completedSectionIndices)
        ? parsed.completedSectionIndices.filter((value) => typeof value === "number")
        : [],
      isLessonCompleted: Boolean(parsed.isLessonCompleted),
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function setLessonProgress(slug: string, progress: LessonProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(progressKey(slug), JSON.stringify(progress));
    window.dispatchEvent(new Event("lesson-progress-updated"));
  } catch {
    // ignore
  }
}

function hasPassedQuiz(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(quizKey(slug));
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { passed?: unknown };
    return Boolean(parsed.passed);
  } catch {
    return false;
  }
}

export default function LessonCourseStepper({ lesson }: Props) {
  const { language } = useLanguage();
  const presentationRef = useRef<HTMLDivElement | null>(null);
  const previewMode = true;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progress = useSyncExternalStore(
    subscribeToProgress,
    () => getLessonProgress(lesson.slug),
    () => EMPTY_PROGRESS
  );

  const totalSections = lesson.sections.length + 1;
  const quizIndex = totalSections - 1;
  const completedSet = useMemo(() => new Set(progress.completedSectionIndices), [progress.completedSectionIndices]);
  const nextRequiredIndex = useMemo(() => {
    for (let index = 0; index < totalSections; index += 1) {
      if (!completedSet.has(index)) return index;
    }
    return totalSections - 1;
  }, [completedSet, totalSections]);
  const highestUnlockedIndex = previewMode
    ? Math.max(0, totalSections - 1)
    : Math.min(nextRequiredIndex, totalSections - 1);
  const activeIndex = Math.min(Math.max(progress.currentSectionIndex ?? 0, 0), highestUnlockedIndex);
  const isOnQuizSection = activeIndex === quizIndex;
  const activeSection = lesson.sections[activeIndex];
  const lessonDone = progress.isLessonCompleted;
  const completedCount = completedSet.size;
  const progressPct = Math.min(100, Math.round((completedCount / totalSections) * 100));
  const hasCompletedAllLessonSections = lesson.sections.every((_, index) => completedSet.has(index));

  function scrollToTop() {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function goTo(index: number) {
    setLessonProgress(lesson.slug, {
      ...progress,
      currentSectionIndex: Math.min(Math.max(index, 0), highestUnlockedIndex),
    });
    scrollToTop();
  }

  function markDoneAndAdvance() {
    if (previewMode) {
      goTo(activeIndex + 1);
      return;
    }

    if (isOnQuizSection && !hasPassedQuiz(lesson.slug)) return;

    const completed = new Set(progress.completedSectionIndices);
    completed.add(activeIndex);
    const nextCompleted = Array.from(completed).sort((a, b) => a - b);
    const nextIndex = Math.min(activeIndex + 1, totalSections - 1);
    const done = nextCompleted.length >= totalSections && hasPassedQuiz(lesson.slug);

    setLessonProgress(lesson.slug, {
      currentSectionIndex: nextIndex,
      completedSectionIndices: nextCompleted,
      isLessonCompleted: done,
    });
    scrollToTop();
  }

  function markQuizPassed() {
    const completed = new Set(getLessonProgress(lesson.slug).completedSectionIndices);
    completed.add(quizIndex);
    setLessonProgress(lesson.slug, {
      currentSectionIndex: quizIndex,
      completedSectionIndices: Array.from(completed).sort((a, b) => a - b),
      isLessonCompleted: true,
    });
  }

  function resetProgress() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(progressKey(lesson.slug));
      window.localStorage.removeItem(quizKey(lesson.slug));
      window.dispatchEvent(new Event("lesson-progress-updated"));
    } catch {
      // ignore
    }
  }

  async function toggleFullscreen() {
    if (typeof document === "undefined") return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (presentationRef.current) {
        await presentationRef.current.requestFullscreen();
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      ref={presentationRef}
      className={
        "rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_32%),linear-gradient(180deg,_#f8fffe_0%,_#eef7f5_100%)] p-4 md:p-6 " +
        (isFullscreen ? "min-h-screen" : "")
      }
    >
      <div className="mb-5 rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-gray-700">
              {language === "ar" ? "تقدمك" : "Your Progress"}
            </div>
            <div className="text-2xl font-black text-gray-900">
              {completedCount}/{totalSections} {language === "ar" ? "أجزاء مكتملة" : "parts completed"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lessonDone ? (
              <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                {language === "ar" ? "مكتمل" : "Completed"}
              </div>
            ) : null}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              {isFullscreen
                ? language === "ar"
                  ? "إنهاء ملء الشاشة"
                  : "Exit Fullscreen"
                : language === "ar"
                ? "ملء الشاشة"
                : "Fullscreen"}
            </button>
          </div>
        </div>

        <div className="mb-3 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <button
          type="button"
          onClick={resetProgress}
          className="text-sm font-bold text-gray-500 hover:text-gray-700"
        >
          {language === "ar" ? "إعادة التقدم" : "Reset progress"}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-black text-gray-900">{language === "ar" ? "الأجزاء" : "Parts"}</div>
            <div className="text-xs font-bold text-gray-500">
              {previewMode
                ? language === "ar"
                  ? "وضع المعاينة: جميع الأجزاء مفتوحة"
                  : "Preview mode: all parts unlocked"
                : language === "ar"
                ? "تفتح بالتدرج"
                : "Locked until completed"}
            </div>
          </div>

          <div className="grid gap-2">
            {lesson.sections.map((section, index) => {
              const locked = index > highestUnlockedIndex;
              const isActive = index === activeIndex;
              const isDone = completedSet.has(index);

              return (
                <button
                  key={`${lesson.slug}-section-${index}`}
                  type="button"
                  disabled={locked}
                  onClick={() => goTo(index)}
                  className={
                    "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left font-bold transition-all " +
                    (isActive
                      ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                      : locked
                      ? "border-gray-200 bg-white text-gray-400 opacity-70"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50")
                  }
                >
                  <span
                    className={
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black " +
                      (isDone
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-teal-500 text-white"
                        : locked
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-100 text-gray-600")
                    }
                  >
                    {isDone ? "✓" : index + 1}
                  </span>
                  <span className="flex-1">{getText(section.title, language)}</span>
                </button>
              );
            })}

            <button
              type="button"
              disabled={quizIndex > highestUnlockedIndex}
              onClick={() => goTo(quizIndex)}
              className={
                "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left font-bold transition-all " +
                (isOnQuizSection
                  ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                  : quizIndex > highestUnlockedIndex
                  ? "border-gray-200 bg-white text-gray-400 opacity-70"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50")
              }
            >
              <span
                className={
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black " +
                  (completedSet.has(quizIndex)
                    ? "bg-green-500 text-white"
                    : isOnQuizSection
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-600")
                }
              >
                {completedSet.has(quizIndex) ? "✓" : totalSections}
              </span>
              <span className="flex-1">{language === "ar" ? "الاختبار" : "Quiz"}</span>
            </button>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
          <div className="rounded-t-[30px] border-b border-slate-200 bg-[linear-gradient(135deg,_rgba(13,148,136,0.10),_rgba(255,255,255,0.92)_48%,_rgba(20,184,166,0.08))] px-6 py-5 md:px-10">
            <div className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-teal-600">
              {language === "ar"
                ? `الجزء ${activeIndex + 1} من ${totalSections}`
                : `Part ${activeIndex + 1} of ${totalSections}`}
            </div>
            <div className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              {isOnQuizSection
                ? language === "ar"
                  ? "الاختبار النهائي"
                  : "Final Quiz"
                : getText(activeSection.title, language)}
            </div>
            {completedSet.has(activeIndex) ? (
              <div className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-green-600">
                <span>✓</span> {language === "ar" ? "مكتمل" : "Completed"}
              </div>
            ) : null}
          </div>

          <div className="min-h-[560px] px-6 py-8 md:px-10 md:py-10">
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 whitespace-pre-line text-lg leading-9 text-slate-700 md:text-[1.18rem]">
                {isOnQuizSection ? (
                  <LessonQuizClient
                    lessonSlug={lesson.slug}
                    unlocked={hasCompletedAllLessonSections}
                    questions={lesson.quizQuestions}
                    onPass={markQuizPassed}
                    onResetProgress={() => {
                      const current = getLessonProgress(lesson.slug);
                      setLessonProgress(lesson.slug, {
                        ...current,
                        completedSectionIndices: current.completedSectionIndices.filter((index) => index !== quizIndex),
                        isLessonCompleted: false,
                      });
                    }}
                  />
                ) : (
                  getText(activeSection.body, language)
                )}
              </div>

              {!isOnQuizSection && lesson.quranSurahs?.length ? (
                <div className="mb-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
                  <div className="text-sm font-black text-gray-900">
                    {language === "ar" ? "مراجع من القرآن والسنة" : "Qur'an and Sunnah references"}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-700">{lesson.quranSurahs.join(" | ")}</div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-[30px] border-t border-slate-200 bg-slate-50/90 px-6 py-5 md:px-10">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="rounded-lg border-2 border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {language === "ar" ? "السابق" : "Previous"}
            </button>

            <button
              type="button"
              onClick={markDoneAndAdvance}
              disabled={isOnQuizSection && !hasPassedQuiz(lesson.slug)}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeIndex < totalSections - 1
                ? language === "ar"
                  ? "إتمام والانتقال"
                  : "Mark Done & Next"
                : language === "ar"
                ? "إتمام"
                : "Mark Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
