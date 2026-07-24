"use client";

import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { STUDENT_COINS_UPDATED_EVENT } from "@/components/dashboard/StudentCoinWallet";
import {
  fetchStudentGamePassStatus,
  fetchStudentWalletBalance,
  purchaseStudentGamePass,
} from "@/services/studentWalletApi";
import { RootState } from "@/store/store";

type ArcadePassConfig = {
  gameId: string;
  gameTitle: string;
  entryCost: number;
  durationMs?: number;
};

type SavedArcadePass = {
  version: 1;
  runId: string;
  purchasePending: boolean;
  active: boolean;
  expiresAt: number;
};

type CheckoutErrorData = {
  message?: string;
  errors?: {
    amount?: string[];
  };
};

const checkoutErrorMessage = (error: unknown, gameTitle: string) => {
  if (axios.isAxiosError<CheckoutErrorData>(error)) {
    const amountError = error.response?.data?.errors?.amount?.[0];
    if (amountError) return amountError;
    if (error.response?.status === 404 || error.response?.status === 405) {
      return "Coin checkout is not active yet. Ask your school administrator to enable the student wallet service.";
    }
    if (error.response?.data?.message) return error.response.data.message;
  }

  return `${gameTitle} could not confirm your coin payment. The pass was not activated, so please try again.`;
};

export default function useArcadePass({
  gameId,
  gameTitle,
  entryCost,
  durationMs = 2 * 60 * 60 * 1000,
}: ArcadePassConfig) {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const role = String(currentUser?.role ?? "").trim().toUpperCase();
  const isStudent = role === "STUDENT";
  const studentId = String(currentUser?.student ?? "");
  const storageKey = useMemo(
    () => `osteps:arcade-pass:${gameId}:${currentUser?.id ?? "guest"}`,
    [currentUser?.id, gameId],
  );
  const [pass, setPass] = useState<SavedArcadePass | null>(null);
  const [isRestored, setIsRestored] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const {
    data: wallet,
    isLoading: isWalletLoading,
    isError: isWalletUnavailable,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ["student-coin-wallet", studentId],
    queryFn: fetchStudentWalletBalance,
    enabled: isStudent && Boolean(studentId),
    staleTime: 30 * 1000,
    retry: 1,
  });

  useEffect(() => {
    let cancelled = false;
    setIsRestored(false);
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      setPass(null);
      setIsRestored(true);
      return () => {
        cancelled = true;
      };
    }

    const restorePass = async () => {
      try {
        const saved = JSON.parse(raw) as Partial<SavedArcadePass>;
        if (
          saved.version !== 1 ||
          typeof saved.runId !== "string" ||
          !Number.isFinite(saved.expiresAt)
        ) {
          window.localStorage.removeItem(storageKey);
          setPass(null);
        } else if ((saved.expiresAt ?? 0) <= Date.now()) {
          window.localStorage.removeItem(storageKey);
          setPass(null);
        } else if (isStudent) {
          if (!studentId) {
            window.localStorage.removeItem(storageKey);
            setPass(null);
            return;
          }

          const verified = await fetchStudentGamePassStatus({
            game_id: gameId,
            run_id: saved.runId,
          });
          if (
            !verified.active ||
            verified.expires_at === null ||
            verified.expires_at <= Date.now()
          ) {
            window.localStorage.removeItem(storageKey);
            setPass(null);
            return;
          }

          const restoredPass: SavedArcadePass = {
            version: 1,
            runId: verified.run_id,
            purchasePending: false,
            active: true,
            expiresAt: verified.expires_at,
          };
          window.localStorage.setItem(
            storageKey,
            JSON.stringify(restoredPass),
          );
          setPass(restoredPass);
        } else {
          setPass({
            version: 1,
            runId: saved.runId,
            purchasePending: Boolean(saved.purchasePending),
            active: Boolean(saved.active),
            expiresAt: saved.expiresAt ?? Date.now() + durationMs,
          });
        }
      } catch (error) {
        if (isStudent) {
          try {
            const saved = JSON.parse(raw) as Partial<SavedArcadePass>;
            if (
              saved.version === 1 &&
              typeof saved.runId === "string" &&
              Number.isFinite(saved.expiresAt) &&
              (saved.expiresAt ?? 0) > Date.now()
            ) {
              setPass({
                version: 1,
                runId: saved.runId,
                purchasePending: true,
                active: false,
                expiresAt: saved.expiresAt ?? Date.now() + durationMs,
              });
            } else {
              window.localStorage.removeItem(storageKey);
              setPass(null);
            }
          } catch {
            window.localStorage.removeItem(storageKey);
            setPass(null);
          }
          setCheckoutError(checkoutErrorMessage(error, gameTitle));
        } else {
          window.localStorage.removeItem(storageKey);
          setPass(null);
        }
      } finally {
        if (!cancelled) setIsRestored(true);
      }
    };

    void restorePass();
    return () => {
      cancelled = true;
    };
  }, [
    durationMs,
    gameId,
    gameTitle,
    isStudent,
    storageKey,
    studentId,
  ]);

  const savePass = (nextPass: SavedArcadePass) => {
    window.localStorage.setItem(storageKey, JSON.stringify(nextPass));
    setPass(nextPass);
  };

  const startPass = async () => {
    setCheckoutError(null);
    setIsStarting(true);

    if (pass?.active && pass.expiresAt > Date.now()) {
      setIsStarting(false);
      return true;
    }

    const pendingRunId =
      pass?.purchasePending && !pass.active ? pass.runId : null;
    const isPendingRetry = Boolean(pendingRunId);
    const runId = pendingRunId ?? crypto.randomUUID();
    const expiresAt = Date.now() + durationMs;

    if (isStudent) {
      if (!studentId) {
        setCheckoutError("A student profile is required to enter the arcade.");
        setIsStarting(false);
        return false;
      }

      if (!isPendingRetry) {
        const walletResult = await refetchWallet();
        if (walletResult.error) {
          setCheckoutError(checkoutErrorMessage(walletResult.error, gameTitle));
          setIsStarting(false);
          return false;
        }

        const balance = Number(walletResult.data?.coin_balance ?? 0);
        if (balance < entryCost) {
          setCheckoutError(
            `You need ${entryCost} coins to play. Complete more tracker topics to fill your pocket.`,
          );
          setIsStarting(false);
          return false;
        }
      }

      savePass({
        version: 1,
        runId,
        purchasePending: true,
        active: false,
        expiresAt,
      });

      try {
        const gamePass = await purchaseStudentGamePass({
          game_id: gameId,
          run_id: runId,
        });
        queryClient.setQueryData(
          ["student-coin-wallet", studentId],
          {
            student_id: gamePass.student_id,
            coin_balance: gamePass.coin_balance,
          },
        );
        if (gamePass.charged) {
          window.dispatchEvent(
            new CustomEvent(STUDENT_COINS_UPDATED_EVENT, {
              detail: { amount: -gamePass.entry_cost },
            }),
          );
        }
        if (
          !gamePass.active ||
          gamePass.expires_at === null ||
          gamePass.expires_at <= Date.now()
        ) {
          throw new Error("The paid game pass was not activated.");
        }

        savePass({
          version: 1,
          runId: gamePass.run_id,
          purchasePending: false,
          active: true,
          expiresAt: gamePass.expires_at,
        });
      } catch (error) {
        setCheckoutError(checkoutErrorMessage(error, gameTitle));
        setIsStarting(false);
        return false;
      }
    } else {
      savePass({
        version: 1,
        runId,
        purchasePending: false,
        active: true,
        expiresAt,
      });
    }
    setIsStarting(false);
    return true;
  };

  const endPass = () => {
    window.localStorage.removeItem(storageKey);
    setPass(null);
    setCheckoutError(null);
  };

  return {
    checkoutError,
    entryCost,
    endPass,
    isPreview: !isStudent,
    isRestored,
    isStarting,
    isWalletLoading,
    isWalletUnavailable,
    passActive: Boolean(pass?.active && pass.expiresAt > Date.now()),
    passExpiresAt: pass?.expiresAt ?? null,
    startPass,
    walletBalance: Number(wallet?.coin_balance ?? 0),
  };
}
