"use client";

// Stop-gap polling abstraction until these updates can move to WebSockets.
import { useEffect, useRef } from "react";

type PollingCallback = () => void | Promise<void>;

type UsePollingOptions = {
  baseIntervalMs: number;
  run: PollingCallback;
  enabled?: boolean;
  immediate?: boolean;
  maxIntervalMs?: number;
};

export function usePolling({
  baseIntervalMs,
  run,
  enabled = true,
  immediate = true,
  maxIntervalMs = Math.min(baseIntervalMs * 8, 60_000),
}: UsePollingOptions) {
  const runRef = useRef(run);

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  useEffect(() => {
    if (!enabled) return;

    let timer: number | null = null;
    let stopped = false;
    let hiddenIntervalMs = baseIntervalMs;

    const clearTimer = () => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };

    const runPoll = () => {
      void Promise.resolve()
        .then(() => runRef.current())
        .catch(() => {});
    };

    const schedule = (delayMs: number) => {
      timer = window.setTimeout(() => {
        if (stopped) return;

        const hidden = document.visibilityState === "hidden";
        runPoll();
        if (hidden) {
          hiddenIntervalMs = Math.min(hiddenIntervalMs * 2, maxIntervalMs);
          schedule(hiddenIntervalMs);
        } else {
          hiddenIntervalMs = baseIntervalMs;
          schedule(baseIntervalMs);
        }
      }, delayMs);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;

      hiddenIntervalMs = baseIntervalMs;
      clearTimer();
      runPoll();
      schedule(baseIntervalMs);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (immediate) runPoll();
    schedule(baseIntervalMs);

    return () => {
      stopped = true;
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [baseIntervalMs, enabled, immediate, maxIntervalMs]);
}
