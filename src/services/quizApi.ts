// src/services/quizApi.ts
import axios from 'axios';
import { store } from '@/store/store';
import { API_BASE_URL } from '@/lib/config';
import { withSubjectPayload, withSubjectQuery } from '@/lib/subjectScope';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//quiz apis Started
// fetch quizes
export const fetchQuizes = async (schoolId: string, subjectId?: number) => {
  const response = await api.get(`/get-quiz/${schoolId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data;
};
// add Quiz
export const addQuize = async (quizData: { name: string }, subjectId?: number) => {
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
export const submitTaskQuizByStudent = async (quizId: number, studentId: number, assessmentId: number, answers: any, type: string, subjectId?: number) => {
  const response = await api.post('/submitQuizAnswers', withSubjectPayload({
    quiz_id: quizId,
    student_id: studentId,
    assessment_id: assessmentId,
    answers: answers,
    type: type
  }, subjectId));
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
export const addQuizQuestion = async (quizId: number, quizQuestionData: { name: string }, subjectId?: number) => {
  const response = await api.post('/add-quiz-question', withSubjectPayload({ ...quizQuestionData, quiz_id: quizId }, subjectId));
  return response.data;
};
// add QuizQuestions
export const updateQuizQuestion = async (questionId: number, quizId: number, quizQuestionData: { name: string }, subjectId?: number) => {
  const response = await api.post(`/update-quiz-question/${questionId}`, withSubjectPayload({ ...quizQuestionData, quiz_id: quizId }, subjectId));
  return response.data;
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
export const assignTaskQuiz = async (quizId: number, assessmentId: number, subjectId?: number) => {
  const response = await api.post('/assign-task-quiz', withSubjectPayload({
    quiz_id: quizId, 
    assessment_id: assessmentId,
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

export default api;
