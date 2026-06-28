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
  | { type: "imageMatchingActivity"; value: NonNullable<LessonSection["imageMatchingActivity"]> }
  | { type: "image"; value: NonNullable<LessonSection["image"]> }
  | { type: "callout"; value: NonNullable<LessonSection["callout"]> }
  | { type: "readyButton"; value: NonNullable<LessonSection["readyButton"]> }
  | { type: "trueFalseActivity"; value: NonNullable<LessonSection["trueFalseActivity"]> }
  | { type: "fillBlanksActivity"; value: NonNullable<LessonSection["fillBlanksActivity"]> }
  | { type: "groupWorkCards"; value: NonNullable<LessonSection["groupWorkCards"]> }
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
      if (section.imageMatchingActivity) {
        intro.push({ type: "imageMatchingActivity", value: section.imageMatchingActivity });
      }
      if (section.callout) intro.push({ type: "callout", value: section.callout });
      if (section.readyButton) intro.push({ type: "readyButton", value: section.readyButton });
      if (section.trueFalseActivity) intro.push({ type: "trueFalseActivity", value: section.trueFalseActivity });
      if (section.fillBlanksActivity) intro.push({ type: "fillBlanksActivity", value: section.fillBlanksActivity });
      if (section.groupWorkCards) intro.push({ type: "groupWorkCards", value: section.groupWorkCards });
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

  if ((lesson.quizQuestions?.length ?? 0) > 0) {
    slides.push({
      id: `${lesson.slug}-quiz`,
      sectionIndex: lesson.sections.length,
      slideIndexWithinSection: 0,
      title: "Final Quiz",
      blocks: [{ type: "quiz" }],
    });
  }

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
  const [earnedCoins, setEarnedCoins] = useState<Record<string, number>>({});
  const [coinAnimating, setCoinAnimating] = useState<string | null>(null);
  const totalCoins = Object.values(earnedCoins).reduce((sum, v) => sum + v, 0);
  const [imageMatchAnswers, setImageMatchAnswers] = useState<Record<string, Record<number, string>>>({});
  const [imageMatchChecked, setImageMatchChecked] = useState<Record<string, boolean>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<number, boolean | null>>>({});
  const [tfChecked, setTfChecked] = useState<Record<string, boolean>>({});
  const [fbAnswers, setFbAnswers] = useState<Record<string, Record<number, string>>>({});
  const [fbChecked, setFbChecked] = useState<Record<string, boolean>>({});
  const [gwSelectedCard, setGwSelectedCard] = useState<Record<string, string | null>>({});
  const [gwWork, setGwWork] = useState<Record<string, Record<string, string>>>({});
  const [gwSubmitted, setGwSubmitted] = useState<Record<string, Record<string, boolean>>>({});

  const slides = useMemo(() => buildSlides(lesson), [lesson]);
  const hasQuiz = (lesson.quizQuestions?.length ?? 0) > 0;
  const totalSections = lesson.sections.length + (hasQuiz ? 1 : 0);
  const quizIndex = hasQuiz ? lesson.sections.length : -1;
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
    const section = lesson.sections[sectionIndex];
    const coins = section?.responsePrompt?.coinsReward;
    try {
      window.localStorage.setItem(`${progressKey(lesson.slug)}:responses`, JSON.stringify(responses));
      setSavedStates((current) => ({ ...current, [key]: true }));
      if (coins && !earnedCoins[key]) {
        setEarnedCoins((current) => ({ ...current, [key]: coins }));
        setCoinAnimating(key);
        window.setTimeout(() => setCoinAnimating(null), 2200);
      }
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

  function renderImageMatchingActivity(
    value: NonNullable<LessonSection["imageMatchingActivity"]>,
    sectionIndex: number,
  ) {
    const actKey = `${lesson.slug}:imgmatch:${sectionIndex}`;
    const answers = imageMatchAnswers[actKey] ?? {};
    const isChecked = !!imageMatchChecked[actKey];
    const allFilled = value.pairs.every((_, i) => answers[i] !== undefined);
    const correctCount = isChecked
      ? value.pairs.reduce((n, pair, i) => n + (answers[i] === getText(pair.keyword, "en") ? 1 : 0), 0)
      : 0;

    const shuffledKeywords = (() => {
      const kws = value.pairs.map((p) => getText(p.keyword, "en"));
      const seed = actKey.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      return [...kws].sort((a, b) => {
        const ha = (a.charCodeAt(0) * 31 + seed) % 997;
        const hb = (b.charCodeAt(0) * 31 + seed) % 997;
        return ha - hb;
      });
    })();

    const usedKeywords = new Set(Object.values(answers));
    const availableKeywords = shuffledKeywords.filter((k) => !usedKeywords.has(k));

    function handleDrop(imageIndex: number, keyword: string) {
      if (isChecked) return;
      setImageMatchAnswers((prev) => {
        const current = prev[actKey] ?? {};
        const cleaned: Record<number, string> = {};
        for (const [k, v] of Object.entries(current)) {
          if (v !== keyword) cleaned[Number(k)] = v;
        }
        cleaned[imageIndex] = keyword;
        return { ...prev, [actKey]: cleaned };
      });
    }

    function removeAnswer(imageIndex: number) {
      if (isChecked) return;
      setImageMatchAnswers((prev) => {
        const current = { ...(prev[actKey] ?? {}) };
        delete current[imageIndex];
        return { ...prev, [actKey]: current };
      });
    }

    function checkAnswers() {
      setImageMatchChecked((prev) => ({ ...prev, [actKey]: true }));
      const coins = value.coinsReward;
      if (coins && !earnedCoins[actKey]) {
        const score = value.pairs.reduce(
          (n, pair, i) => n + (answers[i] === getText(pair.keyword, "en") ? 1 : 0),
          0
        );
        if (score === value.pairs.length) {
          setEarnedCoins((c) => ({ ...c, [actKey]: coins }));
          setCoinAnimating(actKey);
          window.setTimeout(() => setCoinAnimating(null), 2200);
        }
      }
    }

    const animating = coinAnimating === actKey;
    const earned = !!earnedCoins[actKey];

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-slate-900">{getText(value.title, "en")}</div>
            {value.instruction ? (
              <div className="text-xs text-slate-500">{getText(value.instruction, "en")}</div>
            ) : null}
          </div>
          {value.coinsReward ? (
            <div className="relative flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1">
              <span className="text-base">🪣</span>
              <span className={"text-sm font-black tabular-nums " + (animating ? "text-amber-600" : "text-amber-500")}>
                {totalCoins}
              </span>
              <span className="text-[10px] font-bold text-amber-400">coins</span>
              {animating ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="pointer-events-none absolute text-lg"
                      style={{
                        left: `${30 + (i % 3) * 15}%`,
                        animation: `coinDrop 0.8s ease-in ${i * 0.12}s forwards`,
                        opacity: 0,
                      }}
                    >
                      🪙
                    </span>
                  ))}
                  <style>{`
                    @keyframes coinDrop {
                      0% { transform: translateY(-30px) scale(1.3); opacity: 1; }
                      60% { transform: translateY(0px) scale(1); opacity: 1; }
                      80% { transform: translateY(-6px) scale(1); opacity: 1; }
                      100% { transform: translateY(0px) scale(0.7); opacity: 0; }
                    }
                  `}</style>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Keyword pills to drag */}
        {!isChecked ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {availableKeywords.map((kw) => (
              <span
                key={kw}
                draggable
                onDragStart={(e) => { e.dataTransfer.setData("text/plain", kw); e.dataTransfer.effectAllowed = "move"; }}
                className="cursor-grab rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 select-none active:cursor-grabbing hover:bg-blue-100"
              >
                {kw}
              </span>
            ))}
          </div>
        ) : null}

        {/* Image grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {value.pairs.map((pair, index) => {
            const assigned = answers[index];
            const correct = isChecked && assigned === getText(pair.keyword, "en");
            const wrong = isChecked && assigned && !correct;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5"
                onDragOver={(e) => { if (!isChecked) e.preventDefault(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  const kw = e.dataTransfer.getData("text/plain");
                  if (kw) handleDrop(index, kw);
                }}
              >
                <div className="relative w-full overflow-hidden rounded-lg border-2 border-slate-200 aspect-square">
                  <img
                    src={pair.image}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div
                  className={
                    "flex min-h-[32px] w-full items-center justify-center rounded-lg border-2 border-dashed px-2 py-1 text-center text-xs font-bold transition " +
                    (assigned
                      ? isChecked
                        ? correct
                          ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                          : "border-rose-400 bg-rose-50 text-rose-800"
                        : "border-blue-300 bg-blue-50 text-blue-700 cursor-pointer"
                      : "border-slate-300 bg-slate-50 text-slate-400")
                  }
                  onClick={() => { if (assigned && !isChecked) removeAnswer(index); }}
                >
                  {assigned ?? "Drop here"}
                  {isChecked && correct ? " ✓" : ""}
                  {isChecked && wrong ? " ✗" : ""}
                </div>
                {isChecked && wrong ? (
                  <div className="text-[10px] font-semibold text-emerald-600">
                    ✓ {getText(pair.keyword, "en")}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            {isChecked ? (
              <span className={correctCount === value.pairs.length ? "font-bold text-emerald-600" : "font-bold text-amber-600"}>
                Score: {correctCount}/{value.pairs.length}
                {correctCount === value.pairs.length && earned ? " — coins earned!" : ""}
              </span>
            ) : value.coinsReward && !earned ? (
              <span className="text-amber-500 font-semibold">🪙 Get all correct to earn {value.coinsReward} coins!</span>
            ) : (
              "Drag each keyword to the matching image."
            )}
          </div>
          <button
            type="button"
            disabled={isChecked || !allFilled}
            onClick={checkAnswers}
            className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check answers
          </button>
        </div>
      </div>
    );
  }

  function renderReadyButton(
    value: NonNullable<LessonSection["readyButton"]>,
    sectionIndex: number,
  ) {
    const btnKey = `${lesson.slug}:ready:${sectionIndex}`;
    const coins = value.coinsReward;
    const alreadyEarned = !!earnedCoins[btnKey];
    const animating = coinAnimating === btnKey;

    function handleClick() {
      if (alreadyEarned) return;
      if (coins) {
        setEarnedCoins((c) => ({ ...c, [btnKey]: coins }));
        setCoinAnimating(btnKey);
        window.setTimeout(() => setCoinAnimating(null), 2200);
      }
    }

    return (
      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="relative flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
          <span className="text-base">🪣</span>
          <span className={"text-sm font-black tabular-nums " + (animating ? "text-amber-600" : "text-amber-500")}>
            {totalCoins}
          </span>
          <span className="text-[10px] font-bold text-amber-400">coins</span>
          {animating ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="pointer-events-none absolute text-lg"
                  style={{
                    left: `${30 + (i % 3) * 15}%`,
                    animation: `coinDrop 0.8s ease-in ${i * 0.12}s forwards`,
                    opacity: 0,
                  }}
                >
                  🪙
                </span>
              ))}
              <style>{`
                @keyframes coinDrop {
                  0% { transform: translateY(-30px) scale(1.3); opacity: 1; }
                  60% { transform: translateY(0px) scale(1); opacity: 1; }
                  80% { transform: translateY(-6px) scale(1); opacity: 1; }
                  100% { transform: translateY(0px) scale(0.7); opacity: 0; }
                }
              `}</style>
            </>
          ) : null}
        </div>
        <button
          type="button"
          disabled={alreadyEarned}
          onClick={handleClick}
          className={
            "rounded-full px-6 py-2.5 text-sm font-black shadow-md transition-all active:scale-95 " +
            (alreadyEarned
              ? "bg-emerald-100 text-emerald-700 cursor-default border border-emerald-200"
              : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg")
          }
        >
          {alreadyEarned ? (coins ? `+${coins} coins earned! 🪙` : getText(value.label, "en")) : getText(value.label, "en")}
        </button>
        {!alreadyEarned && coins ? (
          <span className="text-xs font-semibold text-amber-500">🪙 Earn {coins} coins!</span>
        ) : null}
      </div>
    );
  }

  function renderTrueFalseActivity(
    value: NonNullable<LessonSection["trueFalseActivity"]>,
    sectionIndex: number,
  ) {
    const actKey = `${lesson.slug}:tf:${sectionIndex}`;
    const answers = tfAnswers[actKey] ?? {};
    const isChecked = !!tfChecked[actKey];
    const allAnswered = value.questions.every((_, i) => answers[i] !== undefined && answers[i] !== null);
    const correctCount = isChecked
      ? value.questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0)
      : 0;

    function handleCheck() {
      setTfChecked((c) => ({ ...c, [actKey]: true }));
      const score = value.questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
      if (score === value.questions.length && value.coinsReward && !earnedCoins[actKey]) {
        setEarnedCoins((c) => ({ ...c, [actKey]: value.coinsReward! }));
        setCoinAnimating(actKey);
        window.setTimeout(() => setCoinAnimating(null), 2200);
      }
    }

    function handleSelect(idx: number, val: boolean) {
      if (isChecked) return;
      setTfAnswers((prev) => ({
        ...prev,
        [actKey]: { ...prev[actKey], [idx]: val },
      }));
    }

    const animating = coinAnimating === actKey;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="text-base font-black text-slate-800 mb-3">{getText(value.title, "en")}</h4>
        <div className="space-y-3">
          {value.questions.map((q, i) => {
            const selected = answers[i];
            const correct = isChecked && selected === q.answer;
            const wrong = isChecked && selected !== undefined && selected !== null && selected !== q.answer;
            return (
              <div
                key={i}
                className={
                  "rounded-lg border p-3 transition-colors " +
                  (correct ? "border-emerald-300 bg-emerald-50" : wrong ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50")
                }
              >
                <p className="text-sm font-semibold text-slate-700 mb-2">{getText(q.statement, "en")}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isChecked}
                    onClick={() => handleSelect(i, true)}
                    className={
                      "rounded-full px-4 py-1 text-xs font-bold transition-all " +
                      (selected === true
                        ? "bg-teal-500 text-white shadow"
                        : "bg-white border border-slate-300 text-slate-600 hover:border-teal-400")
                    }
                  >
                    True
                  </button>
                  <button
                    type="button"
                    disabled={isChecked}
                    onClick={() => handleSelect(i, false)}
                    className={
                      "rounded-full px-4 py-1 text-xs font-bold transition-all " +
                      (selected === false
                        ? "bg-teal-500 text-white shadow"
                        : "bg-white border border-slate-300 text-slate-600 hover:border-teal-400")
                    }
                  >
                    False
                  </button>
                  {isChecked ? (
                    <span className={"ml-2 text-xs font-bold " + (correct ? "text-emerald-600" : "text-red-500")}>
                      {correct ? "Correct!" : `Answer: ${q.answer ? "True" : "False"}`}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        {!isChecked ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleCheck}
            className={
              "mt-4 w-full rounded-full py-2 text-sm font-black shadow transition-all " +
              (allAnswered
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg active:scale-[0.98]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed")
            }
          >
            Check answers
          </button>
        ) : (
          <div className="mt-3 text-center">
            <span className="text-sm font-bold text-slate-700">
              Score: {correctCount}/{value.questions.length}
            </span>
            {correctCount === value.questions.length && value.coinsReward ? (
              <span className="ml-2 text-sm font-black text-amber-500">+{value.coinsReward} coins! 🪙</span>
            ) : null}
          </div>
        )}
        {value.coinsReward ? (
          <div className="mt-2 flex justify-center">
            <div className="relative flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
              <span className="text-base">🪣</span>
              <span className={"text-sm font-black tabular-nums " + (animating ? "text-amber-600" : "text-amber-500")}>
                {totalCoins}
              </span>
              <span className="text-[10px] font-bold text-amber-400">coins</span>
              {animating ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="pointer-events-none absolute text-lg" style={{ left: `${30 + (i % 3) * 15}%`, animation: `coinDrop 0.8s ease-in ${i * 0.12}s forwards`, opacity: 0 }}>🪙</span>
                  ))}
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  function renderFillBlanksActivity(
    value: NonNullable<LessonSection["fillBlanksActivity"]>,
    sectionIndex: number,
  ) {
    const actKey = `${lesson.slug}:fb:${sectionIndex}`;
    const answers = fbAnswers[actKey] ?? {};
    const isChecked = !!fbChecked[actKey];
    const allFilled = value.questions.every((_, i) => (answers[i] ?? "").trim().length > 0);
    const correctCount = isChecked
      ? value.questions.reduce((n, q, i) => {
          const userAns = (answers[i] ?? "").trim().toLowerCase();
          const correctAns = getText(q.answer, "en").trim().toLowerCase();
          return n + (userAns === correctAns ? 1 : 0);
        }, 0)
      : 0;

    function handleCheck() {
      setFbChecked((c) => ({ ...c, [actKey]: true }));
      const score = value.questions.reduce((n, q, i) => {
        const userAns = (answers[i] ?? "").trim().toLowerCase();
        const correctAns = getText(q.answer, "en").trim().toLowerCase();
        return n + (userAns === correctAns ? 1 : 0);
      }, 0);
      if (score === value.questions.length && value.coinsReward && !earnedCoins[actKey]) {
        setEarnedCoins((c) => ({ ...c, [actKey]: value.coinsReward! }));
        setCoinAnimating(actKey);
        window.setTimeout(() => setCoinAnimating(null), 2200);
      }
    }

    function handleInput(idx: number, val: string) {
      if (isChecked) return;
      setFbAnswers((prev) => ({
        ...prev,
        [actKey]: { ...prev[actKey], [idx]: val },
      }));
    }

    const animating = coinAnimating === actKey;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h4 className="text-base font-black text-slate-800 mb-3">{getText(value.title, "en")}</h4>
        <div className="space-y-3">
          {value.questions.map((q, i) => {
            const userAns = (answers[i] ?? "").trim().toLowerCase();
            const correctAns = getText(q.answer, "en").trim().toLowerCase();
            const correct = isChecked && userAns === correctAns;
            const wrong = isChecked && userAns !== correctAns;
            return (
              <div
                key={i}
                className={
                  "rounded-lg border p-3 transition-colors " +
                  (correct ? "border-emerald-300 bg-emerald-50" : wrong ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50")
                }
              >
                <p className="text-sm font-semibold text-slate-700 mb-2">{getText(q.sentence, "en")}</p>
                <input
                  type="text"
                  disabled={isChecked}
                  value={answers[i] ?? ""}
                  onChange={(e) => handleInput(i, e.target.value)}
                  placeholder="Type your answer..."
                  className={
                    "w-full rounded-lg border px-3 py-1.5 text-sm " +
                    (isChecked
                      ? correct ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"
                      : "border-slate-300 bg-white focus:border-teal-400 focus:ring-1 focus:ring-teal-200")
                  }
                />
                {isChecked && wrong ? (
                  <p className="mt-1 text-xs font-bold text-red-500">
                    Correct answer: {getText(q.answer, "en")}
                  </p>
                ) : isChecked && correct ? (
                  <p className="mt-1 text-xs font-bold text-emerald-600">Correct!</p>
                ) : null}
              </div>
            );
          })}
        </div>
        {!isChecked ? (
          <button
            type="button"
            disabled={!allFilled}
            onClick={handleCheck}
            className={
              "mt-4 w-full rounded-full py-2 text-sm font-black shadow transition-all " +
              (allFilled
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg active:scale-[0.98]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed")
            }
          >
            Check answers
          </button>
        ) : (
          <div className="mt-3 text-center">
            <span className="text-sm font-bold text-slate-700">
              Score: {correctCount}/{value.questions.length}
            </span>
            {correctCount === value.questions.length && value.coinsReward ? (
              <span className="ml-2 text-sm font-black text-amber-500">+{value.coinsReward} coins! 🪙</span>
            ) : null}
          </div>
        )}
        {value.coinsReward ? (
          <div className="mt-2 flex justify-center">
            <div className="relative flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
              <span className="text-base">🪣</span>
              <span className={"text-sm font-black tabular-nums " + (animating ? "text-amber-600" : "text-amber-500")}>
                {totalCoins}
              </span>
              <span className="text-[10px] font-bold text-amber-400">coins</span>
              {animating ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="pointer-events-none absolute text-lg" style={{ left: `${30 + (i % 3) * 15}%`, animation: `coinDrop 0.8s ease-in ${i * 0.12}s forwards`, opacity: 0 }}>🪙</span>
                  ))}
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  function renderGroupWorkCards(
    value: NonNullable<LessonSection["groupWorkCards"]>,
    sectionIndex: number,
  ) {
    const actKey = `${lesson.slug}:gw:${sectionIndex}`;
    const selectedId = gwSelectedCard[actKey] ?? null;
    const selectedCard = selectedId ? value.cards.find((c) => c.id === selectedId) : null;
    const workTexts = gwWork[actKey] ?? {};
    const submitted = gwSubmitted[actKey] ?? {};
    const animating = coinAnimating === actKey;

    const cardColors: Record<string, { bg: string; border: string; text: string; lightBg: string }> = {
      teal: { bg: "bg-teal-500", border: "border-teal-300", text: "text-teal-700", lightBg: "bg-teal-50" },
      blue: { bg: "bg-blue-500", border: "border-blue-300", text: "text-blue-700", lightBg: "bg-blue-50" },
      purple: { bg: "bg-purple-500", border: "border-purple-300", text: "text-purple-700", lightBg: "bg-purple-50" },
      amber: { bg: "bg-amber-500", border: "border-amber-300", text: "text-amber-700", lightBg: "bg-amber-50" },
      rose: { bg: "bg-rose-500", border: "border-rose-300", text: "text-rose-700", lightBg: "bg-rose-50" },
    };

    function handleSubmit(cardId: string) {
      setGwSubmitted((prev) => ({
        ...prev,
        [actKey]: { ...prev[actKey], [cardId]: true },
      }));
      if (value.coinsReward && !earnedCoins[`${actKey}:${cardId}`]) {
        setEarnedCoins((c) => ({ ...c, [`${actKey}:${cardId}`]: value.coinsReward! }));
        setCoinAnimating(actKey);
        window.setTimeout(() => setCoinAnimating(null), 2200);
      }
    }

    // Expanded card workspace view
    if (selectedCard) {
      const colors = cardColors[selectedCard.color] ?? cardColors.teal;
      const isSubmitted = !!submitted[selectedCard.id];
      const workText = workTexts[selectedCard.id] ?? "";

      return (
        <div className="space-y-4">
          {/* Back button — large, prominent */}
          <button
            type="button"
            onClick={() => setGwSelectedCard((prev) => ({ ...prev, [actKey]: null }))}
            className="flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 hover:shadow-md transition-all active:scale-[0.97]"
          >
            <span className="text-lg">⬅️</span>
            <span>Back to all tasks</span>
          </button>

          {/* Card header */}
          <div className={`rounded-xl ${colors.lightBg} border ${colors.border} p-4`}>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img src={selectedCard.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-black ${colors.text}`}>{getText(selectedCard.title, "en")}</h3>
                <p className="text-sm text-slate-600 mt-1">{getText(selectedCard.topic, "en")}</p>
              </div>
            </div>
          </div>

          {/* Information sections */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide">Reference Material</h4>
            {selectedCard.infoSections.map((info, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className={`text-xs font-black uppercase tracking-wide ${colors.text} mb-1.5`}>{getText(info.label, "en")}</p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{getText(info.content, "en")}</p>
              </div>
            ))}
          </div>

          {/* Task section */}
          <div className={`rounded-xl border-2 ${colors.border} bg-white p-4 shadow-md`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📋</span>
              <h4 className="text-base font-black text-slate-800">{getText(selectedCard.task.title, "en")}</h4>
            </div>
            <p className="text-sm text-slate-700 mb-3 leading-relaxed">{getText(selectedCard.task.description, "en")}</p>
            {selectedCard.task.hint ? (
              <p className="text-xs text-slate-500 italic mb-3">💡 {getText(selectedCard.task.hint, "en")}</p>
            ) : null}

            {/* Workspace — notebook-style with assessment toolbar */}
            <div className="rounded-xl border-2 border-slate-300 bg-white shadow-lg overflow-hidden">
              {/* Toolbar — styled like assessment annotation tools */}
              <div className="flex flex-wrap items-center gap-2 border-b-2 border-slate-200 bg-slate-50 px-3 py-2">
                {/* Tool buttons */}
                <div className="flex h-9 items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                  {[
                    { icon: "✏️", label: "Pen" },
                    { icon: "🖍️", label: "Highlighter" },
                    { icon: "🔤", label: "Text" },
                    { icon: "🧹", label: "Eraser" },
                  ].map((t) => (
                    <span key={t.label} title={t.label} className="flex h-7 w-8 items-center justify-center rounded-lg border border-transparent text-sm hover:border-slate-200 hover:bg-slate-100 cursor-default">{t.icon}</span>
                  ))}
                </div>
                {/* Color swatches */}
                <div className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 shadow-sm">
                  {["#111827","#dc2626","#2563eb","#16a34a","#f59e0b","#8b5cf6","#ec4899","#67e8f9"].map((c) => (
                    <span key={c} className="h-[20px] w-[20px] rounded-full border border-white/80 cursor-default" style={{ backgroundColor: c }} />
                  ))}
                </div>
                {/* Stroke sizes */}
                <div className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 shadow-sm">
                  {[2, 4, 6].map((w) => (
                    <span key={w} className="flex h-7 w-7 items-center justify-center rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-100 cursor-default">
                      <span className="rounded-full bg-slate-800" style={{ width: 14, height: w }} />
                    </span>
                  ))}
                </div>
                {/* Undo / Redo */}
                <div className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-1 shadow-sm">
                  <span title="Undo" className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 cursor-default">↩️</span>
                  <span title="Redo" className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 cursor-default">↪️</span>
                </div>
              </div>
              {/* Notebook paper */}
              <div className="p-4 bg-white" style={{ backgroundImage: "linear-gradient(#fef3c7 1px, transparent 1px), linear-gradient(90deg, #fde68a 1px, transparent 1px)", backgroundSize: "100% 32px, 40px 32px", backgroundPosition: "0 0, 40px 0" }}>
                <textarea
                  disabled={isSubmitted}
                  value={workText}
                  onChange={(e) =>
                    setGwWork((prev) => ({
                      ...prev,
                      [actKey]: { ...prev[actKey], [selectedCard!.id]: e.target.value },
                    }))
                  }
                  placeholder="Write your work here... Use headings, bullet points, or any format you like. Be creative and use evidence from the reference material above."
                  className={
                    "w-full rounded-none border-0 bg-transparent px-4 py-1 text-base resize-none focus:outline-none focus:ring-0 " +
                    (isSubmitted ? "text-slate-700" : "text-slate-800 placeholder:text-slate-400")
                  }
                  style={{
                    minHeight: "640px",
                    lineHeight: "32px",
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            {!isSubmitted ? (
              <button
                type="button"
                disabled={workText.trim().length < 20}
                onClick={() => handleSubmit(selectedCard!.id)}
                className={
                  "mt-3 w-full rounded-full py-2.5 text-sm font-black shadow transition-all " +
                  (workText.trim().length >= 20
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg active:scale-[0.98]"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed")
                }
              >
                Submit my work
              </button>
            ) : (
              <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                <p className="text-sm font-black text-emerald-700">Work submitted! Get ready to present to the class.</p>
                {value.coinsReward ? (
                  <span className="text-sm font-black text-amber-500">+{value.coinsReward} coins earned! 🪙</span>
                ) : null}
              </div>
            )}
          </div>

          {/* Coin bucket */}
          {value.coinsReward ? (
            <div className="flex justify-center">
              <div className="relative flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
                <span className="text-base">🪣</span>
                <span className={"text-sm font-black tabular-nums " + (animating ? "text-amber-600" : "text-amber-500")}>
                  {totalCoins}
                </span>
                <span className="text-[10px] font-bold text-amber-400">coins</span>
                {animating ? (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span key={i} className="pointer-events-none absolute text-lg" style={{ left: `${30 + (i % 3) * 15}%`, animation: `coinDrop 0.8s ease-in ${i * 0.12}s forwards`, opacity: 0 }}>🪙</span>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Presentation reminder */}
          {value.presentationNote && isSubmitted ? (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
              <p className="text-sm font-semibold text-blue-700">🎤 {getText(value.presentationNote, "en")}</p>
            </div>
          ) : null}
        </div>
      );
    }

    // Card grid view
    return (
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-800">{getText(value.title, "en")}</h3>
        {value.instruction ? (
          <p className="text-sm text-slate-600">{getText(value.instruction, "en")}</p>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {value.cards.map((card) => {
            const colors = cardColors[card.color] ?? cardColors.teal;
            const isDone = !!submitted[card.id];
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setGwSelectedCard((prev) => ({ ...prev, [actKey]: card.id }))}
                className={
                  "group relative rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] " +
                  (isDone ? "border-emerald-300 bg-emerald-50" : `${colors.border} bg-white`)
                }
              >
                <div className="h-28 overflow-hidden">
                  <img src={card.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className={`absolute top-2 right-2 rounded-full ${colors.bg} px-2 py-0.5`}>
                    <span className="text-[10px] font-black text-white uppercase">{card.id}</span>
                  </div>
                  {isDone ? (
                    <div className="absolute top-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5">
                      <span className="text-[10px] font-black text-white">Done</span>
                    </div>
                  ) : null}
                </div>
                <div className="p-3">
                  <h4 className={`text-sm font-black ${colors.text} mb-1`}>{getText(card.title, "en")}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{getText(card.topic, "en")}</p>
                </div>
              </button>
            );
          })}
        </div>

        {value.presentationNote ? (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
            <p className="text-sm font-semibold text-blue-700">🎤 {getText(value.presentationNote, "en")}</p>
          </div>
        ) : null}

        {/* Coin bucket */}
        {value.coinsReward ? (
          <div className="flex justify-center">
            <div className="relative flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5">
              <span className="text-base">🪣</span>
              <span className={"text-sm font-black tabular-nums " + (animating ? "text-amber-600" : "text-amber-500")}>
                {totalCoins}
              </span>
              <span className="text-[10px] font-bold text-amber-400">coins</span>
              {animating ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="pointer-events-none absolute text-lg" style={{ left: `${30 + (i % 3) * 15}%`, animation: `coinDrop 0.8s ease-in ${i * 0.12}s forwards`, opacity: 0 }}>🪙</span>
                  ))}
                </>
              ) : null}
            </div>
          </div>
        ) : null}
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
    const key = `${lesson.slug}:${sectionIndex}`;
    const coins = value.coinsReward;
    const alreadyEarned = !!earnedCoins[key];
    const animating = coinAnimating === key;
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className={"flex items-center gap-2.5 border-b border-slate-100 " + (compact ? "px-3 py-2" : "px-4 py-2.5")}>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white"
          >
            You
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-slate-900">{getText(value.title, "en")}</div>
            <div className="text-[10px] font-medium text-slate-400">Share your evidence-based response</div>
          </div>
          {coins ? (
            <div className="relative flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1">
              <span className="text-base">🪣</span>
              <span className={"text-sm font-black tabular-nums " + (animating ? "text-amber-600" : "text-amber-500")}>
                {totalCoins}
              </span>
              <span className="text-[10px] font-bold text-amber-400">coins</span>
              {animating ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="pointer-events-none absolute text-lg"
                      style={{
                        left: `${30 + (i % 3) * 15}%`,
                        animation: `coinDrop 0.8s ease-in ${i * 0.12}s forwards`,
                        opacity: 0,
                      }}
                    >
                      🪙
                    </span>
                  ))}
                  <style>{`
                    @keyframes coinDrop {
                      0% { transform: translateY(-30px) scale(1.3); opacity: 1; }
                      60% { transform: translateY(0px) scale(1); opacity: 1; }
                      80% { transform: translateY(-6px) scale(1); opacity: 1; }
                      100% { transform: translateY(0px) scale(0.7); opacity: 0; }
                    }
                  `}</style>
                </>
              ) : null}
            </div>
          ) : null}
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
              {coins && !alreadyEarned ? (
                <span className="text-amber-500 font-semibold">🪙 Earn {coins} coins!</span>
              ) : (
                <>Use evidence from the Qur&apos;an, Hadith, life, Islamic stories, or science.</>
              )}
            </div>
            <button
              type="button"
              onClick={() => saveResponse(sectionIndex)}
              className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              {getText(value.buttonLabel ?? "Post comment", "en")}
            </button>
          </div>
          {savedStates[key] ? (
            <div className={"mt-2 text-xs font-semibold " + (animating ? "text-amber-600" : "text-green-600")}>
              {animating ? `+${coins} coins earned! 🪙` : "Comment saved."}
            </div>
          ) : null}
          {alreadyEarned && !animating ? (
            <div className="mt-1 text-[10px] font-medium text-amber-400">🪙 {earnedCoins[key]} coins earned</div>
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
      case "imageMatchingActivity":
        return renderImageMatchingActivity(block.value, sectionIndex);
      case "image":
        return renderImage(block.value, presentationMode);
      case "callout":
        return renderCallout(block.value, presentationMode);
      case "readyButton":
        return renderReadyButton(block.value, sectionIndex);
      case "trueFalseActivity":
        return renderTrueFalseActivity(block.value, sectionIndex);
      case "fillBlanksActivity":
        return renderFillBlanksActivity(block.value, sectionIndex);
      case "groupWorkCards":
        return renderGroupWorkCards(block.value, sectionIndex);
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
        {activeSection.imageMatchingActivity ? renderImageMatchingActivity(activeSection.imageMatchingActivity, activeIndex) : null}
        {activeSection.callout ? renderCallout(activeSection.callout) : null}
        {activeSection.readyButton ? renderReadyButton(activeSection.readyButton, activeIndex) : null}
        {activeSection.trueFalseActivity ? renderTrueFalseActivity(activeSection.trueFalseActivity, activeIndex) : null}
        {activeSection.fillBlanksActivity ? renderFillBlanksActivity(activeSection.fillBlanksActivity, activeIndex) : null}
        {activeSection.groupWorkCards ? renderGroupWorkCards(activeSection.groupWorkCards, activeIndex) : null}
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
            "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-black leading-none " +
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
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-black leading-none " +
                      (completed
                        ? "bg-green-500 text-white"
                        : active
                        ? "bg-teal-500 text-white"
                        : "bg-slate-100 text-slate-700")
                    }
                  >
                    {completed ? "✓" : sectionIndex + 1}
                  </span>
                </button>
                {orderIndex < orderedParts.length - 1 ? <span className="text-slate-300">›</span> : null}
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
              {activeIndex >= totalSections - 1
                ? "Mark Done"
                : hasQuiz && activeIndex === totalSections - 2
                ? "Mark Done & Open Quiz"
                : "Mark Done & Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
