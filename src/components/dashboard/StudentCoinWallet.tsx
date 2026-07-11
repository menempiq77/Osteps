"use client";

import { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSchoolSelfLeaderBoardData } from "@/services/leaderboardApi";
import { resolveCoinBalance } from "@/lib/leaderboard";
import { fetchStudentWalletBalance } from "@/services/studentWalletApi";

export const STUDENT_COINS_UPDATED_EVENT = "osteps:student-coins-updated";

export default function StudentCoinWallet({
  studentId,
}: {
  studentId: number | string;
}) {
  const queryClient = useQueryClient();
  const [recentAward, setRecentAward] = useState(0);
  const normalizedStudentId = String(studentId);

  const { data: balance = 0, refetch } = useQuery({
    queryKey: ["student-coin-wallet", normalizedStudentId],
    queryFn: async () => {
      try {
        const wallet = await fetchStudentWalletBalance();
        const coins = Number(wallet?.coin_balance ?? 0);
        return Number.isFinite(coins) ? coins : 0;
      } catch {
        const response = await fetchSchoolSelfLeaderBoardData();
        const row = (response?.data ?? []).find(
          (entry) => String(entry?.student_id ?? "") === normalizedStudentId
        );
        return resolveCoinBalance(row);
      }
    },
    enabled: Boolean(normalizedStudentId),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    const handleCoinsUpdated = (event: Event) => {
      const award = Number(
        (event as CustomEvent<{ amount?: number }>).detail?.amount ?? 0
      );
      if (award > 0) {
        setRecentAward(award);
        window.setTimeout(() => setRecentAward(0), 1800);
      }
      void refetch();
      void queryClient.invalidateQueries({
        queryKey: ["leaderboard-school-self"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["student-card-reward-balances"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["student-report-reward-balances"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["student-my-report-reward-balances"],
      });
    };

    window.addEventListener(STUDENT_COINS_UPDATED_EVENT, handleCoinsUpdated);
    return () =>
      window.removeEventListener(
        STUDENT_COINS_UPDATED_EVENT,
        handleCoinsUpdated
      );
  }, [queryClient, refetch]);

  return (
    <div
      className={`relative flex h-9 items-center gap-2 rounded-xl border border-amber-300/30 bg-gradient-to-r from-amber-400/20 to-yellow-300/10 px-3 text-amber-100 shadow-sm backdrop-blur-md transition ${
        recentAward ? "scale-105 ring-2 ring-amber-300/50" : ""
      }`}
      title="Your coin pocket"
      aria-label={`${balance} coins in your pocket`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 text-amber-900 shadow-[0_0_16px_rgba(252,211,77,0.45)]">
        <Coins className="h-4 w-4" />
      </span>
      <span className="leading-none">
        <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-amber-200/80">
          Pocket
        </span>
        <span className="block text-sm font-black text-white">
          {balance.toLocaleString()}
        </span>
      </span>
      {recentAward ? (
        <span className="pointer-events-none absolute -top-5 right-1 animate-bounce rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black text-amber-950 shadow-lg">
          +{recentAward}
        </span>
      ) : null}
    </div>
  );
}
