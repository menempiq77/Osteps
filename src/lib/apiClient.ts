// src/lib/apiClient.ts
import axios, { AxiosInstance } from "axios";
import { store } from "@/store/store";
import { API_BASE_URL } from "@/lib/config";

/**
 * Attach the standard "Authorization: Bearer <token>" request interceptor,
 * reading the token from the Redux auth slice. This is the boilerplate every
 * service module used to repeat inline.
 */
export const attachAuthToken = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
};

/**
 * Build the auth header object for `fetch`-based service calls, reading the
 * token from the Redux auth slice. Returns an empty object when unauthenticated.
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Create an axios instance pointed at the API base URL with the auth-token
 * interceptor already attached. Use this for authenticated service clients.
 */
export const createApiClient = (): AxiosInstance =>
  attachAuthToken(axios.create({ baseURL: API_BASE_URL }));

/**
 * Create an axios instance pointed at the API base URL WITHOUT auth, for
 * public/unauthenticated endpoints (e.g. the student signup flow).
 */
export const createPublicApiClient = (): AxiosInstance =>
  axios.create({ baseURL: API_BASE_URL });
