// src/services/reportApi.ts
import { createApiClient } from "@/lib/apiClient";
import { withSubjectQuery } from '@/lib/subjectScope';

const api = createApiClient();

//report-assessments api
export const fetchReportAssessments = async (schoolId: string, subjectId?: number) => {
  const response = await api.get(`/get-report-assessments/${schoolId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};

//assigned year classes api For teacher
export const fetchAssignedYearClasses = async (subjectId?: number) => {
  const response = await api.get(`/get-assigned-year-classes`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};

//assigned year classes api For School admin
export const fetchAllYearClasses = async (subjectId?: number) => {
  const response = await api.get(`/getall-assigned-year-classes`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};

//whole-assessments report api
export const fetchWholeAssessmentsReport = async (schoolId: string, subjectId?: number) => {
  const response = await api.get(`/get-whole-assessments-report/${schoolId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response?.data?.data ?? response?.data?.report ?? response?.data ?? [];
};

// whole-assessments report for current user's school (school is resolved by backend auth)
export const fetchWholeAssessmentsReportForMySchool = async (subjectId?: number) => {
  const response = await api.get(`/schoolget-whole-assessments-report`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response?.data?.data ?? response?.data?.report ?? response?.data ?? [];
};

//report specific assessment tasks api
export const fetchReportSpecificAssessmentTasks = async (assessmentId: number) => {
  const response = await api.get(`/get-report-specific-assessment-tasks/${assessmentId}`);
  return response.data.data;
};
