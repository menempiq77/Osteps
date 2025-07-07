// src/services/teacherApi.ts
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

// fetch Teachers
export const fetchTeachers = async () => {
  const response = await api.get('/get-teacher');
  return response.data.data;
};
// fetch TeachersByStudent
export const fetchTeachersByStudent = async () => {
  const response = await api.get('/getspecTeachers');
  return response.data.data;
};
// add Teacher
export const addTeacher = async (teacherData: { name: string }) => {
  const response = await api.post('/add-teacher', teacherData);
  return response.data;
};
//assign teacher
export const AssignTeacher = async (classId: string | number, teacherId: number) => {
  const response = await api.post(`/assign-teacher/${classId}`, {
    teacher_id: teacherId,
  });
  return response.data;
};
// Get assign teacher
export const getAssignTeacher = async (classId: string | number) => {
  const response = await api.get(`/get-assign-teacher/${classId}`);
  return response.data;
};
// edit Teacher
export const updateTeacher = async (id: string, teacherData: any) => {
  const response = await api.post(`/update-teacher/${id}`, teacherData);
  return response.data;
};
// delete Teacher
export const deleteTeacher = async (id: string | number) => {
  const response = await api.post(`/delete-teacher/${id}`);
  return response.data;
};
export default api;