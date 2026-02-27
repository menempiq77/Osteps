"use client";

import { useEffect, useRef, useState } from "react";
import { Difficulty } from "./miniGameConfig";

type Props = {
  prompts: string[];
  difficulty?: Difficulty;
  onComplete: (won: boolean) => void;
};

const GAME_DURATION = 120;

export default function QuickTapClient({ prompts, difficulty = "easy", onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [ended, setEnded] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [current]);

  useEffect(() => {
    if (ended) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setEnded(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ended]);

  const handleInput = (value: string) => {
    if (ended) return;
    const target = prompts[current];
    if (!target) return;
    if (value.trim().toLowerCase() === target.toLowerCase()) {
      const nextCurrent = current + 1;
      setScore((s) => s + 1);
      setFeedback("Nice!");
      setCurrent(nextCurrent);
      inputRef.current!.value = "";
      if (nextCurrent >= prompts.length) {
        setEnded(true);
      }
    } else {
      setFeedback("Try again");
    }
  };

  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const win = current >= prompts.length;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-amber-800">Quick Tap ⚡</h2>
        <p className="text-gray-600">Type the prompt quickly</p>
      </div>

      <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow">
        <div className="mb-3 flex items-center justify-between text-sm font-bold">
          <span className="text-amber-700">Score: {score}</span>
          <span className="text-indigo-700">Time: {format(timeLeft)}</span>
        </div>

        <div className="mb-4 text-center text-lg font-bold text-gray-800">
          {prompts[current] ? `Type: "${prompts[current]}"` : "All prompts done!"}
        </div>

        <input
          ref={inputRef}
          type="text"
          className="w-full rounded-lg border px-4 py-3 text-lg focus:border-amber-400 focus:outline-none"
          placeholder="Type here..."
          onChange={(e) => handleInput(e.target.value)}
        />
        {feedback && <p className="mt-2 text-sm text-gray-600">{feedback}</p>}
      </div>

      {ended && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center shadow-lg">
            <div className="text-5xl mb-3">{win ? "🎉" : "⏰"}</div>
            <h3 className="text-2xl font-bold mb-2">{win ? "Quick fingers!" : "Time's up"}</h3>
            <p className="text-xl font-bold text-amber-600 mb-4">{win ? "+30 XP" : "+15 XP"}</p>
            <button
              onClick={() => onComplete(win)}
              className="inline-flex justify-center rounded-lg bg-amber-500 px-5 py-3 font-bold text-white shadow hover:bg-amber-600"
            >
              Continue Story →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
