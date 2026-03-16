import api from "@/services/api";
import { withSubjectQuery } from "@/lib/subjectScope";
import {
  StudentComprehensiveReportQuery,
  StudentComprehensiveReportResponse,
} from "@/types/studentComprehensiveReport";

export const fetchStudentComprehensiveReport = async (
  query: StudentComprehensiveReportQuery
): Promise<StudentComprehensiveReportResponse> => {
  const { student_id, subject_id, ...rest } = query;
  const params = withSubjectQuery(
    {
      ...rest,
      student_id,
    },
    subject_id === "all" ? undefined : subject_id
  );

  const response = await api.get(`/students/reports/comprehensive/${student_id}`, {
    params,
  });

  return response?.data?.data ?? response?.data;
};
