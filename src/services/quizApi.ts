// src/services/quizApi.ts
import { createApiClient } from "@/lib/apiClient";
import { withSubjectPayload, withSubjectQuery } from '@/lib/subjectScope';
import { throwOnEmbeddedFailure } from '@/lib/apiResponse';

const api = createApiClient();

//quiz apis Started
// fetch quizes
export const fetchQuizes = async (schoolId: string, subjectId?: number) => {
  const response = await api.get(`/get-quiz/${schoolId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};
// add Quiz
export const addQuize = async (quizData: { name: string; description?: string; [key: string]: unknown }, subjectId?: number) => {
  const response = await api.post('/add-quiz', withSubjectPayload(quizData, subjectId));
  return response.data;
};
// edit Quiz
export const updateQuize = async (id: string, quizData: any, subjectId?: number) => {
  const response = await api.post(`/update-quiz/${id}`, withSubjectPayload(quizData, subjectId));
  return response.data;
};
// delete Quiz
export const deleteQuize = async (id: number) => {
  const response = await api.post(`/delete-quiz/${id}`);
  return response.data;
};
//submit quiz by student
export const submitQuizByStudent = async (quizId: number, studentId: number, answers: any, type: string, subjectId?: number) => {
  const response = await api.post('/submitQuizAnswers', withSubjectPayload({
    quiz_id: quizId,
    student_id: studentId,
    answers: answers,
    type: type
  }, subjectId));
  return response.data;
};
//submit task quiz by student
export const submitTaskQuizByStudent = async (quizId: number, studentId: number, assessmentId: number, answers: any, type: string, subjectId?: number, selfAssessmentMark?: number) => {
  const response = await api.post('/submitQuizAnswers', withSubjectPayload({
    quiz_id: quizId,
    student_id: studentId,
    assessment_id: assessmentId,
    answers: answers,
    type: type,
    self_assessment_mark: selfAssessmentMark ?? null
  }, subjectId));
  return response.data;
};

export const updateQuizSubmissionTeacherMark = async (submissionId: number, teacherAssessmentMark: number) => {
  const response = await api.post(`/quiz-submission/${submissionId}/teacher-mark`, {
    teacher_assessment_mark: teacherAssessmentMark
  });
  return response.data;
};

export const fetchSubmittedQuizDetails = async (quizId: number, studentId: number, type: string, subjectId?: number) => {
  const response = await api.get(`/get-SubmittedQuizDetails/${quizId}/${studentId}/${type}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};

//Quiz Question apis Started
// fetch QuizQuestions
export const fetchQuizQuestions = async (quizId: number, subjectId?: number) => {
  const response = await api.get(`/get-quiz-questions/${quizId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};
// add QuizQuestions
export const addQuizQuestion = async (
  quizId: number,
  quizQuestionData: Record<string, unknown>,
  subjectId?: number
) => {
  const response = await api.post('/add-quiz-question', withSubjectPayload({ ...quizQuestionData, quiz_id: quizId }, subjectId));
  return response.data;
};
// add QuizQuestions
export const updateQuizQuestion = async (questionId: number, quizId: number, quizQuestionData: { name: string }, subjectId?: number) => {
  const response = await api.post(`/update-quiz-question/${questionId}`, withSubjectPayload({ ...quizQuestionData, quiz_id: quizId }, subjectId));
  return response.data;
};
// reorder QuizQuestions
export const reorderQuizQuestions = async (quizId: number, questionIds: number[], subjectId?: number) => {
  const response = await api.post(
    `/reorder-quiz-questions/${quizId}`,
    withSubjectPayload({ question_ids: questionIds }, subjectId)
  );
  return response.data.data;
};
// delete QuizQuestions
export const deleteQuizQuestion = async (id: number) => {
  const response = await api.post(`/delete-quiz-question/${id}`);
  return response.data;
};
// Quiz answer marks
export const quizAnswerMarks = async (answerId: number, isCorrect: number, marks: number, comment: string, subjectId?: number) => {
  const response = await api.post(`/quiz-answer/${answerId}`, withSubjectPayload({
    is_correct: isCorrect,
    marks: marks,
    comment: comment
  }, subjectId));
  return response.data;
};
// add assign Assesment Quiz
export const assignAssesmentQuiz = async (termId: number, quizId: number, subjectId?: number) => {
  const response = await api.post('/add-assign-term-quiz', withSubjectPayload({
    term_id: termId, 
    quiz_id: quizId, 
  }, subjectId));
  return response.data;
};
// add assign Task Quiz
export const assignTaskQuiz = async (
  quizId: number,
  assessmentId: number,
  subjectId?: number,
  percentageWeight?: number
) => {
  const response = await api.post('/assign-task-quiz', withSubjectPayload({
    quiz_id: quizId,
    assessment_id: assessmentId,
    ...(percentageWeight != null ? { percentage_weight: percentageWeight } : {}),
  }, subjectId));
  return response.data;
};
// add assign tracker Quiz
export const assignTrackerQuiz = async (trackerId: number, quizId: number, subjectId?: number) => {
  const response = await api.post('/assign-tracker-quiz', withSubjectPayload({
    tracker_id: trackerId, 
    quiz_id: quizId, 
  }, subjectId));
  return response.data;
};

type QuizQuestionOption = { option_text?: string | null; is_correct?: number | null };
type QuizQuestionRow = {
  question_text?: string | null;
  type?: string | null;
  marks?: number | string | null;
  correct_answer?: unknown;
  options?: QuizQuestionOption[] | null;
};

// Options are stored as rows with an is_correct flag but created from a plain
// string list plus the index (or indexes) of the correct option.
const toQuestionPayload = (question: QuizQuestionRow) => {
  const options = (question.options ?? [])
    .map((option) => String(option?.option_text ?? ""))
    .filter((text) => text.length > 0);
  const correctIndexes = (question.options ?? []).reduce<number[]>((indexes, option, index) => {
    if (Number(option?.is_correct) === 1) indexes.push(index);
    return indexes;
  }, []);

  let correctAnswer: unknown = question.correct_answer ?? null;
  if (options.length > 0) {
    correctAnswer =
      question.type === "check_boxes"
        ? correctIndexes
        : correctIndexes.length > 0
          ? correctIndexes[0]
          : null;
  }

  return {
    question_text: String(question.question_text ?? "").trim(),
    type: question.type ?? "short_answer",
    correct_answer: correctAnswer,
    marks: Math.max(1, Number(question.marks ?? 1)),
    ...(options.length > 0 ? { options } : {}),
  };
};

/** Recreates a quiz (with its questions) under another subject. */
export const copyQuizToSubject = async (
  sourceQuizId: number,
  quizData: { name: string; description?: string | null; school_id: string | number },
  targetSubjectId?: number
): Promise<number> => {
  const created = await addQuize(
    {
      name: quizData.name,
      description: quizData.description ?? "",
      school_id: quizData.school_id,
    },
    targetSubjectId
  );
  throwOnEmbeddedFailure(created, { fallbackMessage: "Failed to create the quiz" });
  const newQuizId = Number(created?.data?.id ?? created?.id ?? 0);
  if (!newQuizId) throw new Error("Quiz copy returned no id");

  const source = await fetchQuizQuestions(sourceQuizId);
  const questions: QuizQuestionRow[] = source?.quiz_queston ?? source?.questions ?? [];
  for (const question of questions) {
    const response = await addQuizQuestion(
      newQuizId,
      toQuestionPayload(question),
      targetSubjectId
    );
    throwOnEmbeddedFailure(response, { fallbackMessage: "Failed to copy a question" });
  }
  return newQuizId;
};

// Fetch quiz approval requests
export const fetchQuizRequests = async () => {
  const response = await api.get('/fetch-quiz-requests');
  return response.data.data;
};

// Approve quiz request
export const approveQuizRequest = async (id: number) => {
  const response = await api.get(`/approve-quiz/${id}`);
  return response.data;
};

// Reject quiz request
export const rejectQuizRequest = async (id: number) => {
  const response = await api.get(`/reject-quiz/${id}`);
  return response.data;
};

// Upload a file (audio recording, image, or book PDF) used by media question types.
// Returns { path, url } where url is the publicly servable storage URL.
export const uploadQuizFile = async (
  file: File,
  subjectId?: number
): Promise<{ path: string; url: string }> => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  const response = await api.post('/upload-quiz-file', formData, {
    params: withSubjectQuery({}, subjectId),
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export default api;
