// src/services/classesApi.ts
import { createApiClient } from "@/lib/apiClient";

const api = createApiClient();

// fetch Classes
export const fetchClasses = async (yearId: string) => {
  const response = await api.get(`/get-class/${yearId}`);
  return response.data.data;
};
// add Class
export const addClass = async (classData: { 
  class_name: string;
  year_id: number;
  number_of_terms: string;
}) => {
  const response = await api.post('/add-class', classData);
  return response.data;
};
// edit Class
export const updateClass = async (id: string, classData: {
  class_name?: string;
  number_of_terms?: string;
  year_id?: number;
}) => {
  const response = await api.post(`/update-class/${id}`, classData);
  return response.data;
};
// delete Class
export const deleteClass = async (id: number) => {
  const response = await api.post(`/delete-class/${id}`);
  return response.data;
};
export default api;