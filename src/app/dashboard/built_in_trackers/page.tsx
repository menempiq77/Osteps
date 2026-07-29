"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, Coins, Sparkles, Target } from "lucide-react";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  BUILT_IN_TRACKERS,
  supportsBuiltInTrackers,
} from "@/lib/builtinTrackers";

export default function BuiltInTrackersPage() {
  const searchParams = useSearchParams();
  const { activeSubject, loading } = useSubjectContext();
  const subjectId = searchParams.get("subject_id");
  const subjectQuery = subjectId ? `?subject_id=${subjectId}` : "";
  const allowed = supportsBuiltInTrackers(activeSubject?.name);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <Link
        href={`/dashboard/all_trackers${subjectQuery}`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to trackers
      </Link>

      {!allowed ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h1 className="text-lg font-bold">Built-in Trackers</h1>
          <p className="mt-2 text-sm">
            Built-in trackers are only available inside Islamic Studies
            subjects (Islamic, Islamiyat, Religious Studies, التربية الإسلامية
            and similar).
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white shadow-lg md:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-100">
              <Sparkles className="h-4 w-4" />
              Built-in Trackers
            </div>
            <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">
              {activeSubject?.name
                ? `${activeSubject.name} — ready-made trackers`
                : "Ready-made trackers"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50">
              Trackers prepared by Osteps for Islamic Studies. Students read,
              answer the questions and collect coins — no setup needed.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {BUILT_IN_TRACKERS.map((tracker) => (
              <Link
                key={tracker.id}
                href={`/dashboard/built_in_trackers/${tracker.id}${subjectQuery}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tracker.accent}`}
                />
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tracker.accent} text-2xl shadow-inner`}
                  >
                    {tracker.emoji}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700">
                      {tracker.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {tracker.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    <BookOpen className="h-3.5 w-3.5" />
                    {tracker.lessons.length} {tracker.lessonLabelPlural}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                    <Target className="h-3.5 w-3.5" />
                    Pass {tracker.passMark}/10
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                    <Coins className="h-3.5 w-3.5" />
                    {tracker.coinReward} coins each
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
