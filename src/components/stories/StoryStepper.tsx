"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { ProphetStory } from "../../app/mind-upgrade/stories-of-the-prophets/stories";
import type { StoryProgress } from "./storyProgress";
import AdamQuizClient from "./AdamQuizClient";
import StoryQuizClient from "./StoryQuizClient";
import { useLanguage } from "../../app/LanguageContext";
import { resolveMiniGame } from "./miniGameConfig";
import {
  getStoryProgress,
  markSectionCompleted,
  resetStoryProgress,
  setCurrentSection,
  setStoryProgress,
  isCheckpointPassed,
  isMiniGamePlayed,
  getMiniGameXP,
  getMinigameLevel,
} from "./storyProgress";

type Props = {
  story: ProphetStory;
  basePath?: string;
};

const EMPTY_PROGRESS: StoryProgress = {
  currentSectionIndex: 0,
  completedSectionIndices: [],
  isStoryCompleted: false,
};

function subscribeToProgress(callback: () => void) {
  const handleStorage = (e: StorageEvent) => {
    if (!e.key) return;
    if (e.key.startsWith("islamic_curriculum_story_progress_v1:")) callback();
  };
  const handleProgress = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener("story-progress-updated", handleProgress);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("story-progress-updated", handleProgress);
  };
}



export default function StoryStepper({ story, basePath }: Props) {
  const router = useRouter();
  const { language } = useLanguage();
  const totalSections = story.sections.length;
  const storyBasePath = useMemo(() => {
    const path = basePath && basePath.trim().length > 0 ? basePath.trim() : "/mind-upgrade/stories-of-the-prophets";
    const withRoot = path.startsWith("/") ? path : `/${path}`;
    return withRoot.endsWith("/") ? withRoot.slice(0, -1) : withRoot;
  }, [basePath]);

  // Helper to get translated text
  const getText = (text: string | { en: string; ar: string }): string => {
    if (typeof text === "string") return text;
    return text[language] || text.en;
  };

  const progress = useSyncExternalStore(
    subscribeToProgress,
    () => getStoryProgress(story.slug),
    () => EMPTY_PROGRESS,
  );

  const completedSet = useMemo(
    () => new Set(progress.completedSectionIndices ?? []),
    [progress.completedSectionIndices],
  );

  const nextRequiredIndex = useMemo(() => {
    for (let i = 0; i < totalSections; i++) {
      if (!completedSet.has(i)) return i;
    }
    return Math.max(0, totalSections - 1);
  }, [completedSet, totalSections]);

  const highestUnlockedIndex = useMemo(() => {
    // Student starts at Part 1 (index 0). Next part unlocks only after current is completed.
    // Once a part is completed it stays open (review allowed).
    return Math.min(Math.max(0, nextRequiredIndex), Math.max(0, totalSections - 1));
  }, [nextRequiredIndex, totalSections]);

  const activeIndex = useMemo(() => {
    const idx = Math.min(
      Math.max(progress.currentSectionIndex ?? 0, 0),
      Math.max(0, totalSections - 1),
    );
    return Math.min(idx, highestUnlockedIndex);
  }, [progress.currentSectionIndex, totalSections, highestUnlockedIndex]);
  const isStoryCompleted = Boolean(progress.isStoryCompleted);

  const activeSection = story.sections[activeIndex];

  const quizSectionIndex = Math.max(0, totalSections - 1);
  const isOnQuizSection = activeIndex === quizSectionIndex;
  const isAdam = story.slug === "adam";

  const hasCompletedAllNonQuizSections = useMemo(() => {
    if (totalSections <= 1) return true;
    // Require Part 12 (index 11) completed before unlocking the final quiz. For shorter stories,
    // fall back to requiring all pre-quiz parts.
    const unlockIndex = Math.min(quizSectionIndex - 1, 11);
    if (unlockIndex >= 0 && !completedSet.has(unlockIndex)) return false;
    for (let i = 0; i < quizSectionIndex; i++) {
      if (!completedSet.has(i)) return false;
    }
    return true;
  }, [completedSet, quizSectionIndex, totalSections]);

  const hasPassedQuiz = useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem(`islamic_curriculum_story_quiz_v1:${story.slug}`);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as { passed?: unknown; score?: unknown };
      return Boolean(parsed?.passed) && typeof parsed?.score === "number" && parsed.score >= 7;
    } catch {
      return false;
    }
  }, [story.slug]);

  const hasQuizAttempt = useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem(`islamic_curriculum_story_quiz_v1:${story.slug}`);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as { score?: unknown };
      return typeof parsed?.score === "number";
    } catch {
      return false;
    }
  }, [story.slug]);

  const progressText = useMemo(() => {
    const completedCount = completedSet.size;
    const pct = totalSections > 0 ? Math.min(100, Math.round((completedCount / totalSections) * 100)) : 0;
    return `${completedCount}/${totalSections} parts completed (${pct}%)`;
  }, [completedSet, totalSections]);

  const miniGameXP = useSyncExternalStore(
    subscribeToProgress,
    () => getMiniGameXP(story.slug),
    () => 0,
  );

  const completedCount = completedSet.size;
  const progressPct = totalSections > 0 ? Math.min(100, Math.round((completedCount / totalSections) * 100)) : 0;

  function onMarkThisPartDone() {
    if (isOnQuizSection && !hasPassedQuiz) return;
    markSectionCompleted(story.slug, activeIndex, totalSections);
  }

  function onFinishQuizAndReturn() {
    if (hasPassedQuiz) {
      markSectionCompleted(story.slug, activeIndex, totalSections);
    }
    router.push(storyBasePath);
  }

  function scrollToTop() {
    if (typeof window === "undefined") return;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch {
      // Some browsers don't support behavior: 'instant'.
      window.scrollTo(0, 0);
    }
  }

  function goTo(index: number) {
    const clamped = Math.min(Math.max(index, 0), highestUnlockedIndex);
    setCurrentSection(story.slug, clamped);
    scrollToTop();
  }

  function markDoneAndAdvance() {
    if (isOnQuizSection && !hasPassedQuiz) return;

    // Check checkpoint gates
    const hasCheckpoint = activeIndex === 3 || activeIndex === 7 || activeIndex === 11;
    if (hasCheckpoint) {
      const checkpointPart = activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12;
      if (!isCheckpointPassed(story.slug, checkpointPart)) return;
    }

    const current = getStoryProgress(story.slug);
    const completed = new Set(current.completedSectionIndices ?? []);
    completed.add(activeIndex);
    const completedSectionIndices = Array.from(completed).sort((a, b) => a - b);

    const nextIndex = Math.min(activeIndex + 1, Math.max(0, totalSections - 1));

    const allPartsCompleted = totalSections > 0 && completedSectionIndices.length >= totalSections;
    const nextIsStoryCompleted = allPartsCompleted && hasPassedQuiz;

    setStoryProgress(story.slug, {
      currentSectionIndex: Math.max(current.currentSectionIndex ?? 0, nextIndex),
      completedSectionIndices,
      isStoryCompleted: nextIsStoryCompleted,
    });

    scrollToTop();
  }

  function onReset() {
    resetStoryProgress(story.slug);
  }

  return (
    <>
      {/* Progress Card - Now outside the grid */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-bold text-gray-700">Your Progress</div>
            <div className="flex items-center gap-2">
              {miniGameXP > 0 && (
                <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-black text-purple-700">
                  🎮 +{miniGameXP} XP
                </div>
              )}
              {isStoryCompleted ? (
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                  ✓ Completed
                </div>
              ) : null}
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{progressText}</div>
        </div>

        <div className="mb-3 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-sm font-bold text-gray-500 hover:text-gray-700"
        >
          Reset progress
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        {/* Parts Navigation (Left Side) */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-black text-gray-900">Parts</div>
            <div className="text-xs font-bold text-gray-500">Locked until completed</div>
          </div>

          <div className="grid gap-2">
            {story.sections.map((s, idx) => {
              const isLocked = idx > highestUnlockedIndex;
              const sectionTitle = getText(s.title);
              
              // Check if this part has a checkpoint and if mini-game was played
              const hasCheckpointHere = idx === 3 || idx === 7 || idx === 11;
              const checkpointNum = idx === 3 ? 4 : idx === 7 ? 8 : 12;
              const miniGamePlayedHere = hasCheckpointHere && isMiniGamePlayed(story.slug, checkpointNum);
              const checkpointMeta = hasCheckpointHere ? resolveMiniGame(story.slug, checkpointNum).meta : null;
              
              return (
                <button
                  key={`${story.slug}:${idx}:${sectionTitle}`}
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) return;
                    goTo(idx);
                  }}
                  className={
                    "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left font-bold transition-all " +
                    (idx === activeIndex
                      ? "border-teal-500 bg-teal-50 text-teal-900 shadow-sm"
                      : isLocked
                        ? "border-gray-200 bg-white text-gray-400 opacity-70"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50")
                  }
                >
                  <span
                    className={
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black " +
                      (completedSet.has(idx)
                        ? "bg-green-500 text-white"
                        : idx === activeIndex
                          ? "bg-teal-500 text-white"
                          : isLocked
                            ? "bg-gray-100 text-gray-400"
                            : "bg-gray-100 text-gray-600")
                    }
                  >
                    {completedSet.has(idx) ? "✓" : idx + 1}
                  </span>
                  <span className="flex-1">{sectionTitle}</span>
                  {miniGamePlayedHere ? (
                    <span className="text-sm">🏆</span>
                  ) : checkpointMeta ? (
                    <span className="text-xs font-bold text-amber-700">
                      {checkpointMeta.icon} {checkpointMeta.label}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

      {/* Main Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-teal-600">
            Part {activeIndex + 1} of {totalSections}
          </div>
          <div className="text-2xl font-black text-gray-900">{activeSection ? getText(activeSection.title) : ""}</div>
          {completedSet.has(activeIndex) ? (
            <div className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-green-600">
              <span>✓</span> Completed
            </div>
          ) : null}
        </div>

        <div className="mb-6 whitespace-pre-line text-base leading-relaxed text-gray-700">
          {isOnQuizSection ? (
            <div className="grid gap-4">
              <div className="whitespace-pre-line text-base leading-relaxed text-gray-700">
                {activeSection ? getText(activeSection.body) : ""}
              </div>
              {isAdam ? (
                <AdamQuizClient
                  slug={story.slug}
                  totalSections={totalSections}
                  quizSectionIndex={quizSectionIndex}
                  unlocked={hasCompletedAllNonQuizSections}
                />
              ) : (
                <StoryQuizClient
                  slug={story.slug}
                  totalSections={totalSections}
                  quizSectionIndex={quizSectionIndex}
                  unlocked={hasCompletedAllNonQuizSections}
                  sections={story.sections.slice(0, quizSectionIndex).map((s) => ({
                    title: getText(s.title),
                    body: getText(s.body),
                  }))}
                />
              )}
            </div>
          ) : (
            activeSection ? getText(activeSection.body) : ""
          )}
        </div>

        {/* Checkpoint Gate - Redirect to dedicated checkpoint page */}
        {(activeIndex === 3 || activeIndex === 7 || activeIndex === 11) && !isOnQuizSection ? (
          isCheckpointPassed(story.slug, activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12) ? (
            // Checkpoint PASSED - Show game button
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
              <div className="mb-3">
                <div className="text-sm font-bold text-green-900">
                  ✓ Checkpoint Completed!
                </div>
                <div className="mt-1 text-sm text-green-800">
                  Great job! Now play the reward game:
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-green-800 shadow-sm">
                  {resolveMiniGame(story.slug, activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12).meta.icon}
                  {resolveMiniGame(story.slug, activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12).meta.label}
                  {(() => {
                    const difficulty = getMinigameLevel(story.slug, activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12);
                    const diffEmoji = difficulty === "easy" ? "⭐" : difficulty === "medium" ? "⭐⭐" : "⭐⭐⭐";
                    return <span className="ml-2 text-yellow-600">{diffEmoji}</span>;
                  })()}
                </div>
              </div>
              <a
                href={`${storyBasePath}/${story.slug}/minigame/${activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12}`}
                className="inline-block rounded-lg bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
              >
                Play Game →
              </a>
            </div>
          ) : (
            // Checkpoint NOT PASSED - Show checkpoint required message
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
              <div className="mb-3">
                <div className="text-sm font-bold text-amber-900">
                  📋 Checkpoint Required
                </div>
                <div className="mt-1 text-sm text-amber-800">
                  You must complete this checkpoint before continuing to the next part.
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-amber-800 shadow-sm">
                  {resolveMiniGame(story.slug, activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12).meta.icon}
                  {resolveMiniGame(story.slug, activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12).meta.label}
                </div>
              </div>
              <a
                href={`${storyBasePath}/${story.slug}/checkpoint/${activeIndex === 3 ? 4 : activeIndex === 7 ? 8 : 12}`}
                className="inline-block rounded-lg bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-700"
              >
                Open Checkpoint →
              </a>
            </div>
          )
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="rounded-lg border-2 border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          {activeIndex < totalSections - 1 ? (
            <button
              type="button"
              onClick={() => {
                markDoneAndAdvance();
              }}
              disabled={
                (isOnQuizSection && !hasPassedQuiz) ||
                (activeIndex === 3 && !isCheckpointPassed(story.slug, 4)) ||
                (activeIndex === 7 && !isCheckpointPassed(story.slug, 8)) ||
                (activeIndex === 11 && !isCheckpointPassed(story.slug, 12))
              }
              className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark Done & Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={isOnQuizSection ? onFinishQuizAndReturn : onMarkThisPartDone}
              disabled={isOnQuizSection ? !hasQuizAttempt : false}
              className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3 font-black text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark Done ✓
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
