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

export type PrayerId = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type PrayerRewardStatus = StudentWalletBalance & {
  reward_date: string;
  prayer_ids: PrayerId[];
};

export type PrayerRewardClaim = PrayerRewardStatus & {
  prayer_id: PrayerId;
  reward_amount: number;
  awarded: boolean;
};

export type PrayerHistoryDay = {
  reward_date: string;
  prayer_ids: PrayerId[];
  completed_count: number;
  coins_earned: number;
};

const PRAYER_IDS: PrayerId[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

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

const isPrayerId = (value: unknown): value is PrayerId =>
  typeof value === "string" && PRAYER_IDS.includes(value as PrayerId);

const normalizePrayerRewardStatus = (
  value: unknown,
): PrayerRewardStatus => {
  const wallet = normalizeWalletBalance(value);
  const record = isRecord(value) ? value : {};
  const rewardDate = String(record.reward_date ?? "");
  const prayerIds = Array.isArray(record.prayer_ids)
    ? record.prayer_ids.filter(isPrayerId)
    : [];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(rewardDate)) {
    throw new Error("The prayer reward service returned an invalid response.");
  }

  return {
    ...wallet,
    reward_date: rewardDate,
    prayer_ids: prayerIds,
  };
};

const normalizePrayerRewardClaim = (
  value: unknown,
): PrayerRewardClaim => {
  const status = normalizePrayerRewardStatus(value);
  const record = isRecord(value) ? value : {};
  const prayerId = record.prayer_id;
  const rewardAmount = Number(record.reward_amount);

  if (
    !isPrayerId(prayerId) ||
    !Number.isInteger(rewardAmount) ||
    rewardAmount <= 0
  ) {
    throw new Error("The prayer reward service returned an invalid response.");
  }

  return {
    ...status,
    prayer_id: prayerId,
    reward_amount: rewardAmount,
    awarded: record.awarded === true,
  };
};

const normalizePrayerHistory = (value: unknown): PrayerHistoryDay[] => {
  if (!isRecord(value) || !Array.isArray(value.days)) {
    throw new Error("The prayer history service returned an invalid response.");
  }

  return value.days.map((day) => {
    if (!isRecord(day)) {
      throw new Error("The prayer history service returned an invalid day.");
    }

    const rewardDate = String(day.reward_date ?? "");
    const prayerIds = Array.isArray(day.prayer_ids)
      ? day.prayer_ids.filter(isPrayerId)
      : [];
    const completedCount = Number(day.completed_count);
    const coinsEarned = Number(day.coins_earned);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(rewardDate) ||
      !Number.isInteger(completedCount) ||
      completedCount !== prayerIds.length ||
      completedCount < 1 ||
      completedCount > PRAYER_IDS.length ||
      !Number.isInteger(coinsEarned) ||
      coinsEarned !== completedCount * 10
    ) {
      throw new Error("The prayer history service returned invalid totals.");
    }

    return {
      reward_date: rewardDate,
      prayer_ids: prayerIds,
      completed_count: completedCount,
      coins_earned: coinsEarned,
    };
  });
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

export const fetchPrayerRewardStatus =
  async (): Promise<PrayerRewardStatus> => {
    const response = await api.get("/student-wallet/prayer-rewards", {
      params: studentPayload(),
    });

    return normalizePrayerRewardStatus(
      response?.data?.data ?? response?.data,
    );
  };

export const claimPrayerReward = async (payload: {
  prayer_id: PrayerId;
}): Promise<PrayerRewardClaim> => {
  const response = await api.post("/student-wallet/prayer-rewards", {
    ...payload,
    ...studentPayload(),
  });

  return normalizePrayerRewardClaim(
    response?.data?.data ?? response?.data,
  );
};

export const fetchPrayerHistory = async (
  studentId?: string | number,
): Promise<PrayerHistoryDay[]> => {
  const requestedStudentId = Number(studentId);
  const resolvedStudentId =
    Number.isInteger(requestedStudentId) && requestedStudentId > 0
      ? requestedStudentId
      : activeStudentId();
  const response = await api.get("/student-wallet/prayer-history", {
    params: resolvedStudentId ? { student_id: resolvedStudentId } : undefined,
  });

  return normalizePrayerHistory(response?.data?.data ?? response?.data);
};

export type BuiltInLessonProgress = {
  lesson_id: string;
  best_score: number;
  total_questions: number;
  attempts: number;
  passed: boolean;
  coins_awarded: number;
};

export type BuiltInTrackerProgress = StudentWalletBalance & {
  tracker_id: string;
  pass_mark: number;
  reward_amount: number;
  lessons: BuiltInLessonProgress[];
};

export type BuiltInLessonAttemptResult = BuiltInTrackerProgress & {
  lesson_id: string;
  score: number;
  passed: boolean;
  awarded: boolean;
  coins_earned: number;
};

const normalizeBuiltInLessonProgress = (
  value: unknown,
): BuiltInLessonProgress | null => {
  if (!isRecord(value)) return null;

  const lessonId = String(value.lesson_id ?? "");
  if (!lessonId) return null;

  const bestScore = Number(value.best_score);
  const totalQuestions = Number(value.total_questions);
  const attempts = Number(value.attempts);
  const coinsAwarded = Number(value.coins_awarded);

  return {
    lesson_id: lessonId,
    best_score: Number.isFinite(bestScore) && bestScore > 0 ? bestScore : 0,
    total_questions:
      Number.isFinite(totalQuestions) && totalQuestions > 0
        ? totalQuestions
        : 0,
    attempts: Number.isFinite(attempts) && attempts > 0 ? attempts : 0,
    passed: value.passed === true,
    coins_awarded:
      Number.isFinite(coinsAwarded) && coinsAwarded > 0 ? coinsAwarded : 0,
  };
};

const normalizeBuiltInTrackerProgress = (
  value: unknown,
): BuiltInTrackerProgress => {
  const wallet = normalizeWalletBalance(value);
  const record = isRecord(value) ? value : {};
  const trackerId = String(record.tracker_id ?? "");
  const passMark = Number(record.pass_mark);
  const rewardAmount = Number(record.reward_amount);

  if (
    !trackerId ||
    !Number.isInteger(passMark) ||
    passMark <= 0 ||
    !Number.isInteger(rewardAmount) ||
    rewardAmount <= 0
  ) {
    throw new Error(
      "The built-in tracker service returned an invalid response.",
    );
  }

  const lessons = Array.isArray(record.lessons)
    ? record.lessons
        .map(normalizeBuiltInLessonProgress)
        .filter((lesson): lesson is BuiltInLessonProgress => lesson !== null)
    : [];

  return {
    ...wallet,
    tracker_id: trackerId,
    pass_mark: passMark,
    reward_amount: rewardAmount,
    lessons,
  };
};

const normalizeBuiltInLessonAttempt = (
  value: unknown,
): BuiltInLessonAttemptResult => {
  const progress = normalizeBuiltInTrackerProgress(value);
  const record = isRecord(value) ? value : {};
  const lessonId = String(record.lesson_id ?? "");
  const score = Number(record.score);
  const coinsEarned = Number(record.coins_earned);

  if (!lessonId || !Number.isFinite(score) || score < 0) {
    throw new Error(
      "The built-in tracker service returned an invalid attempt result.",
    );
  }

  return {
    ...progress,
    lesson_id: lessonId,
    score,
    passed: record.passed === true,
    awarded: record.awarded === true,
    coins_earned:
      Number.isFinite(coinsEarned) && coinsEarned > 0 ? coinsEarned : 0,
  };
};

export const fetchBuiltInTrackerProgress = async (
  trackerId: string,
): Promise<BuiltInTrackerProgress> => {
  const response = await api.get("/student-wallet/builtin-tracker", {
    params: { tracker_id: trackerId, ...studentPayload() },
  });

  return normalizeBuiltInTrackerProgress(
    response?.data?.data ?? response?.data,
  );
};

export const submitBuiltInLessonAttempt = async (payload: {
  tracker_id: string;
  lesson_id: string;
  score: number;
  total_questions: number;
}): Promise<BuiltInLessonAttemptResult> => {
  const response = await api.post("/student-wallet/builtin-tracker", {
    ...payload,
    ...studentPayload(),
  });

  return normalizeBuiltInLessonAttempt(response?.data?.data ?? response?.data);
};
