"use client";

import { useEffect, useMemo, useState } from "react";
import { Difficulty } from "./miniGameConfig";

type Props = {
  grid: string[];
  difficulty?: Difficulty;
  onComplete: (won: boolean) => void;
};

const GAME_DURATION = 120;

function findIndex(grid: string[], target: string) {
  return grid.indexOf(target);
}

export default function PathMazeClient({ grid, difficulty = "easy", onComplete }: Props) {
  const [cells] = useState(grid);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [ended, setEnded] = useState(false);
  const BOARD_SIZE = useMemo(() => {
    const size = Math.sqrt(cells.length);
    return Number.isInteger(size) ? size : 6;
  }, [cells.length]);
  const startIndex = useMemo(() => findIndex(cells, "S"), [cells]);
  const endIndex = useMemo(() => findIndex(cells, "E"), [cells]);
  const [player, setPlayer] = useState(startIndex);

  useEffect(() => {
    setPlayer(startIndex);
  }, [startIndex]);

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

  useEffect(() => {
    if (player === endIndex) {
      setEnded(true);
    }
  }, [player, endIndex]);

  const move = (dr: number, dc: number) => {
    if (ended) return;
    const row = Math.floor(player / BOARD_SIZE);
    const col = player % BOARD_SIZE;
    const nr = row + dr;
    const nc = col + dc;
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) return;
    const nextIndex = nr * BOARD_SIZE + nc;
    if (cells[nextIndex] === "#") return;
    setPlayer(nextIndex);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keyMap: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        w: [-1, 0],
        ArrowDown: [1, 0],
        s: [1, 0],
        ArrowLeft: [0, -1],
        a: [0, -1],
        ArrowRight: [0, 1],
        d: [0, 1],
      };
      const delta = keyMap[e.key];
      if (!delta) return;
      e.preventDefault();
      move(delta[0], delta[1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ended, player, BOARD_SIZE, cells]);

  const win = player === endIndex;
  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-800">Path Maze 🧭</h2>
        <p className="text-gray-600">Reach the exit without hitting walls</p>
      </div>

      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow">
        <div className="mb-3 flex items-center justify-between text-sm font-bold">
          <span className="text-emerald-700">Position: {player + 1}</span>
          <span className="text-amber-700">Time: {format(timeLeft)}</span>
        </div>

        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}>
          {cells.map((cell, idx) => {
            const isPlayer = idx === player;
            const isEnd = idx === endIndex;
            const isStart = idx === startIndex;
            const base = cell === "#" ? "bg-gray-800" : "bg-emerald-50";
            const special = isPlayer
              ? "bg-emerald-500 text-white"
              : isEnd
                ? "bg-amber-400 text-white"
                : isStart
                  ? "bg-sky-400 text-white"
                  : base;
            return (
              <div
                key={idx}
                className={`flex h-12 items-center justify-center rounded text-lg font-bold ${special}`}
              >
                {isPlayer ? "•" : cell === "#" ? "" : cell === "S" ? "S" : cell === "E" ? "E" : ""}
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <button onClick={() => move(-1, 0)} className="rounded bg-emerald-100 px-3 py-2 font-bold text-emerald-800 hover:bg-emerald-200">Up</button>
          <button onClick={() => move(0, -1)} className="rounded bg-emerald-100 px-3 py-2 font-bold text-emerald-800 hover:bg-emerald-200">Left</button>
          <button onClick={() => move(0, 1)} className="rounded bg-emerald-100 px-3 py-2 font-bold text-emerald-800 hover:bg-emerald-200">Right</button>
          <button onClick={() => move(1, 0)} className="col-span-3 rounded bg-emerald-100 px-3 py-2 font-bold text-emerald-800 hover:bg-emerald-200">Down</button>
        </div>
      </div>

      {ended && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center shadow-lg">
            <div className="text-5xl mb-3">{win ? "🎉" : "⏰"}</div>
            <h3 className="text-2xl font-bold mb-2">{win ? "Maze cleared!" : "Time's up"}</h3>
            <p className="text-xl font-bold text-amber-600 mb-4">{win ? "+30 XP" : "+15 XP"}</p>
            <button
              onClick={() => onComplete(win)}
              className="inline-flex justify-center rounded-lg bg-emerald-600 px-5 py-3 font-bold text-white shadow hover:bg-emerald-700"
            >
              Continue Story →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
