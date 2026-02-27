"use client";

import { useEffect, useMemo, useState } from "react";
import { Difficulty } from "./miniGameConfig";

type Props = {
  tiles: number[];
  difficulty?: Difficulty;
  onComplete: (won: boolean) => void;
};

const GAME_DURATION = 120;

function isSolved(arr: number[]) {
  return arr.every((v, i) => (i === arr.length - 1 ? v === 0 : v === i + 1));
}

export default function TileSliderClient({ tiles, difficulty = "easy", onComplete }: Props) {
  const [board, setBoard] = useState<number[]>(tiles);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [moves, setMoves] = useState(0);
  const [ended, setEnded] = useState(false);

  const emptyIndex = useMemo(() => board.indexOf(0), [board]);

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

  const tryMove = (idx: number) => {
    if (ended) return;
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const erow = Math.floor(emptyIndex / 3);
    const ecol = emptyIndex % 3;
    const canMove = (Math.abs(row - erow) + Math.abs(col - ecol)) === 1;
    if (!canMove) return;
    setBoard((prev) => {
      const next = [...prev];
      [next[idx], next[emptyIndex]] = [next[emptyIndex], next[idx]];
      if (isSolved(next)) {
        setTimeout(() => setEnded(true), 0);
      }
      return next;
    });
    setMoves((m) => m + 1);
  };

  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const win = isSolved(board);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-800">Tile Slider 🧩</h2>
        <p className="text-gray-600">Arrange the tiles in order</p>
      </div>

      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow">
        <div className="mb-3 flex items-center justify-between text-sm font-bold">
          <span className="text-blue-700">Moves: {moves}</span>
          <span className="text-amber-700">Time: {format(timeLeft)}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {board.map((val, idx) => (
            <button
              key={idx}
              onClick={() => tryMove(idx)}
              className={`flex h-20 items-center justify-center rounded-lg border text-xl font-bold transition ${
                val === 0
                  ? "border-dashed border-gray-300 bg-gray-50 text-gray-400"
                  : "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-400"
              }`}
            >
              {val !== 0 ? val : ""}
            </button>
          ))}
        </div>
      </div>

      {ended && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center shadow-lg">
            <div className="text-5xl mb-3">{win ? "🎉" : "⏰"}</div>
            <h3 className="text-2xl font-bold mb-2">{win ? "Tiles solved!" : "Time's up"}</h3>
            <p className="text-xl font-bold text-amber-600 mb-4">{win ? "+30 XP" : "+15 XP"}</p>
            <button
              onClick={() => onComplete(win)}
              className="inline-flex justify-center rounded-lg bg-blue-600 px-5 py-3 font-bold text-white shadow hover:bg-blue-700"
            >
              Continue Story →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
