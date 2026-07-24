import axios from "axios";
import { store } from "@/store/store";
import { API_BASE_URL } from "@/lib/config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type StudentWalletBalance = {
  student_id: number;
  coin_balance: number;
};

export type StudentGamePass = StudentWalletBalance & {
  game_id: string;
  run_id: string;
  entry_cost: number;
  active: boolean;
  charged: boolean;
  expires_at: number | null;
};

export type AdhkarRewardStatus = StudentWalletBalance & {
  reward_date: string;
  morning_claimed: boolean;
  evening_claimed: boolean;
  dua_ids: string[];
};

export type AdhkarRewardClaim = AdhkarRewardStatus & {
  reward_type: "morning" | "evening" | "dua";
  adhkar_id: string | null;
  reward_amount: number;
  awarded: boolean;
};

const activeStudentId = () => {
  const studentId = Number(store.getState().auth.currentUser?.student);
  return Number.isInteger(studentId) && studentId > 0 ? studentId : null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeWalletBalance = (value: unknown): StudentWalletBalance => {
  if (!isRecord(value)) {
    throw new Error("The student wallet returned an invalid response.");
  }

  const studentId = Number(value.student_id);
  const coinBalance = Number(value.coin_balance);
  if (
    !Number.isInteger(studentId) ||
    studentId <= 0 ||
    !Number.isFinite(coinBalance) ||
    coinBalance < 0
  ) {
    throw new Error("The student wallet returned an invalid balance.");
  }

  return {
    student_id: studentId,
    coin_balance: coinBalance,
  };
};

const normalizeGamePass = (value: unknown): StudentGamePass => {
  const wallet = normalizeWalletBalance(value);
  const record = isRecord(value) ? value : {};
  const gameId = String(record.game_id ?? "");
  const runId = String(record.run_id ?? "");
  const entryCost = Number(record.entry_cost);
  const expiresAt =
    record.expires_at === null ? null : Number(record.expires_at);

  if (
    !gameId ||
    !runId ||
    !Number.isInteger(entryCost) ||
    entryCost <= 0 ||
    (expiresAt !== null &&
      (!Number.isFinite(expiresAt) || expiresAt <= 0))
  ) {
    throw new Error("The game pass service returned an invalid response.");
  }

  return {
    ...wallet,
    game_id: gameId,
    run_id: runId,
    entry_cost: entryCost,
    active: record.active === true,
    charged: record.charged === true,
    expires_at: expiresAt,
  };
};

const normalizeAdhkarRewardStatus = (
  value: unknown,
): AdhkarRewardStatus => {
  const wallet = normalizeWalletBalance(value);
  const record = isRecord(value) ? value : {};
  const rewardDate = String(record.reward_date ?? "");
  const duaIds = Array.isArray(record.dua_ids)
    ? record.dua_ids.filter(
        (id): id is string => typeof id === "string" && id.length > 0,
      )
    : [];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(rewardDate)) {
    throw new Error("The Adhkar reward service returned an invalid response.");
  }

  return {
    ...wallet,
    reward_date: rewardDate,
    morning_claimed: record.morning_claimed === true,
    evening_claimed: record.evening_claimed === true,
    dua_ids: duaIds,
  };
};

const normalizeAdhkarRewardClaim = (
  value: unknown,
): AdhkarRewardClaim => {
  const status = normalizeAdhkarRewardStatus(value);
  const record = isRecord(value) ? value : {};
  const rewardType = String(record.reward_type ?? "");
  const rewardAmount = Number(record.reward_amount);

  if (
    (rewardType !== "morning" &&
      rewardType !== "evening" &&
      rewardType !== "dua") ||
    !Number.isInteger(rewardAmount) ||
    rewardAmount <= 0
  ) {
    throw new Error("The Adhkar reward service returned an invalid response.");
  }

  return {
    ...status,
    reward_type: rewardType,
    adhkar_id:
      record.adhkar_id === null ? null : String(record.adhkar_id ?? ""),
    reward_amount: rewardAmount,
    awarded: record.awarded === true,
  };
};

export const fetchStudentWalletBalance = async (): Promise<StudentWalletBalance> => {
  const studentId = activeStudentId();
  const response = await api.get("/student-wallet/balance", {
    params: studentId ? { student_id: studentId } : undefined,
  });
  return normalizeWalletBalance(response?.data?.data ?? response?.data);
};

const studentPayload = () => {
  const studentId = activeStudentId();
  return studentId ? { student_id: studentId } : {};
};

export const spendStudentCoins = async (payload: {
  amount: number;
  purchase_key: string;
  description?: string;
}): Promise<StudentWalletBalance> => {
  const studentId = activeStudentId();
  const response = await api.post("/student-wallet/spend", {
    ...payload,
    ...(studentId ? { student_id: studentId } : {}),
  });
  return normalizeWalletBalance(response?.data?.data ?? response?.data);
};

export const purchaseStudentGamePass = async (payload: {
  game_id: string;
  run_id: string;
}): Promise<StudentGamePass> => {
  const response = await api.post("/student-wallet/game-pass", {
    ...payload,
    ...studentPayload(),
  });

  return normalizeGamePass(response?.data?.data ?? response?.data);
};

export const fetchStudentGamePassStatus = async (payload: {
  game_id: string;
  run_id: string;
}): Promise<StudentGamePass> => {
  const response = await api.post("/student-wallet/game-pass/status", {
    ...payload,
    ...studentPayload(),
  });

  return normalizeGamePass(response?.data?.data ?? response?.data);
};

export const fetchAdhkarRewardStatus =
  async (): Promise<AdhkarRewardStatus> => {
    const response = await api.get("/student-wallet/adhkar-rewards", {
      params: studentPayload(),
    });

    return normalizeAdhkarRewardStatus(
      response?.data?.data ?? response?.data,
    );
  };

export const claimAdhkarReward = async (payload: {
  reward_type: "morning" | "evening" | "dua";
  adhkar_id?: string;
}): Promise<AdhkarRewardClaim> => {
  const response = await api.post("/student-wallet/adhkar-rewards", {
    ...payload,
    ...studentPayload(),
  });

  return normalizeAdhkarRewardClaim(
    response?.data?.data ?? response?.data,
  );
};
