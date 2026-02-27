"use client";

import { useEffect, useRef, useState } from "react";
import { Difficulty } from "./miniGameConfig";

type Collectible = { emoji: string; label: string };

type SnakeGameProps = {
  collectibles: Collectible[];
  theme: string;
  difficulty?: Difficulty;
  onComplete: (won: boolean) => void;
};

type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED_EASY = 200;
const INITIAL_SPEED_MEDIUM = 150;
const INITIAL_SPEED_HARD = 100;
const TARGET_EASY = 10;
const TARGET_MEDIUM = 10;
const TARGET_HARD = 12;
const GAME_DURATION = 120; // 2 minutes in seconds

export default function SnakeGameClient({
  collectibles,
  theme,
  difficulty = "easy",
  onComplete,
}: SnakeGameProps) {
  const INITIAL_SPEED = difficulty === "easy" ? INITIAL_SPEED_EASY : difficulty === "medium" ? INITIAL_SPEED_MEDIUM : INITIAL_SPEED_HARD;
  const TARGET = difficulty === "easy" ? TARGET_EASY : difficulty === "medium" ? TARGET_MEDIUM : TARGET_HARD;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [currentCollectible, setCurrentCollectible] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<Position | null>(null);

  const nextDirectionRef = useRef<Position>({ x: 1, y: 0 });
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random food position
  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || gameWon) return;

      const currentDir = nextDirectionRef.current;
      
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: -1 };
          }
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir.y === 0) {
            nextDirectionRef.current = { x: 0, y: 1 };
          }
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir.x === 0) {
            nextDirectionRef.current = { x: -1, y: 0 };
          }
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir.x === 0) {
            nextDirectionRef.current = { x: 1, y: 0 };
          }
          e.preventDefault();
          break;
        case " ":
          setIsPaused((p) => !p);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver, gameWon]);

  // Handle touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || gameOver || gameWon) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const currentDir = nextDirectionRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 30 && currentDir.x === 0) {
        nextDirectionRef.current = { x: 1, y: 0 };
      } else if (deltaX < -30 && currentDir.x === 0) {
        nextDirectionRef.current = { x: -1, y: 0 };
      }
    } else {
      // Vertical swipe
      if (deltaY > 30 && currentDir.y === 0) {
        nextDirectionRef.current = { x: 0, y: 1 };
      } else if (deltaY < -30 && currentDir.y === 0) {
        nextDirectionRef.current = { x: 0, y: -1 };
      }
    }

    setTouchStart(null);
  };

  // Game loop
  useEffect(() => {
    if (gameOver || gameWon || isPaused) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + nextDirectionRef.current.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirectionRef.current.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }TARGET

        const newSnake = [newHead, ...prevSnake];

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          
          if (score + 1 >= collectibles.length) {
            setGameWon(true);
          } else {
            setCurrentCollectible((c) => c + 1);
            generateFood();
          }
          
          return newSnake; // Snake grows
        }

        newSnake.pop(); // Remove tail
        return newSnake;
      });
    }, INITIAL_SPEED);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, gameWon, isPaused, food, score, collectibles.length]);

  // Timer countdown
  useEffect(() => {
    if (gameOver || gameWon || isPaused) return;

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
  }, [gameOver, gameWon, isPaused]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#f0fdf4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#dcfce7";
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#16a34a" : "#22c55e";
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Draw food (emoji)
    ctx.font = `${CELL_SIZE - 4}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      collectibles[currentCollectible]?.emoji || "🌟",
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2
    );
  }, [snake, food, currentCollectible, collectibles]);

  const handlePlayAgain = () => {
    setSnake([{ x: 10, y: 10 }]);
    nextDirectionRef.current = { x: 1, y: 0 };
    generateFood();
    setScore(0);
    setCurrentCollectible(0);
    setGameOver(false);
    setGameWon(false);
    setTimeLeft(GAME_DURATION);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">Snake Game! 🐍</h2>
        <p className="text-gray-600">{theme}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="font-bold text-green-700">Score:</span> {score}/{TARGET}
          </div>
          <div className="text-sm">
            <span className="font-bold text-blue-600">Difficulty:</span> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
          <div className="text-sm">
            <span className="font-bold text-amber-600">Time:</span> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 mb-4 text-center">
          <div className="text-3xl mb-1">{collectibles[currentCollectible]?.emoji}</div>
          <div className="text-sm text-green-800 font-medium">
            {collectibles[currentCollectible]?.label}
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="border-2 border-green-200 rounded-lg touch-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        <div className="text-xs text-center text-gray-500 space-y-1">
          <p>🖥️ Desktop: Arrow keys or WASD • Space to pause</p>
          <p>📱 Mobile: Swipe to change direction</p>
        </div>
      </div>

      {isPaused && !gameOver && !gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">⏸️ Paused</h3>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Resume Game
            </button>
          </div>
        </div>
      )}

      {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-green-600 mb-4">
              Amazing! You Won!
            </h3>
            <p className="text-lg mb-4">Collected {TARGET} items on {difficulty} difficulty!</p>
            <p className="text-2xl font-bold text-amber-600 mb-6">+30 XP</p>
            <button
              onClick={() => onComplete(true)}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-semibold"
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
            <p className="text-lg mb-4">You collected {score} items on {difficulty} difficulty!</p>
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
