"use client";

import axios from "axios";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Coins,
  Compass,
  KeyRound,
  Lightbulb,
  LockKeyhole,
  Megaphone,
  Mountain,
  Play,
  RotateCcw,
  Sailboat,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RootState } from "@/store/store";
import {
  fetchStudentGamePassStatus,
  fetchStudentWalletBalance,
  purchaseStudentGamePass,
} from "@/services/studentWalletApi";
import { STUDENT_COINS_UPDATED_EVENT } from "@/components/dashboard/StudentCoinWallet";
import ArcadeQuestionGate from "./ArcadeQuestionGate";
import GameFullscreenButton from "./GameFullscreenButton";
import HallOfSignsLevel, {
  createHallProgress,
  HallProgress,
  normalizeHallProgress,
} from "./HallOfSignsLevel";
import useArcadeQuestionPool from "./useArcadeQuestionPool";
import {
  LostLibraryClue,
  LostLibraryClueKind,
  STORIES_OF_THE_PROPHETS_PACK,
} from "./lost-library-content";

type GameStage =
  | "lobby"
  | "room"
  | "puzzle"
  | "level-one-complete"
  | "question-gate"
  | "hall"
  | "complete";

type Position = {
  x: number;
  y: number;
};

type SavedAdventure = {
  version: 2;
  stage: GameStage;
  runId: string;
  purchasePending: boolean;
  player: Position;
  foundClueIds: string[];
  orderedClueIds: string[];
  attempts: number;
  levelOneComplete: boolean;
  hallStarted: boolean;
  hallProgress: HallProgress;
};

type CheckoutErrorData = {
  message?: string;
  errors?: {
    amount?: string[];
  };
};

const PACK = STORIES_OF_THE_PROPHETS_PACK;
const GAME_ID = "lost-library";
const START_POSITION: Position = { x: 50, y: 78 };
const INTERACTION_DISTANCE = 14;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const distanceBetween = (left: Position, right: Position) =>
  Math.sqrt((left.x - right.x) ** 2 + (left.y - right.y) ** 2);

const isGameStage = (value: unknown): value is GameStage =>
  value === "lobby" ||
  value === "room" ||
  value === "puzzle" ||
  value === "level-one-complete" ||
  value === "question-gate" ||
  value === "hall" ||
  value === "complete";

const clueIcon = (kind: LostLibraryClueKind, className = "h-5 w-5") => {
  if (kind === "call") return <Megaphone className={className} />;
  if (kind === "ark") return <Sailboat className={className} />;
  if (kind === "flood") return <CloudRain className={className} />;
  return <Mountain className={className} />;
};

const checkoutErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<CheckoutErrorData>(error)) {
    const amountError = error.response?.data?.errors?.amount?.[0];
    if (amountError) return amountError;
    if (error.response?.status === 404 || error.response?.status === 405) {
      return "Coin checkout is not active yet. Ask your school administrator to enable the student wallet service.";
    }
    if (error.response?.data?.message) return error.response.data.message;
  }

  return "The library could not confirm your coin payment. Your game did not start, so please try again.";
};

export default function LostLibraryGame() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const audioContextRef = useRef<AudioContext | null>(null);
  const role = String(currentUser?.role ?? "").trim().toUpperCase();
  const isStudent = role === "STUDENT";
  const studentId = String(currentUser?.student ?? "");
  const storageKey = useMemo(
    () => `osteps:lost-library:${PACK.room.id}:${currentUser?.id ?? "guest"}`,
    [currentUser?.id],
  );

  const [stage, setStage] = useState<GameStage>("lobby");
  const [runId, setRunId] = useState<string | null>(null);
  const [purchasePending, setPurchasePending] = useState(false);
  const [player, setPlayer] = useState<Position>(START_POSITION);
  const [foundClueIds, setFoundClueIds] = useState<string[]>([]);
  const [orderedClueIds, setOrderedClueIds] = useState<string[]>(
    PACK.room.startingOrder,
  );
  const [attempts, setAttempts] = useState(0);
  const [activeClue, setActiveClue] = useState<LostLibraryClue | null>(null);
  const [notice, setNotice] = useState(
    "Move with the arrow keys or the compass. Search for glowing objects.",
  );
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRestored, setIsRestored] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [levelOneComplete, setLevelOneComplete] = useState(false);
  const [hallStarted, setHallStarted] = useState(false);
  const [hallProgress, setHallProgress] =
    useState<HallProgress>(createHallProgress);
  const {
    questions,
    isLoading: questionsLoading,
    errorMessage: questionsError,
    isPreview: questionsPreview,
    subjectName,
    refreshQuestions,
  } = useArcadeQuestionPool();

  const {
    data: wallet,
    isLoading: isWalletLoading,
    isError: isWalletUnavailable,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ["student-coin-wallet", studentId],
    queryFn: fetchStudentWalletBalance,
    enabled: isStudent && Boolean(studentId),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const walletBalance = Number(wallet?.coin_balance ?? 0);
  const hasActiveRun = Boolean(runId && !purchasePending);
  const nearestUnfoundClue = PACK.room.clues
    .filter((clue) => !foundClueIds.includes(clue.id))
    .map((clue) => ({
      clue,
      distance: distanceBetween(player, clue.position),
    }))
    .sort((left, right) => left.distance - right.distance)[0];
  const canInteract =
    Boolean(nearestUnfoundClue) &&
    nearestUnfoundClue.distance <= INTERACTION_DISTANCE;

  const playSound = (kind: "move" | "clue" | "success" | "wrong" | "coin") => {
    if (!soundEnabled || typeof window === "undefined") return;

    const AudioContextConstructor = window.AudioContext;
    const context =
      audioContextRef.current ??
      new AudioContextConstructor({
        latencyHint: "interactive",
      });
    audioContextRef.current = context;

    const frequencies = {
      move: [260],
      clue: [523, 659, 784],
      success: [523, 659, 784, 1047],
      wrong: [220, 196],
      coin: [880, 1175],
    }[kind];
    const now = context.currentTime;

    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === "wrong" ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.08);
      gain.gain.setValueAtTime(0.0001, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(
        kind === "move" ? 0.025 : 0.09,
        now + index * 0.08 + 0.015,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + index * 0.08 + (kind === "move" ? 0.08 : 0.28),
      );
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + index * 0.08);
      oscillator.stop(now + index * 0.08 + (kind === "move" ? 0.09 : 0.3));
    });
  };

  useEffect(() => {
    let cancelled = false;
    setIsRestored(false);
    if (!currentUser?.id) {
      setIsRestored(true);
      return () => {
        cancelled = true;
      };
    }

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      setIsRestored(true);
      return () => {
        cancelled = true;
      };
    }

    const restoreAdventure = async () => {
      try {
        const saved = JSON.parse(raw) as Partial<SavedAdventure>;
        if (typeof saved.runId !== "string") {
          throw new Error("The saved adventure has no paid run.");
        }

        if (isStudent) {
          if (!studentId) {
            throw new Error("A student profile is required.");
          }
          const verified = await fetchStudentGamePassStatus({
            game_id: GAME_ID,
            run_id: saved.runId,
          }).catch((error: unknown) => {
            setRunId(saved.runId ?? null);
            setPurchasePending(true);
            setStage("lobby");
            setCheckoutError(checkoutErrorMessage(error));
            return null;
          });
          if (!verified) return;
          if (!verified.active) {
            window.localStorage.removeItem(storageKey);
            setRunId(null);
            setPurchasePending(false);
            setStage("lobby");
            return;
          }
        }

        const isLegacyLevelOneComplete =
          saved.version !== 2 && saved.stage === "complete";
        const validClueIds = new Set(PACK.room.clues.map((clue) => clue.id));
        const restoredFound = Array.isArray(saved.foundClueIds)
          ? saved.foundClueIds.filter((id) => validClueIds.has(id))
          : [];
        const restoredOrder =
          Array.isArray(saved.orderedClueIds) &&
          saved.orderedClueIds.length === PACK.room.clues.length &&
          saved.orderedClueIds.every((id) => validClueIds.has(id))
            ? saved.orderedClueIds
            : PACK.room.startingOrder;

        setRunId(saved.runId);
        setPurchasePending(false);
        if (isLegacyLevelOneComplete) {
          setStage("level-one-complete");
        } else if (isGameStage(saved.stage)) {
          setStage(saved.stage);
        }
        if (
          saved.player &&
          Number.isFinite(saved.player.x) &&
          Number.isFinite(saved.player.y)
        ) {
          setPlayer({
            x: clamp(saved.player.x, 5, 95),
            y: clamp(saved.player.y, 42, 82),
          });
        }
        setFoundClueIds(restoredFound);
        setOrderedClueIds(restoredOrder);
        setAttempts(
          Number.isFinite(saved.attempts)
            ? Math.max(0, saved.attempts ?? 0)
            : 0,
        );
        const restoredHallProgress = normalizeHallProgress(saved.hallProgress);
        setLevelOneComplete(
          Boolean(saved.levelOneComplete) ||
            isLegacyLevelOneComplete ||
            restoredHallProgress.completed,
        );
        setHallStarted(
          Boolean(saved.hallStarted) || restoredHallProgress.completed,
        );
        setHallProgress(restoredHallProgress);
        if (saved.stage !== "lobby") {
          setNotice("Welcome back. Your adventure has been restored.");
        }
      } catch (error) {
        window.localStorage.removeItem(storageKey);
        setRunId(null);
        setPurchasePending(false);
        setStage("lobby");
        if (isStudent) setCheckoutError(checkoutErrorMessage(error));
      } finally {
        if (!cancelled) setIsRestored(true);
      }
    };

    void restoreAdventure();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, isStudent, storageKey, studentId]);

  useEffect(() => {
    if (!isRestored || !runId || stage === "lobby") return;

    const saved: SavedAdventure = {
      version: 2,
      stage,
      runId,
      purchasePending: false,
      player,
      foundClueIds,
      orderedClueIds,
      attempts,
      levelOneComplete,
      hallStarted,
      hallProgress,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(saved));
  }, [
    attempts,
    foundClueIds,
    hallProgress,
    hallStarted,
    isRestored,
    levelOneComplete,
    orderedClueIds,
    player,
    runId,
    stage,
    storageKey,
  ]);

  const movePlayer = (deltaX: number, deltaY: number) => {
    if (stage !== "room" || activeClue) return;
    setPlayer((current) => ({
      x: clamp(current.x + deltaX, 5, 95),
      y: clamp(current.y + deltaY, 42, 82),
    }));
    playSound("move");
  };

  const collectClue = (clue: LostLibraryClue) => {
    if (foundClueIds.includes(clue.id)) return;

    const distance = distanceBetween(player, clue.position);
    if (distance > INTERACTION_DISTANCE) {
      setNotice(`Move closer to ${clue.title.toLowerCase()} to inspect it.`);
      return;
    }

    const nextFound = [...foundClueIds, clue.id];
    setFoundClueIds(nextFound);
    setActiveClue(clue);
    setNotice(
      nextFound.length === PACK.room.clues.length
        ? "You found every clue. The timeline puzzle is ready."
        : `${nextFound.length} of ${PACK.room.clues.length} scroll seals found.`,
    );
    playSound("clue");
  };

  const inspectNearestClue = () => {
    if (!nearestUnfoundClue) {
      setStage("puzzle");
      return;
    }
    if (!canInteract) {
      setNotice("No clue is close enough. Follow the nearest golden glow.");
      return;
    }
    collectClue(nearestUnfoundClue.clue);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (stage !== "room" || activeClue) return;
      const key = event.key.toLowerCase();

      if (key === "arrowleft" || key === "a") {
        event.preventDefault();
        movePlayer(-4, 0);
      } else if (key === "arrowright" || key === "d") {
        event.preventDefault();
        movePlayer(4, 0);
      } else if (key === "arrowup" || key === "w") {
        event.preventDefault();
        movePlayer(0, -4);
      } else if (key === "arrowdown" || key === "s") {
        event.preventDefault();
        movePlayer(0, 4);
      } else if (key === " " || key === "enter") {
        event.preventDefault();
        inspectNearestClue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const startAdventure = async () => {
    setCheckoutError(null);
    setIsStarting(true);

    if (hasActiveRun) {
      const resumeStage: GameStage = hallProgress.completed
        ? "complete"
        : hallStarted
          ? "hall"
          : levelOneComplete
            ? "level-one-complete"
            : foundClueIds.length === PACK.room.clues.length
              ? "puzzle"
              : "room";
      setStage(resumeStage);
      setIsStarting(false);
      return;
    }

    const isPendingRetry = Boolean(runId && purchasePending);
    const nextRunId = runId ?? crypto.randomUUID();
    setRunId(nextRunId);

    if (isStudent) {
      if (!studentId) {
        setCheckoutError("A student profile is required to enter this game.");
        setIsStarting(false);
        return;
      }
      if (!isPendingRetry) {
        const walletResult = await refetchWallet();
        if (walletResult.error) {
          setCheckoutError(checkoutErrorMessage(walletResult.error));
          setIsStarting(false);
          return;
        }
        const balance = Number(walletResult.data?.coin_balance ?? 0);
        if (balance < PACK.entryCost) {
          setCheckoutError(
            `You need ${PACK.entryCost} coins to enter. Complete more tracker topics to fill your pocket.`,
          );
          setIsStarting(false);
          return;
        }
      }

      const pendingSave: SavedAdventure = {
        version: 2,
        stage: "lobby",
        runId: nextRunId,
        purchasePending: true,
        player: START_POSITION,
        foundClueIds: [],
        orderedClueIds: PACK.room.startingOrder,
        attempts: 0,
        levelOneComplete: false,
        hallStarted: false,
        hallProgress: createHallProgress(),
      };
      window.localStorage.setItem(storageKey, JSON.stringify(pendingSave));
      setPurchasePending(true);

      try {
        const gamePass = await purchaseStudentGamePass({
          game_id: GAME_ID,
          run_id: nextRunId,
        });
        queryClient.setQueryData(
          ["student-coin-wallet", studentId],
          {
            student_id: gamePass.student_id,
            coin_balance: gamePass.coin_balance,
          },
        );
        if (gamePass.charged) {
          window.dispatchEvent(
            new CustomEvent(STUDENT_COINS_UPDATED_EVENT, {
              detail: { amount: -gamePass.entry_cost },
            }),
          );
        }
        if (!gamePass.active) {
          throw new Error("The paid adventure was not activated.");
        }
        setRunId(gamePass.run_id);
        setPurchasePending(false);
        playSound("coin");
      } catch (error) {
        setCheckoutError(checkoutErrorMessage(error));
        setIsStarting(false);
        return;
      }
    }

    setPlayer(START_POSITION);
    setFoundClueIds([]);
    setOrderedClueIds(PACK.room.startingOrder);
    setAttempts(0);
    setShowHint(false);
    setLevelOneComplete(false);
    setHallStarted(false);
    setHallProgress(createHallProgress());
    setNotice(
      "Move with the arrow keys or the compass. Search for glowing objects.",
    );
    setStage("room");
    setIsStarting(false);
  };

  const moveSequenceCard = (index: number, direction: -1 | 1) => {
    const destination = index + direction;
    if (destination < 0 || destination >= orderedClueIds.length) return;

    setOrderedClueIds((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  };

  const checkSequence = () => {
    const isCorrect = PACK.room.correctOrder.every(
      (clueId, index) => orderedClueIds[index] === clueId,
    );

    if (isCorrect) {
      setLevelOneComplete(true);
      setStage("level-one-complete");
      setNotice("The first scroll has been restored.");
      playSound("success");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setShowHint(nextAttempts >= 2);
    setNotice(
      nextAttempts >= 2
        ? "Almost there. Use the new hint, then try the sequence again."
        : "The scroll shimmered, but the events are not in the right order yet.",
    );
    playSound("wrong");
  };

  const resetAdventure = () => {
    window.localStorage.removeItem(storageKey);
    setStage("lobby");
    setRunId(null);
    setPurchasePending(false);
    setPlayer(START_POSITION);
    setFoundClueIds([]);
    setOrderedClueIds(PACK.room.startingOrder);
    setAttempts(0);
    setShowHint(false);
    setLevelOneComplete(false);
    setHallStarted(false);
    setHallProgress(createHallProgress());
    setCheckoutError(null);
    setNotice(
      "Move with the arrow keys or the compass. Search for glowing objects.",
    );
  };

  const exitRoom = () => {
    setStage("lobby");
    setCheckoutError(null);
  };

  if (!isRestored) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[32px] bg-slate-950 text-white">
        <div className="text-center">
          <Sparkles className="mx-auto h-8 w-8 animate-pulse text-amber-300" />
          <p className="mt-3 text-sm font-bold text-slate-200">
            Opening the Lost Library…
          </p>
        </div>
      </div>
    );
  }

  if (stage === "lobby") {
    return (
      <div className="overflow-hidden rounded-[32px] border border-indigo-200 bg-[#080d24] shadow-[0_30px_80px_rgba(30,27,75,0.3)]">
        <div
          className="relative min-h-[650px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,8,28,.96) 0%, rgba(5,8,28,.78) 42%, rgba(5,8,28,.18) 75%), url('/games/lost-library/library-room.webp')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d24] via-transparent to-indigo-950/20" />
          <div className="relative flex min-h-[650px] max-w-3xl flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-amber-300/40 bg-amber-300/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-amber-200 backdrop-blur">
                {PACK.subject}
              </span>
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
                Two levels playable
              </span>
            </div>

            <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">
              Escape the Lost Library
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-black leading-[1.02] text-white sm:text-5xl lg:text-6xl">
              {PACK.title}
            </h1>
            <p className="mt-3 text-xl font-bold text-amber-200">
              {PACK.subtitle}
            </p>
            <p className="mt-6 max-w-xl text-sm font-medium leading-7 text-slate-200 sm:text-base">
              Restore the first scroll inside the Gallery of the Ark, then
              continue into the Hall of Signs for visual discovery, lesson
              matching, and a magical symbol lock.
            </p>

            <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                ["Room one", "Explore and restore the timeline"],
                ["Room two", "Discover and match story signs"],
                ["One entry", "Both rooms share the same run"],
              ].map(([title, detail], index) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md"
                >
                  <span className="text-xs font-black text-amber-300">
                    0{index + 1}
                  </span>
                  <p className="mt-1 text-sm font-black text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    {detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startAdventure}
                disabled={
                  isStarting ||
                  (!hasActiveRun &&
                    isStudent &&
                    (isWalletLoading || isWalletUnavailable))
                }
                className="group inline-flex min-h-14 items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-3 text-sm font-black text-amber-950 shadow-[0_12px_34px_rgba(251,191,36,.35)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(251,191,36,.45)] disabled:cursor-not-allowed disabled:opacity-55"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/45">
                  {isStarting ? (
                    <Sparkles className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5 fill-current" />
                  )}
                </span>
                <span className="text-left">
                  <span className="block">
                    {hasActiveRun
                      ? "Continue your adventure"
                      : isStudent
                        ? purchasePending
                          ? "Resume coin checkout"
                          : `Enter for ${PACK.entryCost} coins`
                        : "Preview the adventure"}
                  </span>
                  <span className="block text-[10px] font-bold text-amber-900/70">
                    {hasActiveRun
                      ? isStudent
                        ? "Your paid run is saved and ready"
                        : "Your preview progress is saved and ready"
                      : isStudent
                        ? `${walletBalance.toLocaleString()} coins currently in your pocket`
                        : "Preview mode — both rooms are free"}
                  </span>
                </span>
              </button>

              <Link
                href="/dashboard/games"
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] px-5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/[0.14]"
              >
                <ArrowLeft className="h-4 w-4" />
                All games
              </Link>
              <GameFullscreenButton variant="dark" />
            </div>

            {isStudent && isWalletUnavailable ? (
              <button
                type="button"
                onClick={() => void refetchWallet()}
                className="mt-4 w-fit text-xs font-bold text-amber-200 underline decoration-amber-300/40 underline-offset-4"
              >
                Coin checkout is unavailable. Try connecting again.
              </button>
            ) : null}

            {checkoutError ? (
              <div
                role="alert"
                className="mt-5 max-w-xl rounded-2xl border border-rose-300/30 bg-rose-950/70 px-4 py-3 text-sm font-semibold leading-6 text-rose-100 backdrop-blur"
              >
                {checkoutError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "complete") {
    return (
      <div className="relative overflow-hidden rounded-[32px] border border-cyan-200 bg-gradient-to-br from-[#11163a] via-[#25205a] to-[#064e5a] px-6 py-14 text-center text-white shadow-[0_30px_80px_rgba(30,27,75,0.3)] sm:px-10">
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 30 }).map((_, index) => (
            <span
              key={index}
              className="absolute animate-pulse text-cyan-100"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 61) % 100}%`,
                animationDelay: `${(index % 6) * 0.2}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-cyan-100/60 bg-gradient-to-br from-cyan-300 to-indigo-400 text-indigo-950 shadow-[0_0_50px_rgba(34,211,238,.45)]">
            <Trophy className="h-11 w-11" />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-amber-300">
            Second seal restored
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            The Hall of Signs is awake!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-7 text-slate-200 sm:text-base">
            You found the true signs, matched their lessons, and opened the
            final symbol lock. Two rooms of the Lost Library now glow again.
          </p>

          <div className="mx-auto mt-8 flex w-fit gap-2 rounded-3xl border border-cyan-100/20 bg-white/[0.08] px-7 py-4 backdrop-blur">
            {[0, 1, 2].map((star) => (
              <Sparkles
                key={star}
                className="h-9 w-9 fill-amber-300 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,.75)]"
              />
            ))}
          </div>

          <div className="mx-auto mt-6 max-w-sm rounded-3xl border border-cyan-200/25 bg-cyan-300/10 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
              Room badge · 2 of 4 rooms restored
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {PACK.hall.badge}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              No leaderboard points changed. Report achievements will connect
              when the game-progress service is added.
            </p>
          </div>

          <div className="mx-auto mt-5 max-w-md rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-bold leading-5 text-slate-200">
            Next room:{" "}
            <span className="text-amber-300">Whispering Shelves</span> — coming
            in the next Lost Library level.
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={resetAdventure}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-amber-300 px-5 text-sm font-black text-amber-950 transition hover:-translate-y-0.5 hover:bg-amber-200"
            >
              <RotateCcw className="h-4 w-4" />
              Replay adventure
            </button>
            <Link
              href="/dashboard/games"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] px-5 text-sm font-bold text-white transition hover:bg-white/[0.14]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "level-one-complete") {
    return (
      <div className="relative overflow-hidden rounded-[32px] border border-amber-200 bg-gradient-to-br from-[#11163a] via-[#25205a] to-[#073b4c] px-6 py-14 text-center text-white shadow-[0_30px_80px_rgba(30,27,75,0.3)] sm:px-10">
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="absolute animate-pulse text-amber-200"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 61) % 100}%`,
                animationDelay: `${(index % 6) * 0.2}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-amber-200/60 bg-gradient-to-br from-amber-300 to-orange-400 text-amber-950 shadow-[0_0_50px_rgba(251,191,36,.45)]">
            <Trophy className="h-11 w-11" />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            First scroll restored · Room 1 of 4
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            The Gallery is glowing again!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-7 text-slate-200 sm:text-base">
            You discovered every clue and restored the story in its correct
            order. Knowledge, patience, and careful thinking opened the vault.
          </p>

          <div className="mx-auto mt-8 flex w-fit gap-2 rounded-3xl border border-amber-200/20 bg-white/[0.08] px-7 py-4 backdrop-blur">
            {[0, 1, 2].map((star) => (
              <Sparkles
                key={star}
                className="h-9 w-9 fill-amber-300 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,.75)]"
              />
            ))}
          </div>

          <div className="mx-auto mt-6 max-w-sm rounded-3xl border border-cyan-200/20 bg-cyan-300/10 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
              Room badge
            </p>
            <p className="mt-2 text-xl font-black text-white">
              {PACK.room.badge}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Your progress is saved on this device. Continue into the Hall of
              Signs without spending any more coins.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                void refreshQuestions();
                setStage("question-gate");
              }}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-indigo-400 px-5 text-sm font-black text-indigo-950 transition hover:-translate-y-0.5"
            >
              Answer 5 questions
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              href="/dashboard/games"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.08] px-5 text-sm font-bold text-white transition hover:bg-white/[0.14]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "question-gate") {
    return (
      <ArcadeQuestionGate
        gameId="lost-library"
        gameTitle="Escape the Lost Library"
        completedLevel={1}
        nextLevelLabel="Hall of Signs"
        questions={questions}
        isLoading={questionsLoading}
        errorMessage={questionsError}
        isPreview={questionsPreview}
        subjectName={subjectName}
        onPassed={() => {
          setHallStarted(true);
          setStage("hall");
        }}
        onBack={() => setStage("level-one-complete")}
        onRetryLoad={() => void refreshQuestions()}
      />
    );
  }

  if (stage === "hall") {
    return (
      <HallOfSignsLevel
        progress={hallProgress}
        onProgressChange={setHallProgress}
        onComplete={(progress) => {
          setHallProgress(progress);
          setStage("complete");
        }}
        onExit={exitRoom}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((current) => !current)}
        onSound={playSound}
      />
    );
  }

  if (stage === "puzzle") {
    return (
      <div className="overflow-hidden rounded-[32px] border border-indigo-200 bg-[#0b102c] text-white shadow-[0_30px_80px_rgba(30,27,75,0.3)]">
        <div className="border-b border-white/10 bg-white/[0.04] px-5 py-4 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                Final room puzzle
              </p>
              <h1 className="mt-1 text-xl font-black">
                Restore the Prophet Nuh timeline
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-200"
              aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-3xl border border-amber-200/20 bg-gradient-to-br from-amber-300/15 to-orange-400/5 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-amber-950 shadow-[0_0_25px_rgba(251,191,36,.25)]">
              <BookOpen className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-2xl font-black">The broken scroll</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Use the arrows to arrange the four discoveries from earliest to
              latest. Nothing is lost when you make a mistake.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                Librarian&apos;s note
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{notice}</p>
            </div>

            {showHint ? (
              <div className="mt-4 flex gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-left">
                <Lightbulb className="mt-0.5 h-5 w-5 flex-none text-cyan-300" />
                <p className="text-sm leading-6 text-cyan-50">
                  Hint: the call to worship Allah alone came before the Ark was
                  built. The new beginning came after the water receded.
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setStage("room")}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-200 hover:text-cyan-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to the gallery
            </button>
          </section>

          <section>
            <ol className="space-y-3">
              {orderedClueIds.map((clueId, index) => {
                const clue = PACK.room.clues.find(
                  (candidate) => candidate.id === clueId,
                );
                if (!clue) return null;

                return (
                  <li
                    key={clue.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3 shadow-sm"
                  >
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-400 text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-300/15 text-amber-200">
                      {clueIcon(clue.kind)}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-bold leading-6 text-slate-100">
                      {clue.sequenceLabel}
                    </span>
                    <span className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveSequenceCard(index, -1)}
                        disabled={index === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-slate-200 disabled:opacity-25"
                        aria-label={`Move ${clue.title} earlier`}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSequenceCard(index, 1)}
                        disabled={index === orderedClueIds.length - 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-slate-200 disabled:opacity-25"
                        aria-label={`Move ${clue.title} later`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </span>
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={checkSequence}
              className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-4 text-sm font-black text-amber-950 shadow-[0_12px_30px_rgba(251,191,36,.24)] transition hover:-translate-y-0.5"
            >
              <Check className="h-5 w-5" />
              Check the restored scroll
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-indigo-200 bg-[#080d24] text-white shadow-[0_30px_80px_rgba(30,27,75,0.3)]">
      <header className="border-b border-white/10 bg-[#0d1435] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-amber-950">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                {PACK.room.eyebrow}
              </p>
              <h1 className="truncate text-lg font-black">{PACK.room.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-10 items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3">
              <KeyRound className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-black text-amber-100">
                {foundClueIds.length}/{PACK.room.clues.length} clues
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-200"
              aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={exitRoom}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-200"
              aria-label="Leave the room"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-[#080d24] p-3 sm:p-5">
        <div
          className="relative mx-auto aspect-[3/2] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-cover bg-center shadow-inner"
          style={{
            backgroundImage: "url('/games/lost-library/library-room.webp')",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b22]/40 via-transparent to-indigo-950/10" />

          {Array.from({ length: 15 }).map((_, index) => (
            <span
              key={index}
              className="library-mote pointer-events-none absolute h-1 w-1 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(253,230,138,.9)]"
              style={{
                left: `${8 + ((index * 23) % 84)}%`,
                top: `${12 + ((index * 31) % 70)}%`,
                animationDelay: `${(index % 8) * 0.35}s`,
              }}
            />
          ))}

          {PACK.room.clues.map((clue) => {
            const found = foundClueIds.includes(clue.id);
            const isNear =
              !found &&
              distanceBetween(player, clue.position) <= INTERACTION_DISTANCE;

            return (
              <button
                key={clue.id}
                type="button"
                onClick={() => collectClue(clue)}
                disabled={found}
                className={`absolute z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 backdrop-blur-sm transition sm:h-14 sm:w-14 ${
                  found
                    ? "border-emerald-200/70 bg-emerald-400/70 text-white"
                    : isNear
                      ? "library-hotspot border-amber-100 bg-amber-300/85 text-amber-950 shadow-[0_0_32px_rgba(251,191,36,.95)]"
                      : "library-hotspot border-amber-200/70 bg-amber-300/35 text-amber-50 shadow-[0_0_24px_rgba(251,191,36,.65)]"
                }`}
                style={{
                  left: `${clue.position.x}%`,
                  top: `${clue.position.y}%`,
                }}
                aria-label={
                  found
                    ? `${clue.title} clue found`
                    : `Inspect ${clue.title} clue`
                }
              >
                {found ? (
                  <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  clueIcon(clue.kind, "h-5 w-5 sm:h-6 sm:w-6")
                )}
              </button>
            );
          })}

          <div
            className="pointer-events-none absolute z-30 w-[58px] -translate-x-1/2 -translate-y-[72%] transition-all duration-150 ease-linear sm:w-[82px] md:w-[96px]"
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
            }}
          >
            <img
              src="/games/lost-library/explorer.webp"
              alt="Your library explorer"
              className="h-auto w-full drop-shadow-[0_14px_8px_rgba(0,0,0,.5)]"
            />
            <span className="absolute bottom-0 left-1/2 h-2 w-2/3 -translate-x-1/2 rounded-full bg-black/45 blur-[3px]" />
          </div>

          <div className="absolute bottom-3 left-3 z-40 max-w-[72%] rounded-2xl border border-white/15 bg-slate-950/75 px-3 py-2 text-[10px] font-bold leading-4 text-white shadow-lg backdrop-blur-md sm:bottom-5 sm:left-5 sm:max-w-md sm:px-4 sm:py-3 sm:text-xs sm:leading-5">
            <span className="mr-2 text-amber-300">Librarian:</span>
            {notice}
          </div>

          <div className="absolute bottom-3 right-3 z-40 grid grid-cols-3 gap-1 rounded-2xl border border-white/15 bg-slate-950/75 p-2 shadow-lg backdrop-blur-md sm:bottom-5 sm:right-5">
            <span />
            <button
              type="button"
              onClick={() => movePlayer(0, -4)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 sm:h-10 sm:w-10"
              aria-label="Move up"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <span />
            <button
              type="button"
              onClick={() => movePlayer(-4, 0)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 sm:h-10 sm:w-10"
              aria-label="Move left"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={inspectNearestClue}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition sm:h-10 sm:w-10 ${
                canInteract
                  ? "bg-amber-300 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,.65)]"
                  : "bg-cyan-300/15 text-cyan-100"
              }`}
              aria-label="Inspect nearby clue"
            >
              <Compass className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => movePlayer(4, 0)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 sm:h-10 sm:w-10"
              aria-label="Move right"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <span />
            <button
              type="button"
              onClick={() => movePlayer(0, 4)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 sm:h-10 sm:w-10"
              aria-label="Move down"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <span />
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Compass className="h-4 w-4 text-cyan-300" />
            Keyboard: arrows or WASD · Space to inspect
          </div>
          {foundClueIds.length === PACK.room.clues.length ? (
            <button
              type="button"
              onClick={() => setStage("puzzle")}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-amber-300 px-4 text-xs font-black text-amber-950 shadow-[0_8px_24px_rgba(251,191,36,.25)]"
            >
              <BookOpen className="h-4 w-4" />
              Restore the scroll
            </button>
          ) : (
            <p className="text-xs font-bold text-amber-100">
              {PACK.room.objective}
            </p>
          )}
        </div>
      </div>

      {activeClue ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clue-title"
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-amber-200/40 bg-gradient-to-br from-[#18204d] to-[#0d1435] p-6 text-center shadow-[0_30px_90px_rgba(0,0,0,.55)]"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-amber-300 to-orange-400 text-amber-950 shadow-[0_0_35px_rgba(251,191,36,.35)]">
              {clueIcon(activeClue.kind, "h-9 w-9")}
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
              Scroll seal discovered
            </p>
            <h2 id="clue-title" className="mt-2 text-2xl font-black text-white">
              {activeClue.title}
            </h2>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-200">
              {activeClue.discovery}
            </p>
            <button
              type="button"
              onClick={() => {
                const allFound = foundClueIds.length === PACK.room.clues.length;
                setActiveClue(null);
                if (allFound) setStage("puzzle");
              }}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 text-sm font-black text-amber-950 transition hover:bg-amber-200"
            >
              <Sparkles className="h-4 w-4" />
              Add clue to the scroll
            </button>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .library-hotspot {
          animation: library-pulse 1.8s ease-in-out infinite;
        }

        .library-mote {
          animation: library-float 4.5s ease-in-out infinite;
        }

        @keyframes library-pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.12);
          }
        }

        @keyframes library-float {
          0%,
          100% {
            opacity: 0.25;
            transform: translateY(7px);
          }
          50% {
            opacity: 1;
            transform: translateY(-9px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .library-hotspot,
          .library-mote {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
