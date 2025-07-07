// src/services/adminsApi.ts
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

// fetche admins
export const fetchAdmins = async () => {
  const response = await api.get('/get-admin');
  return response.data.data;
};
// add admin
export const addAdmin = async (adminData: any) => {
  const response = await api.post('/add-admin', adminData);
  return response.data;
};
// edit admin
export const updateAdmin = async (id: string, adminData: any) => {
  const response = await api.post(`/update-admin/${id}`, adminData);
  return response.data;
};
// delete admin
export const deleteAdmin = async (id: string) => {
  const response = await api.post(`/delete-admin/${id}`);
  return response.data;
};

export default api;