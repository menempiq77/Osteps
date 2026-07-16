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

const activeStudentId = () => {
  const studentId = Number(store.getState().auth.currentUser?.student);
  return Number.isInteger(studentId) && studentId > 0 ? studentId : null;
};

const normalizeWalletBalance = (value: unknown): StudentWalletBalance => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The student wallet returned an invalid response.");
  }

  const record = value as Record<string, unknown>;
  const studentId = Number(record.student_id);
  const coinBalance = Number(record.coin_balance);
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

export const fetchStudentWalletBalance = async (): Promise<StudentWalletBalance> => {
  const studentId = activeStudentId();
  const response = await api.get("/student-wallet/balance", {
    params: studentId ? { student_id: studentId } : undefined,
  });
  return normalizeWalletBalance(response?.data?.data ?? response?.data);
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
