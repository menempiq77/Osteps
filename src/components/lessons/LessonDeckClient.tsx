"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  | { type: "groupTasks"; value: NonNullable<LessonSection["groupTasks"]> }
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
const PART_ORDER_PREFIX = "islamic_curriculum_lesson_part_order_v1";

function progressKey(slug: string) {
  return `${PROGRESS_PREFIX}:${slug}`;
}

function partOrderKey(slug: string) {
  return `${PART_ORDER_PREFIX}:${slug}`;
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
      if (section.groupTasks) intro.push({ type: "groupTasks", value: section.groupTasks });
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
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});
  const [partsMenuOpen, setPartsMenuOpen] = useState(false);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [matchingScores, setMatchingScores] = useState<Record<string, number>>({});
  const [reorderAnswers, setReorderAnswers] = useState<Record<string, string[]>>({});
  const [dragOver, setDragOver] = useState<Record<string, number | null>>({});
  const [partOrder, setPartOrder] = useState<number[]>([]);
  const [partDragOverIndex, setPartDragOverIndex] = useState<number | null>(null);

  const slides = useMemo(() => buildSlides(lesson), [lesson]);
  const totalSections = lesson.sections.length + 1;
  const quizIndex = totalSections - 1;
  const defaultPartOrder = useMemo(
    () => Array.from({ length: totalSections }, (_, index) => index),
    [totalSections]
  );
  const orderedParts =
    partOrder.length === totalSections && new Set(partOrder).size === totalSections
      ? partOrder
      : defaultPartOrder;
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
      const raw = window.localStorage.getItem(partOrderKey(lesson.slug));
      if (!raw) {
        setPartOrder(defaultPartOrder);
        return;
      }
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length === totalSections &&
        parsed.every((value) => typeof value === "number")
      ) {
        setPartOrder(parsed as number[]);
        return;
      }
      setPartOrder(defaultPartOrder);
    } catch {
      setPartOrder(defaultPartOrder);
    }
  }, [defaultPartOrder, lesson.slug, totalSections]);

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
    try {
      window.localStorage.setItem(partOrderKey(lesson.slug), JSON.stringify(orderedParts));
    } catch {
      // ignore
    }
  }, [lesson.slug, orderedParts]);

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

  function sectionOrderPosition(sectionIndex: number) {
    return orderedParts.indexOf(sectionIndex);
  }

  function adjacentSectionIndex(sectionIndex: number, direction: -1 | 1) {
    const currentPosition = sectionOrderPosition(sectionIndex);
    if (currentPosition < 0) return null;
    const nextPosition = currentPosition + direction;
    if (nextPosition < 0 || nextPosition >= orderedParts.length) return null;
    return orderedParts[nextPosition] ?? null;
  }

  function goToAdjacentSection(sectionIndex: number, direction: -1 | 1) {
    const target = adjacentSectionIndex(sectionIndex, direction);
    if (target === null) return;
    goTo(target);
  }

  function goToPreviousFullscreenItem() {
    const currentSectionIndex = activeSlide.sectionIndex;
    const currentSectionFirstSlide = firstSlideIndexForSection(slides, currentSectionIndex);

    if (activeSlideIndex > currentSectionFirstSlide) {
      goToSlide(activeSlideIndex - 1);
      return;
    }

    const previousSection = adjacentSectionIndex(currentSectionIndex, -1);
    if (previousSection === null) return;
    const previousSectionLastSlide = lastSlideIndexForSection(slides, previousSection);
    if (previousSectionLastSlide >= 0) {
      goToSlide(previousSectionLastSlide);
    }
  }

  function canGoPreviousFullscreen() {
    const currentSectionIndex = activeSlide.sectionIndex;
    const currentSectionFirstSlide = firstSlideIndexForSection(slides, currentSectionIndex);
    if (activeSlideIndex > currentSectionFirstSlide) return true;
    return adjacentSectionIndex(currentSectionIndex, -1) !== null;
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
        const nextSection = adjacentSectionIndex(activeSlide.sectionIndex, 1);
        if (nextSection !== null) {
          const nextSectionSlideIndex = firstSlideIndexForSection(slides, nextSection);
          if (nextSectionSlideIndex >= 0) {
            goToSlide(nextSectionSlideIndex);
          }
        }
        return;
      }

      if (!isLastFullscreenSlide) {
        goToSlide(activeSlideIndex + 1);
      }
      return;
    }

    if (activeIndex === quizIndex) return;
    markSectionCompleted(activeIndex);
    const nextSection = adjacentSectionIndex(activeIndex, 1);
    if (nextSection !== null) {
      goTo(nextSection);
    }
  }

  function resetProgress() {
    setActiveIndex(0);
    setActiveSlideIndex(0);
    setCompletedIndices([]);
    setResponses({});
    setSavedStates({});
    setMatchingAnswers({});
    setMatchingScores({});
    setReorderAnswers({});
    setDragOver({});
    setPartOrder(defaultPartOrder);
    setPartDragOverIndex(null);
    try {
      window.localStorage.removeItem(progressKey(lesson.slug));
      window.localStorage.removeItem(`${progressKey(lesson.slug)}:responses`);
      window.localStorage.removeItem(`islamic_curriculum_lesson_quiz_v1:${lesson.slug}`);
      window.localStorage.removeItem(partOrderKey(lesson.slug));
    } catch {
      // ignore
    }
  }

  function reorderPart(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    setPartOrder((current) => {
      const source =
        current.length === totalSections && new Set(current).size === totalSections
          ? current
          : defaultPartOrder;
      const next = [...source];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
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
      <div className={"rounded-xl border border-blue-200 bg-blue-50 " + (compact ? "p-3" : "p-3")}>
        <div className="flex items-start gap-3">
          <img
            src="/lessons/bloom-taxonomy-badge.svg"
            alt="Bloom taxonomy badge"
            className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-full border border-blue-200 bg-white p-1"
          />
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
              Learning objective
            </div>
            <div className={"mt-1 font-medium text-slate-800 " + (compact ? "text-xs leading-5" : "text-sm leading-6")}>
              {getText(value, "en")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderImage(value: NonNullable<LessonSection["image"]>, compact = false) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <img
          src={value.src}
          alt={getText(value.alt, "en")}
          className={
            compact
              ? "h-40 w-full object-cover object-center md:h-48"
              : "h-56 w-full object-cover object-center md:h-72"
          }
        />
        {value.caption ? (
          <div className="border-t border-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
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
      <div className={"rounded-xl border border-indigo-200 bg-indigo-50 " + (compact ? "p-3" : "p-3")}>
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-700">
          Learning objectives
        </div>
        <div className="mt-2 grid gap-2">
          {values.map((value, index) => (
            <div key={`lo-${index}`} className="flex gap-2 rounded-lg bg-white/80 px-3 py-2">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white">
                {index + 1}
              </div>
              <div className={"font-medium text-slate-800 " + (compact ? "text-xs leading-5" : "text-sm leading-6")}>
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
      <div className={"rounded-xl border border-emerald-200 bg-emerald-50 " + (compact ? "p-3" : "p-3")}>
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
          Success criteria
        </div>
        <div className="mt-2 grid gap-2">
          {values.map((value, index) => (
            <div key={`sc-${index}`} className="flex gap-2 rounded-lg bg-white/80 px-3 py-2">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">
                {index + 1}
              </div>
              <div className={"font-medium text-slate-800 " + (compact ? "text-xs leading-5" : "text-sm leading-6")}>
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
      <div className="grid gap-2">
        {values.map((box, index) => {
          const labelText = getText(box.label, "en");
          const normalizedLabel = labelText.toLowerCase().replace(/[^a-z]/g, "");
          const isQuranBox = normalizedLabel.includes("quran");

          return (
            <div
              key={`info-box-${index}`}
              className="relative overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-soft)] px-3 py-2.5"
              style={
                isQuranBox
                  ? {
                      backgroundColor: "var(--theme-soft)",
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(255,255,255,0.78), rgba(255,255,255,0.82)), url('/lessons/quran-bg-pattern.svg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <div className="relative z-10">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--theme-dark)]">
                  {labelText}
                </div>
                <div className="grid gap-1.5">
                  {box.lines.map((line, lineIndex) => {
                    const isBilingual = typeof line === "object" && "ar" in line;
                    if (isBilingual) {
                      return (
                        <div key={`info-line-${index}-${lineIndex}`}>
                          <p dir="rtl" className="font-arabic text-right text-[15px] leading-7 text-slate-900">
                            {(line as { en: string; ar: string }).ar}
                          </p>
                          <p className="mt-0.5 text-xs leading-5 text-slate-600">
                            {(line as { en: string; ar: string }).en}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p key={`info-line-${index}-${lineIndex}`} className="text-[11px] italic text-slate-400">
                        {line as string}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderGroupTasks(
    value: NonNullable<LessonSection["groupTasks"]>,
    compact = false
  ) {
    return (
      <div className="rounded-xl border border-[var(--theme-border)] bg-white p-3 shadow-sm">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-[var(--theme-dark)]">
              {getText(value.title ?? "Group Work", "en")}
            </div>
            {value.instruction ? (
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                {getText(value.instruction, "en")}
              </p>
            ) : null}
          </div>
          <div className="rounded-full bg-[var(--theme-soft)] px-3 py-1 text-[10px] font-semibold text-[var(--theme-dark)]">
            Choose one group and open its workspace
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {value.groups.map((group, index) => (
            <Link
              key={`group-task-${index}`}
              href={`${pathname}/groups/${group.slug}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 transition hover:border-[var(--theme-border)] hover:bg-[var(--theme-soft)]"
            >
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--theme-dark)]">
                  {getText(group.name, "en")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--theme-dark)] text-[10px] font-black text-white">
                  {index + 1}
                </div>
                <span className="text-xs font-semibold text-slate-500">Join</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  function renderMatchingActivity(
    value: NonNullable<LessonSection["matchingActivity"]>,
    sectionIndex: number,
    compact = false
  ) {
    const answerKey = `${lesson.slug}:match:${sectionIndex}`;
    const isChecked = Object.prototype.hasOwnProperty.call(matchingScores, answerKey);
    const score = matchingScores[answerKey] ?? 0;

    const defaultOrder = buildShuffledOptions(
      value.prompts.map((item) => getText(item.answer, "en")),
      answerKey
    );
    const ordered = reorderAnswers[answerKey] ?? defaultOrder;
    const overIndex = dragOver[answerKey] ?? null;

    return (
      <div className="rounded-xl border border-[var(--theme-border)] bg-white p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-[var(--theme-dark)]">{getText(value.title, "en")}</div>
          <div className="text-[10px] text-slate-400">Drag ↕ the meanings to match each phrase</div>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
            <div className="border-r border-slate-200 px-3 py-2">Phrase</div>
            <div className="px-3 py-2">Meaning</div>
          </div>
          {value.prompts.map((item, index) => {
            const answer = ordered[index] ?? "";
            const correct = isChecked && answer === getText(item.answer, "en");
            const wrong = isChecked && !correct;
            const isOver = overIndex === index;
            return (
              <div
                key={`row-${index}`}
                className={"grid grid-cols-2 border-b border-slate-100 last:border-b-0 transition-colors " + (isOver && !isChecked ? "bg-[var(--theme-soft)]" : "")}
              >
                <div className="flex items-center gap-2 border-r border-slate-100 px-3 py-2">
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[var(--theme-dark)] text-[9px] font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-800">{getText(item.prompt, "en")}</span>
                </div>
                <div
                  className="px-2 py-1.5"
                  draggable={!isChecked}
                  onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(index)); e.dataTransfer.effectAllowed = "move"; }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver((d) => ({ ...d, [answerKey]: index })); }}
                  onDragLeave={() => setDragOver((d) => ({ ...d, [answerKey]: null }))}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver((d) => ({ ...d, [answerKey]: null }));
                    const from = Number(e.dataTransfer.getData("text/plain"));
                    if (from === index) return;
                    setReorderAnswers((current) => {
                      const prev = current[answerKey] ?? defaultOrder;
                      const next = [...prev];
                      const [moved] = next.splice(from, 1);
                      next.splice(index, 0, moved);
                      return { ...current, [answerKey]: next };
                    });
                  }}
                >
                  <div
                    className={
                      "flex cursor-grab items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium select-none active:cursor-grabbing " +
                      (isChecked
                        ? correct
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 cursor-default"
                          : "border-rose-200 bg-rose-50 text-rose-800 cursor-default"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[var(--theme-border)] hover:bg-[var(--theme-soft)]")
                    }
                  >
                    {!isChecked && <span className="text-slate-300 text-base leading-none">⠿</span>}
                    <span className="flex-1">{answer}</span>
                    {isChecked && (
                      <span className={"font-bold " + (correct ? "text-emerald-600" : "text-rose-500")}>
                        {correct ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                  {isChecked && wrong ? (
                    <div className="mt-0.5 pl-1 text-[10px] text-emerald-600">
                      ✓ {getText(item.answer, "en")}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            {isChecked ? `Score: ${score}/${value.prompts.length}` : "Drag meanings into the right order."}
          </div>
          <button
            type="button"
            disabled={isChecked}
            onClick={() => {
              const current = reorderAnswers[answerKey] ?? defaultOrder;
              const nextScore = value.prompts.reduce((total, item, idx) =>
                total + (current[idx] === getText(item.answer, "en") ? 1 : 0), 0);
              setMatchingScores((s) => ({ ...s, [answerKey]: nextScore }));
            }}
            className="rounded-full bg-[var(--theme-dark)] px-4 py-1.5 text-xs font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check answers
          </button>
        </div>
      </div>
    );
  }

  function renderCallout(value: NonNullable<LessonSection["callout"]>, compact = false) {
    return (
      <div className={"rounded-xl border border-amber-200 bg-amber-50 " + (compact ? "p-3" : "p-3")}>
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
          {getText(value.label, "en")}
        </div>
        <div className={"mt-1 font-bold text-slate-900 " + (compact ? "text-sm" : "text-base")}>
          {getText(value.title, "en")}
        </div>
        <div className={"mt-2 whitespace-pre-line text-slate-700 " + (compact ? "text-xs leading-5" : "text-sm leading-7")}>
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
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className={"flex items-center gap-2.5 border-b border-slate-100 " + (compact ? "px-3 py-2" : "px-4 py-2.5")}>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white"
          >
            You
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{getText(value.title, "en")}</div>
            <div className="text-[10px] font-medium text-slate-400">Share your evidence-based response</div>
          </div>
        </div>
        <div className={compact ? "px-3 py-2" : "px-4 py-3"}>
          <div className={"mb-2 whitespace-pre-line font-medium text-slate-600 " + (compact ? "text-xs leading-5" : "text-xs leading-6")}>
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
              "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white " +
              (compact ? "min-h-[80px]" : "min-h-[110px]")
            }
          />
          <div className={"flex items-center justify-between gap-2 " + (compact ? "mt-2" : "mt-2")}>
            <div className="text-[10px] font-medium text-slate-400">
              Use evidence from the Qur&apos;an, Hadith, life, Islamic stories, or science.
            </div>
            <button
              type="button"
              onClick={() => saveResponse(sectionIndex)}
              className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              {getText(value.buttonLabel ?? "Post comment", "en")}
            </button>
          </div>
          {savedStates[`${lesson.slug}:${sectionIndex}`] ? (
            <div className="mt-2 text-xs font-semibold text-green-600">Comment saved.</div>
          ) : null}
        </div>
      </div>
    );
  }

  function renderBodyParagraphs(paragraphs: string[], compact = false) {
    return (
      <div className="grid gap-3">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`paragraph-${index}`}
            className={"whitespace-pre-line text-slate-700 " + (compact ? "text-sm leading-6" : "text-[0.925rem] leading-7")}
          >
            {paragraph}
          </p>
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
      case "groupTasks":
        return renderGroupTasks(block.value, presentationMode);
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
      <div className="grid gap-3">
        {activeSection.learningObjective ? renderLearningObjective(activeSection.learningObjective) : null}
        {activeSection.image ? renderImage(activeSection.image) : null}
        {activeSection.learningObjectives ? renderLearningObjectives(activeSection.learningObjectives) : null}
        {activeSection.successCriteria ? renderSuccessCriteria(activeSection.successCriteria) : null}
        {activeSection.infoBoxes ? renderInfoBoxes(activeSection.infoBoxes) : null}
        {activeSection.groupTasks ? renderGroupTasks(activeSection.groupTasks) : null}
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
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData("text/plain", String(sectionOrderPosition(index)));
          event.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setPartDragOverIndex(sectionOrderPosition(index));
        }}
        onDragLeave={() => setPartDragOverIndex((current) => (current === sectionOrderPosition(index) ? null : current))}
        onDrop={(event) => {
          event.preventDefault();
          const fromIndex = Number(event.dataTransfer.getData("text/plain"));
          const toIndex = sectionOrderPosition(index);
          if (!Number.isNaN(fromIndex) && toIndex >= 0) {
            reorderPart(fromIndex, toIndex);
          }
          setPartDragOverIndex(null);
        }}
        onDragEnd={() => setPartDragOverIndex(null)}
        className={
          "flex cursor-grab items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-medium transition-all active:cursor-grabbing " +
          (partDragOverIndex === sectionOrderPosition(index) ? "ring-2 ring-slate-200 " : "") +
          (active
            ? "border-teal-500 bg-teal-50 text-teal-900"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50")
        }
      >
        <span
          className={
            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black " +
            (completed ? "bg-green-500 text-white" : active ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600")
          }
        >
          {completed ? "✓" : quiz ? totalSections : index + 1}
        </span>
        <span className="flex-1 leading-snug">{label}</span>
      </button>
    );
  }

  const partsRail = (
    <div className="grid gap-2">
      {orderedParts.map((sectionIndex) =>
        sectionIndex === quizIndex
          ? renderPartButton(quizIndex, "Quiz", isOnQuizSection, completedIndices.includes(quizIndex), true)
          : renderPartButton(
              sectionIndex,
              getText(lesson.sections[sectionIndex].title, "en"),
              sectionIndex === activeIndex,
              completedIndices.includes(sectionIndex)
            )
      )}
    </div>
  );

  const horizontalPartsRail = (
    <div className="rounded-xl border border-white/70 bg-white/85 px-3 py-2.5 shadow-sm backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-700">Parts</div>
        <div className="text-[10px] font-semibold text-slate-400">Preview mode: all parts unlocked</div>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-2">
          {orderedParts.map((sectionIndex, orderIndex) => {
            const active = sectionIndex === activeIndex;
            const completed = completedIndices.includes(sectionIndex);
            const isQuizPart = sectionIndex === quizIndex;
            return (
              <div key={`${lesson.slug}-chain-${sectionIndex}`} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(sectionIndex)}
                  title={isQuizPart ? "Quiz" : getText(lesson.sections[sectionIndex].title, "en")}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", String(orderIndex));
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setPartDragOverIndex(orderIndex);
                  }}
                  onDragLeave={() => setPartDragOverIndex((current) => (current === orderIndex ? null : current))}
                  onDrop={(event) => {
                    event.preventDefault();
                    const fromIndex = Number(event.dataTransfer.getData("text/plain"));
                    if (!Number.isNaN(fromIndex)) {
                      reorderPart(fromIndex, orderIndex);
                    }
                    setPartDragOverIndex(null);
                  }}
                  onDragEnd={() => setPartDragOverIndex(null)}
                  className={
                    "flex cursor-grab items-center gap-1.5 rounded-full border px-2.5 py-1.5 transition-all active:cursor-grabbing " +
                    (partDragOverIndex === orderIndex ? "ring-2 ring-slate-200 " : "") +
                    (active
                      ? "border-teal-500 bg-teal-50 text-teal-900"
                      : completed
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50")
                  }
                >
                  <span
                    className={
                      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black " +
                      (completed
                        ? "bg-green-500 text-white"
                        : active
                        ? "bg-teal-500 text-white"
                        : "bg-slate-100 text-slate-600")
                    }
                  >
                    {completed ? "✓" : sectionIndex + 1}
                  </span>
                </button>
                {orderIndex < orderedParts.length - 1 ? <span className="text-slate-200">›</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div
        ref={deckRef}
        className="flex h-screen overflow-hidden bg-slate-50 text-slate-900"
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
              <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-8 py-5">
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
                      onClick={goToPreviousFullscreenItem}
                      disabled={!canGoPreviousFullscreen()}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={markDoneAndAdvance}
                      disabled={activeSlide.sectionIndex === quizIndex}
                      className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
      className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
    >
      <div className="mb-3 rounded-xl border border-white/70 bg-white/85 px-4 py-2.5 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold text-gray-500">Progress</div>
            <div className="text-sm font-bold text-gray-900">
              {completedIndices.length}/{totalSections} parts done
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetProgress}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Fullscreen
            </button>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3">
        {horizontalPartsRail}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.07)]">
          <div className="rounded-t-2xl border-b border-slate-100 bg-slate-100 px-4 py-3 md:px-5">
            <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
              {isOnQuizSection ? "Assessment" : `Part ${activeIndex + 1} of ${totalSections}`}
            </div>
            <div className="text-lg font-bold leading-snug text-slate-900 md:text-xl">
              {isOnQuizSection ? "Final Quiz" : getText(activeSection.title, "en")}
            </div>
            {completedIndices.includes(activeIndex) ? (
              <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                <span>✓</span> Completed
              </div>
            ) : null}
          </div>

          <div className="px-4 py-4 md:px-5">
            <div className="mx-auto max-w-4xl">{renderStandardSection()}</div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border-t border-slate-100 bg-slate-50/80 px-4 py-3 md:px-5">
            <button
              type="button"
              onClick={() => goToAdjacentSection(activeIndex, -1)}
              disabled={adjacentSectionIndex(activeIndex, -1) === null}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={markDoneAndAdvance}
              disabled={activeIndex === quizIndex}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2 text-sm font-bold text-white shadow transition hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeIndex < totalSections - 2 ? "Mark Done & Next" : activeIndex === totalSections - 2 ? "Mark Done & Open Quiz" : "Mark Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
