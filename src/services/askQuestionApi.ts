// src/services/reportApi.ts
import { createApiClient } from "@/lib/apiClient";

const api = createApiClient();

// Ask Questions APIs
// Fetch all Questions
export const getAllAskQuestions = async () => {
  const response = await api.get('/get-askQuestions');
  return response.data.data;
};
// Add a new Questions
export const createAskQuestion = async (questionData: { name: string }) => {
  const response = await api.post('/askQuestion', questionData);
  return response.data;
};
// Update a Questions
export const updateAskQuestion = async (id: string, questionData: any) => {
  const response = await api.post(`/update-askQuestion/${id}`, questionData);
  return response.data;
};
// Delete a Questions
export const deleteAskQuestion = async (id: number) => {
  const response = await api.post(`/delete-askQuestion/${id}`);
  return response.data;
};
// Add a new Questions
export const submitAskQuestion = async (id: string, questionData: any) => {
  const response = await api.post(`/submitAnswer/${id}`, questionData);
  return response.data;
};

export default api;