// src/services/classEnrollmentApi.ts
import axios from "axios";
import { store } from "@/store/store";
import { API_BASE_URL } from "@/lib/config";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public (no auth) client for the student signup page.
const publicApi = axios.create({ baseURL: API_BASE_URL });

export interface EnrollmentRequest {
  id: number;
  class_id: number;
  first_name: string;
  last_name: string;
  student_name: string;
  gender: string | null;
  nationality: string | null;
  user_name: string;
  needs_support: boolean;
  support_details: string | null;
  status: string;
  created_at: string | null;
}

export interface PublicClassInfo {
  class_id: number;
  class_name: string;
  year_name: string | null;
  school_name: string | null;
}

export interface EnrollSubmission {
  first_name: string;
  last_name: string;
  gender?: string;
  nationality?: string;
  password: string;
  needs_support?: boolean;
  support_details?: string;
}

// ---- Public endpoints ----
export const fetchPublicClass = async (
  code: string
): Promise<PublicClassInfo> => {
  const res = await publicApi.get(`/public/class/${encodeURIComponent(code)}`);
  return res.data.data;
};

export const submitEnrollment = async (
  code: string,
  payload: EnrollSubmission
): Promise<{ user_name: string; class_name: string }> => {
  const res = await publicApi.post(
    `/public/class/${encodeURIComponent(code)}/enroll`,
    payload
  );
  return res.data.data;
};

// ---- Join code (auth) ----
export const fetchJoinCode = async (
  classId: number | string
): Promise<{ class_id: number; join_code: string }> => {
  const res = await api.get(`/school-classes/${classId}/join-code`);
  return res.data.data;
};

export const regenerateJoinCode = async (
  classId: number | string
): Promise<{ class_id: number; join_code: string }> => {
  const res = await api.post(`/school-classes/${classId}/regenerate-join-code`);
  return res.data.data;
};

// ---- Admin review (auth) ----
export const fetchEnrollmentRequests = async (params?: {
  status?: string;
  class_id?: number | string;
}): Promise<EnrollmentRequest[]> => {
  const res = await api.get(`/class-enrollments`, { params });
  return res.data.data;
};

export const fetchPendingCounts = async (): Promise<Record<string, number>> => {
  const res = await api.get(`/class-enrollments/pending-counts`);
  return res.data.data || {};
};

export const updateEnrollmentRequest = async (
  id: number,
  payload: Partial<{
    first_name: string;
    last_name: string;
    gender: string | null;
    nationality: string | null;
    user_name: string;
    class_id: number;
    needs_support: boolean;
    support_details: string | null;
  }>
) => {
  const res = await api.post(`/class-enrollments/${id}`, payload);
  return res.data;
};

export const approveEnrollmentRequest = async (id: number) => {
  const res = await api.post(`/class-enrollments/${id}/approve`);
  return res.data;
};

export const deleteEnrollmentRequest = async (id: number) => {
  const res = await api.delete(`/class-enrollments/${id}`);
  return res.data;
};
