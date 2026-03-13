"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CourseLesson, LessonSection } from "./LessonCourseStepper";
import LessonQuizClient from "./LessonQuizClient";

type Props = { lesson: CourseLesson };

type LessonProgress = {
  currentSectionIndex: number;
  completedSectionIndices: number[];
};

type SlideBlock =
  | { type: "learningObjective"; value: NonNullable<LessonSection["learningObjective"]> }
  | { type: "image"; value: NonNullable<LessonSection["image"]> }
  | { type: "callout"; value: NonNullable<LessonSection["callout"]> }
  | { type: "body"; paragraphs: string[] }
  | { type: "responsePrompt"; value: NonNullable<LessonSection["responsePrompt"]> }
  | { type: "quiz" };

type PresentationSlide = {
  id: string;
  sectionIndex: number;
  slideIndexWithinSection: number;
  title: string;
  blocks: SlideBlock[];
};

const PROGRESS_PREFIX = "islamic_curriculum_lesson_progress_v2";

function progressKey(slug: string) {
  return `${PROGRESS_PREFIX}:${slug}`;
}

function getText(value: string | { en: string; ar: string }, language: "en" | "ar") {
  if (typeof value === "string") return value;
  return value[language] || value.en;
}

function splitBodyIntoParagraphs(body: string | { en: string; ar: string }) {
  return getText(body, "en")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function buildSlides(lesson: CourseLesson): PresentationSlide[] {
  const slides: PresentationSlide[] = [];

  lesson.sections.forEach((section, sectionIndex) => {
    const title = getText(section.title, "en");
    const paragraphs = splitBodyIntoParagraphs(section.body);
    const sectionSlides: PresentationSlide[] = [];

    if (sectionIndex === 0) {
      const opener: SlideBlock[] = [];
      if (section.learningObjective) opener.push({ type: "learningObjective", value: section.learningObjective });
      if (section.image) opener.push({ type: "image", value: section.image });
      if (section.callout) opener.push({ type: "callout", value: section.callout });
      if (opener.length) {
        sectionSlides.push({
          id: `${lesson.slug}-${sectionIndex}-0`,
          sectionIndex,
          slideIndexWithinSection: 0,
          title,
          blocks: opener,
        });
      }
      if (section.responsePrompt) {
        sectionSlides.push({
          id: `${lesson.slug}-${sectionIndex}-${sectionSlides.length}`,
          sectionIndex,
          slideIndexWithinSection: sectionSlides.length,
          title,
          blocks: [{ type: "responsePrompt", value: section.responsePrompt }],
        });
      }
    } else {
      const intro: SlideBlock[] = [];
      if (section.learningObjective) intro.push({ type: "learningObjective", value: section.learningObjective });
      if (section.image) intro.push({ type: "image", value: section.image });
      if (section.callout) intro.push({ type: "callout", value: section.callout });
      if (intro.length) {
        sectionSlides.push({
          id: `${lesson.slug}-${sectionIndex}-0`,
          sectionIndex,
          slideIndexWithinSection: 0,
          title,
          blocks: intro,
        });
      }

      for (let index = 0; index < paragraphs.length; index += 2) {
        sectionSlides.push({
          id: `${lesson.slug}-${sectionIndex}-${sectionSlides.length}`,
          sectionIndex,
          slideIndexWithinSection: sectionSlides.length,
          title,
          blocks: [{ type: "body", paragraphs: paragraphs.slice(index, index + 2) }],
        });
      }

      if (!sectionSlides.length) {
        sectionSlides.push({
          id: `${lesson.slug}-${sectionIndex}-0`,
          sectionIndex,
          slideIndexWithinSection: 0,
          title,
          blocks: [{ type: "body", paragraphs: [""] }],
        });
      }
    }

    slides.push(...sectionSlides);
  });

  slides.push({
    id: `${lesson.slug}-quiz`,
    sectionIndex: lesson.sections.length,
    slideIndexWithinSection: 0,
    title: "Final Quiz",
    blocks: [{ type: "quiz" }],
  });

  return slides;
}

function firstSlideIndexForSection(slides: PresentationSlide[], sectionIndex: number) {
  return slides.findIndex((slide) => slide.sectionIndex === sectionIndex);
}

function lastSlideIndexForSection(slides: PresentationSlide[], sectionIndex: number) {
  for (let index = slides.length - 1; index >= 0; index -= 1) {
    if (slides[index]?.sectionIndex === sectionIndex) return index;
  }
  return -1;
}

function slideCountForSection(slides: PresentationSlide[], sectionIndex: number) {
  return slides.filter((slide) => slide.sectionIndex === sectionIndex).length;
}

export default function LessonDeckClient({ lesson }: Props) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});
  const [partsMenuOpen, setPartsMenuOpen] = useState(false);

  const slides = useMemo(() => buildSlides(lesson), [lesson]);
  const totalSections = lesson.sections.length + 1;
  const quizIndex = totalSections - 1;
  const isOnQuizSection = activeIndex === quizIndex;
  const activeSection = lesson.sections[Math.min(activeIndex, lesson.sections.length - 1)];
  const activeSlide = slides[Math.min(activeSlideIndex, slides.length - 1)];
  const hasCompletedAllLessonSections = lesson.sections.every((_, index) =>
    completedIndices.includes(index)
  );
  const progressPct = Math.min(100, Math.round((completedIndices.length / totalSections) * 100));
  const isFirstFullscreenSlide = activeSlideIndex === 0;
  const isLastFullscreenSlide = activeSlideIndex === slides.length - 1;
  const slidesInActiveSection = slideCountForSection(slides, activeSlide?.sectionIndex ?? -1);
  const isLastSlideOfSection =
    activeSlide?.sectionIndex === quizIndex ||
    activeSlideIndex === lastSlideIndexForSection(slides, activeSlide?.sectionIndex ?? -1);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(progressKey(lesson.slug));
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<LessonProgress>;
      if (typeof parsed.currentSectionIndex === "number") setActiveIndex(parsed.currentSectionIndex);
      if (Array.isArray(parsed.completedSectionIndices)) {
        setCompletedIndices(parsed.completedSectionIndices.filter((value) => typeof value === "number"));
      }
    } catch {
      // ignore
    }
  }, [lesson.slug]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`${progressKey(lesson.slug)}:responses`);
      if (!raw) return;
      setResponses(JSON.parse(raw) as Record<string, string>);
    } catch {
      // ignore
    }
  }, [lesson.slug]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        progressKey(lesson.slug),
        JSON.stringify({
          currentSectionIndex: activeIndex,
          completedSectionIndices: completedIndices,
        })
      );
    } catch {
      // ignore
    }
  }, [activeIndex, completedIndices, lesson.slug]);

  useEffect(() => {
    const nextSlideIndex = firstSlideIndexForSection(slides, activeIndex);
    if (nextSlideIndex >= 0) setActiveSlideIndex(nextSlideIndex);
  }, [activeIndex, slides]);

  useEffect(() => {
    const onFullscreen = () => {
      const fullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(fullscreen);
      if (!fullscreen) setPartsMenuOpen(false);
    };
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isFullscreen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isFullscreen]);

  function goTo(index: number) {
    const next = Math.min(Math.max(index, 0), totalSections - 1);
    setActiveIndex(next);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function goToSlide(slideIndex: number) {
    const next = Math.min(Math.max(slideIndex, 0), slides.length - 1);
    const slide = slides[next];
    if (!slide) return;
    setActiveSlideIndex(next);
    setActiveIndex(slide.sectionIndex);
    setPartsMenuOpen(false);
  }

  function markSectionCompleted(sectionIndex: number) {
    if (sectionIndex === quizIndex) return;
    setCompletedIndices((current) =>
      current.includes(sectionIndex) ? current : [...current, sectionIndex].sort((a, b) => a - b)
    );
  }

  function markDoneAndAdvance() {
    if (isFullscreen) {
      if (activeSlide.sectionIndex === quizIndex) return;

      if (isLastSlideOfSection) {
        markSectionCompleted(activeSlide.sectionIndex);
      }

      if (!isLastFullscreenSlide) {
        goToSlide(activeSlideIndex + 1);
      }
      return;
    }

    if (activeIndex === quizIndex) return;
    markSectionCompleted(activeIndex);
    goTo(Math.min(activeIndex + 1, totalSections - 1));
  }

  function resetProgress() {
    setActiveIndex(0);
    setActiveSlideIndex(0);
    setCompletedIndices([]);
    setResponses({});
    setSavedStates({});
    try {
      window.localStorage.removeItem(progressKey(lesson.slug));
      window.localStorage.removeItem(`${progressKey(lesson.slug)}:responses`);
      window.localStorage.removeItem(`islamic_curriculum_lesson_quiz_v1:${lesson.slug}`);
    } catch {
      // ignore
    }
  }

  function saveResponse(sectionIndex: number) {
    const key = `${lesson.slug}:${sectionIndex}`;
    try {
      window.localStorage.setItem(`${progressKey(lesson.slug)}:responses`, JSON.stringify(responses));
      setSavedStates((current) => ({ ...current, [key]: true }));
      window.setTimeout(() => {
        setSavedStates((current) => ({ ...current, [key]: false }));
      }, 1800);
    } catch {
      // ignore
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (deckRef.current) {
        await deckRef.current.requestFullscreen();
      }
    } catch {
      // ignore
    }
  }

  function renderLearningObjective(
    value: NonNullable<LessonSection["learningObjective"]>,
    compact = false
  ) {
    return (
      <div className={"rounded-2xl border border-blue-200 bg-blue-50 " + (compact ? "p-4" : "p-5")}>
        <div className="flex items-start gap-4">
          <img
            src="/lessons/bloom-taxonomy-badge.svg"
            alt="Bloom taxonomy badge"
            className={
              "mt-1 flex-shrink-0 rounded-full border border-blue-200 bg-white p-1 " +
              (compact ? "h-10 w-10" : "h-12 w-12")
            }
          />
          <div className="min-w-0">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Learning objective
            </div>
            <div className={"mt-2 font-semibold text-slate-800 " + (compact ? "text-sm leading-7" : "text-base leading-8")}>
              {getText(value, "en")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderImage(value: NonNullable<LessonSection["image"]>, compact = false) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <img
          src={value.src}
          alt={getText(value.alt, "en")}
          className={compact ? "h-52 w-full object-cover xl:h-64" : "h-64 w-full object-cover md:h-80"}
        />
        {value.caption ? (
          <div className="border-t border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
            {getText(value.caption, "en")}
          </div>
        ) : null}
      </div>
    );
  }

  function renderCallout(value: NonNullable<LessonSection["callout"]>, compact = false) {
    return (
      <div className={"rounded-2xl border border-amber-200 bg-amber-50 " + (compact ? "p-4" : "p-5")}>
        <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
          {getText(value.label, "en")}
        </div>
        <div className={"mt-2 font-black text-slate-900 " + (compact ? "text-lg" : "text-xl")}>
          {getText(value.title, "en")}
        </div>
        <div className={"mt-4 whitespace-pre-line text-slate-700 " + (compact ? "text-sm leading-7" : "text-base leading-8")}>
          {getText(value.body, "en")}
        </div>
      </div>
    );
  }

  function renderResponsePrompt(
    value: NonNullable<LessonSection["responsePrompt"]>,
    sectionIndex: number,
    compact = false
  ) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
            You
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">{getText(value.title, "en")}</div>
            <div className="text-xs font-semibold text-slate-500">Share your evidence-based response</div>
          </div>
        </div>
        <div className="px-5 py-4">
          <div className={"mb-3 whitespace-pre-line font-semibold text-slate-700 " + (compact ? "text-sm leading-6" : "text-sm leading-7")}>
            {getText(value.prompt, "en")}
          </div>
          <textarea
            value={responses[`${lesson.slug}:${sectionIndex}`] ?? ""}
            onChange={(event) =>
              setResponses((current) => ({
                ...current,
                [`${lesson.slug}:${sectionIndex}`]: event.target.value,
              }))
            }
            placeholder={getText(value.placeholder ?? "Write your comment here...", "en")}
            className={
              "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base leading-8 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white " +
              (compact ? "min-h-[180px]" : "min-h-[160px]")
            }
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-slate-500">
              Use evidence from the Qur&apos;an, Hadith, life, Islamic stories, or science.
            </div>
            <button
              type="button"
              onClick={() => saveResponse(sectionIndex)}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-black text-white transition hover:bg-blue-700"
            >
              {getText(value.buttonLabel ?? "Post comment", "en")}
            </button>
          </div>
          {savedStates[`${lesson.slug}:${sectionIndex}`] ? (
            <div className="mt-3 text-sm font-bold text-green-600">Comment saved.</div>
          ) : null}
        </div>
      </div>
    );
  }

  function renderBodyParagraphs(paragraphs: string[], compact = false) {
    return (
      <div className="grid gap-4">
        {paragraphs.map((paragraph, index) => (
          <div
            key={`paragraph-${index}`}
            className={
              "rounded-2xl border border-slate-200 bg-white shadow-sm " + (compact ? "p-5" : "p-6")
            }
          >
            <div className={"whitespace-pre-line text-slate-700 " + (compact ? "text-base leading-8" : "text-lg leading-9")}>
              {paragraph}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderQuiz(presentationMode = false) {
    return (
      <LessonQuizClient
        lessonSlug={lesson.slug}
        unlocked={hasCompletedAllLessonSections}
        questions={lesson.quizQuestions}
        presentationMode={presentationMode}
        onPass={() =>
          setCompletedIndices((current) =>
            current.includes(quizIndex) ? current : [...current, quizIndex].sort((a, b) => a - b)
          )
        }
        onResetProgress={() =>
          setCompletedIndices((current) => current.filter((index) => index !== quizIndex))
        }
      />
    );
  }

  function renderSlideBlock(block: SlideBlock, sectionIndex: number, presentationMode = false) {
    switch (block.type) {
      case "learningObjective":
        return renderLearningObjective(block.value, presentationMode);
      case "image":
        return renderImage(block.value, presentationMode);
      case "callout":
        return renderCallout(block.value, presentationMode);
      case "body":
        return renderBodyParagraphs(block.paragraphs, presentationMode);
      case "responsePrompt":
        return renderResponsePrompt(block.value, sectionIndex, presentationMode);
      case "quiz":
        return renderQuiz(presentationMode);
      default:
        return null;
    }
  }

  function renderStandardSection() {
    if (isOnQuizSection) return renderQuiz(false);

    const paragraphs = splitBodyIntoParagraphs(activeSection.body);

    return (
      <div className="grid gap-6">
        {activeSection.learningObjective ? renderLearningObjective(activeSection.learningObjective) : null}
        {activeSection.image ? renderImage(activeSection.image) : null}
        {activeSection.callout ? renderCallout(activeSection.callout) : null}
        {paragraphs.length ? renderBodyParagraphs(paragraphs) : null}
        {activeSection.responsePrompt ? renderResponsePrompt(activeSection.responsePrompt, activeIndex) : null}
      </div>
    );
  }

  function renderPartButton(index: number, label: string, active: boolean, completed: boolean, quiz = false) {
    return (
      <button
        key={`${lesson.slug}-section-${index}`}
        type="button"
        onClick={() => (isFullscreen ? goToSlide(firstSlideIndexForSection(slides, index)) : goTo(index))}
        className={
          "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-bold transition-all " +
          (active
            ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50")
        }
      >
        <span
          className={
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-black " +
            (completed ? "bg-green-500 text-white" : active ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600")
          }
        >
          {completed ? "✓" : quiz ? totalSections : index + 1}
        </span>
        <span className="flex-1">{label}</span>
      </button>
    );
  }

  const partsRail = (
    <div className="grid gap-2">
      {lesson.sections.map((section, index) =>
        renderPartButton(
          index,
          getText(section.title, "en"),
          index === activeIndex,
          completedIndices.includes(index)
        )
      )}
      {renderPartButton(quizIndex, "Quiz", isOnQuizSection, completedIndices.includes(quizIndex), true)}
    </div>
  );

  if (isFullscreen) {
    return (
      <div
        ref={deckRef}
        className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_30%),linear-gradient(180deg,_#f8fffe_0%,_#eef7f5_100%)] text-slate-900"
      >
        {partsMenuOpen ? (
          <button
            type="button"
            aria-label="Close parts menu"
            onClick={() => setPartsMenuOpen(false)}
            className="absolute inset-0 z-20 bg-slate-950/25 xl:hidden"
          />
        ) : null}

        <aside
          className={
            "absolute left-0 top-0 z-30 h-screen w-[320px] border-r border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur transition-transform xl:static xl:block xl:w-[300px] xl:translate-x-0 xl:shadow-none " +
            (partsMenuOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0")
          }
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-lg font-black text-slate-900">Parts</div>
              <div className="text-xs font-semibold text-slate-500">One-screen slide mode</div>
            </div>
            <button
              type="button"
              onClick={() => setPartsMenuOpen(false)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600 xl:hidden"
            >
              Close
            </button>
          </div>
          <div className="h-[calc(100vh-112px)] overflow-y-auto pr-1">{partsRail}</div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden p-4">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-sm backdrop-blur">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setPartsMenuOpen(true)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 xl:hidden"
              >
                Parts
              </button>
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                  {activeSlide.sectionIndex === quizIndex
                    ? "Final quiz"
                    : `Part ${activeSlide.sectionIndex + 1} of ${totalSections}`}
                </div>
                <div className="truncate text-2xl font-black text-slate-900">{activeSlide.title}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-xs font-bold text-slate-500">Progress</div>
                <div className="text-sm font-black text-slate-900">
                  {completedIndices.length}/{totalSections} complete
                </div>
              </div>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Exit Fullscreen
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
            <div className="flex h-full flex-col overflow-hidden">
              <div className="shrink-0 border-b border-slate-200 bg-[linear-gradient(135deg,_rgba(13,148,136,0.10),_rgba(255,255,255,0.92)_48%,_rgba(20,184,166,0.08))] px-8 py-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-teal-600">
                    {activeSlide.sectionIndex === quizIndex
                      ? "Assessment"
                      : `Slide ${activeSlide.slideIndexWithinSection + 1} of ${slidesInActiveSection}`}
                  </div>
                  {!isLastSlideOfSection && activeSlide.sectionIndex !== quizIndex ? (
                    <div className="rounded-full bg-teal-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-teal-800">
                      More in this part
                    </div>
                  ) : null}
                </div>
                <div className="mt-1 text-4xl font-black leading-tight text-slate-900">
                  {activeSlide.title}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
                <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-start gap-5">
                  {activeSlide.blocks.map((block, index) => (
                    <div key={`${activeSlide.id}-${block.type}-${index}`} className="min-h-0">
                      {renderSlideBlock(block, activeSlide.sectionIndex, true)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="shrink-0 border-t border-slate-200 bg-slate-50/90 px-8 py-5">
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-500">
                    {activeSlide.sectionIndex === quizIndex
                      ? "Complete the quiz to finish the lesson."
                      : isLastSlideOfSection
                      ? "This is the last slide in this part."
                      : "Move to the next slide in this part."}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => goToSlide(activeSlideIndex - 1)}
                      disabled={isFirstFullscreenSlide}
                      className="rounded-lg border-2 border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={markDoneAndAdvance}
                      disabled={activeSlide.sectionIndex === quizIndex}
                      className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLastSlideOfSection ? "Mark Done & Next" : "Next Slide"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={deckRef}
      className="rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_32%),linear-gradient(180deg,_#f8fffe_0%,_#eef7f5_100%)] p-4 md:p-6"
    >
      <div className="mb-5 rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-gray-700">Lesson Progress</div>
            <div className="text-2xl font-black text-gray-900">
              {completedIndices.length}/{totalSections} parts completed
            </div>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Fullscreen
          </button>
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
          Reset progress
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-black text-gray-900">Parts</div>
            <div className="text-xs font-bold text-gray-500">Preview mode: all parts unlocked</div>
          </div>
          {partsRail}
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
          <div className="rounded-t-[30px] border-b border-slate-200 bg-[linear-gradient(135deg,_rgba(13,148,136,0.10),_rgba(255,255,255,0.92)_48%,_rgba(20,184,166,0.08))] px-6 py-5 md:px-10">
            <div className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-teal-600">
              {isOnQuizSection ? "Assessment" : `Part ${activeIndex + 1} of ${totalSections}`}
            </div>
            <div className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              {isOnQuizSection ? "Final Quiz" : getText(activeSection.title, "en")}
            </div>
            {completedIndices.includes(activeIndex) ? (
              <div className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-green-600">
                <span>✓</span> Completed
              </div>
            ) : null}
          </div>

          <div className="min-h-[560px] px-6 py-8 md:px-10 md:py-10">
            <div className="mx-auto max-w-4xl">{renderStandardSection()}</div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-[30px] border-t border-slate-200 bg-slate-50/90 px-6 py-5 md:px-10">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="rounded-lg border-2 border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={markDoneAndAdvance}
              disabled={activeIndex === quizIndex}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeIndex < totalSections - 2 ? "Mark Done & Next" : activeIndex === totalSections - 2 ? "Mark Done & Open Quiz" : "Mark Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
