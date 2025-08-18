// src/services/quizApi.ts
import axios from 'axios';
import { store } from '@/store/store';
import { API_BASE_URL } from '@/lib/config';

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
export const fetchQuizes = async (schoolId: string) => {
  const response = await api.get(`/get-quiz/${schoolId}`);
  return response.data.data;
};
// add Quiz
export const addQuize = async (quizData: { name: string }) => {
  const response = await api.post('/add-quiz', quizData);
  return response.data;
};
// edit Quiz
export const updateQuize = async (id: string, quizData: any) => {
  const response = await api.post(`/update-quiz/${id}`, quizData);
  return response.data;
};
// delete Quiz
export const deleteQuize = async (id: number) => {
  const response = await api.post(`/delete-quiz/${id}`);
  return response.data;
};
//submit quiz by student
export const submitQuizByStudent = async (quizId: number, studentId: number, answers: any, type: string) => {
  const response = await api.post('/submitQuizAnswers', {
    quiz_id: quizId,
    student_id: studentId,
    answers: answers,
    type: type
  });
  return response.data;
};
//submit task quiz by student
export const submitTaskQuizByStudent = async (quizId: number, studentId: number, assessmentId: number, answers: any, type: string) => {
  const response = await api.post('/submitQuizAnswers', {
    quiz_id: quizId,
    student_id: studentId,
    assessment_id: assessmentId,
    answers: answers,
    type: type
  });
  return response.data;
};

export const fetchSubmittedQuizDetails = async (quizId: number, studentId: number, type: string) => {
  const response = await api.get(`/get-SubmittedQuizDetails/${quizId}/${studentId}/${type}`);
  return response.data.data;
};

//Quiz Question apis Started
// fetch QuizQuestions
export const fetchQuizQuestions = async (quizId: number) => {
  const response = await api.get(`/get-quiz-questions/${quizId}`);
  return response.data.data;
};
// add QuizQuestions
export const addQuizQuestion = async (quizId: number, quizQuestionData: { name: string }) => {
  const response = await api.post('/add-quiz-question', { ...quizQuestionData, quiz_id: quizId });
  return response.data;
};
// delete QuizQuestions
export const deleteQuizQuestion = async (id: number) => {
  const response = await api.post(`/delete-quiz-question/${id}`);
  return response.data;
};
// Quiz answer marks
export const quizAnswerMarks = async (answerId: number, isCorrect: number, marks: number) => {
  const response = await api.post(`/quiz-answer/${answerId}`, {
    is_correct: isCorrect,
    marks: marks
  });
  return response.data;
};
// add assign Assesment Quiz
export const assignAssesmentQuiz = async (termId: number, quizId: number) => {
  const response = await api.post('/add-assign-term-quiz', {
    term_id: termId, 
    quiz_id: quizId, 
  });
  return response.data;
};
// add assign Task Quiz
export const assignTaskQuiz = async (termId: number, quizId: number, assessmentId: number) => {
  const response = await api.post('/assign-task-quiz', {
    term_id: termId, 
    quiz_id: quizId, 
    assessment_id: assessmentId,
  });
  return response.data;
};
// add assign tracker Quiz
export const assignTrackerQuiz = async (trackerId: number, quizId: number) => {
  const response = await api.post('/assign-tracker-quiz', {
    tracker_id: trackerId, 
    quiz_id: quizId, 
  });
  return response.data;
};

export default api;