"use client";

import {
  Check,
  ChevronRight,
  Crown,
  Flame,
  KeyRound,
  Lightbulb,
  LockKeyhole,
  Megaphone,
  Mountain,
  Sailboat,
  Sparkles,
  Sword,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  HallSign,
  HallSignKind,
  STORIES_OF_THE_PROPHETS_PACK,
} from "./lost-library-content";

export type HallPhase = "search" | "match" | "lock" | "complete";

export type HallMatchSelection = {
  signId: string;
  meaningId: string;
};

export type HallProgress = {
  phase: HallPhase;
  foundSignIds: string[];
  matchSelections: HallMatchSelection[];
  matchAttempts: number;
  lockOrder: string[];
  lockAttempts: number;
  completed: boolean;
};

type SoundKind = "move" | "clue" | "success" | "wrong" | "coin";

type HallOfSignsLevelProps = {
  progress: HallProgress;
  onProgressChange: (progress: HallProgress) => void;
  onComplete: (progress: HallProgress) => void;
  onExit: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSound: (kind: SoundKind) => void;
};

const HALL = STORIES_OF_THE_PROPHETS_PACK.hall;

export const createHallProgress = (): HallProgress => ({
  phase: "search",
  foundSignIds: [],
  matchSelections: [],
  matchAttempts: 0,
  lockOrder: [...HALL.startingLock],
  lockAttempts: 0,
  completed: false,
});

const isHallPhase = (value: unknown): value is HallPhase =>
  value === "search" ||
  value === "match" ||
  value === "lock" ||
  value === "complete";

export const normalizeHallProgress = (value: unknown): HallProgress => {
  const fallback = createHallProgress();
  if (!value || typeof value !== "object") return fallback;

  const saved = value as Partial<HallProgress>;
  const storySignIds = new Set(
    HALL.signs.filter((sign) => sign.isStorySign).map((sign) => sign.id)
  );
  const validMeaningIds = new Set(
    HALL.meanings.map((meaning) => meaning.id)
  );
  const foundSignIds = Array.isArray(saved.foundSignIds)
    ? [...new Set(saved.foundSignIds.filter((id) => storySignIds.has(id)))]
    : [];
  const matchSelections = (
    Array.isArray(saved.matchSelections) ? saved.matchSelections : []
  ).reduce<HallMatchSelection[]>((selections, selection) => {
    if (
      !selection ||
      !storySignIds.has(selection.signId) ||
      !validMeaningIds.has(selection.meaningId) ||
      selections.some(
        (item) =>
          item.signId === selection.signId ||
          item.meaningId === selection.meaningId
      )
    ) {
      return selections;
    }
    return [...selections, selection];
  }, []);
  const lockOrder =
    Array.isArray(saved.lockOrder) &&
    saved.lockOrder.length === HALL.correctLock.length &&
    saved.lockOrder.every((id) => storySignIds.has(id)) &&
    new Set(saved.lockOrder).size === HALL.correctLock.length
      ? saved.lockOrder
      : fallback.lockOrder;

  return {
    phase: isHallPhase(saved.phase) ? saved.phase : fallback.phase,
    foundSignIds,
    matchSelections,
    matchAttempts: Number.isFinite(saved.matchAttempts)
      ? Math.max(0, saved.matchAttempts ?? 0)
      : 0,
    lockOrder,
    lockAttempts: Number.isFinite(saved.lockAttempts)
      ? Math.max(0, saved.lockAttempts ?? 0)
      : 0,
    completed: Boolean(saved.completed),
  };
};

const signIcon = (kind: HallSignKind, className = "h-6 w-6") => {
  if (kind === "call") return <Megaphone className={className} />;
  if (kind === "ark") return <Sailboat className={className} />;
  if (kind === "mountain") return <Mountain className={className} />;
  if (kind === "crown") return <Crown className={className} />;
  if (kind === "flame") return <Flame className={className} />;
  return <Sword className={className} />;
};

export default function HallOfSignsLevel({
  progress,
  onProgressChange,
  onComplete,
  onExit,
  soundEnabled,
  onToggleSound,
  onSound,
}: HallOfSignsLevelProps) {
  const [activeSign, setActiveSign] = useState<HallSign | null>(null);
  const [notice, setNotice] = useState(
    progress.foundSignIds.length > 0
      ? "Your discovered signs are still glowing."
      : "Three plaques belong to this story. Inspect the hall carefully."
  );

  const storySigns = useMemo(
    () => HALL.signs.filter((sign) => sign.isStorySign),
    []
  );
  const allStorySignsFound = storySigns.every((sign) =>
    progress.foundSignIds.includes(sign.id)
  );
  const phaseNumber =
    progress.phase === "search" ? 1 : progress.phase === "match" ? 2 : 3;

  const discoverSign = (sign: HallSign) => {
    setActiveSign(sign);

    if (!sign.isStorySign) {
      setNotice("That plaque belongs to another story. Search for a Nuh sign.");
      onSound("wrong");
      return;
    }

    if (progress.foundSignIds.includes(sign.id)) {
      setNotice(`${sign.title} is already part of your sign set.`);
      return;
    }

    const foundSignIds = [...progress.foundSignIds, sign.id];
    onProgressChange({
      ...progress,
      foundSignIds,
    });
    setNotice(
      foundSignIds.length === storySigns.length
        ? "All three signs are awake. The lesson wall is opening."
        : `${foundSignIds.length} of ${storySigns.length} story signs found.`
    );
    onSound("clue");
  };

  const openMatchChallenge = () => {
    if (!allStorySignsFound) return;
    onProgressChange({
      ...progress,
      phase: "match",
    });
    setNotice("Match each sign to the lesson it represents.");
    onSound("clue");
  };

  const selectMeaning = (signId: string, meaningId: string) => {
    const matchSelections = progress.matchSelections.filter(
      (selection) =>
        selection.signId !== signId && selection.meaningId !== meaningId
    );
    matchSelections.push({ signId, meaningId });
    onProgressChange({
      ...progress,
      matchSelections,
    });
  };

  const checkMatches = () => {
    const isCorrect = HALL.correctMatches.every(({ signId, meaningId }) =>
      progress.matchSelections.some(
        (selection) =>
          selection.signId === signId && selection.meaningId === meaningId
      )
    );

    if (isCorrect) {
      onProgressChange({
        ...progress,
        phase: "lock",
      });
      setNotice("The meanings are aligned. The final symbol lock is awake.");
      onSound("success");
      return;
    }

    const matchAttempts = progress.matchAttempts + 1;
    onProgressChange({
      ...progress,
      matchAttempts,
    });
    setNotice(
      matchAttempts >= 2
        ? "Use the new hint: the Ark represents following Allah's guidance."
        : "One or more signs are matched to the wrong lesson. Try again."
    );
    onSound("wrong");
  };

  const cycleLockSign = (index: number) => {
    const currentId = progress.lockOrder[index];
    const currentIndex = storySigns.findIndex((sign) => sign.id === currentId);
    const nextSign = storySigns[(currentIndex + 1) % storySigns.length];
    if (!nextSign) return;
    const lockOrder = [...progress.lockOrder];
    lockOrder[index] = nextSign.id;
    onProgressChange({
      ...progress,
      lockOrder,
    });
    onSound("move");
  };

  const checkLock = () => {
    const isCorrect = HALL.correctLock.every(
      (signId, index) => progress.lockOrder[index] === signId
    );

    if (isCorrect) {
      const completedProgress: HallProgress = {
        ...progress,
        phase: "complete",
        completed: true,
      };
      onProgressChange(completedProgress);
      onComplete(completedProgress);
      onSound("success");
      return;
    }

    const lockAttempts = progress.lockAttempts + 1;
    onProgressChange({
      ...progress,
      lockAttempts,
    });
    setNotice(
      lockAttempts >= 2
        ? "Hint: begin with the Call, place the Ark in the middle, and finish at the mountain."
        : "The door lights flickered. The signs are not in story order yet."
    );
    onSound("wrong");
  };

  const renderHeader = () => (
    <header className="border-b border-white/10 bg-[#0d1435] px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-indigo-400 text-indigo-950">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
              {HALL.eyebrow}
            </p>
            <h1 className="truncate text-lg font-black">{HALL.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3">
            <KeyRound className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-black text-cyan-100">
              Challenge {phaseNumber}/3
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleSound}
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
            onClick={onExit}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-200"
            aria-label="Leave the Hall of Signs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );

  if (progress.phase === "match") {
    return (
      <div className="overflow-hidden rounded-[32px] border border-cyan-200 bg-[#080d24] text-white shadow-[0_30px_80px_rgba(30,27,75,0.3)]">
        {renderHeader()}
        <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[0.72fr_1.28fr]">
          <section className="rounded-3xl border border-cyan-200/25 bg-gradient-to-br from-cyan-400/15 to-indigo-500/10 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-cyan-950">
              <Lightbulb className="h-6 w-6" />
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
              Challenge two
            </p>
            <h2 className="mt-2 text-2xl font-black">The lesson wall</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
              Connect each discovered sign to the lesson it carries. Every
              lesson can be used once.
            </p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs font-bold leading-6 text-slate-200">
              <span className="text-amber-300">Librarian:</span> {notice}
            </div>
            {progress.matchAttempts >= 2 ? (
              <div className="mt-4 flex gap-3 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4 text-xs font-semibold leading-5 text-cyan-50">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-none text-cyan-300" />
                The Ark represents following Allah&apos;s guidance.
              </div>
            ) : null}
          </section>

          <section className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-5">
            {storySigns.map((sign) => {
              const selection = progress.matchSelections.find(
                (item) => item.signId === sign.id
              );

              return (
                <div
                  key={sign.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300/15 text-amber-200">
                      {signIcon(sign.kind)}
                    </span>
                    <div>
                      <p className="text-sm font-black">{sign.title}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                        Choose its lesson
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {HALL.meanings.map((meaning) => {
                      const selected = selection?.meaningId === meaning.id;
                      return (
                        <button
                          key={meaning.id}
                          type="button"
                          onClick={() => selectMeaning(sign.id, meaning.id)}
                          className={`rounded-xl border px-3 py-3 text-left transition ${
                            selected
                              ? "border-cyan-200 bg-cyan-300 text-cyan-950"
                              : "border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.1]"
                          }`}
                        >
                          <span className="block text-xs font-black">
                            {meaning.title}
                          </span>
                          <span
                            className={`mt-1 block text-[10px] leading-4 ${
                              selected ? "text-cyan-900/75" : "text-slate-400"
                            }`}
                          >
                            {meaning.detail}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={checkMatches}
              disabled={
                progress.matchSelections.length !== storySigns.length
              }
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-indigo-400 px-5 py-3 text-sm font-black text-indigo-950 shadow-[0_12px_30px_rgba(34,211,238,.22)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Check className="h-5 w-5" />
              Check the lesson wall
            </button>
          </section>
        </div>
      </div>
    );
  }

  if (progress.phase === "lock") {
    return (
      <div className="overflow-hidden rounded-[32px] border border-amber-200 bg-[#080d24] text-white shadow-[0_30px_80px_rgba(30,27,75,0.3)]">
        {renderHeader()}
        <div
          className="relative min-h-[610px] bg-cover bg-center px-4 py-8 sm:px-8"
          style={{
            backgroundImage:
              "linear-gradient(rgba(5,8,28,.72), rgba(5,8,28,.9)), url('/games/lost-library/hall-of-signs.webp')",
          }}
        >
          <div className="mx-auto max-w-3xl rounded-[28px] border border-amber-200/30 bg-[#0d1435]/90 p-5 shadow-[0_25px_70px_rgba(0,0,0,.45)] backdrop-blur-md sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 text-amber-950">
                <LockKeyhole className="h-8 w-8" />
              </div>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                Final room challenge
              </p>
              <h2 className="mt-2 text-3xl font-black">The symbol lock</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-slate-300">
                Turn each dial. The door remembers the story from the first
                invitation to the safe new beginning.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-5">
              {progress.lockOrder.map((signId, index) => {
                const sign =
                  storySigns.find((item) => item.id === signId) ??
                  storySigns[0];
                if (!sign) return null;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => cycleLockSign(index)}
                    className="group rounded-3xl border border-amber-200/25 bg-white/[0.07] px-2 py-5 text-center transition hover:-translate-y-1 hover:border-amber-200/60 hover:bg-amber-300/10 sm:px-4"
                    aria-label={`Change symbol dial ${index + 1}, currently ${sign.title}`}
                  >
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300/15 text-amber-200 transition group-hover:bg-amber-300 group-hover:text-amber-950 sm:h-20 sm:w-20">
                      {signIcon(sign.kind, "h-7 w-7 sm:h-10 sm:w-10")}
                    </span>
                    <span className="mt-3 block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Dial {index + 1}
                    </span>
                    <span className="mt-1 block text-xs font-black text-white sm:text-sm">
                      {sign.title}
                    </span>
                    <span className="mt-2 block text-[10px] font-bold text-cyan-300">
                      Tap to turn
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-xs font-bold leading-6 text-slate-200">
              <span className="text-amber-300">Librarian:</span> {notice}
            </div>

            {progress.lockAttempts >= 2 ? (
              <div className="mt-4 flex gap-3 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4 text-xs font-semibold leading-5 text-cyan-50">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-none text-cyan-300" />
                Begin with the Call, place the Ark in the middle, and finish at
                the mountain.
              </div>
            ) : null}

            <button
              type="button"
              onClick={checkLock}
              className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-4 text-sm font-black text-amber-950 shadow-[0_12px_30px_rgba(251,191,36,.28)] transition hover:-translate-y-0.5"
            >
              <KeyRound className="h-5 w-5" />
              Open the Hall door
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-cyan-200 bg-[#080d24] text-white shadow-[0_30px_80px_rgba(30,27,75,0.3)]">
      {renderHeader()}
      <div className="bg-[#080d24] p-3 sm:p-5">
        <div
          className="relative mx-auto aspect-[3/2] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-cover bg-center shadow-inner"
          style={{
            backgroundImage: "url('/games/lost-library/hall-of-signs.webp')",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b22]/35 via-transparent to-indigo-950/10" />

          {HALL.signs.map((sign) => {
            const found = progress.foundSignIds.includes(sign.id);
            return (
              <button
                key={sign.id}
                type="button"
                onClick={() => discoverSign(sign)}
                className={`hall-sign absolute z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 backdrop-blur-sm transition sm:h-14 sm:w-14 ${
                  found
                    ? "border-emerald-100 bg-emerald-400/80 text-white shadow-[0_0_26px_rgba(52,211,153,.8)]"
                    : "border-cyan-100/80 bg-cyan-300/25 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,.8)] hover:bg-cyan-300 hover:text-cyan-950"
                }`}
                style={{
                  left: `${sign.position.x}%`,
                  top: `${sign.position.y}%`,
                }}
                aria-label={`Inspect ${sign.title} sign`}
              >
                {found ? (
                  <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  signIcon(sign.kind, "h-5 w-5 sm:h-6 sm:w-6")
                )}
              </button>
            );
          })}

          <div className="pointer-events-none absolute bottom-[4%] left-1/2 z-10 w-[58px] -translate-x-1/2 sm:w-[82px] md:w-[96px]">
            <img
              src="/games/lost-library/explorer.webp"
              alt="Your library explorer"
              className="h-auto w-full drop-shadow-[0_14px_8px_rgba(0,0,0,.5)]"
            />
          </div>

          <div className="absolute bottom-3 left-3 z-40 max-w-[72%] rounded-2xl border border-white/15 bg-slate-950/80 px-3 py-2 text-[10px] font-bold leading-4 text-white shadow-lg backdrop-blur-md sm:bottom-5 sm:left-5 sm:max-w-md sm:px-4 sm:py-3 sm:text-xs sm:leading-5">
            <span className="mr-2 text-cyan-300">Librarian:</span>
            {notice}
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-xs font-bold leading-5 text-cyan-100">
            {HALL.objective}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-amber-100">
              {progress.foundSignIds.length}/{storySigns.length} story signs
            </span>
            {allStorySignsFound ? (
              <button
                type="button"
                onClick={openMatchChallenge}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-300 px-4 text-xs font-black text-cyan-950 shadow-[0_8px_24px_rgba(34,211,238,.25)]"
              >
                Open the lesson wall
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {activeSign ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hall-sign-title"
            className={`w-full max-w-md overflow-hidden rounded-[28px] border p-6 text-center shadow-[0_30px_90px_rgba(0,0,0,.55)] ${
              activeSign.isStorySign
                ? "border-cyan-200/40 bg-gradient-to-br from-[#18204d] to-[#0d1435]"
                : "border-rose-200/30 bg-gradient-to-br from-[#351737] to-[#15132c]"
            }`}
          >
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] shadow-[0_0_35px_rgba(34,211,238,.25)] ${
                activeSign.isStorySign
                  ? "bg-gradient-to-br from-cyan-300 to-indigo-400 text-indigo-950"
                  : "bg-white/10 text-rose-100"
              }`}
            >
              {signIcon(activeSign.kind, "h-9 w-9")}
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
              {activeSign.isStorySign
                ? "Story sign discovered"
                : "A sign from another shelf"}
            </p>
            <h2
              id="hall-sign-title"
              className="mt-2 text-2xl font-black text-white"
            >
              {activeSign.title}
            </h2>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-200">
              {activeSign.discovery}
            </p>
            <button
              type="button"
              onClick={() => {
                const shouldOpenMatches =
                  activeSign.isStorySign && allStorySignsFound;
                setActiveSign(null);
                if (shouldOpenMatches) openMatchChallenge();
              }}
              className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition ${
                activeSign.isStorySign
                  ? "bg-cyan-300 text-cyan-950 hover:bg-cyan-200"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              {activeSign.isStorySign ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {activeSign.isStorySign
                ? allStorySignsFound
                  ? "Open the lesson wall"
                  : "Keep this sign"
                : "Keep searching"}
            </button>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .hall-sign {
          animation: hall-sign-pulse 1.9s ease-in-out infinite;
        }

        @keyframes hall-sign-pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.11);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hall-sign {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
