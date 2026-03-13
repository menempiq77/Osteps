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
  | { type: "learningObjectives"; value: NonNullable<LessonSection["learningObjectives"]> }
  | { type: "successCriteria"; value: NonNullable<LessonSection["successCriteria"]> }
  | { type: "infoBoxes"; value: NonNullable<LessonSection["infoBoxes"]> }
  | { type: "matchingActivity"; value: NonNullable<LessonSection["matchingActivity"]> }
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
      if (section.responsePrompt) {
        opener.push({ type: "responsePrompt", value: section.responsePrompt });
      }
      if (opener.length) {
        sectionSlides.push({
          id: `${lesson.slug}-${sectionIndex}-0`,
          sectionIndex,
          slideIndexWithinSection: 0,
          title,
          blocks: opener,
        });
      }
    } else {
      const intro: SlideBlock[] = [];
      if (section.learningObjective) intro.push({ type: "learningObjective", value: section.learningObjective });
      if (section.image) intro.push({ type: "image", value: section.image });
      if (section.learningObjectives) intro.push({ type: "learningObjectives", value: section.learningObjectives });
      if (section.successCriteria) intro.push({ type: "successCriteria", value: section.successCriteria });
      if (section.infoBoxes) intro.push({ type: "infoBoxes", value: section.infoBoxes });
      if (section.matchingActivity) {
        intro.push({ type: "matchingActivity", value: section.matchingActivity });
      }
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

function buildShuffledOptions(options: string[], seed: string) {
  const seeded = options.map((option, index) => {
    const weight = Array.from(`${seed}:${option}:${index}`).reduce(
      (total, char, position) => total + char.charCodeAt(0) * (position + 1),
      0
    );
    return { option, weight };
  });

  return seeded.sort((a, b) => a.weight - b.weight).map((item) => item.option);
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
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [matchingScores, setMatchingScores] = useState<Record<string, number>>({});

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
    setMatchingAnswers({});
    setMatchingScores({});
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
          className={
            compact
              ? "h-36 w-full object-contain bg-slate-100 md:h-40 xl:h-44"
              : "h-64 w-full object-contain bg-slate-100 md:h-80"
          }
        />
        {value.caption ? (
          <div className="border-t border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
            {getText(value.caption, "en")}
          </div>
        ) : null}
      </div>
    );
  }

  function renderLearningObjectives(
    values: NonNullable<LessonSection["learningObjectives"]>,
    compact = false
  ) {
    return (
      <div className={"rounded-2xl border border-indigo-200 bg-indigo-50 " + (compact ? "p-4" : "p-5")}>
        <div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">
          Learning objectives
        </div>
        <div className="mt-4 grid gap-3">
          {values.map((value, index) => (
            <div key={`lo-${index}`} className="flex gap-3 rounded-xl bg-white/80 px-4 py-3">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                {index + 1}
              </div>
              <div className={"font-semibold text-slate-800 " + (compact ? "text-sm leading-7" : "text-base leading-8")}>
                {getText(value, "en")}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSuccessCriteria(
    values: NonNullable<LessonSection["successCriteria"]>,
    compact = false
  ) {
    return (
      <div className={"rounded-2xl border border-emerald-200 bg-emerald-50 " + (compact ? "p-4" : "p-5")}>
        <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
          Success criteria
        </div>
        <div className="mt-4 grid gap-3">
          {values.map((value, index) => (
            <div key={`sc-${index}`} className="flex gap-3 rounded-xl bg-white/80 px-4 py-3">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                {index + 1}
              </div>
              <div className={"font-semibold text-slate-800 " + (compact ? "text-sm leading-7" : "text-base leading-8")}>
                {getText(value, "en")}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderInfoBoxes(
    values: NonNullable<LessonSection["infoBoxes"]>,
    compact = false
  ) {
    return (
      <div className="grid gap-4">
        {values.map((box, index) => (
          <div
            key={`info-box-${index}`}
            className={"rounded-2xl border border-violet-200 bg-violet-50 " + (compact ? "p-4" : "p-5")}
          >
            <div className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
              {getText(box.label, "en")}
            </div>
            <div className="mt-4 grid gap-3">
              {box.lines.map((line, lineIndex) => (
                <div
                  key={`info-line-${index}-${lineIndex}`}
                  className={"whitespace-pre-line rounded-xl bg-white/80 px-4 py-3 text-slate-800 " + (compact ? "text-sm leading-7" : "text-base leading-8")}
                >
                  {getText(line, "en")}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderMatchingActivity(
    value: NonNullable<LessonSection["matchingActivity"]>,
    sectionIndex: number,
    compact = false
  ) {
    const answerKey = `${lesson.slug}:match:${sectionIndex}`;
    const options = buildShuffledOptions(
      value.prompts.map((item) => getText(item.answer, "en")),
      answerKey
    );
    const isChecked = Object.prototype.hasOwnProperty.call(matchingScores, answerKey);
    const score = matchingScores[answerKey] ?? 0;
    const selectedValues = Object.entries(matchingAnswers)
      .filter(([key]) => key.startsWith(`${answerKey}:`))
      .map(([, selected]) => selected)
      .filter(Boolean);
    const allAnswered = value.prompts.every((_, index) => {
      const itemKey = `${answerKey}:${index}`;
      return Boolean(matchingAnswers[itemKey]);
    });

    return (
      <div className={"rounded-2xl border border-fuchsia-200 bg-[linear-gradient(180deg,_#fff7ff_0%,_#fcfaff_100%)] " + (compact ? "p-4" : "p-5")}>
        <div className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-700">
          {getText(value.title, "en")}
        </div>
        {value.instruction ? (
          <div className={"mt-2 font-semibold text-slate-700 " + (compact ? "text-sm leading-6" : "text-sm leading-7")}>
            {getText(value.instruction, "en")}
          </div>
        ) : null}
        <div className="mt-4 rounded-2xl border border-fuchsia-100 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-fuchsia-700">
              Meaning cards
            </div>
            <div className="text-xs font-semibold text-slate-500">Drag one card into each matching box.</div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {options.map((option) => {
              const inUse = selectedValues.includes(option);
              return (
                <button
                  key={`${answerKey}:bank:${option}`}
                  type="button"
                  draggable={!inUse && !isChecked}
                  onDragStart={(event) => {
                    if (isChecked) return;
                    event.dataTransfer.setData("text/plain", option);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  className={
                    "rounded-2xl border px-4 py-3 text-left text-sm font-bold leading-6 transition " +
                    (isChecked
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : inUse
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : "cursor-grab border-fuchsia-200 bg-white text-slate-700 hover:border-fuchsia-300 hover:bg-fuchsia-50 active:cursor-grabbing")
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {value.prompts.map((item, index) => {
            const itemKey = `${answerKey}:${index}`;
            const selected = matchingAnswers[itemKey] ?? "";
            const correct = selected.length > 0 && selected === getText(item.answer, "en");

            return (
              <div
                key={itemKey}
                className="grid gap-4 rounded-2xl border border-white/90 bg-white/95 p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_320px] md:items-center"
              >
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-600 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-fuchsia-700">
                      Phrase
                    </div>
                  </div>
                  <div className={"font-semibold text-slate-800 " + (compact ? "text-sm leading-6" : "text-lg leading-7")}>
                    {getText(item.prompt, "en")}
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Matching meaning
                  </div>
                  <div
                    onDragOver={(event) => {
                      if (isChecked) return;
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(event) => {
                      if (isChecked) return;
                      event.preventDefault();
                      const droppedValue = event.dataTransfer.getData("text/plain");
                      if (!droppedValue) return;
                      setMatchingAnswers((current) => {
                        const next = { ...current };
                        Object.keys(next).forEach((key) => {
                          if (key.startsWith(`${answerKey}:`) && next[key] === droppedValue) {
                            next[key] = "";
                          }
                        });
                        next[itemKey] = droppedValue;
                        return next;
                      });
                    }}
                    className={
                      "flex min-h-[74px] items-center rounded-2xl border border-dashed px-4 py-3 text-sm font-semibold leading-6 transition " +
                      (selected
                        ? "border-fuchsia-300 bg-fuchsia-50 text-slate-800"
                        : "border-slate-300 bg-slate-50 text-slate-400")
                    }
                  >
                    {selected || "Drop the correct meaning here"}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      {selected ? "Answer placed" : "Waiting for match"}
                    </div>
                    {isChecked ? (
                      <div className={"text-xs font-black uppercase tracking-[0.12em] " + (correct ? "text-emerald-600" : "text-rose-600")}>
                        {correct ? "Correct" : "Incorrect"}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-fuchsia-100 bg-white/90 px-4 py-3 shadow-sm">
          <div className="text-sm font-semibold text-slate-600">
            {isChecked
              ? `Score: ${score}/${value.prompts.length}`
              : `Place all ${value.prompts.length} answers, then check your score.`}
          </div>
          <button
            type="button"
            disabled={!allAnswered || isChecked}
            onClick={() => {
              const nextScore = value.prompts.reduce((total, item, index) => {
                const itemKey = `${answerKey}:${index}`;
                return total + (matchingAnswers[itemKey] === getText(item.answer, "en") ? 1 : 0);
              }, 0);
              setMatchingScores((current) => ({
                ...current,
                [answerKey]: nextScore,
              }));
            }}
            className="rounded-full bg-fuchsia-600 px-5 py-2 text-sm font-black text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check answers
          </button>
        </div>
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
        <div className={"flex items-center gap-3 border-b border-slate-200 " + (compact ? "px-4 py-3" : "px-5 py-4")}>
          <div
            className={
              "flex items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white " +
              (compact ? "h-10 w-10" : "h-11 w-11")
            }
          >
            You
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">{getText(value.title, "en")}</div>
            <div className="text-xs font-semibold text-slate-500">Share your evidence-based response</div>
          </div>
        </div>
        <div className={compact ? "px-4 py-3" : "px-5 py-4"}>
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
              (compact ? "min-h-[120px]" : "min-h-[160px]")
            }
          />
          <div className={"flex items-center justify-between gap-3 " + (compact ? "mt-3" : "mt-4")}>
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
      case "learningObjectives":
        return renderLearningObjectives(block.value, presentationMode);
      case "successCriteria":
        return renderSuccessCriteria(block.value, presentationMode);
      case "infoBoxes":
        return renderInfoBoxes(block.value, presentationMode);
      case "matchingActivity":
        return renderMatchingActivity(block.value, sectionIndex, presentationMode);
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
        {activeSection.learningObjectives ? renderLearningObjectives(activeSection.learningObjectives) : null}
        {activeSection.successCriteria ? renderSuccessCriteria(activeSection.successCriteria) : null}
        {activeSection.infoBoxes ? renderInfoBoxes(activeSection.infoBoxes) : null}
        {activeSection.matchingActivity ? renderMatchingActivity(activeSection.matchingActivity, activeIndex) : null}
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

  const horizontalPartsRail = (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-black text-slate-900">Parts</div>
        <div className="text-xs font-bold text-slate-500">Preview mode: all parts unlocked</div>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-2">
          {lesson.sections.map((section, index) => {
            const active = index === activeIndex;
            const completed = completedIndices.includes(index);
            return (
              <div key={`${lesson.slug}-chain-${index}`} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  title={getText(section.title, "en")}
                  className={
                    "flex items-center gap-2 rounded-full border px-3 py-2 transition-all " +
                    (active
                      ? "border-teal-500 bg-teal-50 text-teal-900"
                      : completed
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50")
                  }
                >
                  <span
                    className={
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-black " +
                      (completed
                        ? "bg-green-500 text-white"
                        : active
                        ? "bg-teal-500 text-white"
                        : "bg-slate-100 text-slate-600")
                    }
                  >
                    {completed ? "✓" : index + 1}
                  </span>
                </button>
                <span className="text-slate-300">→</span>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => goTo(quizIndex)}
            title="Quiz"
            className={
              "flex items-center gap-2 rounded-full border px-3 py-2 transition-all " +
              (isOnQuizSection
                ? "border-teal-500 bg-teal-50 text-teal-900"
                : completedIndices.includes(quizIndex)
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50")
            }
          >
            <span
              className={
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-black " +
                (completedIndices.includes(quizIndex)
                  ? "bg-green-500 text-white"
                  : isOnQuizSection
                  ? "bg-teal-500 text-white"
                  : "bg-slate-100 text-slate-600")
              }
            >
              {completedIndices.includes(quizIndex) ? "✓" : totalSections}
            </span>
          </button>
        </div>
      </div>
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Fullscreen
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
          Reset progress
        </button>
      </div>

      <div className="grid gap-5">
        {horizontalPartsRail}

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
