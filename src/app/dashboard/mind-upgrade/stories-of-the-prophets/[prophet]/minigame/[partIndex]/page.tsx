"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDifficultyContent } from "@/components/stories/miniGameContent";
import { resolveMiniGame } from "@/components/stories/miniGameConfig";
import { markMiniGamePlayed, addMiniGameXP, getMinigameLevel, setMinigameLevel, setMinigameOutcome } from "@/components/stories/storyProgress";
import type { Difficulty } from "@/components/stories/miniGameConfig";
import { inferCourseKeyFromSlug, submitMindMiniGameCompletion } from "@/services/mindUpgradeApi";

type PageProps = {
  params: Promise<{ prophet: string; partIndex: string }>;
};

export default function ProphetMiniGamePage({ params }: PageProps) {
  const resolved = useMemo(() => params, [params]);
  const { prophet, partIndex } = use(resolved);
  const router = useRouter();
  const checkpoint = useMemo(() => parseInt(partIndex, 10), [partIndex]);
  // Use lazy initialization to avoid setState in useEffect
  const [difficulty, setDifficulty] = useState<Difficulty>(() => 
    getMinigameLevel(prophet, checkpoint)
  );

  let entry;
  let meta;
  try {
    if (!prophet || !Number.isFinite(checkpoint)) {
      throw new Error("Invalid minigame route parameters.");
    }
    const result = resolveMiniGame(prophet, checkpoint);
    entry = result.entry;
    meta = result.meta;
  } catch (error) {
    console.error("Error resolving minigame:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-red-600">Error Loading Game</h1>
          <p className="mt-3 text-gray-700">{String(error)}</p>
        </div>
      </div>
    );
  }

  const handleGameComplete = (won: boolean) => {
    // Record outcome
    setMinigameOutcome(prophet, checkpoint, won ? "won" : "lost");
    
    // Award XP
    const xpAmount = won ? 30 : 15;
    addMiniGameXP(prophet, xpAmount);
    const courseKey = "stories_of_the_prophets";
    void submitMindMiniGameCompletion({
      course_key: courseKey,
      unit_key: `${courseKey}:${prophet}:checkpoint-${checkpoint}:minigame`,
      xp: xpAmount,
    }).catch(() => {
      // Non-blocking: learning flow continues, event is queued for retry.
    });
    
    if (won) {
      // Advance difficulty or mark complete
      const nextLevel = difficulty === "easy" ? "medium" : difficulty === "medium" ? "hard" : difficulty;
      setMinigameLevel(prophet, checkpoint, nextLevel);
      
      if (difficulty === "hard") {
        // Already at hard and won, mark as played and go back
        markMiniGamePlayed(prophet, checkpoint);
        router.push(`/dashboard/mind-upgrade/stories-of-the-prophets/${prophet}`);
      } else {
        // Won at easy or medium, update difficulty state to show next level
        setDifficulty(nextLevel);
      }
    } else {
      // Loss: go back to story
      markMiniGamePlayed(prophet, checkpoint);
      router.push(`/dashboard/mind-upgrade/stories-of-the-prophets/${prophet}`);
    }
  };

  // Get difficulty-specific content with prophet-specific theming
  const difficultyContent = getDifficultyContent(difficulty, prophet);

  const renderGame = () => {
    try {
      return entry.render({ 
        content: difficultyContent, 
        difficulty,
        onComplete: handleGameComplete, 
        slug: prophet, 
        checkpoint 
      });
    } catch (error) {
      console.error("Error rendering game:", error);
      return (
        <div className="text-center p-8 text-red-600">
          <p>Error rendering game: {String(error)}</p>
        </div>
      );
    }
  };

  const difficultyLabel =
    difficulty === "easy" ? "Level 1" : difficulty === "medium" ? "Level 2" : "Level 3";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {meta.icon} Checkpoint {checkpoint} Reward!
          </h1>
          <div className="text-2xl mb-3">{difficultyLabel}</div>
          <p className="text-lg text-gray-600">Great job completing the checkpoint! Here's a fun game for you!</p>
        </div>
        {renderGame()}
      </div>
    </div>
  );
}
