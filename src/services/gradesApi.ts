// src/services/gradesApi.ts
import { createApiClient } from "@/lib/apiClient";

const api = createApiClient();

// fetch Grades
export const fetchGrades = async (schoolId: string) => {
  const response = await api.get(`/get-grades/${schoolId}`);
  return response.data.data;
};
// add Grade
export const addGrade = async (gradeData: { name: string }) => {
  const response = await api.post('/add-grades', gradeData);
  return response.data;
};
// edit Grade
export const updateGrade = async (id: string, gradeData: any) => {
  const response = await api.post(`/update-grades/${id}`, gradeData);
  return response.data;
};
// delete Grade
export const deleteGrade = async (id: number) => {
  const response = await api.post(`/delete-grades/${id}`);
  return response.data;
};