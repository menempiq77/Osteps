// src/services/behaviorApi.ts
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

//behaviourType apis Started
// fetch BehaviourType
export const fetchBehaviourType = async () => {
  const response = await api.get('/get-behaviour');
  return response.data.data;
};
// add BehaviourType
export const addBehaviourType = async (behaviourTypeData: { name: string }) => {
  const response = await api.post('/add-behaviour', behaviourTypeData);
  return response.data;
};
// edit BehaviourType
export const updateBehaviourType = async (id: string, behaviourTypeData: any) => {
  const response = await api.put(`/update-behaviour/${id}`, behaviourTypeData);
  return response.data;
};
// delete BehaviourType
export const deleteBehaviourType = async (id: number) => {
  const response = await api.delete(`/delete-behaviour/${id}`);
  return response.data;
};

//behaviour apis Started
// fetch behaviour
export const fetchBehaviour = async (studentId: number) => {
  const response = await api.get(`/get-studentBehaviour/${studentId}`);
  return response.data.data;
};
// add behaviour
export const addBehaviour = async (behaviourData: { name: string }) => {
  const response = await api.post('/add-studentBehaviour', behaviourData);
  return response.data;
};
// edit behaviour
export const updateBehaviour = async (id: string, behaviourData: any) => {
  const response = await api.put(`/update-studentBehaviour/${id}`, behaviourData);
  return response.data;
};
// delete behaviour
export const deleteBehaviour = async (id: number) => {
  const response = await api.delete(`/delete-studentBehaviour/${id}`);
  return response.data;
};
