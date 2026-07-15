// src/services/yearsApi.ts
import { createApiClient } from "@/lib/apiClient";

const api = createApiClient();

// fetch Years
export const fetchYears = async () => {
  const response = await api.get('/get-year');
  return response.data.data;
};
// fetch Years By School
export const fetchYearsBySchool = async (schoolId: number) => {
  const response = await api.get(`/get-school-year/${schoolId}`);
  return response.data.data;
};

// fetch Years By Subject (subject-specific)
export const fetchSubjectYears = async (subjectId: number) => {
  const response = await api.get(`/get-subject-years/${subjectId}`);
  return response.data.data;
};

// get-assign-year
export const fetchAssignYears = async () => {
  const response = await api.get(`/get-assign-year`);
  return response.data.data;
};

// add Year
export const addYear = async (yearData: { name: string }) => {
  const response = await api.post('/add-year', yearData);
  return response.data;
};
// edit Year
export const updateYear = async (id: string, yearData: any) => {
  const response = await api.post(`/update-year/${id}`, yearData);
  return response.data;
};
// delete Year
export const deleteYear = async (id: number) => {
  const response = await api.post(`/delete-year/${id}`);
  return response.data;
};

export default api;