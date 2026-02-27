"use client";

import { useEffect, useRef, useState } from "react";
import { Difficulty } from "./miniGameConfig";

type Item = { emoji: string; label: string };

type CatchGameProps = {
  goodItems: Item[];
  badItems: Item[];
  theme: string;
  difficulty?: Difficulty;
  onComplete: (won: boolean) => void;
};

type FallingItem = {
  id: number;
  item: Item;
  x: number;
  y: number;
  speed: number;
  isGood: boolean;
};

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const BASKET_WIDTH = 60;
const BASKET_HEIGHT = 60;
const ITEM_SIZE = 40;
const TARGET_SCORE_EASY = 15;
const TARGET_SCORE_MEDIUM = 20;
const TARGET_SCORE_HARD = 25;
const LIVES_EASY = 3;
const LIVES_MEDIUM = 3;
const LIVES_HARD = 2;
const GAME_DURATION = 120; // 2 minutes in seconds

export default function CatchGameClient({
  goodItems,
  badItems,
  theme,
  difficulty = "easy",
  onComplete,
}: CatchGameProps) {
  const TARGET_SCORE = difficulty === "easy" ? TARGET_SCORE_EASY : difficulty === "medium" ? TARGET_SCORE_MEDIUM : TARGET_SCORE_HARD;
  const INITIAL_LIVES = difficulty === "easy" ? LIVES_EASY : difficulty === "medium" ? LIVES_MEDIUM : LIVES_HARD;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const nextItemIdRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || gameWon) return;
      keysPressed.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, gameWon]);

  // Touch/Mouse controls
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameOver || gameWon) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = ((clientX - rect.left) / rect.width) * GAME_WIDTH;
    const newX = Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, x - BASKET_WIDTH / 2));
    setBasketX(newX);
  };

  // Spawn falling items
  useEffect(() => {
    if (gameOver || gameWon) return;

    spawnTimerRef.current = setInterval(() => {
      const isGood = Math.random() > 0.3; // 70% good items, 30% bad
      const items = isGood ? goodItems : badItems;
      const item = items[Math.floor(Math.random() * items.length)];

      const newItem: FallingItem = {
        id: nextItemIdRef.current++,
        item,
        x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
        y: -ITEM_SIZE,
        speed: 2 + Math.random() * 2,
        isGood,
      };

      setFallingItems((prev) => [...prev, newItem]);
    }, 1000);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameOver, gameWon, goodItems, badItems]);

  // Game loop
  useEffect(() => {
    if (gameOver || gameWon) return;

    const updateGame = () => {
      // Update basket position from keyboard
      setBasketX((x) => {
        let newX = x;
        if (keysPressed.current.has("ArrowLeft") || keysPressed.current.has("a")) {
          newX -= 8;
        }
        if (keysPressed.current.has("ArrowRight") || keysPressed.current.has("d")) {
          newX += 8;
        }
        return Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, newX));
      });

      // Update falling items
      setFallingItems((items) => {
        const updated: FallingItem[] = [];

        items.forEach((item) => {
          const newY = item.y + item.speed;

          // Check collision with basket
          if (
            newY + ITEM_SIZE >= GAME_HEIGHT - BASKET_HEIGHT &&
            newY <= GAME_HEIGHT &&
            item.x + ITEM_SIZE > basketX &&
            item.x < basketX + BASKET_WIDTH
          ) {
            if (item.isGood) {
              setScore((s) => {
                const newScore = s + 1;
                if (newScore >= TARGET_SCORE) {
                  setGameWon(true);
                }
                return newScore;
              });
            } else {
              setLives((l) => {
                const newLives = Math.max(0, l - 1);
                if (newLives === 0) {
                  setGameOver(true);
                }
                return newLives;
              });
            }
            // Item caught, don't add to updated list
          } else if (newY > GAME_HEIGHT) {
            // Item missed - only lose life if it was a good item
            if (item.isGood) {
              setLives((l) => {
                const newLives = Math.max(0, l - 1);
                if (newLives === 0) {
                  setGameOver(true);
                }
                return newLives;
              });
            }
            // Item fell off screen, don't add to updated list
          } else {
            // Item still falling
            updated.push({ ...item, y: newY });
          }
        });

        return updated;
      });

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameOver, gameWon, basketX]);

  // Timer countdown
  useEffect(() => {
    if (gameWon || gameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameWon, gameOver]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, "#dbeafe");
    gradient.addColorStop(1, "#bfdbfe");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw falling items
    ctx.font = `${ITEM_SIZE}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    fallingItems.forEach((item) => {
      ctx.fillText(
        item.item.emoji,
        item.x + ITEM_SIZE / 2,
        item.y + ITEM_SIZE / 2
      );
    });

    // Draw basket
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(basketX, GAME_HEIGHT - BASKET_HEIGHT, BASKET_WIDTH, BASKET_HEIGHT);
    
    // Draw basket emoji
    ctx.font = `${BASKET_WIDTH - 10}px Arial`;
    ctx.fillText("🧺", basketX + BASKET_WIDTH / 2, GAME_HEIGHT - BASKET_HEIGHT / 2);
  }, [fallingItems, basketX]);

  const handlePlayAgain = () => {
    setBasketX(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
    setFallingItems([]);
    setScore(0);
    setLives(INITIAL_LIVES);
    setGameWon(false);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    nextItemIdRef.current = 0;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Catch Game! 🧺</h2>
        <p className="text-gray-600">{theme}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="font-bold text-green-700">Score:</span> {score}/{TARGET_SCORE}
          </div>
          <div className="text-sm">
            <span className="font-bold text-blue-600">Difficulty:</span> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
          <div className="text-sm">
            <span className="font-bold text-red-600">Lives:</span> {"❤️".repeat(lives)}
          </div>
          <div className="text-sm">
            <span className="font-bold text-amber-600">Time:</span> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-around text-center text-sm">
            <div>
              <div className="text-2xl mb-1">✅</div>
              <div className="text-green-700 font-medium">Catch Good Deeds</div>
            </div>
            <div>
              <div className="text-2xl mb-1">❌</div>
              <div className="text-red-700 font-medium">Avoid Bad Deeds</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            className="border-2 border-blue-300 rounded-lg cursor-none touch-none"
            onMouseMove={handlePointerMove}
            onTouchMove={handlePointerMove}
          />
        </div>

        <div className="text-xs text-center text-gray-500 space-y-1">
          <p>🖥️ Desktop: Arrow keys or AD • 📱 Mobile: Slide finger</p>
          <p>💡 Catch good deeds, avoid bad ones!</p>
        </div>
      </div>

      {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-green-600 mb-4">
              Fantastic Job!
            </h3>
            <p className="text-lg mb-2">
              You caught {score} good deeds!
            </p>
            <p className="text-2xl font-bold text-amber-600 mb-6">+30 XP</p>
            <button
              onClick={() => onComplete(true)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-semibold"
            >
              Continue Story →
            </button>
          </div>
        </div>
      )}

      {gameOver && !gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-3xl font-bold text-red-600 mb-4">
              Game Over!
            </h3>
            <p className="text-lg mb-4">
              Score: {score}/{TARGET_SCORE}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
              <button
                onClick={() => onComplete(false)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Continue Story (+15 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
