// src/services/studentNarrativeReportApi.ts
import api from "@/services/api";
import { withSubjectPayload, withSubjectQuery } from "@/lib/subjectScope";

export interface StudentNarrativeReport {
  id: number;
  school_id?: number | null;
  student_id: number;
  subject_id?: number | null;
  term_id?: number | null;
  author_id?: number | null;
  author_name?: string | null;
  author_role?: string | null;
  effort?: string | null;
  conduct?: string | null;
  attainment?: string | null;
  strengths?: string | null;
  targets?: string | null;
  comment?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StudentNarrativeReportInput {
  student_id: number;
  subject_id?: number | null;
  term_id?: number | null;
  effort?: string | null;
  conduct?: string | null;
  attainment?: string | null;
  strengths?: string | null;
  targets?: string | null;
  comment?: string | null;
}

export const fetchStudentNarrativeReports = async (
  studentId: number | string,
  subjectId?: number | null
): Promise<StudentNarrativeReport[]> => {
  const response = await api.get(`/students/${studentId}/reports`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response?.data?.data ?? [];
};

export const createStudentNarrativeReport = async (
  payload: StudentNarrativeReportInput,
  subjectId?: number | null
): Promise<StudentNarrativeReport> => {
  const response = await api.post(
    "/student-reports",
    withSubjectPayload(payload, subjectId)
  );
  return response?.data?.data ?? response?.data;
};

export const updateStudentNarrativeReport = async (
  id: number,
  payload: Partial<StudentNarrativeReportInput>,
  subjectId?: number | null
): Promise<StudentNarrativeReport> => {
  const response = await api.post(
    `/student-reports/${id}`,
    withSubjectPayload(payload, subjectId)
  );
  return response?.data?.data ?? response?.data;
};

export const deleteStudentNarrativeReport = async (
  id: number
): Promise<void> => {
  await api.delete(`/student-reports/${id}`);
};
