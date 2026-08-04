"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check } from "lucide-react";

export type StoryStepperProps = {
  title: string;
  accent: string;
  emoji: string;
  paragraphs: string[];
  onFinish: () => void;
};

export function StoryStepper({
  title,
  accent,
  emoji,
  paragraphs,
  onFinish,
}: StoryStepperProps) {
  const [step, setStep] = useState(0);
  const total = paragraphs.length;
  const current = paragraphs[step] ?? "";

  useEffect(() => {
    const id = setTimeout(() => setStep(0), 0);
    return () => clearTimeout(id);
  }, [paragraphs.length]);

  const progress = total > 0 ? Math.round(((step + 1) / total) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div
        className={`relative overflow-hidden bg-gradient-to-r ${accent} p-6 text-white`}
      >
        <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-white/90">
          <BookOpen className="h-4 w-4" />
          {title}
        </div>
        <div className="relative z-10 mt-3 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
            {emoji}
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Step {step + 1} of {total}
            </div>
            <h3 className="text-lg font-extrabold">The story continues...</h3>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 opacity-20">
          <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" opacity="0.3" />
            <path d="M50 20 L60 45 L85 50 L60 55 L50 80 L40 55 L15 50 L40 45 Z" opacity="0.5" />
          </svg>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative min-h-[160px] rounded-3xl bg-amber-50/60 p-6 md:p-8">
          <span className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg shadow-sm">
            {emoji}
          </span>
          <p className="text-[16px] leading-8 text-slate-700 md:text-[17px] md:leading-9">
            {current}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < total - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              I finished reading
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Tip: take your time — every step is part of the prophet&apos;s journey.
        </p>
      </div>
    </div>
  );
}
