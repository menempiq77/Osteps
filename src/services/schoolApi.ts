// src/services/schoolApi.ts
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

// fetche Schools
export const fetchSchools = async () => {
  const response = await api.get('/get-school');
  return response.data.data;
};
// add Schools
export const addSchool = async (schoolData: any) => {
  const response = await api.post('/add-school', schoolData);
  return response.data;
};
// edit Schools
export const updateSchool = async (id: string, schoolData: any) => {
  const response = await api.post(`/update-school/${id}`, schoolData);
  return response.data;
};
// delete Schools
export const deleteSchool = async (id: string) => {
  const response = await api.post(`/delete-school/${id}`);
  return response.data;
};
export default api;