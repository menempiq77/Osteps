"use client";

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  CloudSun,
  HeartPulse,
  Landmark,
  Plane,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Sunrise,
  Sunset,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PrayerBeadsIcon from "@/components/icons/PrayerBeadsIcon";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  ADHKAR_ATTRIBUTION,
  ADHKAR_CATEGORIES,
  ADHKAR_GROUPS,
  ADHKAR_TOTAL_ENTRIES,
  ALL_ADHKAR_CATEGORIES,
  FEATURED_ADHKAR_CATEGORIES,
  isIslamicSubjectName,
  type AdhkarCategory,
  type AdhkarEntry,
} from "@/lib/adhkarData";

type Progress = Record<string, number>;

const GROUP_ICONS: Record<string, LucideIcon> = {
  daily: Clock3,
  prayer: Landmark,
  protection: ShieldCheck,
  health: HeartPulse,
  "nature-food": CloudSun,
  social: Users,
  "travel-hajj": Plane,
  remembrance: Sparkles,
};

const FEATURED_ICONS: Record<string, LucideIcon> = {
  "featured-morning": Sunrise,
  "featured-evening": Sunset,
};

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
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

const searchableEntryText = (entry: AdhkarEntry) =>
  [
    entry.title,
    entry.arabic,
    entry.transliteration,
    entry.translation,
    entry.source,
  ]
    .join(" ")
    .toLocaleLowerCase();

const matchingEntries = (category: AdhkarCategory, query: string) => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return category.entries;
  const categoryMatches = [
    category.name,
    category.arabicName,
    category.description,
  ]
    .join(" ")
    .toLocaleLowerCase()
    .includes(normalizedQuery);
  return categoryMatches
    ? category.entries
    : category.entries.filter((entry) =>
        searchableEntryText(entry).includes(normalizedQuery),
      );
};

export default function AdhkarPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeSubject, activeSubjectId, loading, toSubjectHref } =
    useSubjectContext();
  const [progress, setProgress] = useState<Progress>({});
  const [loadedStorageKey, setLoadedStorageKey] = useState("");
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeGroup, setActiveGroup] = useState("daily");
  const categoryId = searchParams.get("category");
  const selectedCategory =
    ALL_ADHKAR_CATEGORIES.find((category) => category.id === categoryId) ??
    null;
  const isIslamicSubject = isIslamicSubjectName(activeSubject?.name);
  const storageKey = useMemo(
    () =>
      `osteps-adhkar-progress-v1:${activeSubjectId ?? "unknown"}:${getTodayKey()}`,
    [activeSubjectId],
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

  const completedEntries = ADHKAR_CATEGORIES.reduce(
    (total, category) =>
      total +
      category.entries.filter(
        (entry) => (progress[entry.id] ?? 0) >= entry.target,
      ).length,
    0,
  );

  const filteredCategories = ADHKAR_CATEGORIES.filter(
    (category) => matchingEntries(category, query).length > 0,
  );
  const visibleCategories = query.trim()
    ? filteredCategories
    : ADHKAR_CATEGORIES.filter((category) => category.group === activeGroup);
  const currentGroup =
    ADHKAR_GROUPS.find((group) => group.id === activeGroup) ?? ADHKAR_GROUPS[0];

  const openCategory = (category: AdhkarCategory) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category.id);
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const closeCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
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
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Open Adhkar from an Islamic subject
          </h1>
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
    const visibleEntries = matchingEntries(selectedCategory, query);
    const completedInCategory = selectedCategory.entries.filter(
      (entry) => (progress[entry.id] ?? 0) >= entry.target,
    ).length;

    return (
      <div className="mx-auto min-w-0 max-w-4xl space-y-4 overflow-x-hidden px-3 pb-12 pt-3 md:space-y-6 md:px-6 md:pt-6">
        <section
          className="relative min-w-0 overflow-hidden rounded-3xl border p-4 shadow-sm md:p-7"
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
            Collections
          </button>
          <div className="mt-4 flex min-w-0 items-start gap-3 md:mt-5 md:gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl md:h-12 md:w-12"
              style={{
                color: selectedCategory.accent,
                backgroundColor: selectedCategory.soft,
                border: `1px solid ${selectedCategory.border}`,
              }}
            >
              <PrayerBeadsIcon className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <div className="min-w-0">
              <p
                dir="rtl"
                lang="ar"
                className="text-right text-sm font-semibold"
                style={{ color: selectedCategory.accent }}
              >
                {selectedCategory.arabicName}
              </p>
              <h1 className="mt-0.5 break-words text-xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {selectedCategory.name}
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {selectedCategory.description}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-600">
              <span>Today&apos;s progress</span>
              <span className="shrink-0">
                {completedInCategory}/{selectedCategory.entries.length}{" "}
                completed
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${
                    selectedCategory.entries.length
                      ? (completedInCategory /
                          selectedCategory.entries.length) *
                        100
                      : 0
                  }%`,
                  backgroundColor: selectedCategory.accent,
                }}
              />
            </div>
          </div>
        </section>

        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search within this collection"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        {query.trim() ? (
          <p className="px-1 text-sm text-slate-500">
            Showing {visibleEntries.length} of {selectedCategory.entries.length}{" "}
            entries
          </p>
        ) : null}

        <div className="min-w-0 space-y-4">
          {visibleEntries.map((entry) => {
            const index = selectedCategory.entries.findIndex(
              (candidate) => candidate.id === entry.id,
            );
            const count = Math.min(progress[entry.id] ?? 0, entry.target);
            const complete = count >= entry.target;
            const percentage = entry.target ? (count / entry.target) * 100 : 0;

            return (
              <article
                key={entry.id}
                className="min-w-0 overflow-hidden rounded-3xl border bg-white shadow-sm"
                style={{
                  borderColor: complete ? selectedCategory.accent : "#e2e8f0",
                }}
              >
                <div className="min-w-0 p-4 md:p-6">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Invocation {index + 1}
                      </p>
                      <h2 className="mt-1 break-words text-sm font-bold text-slate-800 md:text-base">
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
                    className="mt-4 break-words text-right text-[1.4rem] font-semibold leading-[2.05] text-slate-900 [overflow-wrap:anywhere] md:mt-5 md:text-[1.8rem] md:leading-[2.2]"
                    style={{
                      fontFamily: '"Noto Naskh Arabic", "Amiri", serif',
                    }}
                  >
                    {entry.arabic}
                  </p>

                  <div className="mt-5 min-w-0 space-y-4 border-t border-slate-100 pt-5">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Transliteration
                      </p>
                      <p className="mt-1.5 break-words text-sm italic leading-6 text-slate-700 [overflow-wrap:anywhere] md:text-base">
                        {entry.transliteration}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        English meaning
                      </p>
                      <p className="mt-1.5 break-words text-sm leading-6 text-slate-700 [overflow-wrap:anywhere] md:text-base">
                        {entry.translation}
                      </p>
                    </div>
                    <p className="break-words text-xs font-medium leading-5 text-slate-400 [overflow-wrap:anywhere]">
                      Source: {entry.source}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/80 p-3 md:p-4">
                  <div className="flex min-w-0 items-stretch gap-2">
                    <button
                      type="button"
                      onClick={() => increment(entry.id, entry.target)}
                      disabled={complete}
                      className="relative min-h-16 min-w-0 flex-1 overflow-hidden rounded-2xl border bg-white px-3 text-left shadow-sm transition active:scale-[0.99] disabled:cursor-default md:px-4"
                      style={{
                        borderColor: complete
                          ? selectedCategory.accent
                          : selectedCategory.border,
                      }}
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
                      <div className="relative flex min-w-0 items-center justify-between gap-2 md:gap-4">
                        <div className="min-w-0">
                          <p
                            className="truncate text-[11px] font-bold uppercase tracking-[0.12em] md:text-xs"
                            style={{ color: selectedCategory.accent }}
                          >
                            {complete ? "Completed" : "Tap to count"}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500 md:text-xs">
                            Target: {entry.target}{" "}
                            {entry.target === 1 ? "time" : "times"}
                          </p>
                        </div>
                        <p className="shrink-0 text-xl font-black tabular-nums text-slate-900 md:text-2xl">
                          {count}
                          <span className="text-xs font-semibold text-slate-400 md:text-sm">
                            /{entry.target}
                          </span>
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => resetEntry(entry.id)}
                      disabled={count === 0}
                      className="flex w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-35 md:w-14"
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

        {visibleEntries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No entries match this search.
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-5 overflow-x-hidden px-3 pb-12 pt-3 md:space-y-7 md:px-6 md:pt-6">
      <section className="relative min-w-0 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 p-5 text-white shadow-xl md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-emerald-300/10 blur-2xl" />
        <div className="relative">
          <Link
            href={toSubjectHref("/dashboard")}
            className="inline-flex h-9 max-w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {activeSubject?.name || "Islamic"} dashboard
            </span>
          </Link>
          <div className="mt-5 flex min-w-0 items-start gap-3 md:mt-6 md:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/15 text-emerald-200 shadow-inner md:h-14 md:w-14">
              <PrayerBeadsIcon className="h-7 w-7 md:h-9 md:w-9" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-300">
                ذِكْرُ اللَّهِ
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight md:text-4xl">
                Complete Adhkar Library
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50/80 md:text-base">
                132 organized Hisnul Muslim collections with Arabic,
                transliteration, English meaning, sources, and saved counters.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur md:mt-7">
            <div className="flex items-center justify-between gap-4 text-sm font-semibold">
              <span>Today&apos;s journey</span>
              <span className="shrink-0 tabular-nums text-emerald-200">
                {completedEntries}/{ADHKAR_TOTAL_ENTRIES} complete
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-emerald-300 transition-all duration-300"
                style={{
                  width: `${
                    ADHKAR_TOTAL_ENTRIES
                      ? (completedEntries / ADHKAR_TOTAL_ENTRIES) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="min-w-0">
        <div className="mb-3 px-1">
          <h2 className="text-lg font-bold text-slate-900 md:text-xl">
            Start here
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Morning and evening wording is presented separately and accurately.
          </p>
        </div>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          {FEATURED_ADHKAR_CATEGORIES.map((category) => {
            const Icon = FEATURED_ICONS[category.id] ?? PrayerBeadsIcon;
            const completed = category.entries.filter(
              (entry) => (progress[entry.id] ?? 0) >= entry.target,
            ).length;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => openCategory(category)}
                className="group flex min-w-0 items-center gap-3 rounded-3xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:p-5"
                style={{ borderColor: category.border }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    color: category.accent,
                    backgroundColor: category.soft,
                    border: `1px solid ${category.border}`,
                  }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    dir="rtl"
                    lang="ar"
                    className="text-right text-xs font-semibold"
                    style={{ color: category.accent }}
                  >
                    {category.arabicName}
                  </p>
                  <h3 className="mt-0.5 break-words text-base font-bold text-slate-900">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {completed}/{category.entries.length} complete
                  </p>
                </div>
                <ChevronRight
                  className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: category.accent }}
                />
              </button>
            );
          })}
        </div>
      </section>

      <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:p-5">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="h-5 w-5 text-emerald-700" />
          <div>
            <h2 className="font-bold text-slate-900">Browse all collections</h2>
            <p className="text-xs text-slate-500">
              132 collections · 267 unique invocations
            </p>
          </div>
        </div>

        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Arabic, English, transliteration, or source"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        {!query.trim() ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {ADHKAR_GROUPS.map((group) => {
              const Icon = GROUP_ICONS[group.id] ?? PrayerBeadsIcon;
              const selected = group.id === activeGroup;
              const count = ADHKAR_CATEGORIES.filter(
                (category) => category.group === group.id,
              ).length;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroup(group.id)}
                  className="inline-flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition"
                  style={{
                    color: selected ? "white" : group.accent,
                    backgroundColor: selected ? group.accent : group.soft,
                    borderColor: group.border,
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{group.name}</span>
                  <span className={selected ? "text-white/70" : "opacity-65"}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-5 flex items-end justify-between gap-3 px-1">
          <div className="min-w-0">
            <p
              dir="rtl"
              lang="ar"
              className="text-sm font-semibold"
              style={{ color: query.trim() ? "#047857" : currentGroup.accent }}
            >
              {query.trim() ? "نتائج البحث" : currentGroup.arabicName}
            </p>
            <h3 className="break-words text-base font-bold text-slate-900">
              {query.trim()
                ? `${visibleCategories.length} matching collections`
                : currentGroup.name}
            </h3>
          </div>
          {!query.trim() ? (
            <span className="shrink-0 text-xs font-semibold text-slate-400">
              {visibleCategories.length} collections
            </span>
          ) : null}
        </div>

        <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category) => {
            const group =
              ADHKAR_GROUPS.find(
                (candidate) => candidate.id === category.group,
              ) ?? currentGroup;
            const Icon = GROUP_ICONS[category.group] ?? PrayerBeadsIcon;
            const completed = category.entries.filter(
              (entry) => (progress[entry.id] ?? 0) >= entry.target,
            ).length;
            const matches = matchingEntries(category, query).length;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => openCategory(category)}
                className="group flex min-w-0 items-start gap-3 rounded-2xl border bg-white p-3 text-left transition hover:bg-slate-50 hover:shadow-sm"
                style={{ borderColor: category.border }}
              >
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    color: category.accent,
                    backgroundColor: category.soft,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="shrink-0 text-[10px] font-black uppercase tracking-wide"
                      style={{ color: group.accent }}
                    >
                      {category.chapterNumber}
                    </span>
                    <p
                      dir="rtl"
                      lang="ar"
                      className="min-w-0 truncate text-right text-xs font-semibold"
                      style={{ color: category.accent }}
                    >
                      {category.arabicName}
                    </p>
                  </div>
                  <h4 className="mt-0.5 break-words text-sm font-bold leading-5 text-slate-900">
                    {category.name}
                  </h4>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {query.trim()
                        ? `${matches} ${matches === 1 ? "match" : "matches"}`
                        : `${completed}/${category.entries.length} complete`}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                      style={{ color: category.accent }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {visibleCategories.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No Adhkar match this search.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Clear search
            </button>
          </div>
        ) : null}
      </section>

      <p className="px-2 text-center text-xs leading-5 text-slate-400">
        {ADHKAR_ATTRIBUTION}
      </p>
    </div>
  );
}
