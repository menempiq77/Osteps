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

export const fetchStudentWalletBalance = async (): Promise<StudentWalletBalance> => {
  const response = await api.get("/student-wallet/balance");
  return response?.data?.data ?? response?.data;
};

export const spendStudentCoins = async (payload: {
  amount: number;
  purchase_key: string;
  description?: string;
}): Promise<StudentWalletBalance> => {
  const response = await api.post("/student-wallet/spend", payload);
  return response?.data?.data ?? response?.data;
};
