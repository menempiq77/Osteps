"use client";

import { useEffect, useMemo, useState } from "react";
import { Difficulty } from "./miniGameConfig";

type Props = {
  words: string[];
  letters: string[];
  theme: string;
  difficulty?: Difficulty;
  onComplete: (won: boolean) => void;
};

const GAME_DURATION = 120;

export default function WordSearchClient({ words, letters, theme, difficulty = "easy", onComplete }: Props) {
  const GRID_SIZE = Math.sqrt(letters.length);
  
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [ended, setEnded] = useState(false);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState<Set<number>>(new Set());

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

  const grid = useMemo(() => letters, [letters]);

  const checkWord = (indices: number[]) => {
    if (indices.length < 2) return null;
    
    const selectedWord = indices.map(i => grid[i]).join('');
    
    // Check if the selected word matches any of the target words (case-insensitive)
    for (const word of words) {
      if (selectedWord.toLowerCase() === word.toLowerCase() || 
          selectedWord.toLowerCase() === word.split('').reverse().join('').toLowerCase()) {
        return word;
      }
    }
    return null;
  };

  const handleStart = (index: number) => {
    if (ended) return;
    setIsSelecting(true);
    setSelectedCells([index]);
  };

  const handleMove = (index: number) => {
    if (!isSelecting || ended || selectedCells.length === 0) return;
    
    const firstIndex = selectedCells[0];
    if (firstIndex === index) return;
    
    const firstRow = Math.floor(firstIndex / GRID_SIZE);
    const firstCol = firstIndex % GRID_SIZE;
    const currentRow = Math.floor(index / GRID_SIZE);
    const currentCol = index % GRID_SIZE;
    
    const rowDiff = currentRow - firstRow;
    const colDiff = currentCol - firstCol;
    
    // Check if it's in a straight line (horizontal, vertical, or diagonal)
    const isHorizontal = rowDiff === 0 && colDiff !== 0;
    const isVertical = colDiff === 0 && rowDiff !== 0;
    const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff !== 0;
    
    if (isHorizontal || isVertical || isDiagonal) {
      const path = [firstIndex];
      const stepRow = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
      const stepCol = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;
      
      let r = firstRow + stepRow;
      let c = firstCol + stepCol;
      
      while ((r !== currentRow || c !== currentCol) && r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        path.push(r * GRID_SIZE + c);
        r += stepRow;
        c += stepCol;
      }
      
      if (r === currentRow && c === currentCol) {
        path.push(index);
        setSelectedCells(path);
      }
    }
  };

  const handleEnd = () => {
    if (!isSelecting || ended) return;
    setIsSelecting(false);
    
    const matchedWord = checkWord(selectedCells);
    
    if (matchedWord && !found.has(matchedWord)) {
      setFound((prev) => {
        const next = new Set(prev);
        next.add(matchedWord);
        return next;
      });
      
      setHighlightedCells((prev) => {
        const newHighlighted = new Set(prev);
        selectedCells.forEach(i => newHighlighted.add(i));
        return newHighlighted;
      });
      
      if (found.size + 1 >= words.length) {
        setTimeout(() => setEnded(true), 500);
      }
    }
    
    setSelectedCells([]);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleEnd();
      }
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isSelecting, selectedCells, found, ended]);

  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const win = found.size === words.length;

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-indigo-800">Word Search 🔍</h2>
        <p className="text-gray-600">{theme}</p>
        <p className="text-sm text-gray-500 mt-2">Click and drag to select letters</p>
      </div>

      <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between text-sm font-bold">
          <span className="text-indigo-700">Found: {found.size}/{words.length}</span>
          <span className="text-amber-700">Time: {format(timeLeft)}</span>
        </div>

        <div 
          className="grid gap-1 mb-4 select-none"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {grid.map((c, i) => {
            const isSelected = selectedCells.includes(i);
            const isHighlighted = highlightedCells.has(i);
            
            return (
              <div
                key={i}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleStart(i);
                }}
                onMouseEnter={() => handleMove(i)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleStart(i);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  if (element) {
                    const index = parseInt(element.getAttribute('data-index') || '-1');
                    if (index >= 0) handleMove(index);
                  }
                }}
                data-index={i}
                className={`flex h-12 items-center justify-center rounded border text-sm font-bold cursor-pointer transition-colors touch-none ${
                  isHighlighted
                    ? "bg-green-200 border-green-400 text-green-900"
                    : isSelected
                    ? "bg-indigo-300 border-indigo-500 text-indigo-900"
                    : "bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100"
                }`}
              >
                {c}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-gray-700 mb-2">Words to Find:</div>
          <div className="grid grid-cols-2 gap-2">
            {words.map((w) => {
              const isFound = found.has(w);
              return (
                <div
                  key={w}
                  className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${
                    isFound ? "border-green-400 bg-green-50 text-green-800" : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  {isFound ? "✓ " : ""}
                  {w}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {ended && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center shadow-lg">
            <div className="text-5xl mb-3">{win ? "🎉" : "⏰"}</div>
            <h3 className="text-2xl font-bold mb-2">{win ? "All words found!" : "Time's up"}</h3>
            <p className="text-xl font-bold text-amber-600 mb-4">{win ? "+30 XP" : "+15 XP"}</p>
            <button
              onClick={() => onComplete(win)}
              className="inline-flex justify-center rounded-lg bg-indigo-500 px-5 py-3 font-bold text-white shadow hover:bg-indigo-600"
            >
              Continue Story →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
