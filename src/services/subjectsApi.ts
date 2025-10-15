// src/services/subjectsApi.ts
import axios from "axios";
import { store } from "@/store/store";
import { API_BASE_URL } from "@/lib/config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all subjects for a school
export const fetchSubjects = async () => {
  const response = await api.get(`/get-subject`);
  return response.data.data;
};

// Add a new subject
export const addSubject = async (subjectData: { name: string; description?: string }) => {
  const response = await api.post("/add-subject", subjectData);
  return response.data;
};

// Update a subject
export const updateSubject = async (id: string, subjectData: any) => {
  const response = await api.post(`/update-subject/${id}`, subjectData);
  return response.data;
};

// Delete a subject
export const deleteSubject = async (id: number) => {
  const response = await api.post(`/delete-subject/${id}`);
  return response.data;
};
