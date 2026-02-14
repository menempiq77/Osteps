// src/services/reportApi.ts
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

//report-assessments api
export const fetchReportAssessments = async (schoolId: string) => {
  const response = await api.get(`/get-report-assessments/${schoolId}`);
  return response.data.data;
};

//assigned year classes api For teacher
export const fetchAssignedYearClasses = async () => {
  const response = await api.get(`/get-assigned-year-classes`);
  return response.data.data;
};

//assigned year classes api For School admin
export const fetchAllYearClasses = async () => {
  const response = await api.get(`/getall-assigned-year-classes`);
  return response.data.data;
};

//whole-assessments report api
export const fetchWholeAssessmentsReport = async (schoolId: string) => {
  const response = await api.get(`/get-whole-assessments-report/${schoolId}`);
  return response?.data?.data ?? response?.data?.report ?? response?.data ?? [];
};

// whole-assessments report for current user's school (school is resolved by backend auth)
export const fetchWholeAssessmentsReportForMySchool = async () => {
  const response = await api.get(`/schoolget-whole-assessments-report`);
  return response?.data?.data ?? response?.data?.report ?? response?.data ?? [];
};

//report specific assessment tasks api
export const fetchReportSpecificAssessmentTasks = async (assessmentId: number) => {
  const response = await api.get(`/get-report-specific-assessment-tasks/${assessmentId}`);
  return response.data.data;
};
