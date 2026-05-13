export type AssessmentDocumentState = {
  assessmentId: number;
  taskId: number;
  studentId: number;
  status?: string;
  studentLocked?: boolean;
  metadata?: Record<string, unknown>;
  studentAnnotations?: unknown[];
  teacherAnnotations?: unknown[];
  updatedAt?: string;
};

export const fetchAssessmentDocument = async (
  assessmentId: number,
  taskId: number,
  studentId: number
): Promise<AssessmentDocumentState> => {
  const params = new URLSearchParams({
    assessmentId: String(assessmentId),
    taskId: String(taskId),
    studentId: String(studentId),
  });

  const response = await fetch(`/api/assessment-document?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load assessment document");
  }

  return response.json();
};
