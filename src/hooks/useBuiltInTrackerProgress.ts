"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  fetchBuiltInTrackerProgress,
  submitBuiltInLessonAttempt,
  type BuiltInLessonProgress,
} from "@/services/studentWalletApi";

const STORAGE_KEY = "osteps_builtin_tracker_progress_v1";

export type BuiltInAttemptOutcome = {
  passed: boolean;
  awarded: boolean;
  coinsEarned: number;
  coinBalance: number | null;
  synced: boolean;
};

type ProgressMap = Record<string, BuiltInLessonProgress>;

const storageKeyFor = (studentId: number | null) =>
  `${STORAGE_KEY}:${studentId ?? "guest"}`;

const readLocalProgress = (
  studentId: number | null,
  trackerId: string
): ProgressMap => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKeyFor(studentId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ProgressMap>;
    return parsed?.[trackerId] ?? {};
  } catch {
    return {};
  }
};

const writeLocalProgress = (
  studentId: number | null,
  trackerId: string,
  progress: ProgressMap
) => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(storageKeyFor(studentId));
    const parsed = raw ? (JSON.parse(raw) as Record<string, ProgressMap>) : {};
    parsed[trackerId] = progress;
    window.localStorage.setItem(storageKeyFor(studentId), JSON.stringify(parsed));
  } catch {
    // Progress is a convenience only — ignore storage failures.
  }
};

const mergeLesson = (
  current: BuiltInLessonProgress | undefined,
  next: BuiltInLessonProgress
): BuiltInLessonProgress => ({
  lesson_id: next.lesson_id,
  best_score: Math.max(current?.best_score ?? 0, next.best_score),
  total_questions: next.total_questions || current?.total_questions || 0,
  attempts: Math.max(current?.attempts ?? 0, next.attempts),
  passed: Boolean(current?.passed) || next.passed,
  coins_awarded: Math.max(current?.coins_awarded ?? 0, next.coins_awarded),
});

export function useBuiltInTrackerProgress(
  trackerId: string,
  options: { passMark: number; totalQuestions: number }
) {
  const { passMark, totalQuestions } = options;
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const roleKey = String(currentUser?.role ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  const isStudent = roleKey === "STUDENT";
  const studentId = useMemo(() => {
    const value = Number(currentUser?.student);
    return Number.isInteger(value) && value > 0 ? value : null;
  }, [currentUser?.student]);

  const [progress, setProgress] = useState<ProgressMap>({});
  const [coinBalance, setCoinBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(isStudent);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const local = readLocalProgress(studentId, trackerId);
    setProgress(local);

    if (!isStudent) {
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    fetchBuiltInTrackerProgress(trackerId)
      .then((result) => {
        if (cancelled) return;
        const merged: ProgressMap = { ...local };
        result.lessons.forEach((lesson) => {
          merged[lesson.lesson_id] = mergeLesson(merged[lesson.lesson_id], lesson);
        });
        setProgress(merged);
        setCoinBalance(result.coin_balance);
        setSynced(true);
        writeLocalProgress(studentId, trackerId, merged);
      })
      .catch(() => {
        if (!cancelled) setSynced(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isStudent, studentId, trackerId]);

  const recordAttempt = useCallback(
    async (lessonId: string, score: number): Promise<BuiltInAttemptOutcome> => {
      const passed = score >= passMark;
      let awarded = false;
      let coinsEarned = 0;
      let balance: number | null = null;
      let didSync = false;
      let serverLessons: BuiltInLessonProgress[] = [];

      if (isStudent) {
        try {
          const result = await submitBuiltInLessonAttempt({
            tracker_id: trackerId,
            lesson_id: lessonId,
            score,
            total_questions: totalQuestions,
          });
          awarded = result.awarded;
          coinsEarned = result.coins_earned;
          balance = result.coin_balance;
          serverLessons = result.lessons;
          didSync = true;
        } catch {
          didSync = false;
        }
      }

      setProgress((current) => {
        const next: ProgressMap = { ...current };
        next[lessonId] = mergeLesson(current[lessonId], {
          lesson_id: lessonId,
          best_score: score,
          total_questions: totalQuestions,
          attempts: (current[lessonId]?.attempts ?? 0) + 1,
          passed,
          coins_awarded: coinsEarned,
        });
        serverLessons.forEach((lesson) => {
          next[lesson.lesson_id] = mergeLesson(next[lesson.lesson_id], lesson);
        });
        writeLocalProgress(studentId, trackerId, next);
        return next;
      });

      if (balance !== null) setCoinBalance(balance);
      if (didSync) setSynced(true);

      return {
        passed,
        awarded,
        coinsEarned,
        coinBalance: balance,
        synced: didSync,
      };
    },
    [isStudent, passMark, studentId, totalQuestions, trackerId]
  );

  return {
    isStudent,
    loading,
    synced,
    coinBalance,
    progress,
    recordAttempt,
  };
}
