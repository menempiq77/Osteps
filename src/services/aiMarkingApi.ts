import type { AssessmentDocumentAnnotation } from "@/services/documentAssessmentApi";

export type QuestionAnswerAnchor = {
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence?: "low" | "medium" | "high";
  evidence?: string;
};

export type QuestionMarkEntry = {
  question: string;
  questionType?: "MCQ" | "TrueFalse" | "FillBlank" | "ShortAnswer" | "Essay" | string;
  studentAnswer: string;
  correctAnswer?: string;
  marksAwarded: number;
  maxMarksForQuestion: number | null;
  reason: string;
  answerAnchor?: QuestionAnswerAnchor;
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
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), 70000);
  let response: Response;
  try {
    response = await fetch("/dashboard/ai/marking/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutHandle);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("AI draft mark took too long. Please try again with fewer pages visible or mark this paper manually.");
    }
    throw error;
  }

  const responseText = await response.text().catch(() => "");
  clearTimeout(timeoutHandle);
  let data: any = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      responseText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 240) ||
      `AI draft mark failed with HTTP ${response.status}.`;
    throw new Error(message);
  }

  return data as AiDraftMarkResponse;
};