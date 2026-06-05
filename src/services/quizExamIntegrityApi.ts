export type QuizExamIncidentContext = "fullscreen" | "screen" | "leave";

export type QuizExamIncident = {
  id: string;
  assessmentId: string;
  quizId: string;
  studentId: string;
  title: string;
  reason: string;
  context: QuizExamIncidentContext;
  createdAt: string;
  updatedAt?: string;
  userAgent?: string;
};

type QuizExamIncidentPayload = {
  assessmentId: string | number;
  quizId: string | number;
  studentId: string | number;
  title?: string;
  reason: string;
  context: QuizExamIncidentContext;
};

export const saveQuizExamIncident = async (
  payload: QuizExamIncidentPayload,
  options?: { keepalive?: boolean }
) => {
  const body = JSON.stringify(payload);

  if (options?.keepalive && typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/quiz-incidents", blob)) return;
  }

  await fetch("/api/quiz-incidents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: Boolean(options?.keepalive),
  });
};

export const fetchQuizExamIncidents = async ({
  assessmentId,
  quizId,
  studentId,
}: {
  assessmentId?: string | number;
  quizId?: string | number;
  studentId?: string | number;
}): Promise<QuizExamIncident[]> => {
  const params = new URLSearchParams();
  if (assessmentId != null) params.set("assessmentId", String(assessmentId));
  if (quizId != null) params.set("quizId", String(quizId));
  if (studentId != null) params.set("studentId", String(studentId));

  const response = await fetch(`/api/quiz-incidents?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load quiz integrity incidents");
  }

  const payload = (await response.json()) as { data?: QuizExamIncident[] };
  return Array.isArray(payload?.data) ? payload.data : [];
};
