"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Clock, Pause, Play, RotateCcw, X } from "lucide-react";

type Mode = "stopwatch" | "countdown";

const pad = (n: number) => String(n).padStart(2, "0");

const formatMs = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
};

export function GlobalTimer() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("countdown");
  const [running, setRunning] = useState(false);
  // elapsedMs for stopwatch; remainingMs for countdown
  const [elapsedMs, setElapsedMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(5 * 60 * 1000);
  const [countdownTotalMs, setCountdownTotalMs] = useState(5 * 60 * 1000);
  const [minutesInput, setMinutesInput] = useState("5");
  const [finished, setFinished] = useState(false);

  const tickRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const beepRef = useRef<(() => void) | null>(null);

  // Simple WebAudio beep so we don't need an audio asset.
  const playBeep = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + start + duration
        );
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      playTone(880, 0, 0.25);
      playTone(880, 0.35, 0.25);
      playTone(1175, 0.7, 0.4);
      window.setTimeout(() => ctx.close().catch(() => {}), 1800);
    } catch {
      /* ignore audio errors */
    }
  }, []);
  beepRef.current = playBeep;

  useEffect(() => {
    if (!running) {
      if (tickRef.current) {
        cancelAnimationFrame(tickRef.current);
        tickRef.current = null;
      }
      return;
    }

    lastTsRef.current = performance.now();
    const loop = (ts: number) => {
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (mode === "stopwatch") {
        setElapsedMs((prev) => prev + delta);
      } else {
        setRemainingMs((prev) => {
          const next = prev - delta;
          if (next <= 0) {
            setRunning(false);
            setFinished(true);
            beepRef.current?.();
            return 0;
          }
          return next;
        });
      }
      tickRef.current = requestAnimationFrame(loop);
    };
    tickRef.current = requestAnimationFrame(loop);

    return () => {
      if (tickRef.current) {
        cancelAnimationFrame(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [running, mode]);

  const handleStartPause = () => {
    if (mode === "countdown" && !running && remainingMs <= 0) {
      // restart from total when starting a finished countdown
      setRemainingMs(countdownTotalMs);
      setFinished(false);
    }
    setFinished(false);
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setFinished(false);
    if (mode === "stopwatch") {
      setElapsedMs(0);
    } else {
      setRemainingMs(countdownTotalMs);
    }
  };

  const applyMinutes = useCallback(
    (value: string) => {
      const minutes = Math.max(0, Math.min(600, Number(value) || 0));
      const ms = Math.round(minutes * 60 * 1000);
      setCountdownTotalMs(ms);
      if (!running) {
        setRemainingMs(ms);
        setFinished(false);
      }
    },
    [running]
  );

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setRunning(false);
    setFinished(false);
    setMode(next);
  };

  const presets = useMemo(() => [1, 5, 10, 15, 30, 45], []);

  const display =
    mode === "stopwatch" ? formatMs(elapsedMs) : formatMs(remainingMs);

  const isActive = running || (mode === "stopwatch" ? elapsedMs > 0 : finished);

  return (
    <>
      {/* Floating launcher button (bottom-right) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open timer"
        title="Timer"
        className={`fixed bottom-5 right-5 z-[1200] flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_10px_30px_rgba(15,23,42,0.35)] transition hover:scale-105 active:scale-95 ${
          isActive ? "bg-[#38C16C]" : "bg-[#353545]"
        }`}
      >
        {isActive && !open ? (
          <span className="text-[11px] font-black tabular-nums">{display}</span>
        ) : (
          <Clock className="h-5 w-5" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-[1200] w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#2b2b39] text-white shadow-[0_24px_60px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Clock className="h-4 w-4 text-[#38C16C]" />
              Timer
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close timer"
              className="rounded-md p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 py-4">
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg bg-black/20 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => switchMode("countdown")}
                className={`rounded-md py-1.5 transition ${
                  mode === "countdown" ? "bg-[#38C16C] text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Countdown
              </button>
              <button
                type="button"
                onClick={() => switchMode("stopwatch")}
                className={`rounded-md py-1.5 transition ${
                  mode === "stopwatch" ? "bg-[#38C16C] text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Stopwatch
              </button>
            </div>

            <div
              className={`mb-3 text-center text-4xl font-black tabular-nums tracking-tight ${
                finished ? "text-[#38C16C]" : "text-white"
              }`}
            >
              {display}
            </div>

            {finished && (
              <div className="mb-3 rounded-md bg-[#38C16C]/15 px-3 py-1.5 text-center text-xs font-semibold text-[#7ee2a6]">
                Time&apos;s up!
              </div>
            )}

            {mode === "countdown" && (
              <div className="mb-3">
                <div className="mb-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={600}
                    value={minutesInput}
                    onChange={(e) => {
                      setMinutesInput(e.target.value);
                      applyMinutes(e.target.value);
                    }}
                    className="w-16 rounded-md border border-white/15 bg-white/[0.06] px-2 py-1 text-center text-sm text-white outline-none focus:border-[#38C16C]"
                  />
                  <span className="text-xs text-white/60">minutes</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {presets.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMinutesInput(String(m));
                        applyMinutes(String(m));
                      }}
                      className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] font-semibold text-white/80 transition hover:bg-white/15 hover:text-white"
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartPause}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#38C16C] py-2 text-sm font-bold text-white transition hover:brightness-110"
              >
                {running ? (
                  <>
                    <Pause className="h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Start
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset timer"
                title="Reset"
                className="flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalTimer;
