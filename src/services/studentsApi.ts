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
  user_name?: string;
  email: string;
  password?: string;
  class_id: number;
  status: string;
  gender?: string;
  student_gender?: string;
  nationality?: string;
  is_sen?: boolean;
  sen_details?: string;
}) => {
  const response = await api.post('/add-student', studentData);
  return response.data;
};
// edit Student
export const updateStudent = async (
  id: string,
  studentData: {
    student_name: string;
    user_name?: string;
    email: string;
    class_id: number;
    password?: string;
    status: 'active' | 'inactive' | 'suspended';
    gender?: string;
    student_gender?: string;
    nationality?: string;
    is_sen?: boolean;
    sen_details?: string;
  }
) => {
  try {
    const response = await api.post(`/update-student/${id}`, studentData);
    const payload = response.data;
    const statusCode = Number(
      payload?.status_code ?? payload?.statusCode ?? payload?.code ?? 200
    );
    const isExplicitFailure =
      payload?.success === false || payload?.status === false || payload?.ok === false;

    if ((Number.isFinite(statusCode) && statusCode >= 400) || isExplicitFailure) {
      const backendMessage =
        payload?.msg || payload?.message || payload?.data?.message || "Failed to update student";
      throw new Error(String(backendMessage));
    }

    return payload?.data ?? payload;
  } catch (error: any) {
    const backendMessage =
      error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      (Array.isArray(error?.response?.data?.errors)
        ? error.response.data.errors[0]
        : undefined) ||
      (typeof error?.response?.data?.errors === "object"
        ? Object.values(error.response.data.errors)[0]
        : undefined) ||
      error?.message ||
      "Failed to update student";
    throw new Error(String(Array.isArray(backendMessage) ? backendMessage[0] : backendMessage));
  }
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

export const uploadStudentAvatar = async (
  classId: string | number,
  studentId: string | number,
  file: File
) => {
  const formData = new FormData();
  formData.append("profile_path", file);
  const response = await api.post(
    `/classes/${classId}/students/${studentId}/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
