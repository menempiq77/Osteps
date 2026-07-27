"use client";

import {
  ArrowLeft,
  Check,
  CircleAlert,
  Coins,
  LoaderCircle,
  MoonStar,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { STUDENT_COINS_UPDATED_EVENT } from "@/components/dashboard/StudentCoinWallet";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { isIslamicSubjectName } from "@/lib/adhkarData";
import {
  claimPrayerReward,
  fetchPrayerRewardStatus,
  type PrayerId,
} from "@/services/studentWalletApi";
import { RootState } from "@/store/store";

type PrayerDefinition = {
  id: PrayerId;
  name: string;
  arabicName: string;
  description: string;
  Icon: LucideIcon;
  accent: string;
  surface: string;
  border: string;
};

type Notice = {
  tone: "success" | "info" | "error";
  message: string;
};

const PRAYERS: PrayerDefinition[] = [
  {
    id: "fajr",
    name: "Fajr",
    arabicName: "الفجر",
    description: "The dawn prayer that begins the day with remembrance.",
    Icon: Sunrise,
    accent: "#c2410c",
    surface: "#fff7ed",
    border: "#fed7aa",
  },
  {
    id: "dhuhr",
    name: "Dhuhr",
    arabicName: "الظهر",
    description: "The midday prayer and a peaceful pause during the day.",
    Icon: Sun,
    accent: "#a16207",
    surface: "#fefce8",
    border: "#fef08a",
  },
  {
    id: "asr",
    name: "Asr",
    arabicName: "العصر",
    description: "The afternoon prayer before the day begins to close.",
    Icon: Sparkles,
    accent: "#047857",
    surface: "#ecfdf5",
    border: "#a7f3d0",
  },
  {
    id: "maghrib",
    name: "Maghrib",
    arabicName: "المغرب",
    description: "The sunset prayer offered as daylight ends.",
    Icon: Sunset,
    accent: "#be123c",
    surface: "#fff1f2",
    border: "#fecdd3",
  },
  {
    id: "isha",
    name: "Isha",
    arabicName: "العشاء",
    description: "The night prayer that completes the five daily prayers.",
    Icon: MoonStar,
    accent: "#4338ca",
    surface: "#eef2ff",
    border: "#c7d2fe",
  },
];

const BALLOON_POSITIONS = [6, 15, 25, 37, 49, 61, 73, 84, 94];
const CONFETTI_COLORS = [
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#ec4899",
  "#06b6d4",
];

const playApplause = () => {
  if (typeof window === "undefined") return;
  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    const master = context.createGain();
    master.gain.setValueAtTime(0.22, context.currentTime);
    master.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 1.45,
    );
    master.connect(context.destination);

    for (let clap = 0; clap < 18; clap += 1) {
      const start =
        context.currentTime + 0.04 + clap * 0.068 + (clap % 3) * 0.012;
      const sampleCount = Math.floor(context.sampleRate * 0.045);
      const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let sample = 0; sample < sampleCount; sample += 1) {
        channel[sample] = Math.random() * 2 - 1;
      }

      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      filter.type = "bandpass";
      filter.frequency.value = 1100 + (clap % 5) * 170;
      filter.Q.value = 0.7;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(
        0.32 + (clap % 4) * 0.035,
        start + 0.004,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.043);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(start);
      source.stop(start + 0.05);
    }

    window.setTimeout(() => void context.close(), 1700);
  } catch {
    return;
  }
};

export default function DailyPrayersPage() {
  const { activeSubject, loading, toSubjectHref } = useSubjectContext();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const role = String(currentUser?.role ?? "").trim().toUpperCase();
  const isStudent = role === "STUDENT";
  const studentId = String(currentUser?.student ?? "");
  const isIslamicSubject = isIslamicSubjectName(activeSubject?.name);
  const [pendingPrayerId, setPendingPrayerId] = useState<PrayerId | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [celebration, setCelebration] = useState<PrayerDefinition | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const {
    data: rewardStatus,
    isLoading: rewardLoading,
    isError: rewardUnavailable,
    refetch: refetchRewardStatus,
  } = useQuery({
    queryKey: ["prayer-reward-status", studentId],
    queryFn: fetchPrayerRewardStatus,
    enabled: isStudent && Boolean(studentId) && isIslamicSubject,
    staleTime: 30 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!celebration) return;
    const timeout = window.setTimeout(() => setCelebration(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [celebration]);

  const claimedPrayerIds = rewardStatus?.prayer_ids ?? [];
  const claimedCount = claimedPrayerIds.length;

  const claimPrayer = async (prayer: PrayerDefinition) => {
    if (
      !isStudent ||
      !studentId ||
      pendingPrayerId ||
      claimedPrayerIds.includes(prayer.id)
    ) {
      return;
    }

    setPendingPrayerId(prayer.id);
    setNotice(null);
    try {
      const result = await claimPrayerReward({ prayer_id: prayer.id });
      queryClient.setQueryData(["prayer-reward-status", studentId], result);
      queryClient.setQueryData(["student-coin-wallet", studentId], {
        student_id: result.student_id,
        coin_balance: result.coin_balance,
      });

      if (result.awarded) {
        window.dispatchEvent(
          new CustomEvent(STUDENT_COINS_UPDATED_EVENT, {
            detail: { amount: result.reward_amount },
          }),
        );
        setCelebration(prayer);
        if (soundEnabled) playApplause();
      }

      setNotice({
        tone: result.awarded ? "success" : "info",
        message: result.awarded
          ? `${prayer.name} confirmed — +${result.reward_amount} coins added to your pocket.`
          : `${prayer.name} was already rewarded today.`,
      });
    } catch {
      setNotice({
        tone: "error",
        message:
          "Your prayer reward could not be confirmed. No coins were shown as collected; please retry.",
      });
    } finally {
      setPendingPrayerId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      </div>
    );
  }

  if (!isIslamicSubject) {
    return (
      <div className="mx-auto max-w-xl px-3 py-8 md:px-6">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
          <MoonStar className="mx-auto h-11 w-11 text-amber-700" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Open Daily Prayers from an Islamic subject
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The five-prayer check-in is available inside Islamic and religious
            subject workspaces.
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

  return (
    <div className="relative mx-auto min-w-0 max-w-5xl space-y-4 overflow-x-hidden px-3 pb-12 pt-3 md:space-y-6 md:px-6 md:pt-6">
      <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 text-white shadow-xl">
        <div className="relative px-4 py-5 md:px-7 md:py-7">
          <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href={toSubjectHref("/dashboard")}
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-100 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Subject dashboard
              </Link>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner">
                  <MoonStar className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
                    Daily worship
                  </p>
                  <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
                    The Five Daily Prayers
                  </h1>
                  <p className="mt-1 text-lg font-semibold text-indigo-100" dir="rtl">
                    الصلوات الخمس
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-100 md:text-base">
                After you perform a prayer, mark it here once. Each prayer
                earns 10 spendable coins once per day.
              </p>
            </div>
            {isStudent ? (
              <button
                type="button"
                onClick={() => setSoundEnabled((current) => !current)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/20"
                aria-label={
                  soundEnabled
                    ? "Turn celebration sound off"
                    : "Turn celebration sound on"
                }
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
                {soundEnabled ? "Sound on" : "Sound off"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {isStudent ? (
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today&apos;s progress
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900">
              {claimedCount}/5
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Prayer coins today
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-2xl font-black text-amber-900">
              <Coins className="h-5 w-5" />
              {claimedCount * 10}/50
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Daily reset
            </p>
            <p className="mt-1 text-sm font-bold text-emerald-900">
              {rewardStatus?.reward_date ?? "Server dated"}
            </p>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-900">
          Students can confirm each completed prayer and collect its daily
          reward. Staff are viewing a read-only preview.
        </div>
      )}

      {isStudent && rewardLoading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Checking today&apos;s prayer rewards…
        </div>
      ) : isStudent && rewardUnavailable ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="inline-flex items-center gap-2 font-semibold">
            <CircleAlert className="h-4 w-4 shrink-0" />
            Prayer rewards are unavailable. No prayer will be shown as
            collected.
          </span>
          <button
            type="button"
            onClick={() => void refetchRewardStatus()}
            className="rounded-xl bg-amber-900 px-3 py-2 text-xs font-bold text-white"
          >
            Retry
          </button>
        </div>
      ) : null}

      {notice ? (
        <div
          role="status"
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            notice.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : notice.tone === "error"
                ? "border-rose-200 bg-rose-50 text-rose-900"
                : "border-indigo-200 bg-indigo-50 text-indigo-900"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2">
        {PRAYERS.map((prayer, index) => {
          const claimed = claimedPrayerIds.includes(prayer.id);
          const pending = pendingPrayerId === prayer.id;
          const disabled =
            !isStudent ||
            rewardLoading ||
            rewardUnavailable ||
            pendingPrayerId !== null ||
            claimed;

          return (
            <article
              key={prayer.id}
              className={`relative overflow-hidden rounded-3xl border p-4 shadow-sm transition md:p-5 ${
                index === PRAYERS.length - 1 ? "md:col-span-2" : ""
              }`}
              style={{
                backgroundColor: prayer.surface,
                borderColor: prayer.border,
              }}
            >
              <div
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10"
                style={{ backgroundColor: prayer.accent }}
              />
              <div className="relative flex items-start gap-4">
                <span
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm"
                  style={{ color: prayer.accent }}
                >
                  <prayer.Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-xl font-black text-slate-900">
                      {prayer.name}
                    </h2>
                    <span
                      className="text-xl font-black"
                      style={{ color: prayer.accent }}
                      dir="rtl"
                    >
                      {prayer.arabicName}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {prayer.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-black text-amber-800 shadow-sm">
                      <Coins className="h-4 w-4" />
                      10 coins once today
                    </span>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => void claimPrayer(prayer)}
                      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black shadow-sm transition ${
                        claimed
                          ? "cursor-default bg-emerald-600 text-white disabled:opacity-100"
                          : "bg-slate-950 text-white hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      }`}
                    >
                      {pending ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : claimed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <MoonStar className="h-4 w-4" />
                      )}
                      {pending
                        ? "Confirming…"
                        : claimed
                          ? "Prayed today · 10 coins collected"
                          : isStudent
                            ? `I prayed ${prayer.name}`
                            : "Student check-in"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <p className="text-center text-xs leading-5 text-slate-500">
        This is a personal trust-based check-in. Rewards are confirmed by the
        server and each prayer can be collected only once per day.
      </p>

      {celebration ? (
        <div
          className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
          role="status"
          aria-live="polite"
        >
          <div className="absolute left-1/2 top-[18%] z-10 -translate-x-1/2 animate-bounce rounded-3xl border border-amber-200 bg-white/95 px-6 py-4 text-center shadow-2xl backdrop-blur">
            <p className="text-2xl font-black text-slate-900">
              Masha&apos;Allah!
            </p>
            <p className="mt-1 text-sm font-bold text-indigo-700">
              {celebration.name} prayer complete · +10 coins
            </p>
          </div>
          {BALLOON_POSITIONS.map((left, index) => (
            <span
              key={left}
              className="prayer-balloon absolute bottom-[-90px] text-5xl drop-shadow-lg"
              style={{
                left: `${left}%`,
                animationDelay: `${index * 90}ms`,
                animationDuration: `${2.5 + (index % 3) * 0.35}s`,
              }}
            >
              🎈
            </span>
          ))}
          {Array.from({ length: 35 }, (_, index) => (
            <span
              key={index}
              className="prayer-confetti absolute -top-5 h-3 w-2 rounded-sm"
              style={{
                left: `${(index * 29) % 100}%`,
                backgroundColor:
                  CONFETTI_COLORS[index % CONFETTI_COLORS.length],
                animationDelay: `${(index % 9) * 80}ms`,
                animationDuration: `${1.9 + (index % 5) * 0.22}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      <style jsx>{`
        @keyframes prayer-balloon-rise {
          0% {
            transform: translateY(0) rotate(-5deg);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          100% {
            transform: translateY(-115vh) rotate(8deg);
            opacity: 0;
          }
        }
        @keyframes prayer-confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .prayer-balloon {
          animation-name: prayer-balloon-rise;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
        .prayer-confetti {
          animation-name: prayer-confetti-fall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .prayer-balloon,
          .prayer-confetti {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
