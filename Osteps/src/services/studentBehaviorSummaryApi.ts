import api from "./studentsApi";
import { StudentBehaviorSummary } from "@/types/studentViews";

export const fetchClassStudentsBehaviorSummary = async (
  classId: string | number
): Promise<StudentBehaviorSummary[]> => {
  const response = await api.get(
    `/classes/${classId}/students-behavior-summary`
  );
  return response.data?.data || [];
};
