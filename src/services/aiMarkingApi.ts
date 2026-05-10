import type { AssessmentDocumentAnnotation } from "@/services/documentAssessmentApi";

export type QuestionMarkEntry = {
  question: string;
  questionType?: "MCQ" | "TrueFalse" | "FillBlank" | "ShortAnswer" | "Essay" | string;
  studentAnswer: string;
  marksAwarded: number;
  maxMarksForQuestion: number | null;
  reason: string;
};

export type AiDraftProviderTrace = {
  selected: string;
  attempts: string[];
  recheck?: string;
};

export type AiDraftMarkResponse = {
  suggestedMark: number | null;
  questionBreakdown?: QuestionMarkEntry[];
  feedback: string;
  rationale: string;
  confidence: "low" | "medium" | "high";
  sourcePolicy: string;
  warnings: string[];
  providerTrace?: AiDraftProviderTrace;
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
  pageImages?: string[];
  pageImagePageNumbers?: number[];
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