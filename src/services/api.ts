// src/services/api.ts
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { store } = await import("@/store/store");
      const { logout } = await import("@/features/auth/authSlice");
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await api.post('/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

//Classes apis Started
// fetch Classes
export const fetchClasses = async (yearId: number) => {
  const response = await api.get(`/get-class/${yearId}`);
  return response.data.data;
};
// add Class
export const addClass = async (classData: { 
  class_name: string;
  year_id: number;
  number_of_terms: string;
}) => {
  const response = await api.post('/add-class', classData);
  return response.data;
};
// edit Class
export const updateClass = async (id: string, classData: {
  class_name?: string;
  number_of_terms?: string;
}) => {
  const response = await api.post(`/update-class/${id}`, classData);
  return response.data;
};
// delete Class
export const deleteClass = async (id: number) => {
  const response = await api.post(`/delete-class/${id}`);
  return response.data;
};

//Terms apis Started
// fetch Terms
export const fetchTerm = async (classId: number) => {
  const response = await api.get(`/get-term/${classId}`);
  return response.data.data;
};
// add Term
export const addTerm = async (classId: number, termData: { name: string }) => {
  const response = await api.post('/add-term', { ...termData, class_id: classId });
  return response.data;
};
// edit Term
export const updateTerm = async (id: number, classId: number, termData: { name: string }) => {
  const response = await api.post(`/update-term/${id}`, { ...termData, class_id: classId });
  return response.data;
};
// delete Term
export const deleteTerm = async (id: number) => {
  const response = await api.post(`/delete-term/${id}`);
  return response.data;
};

//Teachers apis Started
// fetch Teachers
export const fetchTeachers = async () => {
  const response = await api.get('/get-teacher');
  return response.data.data;
};
// fetch TeachersByStudent
export const fetchTeachersByStudent = async () => {
  const response = await api.get('/getspecTeachers');
  return response.data.data;
};
// add Teacher
export const addTeacher = async (teacherData: { name: string }) => {
  const response = await api.post('/add-teacher', teacherData);
  return response.data;
};
//assign teacher
export const AssignTeacher = async (classId: string | number, teacherId: number) => {
  const response = await api.post(`/assign-teacher/${classId}`, {
    teacher_id: teacherId,
  });
  return response.data;
};
// Get assign teacher
export const getAssignTeacher = async (classId: string | number) => {
  const response = await api.get(`/get-assign-teacher/${classId}`);
  return response.data;
};
// edit Teacher
export const updateTeacher = async (id: string, teacherData: any) => {
  const response = await api.post(`/update-teacher/${id}`, teacherData);
  return response.data;
};
// delete Teacher
export const deleteTeacher = async (id: string | number) => {
  const response = await api.post(`/delete-teacher/${id}`);
  return response.data;
};

//Students apis Started
// fetch Students
export const fetchStudents = async (classId: string | number) => {
  const response = await api.get(`/get-student/${classId}`);
  return response.data.data;
};
// add Student
export const addStudent = async (studentData: {
  student_name: string;
  email: string;
  class_id: number;
  status: string;
}) => {
  const response = await api.post('/add-student', studentData);
  return response.data;
};
// edit Student
export const updateStudent = async (
  id: string,
  studentData: {
    student_name: string;
    email: string;
    class_id: number;
    status: 'active' | 'inactive' | 'suspended';
  }
) => {
  const response = await api.post(`/update-student/${id}`, studentData);
  return response.data;
};

// delete Student
export const deleteStudent = async (id: string | number) => {
  const response = await api.post(`/delete-student/${id}`);
  return response.data;
};

//assessment apis Started
// fetch Assessment
export const fetchAssessment = async (termId: number) => {
  const response = await api.get(`/get-assessment/${termId}`);
  return response.data.data;
};
// fetch Assessment By Students
export const fetchAssessmentByStudent = async (termId: number) => {
  const response = await api.get(`/get-student-assessment/${termId}`);
  return response.data.data;
};
// add Assessment
export const addAssessment = async (assessmentData: { name: string }) => {
  const response = await api.post('/add-assessment', assessmentData);
  return response.data;
};
// edit Assessment
export const updateAssessment = async (id: string, assessmentData: any) => {
  const response = await api.post(`/update-assessment/${id}`, assessmentData);
  return response.data;
};
// delete Assessment
export const deleteAssessment = async (id: number) => {
  const response = await api.post(`/delete-assessment/${id}`);
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

//Tasks apis Started
// fetch Tasks
export const fetchTasks = async (assessmentId: number) => {
  const response = await api.get(`/get-tasks/${assessmentId}`);
  return response.data.data;
};
export const fetchStudentTasks = async (assessmentId: number) => {
  const response = await api.get(`/get-student-assessment-tasks/${assessmentId}`);
  return response.data.data;
};
// add Task
export const addTask = async (formData: FormData) => {
  const response = await api.post('/add-task', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
// update Task
export const updateTask = async (id: string, formData: FormData) => {
  const response = await api.post(`/update-task/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
// delete Task
export const deleteTask = async (id: number) => {
  const response = await api.post(`/delete-task/${id}`);
  return response.data;
};
// upload Task by student
export const uploadTaskByStudent = async (formData: FormData, assessmentId: number) => {
  const response = await api.post(`/submit-student-assessment-tasks/${assessmentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
// add add-student-task-marks
export const addStudentTaskMarks = async (studentId: number, taskData: {
  assessment_id: number;
  task_id: number;
  teacher_assessment_marks: number;
  teacher_assessment_feedback: string;
}) => {
  const response = await api.post(`/add-student-task-marks/${studentId}`, taskData);
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

//Trackers apis Started
// fetch trackers
export const fetchTrackers = async (classId: number) => {
  const response = await api.get(`/get-trackers/${classId}`);
  return response.data.data;
};
// add tracker
export const addTracker = async (trackerData: {
  class_id: number;
  name: string;
  type: string;
  status: string;
  progress: string[];
}) => {
  const response = await api.post('/add-trackers', trackerData);
  return response.data;
};
// update tracker
export const updateTracker = async (id: string, trackerData: {
  name: string;
  type: string;
  status: string;
  progress: string[];
}) => {
  const response = await api.post(`/update-trackers/${id}`, trackerData);
  return response.data;
};
// Delete tracker
export const deleteTracker = async (id: number) => {
  const response = await api.post(`/delete-trackers/${id}`);
  return response.data;
};

//get trackers topic apis Started
// fetch trackers topic
export const fetchTrackerTopics = async (trackerId: number) => {
  const response = await api.get(`/get-topics-progress/${trackerId}`);
  return response.data.data;
};
// fetch trackers topic
export const fetchTrackerStudentTopics = async (studentId: number, trackerId: number) => {
  const response = await api.get(`/get-student-tracker-topics/${studentId}/${trackerId}`);
  return response.data.data;
};
// add trackers topic
export const addTrackerTopic = async (trackerId: number, data: { title: string; marks: number }) => {
  const response = await api.post('/add-topic', { 
    tracker_id: trackerId, 
    title: data.title, 
    marks: data.marks 
  });
  return response.data;
};
// edit trackers topic
export const updateTrackerTopic = async (topicId: number, data: { title: string; marks: number }) => {
  const response = await api.post(`/update-topic/${topicId}`, {  
    title: data.title, 
    marks: data.marks 
  });
  return response.data;
};
// delete trackers topic
export const deleteTrackerTopic = async (topicId: number) => {
  const response = await api.post(`/delete-topic/${topicId}`);
  return response.data;
};
// toggle trackers topic status
export const updateTopicStatus = async (topicId: number, statusId: number, isCompleted: boolean) => {
  const response = await api.post('/add-toggleProgress', {
    topic_id: topicId,
    status_id: statusId,
    is_completed: isCompleted ? 1 : 0
  });
  return response.data;
};
export const addTopicMark = async (topicId: number, marks: number, studentId: number) => {
  const response = await api.post('/add-student-topic-marks', {
    topic_id: topicId,
    student_id: studentId,
    marks: marks,
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

//quiz apis Started
// fetch quizes
export const fetchQuizes = async () => {
  const response = await api.get('/get-quiz');
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

export default api;