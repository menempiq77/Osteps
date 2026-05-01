export type AssessmentDocumentLayer = "student" | "teacher";
export type AssessmentDocumentStatus = "draft" | "submitted" | "marked";

export type Point = { x: number; y: number };

export type PenAnnotation = {
  id: string;
  type: "pen";
  page: number;
  color: string;
  width: number;
  points: Point[];
};

export type TextAnnotation = {
  id: string;
  type: "text";
  page: number;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
};

export type AssessmentDocumentAnnotation = PenAnnotation | TextAnnotation;

export type AssessmentDocumentState = {
  assessmentId: string;
  taskId: string;
  studentId: string;
  status: AssessmentDocumentStatus;
  studentLocked: boolean;
  studentAnnotations: AssessmentDocumentAnnotation[];
  teacherAnnotations: AssessmentDocumentAnnotation[];
  metadata?: Record<string, unknown>;
  updatedAt?: string;
  submittedAt?: string;
  markedAt?: string;
};

export type AssessmentDocumentExamIncident = {
  id: string;
  assessmentId: string;
  taskId: string;
  studentId: string;
  title: string;
  reason: string;
  context: "fullscreen" | "screen" | "leave";
  createdAt: string;
  updatedAt?: string;
  status?: AssessmentDocumentStatus;
};

const buildUrl = (assessmentId: string | number, taskId: string | number, studentId: string | number) => {
  const params = new URLSearchParams({
    assessmentId: String(assessmentId),
    taskId: String(taskId),
    studentId: String(studentId),
  });
  return `/api/assessment-document?${params.toString()}`;
};

export const fetchAssessmentDocument = async (
  assessmentId: string | number,
  taskId: string | number,
  studentId: string | number
): Promise<AssessmentDocumentState> => {
  const response = await fetch(buildUrl(assessmentId, taskId, studentId), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to load document annotations");
  }
  return response.json();
};

export const saveAssessmentDocumentAnnotations = async ({
  assessmentId,
  taskId,
  studentId,
  layer,
  annotations,
  status,
  studentLocked,
  metadata,
}: {
  assessmentId: string | number;
  taskId: string | number;
  studentId: string | number;
  layer: AssessmentDocumentLayer;
  annotations: AssessmentDocumentAnnotation[];
  status?: AssessmentDocumentStatus;
  studentLocked?: boolean;
  metadata?: Record<string, unknown>;
}): Promise<AssessmentDocumentState> => {
  const response = await fetch(buildUrl(assessmentId, taskId, studentId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ layer, annotations, status, studentLocked, metadata }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to save document annotations");
  }

  return response.json();
};

export const fetchAssessmentDocumentExamIncidents = async ({
  studentId,
  assessmentId,
  taskId,
}: {
  studentId: string | number;
  assessmentId?: string | number;
  taskId?: string | number;
}): Promise<AssessmentDocumentExamIncident[]> => {
  const params = new URLSearchParams({
    studentId: String(studentId),
  });

  if (assessmentId != null) {
    params.set("assessmentId", String(assessmentId));
  }
  if (taskId != null) {
    params.set("taskId", String(taskId));
  }

  const response = await fetch(`/api/assessment-document/incidents?${params.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to load exam incidents");
  }

  const payload = (await response.json()) as { data?: AssessmentDocumentExamIncident[] };
  return Array.isArray(payload?.data) ? payload.data : [];
};
