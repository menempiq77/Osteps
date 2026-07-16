"use client";

import {
  ArrowLeftRight,
  Coins,
  Gamepad2,
  Heart,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ArcadeQuestionGate from "./ArcadeQuestionGate";
import ArcadeShell from "./ArcadeShell";
import useArcadeQuestionPool from "./useArcadeQuestionPool";
import useArcadePass from "./useArcadePass";

type GameStage =
  "lobby" | "levels" | "playing" | "won" | "lost" | "gate" | "complete";
type BrickLayout = "full" | "checker" | "pyramid" | "diamond" | "waves";
type SoundKind = "launch" | "paddle" | "brick" | "life" | "win";

type LevelConfig = {
  id: number;
  name: string;
  world: string;
  rows: number;
  columns: number;
  ballSpeed: number;
  paddleWidth: number;
  maxBrickHits: number;
  layout: BrickLayout;
  colors: string[];
  background: [string, string];
};

type Brick = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number;
  maxHits: number;
  color: string;
};

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

type Runtime = {
  ball: Ball;
  bricks: Brick[];
  paddleX: number;
  launched: boolean;
  lives: number;
  score: number;
  startedAt: number;
};

type BreakerProgress = {
  version: 1;
  unlockedLevel: number;
  bestScores: Record<string, number>;
  bestStars: Record<string, number>;
  pendingGateLevel: number | null;
};

const GAME_WIDTH = 640;
const GAME_HEIGHT = 720;
const PADDLE_Y = 660;
const PADDLE_HEIGHT = 16;
const BALL_RADIUS = 9;
const ENTRY_COST = 5;
const STARTING_LIVES = 3;
const DEFAULT_PROGRESS: BreakerProgress = {
  version: 1,
  unlockedLevel: 1,
  bestScores: {},
  bestStars: {},
  pendingGateLevel: null,
};

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "First Bounce",
    world: "Candy Court",
    rows: 4,
    columns: 7,
    ballSpeed: 300,
    paddleWidth: 132,
    maxBrickHits: 1,
    layout: "full",
    colors: ["#22d3ee", "#38bdf8", "#818cf8", "#c084fc"],
    background: ["#e0f2fe", "#fdf2f8"],
  },
  {
    id: 2,
    name: "Sugar Stripes",
    world: "Candy Court",
    rows: 4,
    columns: 8,
    ballSpeed: 315,
    paddleWidth: 128,
    maxBrickHits: 1,
    layout: "checker",
    colors: ["#f472b6", "#fb7185", "#facc15", "#38bdf8"],
    background: ["#fef3c7", "#fce7f3"],
  },
  {
    id: 3,
    name: "Jelly Pyramid",
    world: "Candy Court",
    rows: 5,
    columns: 9,
    ballSpeed: 325,
    paddleWidth: 124,
    maxBrickHits: 1,
    layout: "pyramid",
    colors: ["#fb7185", "#c084fc", "#818cf8", "#22d3ee"],
    background: ["#fae8ff", "#cffafe"],
  },
  {
    id: 4,
    name: "Aqua Wall",
    world: "Splash Zone",
    rows: 5,
    columns: 8,
    ballSpeed: 335,
    paddleWidth: 120,
    maxBrickHits: 2,
    layout: "full",
    colors: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1"],
    background: ["#cffafe", "#dbeafe"],
  },
  {
    id: 5,
    name: "Wave Rider",
    world: "Splash Zone",
    rows: 5,
    columns: 9,
    ballSpeed: 345,
    paddleWidth: 116,
    maxBrickHits: 2,
    layout: "waves",
    colors: ["#2dd4bf", "#22d3ee", "#38bdf8", "#818cf8"],
    background: ["#ccfbf1", "#e0e7ff"],
  },
  {
    id: 6,
    name: "Deep Diamond",
    world: "Splash Zone",
    rows: 6,
    columns: 9,
    ballSpeed: 355,
    paddleWidth: 112,
    maxBrickHits: 2,
    layout: "diamond",
    colors: ["#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6"],
    background: ["#dbeafe", "#ede9fe"],
  },
  {
    id: 7,
    name: "Prism Parade",
    world: "Rainbow Rush",
    rows: 6,
    columns: 9,
    ballSpeed: 365,
    paddleWidth: 108,
    maxBrickHits: 2,
    layout: "checker",
    colors: ["#fb7185", "#fb923c", "#facc15", "#4ade80", "#38bdf8"],
    background: ["#fef9c3", "#fce7f3"],
  },
  {
    id: 8,
    name: "Color Castle",
    world: "Rainbow Rush",
    rows: 6,
    columns: 10,
    ballSpeed: 375,
    paddleWidth: 104,
    maxBrickHits: 2,
    layout: "pyramid",
    colors: ["#f472b6", "#c084fc", "#818cf8", "#38bdf8", "#34d399"],
    background: ["#fae8ff", "#dcfce7"],
  },
  {
    id: 9,
    name: "Double Trouble",
    world: "Rainbow Rush",
    rows: 6,
    columns: 10,
    ballSpeed: 385,
    paddleWidth: 102,
    maxBrickHits: 2,
    layout: "full",
    colors: ["#ec4899", "#8b5cf6", "#3b82f6", "#06b6d4"],
    background: ["#fce7f3", "#cffafe"],
  },
  {
    id: 10,
    name: "Sunset Waves",
    world: "Sunset Arcade",
    rows: 7,
    columns: 10,
    ballSpeed: 395,
    paddleWidth: 98,
    maxBrickHits: 2,
    layout: "waves",
    colors: ["#facc15", "#fb923c", "#fb7185", "#c084fc"],
    background: ["#fef3c7", "#fbcfe8"],
  },
  {
    id: 11,
    name: "Violet Vault",
    world: "Sunset Arcade",
    rows: 7,
    columns: 10,
    ballSpeed: 405,
    paddleWidth: 96,
    maxBrickHits: 3,
    layout: "diamond",
    colors: ["#7c3aed", "#a855f7", "#d946ef", "#fb7185"],
    background: ["#ede9fe", "#ffe4e6"],
  },
  {
    id: 12,
    name: "Firework Field",
    world: "Sunset Arcade",
    rows: 7,
    columns: 10,
    ballSpeed: 415,
    paddleWidth: 94,
    maxBrickHits: 3,
    layout: "checker",
    colors: ["#f97316", "#ef4444", "#ec4899", "#8b5cf6"],
    background: ["#ffedd5", "#fae8ff"],
  },
  {
    id: 13,
    name: "Aurora Grid",
    world: "Neon Galaxy",
    rows: 7,
    columns: 10,
    ballSpeed: 425,
    paddleWidth: 92,
    maxBrickHits: 3,
    layout: "full",
    colors: ["#14b8a6", "#06b6d4", "#6366f1", "#a855f7"],
    background: ["#cffafe", "#ddd6fe"],
  },
  {
    id: 14,
    name: "Meteor Diamond",
    world: "Neon Galaxy",
    rows: 8,
    columns: 10,
    ballSpeed: 435,
    paddleWidth: 88,
    maxBrickHits: 3,
    layout: "diamond",
    colors: ["#facc15", "#f97316", "#ec4899", "#6366f1"],
    background: ["#fef9c3", "#e0e7ff"],
  },
  {
    id: 15,
    name: "Galaxy Breaker",
    world: "Neon Galaxy",
    rows: 8,
    columns: 10,
    ballSpeed: 445,
    paddleWidth: 84,
    maxBrickHits: 3,
    layout: "waves",
    colors: ["#22d3ee", "#6366f1", "#a855f7", "#ec4899", "#facc15"],
    background: ["#dbeafe", "#fce7f3"],
  },
];

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const normalizeProgress = (value: unknown): BreakerProgress => {
  if (!value || typeof value !== "object") return DEFAULT_PROGRESS;
  const saved = value as Partial<BreakerProgress>;
  return {
    version: 1,
    unlockedLevel: clamp(
      Number.isFinite(saved.unlockedLevel) ? Number(saved.unlockedLevel) : 1,
      1,
      LEVELS.length,
    ),
    bestScores:
      saved.bestScores && typeof saved.bestScores === "object"
        ? saved.bestScores
        : {},
    bestStars:
      saved.bestStars && typeof saved.bestStars === "object"
        ? saved.bestStars
        : {},
    pendingGateLevel:
      Number.isFinite(saved.pendingGateLevel) &&
      Number(saved.pendingGateLevel) >= 1 &&
      Number(saved.pendingGateLevel) < LEVELS.length
        ? Number(saved.pendingGateLevel)
        : null,
  };
};

const shouldPlaceBrick = (
  layout: BrickLayout,
  row: number,
  column: number,
  rows: number,
  columns: number,
) => {
  if (layout === "full") return true;
  if (layout === "checker") return (row + column) % 3 !== 1;
  if (layout === "waves") return (column + row * 2) % 5 !== 0;
  if (layout === "pyramid") {
    const edge = Math.min(row, Math.floor((columns - 1) / 2));
    return column >= edge && column < columns - edge;
  }

  const centerRow = (rows - 1) / 2;
  const centerColumn = (columns - 1) / 2;
  const rowDistance = Math.abs(row - centerRow) / Math.max(1, centerRow);
  const columnDistance =
    Math.abs(column - centerColumn) / Math.max(1, centerColumn);
  return rowDistance + columnDistance <= 1.25;
};

const createBricks = (level: LevelConfig) => {
  const gap = 7;
  const horizontalPadding = 28;
  const brickWidth =
    (GAME_WIDTH - horizontalPadding * 2 - gap * (level.columns - 1)) /
    level.columns;
  const brickHeight = 25;
  const bricks: Brick[] = [];

  for (let row = 0; row < level.rows; row += 1) {
    for (let column = 0; column < level.columns; column += 1) {
      if (
        !shouldPlaceBrick(level.layout, row, column, level.rows, level.columns)
      ) {
        continue;
      }

      const toughBrick =
        level.maxBrickHits > 1 &&
        (row * level.columns + column + level.id) %
          Math.max(2, 5 - level.maxBrickHits) ===
          0;
      const maxHits = toughBrick ? level.maxBrickHits : 1;
      bricks.push({
        id: row * level.columns + column,
        x: horizontalPadding + column * (brickWidth + gap),
        y: 70 + row * (brickHeight + gap),
        width: brickWidth,
        height: brickHeight,
        hits: maxHits,
        maxHits,
        color: level.colors[row % level.colors.length],
      });
    }
  }

  return bricks;
};

const createRuntime = (level: LevelConfig): Runtime => {
  const paddleX = (GAME_WIDTH - level.paddleWidth) / 2;
  return {
    ball: {
      x: GAME_WIDTH / 2,
      y: PADDLE_Y - BALL_RADIUS - 4,
      vx: level.ballSpeed * 0.56,
      vy: -level.ballSpeed,
      radius: BALL_RADIUS,
    },
    bricks: createBricks(level),
    paddleX,
    launched: false,
    lives: STARTING_LIVES,
    score: 0,
    startedAt: Date.now(),
  };
};

const starsForLives = (lives: number) => (lives >= 3 ? 3 : lives === 2 ? 2 : 1);

export default function BrickBreakerGame() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<Runtime>(createRuntime(LEVELS[0]));
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const audioContextRef = useRef<AudioContext | null>(null);
  const progressKey = useMemo(
    () => `osteps:brick-breaker:progress:${currentUser?.id ?? "guest"}`,
    [currentUser?.id],
  );
  const {
    checkoutError,
    endPass,
    isPreview,
    isRestored: isPassRestored,
    isStarting,
    isWalletLoading,
    passActive,
    passExpiresAt,
    startPass,
    walletBalance,
  } = useArcadePass({
    gameId: "brick-breaker",
    gameTitle: "Brick Bounce",
    entryCost: ENTRY_COST,
  });
  const {
    questions,
    isLoading: questionsLoading,
    errorMessage: questionsError,
    isPreview: questionsPreview,
    subjectName,
    refreshQuestions,
  } = useArcadeQuestionPool();

  const [stage, setStage] = useState<GameStage>("lobby");
  const [progress, setProgress] = useState<BreakerProgress>(DEFAULT_PROGRESS);
  const [isProgressRestored, setIsProgressRestored] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [score, setScore] = useState(0);
  const [bricksLeft, setBricksLeft] = useState(0);
  const [levelStars, setLevelStars] = useState(0);
  const [paused, setPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [launched, setLaunched] = useState(false);
  const [notice, setNotice] = useState(
    "Move the paddle, then tap or press Space to launch.",
  );

  const level = LEVELS[currentLevel - 1] ?? LEVELS[0];
  const totalBestScore = Object.values(progress.bestScores).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  const totalStars = Object.values(progress.bestStars).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );

  useEffect(() => {
    const raw = window.localStorage.getItem(progressKey);
    if (!raw) {
      setProgress(DEFAULT_PROGRESS);
      setIsProgressRestored(true);
      return;
    }

    try {
      setProgress(normalizeProgress(JSON.parse(raw)));
    } catch {
      window.localStorage.removeItem(progressKey);
      setProgress(DEFAULT_PROGRESS);
    } finally {
      setIsProgressRestored(true);
    }
  }, [progressKey]);

  useEffect(() => {
    if (
      isPassRestored &&
      isProgressRestored &&
      passActive &&
      stage === "lobby"
    ) {
      setStage("levels");
    }
  }, [isPassRestored, isProgressRestored, passActive, stage]);

  const saveProgress = useCallback(
    (nextProgress: BreakerProgress) => {
      window.localStorage.setItem(progressKey, JSON.stringify(nextProgress));
      setProgress(nextProgress);
    },
    [progressKey],
  );

  const playSound = useCallback(
    (kind: SoundKind) => {
      if (!soundEnabled || typeof window === "undefined") return;

      const context =
        audioContextRef.current ??
        new window.AudioContext({ latencyHint: "interactive" });
      audioContextRef.current = context;
      const notes = {
        launch: [330],
        paddle: [220],
        brick: [520, 680],
        life: [180, 130],
        win: [523, 659, 784, 1047],
      }[kind];
      const now = context.currentTime;

      notes.forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = kind === "life" ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, now + index * 0.055);
        gain.gain.setValueAtTime(0.0001, now + index * 0.055);
        gain.gain.exponentialRampToValueAtTime(
          kind === "paddle" ? 0.025 : 0.055,
          now + index * 0.055 + 0.01,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + index * 0.055 + 0.16,
        );
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now + index * 0.055);
        oscillator.stop(now + index * 0.055 + 0.18);
      });
    },
    [soundEnabled],
  );

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const runtime = runtimeRef.current;

    const background = context.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    background.addColorStop(0, level.background[0]);
    background.addColorStop(1, level.background[1]);
    context.fillStyle = background;
    context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    context.globalAlpha = 0.35;
    context.fillStyle = "#ffffff";
    for (let index = 0; index < 14; index += 1) {
      const x = (index * 97 + level.id * 31) % GAME_WIDTH;
      const y = (index * 53 + level.id * 19) % 430;
      context.beginPath();
      context.arc(x, y, 2 + (index % 3), 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;

    runtime.bricks.forEach((brick) => {
      if (brick.hits <= 0) return;
      context.save();
      context.shadowColor = `${brick.color}80`;
      context.shadowBlur = 13;
      context.fillStyle = brick.color;
      context.beginPath();
      context.roundRect(brick.x, brick.y, brick.width, brick.height, 7);
      context.fill();
      context.shadowBlur = 0;
      context.strokeStyle = "rgba(255,255,255,.85)";
      context.lineWidth = 2;
      context.stroke();
      if (brick.hits > 1) {
        context.fillStyle = "rgba(255,255,255,.9)";
        context.font = "900 12px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(
          String(brick.hits),
          brick.x + brick.width / 2,
          brick.y + brick.height / 2 + 1,
        );
      }
      context.restore();
    });

    const paddleGradient = context.createLinearGradient(
      runtime.paddleX,
      0,
      runtime.paddleX + level.paddleWidth,
      0,
    );
    paddleGradient.addColorStop(0, "#06b6d4");
    paddleGradient.addColorStop(0.5, "#6366f1");
    paddleGradient.addColorStop(1, "#d946ef");
    context.save();
    context.shadowColor = "rgba(79,70,229,.45)";
    context.shadowBlur = 20;
    context.fillStyle = paddleGradient;
    context.beginPath();
    context.roundRect(
      runtime.paddleX,
      PADDLE_Y,
      level.paddleWidth,
      PADDLE_HEIGHT,
      8,
    );
    context.fill();
    context.restore();

    context.save();
    context.shadowColor = "#ffffff";
    context.shadowBlur = 22;
    const ballGradient = context.createRadialGradient(
      runtime.ball.x - 3,
      runtime.ball.y - 3,
      1,
      runtime.ball.x,
      runtime.ball.y,
      runtime.ball.radius,
    );
    ballGradient.addColorStop(0, "#ffffff");
    ballGradient.addColorStop(0.45, "#fef08a");
    ballGradient.addColorStop(1, "#f59e0b");
    context.fillStyle = ballGradient;
    context.beginPath();
    context.arc(
      runtime.ball.x,
      runtime.ball.y,
      runtime.ball.radius,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.restore();
  }, [level]);

  const saveBestScore = useCallback(
    (nextScore: number, stars = 0, levelCompleted = false) => {
      const key = String(currentLevel);
      const needsGate =
        levelCompleted &&
        currentLevel < LEVELS.length &&
        currentLevel >= progress.unlockedLevel;
      const nextProgress: BreakerProgress = {
        version: 1,
        unlockedLevel: progress.unlockedLevel,
        bestScores: {
          ...progress.bestScores,
          [key]: Math.max(nextScore, progress.bestScores[key] ?? 0),
        },
        bestStars: {
          ...progress.bestStars,
          [key]: Math.max(stars, progress.bestStars[key] ?? 0),
        },
        pendingGateLevel: needsGate ? currentLevel : progress.pendingGateLevel,
      };
      saveProgress(nextProgress);
    },
    [currentLevel, progress, saveProgress],
  );

  const completeLevel = useCallback(() => {
    const runtime = runtimeRef.current;
    const elapsedSeconds = Math.floor((Date.now() - runtime.startedAt) / 1000);
    const timeBonus = Math.max(0, 900 - elapsedSeconds * 5);
    const completionBonus =
      currentLevel * 100 + runtime.lives * 250 + timeBonus;
    runtime.score += completionBonus;
    const stars = starsForLives(runtime.lives);
    setScore(runtime.score);
    setLevelStars(stars);
    setPaused(false);
    setNotice(
      `Level ${currentLevel} cleared! ${completionBonus.toLocaleString()} bonus points.`,
    );
    saveBestScore(runtime.score, stars, true);
    playSound("win");
    setStage("won");
  }, [currentLevel, playSound, saveBestScore]);

  const loseBall = useCallback(() => {
    const runtime = runtimeRef.current;
    runtime.lives -= 1;
    setLives(runtime.lives);
    playSound("life");

    if (runtime.lives <= 0) {
      runtime.launched = false;
      setLaunched(false);
      setPaused(false);
      setNotice("Game over. Your best score is saved.");
      saveBestScore(runtime.score);
      setStage("lost");
      return;
    }

    runtime.launched = false;
    runtime.paddleX = (GAME_WIDTH - level.paddleWidth) / 2;
    runtime.ball.x = GAME_WIDTH / 2;
    runtime.ball.y = PADDLE_Y - BALL_RADIUS - 4;
    runtime.ball.vx =
      level.ballSpeed * (runtime.lives % 2 === 0 ? 0.56 : -0.56);
    runtime.ball.vy = -level.ballSpeed;
    setLaunched(false);
    setNotice(
      `${runtime.lives} ${runtime.lives === 1 ? "ball" : "balls"} left. Tap or press Space to launch.`,
    );
  }, [level, playSound, saveBestScore]);

  useEffect(() => {
    if (stage !== "playing" || paused) {
      drawGame();
      return;
    }

    const animate = (timestamp: number) => {
      const runtime = runtimeRef.current;
      const elapsed = lastFrameRef.current
        ? Math.min(0.026, (timestamp - lastFrameRef.current) / 1000)
        : 0;
      lastFrameRef.current = timestamp;

      const paddleStep = 450 * elapsed;
      if (keysRef.current.left) runtime.paddleX -= paddleStep;
      if (keysRef.current.right) runtime.paddleX += paddleStep;
      runtime.paddleX = clamp(
        runtime.paddleX,
        0,
        GAME_WIDTH - level.paddleWidth,
      );

      if (!runtime.launched) {
        runtime.ball.x = runtime.paddleX + level.paddleWidth / 2;
        runtime.ball.y = PADDLE_Y - runtime.ball.radius - 4;
      } else {
        const previousX = runtime.ball.x;
        const previousY = runtime.ball.y;
        runtime.ball.x += runtime.ball.vx * elapsed;
        runtime.ball.y += runtime.ball.vy * elapsed;

        if (runtime.ball.x - runtime.ball.radius <= 0) {
          runtime.ball.x = runtime.ball.radius;
          runtime.ball.vx = Math.abs(runtime.ball.vx);
        } else if (runtime.ball.x + runtime.ball.radius >= GAME_WIDTH) {
          runtime.ball.x = GAME_WIDTH - runtime.ball.radius;
          runtime.ball.vx = -Math.abs(runtime.ball.vx);
        }

        if (runtime.ball.y - runtime.ball.radius <= 0) {
          runtime.ball.y = runtime.ball.radius;
          runtime.ball.vy = Math.abs(runtime.ball.vy);
        }

        const paddleHit =
          runtime.ball.vy > 0 &&
          runtime.ball.y + runtime.ball.radius >= PADDLE_Y &&
          previousY + runtime.ball.radius <= PADDLE_Y + PADDLE_HEIGHT &&
          runtime.ball.x >= runtime.paddleX - runtime.ball.radius &&
          runtime.ball.x <=
            runtime.paddleX + level.paddleWidth + runtime.ball.radius;

        if (paddleHit) {
          const hitOffset =
            (runtime.ball.x - (runtime.paddleX + level.paddleWidth / 2)) /
            (level.paddleWidth / 2);
          const speed = level.ballSpeed * (1 + (currentLevel - 1) * 0.012);
          runtime.ball.vx = clamp(hitOffset, -0.9, 0.9) * speed;
          if (Math.abs(runtime.ball.vx) < speed * 0.2) {
            runtime.ball.vx = speed * 0.2 * (runtime.ball.vx < 0 ? -1 : 1);
          }
          runtime.ball.vy = -Math.sqrt(
            Math.max(speed * speed - runtime.ball.vx * runtime.ball.vx, 1),
          );
          runtime.ball.y = PADDLE_Y - runtime.ball.radius - 1;
          playSound("paddle");
        }

        for (const brick of runtime.bricks) {
          if (brick.hits <= 0) continue;
          const closestX = clamp(
            runtime.ball.x,
            brick.x,
            brick.x + brick.width,
          );
          const closestY = clamp(
            runtime.ball.y,
            brick.y,
            brick.y + brick.height,
          );
          const distanceX = runtime.ball.x - closestX;
          const distanceY = runtime.ball.y - closestY;
          if (
            distanceX * distanceX + distanceY * distanceY >
            runtime.ball.radius * runtime.ball.radius
          ) {
            continue;
          }

          const verticalEntry =
            previousY + runtime.ball.radius <= brick.y ||
            previousY - runtime.ball.radius >= brick.y + brick.height;
          if (verticalEntry) runtime.ball.vy *= -1;
          else runtime.ball.vx *= -1;

          brick.hits -= 1;
          const hitScore = currentLevel * (brick.hits <= 0 ? 20 : 8);
          runtime.score += hitScore;
          setScore(runtime.score);
          playSound("brick");

          if (brick.hits <= 0) {
            const remaining = runtime.bricks.filter(
              (candidate) => candidate.hits > 0,
            ).length;
            setBricksLeft(remaining);
            if (remaining === 0) completeLevel();
          }
          break;
        }

        if (runtime.ball.y - runtime.ball.radius > GAME_HEIGHT) {
          loseBall();
        }
      }

      drawGame();
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    lastFrameRef.current = 0;
    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    completeLevel,
    currentLevel,
    drawGame,
    level,
    loseBall,
    paused,
    playSound,
    stage,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keysRef.current.left = true;
        event.preventDefault();
      } else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
      ) {
        keysRef.current.right = true;
        event.preventDefault();
      } else if (
        (event.key === " " || event.key === "Enter") &&
        stage === "playing"
      ) {
        event.preventDefault();
        const runtime = runtimeRef.current;
        if (!paused && !runtime.launched) {
          runtime.launched = true;
          setLaunched(true);
          setNotice("Keep the ball alive and clear every brick!");
          playSound("launch");
        }
      } else if (event.key.toLowerCase() === "p" && stage === "playing") {
        event.preventDefault();
        setPaused((current) => !current);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keysRef.current.left = false;
      } else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
      ) {
        keysRef.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [paused, playSound, stage]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && stage === "playing") setPaused(true);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stage]);

  const beginLevel = (levelNumber: number, allowLocked = false) => {
    const nextLevel = LEVELS[levelNumber - 1];
    if (!nextLevel || (!allowLocked && levelNumber > progress.unlockedLevel)) {
      return;
    }
    const runtime = createRuntime(nextLevel);
    runtimeRef.current = runtime;
    setCurrentLevel(levelNumber);
    setLives(runtime.lives);
    setScore(0);
    setBricksLeft(runtime.bricks.length);
    setLevelStars(0);
    setPaused(false);
    setLaunched(false);
    setNotice("Move the paddle, then tap or press Space to launch.");
    setStage("playing");
  };

  const openQuestionGate = (completedLevel: number) => {
    setCurrentLevel(completedLevel);
    void refreshQuestions();
    setStage("gate");
  };

  const passQuestionGate = () => {
    const completedLevel = progress.pendingGateLevel ?? currentLevel;
    const nextLevel = completedLevel + 1;
    const nextProgress: BreakerProgress = {
      ...progress,
      unlockedLevel: Math.max(progress.unlockedLevel, nextLevel),
      pendingGateLevel: null,
    };
    saveProgress(nextProgress);
    beginLevel(nextLevel, true);
  };

  const launchBall = () => {
    const runtime = runtimeRef.current;
    if (stage !== "playing" || paused || runtime.launched) return;
    runtime.launched = true;
    setLaunched(true);
    setNotice("Keep the ball alive and clear every brick!");
    playSound("launch");
  };

  const movePaddleFromPointer = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX =
      ((event.clientX - rect.left) / Math.max(rect.width, 1)) * GAME_WIDTH;
    const runtime = runtimeRef.current;
    runtime.paddleX = clamp(
      pointerX - level.paddleWidth / 2,
      0,
      GAME_WIDTH - level.paddleWidth,
    );
    if (!runtime.launched) {
      runtime.ball.x = runtime.paddleX + level.paddleWidth / 2;
    }
    drawGame();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    movePaddleFromPointer(event);
    launchBall();
  };

  const enterArcade = async () => {
    const started = await startPass();
    if (started) setStage("levels");
  };

  if (!isPassRestored || !isProgressRestored) {
    return (
      <ArcadeShell
        title="Brick Bounce"
        subtitle="Loading your arcade progress"
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <div className="flex min-h-[420px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-fuchsia-500" />
            <p className="mt-4 text-sm font-black text-slate-600">
              Building the brick wall…
            </p>
          </div>
        </div>
      </ArcadeShell>
    );
  }

  if (stage === "lobby") {
    return (
      <ArcadeShell
        title="Brick Bounce"
        subtitle="Move. Bounce. Break them all."
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-gradient-to-b from-indigo-950 via-violet-900 to-fuchsia-900 p-6 text-white sm:p-8">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/25 blur-3xl" />
            <div className="absolute -right-16 top-24 h-56 w-56 rounded-full bg-fuchsia-400/25 blur-3xl" />
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                Classic arcade, bright new world
              </span>
              <h1 className="mt-5 text-4xl font-black leading-[0.95] sm:text-5xl">
                Bounce the ball.
                <span className="block bg-gradient-to-r from-cyan-300 via-yellow-200 to-fuchsia-300 bg-clip-text text-transparent">
                  Break every brick.
                </span>
              </h1>
              <p className="mt-4 max-w-md text-sm font-bold leading-6 text-indigo-100">
                Slide the paddle left and right, keep the ball in play, and
                clear 15 increasingly challenging levels before your three balls
                run out.
              </p>
            </div>

            <div className="absolute inset-x-8 bottom-8">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 21 }, (_, index) => (
                  <div
                    key={index}
                    className="h-6 rounded-md border border-white/50 shadow-lg"
                    style={{
                      backgroundColor:
                        LEVELS[0].colors[
                          Math.floor(index / 7) % LEVELS[0].colors.length
                        ],
                    }}
                  />
                ))}
              </div>
              <div className="mx-auto mt-14 h-4 w-32 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 shadow-[0_0_26px_rgba(34,211,238,.7)]" />
              <div className="mx-auto -mt-12 h-5 w-5 rounded-full bg-yellow-200 shadow-[0_0_22px_rgba(254,240,138,.95)]" />
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[28px] border border-white bg-white/85 p-6 shadow-xl shadow-indigo-900/5 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-600">
              Your arcade pass
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              15 levels. Three balls. Unlimited retries.
            </h2>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["15", "Levels"],
                ["3", "Lives"],
                ["5", "Worlds"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-slate-50 p-3 text-center"
                >
                  <p className="text-xl font-black text-slate-900">{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm font-bold text-slate-600">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                  <ArrowLeftRight className="h-4 w-4" />
                </span>
                Drag, use arrow keys, or press A and D
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <Heart className="h-4 w-4" />
                </span>
                Three balls before game over
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Trophy className="h-4 w-4" />
                </span>
                Saved levels, stars, and personal high scores
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700">
                  <Sparkles className="h-4 w-4" />
                </span>
                Game score never changes leaderboard points
              </div>
            </div>

            {checkoutError ? (
              <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                {checkoutError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={enterArcade}
              disabled={isStarting || (isWalletLoading && !isPreview)}
              className="mt-6 flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 px-6 text-base font-black text-white shadow-[0_16px_34px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
            >
              <Play className="h-5 w-5 fill-current" />
              {isStarting
                ? "Activating pass…"
                : isPreview
                  ? "Play free admin preview"
                  : `Play for ${ENTRY_COST} coins`}
            </button>
            <p className="mt-3 text-center text-xs font-bold text-slate-500">
              {isPreview
                ? "Preview mode does not spend coins."
                : `${walletBalance.toLocaleString()} coins currently in your pocket`}
            </p>
          </div>
        </div>
      </ArcadeShell>
    );
  }

  if (stage === "gate") {
    const completedLevel = progress.pendingGateLevel ?? currentLevel;
    return (
      <ArcadeShell
        title="Brick Bounce"
        subtitle="Five correct answers unlock the next level"
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <ArcadeQuestionGate
          gameId="brick-breaker"
          gameTitle="Brick Bounce"
          completedLevel={completedLevel}
          nextLevelLabel={`Level ${completedLevel + 1}`}
          questions={questions}
          isLoading={questionsLoading}
          errorMessage={questionsError}
          isPreview={questionsPreview}
          subjectName={subjectName}
          onPassed={passQuestionGate}
          onBack={() => setStage("levels")}
          onRetryLoad={() => void refreshQuestions()}
        />
      </ArcadeShell>
    );
  }

  if (stage === "levels") {
    const minutesRemaining = passExpiresAt
      ? Math.max(1, Math.ceil((passExpiresAt - Date.now()) / 60000))
      : 0;

    return (
      <ArcadeShell
        title="Brick Bounce"
        subtitle={`${totalBestScore.toLocaleString()} total best score · ${totalStars}/${LEVELS.length * 3} stars`}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <div className="rounded-[28px] border border-white bg-white/70 p-5 shadow-xl shadow-indigo-900/5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">
                Level map
              </p>
              <h2 className="mt-1 text-3xl font-black text-slate-900">
                Break through five worlds
              </h2>
              <p className="mt-2 text-sm font-bold text-slate-500">
                Arcade pass active · about {minutesRemaining} min left
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                endPass();
                setStage("lobby");
              }}
              className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-xs font-black text-rose-600"
            >
              End arcade pass
            </button>
          </div>

          {progress.pendingGateLevel ? (
            <button
              type="button"
              onClick={() => openQuestionGate(progress.pendingGateLevel ?? 1)}
              className="mt-5 flex w-full items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-cyan-50 to-fuchsia-50 px-5 py-4 text-left"
            >
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.16em] text-indigo-500">
                  Knowledge gate waiting
                </span>
                <span className="mt-1 block text-sm font-black text-slate-800">
                  Answer five questions to unlock Level{" "}
                  {progress.pendingGateLevel + 1}
                </span>
              </span>
              <Sparkles className="h-6 w-6 shrink-0 text-fuchsia-500" />
            </button>
          ) : null}

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {LEVELS.map((item) => {
              const unlocked = item.id <= progress.unlockedLevel;
              const stars = progress.bestStars[String(item.id)] ?? 0;
              const bestScore = progress.bestScores[String(item.id)] ?? 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => beginLevel(item.id)}
                  disabled={!unlocked}
                  className="group relative min-h-[158px] overflow-hidden rounded-[22px] border border-white p-4 text-left shadow-md transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:grayscale"
                  style={{
                    background: `linear-gradient(145deg, ${item.background[0]}, ${item.background[1]})`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/85 text-sm font-black text-slate-800 shadow-sm">
                      {item.id}
                    </span>
                    {unlocked ? (
                      <span className="flex gap-0.5">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= stars
                                ? "fill-amber-400 text-amber-400"
                                : "text-white"
                            }`}
                          />
                        ))}
                      </span>
                    ) : (
                      <Lock className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  <p className="mt-6 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                    {item.world}
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-slate-600">
                    Best {bestScore.toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </ArcadeShell>
    );
  }

  if (stage === "complete") {
    return (
      <ArcadeShell
        title="Brick Bounce"
        subtitle="Every wall has fallen"
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <div className="flex min-h-[560px] items-center justify-center rounded-[28px] bg-gradient-to-br from-cyan-100 via-yellow-100 to-fuchsia-100 p-6 text-center">
          <div className="max-w-lg">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
              <Trophy className="h-12 w-12" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-fuchsia-600">
              Arcade champion
            </p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">
              Galaxy Breaker complete!
            </h2>
            <p className="mt-3 text-base font-bold leading-7 text-slate-600">
              Replay levels to protect all three balls, collect every star, and
              raise your personal high score.
            </p>
            <button
              type="button"
              onClick={() => setStage("levels")}
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5"
            >
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              Return to level map
            </button>
          </div>
        </div>
      </ArcadeShell>
    );
  }

  const totalBricks = runtimeRef.current.bricks.length;
  const clearedBricks = Math.max(0, totalBricks - bricksLeft);

  return (
    <ArcadeShell
      title={`Brick Bounce · Level ${currentLevel}`}
      subtitle={`${level.world} · ${level.name}`}
      paused={paused}
      showPause={stage === "playing"}
      soundEnabled={soundEnabled}
      onPauseToggle={() => setPaused((current) => !current)}
      onSoundToggle={() => setSoundEnabled((current) => !current)}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div>
          <div className="mb-3 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white px-3 py-2.5 text-center shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Score
              </p>
              <p className="mt-0.5 text-lg font-black text-slate-900">
                {score.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-white px-3 py-2.5 text-center shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Balls
              </p>
              <p className="mt-0.5 text-lg font-black text-rose-500">
                {"♥".repeat(Math.max(0, lives))}
              </p>
            </div>
            <div className="rounded-2xl bg-white px-3 py-2.5 text-center shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Bricks
              </p>
              <p className="mt-0.5 text-lg font-black text-fuchsia-600">
                {clearedBricks}/{totalBricks}
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] overflow-hidden rounded-[28px] border-4 border-white shadow-[0_24px_55px_rgba(79,70,229,0.2)]">
            <canvas
              ref={canvasRef}
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              onPointerDown={handlePointerDown}
              onPointerMove={(event) => {
                if (event.buttons > 0 || event.pointerType === "touch") {
                  movePaddleFromPointer(event);
                }
              }}
              className="block aspect-[8/9] w-full touch-none"
              aria-label="Brick Bounce game board"
            />
            {paused ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/65 backdrop-blur-sm">
                <div className="rounded-3xl bg-slate-900 px-7 py-5 text-center text-white shadow-2xl">
                  <p className="text-2xl font-black">Paused</p>
                  <p className="mt-1 text-xs font-bold text-slate-300">
                    Tap Resume or press P
                  </p>
                </div>
              </div>
            ) : null}
            {stage === "playing" && !launched && !paused ? (
              <button
                type="button"
                onClick={launchBall}
                className="absolute inset-x-0 bottom-16 mx-auto flex h-12 w-48 items-center justify-center gap-2 rounded-2xl bg-slate-900/90 text-sm font-black text-white shadow-xl backdrop-blur"
              >
                <Play className="h-4 w-4 fill-current" />
                Launch ball
              </button>
            ) : null}
          </div>

          <p
            className="mt-3 min-h-6 text-center text-sm font-black text-slate-700"
            aria-live="polite"
          >
            {notice}
          </p>
        </div>

        <aside className="flex flex-col gap-3">
          <div className="rounded-[24px] border border-white bg-white/85 p-5 shadow-lg shadow-indigo-900/5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
              Level goal
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              {level.name}
            </h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
              Keep the ball above your paddle and break all {totalBricks}{" "}
              bricks. Tough bricks show how many hits remain.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 transition-all"
                style={{
                  width: `${totalBricks ? (clearedBricks / totalBricks) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {stage === "won" ? (
            <div className="rounded-[24px] bg-gradient-to-br from-amber-100 via-white to-fuchsia-100 p-5 text-center shadow-lg">
              <Trophy className="mx-auto h-9 w-9 text-amber-500" />
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Level cleared!
              </h3>
              <p className="mt-1 text-sm font-black text-indigo-600">
                {score.toLocaleString()} points
              </p>
              <div className="mt-3 flex justify-center gap-1">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 ${
                      star <= levelStars
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (currentLevel === LEVELS.length) {
                    setStage("complete");
                  } else if (progress.pendingGateLevel === currentLevel) {
                    openQuestionGate(currentLevel);
                  } else {
                    beginLevel(currentLevel + 1);
                  }
                }}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-black text-white"
              >
                {currentLevel === LEVELS.length
                  ? "Claim Galaxy Trophy"
                  : progress.pendingGateLevel === currentLevel
                    ? "Answer 5 questions"
                    : "Next level"}
              </button>
              <button
                type="button"
                onClick={() => setStage("levels")}
                className="mt-2 text-xs font-black text-slate-500"
              >
                Back to level map
              </button>
            </div>
          ) : null}

          {stage === "lost" ? (
            <div className="rounded-[24px] bg-gradient-to-br from-rose-100 via-white to-orange-100 p-5 text-center shadow-lg">
              <RotateCcw className="mx-auto h-9 w-9 text-rose-500" />
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Game over
              </h3>
              <p className="mt-1 text-sm font-black text-indigo-600">
                Score {score.toLocaleString()}
              </p>
              <p className="mt-2 text-sm font-bold text-slate-500">
                Retries are included in your arcade pass.
              </p>
              <button
                type="button"
                onClick={() => beginLevel(currentLevel)}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-sm font-black text-white"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
              <button
                type="button"
                onClick={() => setStage("levels")}
                className="mt-2 text-xs font-black text-slate-500"
              >
                Back to level map
              </button>
            </div>
          ) : null}

          {stage === "playing" ? (
            <>
              <button
                type="button"
                onClick={launchBall}
                disabled={launched || paused}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 text-sm font-black text-white shadow-lg disabled:opacity-45"
              >
                <Zap className="h-4 w-4 fill-current" />
                {launched ? "Ball in play" : "Launch ball"}
              </button>
              <div className="rounded-[24px] border border-white bg-white/70 p-4 text-xs font-bold leading-5 text-slate-500">
                <p className="font-black text-slate-700">Controls</p>
                <p className="mt-1">
                  Phone/tablet: drag the paddle or tap to launch.
                </p>
                <p>
                  Computer: ← → or A/D to move, Space to launch, P to pause.
                </p>
              </div>
            </>
          ) : null}

          <div className="rounded-[24px] bg-indigo-950 p-4 text-xs font-bold leading-5 text-indigo-100">
            <div className="flex items-center gap-2 font-black text-white">
              <Gamepad2 className="h-4 w-4 text-cyan-300" />
              Arcade score only
            </div>
            <p className="mt-1">
              These points are your Brick Bounce high score. Leaderboard points
              never change.
            </p>
          </div>
        </aside>
      </div>
    </ArcadeShell>
  );
}
