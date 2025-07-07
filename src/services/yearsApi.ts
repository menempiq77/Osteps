// src/services/yearsApi.ts
import axios from 'axios';
import { store } from '@/store/store';
import { API_BASE_URL } from '@/lib/config';

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

// fetch Years
export const fetchYears = async () => {
  const response = await api.get('/get-year');
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