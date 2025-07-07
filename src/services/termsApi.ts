// src/services/termsApi.ts
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

// fetch Terms
export const fetchTerm = async (classId: number) => {
  const response = await api.get(`/get-term/${classId}`);
  return response.data.data;
};
// add Term
export const addTerm = async (classId: number, termData: { name: string }) => {
  const response = await api.post('/add-term', { ...termData, class_id: classId });
  return response.data;
};
// edit Term
export const updateTerm = async (id: number, classId: number, termData: { name: string }) => {
  const response = await api.post(`/update-term/${id}`, { ...termData, class_id: classId });
  return response.data;
};
// delete Term
export const deleteTerm = async (id: number) => {
  const response = await api.post(`/delete-term/${id}`);
  return response.data;
};
export default api;