// src/services/behaviorApi.ts
import axios from 'axios';
import { store } from '@/store/store';
import { API_BASE_URL } from '@/lib/config';
import { withSubjectPayload, withSubjectQuery } from '@/lib/subjectScope';

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
export const fetchBehaviourType = async (subjectId?: number) => {
  const response = await api.get('/get-behaviour', {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};
// add BehaviourType
export const addBehaviourType = async (behaviourTypeData: { name: string }, subjectId?: number) => {
  const response = await api.post('/add-behaviour', withSubjectPayload(behaviourTypeData, subjectId));
  return response.data;
};
// edit BehaviourType
export const updateBehaviourType = async (id: string, behaviourTypeData: any, subjectId?: number) => {
  const response = await api.put(`/update-behaviour/${id}`, withSubjectPayload(behaviourTypeData, subjectId));
  return response.data;
};
// delete BehaviourType
export const deleteBehaviourType = async (id: number, subjectId?: number) => {
  const response = await api.delete(`/delete-behaviour/${id}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data;
};

//behaviour apis Started
// fetch behaviour
export const fetchBehaviour = async (studentId: number, subjectId?: number) => {
  const response = await api.get(`/get-studentBehaviour/${studentId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};
// add behaviour
export const addBehaviour = async (behaviourData: { name: string }, subjectId?: number) => {
  const response = await api.post('/add-studentBehaviour', withSubjectPayload(behaviourData, subjectId));
  return response.data;
};
// edit behaviour
export const updateBehaviour = async (id: string, behaviourData: any, subjectId?: number) => {
  const response = await api.put(`/update-studentBehaviour/${id}`, withSubjectPayload(behaviourData, subjectId));
  return response.data;
};
// delete behaviour
export const deleteBehaviour = async (id: number, subjectId?: number) => {
  const response = await api.delete(`/delete-studentBehaviour/${id}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data;
};
