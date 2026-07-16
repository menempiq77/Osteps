"use client";

import { Gamepad2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import GameFullscreenButton from "./GameFullscreenButton";

type ArcadeShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  paused?: boolean;
  showPause?: boolean;
  soundEnabled: boolean;
  onPauseToggle?: () => void;
  onSoundToggle: () => void;
};

export default function ArcadeShell({
  title,
  subtitle,
  children,
  paused = false,
  showPause = false,
  soundEnabled,
  onPauseToggle,
  onSoundToggle,
}: ArcadeShellProps) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-cyan-100 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 shadow-[0_22px_70px_rgba(14,116,144,0.16)]">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-fuchsia-200/35 blur-3xl" />

      <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-cyan-100/80 bg-white/70 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/games"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"
            aria-label="Back to games"
          >
            <Gamepad2 className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-base font-black text-slate-900">
              {title}
            </p>
            <p className="truncate text-xs font-bold text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GameFullscreenButton />
          {showPause && onPauseToggle ? (
            <button
              type="button"
              onClick={onPauseToggle}
              className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700"
            >
              {paused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {paused ? "Resume" : "Pause"}
              </span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSoundToggle}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-fuchsia-300 hover:text-fuchsia-700"
            aria-label={
              soundEnabled ? "Mute game sounds" : "Enable game sounds"
            }
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <div className="relative p-4 sm:p-6">{children}</div>
    </section>
  );
}
