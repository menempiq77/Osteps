import api from "./studentsApi";
import { StudentBehaviorSummary } from "@/types/studentViews";

export const fetchClassStudentsBehaviorSummary = async (
  classId: string | number
): Promise<StudentBehaviorSummary[]> => {
  try {
    const response = await api.get(
      `/classes/${classId}/students-behavior-summary`
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
