import api from "@/services/api";
import { withSubjectQuery } from "@/lib/subjectScope";
import { ComprehensiveReportPayload } from "@/types/comprehensiveReport";

export type ComprehensiveReportParams = {
  student_id: number;
  subject_id?: number | "all";
  class_id?: number;
  date_from?: string;
  date_to?: string;
  term_id?: number;
};

export const fetchComprehensiveStudentReport = async (
  params: ComprehensiveReportParams
): Promise<ComprehensiveReportPayload> => {
  const { subject_id, ...rest } = params;

  const scopedParams =
    subject_id === "all"
      ? { ...rest, subject_id: "all" }
      : withSubjectQuery(rest, subject_id);

  const response = await api.get("/students/reports/comprehensive", {
    params: scopedParams,
  });

  return response?.data?.data ?? response?.data;
};
