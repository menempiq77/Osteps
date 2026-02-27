"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { getDifficultyContent } from "@/components/stories/miniGameContent";
import { resolveMiniGame } from "@/components/stories/miniGameConfig";
import { markMiniGamePlayed, addMiniGameXP, getMinigameLevel, setMinigameLevel, setMinigameOutcome } from "@/components/stories/storyProgress";
import type { Difficulty } from "@/components/stories/miniGameConfig";

type PageProps = {
  params: Promise<{ topic: string; checkpointNum: string }>;
};

export default function AqeedahMiniGamePage({ params }: PageProps) {
  const { topic, checkpointNum } = use(params);
  const router = useRouter();
  const checkpoint = parseInt(checkpointNum, 10);
  // Use lazy initialization to avoid setState in useEffect
  const [difficulty, setDifficulty] = useState<Difficulty>(() => 
    getMinigameLevel(topic, checkpoint)
  );

  let entry;
  let meta;
  try {
    const result = resolveMiniGame(topic, checkpoint);
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
    setMinigameOutcome(topic, checkpoint, won ? "won" : "lost");
    
    // Award XP
    const xpAmount = won ? 30 : 15;
    addMiniGameXP(topic, xpAmount);
    
    if (won) {
      // Advance difficulty or mark complete
      const nextLevel = difficulty === "easy" ? "medium" : difficulty === "medium" ? "hard" : difficulty;
      setMinigameLevel(topic, checkpoint, nextLevel);
      
      if (difficulty === "hard") {
        // Already at hard and won, mark as played and go back
        markMiniGamePlayed(topic, checkpoint);
        router.push(`/dashboard/mind-upgrade/aqeedah/${topic}`);
      } else {
        // Won at easy or medium, update difficulty state to show next level
        setDifficulty(nextLevel);
      }
    } else {
      // Loss: go back to story
      markMiniGamePlayed(topic, checkpoint);
      router.push(`/dashboard/mind-upgrade/aqeedah/${topic}`);
    }
  };

  // Get difficulty-specific content
  const difficultyContent = getDifficultyContent(difficulty);

  const renderGame = () => {
    try {
      return entry.render({ 
        content: difficultyContent, 
        difficulty,
        onComplete: handleGameComplete, 
        slug: topic, 
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

  const difficultyEmoji = difficulty === "easy" ? "⭐" : difficulty === "medium" ? "⭐⭐" : "⭐⭐⭐";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {meta.icon} Checkpoint {checkpoint} Reward!
          </h1>
          <div className="text-2xl mb-3">{difficultyEmoji}</div>
          <p className="text-lg text-gray-600">Great job completing the checkpoint! Here's a fun game for you!</p>
        </div>
        {renderGame()}
      </div>
    </div>
  );
}
