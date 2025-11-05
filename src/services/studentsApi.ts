// src/services/studentsApi.ts
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

// fetch Students
export const fetchStudents = async (classId: string | number) => {
  const response = await api.get(`/get-student/${classId}`);
  return response.data.data;
};
// add Student
export const addStudent = async (studentData: {
  student_name: string;
  email: string;
  class_id: number;
  status: string;
}) => {
  const response = await api.post('/add-student', studentData);
  return response.data;
};
// edit Student
export const updateStudent = async (
  id: string,
  studentData: {
    student_name: string;
    email: string;
    class_id: number;
    status: 'active' | 'inactive' | 'suspended';
  }
) => {
  const response = await api.post(`/update-student/${id}`, studentData);
  return response.data;
};

// delete Student
export const deleteStudent = async (id: string | number) => {
  const response = await api.post(`/delete-student/${id}`);
  return response.data;
};
export default api;

// fetch Students profile data
export const fetchStudentProfileData = async (studentId: string | number) => {
  const response = await api.get(`/get-studentProfile/${studentId}`);
  return response.data.data;
};