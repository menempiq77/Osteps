// src/services/announcementApi.ts
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

//Announcemens apis Started
// fetch Announcements
export const fetchAnnouncements = async () => {
  const response = await api.get('/get-announcement');
  return response.data.data;
};
// add Announcement
export const addAnnouncement = async (announcementData: { name: string }) => {
  const response = await api.post('/add-announcement', announcementData);
  return response.data;
};
// edit Announcement
export const updateAnnouncement = async (id: string, announcementData: any) => {
  const response = await api.post(`/update-announcement/${id}`, announcementData);
  return response.data;
};
// delete Announcement
export const deleteAnnouncement = async (id: number) => {
  const response = await api.post(`/delete-announcement/${id}`);
  return response.data;
};

export default api;