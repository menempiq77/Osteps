"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Difficulty } from "./miniGameConfig";

type Item = { emoji: string; label: string };

type Props = {
  temptations: Item[];
  virtues: Item[];
  theme: string;
  difficulty?: Difficulty;
  onComplete: (won: boolean) => void;
};

const GAME_DURATION_EASY = 120;
const GAME_DURATION_MEDIUM = 105;
const GAME_DURATION_HARD = 90;
const TARGET_SCORE_EASY = 8;
const TARGET_SCORE_MEDIUM = 10;
const TARGET_SCORE_HARD = 12;
const LIVES_EASY = 3;
const LIVES_MEDIUM = 3;
const LIVES_HARD = 2;

export default function WhackGameClient({ temptations, virtues, theme, difficulty = "easy", onComplete }: Props) {
  const TARGET_SCORE = difficulty === "easy" ? TARGET_SCORE_EASY : difficulty === "medium" ? TARGET_SCORE_MEDIUM : TARGET_SCORE_HARD;
  const INITIAL_LIVES = difficulty === "easy" ? LIVES_EASY : difficulty === "medium" ? LIVES_MEDIUM : LIVES_HARD;
  const GAME_DURATION = difficulty === "easy" ? GAME_DURATION_EASY : difficulty === "medium" ? GAME_DURATION_MEDIUM : GAME_DURATION_HARD;
  const SPAWN_INTERVAL_MS = difficulty === "easy" ? 1000 : difficulty === "medium" ? 850 : 700;
  const MAX_ACTIVE = difficulty === "easy" ? 4 : difficulty === "medium" ? 5 : 6;
  const TEMPTATION_WEIGHT = difficulty === "easy" ? 0.55 : difficulty === "medium" ? 0.6 : 0.65;

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [activeSlots, setActiveSlots] = useState<Array<{ id: number; item: Item; isBad: boolean }>>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const nextId = useRef(0);

  const spawnPool = useMemo(() => {
    return [
      ...temptations.map((t) => ({ ...t, isBad: true })),
      ...virtues.map((v) => ({ ...v, isBad: false })),
    ];
  }, [temptations, virtues]);

  useEffect(() => {
    if (gameEnded) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameEnded(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameEnded]);

  useEffect(() => {
    if (gameEnded) return;
    const interval = setInterval(() => {
      setActiveSlots((prev) => {
        const next = [...prev];
        if (next.length > MAX_ACTIVE) next.shift();

        const pickPool = Math.random() < TEMPTATION_WEIGHT ? temptations : virtues;
        const pick = pickPool[Math.floor(Math.random() * pickPool.length)];
        next.push({ id: nextId.current++, item: pick, isBad: (pick as any).isBad });
        return next;
      });
    }, SPAWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [gameEnded, MAX_ACTIVE, SPAWN_INTERVAL_MS, TEMPTATION_WEIGHT, spawnPool, temptations, virtues]);

  useEffect(() => {
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setLives(INITIAL_LIVES);
    setActiveSlots([]);
    setGameEnded(false);
    nextId.current = 0;
  }, [difficulty, GAME_DURATION, INITIAL_LIVES]);

  const handleWhack = (slotId: number, isBad: boolean) => {
    if (gameEnded) return;
    setActiveSlots((prev) => prev.filter((s) => s.id !== slotId));

    if (isBad) {
      setScore((s) => {
        const nextScore = s + 1;
        if (nextScore >= TARGET_SCORE) {
          setTimeout(() => setGameEnded(true), 0);
        }
        return nextScore;
      });
      return;
    }

    setLives((l) => {
      const nextLives = Math.max(0, l - 1);
      if (nextLives === 0) {
        setTimeout(() => setGameEnded(true), 0);
      }
      return nextLives;
    });
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const showWin = score >= TARGET_SCORE;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-800">Whack-a-Temptation</h2>
        <p className="text-gray-600">{theme}</p>
      </div>

      <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between text-sm font-bold">
          <span className="text-amber-700">Score: {score}/{TARGET_SCORE}</span>
          <span className="text-red-600">Lives: {"❤".repeat(Math.max(0, lives)) || "0"}</span>
          <span className="text-amber-700">Time: {formatTime(timeLeft)}</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {activeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleWhack(slot.id, slot.isBad)}
              className={`flex h-20 items-center justify-center rounded-xl border-2 text-3xl font-bold transition ${
                slot.isBad ? "border-red-300 bg-red-50 hover:bg-red-100" : "border-green-200 bg-green-50 hover:bg-green-100"
              }`}
            >
              {slot.item.emoji}
            </button>
          ))}
        </div>
      </div>

      {gameEnded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
            <div className="mb-3 text-5xl">{showWin ? "🎉" : "⏰"}</div>
            <h3 className="mb-2 text-2xl font-bold">{showWin ? "Great job!" : "Time's up"}</h3>
            <p className="mb-4 text-sm text-gray-600">Score: {score} | Lives: {Math.max(0, lives)}</p>
            <p className="mb-4 text-xl font-bold text-amber-600">{showWin ? "+30 XP" : "+15 XP"}</p>
            <button
              onClick={() => onComplete(showWin)}
              className="inline-flex justify-center rounded-lg bg-amber-500 px-5 py-3 font-bold text-white shadow hover:bg-amber-600"
            >
              Continue Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
