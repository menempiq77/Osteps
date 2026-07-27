"use client";

import { Check, MoonStar } from "lucide-react";
import type {
  PrayerHistoryDay,
  PrayerId,
} from "@/services/studentWalletApi";

const PRAYERS: { id: PrayerId; label: string }[] = [
  { id: "fajr", label: "Fajr · الفجر" },
  { id: "dhuhr", label: "Dhuhr · الظهر" },
  { id: "asr", label: "Asr · العصر" },
  { id: "maghrib", label: "Maghrib · المغرب" },
  { id: "isha", label: "Isha · العشاء" },
];

const formatRewardDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dubai",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
};

export default function PrayerHistoryCard({
  days,
  isLoading,
  isError,
}: {
  days: PrayerHistoryDay[];
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 inline-flex items-center gap-2 text-base font-bold text-slate-800">
            <MoonStar className="h-5 w-5 text-indigo-600" />
            Daily prayers
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Student-confirmed check-ins recorded by UAE calendar day
          </p>
        </div>
        {days.length ? (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            {days.length} recorded {days.length === 1 ? "day" : "days"}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <p className="m-0 rounded-xl bg-slate-50 px-3 py-4 text-sm font-medium text-slate-500">
          Loading prayer check-ins…
        </p>
      ) : isError ? (
        <p className="m-0 rounded-xl border border-amber-200 bg-amber-50 px-3 py-4 text-sm font-medium text-amber-900">
          Prayer check-ins could not be loaded.
        </p>
      ) : days.length ? (
        <div className="space-y-3">
          {days.map((day) => (
            <article
              key={day.reward_date}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <time
                  dateTime={day.reward_date}
                  className="text-sm font-bold text-slate-800"
                >
                  {formatRewardDate(day.reward_date)}
                </time>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-indigo-800">
                    {day.completed_count}/5 prayers
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">
                    +{day.coins_earned} coins
                  </span>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                {PRAYERS.map((prayer) => {
                  const completed = day.prayer_ids.includes(prayer.id);
                  return (
                    <span
                      key={prayer.id}
                      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-center text-xs font-bold ${
                        completed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-white text-slate-400"
                      }`}
                    >
                      {completed ? <Check className="h-3.5 w-3.5" /> : null}
                      {prayer.label}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-xl bg-slate-50 px-3 py-4 text-sm font-medium text-slate-500">
          No prayer check-ins have been recorded yet.
        </p>
      )}
    </section>
  );
}
