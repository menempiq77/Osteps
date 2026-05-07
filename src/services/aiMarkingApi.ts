import type { AssessmentDocumentAnnotation } from "@/services/documentAssessmentApi";

export type AiDraftMarkResponse = {
  suggestedMark: number | null;
  feedback: string;
  rationale: string;
  confidence: "low" | "medium" | "high";
  sourcePolicy: string;
  warnings: string[];
};

export type AiDraftMarkRequest = {
  assessmentId: string | number;
  taskId: string | number;
  studentId: string | number;
  studentName?: string;
  title?: string;
  subjectName?: string;
  fileUrl?: string;
  maxMarks?: number;
  studentAnnotations: AssessmentDocumentAnnotation[];
  currentTeacherMarks?: string;
  currentTeacherFeedback?: string;
};

export const draftAssessmentMark = async (
  payload: AiDraftMarkRequest
): Promise<AiDraftMarkResponse> => {
  const response = await fetch("/dashboard/ai/marking/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Could not create an AI draft mark.");
  }

  return data as AiDraftMarkResponse;
};