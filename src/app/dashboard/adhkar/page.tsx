"use client";

import {
  AlarmClock,
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  House,
  Landmark,
  MoonStar,
  Plane,
  RotateCcw,
  Sparkles,
  Sunrise,
  Sunset,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PrayerBeadsIcon from "@/components/icons/PrayerBeadsIcon";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  ADHKAR_CATEGORIES,
  isIslamicSubjectName,
  type AdhkarCategory,
} from "@/lib/adhkarData";

type Progress = Record<string, number>;

const CATEGORY_ICONS = {
  morning: Sunrise,
  evening: Sunset,
  sleep: MoonStar,
  waking: AlarmClock,
  travel: Plane,
  home: House,
  food: Utensils,
  mosque: Landmark,
  "after-prayer": Sparkles,
  worry: Heart,
};

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
};

const readProgress = (key: string): Progress => {
  try {
    const value = localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Progress)
      : {};
  } catch {
    return {};
  }
};

const writeProgress = (key: string, progress: Progress) => {
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    return;
  }
};

export default function AdhkarPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeSubject, activeSubjectId, loading, toSubjectHref } = useSubjectContext();
  const [progress, setProgress] = useState<Progress>({});
  const [loadedStorageKey, setLoadedStorageKey] = useState("");
  const categoryId = searchParams.get("category");
  const selectedCategory =
    ADHKAR_CATEGORIES.find((category) => category.id === categoryId) ?? null;
  const isIslamicSubject = isIslamicSubjectName(activeSubject?.name);
  const storageKey = useMemo(
    () => `osteps-adhkar-progress-v1:${activeSubjectId ?? "unknown"}:${getTodayKey()}`,
    [activeSubjectId]
  );

  useEffect(() => {
    if (!activeSubjectId) return;
    setProgress(readProgress(storageKey));
    setLoadedStorageKey(storageKey);
  }, [activeSubjectId, storageKey]);

  useEffect(() => {
    if (loadedStorageKey !== storageKey) return;
    writeProgress(storageKey, progress);
  }, [loadedStorageKey, progress, storageKey]);

  const totalEntries = ADHKAR_CATEGORIES.reduce(
    (total, category) => total + category.entries.length,
    0
  );
  const completedEntries = ADHKAR_CATEGORIES.reduce(
    (total, category) =>
      total +
      category.entries.filter((entry) => (progress[entry.id] ?? 0) >= entry.target).length,
    0
  );

  const openCategory = (category: AdhkarCategory) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category.id);
    router.push(`${pathname}?${params.toString()}`);
  };

  const closeCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const increment = (entryId: string, target: number) => {
    setProgress((current) => ({
      ...current,
      [entryId]: Math.min((current[entryId] ?? 0) + 1, target),
    }));
  };

  const resetEntry = (entryId: string) => {
    setProgress((current) => ({ ...current, [entryId]: 0 }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
      </div>
    );
  }

  if (!isIslamicSubject) {
    return (
      <div className="mx-auto max-w-xl px-3 py-8 md:px-6">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
          <PrayerBeadsIcon className="mx-auto h-10 w-10 text-amber-700" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Open Adhkar from an Islamic subject</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This library is available inside Islamic subject workspaces.
          </p>
          <Link
            href="/dashboard/subject-cards"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Choose a subject
          </Link>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const completedInCategory = selectedCategory.entries.filter(
      (entry) => (progress[entry.id] ?? 0) >= entry.target
    ).length;

    return (
      <div className="mx-auto max-w-4xl space-y-4 px-3 pb-12 pt-3 md:space-y-6 md:px-6 md:pt-6">
        <section
          className="relative overflow-hidden rounded-3xl border p-4 shadow-sm md:p-7"
          style={{
            background: `linear-gradient(135deg, ${selectedCategory.soft}, white 78%)`,
            borderColor: selectedCategory.border,
          }}
        >
          <button
            type="button"
            onClick={closeCategory}
            className="inline-flex h-9 items-center gap-2 rounded-xl border bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm"
            style={{ borderColor: selectedCategory.border }}
          >
            <ArrowLeft className="h-4 w-4" />
            Categories
          </button>
          <div className="mt-5 flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                color: selectedCategory.accent,
                backgroundColor: selectedCategory.soft,
                border: `1px solid ${selectedCategory.border}`,
              }}
            >
              <PrayerBeadsIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: selectedCategory.accent }}>
                {selectedCategory.arabicName}
              </p>
              <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {selectedCategory.name}
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {selectedCategory.description}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Today's progress</span>
              <span>
                {completedInCategory}/{selectedCategory.entries.length} completed
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${
                    selectedCategory.entries.length
                      ? (completedInCategory / selectedCategory.entries.length) * 100
                      : 0
                  }%`,
                  backgroundColor: selectedCategory.accent,
                }}
              />
            </div>
          </div>
        </section>

        <div className="space-y-4">
          {selectedCategory.entries.map((entry, index) => {
            const count = Math.min(progress[entry.id] ?? 0, entry.target);
            const complete = count >= entry.target;
            const percentage = entry.target ? (count / entry.target) * 100 : 0;

            return (
              <article
                key={entry.id}
                className="overflow-hidden rounded-3xl border bg-white shadow-sm"
                style={{ borderColor: complete ? selectedCategory.accent : "#e2e8f0" }}
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Dhikr {index + 1}
                      </p>
                      <h2 className="mt-1 text-base font-bold text-slate-800 md:text-lg">
                        {entry.title}
                      </h2>
                    </div>
                    {complete ? (
                      <span
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: selectedCategory.accent }}
                        aria-label="Completed"
                      >
                        <Check className="h-5 w-5" />
                      </span>
                    ) : null}
                  </div>

                  <p
                    dir="rtl"
                    lang="ar"
                    className="mt-5 text-right text-[1.65rem] font-semibold leading-[2.25] text-slate-900 md:text-[2rem]"
                    style={{ fontFamily: '"Noto Naskh Arabic", "Amiri", serif' }}
                  >
                    {entry.arabic}
                  </p>

                  <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Transliteration
                      </p>
                      <p className="mt-1.5 text-sm italic leading-6 text-slate-700 md:text-base">
                        {entry.transliteration}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        English meaning
                      </p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-700 md:text-base">
                        {entry.translation}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-slate-400">Source: {entry.source}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/80 p-3 md:p-4">
                  <div className="flex items-stretch gap-2">
                    <button
                      type="button"
                      onClick={() => increment(entry.id, entry.target)}
                      disabled={complete}
                      className="relative min-h-16 flex-1 overflow-hidden rounded-2xl border bg-white px-4 text-left shadow-sm transition active:scale-[0.99] disabled:cursor-default"
                      style={{ borderColor: complete ? selectedCategory.accent : selectedCategory.border }}
                      aria-label={
                        complete
                          ? `${entry.title} completed`
                          : `Count ${entry.title}: ${count} of ${entry.target}`
                      }
                    >
                      <div
                        className="absolute inset-y-0 left-0 opacity-10 transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: selectedCategory.accent,
                        }}
                      />
                      <div className="relative flex items-center justify-between gap-4">
                        <div>
                          <p
                            className="text-xs font-bold uppercase tracking-[0.14em]"
                            style={{ color: selectedCategory.accent }}
                          >
                            {complete ? "Completed" : "Tap to count"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Target: {entry.target} {entry.target === 1 ? "time" : "times"}
                          </p>
                        </div>
                        <p className="text-2xl font-black tabular-nums text-slate-900">
                          {count}
                          <span className="text-sm font-semibold text-slate-400">/{entry.target}</span>
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => resetEntry(entry.id)}
                      disabled={count === 0}
                      className="flex w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label={`Reset ${entry.title}`}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-3 pb-12 pt-3 md:space-y-7 md:px-6 md:pt-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white shadow-xl md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-emerald-300/10 blur-2xl" />
        <div className="relative">
          <Link
            href={toSubjectHref("/dashboard")}
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur"
          >
            <ArrowLeft className="h-4 w-4" />
            {activeSubject?.name || "Islamic"} dashboard
          </Link>
          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/15 text-emerald-200 shadow-inner">
              <PrayerBeadsIcon className="h-9 w-9" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-300">ذِكْرُ اللَّهِ</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">Adhkar</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/75 md:text-base">
                Choose a collection, read each remembrance, and tap the counter as you recite.
                Progress is saved on this device for today.
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold">
              <span>Today's journey</span>
              <span className="tabular-nums text-emerald-200">
                {completedEntries}/{totalEntries} adhkar
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-emerald-300 transition-all duration-300"
                style={{ width: `${totalEntries ? (completedEntries / totalEntries) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 px-1">
          <h2 className="text-lg font-bold text-slate-900 md:text-xl">Choose an Adhkar collection</h2>
          <p className="mt-1 text-sm text-slate-500">
            Each collection keeps its own repetition counters.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ADHKAR_CATEGORIES.map((category) => {
            const Icon =
              CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] ?? PrayerBeadsIcon;
            const completed = category.entries.filter(
              (entry) => (progress[entry.id] ?? 0) >= entry.target
            ).length;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => openCategory(category)}
                className="group flex min-h-36 w-full items-start gap-4 rounded-3xl border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg md:p-5"
                style={{ borderColor: category.border }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    color: category.accent,
                    backgroundColor: category.soft,
                    border: `1px solid ${category.border}`,
                  }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold" style={{ color: category.accent }}>
                    {category.arabicName}
                  </p>
                  <h3 className="mt-0.5 text-base font-bold text-slate-900">{category.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                    {category.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      {completed}/{category.entries.length} complete
                    </span>
                    <ChevronRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      style={{ color: category.accent }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
