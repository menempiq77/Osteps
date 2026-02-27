export type StoryProgress = {
  /** Highest section index the student has reached (0-based). */
  currentSectionIndex: number;
  /** Set of section indices the student has marked as completed. */
  completedSectionIndices: number[];
  /** True when all sections are completed. */
  isStoryCompleted: boolean;
};

export type QuizCompletionStatus = "COMPLETED" | "FAILED";

const STORAGE_PREFIX = "islamic_curriculum_story_progress_v1";
const QUIZ_PREFIX = "islamic_curriculum_story_quiz_v1";
const CHECKPOINT_PREFIX = `${STORAGE_PREFIX}_checkpoint`;
const CHECKPOINT_ATTEMPT_PREFIX = `${STORAGE_PREFIX}_checkpoint_attempts`;
const CHECKPOINT_STATUS_PREFIX = `${STORAGE_PREFIX}_checkpoint_status`;
const REWARDS_PREFIX = `${STORAGE_PREFIX}_rewards`;
const MINIGAME_PREFIX = `${STORAGE_PREFIX}_minigame`;
const MINIGAME_XP_PREFIX = `${STORAGE_PREFIX}_minigame_xp`;

const DEFAULT_PROGRESS: StoryProgress = {
  currentSectionIndex: 0,
  completedSectionIndices: [],
  isStoryCompleted: false,
};

// Cache last-seen storage values per slug so getStoryProgress can return a stable
// object reference when nothing changed (important for useSyncExternalStore).
const PROGRESS_CACHE = new Map<string, { raw: string | null; progress: StoryProgress }>();

function keyForSlug(slug: string) {
  return `${STORAGE_PREFIX}:${slug}`;
}

function quizKeyForSlug(slug: string) {
  return `${QUIZ_PREFIX}:${slug}`;
}

function quizPassMark(total: number) {
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 10;
  return Math.ceil(safeTotal * 0.7);
}

function hasPassedRequiredQuiz(slug: string) {
  if (typeof window === "undefined") return false;

  try {
    const raw = window.localStorage.getItem(quizKeyForSlug(slug));
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      status?: unknown;
      passed?: unknown;
      score?: unknown;
      total?: unknown;
    };

    if (parsed?.status === "COMPLETED") return true;

    const score = typeof parsed?.score === "number" ? parsed.score : null;
    const total = typeof parsed?.total === "number" ? parsed.total : 10;
    if (typeof score !== "number") return false;
    return Boolean(parsed?.passed) && score >= quizPassMark(total);
  } catch {
    return false;
  }
}

export function getStoryProgress(slug: string): StoryProgress {
  if (typeof window === "undefined") {
    return DEFAULT_PROGRESS;
  }

  try {
    const raw = window.localStorage.getItem(keyForSlug(slug));

    const cached = PROGRESS_CACHE.get(slug);
    if (cached && cached.raw === raw) {
      return cached.progress;
    }

    if (!raw) {
      PROGRESS_CACHE.set(slug, { raw: null, progress: DEFAULT_PROGRESS });
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(raw) as Partial<StoryProgress>;

    const progress: StoryProgress = {
      currentSectionIndex:
        typeof parsed.currentSectionIndex === "number" && parsed.currentSectionIndex >= 0
          ? parsed.currentSectionIndex
          : 0,
      completedSectionIndices: Array.isArray(parsed.completedSectionIndices)
        ? parsed.completedSectionIndices.filter((n) => typeof n === "number" && n >= 0)
        : [],
      isStoryCompleted: Boolean(parsed.isStoryCompleted),
    };

    PROGRESS_CACHE.set(slug, { raw, progress });
    return progress;
  } catch {
    PROGRESS_CACHE.set(slug, { raw: null, progress: DEFAULT_PROGRESS });
    return DEFAULT_PROGRESS;
  }
}

export function setStoryProgress(slug: string, progress: StoryProgress) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(progress);
  window.localStorage.setItem(keyForSlug(slug), raw);
  PROGRESS_CACHE.set(slug, { raw, progress });
  try {
    window.dispatchEvent(new Event("story-progress-updated"));
  } catch {
    // ignore
  }
}

export function markSectionCompleted(slug: string, sectionIndex: number, totalSections: number) {
  const current = getStoryProgress(slug);
  const completed = new Set(current.completedSectionIndices);
  completed.add(sectionIndex);

  const completedSectionIndices = Array.from(completed).sort((a, b) => a - b);
  const allPartsCompleted = totalSections > 0 && completedSectionIndices.length >= totalSections;
  const isStoryCompleted = allPartsCompleted && hasPassedRequiredQuiz(slug);

  setStoryProgress(slug, {
    currentSectionIndex: Math.max(current.currentSectionIndex, sectionIndex),
    completedSectionIndices,
    isStoryCompleted,
  });
}

export function setCurrentSection(slug: string, sectionIndex: number) {
  const current = getStoryProgress(slug);
  setStoryProgress(slug, {
    ...current,
    currentSectionIndex: Math.max(0, sectionIndex),
  });
}

export function resetStoryProgress(slug: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(keyForSlug(slug));
  PROGRESS_CACHE.set(slug, { raw: null, progress: DEFAULT_PROGRESS });
  // Also clear checkpoint completion
  [4, 8, 12].forEach((part) => {
    window.localStorage.removeItem(`${CHECKPOINT_PREFIX}:${slug}:${part}`);
    window.localStorage.removeItem(`${CHECKPOINT_ATTEMPT_PREFIX}:${slug}:${part}`);
    window.localStorage.removeItem(`${CHECKPOINT_STATUS_PREFIX}:${slug}:${part}`);
  });
  // Clear rewards for this story
  window.localStorage.removeItem(rewardsKey(slug));
  try {
    window.dispatchEvent(new Event("story-progress-updated"));
  } catch {
    // ignore
  }
}

export function isCheckpointPassed(slug: string, partIndex: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = `${CHECKPOINT_PREFIX}:${slug}:${partIndex}`;
    const raw = window.localStorage.getItem(key);
    return raw === "passed";
  } catch {
    return false;
  }
}

export function markCheckpointPassed(slug: string, partIndex: number) {
  if (typeof window === "undefined") return;
  try {
    const key = `${CHECKPOINT_PREFIX}:${slug}:${partIndex}`;
    window.localStorage.setItem(key, "passed");
    // Clear attempts and failure status on success
    window.localStorage.removeItem(`${CHECKPOINT_ATTEMPT_PREFIX}:${slug}:${partIndex}`);
    window.localStorage.removeItem(`${CHECKPOINT_STATUS_PREFIX}:${slug}:${partIndex}`);
    window.dispatchEvent(new Event("story-progress-updated"));
  } catch {
    // ignore
  }
}

function attemptsKey(slug: string, partIndex: number) {
  return `${CHECKPOINT_ATTEMPT_PREFIX}:${slug}:${partIndex}`;
}

function statusKey(slug: string, partIndex: number) {
  return `${CHECKPOINT_STATUS_PREFIX}:${slug}:${partIndex}`;
}

function rewardsKey(slug: string) {
  return `${REWARDS_PREFIX}:${slug}`;
}

export function getCheckpointAttempts(slug: string, partIndex: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(attemptsKey(slug, partIndex));
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function incrementCheckpointAttempt(slug: string, partIndex: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const next = getCheckpointAttempts(slug, partIndex) + 1;
    window.localStorage.setItem(attemptsKey(slug, partIndex), String(next));
    return next;
  } catch {
    return 0;
  }
}

export function resetCheckpointAttempts(slug: string, partIndex: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(attemptsKey(slug, partIndex));
  } catch {
    // ignore
  }
}

export function markCheckpointFailed(slug: string, partIndex: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(statusKey(slug, partIndex), "failed");
  } catch {
    // ignore
  }
}

export function clearCheckpointStatus(slug: string, partIndex: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(statusKey(slug, partIndex));
  } catch {
    // ignore
  }
}

export function isCheckpointFailed(slug: string, partIndex: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(statusKey(slug, partIndex));
    return raw === "failed";
  } catch {
    return false;
  }
}

type StoryRewards = {
  xp: number;
  bestScore: number;
  total: number;
  badge?: string;
  awardedAt: string;
};

export function getStoryRewards(slug: string): { xp: number; badge?: string; bestScore: number; total: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(rewardsKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoryRewards>;
    const xp = typeof parsed.xp === "number" && Number.isFinite(parsed.xp) ? parsed.xp : 0;
    const bestScore = typeof parsed.bestScore === "number" && Number.isFinite(parsed.bestScore) ? parsed.bestScore : 0;
    const total = typeof parsed.total === "number" && Number.isFinite(parsed.total) ? parsed.total : 10;
    const badge = typeof parsed.badge === "string" ? parsed.badge : undefined;
    if (!xp && !badge && !bestScore) return null;
    return { xp, badge, bestScore, total };
  } catch {
    return null;
  }
}

/**
 * Record XP and badge rewards for a passed quiz.
 * - Base XP: 100 for any passing score (>=7/10).
 * - Perfect score: 150 XP total + badge "Perfect Quiz".
 * Rewards are idempotent and will upgrade if a later attempt improves score to perfect.
 */
export function recordQuizRewards(slug: string, score: number, total: number) {
  if (typeof window === "undefined") return;
  if (score < quizPassMark(total)) return; // do not award unless passed

  const isPerfect = score === total;
  const xpToGrant = isPerfect ? 150 : 100;
  const badgeToGrant = isPerfect ? "Perfect Quiz" : undefined;

  try {
    const raw = window.localStorage.getItem(rewardsKey(slug));
    if (raw) {
      const existing = JSON.parse(raw) as Partial<StoryRewards>;
      // If already recorded perfect, keep it.
      if (existing.bestScore === total && existing.xp === 150) return;

      // Upgrade to perfect if newly achieved.
      if (isPerfect) {
        const next: StoryRewards = {
          xp: 150,
          bestScore: score,
          total,
          badge: "Perfect Quiz",
          awardedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(rewardsKey(slug), JSON.stringify(next));
        return;
      }

      // If previously had no record or lower XP, store base XP.
      if (!existing.xp || existing.xp < xpToGrant) {
        const next: StoryRewards = {
          xp: xpToGrant,
          bestScore: Math.max(score, existing.bestScore ?? score),
          total,
          badge: existing.badge,
          awardedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(rewardsKey(slug), JSON.stringify(next));
      }

      // Always update bestScore when improving, even if XP doesn't change.
      if (typeof existing.bestScore === "number" && score > existing.bestScore) {
        const next: StoryRewards = {
          xp: typeof existing.xp === "number" ? existing.xp : xpToGrant,
          bestScore: score,
          total,
          badge: existing.badge,
          awardedAt: existing.awardedAt ?? new Date().toISOString(),
        };
        window.localStorage.setItem(rewardsKey(slug), JSON.stringify(next));
      }
      return;
    }

    const next: StoryRewards = {
      xp: xpToGrant,
      bestScore: score,
      total,
      badge: badgeToGrant,
      awardedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(rewardsKey(slug), JSON.stringify(next));
  } catch {
    // ignore
  }
}

function stageStartIndexForCheckpoint(partIndex: number): number {
  if (partIndex <= 4) return 0; // Stage 1 starts at part 1 (index 0)
  if (partIndex <= 8) return 4; // Stage 2 starts at part 5 (index 4)
  return 8; // Stage 3 starts at part 9 (index 8)
}

/**
 * Reset progress to the start of the current stage (not the whole story).
 * Retains completion before the stage start and clears completion at/after stage start.
 */
export function resetStageProgressToStageStart(slug: string, partIndex: number) {
  if (typeof window === "undefined") return;
  const stageStart = stageStartIndexForCheckpoint(partIndex);
  const current = getStoryProgress(slug);
  const kept = (current.completedSectionIndices ?? []).filter((idx) => idx < stageStart);
  setStoryProgress(slug, {
    currentSectionIndex: stageStart,
    completedSectionIndices: kept,
    isStoryCompleted: false,
  });
  try {
    window.dispatchEvent(new Event("story-progress-updated"));
  } catch {
    // ignore
  }
}

/**
 * Check if a story has been started but not completed.
 * Returns true if the user has viewed any parts or has progress, but hasn't completed the story.
 */
export function isStoryInProgress(slug: string): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const progress = getStoryProgress(slug);
    
    // Story is in progress if:
    // 1. Not completed, AND
    // 2. Has viewed at least one section OR has any completed sections
    const hasStarted = progress.currentSectionIndex > 0 || progress.completedSectionIndices.length > 0;
    const notCompleted = !progress.isStoryCompleted;
    
    return hasStarted && notCompleted;
  } catch {
    return false;
  }
}

// ============ Mini-Game Functions ============

function minigameKey(slug: string, checkpoint: number) {
  return `${MINIGAME_PREFIX}:${slug}:${checkpoint}`;
}

function minigameXPKey(slug: string) {
  return `${MINIGAME_XP_PREFIX}:${slug}`;
}

/**
 * Check if a mini-game has been played after a checkpoint.
 */
export function isMiniGamePlayed(slug: string, checkpoint: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(minigameKey(slug, checkpoint));
    return raw === "played";
  } catch {
    return false;
  }
}

/**
 * Mark a mini-game as played.
 */
export function markMiniGamePlayed(slug: string, checkpoint: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(minigameKey(slug, checkpoint), "played");
    window.dispatchEvent(new Event("story-progress-updated"));
  } catch {
    // ignore
  }
}

/**
 * Add XP from mini-games to the story's total XP.
 */
export function addMiniGameXP(slug: string, xp: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(minigameXPKey(slug));
    const current = raw ? parseInt(raw, 10) : 0;
    const validCurrent = Number.isFinite(current) && current >= 0 ? current : 0;
    const newTotal = validCurrent + xp;
    window.localStorage.setItem(minigameXPKey(slug), String(newTotal));
    window.dispatchEvent(new Event("story-progress-updated"));
  } catch {
    // ignore
  }
}

/**
 * Get total XP earned from mini-games for a story.
 */
export function getMiniGameXP(slug: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(minigameXPKey(slug));
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

// ============ Minigame Difficulty & Outcome Functions ============

function minigameLevelKey(slug: string, checkpoint: number) {
  return `${MINIGAME_PREFIX}:${slug}:${checkpoint}:level`;
}

function minigameOutcomeKey(slug: string, checkpoint: number) {
  return `${MINIGAME_PREFIX}:${slug}:${checkpoint}:outcome`;
}

/**
 * Get the difficulty level for a minigame at a checkpoint.
 * Defaults to "easy" if not previously set.
 */
export function getMinigameLevel(slug: string, checkpoint: number): "easy" | "medium" | "hard" {
  if (typeof window === "undefined") return "easy";
  try {
    const raw = window.localStorage.getItem(minigameLevelKey(slug, checkpoint));
    if (raw === "easy" || raw === "medium" || raw === "hard") {
      return raw;
    }
    return "easy";
  } catch {
    return "easy";
  }
}

/**
 * Set the difficulty level for a minigame at a checkpoint.
 */
export function setMinigameLevel(slug: string, checkpoint: number, level: "easy" | "medium" | "hard") {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(minigameLevelKey(slug, checkpoint), level);
    window.dispatchEvent(new Event("story-progress-updated"));
  } catch {
    // ignore
  }
}

/**
 * Get the outcome of a minigame attempt at a checkpoint.
 * Returns "won", "lost", or null if not yet played.
 */
export function getMinigameOutcome(slug: string, checkpoint: number): "won" | "lost" | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(minigameOutcomeKey(slug, checkpoint));
    if (raw === "won" || raw === "lost") {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Set the outcome of a minigame attempt at a checkpoint.
 */
export function setMinigameOutcome(slug: string, checkpoint: number, outcome: "won" | "lost") {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(minigameOutcomeKey(slug, checkpoint), outcome);
    window.dispatchEvent(new Event("story-progress-updated"));
  } catch {
    // ignore
  }
}

