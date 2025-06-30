// src/services/timetableApi.ts
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

// fetch Timetable data
export const fetchTimetableData = async () => {
  const response = await api.get(`/get-timeTable`);
  return response.data.data;
};

// add Timetable slot
export const addTimetableSlot = async (timetableData: { name: string }) => {
  const response = await api.post('/add-timeTable', timetableData);
  return response.data;
};
// edit Timetable slot
export const updateTimetableSlot = async (id: string, timetableData: any) => {
  const response = await api.post(`/update-timeTable/${id}`, timetableData);
  return response.data;
};
// delete Timetable slot
export const deleteTimetableSlot = async (id: number) => {
  const response = await api.post(`/delete-timeTable/${id}`);
  return response.data;
};

export default api;