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

const getLocalStorageKey = (classId: string | number) =>
  `class-seating-layout:${String(classId)}`;

const readLocalLayout = (classId: string | number): SeatingLayoutResponse | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getLocalStorageKey(classId));
    if (!raw) return null;
    return normalizeLayout(JSON.parse(raw));
  } catch {
    return null;
  }
};

const writeLocalLayout = (classId: string | number, payload: SavePayload | SeatingLayoutResponse) => {
  if (typeof window === "undefined") return;
  try {
    const normalized = normalizeLayout(payload);
    window.localStorage.setItem(getLocalStorageKey(classId), JSON.stringify(normalized));
  } catch {
    // ignore local persistence failures
  }
};

const shouldUseLocalFallback = (error: unknown) => {
  const axiosError = error as AxiosError<any>;
  const status = Number(axiosError?.response?.status || 0);
  return status === 404 || status === 401 || status === 403;
};

/**
 * Extract the plain class ID from a subject-scoped compound key.
 * e.g. "subject:3:class:10" → "10"
 * Returns null if the key is not compound.
 */
const extractLegacyClassId = (key: string): string | null => {
  const match = key.match(/^subject:\d+:class:(.+)$/);
  return match ? match[1] : null;
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
    const normalized = normalizeLayout(response?.data) || DEFAULT_LAYOUT;
    writeLocalLayout(classId, normalized);
    return normalized;
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      const local = readLocalLayout(classId);
      if (local && local.items.length > 0) return local;

      // Migration: if this is a subject-scoped compound key and no data found,
      // check the legacy plain class-ID key (saved before subject workspace mode).
      const legacyId = extractLegacyClassId(String(classId));
      if (legacyId) {
        const legacy = readLocalLayout(legacyId);
        if (legacy && legacy.items.length > 0) {
          // Migrate old data to the new key so future reads are fast
          writeLocalLayout(classId, legacy);
          return legacy;
        }
      }

      return DEFAULT_LAYOUT;
    }
    throw enrichError(error);
  }
};

export const saveClassSeatingLayout = async (
  classId: string | number,
  payload: SavePayload
) => {
  try {
    const response = await api.put(`/classes/${classId}/seating-layout`, payload);
    const normalized = normalizeLayout(response?.data);
    writeLocalLayout(classId, normalized);
    return normalized;
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      writeLocalLayout(classId, payload);
      return normalizeLayout(payload);
    }
    throw enrichError(error);
  }
};
