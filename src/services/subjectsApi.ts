// src/services/subjectsApi.ts
import { createApiClient } from "@/lib/apiClient";

const api = createApiClient();

export type SubjectPayload = {
  name: string;
  description?: string;
  school_id?: number | null;
  dashboard_image_url?: string | null;
};

// Fetch all subjects for a school
export const fetchSubjects = async () => {
  const response = await api.get(`/get-subject`);
  return response.data.data;
};

// Add a new subject
export const addSubject = async (subjectData: SubjectPayload) => {
  const response = await api.post("/add-subject", subjectData);
  return response.data;
};

// Update a subject
export const updateSubject = async (id: string, subjectData: SubjectPayload) => {
  const response = await api.post(`/update-subject/${id}`, subjectData);
  return response.data;
};

// Delete a subject
export const deleteSubject = async (id: number) => {
  const response = await api.post(`/delete-subject/${id}`);
  return response.data;
};
