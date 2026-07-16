"use client";

import {
  Coins,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ArcadeQuestionGate from "./ArcadeQuestionGate";
import ArcadeShell from "./ArcadeShell";
import useArcadeQuestionPool from "./useArcadeQuestionPool";
import useArcadePass from "./useArcadePass";

type GameStage =
  "lobby" | "levels" | "playing" | "won" | "lost" | "gate" | "complete";

type TowerBlock = {
  id: number;
  x: number;
  width: number;
  color: string;
};

type TowerProgress = {
  version: 1;
  unlockedLevel: number;
  bestStars: Record<string, number>;
  pendingGateLevel: number | null;
};

type LevelConfig = {
  id: number;
  name: string;
  world: string;
  target: number;
  speed: number;
  startWidth: number;
  lives: number;
  perfectTolerance: number;
  background: string;
  colors: string[];
};

type SoundKind = "drop" | "perfect" | "miss" | "win";

const GAME_WIDTH = 320;
const MIN_BLOCK_WIDTH = 10;
const ENTRY_COST = 5;
const DEFAULT_PROGRESS: TowerProgress = {
  version: 1,
  unlockedLevel: 1,
  bestStars: {},
  pendingGateLevel: null,
};

const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "First Glow",
    world: "Candy Sunrise",
    target: 5,
    speed: 0.105,
    startWidth: 196,
    lives: 3,
    perfectTolerance: 9,
    background: "linear-gradient(180deg,#dff8ff 0%,#fff7d6 62%,#ffd8ec 100%)",
    colors: ["#22d3ee", "#38bdf8", "#818cf8", "#c084fc", "#f472b6"],
  },
  {
    id: 2,
    name: "Cloud Steps",
    world: "Candy Sunrise",
    target: 6,
    speed: 0.115,
    startWidth: 192,
    lives: 3,
    perfectTolerance: 8,
    background: "linear-gradient(180deg,#dbeafe 0%,#ecfeff 58%,#fce7f3 100%)",
    colors: ["#60a5fa", "#22d3ee", "#34d399", "#facc15", "#fb7185"],
  },
  {
    id: 3,
    name: "Lemon Lights",
    world: "Candy Sunrise",
    target: 6,
    speed: 0.125,
    startWidth: 186,
    lives: 3,
    perfectTolerance: 8,
    background: "linear-gradient(180deg,#fef9c3 0%,#dcfce7 55%,#cffafe 100%)",
    colors: ["#facc15", "#a3e635", "#34d399", "#2dd4bf", "#38bdf8"],
  },
  {
    id: 4,
    name: "Aqua Avenue",
    world: "Splash City",
    target: 7,
    speed: 0.135,
    startWidth: 182,
    lives: 3,
    perfectTolerance: 7,
    background: "linear-gradient(180deg,#cffafe 0%,#dbeafe 56%,#ede9fe 100%)",
    colors: ["#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6"],
  },
  {
    id: 5,
    name: "Bubble Boulevard",
    world: "Splash City",
    target: 7,
    speed: 0.145,
    startWidth: 176,
    lives: 3,
    perfectTolerance: 7,
    background: "linear-gradient(180deg,#e0f2fe 0%,#fae8ff 58%,#fce7f3 100%)",
    colors: ["#38bdf8", "#818cf8", "#a78bfa", "#e879f9", "#fb7185"],
  },
  {
    id: 6,
    name: "Coral Climb",
    world: "Splash City",
    target: 8,
    speed: 0.155,
    startWidth: 172,
    lives: 3,
    perfectTolerance: 7,
    background: "linear-gradient(180deg,#ffedd5 0%,#fce7f3 55%,#e0f2fe 100%)",
    colors: ["#fb7185", "#f97316", "#facc15", "#2dd4bf", "#38bdf8"],
  },
  {
    id: 7,
    name: "Prism Park",
    world: "Rainbow Heights",
    target: 8,
    speed: 0.165,
    startWidth: 168,
    lives: 3,
    perfectTolerance: 6,
    background: "linear-gradient(180deg,#fae8ff 0%,#e0e7ff 54%,#cffafe 100%)",
    colors: ["#f472b6", "#e879f9", "#a78bfa", "#60a5fa", "#2dd4bf"],
  },
  {
    id: 8,
    name: "Rainbow Rush",
    world: "Rainbow Heights",
    target: 9,
    speed: 0.175,
    startWidth: 164,
    lives: 3,
    perfectTolerance: 6,
    background: "linear-gradient(180deg,#fce7f3 0%,#fef9c3 50%,#dcfce7 100%)",
    colors: ["#fb7185", "#fb923c", "#facc15", "#4ade80", "#22d3ee"],
  },
  {
    id: 9,
    name: "Starlight Stack",
    world: "Rainbow Heights",
    target: 9,
    speed: 0.185,
    startWidth: 158,
    lives: 3,
    perfectTolerance: 6,
    background: "linear-gradient(180deg,#ede9fe 0%,#dbeafe 55%,#fdf2f8 100%)",
    colors: ["#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4", "#ec4899"],
  },
  {
    id: 10,
    name: "Peach Pulse",
    world: "Sunset Arcade",
    target: 9,
    speed: 0.195,
    startWidth: 154,
    lives: 3,
    perfectTolerance: 5,
    background: "linear-gradient(180deg,#ffedd5 0%,#fee2e2 52%,#fae8ff 100%)",
    colors: ["#fb923c", "#f97316", "#fb7185", "#f472b6", "#c084fc"],
  },
  {
    id: 11,
    name: "Violet Velocity",
    world: "Sunset Arcade",
    target: 10,
    speed: 0.205,
    startWidth: 150,
    lives: 3,
    perfectTolerance: 5,
    background: "linear-gradient(180deg,#ede9fe 0%,#fae8ff 55%,#ffe4e6 100%)",
    colors: ["#7c3aed", "#8b5cf6", "#a855f7", "#d946ef", "#f43f5e"],
  },
  {
    id: 12,
    name: "Sunset Sprint",
    world: "Sunset Arcade",
    target: 10,
    speed: 0.215,
    startWidth: 146,
    lives: 3,
    perfectTolerance: 5,
    background: "linear-gradient(180deg,#fef3c7 0%,#fed7aa 50%,#fbcfe8 100%)",
    colors: ["#f59e0b", "#f97316", "#ef4444", "#ec4899", "#8b5cf6"],
  },
  {
    id: 13,
    name: "Aurora Alley",
    world: "Neon Sky",
    target: 10,
    speed: 0.225,
    startWidth: 142,
    lives: 3,
    perfectTolerance: 4,
    background: "linear-gradient(180deg,#cffafe 0%,#ddd6fe 52%,#fbcfe8 100%)",
    colors: ["#14b8a6", "#06b6d4", "#6366f1", "#a855f7", "#ec4899"],
  },
  {
    id: 14,
    name: "Electric Garden",
    world: "Neon Sky",
    target: 10,
    speed: 0.235,
    startWidth: 138,
    lives: 3,
    perfectTolerance: 4,
    background: "linear-gradient(180deg,#dcfce7 0%,#cffafe 48%,#e9d5ff 100%)",
    colors: ["#22c55e", "#10b981", "#06b6d4", "#3b82f6", "#a855f7"],
  },
  {
    id: 15,
    name: "Neon Crown",
    world: "Neon Sky",
    target: 11,
    speed: 0.245,
    startWidth: 134,
    lives: 3,
    perfectTolerance: 4,
    background: "linear-gradient(180deg,#fef9c3 0%,#fae8ff 48%,#dbeafe 100%)",
    colors: ["#facc15", "#fb7185", "#e879f9", "#8b5cf6", "#0ea5e9"],
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalizeProgress = (value: unknown): TowerProgress => {
  if (!value || typeof value !== "object") return DEFAULT_PROGRESS;
  const candidate = value as Partial<TowerProgress>;
  const unlockedLevel = Number(candidate.unlockedLevel);
  const bestStars =
    candidate.bestStars && typeof candidate.bestStars === "object"
      ? Object.fromEntries(
          Object.entries(candidate.bestStars)
            .filter(
              ([key, stars]) =>
                Number.isFinite(Number(key)) && Number.isFinite(Number(stars)),
            )
            .map(([key, stars]) => [
              key,
              clamp(Math.round(Number(stars)), 0, 3),
            ]),
        )
      : {};

  return {
    version: 1,
    unlockedLevel: clamp(
      Number.isFinite(unlockedLevel) ? Math.round(unlockedLevel) : 1,
      1,
      LEVELS.length,
    ),
    bestStars,
    pendingGateLevel:
      Number.isFinite(candidate.pendingGateLevel) &&
      Number(candidate.pendingGateLevel) >= 1 &&
      Number(candidate.pendingGateLevel) < LEVELS.length
        ? Number(candidate.pendingGateLevel)
        : null,
  };
};

const starsForLevel = (
  remainingLives: number,
  maxLives: number,
  perfects: number,
  target: number,
) => {
  if (remainingLives === maxLives && perfects >= Math.ceil(target * 0.4)) {
    return 3;
  }
  if (remainingLives >= 2 || perfects >= Math.ceil(target * 0.25)) return 2;
  return 1;
};

export default function NeonTowerGame() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const activeXRef = useRef(0);
  const activeWidthRef = useRef(180);
  const directionRef = useRef<1 | -1>(1);
  const dropBlockRef = useRef<() => void>(() => undefined);
  const progressKey = useMemo(
    () => `osteps:neon-tower:progress:${currentUser?.id ?? "guest"}`,
    [currentUser?.id],
  );
  const {
    checkoutError,
    endPass,
    isPreview,
    isRestored: isPassRestored,
    isStarting,
    isWalletLoading,
    isWalletUnavailable,
    passActive,
    passExpiresAt,
    startPass,
    walletBalance,
  } = useArcadePass({
    gameId: "neon-tower",
    gameTitle: "Neon Tower",
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
  const [progress, setProgress] = useState<TowerProgress>(DEFAULT_PROGRESS);
  const [isProgressRestored, setIsProgressRestored] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [settledBlocks, setSettledBlocks] = useState<TowerBlock[]>([]);
  const [activeX, setActiveX] = useState(0);
  const [activeWidth, setActiveWidth] = useState(180);
  const [lives, setLives] = useState(3);
  const [perfects, setPerfects] = useState(0);
  const [combo, setCombo] = useState(0);
  const [levelStars, setLevelStars] = useState(0);
  const [paused, setPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notice, setNotice] = useState(
    "Tap the board or press Space to drop a block.",
  );

  const level = LEVELS[currentLevel - 1] ?? LEVELS[0];
  const floorsBuilt = Math.max(0, settledBlocks.length - 1);
  const totalStars = Object.values(progress.bestStars).reduce(
    (sum, stars) => sum + stars,
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

  const saveProgress = (nextProgress: TowerProgress) => {
    window.localStorage.setItem(progressKey, JSON.stringify(nextProgress));
    setProgress(nextProgress);
  };

  const playSound = (kind: SoundKind) => {
    if (!soundEnabled || typeof window === "undefined") return;

    const context =
      audioContextRef.current ??
      new window.AudioContext({ latencyHint: "interactive" });
    audioContextRef.current = context;
    const notes = {
      drop: [330],
      perfect: [660, 880],
      miss: [190, 145],
      win: [523, 659, 784, 1047],
    }[kind];
    const now = context.currentTime;

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === "miss" ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.07);
      gain.gain.setValueAtTime(0.0001, now + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(
        kind === "drop" ? 0.035 : 0.08,
        now + index * 0.07 + 0.01,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.07 + 0.22);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + index * 0.07);
      oscillator.stop(now + index * 0.07 + 0.24);
    });
  };

  const positionActiveBlock = (width: number, fromRight: boolean) => {
    const nextX = fromRight ? GAME_WIDTH - width : 0;
    const nextDirection = fromRight ? -1 : 1;
    activeWidthRef.current = width;
    activeXRef.current = nextX;
    directionRef.current = nextDirection;
    setActiveWidth(width);
    setActiveX(nextX);
  };

  const beginLevel = (levelNumber: number, allowLocked = false) => {
    const nextLevel = LEVELS[levelNumber - 1];
    if (!nextLevel || (!allowLocked && levelNumber > progress.unlockedLevel)) {
      return;
    }

    const base: TowerBlock = {
      id: 0,
      x: (GAME_WIDTH - nextLevel.startWidth) / 2,
      width: nextLevel.startWidth,
      color: nextLevel.colors[0],
    };
    setCurrentLevel(levelNumber);
    setSettledBlocks([base]);
    setLives(nextLevel.lives);
    setPerfects(0);
    setCombo(0);
    setLevelStars(0);
    setPaused(false);
    setNotice("Tap the board or press Space to drop a block.");
    positionActiveBlock(nextLevel.startWidth, false);
    setStage("playing");
  };

  const completeLevel = (nextSettled: TowerBlock[], nextPerfects: number) => {
    const stars = starsForLevel(lives, level.lives, nextPerfects, level.target);
    const needsGate =
      currentLevel < LEVELS.length && currentLevel >= progress.unlockedLevel;
    const nextProgress: TowerProgress = {
      version: 1,
      unlockedLevel: progress.unlockedLevel,
      bestStars: {
        ...progress.bestStars,
        [String(currentLevel)]: Math.max(
          stars,
          progress.bestStars[String(currentLevel)] ?? 0,
        ),
      },
      pendingGateLevel: needsGate ? currentLevel : progress.pendingGateLevel,
    };

    setSettledBlocks(nextSettled);
    setLevelStars(stars);
    setPaused(false);
    setNotice(`Level ${currentLevel} complete with ${stars} stars.`);
    saveProgress(nextProgress);
    playSound("win");
    setStage("won");
  };

  const openQuestionGate = (completedLevel: number) => {
    setCurrentLevel(completedLevel);
    void refreshQuestions();
    setStage("gate");
  };

  const passQuestionGate = () => {
    const completedLevel = progress.pendingGateLevel ?? currentLevel;
    const nextLevel = completedLevel + 1;
    const nextProgress: TowerProgress = {
      ...progress,
      unlockedLevel: Math.max(progress.unlockedLevel, nextLevel),
      pendingGateLevel: null,
    };
    saveProgress(nextProgress);
    beginLevel(nextLevel, true);
  };

  const dropBlock = useCallback(() => {
    if (stage !== "playing" || paused || settledBlocks.length === 0) return;

    const topBlock = settledBlocks[settledBlocks.length - 1];
    const movingLeft = activeXRef.current;
    const movingRight = movingLeft + activeWidthRef.current;
    const overlapLeft = Math.max(movingLeft, topBlock.x);
    const overlapRight = Math.min(movingRight, topBlock.x + topBlock.width);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth < MIN_BLOCK_WIDTH) {
      const nextLives = lives - 1;
      setLives(nextLives);
      setCombo(0);
      playSound("miss");

      if (nextLives <= 0) {
        setNotice("The tower slipped. Try the level again.");
        setStage("lost");
        return;
      }

      setNotice(
        `${nextLives} ${nextLives === 1 ? "heart" : "hearts"} left. Line up the next block.`,
      );
      positionActiveBlock(topBlock.width, directionRef.current === 1);
      return;
    }

    const isPerfect =
      Math.abs(movingLeft - topBlock.x) <= level.perfectTolerance &&
      Math.abs(activeWidthRef.current - topBlock.width) <=
        level.perfectTolerance;
    const nextWidth = isPerfect
      ? Math.min(topBlock.width + 4, level.startWidth)
      : overlapWidth;
    const nextX = isPerfect
      ? clamp(
          topBlock.x - (nextWidth - topBlock.width) / 2,
          0,
          GAME_WIDTH - nextWidth,
        )
      : overlapLeft;
    const nextPerfects = perfects + (isPerfect ? 1 : 0);
    const nextCombo = isPerfect ? combo + 1 : 0;
    const nextBlock: TowerBlock = {
      id: settledBlocks.length,
      x: nextX,
      width: nextWidth,
      color: level.colors[settledBlocks.length % level.colors.length],
    };
    const nextSettled = [...settledBlocks, nextBlock];
    const nextFloors = nextSettled.length - 1;

    setSettledBlocks(nextSettled);
    setPerfects(nextPerfects);
    setCombo(nextCombo);
    playSound(isPerfect ? "perfect" : "drop");

    if (nextFloors >= level.target) {
      completeLevel(nextSettled, nextPerfects);
      return;
    }

    setNotice(
      isPerfect
        ? `Perfect${nextCombo > 1 ? ` ×${nextCombo}` : ""}! The block grew.`
        : `${level.target - nextFloors} blocks to the finish.`,
    );
    positionActiveBlock(nextWidth, nextFloors % 2 === 1);
  }, [combo, level, lives, paused, perfects, settledBlocks, stage]);

  dropBlockRef.current = dropBlock;

  useEffect(() => {
    if (stage !== "playing" || paused) return;

    lastFrameRef.current = 0;
    const animate = (time: number) => {
      if (lastFrameRef.current === 0) lastFrameRef.current = time;
      const delta = Math.min(time - lastFrameRef.current, 32);
      lastFrameRef.current = time;
      const maxX = GAME_WIDTH - activeWidthRef.current;
      let nextX =
        activeXRef.current + directionRef.current * level.speed * delta;

      if (nextX >= maxX) {
        nextX = maxX;
        directionRef.current = -1;
      } else if (nextX <= 0) {
        nextX = 0;
        directionRef.current = 1;
      }

      activeXRef.current = nextX;
      setActiveX(nextX);
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [level.speed, paused, stage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === " " || event.key === "Enter") && stage === "playing") {
        event.preventDefault();
        dropBlockRef.current();
      } else if (event.key.toLowerCase() === "p" && stage === "playing") {
        event.preventDefault();
        setPaused((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && stage === "playing") setPaused(true);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [stage]);

  const enterArcade = async () => {
    const started = await startPass();
    if (started) setStage("levels");
  };

  const closePass = () => {
    endPass();
    setStage("lobby");
  };

  if (!isPassRestored || !isProgressRestored) {
    return (
      <ArcadeShell
        title="Neon Tower"
        subtitle="Loading your arcade progress"
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <div className="flex min-h-[520px] items-center justify-center">
          <div className="text-center">
            <Sparkles className="mx-auto h-9 w-9 animate-pulse text-fuchsia-500" />
            <p className="mt-3 text-sm font-black text-slate-700">
              Lighting the tower…
            </p>
          </div>
        </div>
      </ArcadeShell>
    );
  }

  if (stage === "lobby") {
    return (
      <ArcadeShell
        title="Neon Tower"
        subtitle="One tap. Perfect timing. Reach the sky."
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[480px] overflow-hidden rounded-[28px] bg-gradient-to-b from-cyan-200 via-sky-100 to-fuchsia-100 p-6">
            <div className="absolute left-8 top-10 h-20 w-20 rounded-full bg-yellow-200 shadow-[0_0_60px_rgba(250,204,21,0.5)]" />
            <div className="absolute right-8 top-16 h-4 w-4 rounded-full bg-white shadow-[0_0_30px_white]" />
            <div className="absolute right-24 top-28 h-3 w-3 rounded-full bg-white shadow-[0_0_24px_white]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-700 shadow-sm">
                <Zap className="h-3.5 w-3.5" />
                Lightweight arcade
              </span>
              <h1 className="mt-5 max-w-md text-4xl font-black leading-none text-slate-900 sm:text-5xl">
                Stack bright.
                <span className="block bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Touch the sky.
                </span>
              </h1>
              <p className="mt-4 max-w-md text-sm font-bold leading-6 text-slate-600">
                Drop each moving block at the perfect moment. Build through five
                colorful worlds and claim the Neon Crown.
              </p>
            </div>

            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col-reverse items-center">
              {[210, 190, 174, 156, 136, 118, 98].map((width, index) => (
                <div
                  key={width}
                  className="h-9 rounded-xl border-2 border-white/80 shadow-[0_8px_18px_rgba(14,116,144,0.2)]"
                  style={{
                    width,
                    backgroundColor: LEVELS[0].colors[index % 5],
                    transform: `translateX(${index % 2 === 0 ? -4 : 5}px)`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[28px] border border-white bg-white/85 p-6 shadow-xl shadow-cyan-900/5 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-600">
              Your arcade pass
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              15 levels. Every retry included.
            </h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["15", "Levels"],
                ["5", "Worlds"],
                ["45s", "Quick play"],
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
                  <Play className="h-4 w-4" />
                </span>
                Tap, click, Space, or Enter to drop
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700">
                  <Star className="h-4 w-4" />
                </span>
                Earn up to three stars on every level
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Coins className="h-4 w-4" />
                </span>
                One pass stays active for two hours
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
              className="mt-6 flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 px-6 text-base font-black text-white shadow-[0_16px_34px_rgba(79,70,229,0.28)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
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
                : isWalletUnavailable
                  ? "Coin balance unavailable — reconnect and try again."
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
        title="Neon Tower"
        subtitle="Five correct answers unlock the next level"
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <ArcadeQuestionGate
          gameId="neon-tower"
          gameTitle="Neon Tower"
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
        title="Neon Tower"
        subtitle={`${totalStars}/${LEVELS.length * 3} stars collected`}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <div className="rounded-[26px] border border-white bg-white/80 p-5 shadow-lg shadow-cyan-900/5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">
                Level map
              </p>
              <h2 className="mt-1 text-3xl font-black text-slate-900">
                Climb to the Neon Crown
              </h2>
              <p className="mt-2 text-sm font-bold text-slate-500">
                Arcade pass active
                {minutesRemaining
                  ? ` · about ${minutesRemaining} min left`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={closePass}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
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
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => beginLevel(item.id)}
                  disabled={!unlocked}
                  className="group relative min-h-[150px] overflow-hidden rounded-[22px] border border-white p-4 text-left shadow-md transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:grayscale"
                  style={{ background: item.background }}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-sm font-black text-slate-800 shadow-sm">
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
                  <p className="mt-7 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                    {item.world}
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[10px] font-bold text-slate-600">
                    {item.target} blocks
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
        title="Neon Tower"
        subtitle="The Neon Crown is yours"
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled((current) => !current)}
      >
        <div className="flex min-h-[560px] items-center justify-center rounded-[28px] bg-gradient-to-br from-yellow-100 via-fuchsia-100 to-cyan-100 p-6 text-center">
          <div className="max-w-lg">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-gradient-to-br from-amber-300 via-fuchsia-400 to-cyan-400 text-white shadow-[0_20px_50px_rgba(217,70,239,0.3)]">
              <Trophy className="h-12 w-12" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-fuchsia-600">
              Tower champion
            </p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">
              You reached the Neon Crown!
            </h2>
            <p className="mt-3 text-base font-bold leading-7 text-slate-600">
              Replay levels to collect every star and sharpen your perfect-drop
              streak.
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

  const activeBottom = 48 + settledBlocks.length * 29;

  return (
    <ArcadeShell
      title={`Neon Tower · Level ${currentLevel}`}
      subtitle={`${level.world} · ${level.name}`}
      paused={paused}
      showPause={stage === "playing"}
      soundEnabled={soundEnabled}
      onPauseToggle={() => setPaused((current) => !current)}
      onSoundToggle={() => setSoundEnabled((current) => !current)}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <div className="mb-3 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white px-3 py-2.5 text-center shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Height
              </p>
              <p className="mt-0.5 text-lg font-black text-slate-900">
                {floorsBuilt}/{level.target}
              </p>
            </div>
            <div className="rounded-2xl bg-white px-3 py-2.5 text-center shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Hearts
              </p>
              <p className="mt-0.5 text-lg font-black text-rose-500">
                {"♥".repeat(Math.max(0, lives))}
              </p>
            </div>
            <div className="rounded-2xl bg-white px-3 py-2.5 text-center shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Perfect
              </p>
              <p className="mt-0.5 text-lg font-black text-fuchsia-600">
                {perfects}
              </p>
            </div>
          </div>

          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              dropBlock();
            }}
            disabled={stage !== "playing" || paused}
            className="relative mx-auto block h-[470px] w-full max-w-[390px] touch-manipulation overflow-hidden rounded-[28px] border-4 border-white text-left shadow-[0_24px_55px_rgba(14,116,144,0.18)] disabled:cursor-default"
            style={{ background: level.background }}
            aria-label="Drop moving block"
          >
            <span className="absolute left-8 top-10 h-16 w-16 rounded-full bg-white/70 shadow-[0_0_50px_rgba(255,255,255,0.9)]" />
            <span className="absolute right-10 top-16 h-3 w-3 rounded-full bg-white shadow-[0_0_18px_white]" />
            <span className="absolute right-24 top-32 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_16px_white]" />
            <span className="absolute left-16 top-40 h-2 w-2 rounded-full bg-white shadow-[0_0_16px_white]" />

            <span className="absolute inset-x-0 bottom-0 h-12 bg-white/35 backdrop-blur-sm" />
            <span className="absolute bottom-8 left-1/2 h-3 w-[78%] -translate-x-1/2 rounded-full bg-slate-900/15 blur-sm" />

            {settledBlocks.map((block, index) => (
              <span
                key={block.id}
                className="absolute h-[26px] rounded-[9px] border-2 border-white/80 shadow-[0_8px_14px_rgba(15,23,42,0.16)] transition-all duration-150"
                style={{
                  left: `${(block.x / GAME_WIDTH) * 100}%`,
                  width: `${(block.width / GAME_WIDTH) * 100}%`,
                  bottom: 48 + index * 29,
                  backgroundColor: block.color,
                }}
              />
            ))}

            {stage === "playing" ? (
              <span
                className="absolute h-[26px] rounded-[9px] border-2 border-white shadow-[0_0_26px_rgba(255,255,255,0.9)]"
                style={{
                  left: `${(activeX / GAME_WIDTH) * 100}%`,
                  width: `${(activeWidth / GAME_WIDTH) * 100}%`,
                  bottom: activeBottom,
                  backgroundColor:
                    level.colors[settledBlocks.length % level.colors.length],
                }}
              />
            ) : null}

            {paused ? (
              <span className="absolute inset-0 flex items-center justify-center bg-white/65 backdrop-blur-sm">
                <span className="rounded-3xl bg-slate-900 px-7 py-5 text-center text-white shadow-2xl">
                  <span className="block text-2xl font-black">Paused</span>
                  <span className="mt-1 block text-xs font-bold text-slate-300">
                    Tap Resume or press P
                  </span>
                </span>
              </span>
            ) : null}
          </button>

          <p
            className="mt-3 min-h-6 text-center text-sm font-black text-slate-700"
            aria-live="polite"
          >
            {notice}
          </p>

          {stage === "playing" ? (
            <button
              type="button"
              onClick={dropBlock}
              disabled={paused}
              className="mx-auto mt-2 flex h-14 w-full max-w-[390px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 text-base font-black text-white shadow-[0_14px_30px_rgba(79,70,229,0.28)] transition active:scale-[0.98] disabled:opacity-50"
            >
              <Zap className="h-5 w-5 fill-current" />
              Drop block
            </button>
          ) : null}
        </div>

        <aside className="flex flex-col gap-3">
          <div className="rounded-[24px] border border-white bg-white/85 p-5 shadow-lg shadow-cyan-900/5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
              Level goal
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              {level.name}
            </h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
              Stack {level.target} blocks. Perfect drops protect your width and
              grow your combo.
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all"
                style={{
                  width: `${Math.min(100, (floorsBuilt / level.target) * 100)}%`,
                }}
              />
            </div>
            {combo > 1 ? (
              <div className="mt-4 rounded-2xl bg-fuchsia-50 px-4 py-3 text-center">
                <p className="text-xs font-black uppercase tracking-wide text-fuchsia-600">
                  Perfect streak
                </p>
                <p className="text-3xl font-black text-fuchsia-700">×{combo}</p>
              </div>
            ) : null}
          </div>

          {stage === "won" ? (
            <div className="rounded-[24px] bg-gradient-to-br from-amber-100 via-white to-fuchsia-100 p-5 text-center shadow-lg">
              <Trophy className="mx-auto h-9 w-9 text-amber-500" />
              <h3 className="mt-2 text-xl font-black text-slate-900">
                Level complete!
              </h3>
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
                  ? "Claim Neon Crown"
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
                So close!
              </h3>
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
            <div className="rounded-[24px] border border-white bg-white/70 p-4 text-xs font-bold leading-5 text-slate-500">
              <p className="font-black text-slate-700">Controls</p>
              <p className="mt-1">
                Phone/tablet: tap the tower or Drop button.
              </p>
              <p>Computer: Space or Enter to drop, P to pause.</p>
            </div>
          ) : null}
        </aside>
      </div>
    </ArcadeShell>
  );
}
