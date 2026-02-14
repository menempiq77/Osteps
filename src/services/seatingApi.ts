import api from "./studentsApi";
import { SeatingLayoutItem, SeatingLayoutResponse, SeatingRoomMeta } from "@/types/studentViews";
import { AxiosError } from "axios";

type SavePayload = {
  items: SeatingLayoutItem[];
  room_meta?: SeatingRoomMeta;
};

export type SeatingApiError = Error & {
  status?: number;
  code?: string;
  backendMessage?: string;
};

const DEFAULT_LAYOUT: SeatingLayoutResponse = {
  items: [],
  room_meta: {},
};

const normalizeLayout = (raw: any): SeatingLayoutResponse => {
  const payload = raw?.data ?? raw ?? {};
  return {
    version: payload?.version,
    updated_at: payload?.updated_at,
    items: Array.isArray(payload?.items) ? payload.items : [],
    room_meta: payload?.room_meta || {},
  };
};

const enrichError = (error: unknown): SeatingApiError => {
  const axiosError = error as AxiosError<any>;
  const status = axiosError?.response?.status;
  const backendMessage =
    axiosError?.response?.data?.msg ||
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.data?.message ||
    axiosError?.message ||
    "Seating API request failed.";

  const enriched = new Error(String(backendMessage)) as SeatingApiError;
  enriched.status = status;
  enriched.code = axiosError?.code;
  enriched.backendMessage = String(backendMessage);
  return enriched;
};

export const fetchClassSeatingLayout = async (
  classId: string | number
): Promise<SeatingLayoutResponse> => {
  try {
    const response = await api.get(`/classes/${classId}/seating-layout`);
    return normalizeLayout(response?.data) || DEFAULT_LAYOUT;
  } catch (error) {
    throw enrichError(error);
  }
};

export const saveClassSeatingLayout = async (
  classId: string | number,
  payload: SavePayload
) => {
  try {
    const response = await api.put(`/classes/${classId}/seating-layout`, payload);
    return normalizeLayout(response?.data);
  } catch (error) {
    throw enrichError(error);
  }
};
