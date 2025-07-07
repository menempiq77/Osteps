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

export default api;