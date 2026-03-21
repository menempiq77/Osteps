import api from "./studentsApi";
import { StudentBehaviorSummary } from "@/types/studentViews";
import { withSubjectQuery } from "@/lib/subjectScope";

export const fetchClassStudentsBehaviorSummary = async (
  classId: string | number,
  subjectId?: number | null
): Promise<StudentBehaviorSummary[]> => {
  try {
    const response = await api.get(
      `/classes/${classId}/students-behavior-summary`,
      {
        params: withSubjectQuery({}, subjectId),
      }
    );
    return response.data?.data || [];
  } catch (error: any) {
    const status = Number(error?.response?.status || 0);
    if (status === 404 || status === 401 || status === 403) {
      return [];
    }
    throw error;
  }
};
