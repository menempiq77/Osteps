// src/services/settingApi.ts
import { createApiClient } from "@/lib/apiClient";

const api = createApiClient();

//change password api
export const changePassword = async (passwordData: { current_password: string; new_password: string; new_password_confirmation: string }) => {
  const response = await api.post('/change-password', passwordData);
  return response.data;
};
// teacher profile api
export const updateTeacherProfile = async (formData: FormData) => {
  const response = await api.post('/update-teacher-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
}
// student profile api
export const updateStudentProfile = async (formData: FormData) => {
  const response = await api.post('/update-student-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
}
// schoolAdmin profile api
export const updateSchoolAdminProfile = async (formData: FormData) => {
  const response = await api.post('/update-schoolAdmin-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
}

// Super Admin profile api
export const updateSuperAdminProfile = async (formData: FormData) => {
  const response = await api.post('/update-superAdmin-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
}