// src/services/classesApi.ts
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

// fetch Classes
export const fetchClasses = async (yearId: number) => {
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