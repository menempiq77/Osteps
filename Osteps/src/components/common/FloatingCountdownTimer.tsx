"use client";

import {
  Clock3,
  GripVertical,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "osteps-floating-countdown-timer";
const DEFAULT_MINUTES = "5";
const DEFAULT_DURATION_SECONDS = 5 * 60;
const PANEL_WIDTH = 320;
const PANEL_HEIGHT = 430;
const EDGE_PADDING = 12;
const PROGRESS_RADIUS = 104;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

type TimerPosition = {
  x: number;
  y: number;
};

type PersistedTimerState = {
  isOpen: boolean;
  inputMinutes: string;
  durationSeconds: number;
  remainingSeconds: number;
  endTimeMs: number | null;
  position: TimerPosition | null;
};

const clampPosition = (position: TimerPosition) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const panelWidth = Math.min(PANEL_WIDTH, viewportWidth - EDGE_PADDING * 2);
  const maxX = Math.max(EDGE_PADDING, viewportWidth - panelWidth - EDGE_PADDING);
  const maxY = Math.max(EDGE_PADDING, viewportHeight - PANEL_HEIGHT - EDGE_PADDING);

  return {
    x: Math.min(Math.max(position.x, EDGE_PADDING), maxX),
    y: Math.min(Math.max(position.y, EDGE_PADDING), maxY),
  };
};

const getDefaultPosition = () =>
  clampPosition({
    x: window.innerWidth - PANEL_WIDTH - 20,
    y: window.innerHeight - PANEL_HEIGHT - 24,
  });

const parseMinutes = (value: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 60);
};

const padTime = (value: number) => String(value).padStart(2, "0");

const formatClock = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  return [hours, minutes, secs].map(padTime).join(":");
};

const formatMinutesLabel = (seconds: number) => {
  const minutes = seconds / 60;
  return Number.isInteger(minutes) ? `${minutes} min` : `${minutes.toFixed(1)} min`;
};

export function FloatingCountdownTimer() {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(DEFAULT_MINUTES);
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_DURATION_SECONDS);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_DURATION_SECONDS);
  const [endTimeMs, setEndTimeMs] = useState<number | null>(null);
  const [position, setPosition] = useState<TimerPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<TimerPosition | null>(null);
  const completionNotifiedRef = useRef(false);

  useEffect(() => {
    setIsHydrated(true);

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved = raw ? (JSON.parse(raw) as Partial<PersistedTimerState>) : null;
      const savedDuration =
        typeof saved?.durationSeconds === "number" && saved.durationSeconds > 0
          ? saved.durationSeconds
          : DEFAULT_DURATION_SECONDS;
      const savedMinutes =
        typeof saved?.inputMinutes === "string" && saved.inputMinutes.trim()
          ? saved.inputMinutes
          : String(savedDuration / 60);
      const savedEndTime = typeof saved?.endTimeMs === "number" ? saved.endTimeMs : null;
      let savedRemaining =
        typeof saved?.remainingSeconds === "number" && saved.remainingSeconds >= 0
          ? saved.remainingSeconds
          : savedDuration;

      if (savedEndTime != null) {
        savedRemaining = Math.max(0, Math.ceil((savedEndTime - Date.now()) / 1000));
      }

      setIsOpen(Boolean(saved?.isOpen));
      setInputMinutes(savedMinutes);
      setDurationSeconds(savedDuration);
      setRemainingSeconds(savedRemaining);
      setEndTimeMs(savedEndTime != null && savedRemaining > 0 ? savedEndTime : null);
      setPosition(
        saved?.position ? clampPosition(saved.position) : getDefaultPosition()
      );
    } catch {
      setPosition(getDefaultPosition());
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || !position) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isOpen,
        inputMinutes,
        durationSeconds,
        remainingSeconds,
        endTimeMs,
        position,
      } satisfies PersistedTimerState)
    );
  }, [durationSeconds, endTimeMs, inputMinutes, isHydrated, isOpen, position, remainingSeconds]);

  useEffect(() => {
    if (!isHydrated) return;

    const handleResize = () => {
      setPosition((current) => clampPosition(current ?? getDefaultPosition()));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isHydrated]);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      const dragOffset = dragOffsetRef.current;
      if (!dragOffset) return;

      setPosition(
        clampPosition({
          x: event.clientX - dragOffset.x,
          y: event.clientY - dragOffset.y,
        })
      );
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      dragOffsetRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (endTimeMs == null) return;

    const tick = () => {
      const nextRemaining = Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);

      if (nextRemaining === 0) {
        setEndTimeMs(null);
        setIsOpen(true);

        if (!completionNotifiedRef.current) {
          completionNotifiedRef.current = true;
          window.navigator.vibrate?.([120, 80, 120]);
        }
      }
    };

    tick();
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [endTimeMs]);

  const isRunning = endTimeMs != null;
  const parsedInputSeconds = parseMinutes(inputMinutes);
  const progress =
    durationSeconds > 0
      ? Math.min(1, Math.max(0, remainingSeconds / durationSeconds))
      : 0;
  const strokeDashoffset = PROGRESS_CIRCUMFERENCE * (1 - progress);
  const statusLabel =
    remainingSeconds === 0
      ? "Time's up"
      : isRunning
      ? "Running"
      : remainingSeconds < durationSeconds
      ? "Paused"
      : "Ready";

  const handleMinutesChange = (value: string) => {
    setInputMinutes(value);

    if (isRunning) return;

    const nextDuration = parseMinutes(value);
    if (nextDuration == null) return;

    setDurationSeconds(nextDuration);
    setRemainingSeconds(nextDuration);
    completionNotifiedRef.current = false;
  };

  const handleStart = () => {
    const nextDuration = parsedInputSeconds ?? durationSeconds;
    if (!nextDuration) return;

    const baseRemaining = remainingSeconds > 0 ? remainingSeconds : nextDuration;

    setDurationSeconds(nextDuration);
    setRemainingSeconds(baseRemaining);
    setEndTimeMs(Date.now() + baseRemaining * 1000);
    setIsOpen(true);
    completionNotifiedRef.current = false;
  };

  const handlePause = () => {
    if (endTimeMs == null) return;

    setRemainingSeconds(Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000)));
    setEndTimeMs(null);
  };

  const handleReset = () => {
    const resetTo = parsedInputSeconds ?? durationSeconds;
    if (!resetTo) return;

    setDurationSeconds(resetTo);
    setRemainingSeconds(resetTo);
    setEndTimeMs(null);
    completionNotifiedRef.current = false;
  };

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!position) return;

    const target = event.target as HTMLElement;
    if (target.closest("button") || target.closest("input")) return;

    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
    setIsDragging(true);
  };

  if (pathname === "/") return null;
  if (!isHydrated) return null;

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setPosition((current) => current ?? getDefaultPosition());
          }}
          className="fixed bottom-5 right-5 z-[980] flex h-14 w-14 items-center justify-center rounded-full bg-[#1f2937] text-white shadow-[0_18px_38px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:bg-[#111827]"
          aria-label="Open countdown timer"
        >
          <Clock3 className="h-6 w-6" />
          {isRunning && (
            <span className="absolute -top-2 right-0 rounded-full bg-[#38bdf8] px-2 py-0.5 text-[10px] font-semibold text-slate-950 shadow-sm">
              {formatClock(remainingSeconds).slice(3)}
            </span>
          )}
        </button>
      )}

      {isOpen && position && (
        <section
          className="fixed z-[980] w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-[28px] border border-white/10 bg-[#2f343b]/95 text-white shadow-[0_24px_60px_rgba(15,23,42,0.32)] backdrop-blur"
          style={{ left: position.x, top: position.y }}
        >
          <div
            onPointerDown={handleDragStart}
            className={`flex items-center justify-between border-b border-white/10 px-4 py-3 select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ touchAction: "none" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#38bdf8]">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Floating Timer</p>
                <p className="text-xs text-white/60">Drag this card anywhere</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <GripVertical className="h-4 w-4" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Minimize countdown timer"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-4 pb-5 pt-4">
            <div className="mb-4 flex items-end justify-between gap-3">
              <label className="block flex-1">
                <span className="mb-1 block text-xs font-medium uppercase tracking-[0.24em] text-white/55">
                  Minutes
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={inputMinutes}
                  onChange={(event) => handleMinutesChange(event.target.value)}
                  disabled={isRunning}
                  className="w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-base font-semibold text-white outline-none transition placeholder:text-white/30 focus:border-[#38bdf8] focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="5"
                />
              </label>

              <div
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  remainingSeconds === 0
                    ? "bg-red-400/15 text-red-200"
                    : isRunning
                    ? "bg-[#38bdf8]/20 text-[#c7f0ff]"
                    : remainingSeconds < durationSeconds
                    ? "bg-amber-400/15 text-amber-100"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {statusLabel}
              </div>
            </div>

            <div className="relative mx-auto mb-5 h-64 w-64 max-w-full">
              <svg viewBox="0 0 240 240" className="h-full w-full -rotate-90">
                <circle
                  cx="120"
                  cy="120"
                  r={PROGRESS_RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="16"
                />
                <circle
                  cx="120"
                  cy="120"
                  r={PROGRESS_RADIUS}
                  fill="none"
                  stroke={remainingSeconds === 0 ? "#fb7185" : "#38bdf8"}
                  strokeLinecap="round"
                  strokeWidth="16"
                  strokeDasharray={PROGRESS_CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-white/55">
                  {formatMinutesLabel(durationSeconds)}
                </span>
                <span className="text-[44px] font-semibold leading-none tracking-[0.08em] text-white">
                  {formatClock(remainingSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              {isRunning ? (
                <button
                  type="button"
                  onClick={handlePause}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#38bdf8] text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.35)] transition hover:scale-[1.03]"
                  aria-label="Pause countdown"
                >
                  <Pause className="h-6 w-6 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={parsedInputSeconds == null && durationSeconds <= 0}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#38bdf8] text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.35)] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Start countdown"
                >
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white transition hover:bg-white/10"
                aria-label="Reset countdown"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}