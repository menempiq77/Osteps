// src/services/dashboardApis.ts
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/store/store';
import { resolveScopedSubjectId } from '@/lib/subjectScope';

interface SchoolData {
  id: number;
  years_count: number;
  school_classs_count: number;
  teachers_count: number;
  students_count: number;
}

interface SchoolDashboardResponse {
  status_code?: number;
  msg?: string;
  school: SchoolData;
  assigned_class_count: number | null;
  assigned_students_count: number | null;
}
interface SearchStudentResponse {
  status_code: number;
  msg: string;
}

const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const withSubjectSearch = (path: string): string => {
  const subjectId = resolveScopedSubjectId();
  if (!subjectId) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}subject_id=${subjectId}`;
};

export const fetchSchoolDashboardData = async (): Promise<SchoolDashboardResponse> => {
  const response = await fetch(`${API_BASE_URL}${withSubjectSearch('/school/dashboard')}`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch school dashboard data');
  return await response.json();
};

export const fetchStudentDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}${withSubjectSearch('/dashboard-student-assessment')}`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch student dashboard assessment data');
  return await response.json();
};

export const searchStudentProfile = async (
  name: string
): Promise<SearchStudentResponse> => {
  const response = await fetch(`${API_BASE_URL}${withSubjectSearch('/search-studentProfile')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to search student profile');
  }

  return await response.json();
};
