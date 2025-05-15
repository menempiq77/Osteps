// src/services/api.ts
import axios from 'axios';
import { store } from '@/store/store';
import { API_BASE_URL } from '@/lib/config';
import { logout } from '@/features/auth/authSlice';

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
  (error) => {
    if (error.response?.status === 401) {
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


//Schools apis Started
// fetche Schools
export const fetchSchools = async () => {
  const response = await api.get('/get-school');
  return response.data.data;
};
// add Schools
export const addSchool = async (schoolData: any) => {
  const response = await api.post('/add-school', schoolData);
  return response.data;
};
// edit Schools
export const updateSchool = async (id: string, schoolData: any) => {
  const response = await api.post(`/update-school/${id}`, schoolData);
  return response.data;
};
// delete Schools
export const deleteSchool = async (id: string) => {
  const response = await api.post(`/delete-school/${id}`);
  return response.data;
};

//Years apis Started
// fetch Years
export const fetchYears = async () => {
  const response = await api.get('/get-year');
  return response.data.data;
};
// add Year
export const addYear = async (yearData: { name: string }) => {
  const response = await api.post('/add-year', yearData);
  return response.data;
};
// edit Year
export const updateYear = async (id: string, yearData: any) => {
  const response = await api.post(`/update-year/${id}`, yearData);
  return response.data;
};
// delete Year
export const deleteYear = async (id: number) => {
  const response = await api.post(`/delete-year/${id}`);
  return response.data;
};


//Classes apis Started
// fetch Classes
export const fetchClasses = async () => {
  const response = await api.get('/get-class');
  return response.data.data;
};
// add Class
export const addClass = async (classData: { 
  class_name: string;
  teacher_id: number;
  year_id: number;
  number_of_terms: string;
}) => {
  const response = await api.post('/add-class', classData);
  return response.data;
};
// edit Class
export const updateClass = async (id: string, classData: {
  class_name?: string;
  teacher_id?: number;
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

//Teachers apis Started
// fetch Teachers
export const fetchTeachers = async () => {
  const response = await api.get('/get-teacher');
  return response.data.data;
};
// add Teacher
export const addTeacher = async (teacherData: { name: string }) => {
  const response = await api.post('/add-teacher', teacherData);
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
  const response = await api.post('/get-student', {
    class_id: classId,
  });
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

//Grades apis Started
// fetch Grades
export const fetchGrades = async () => {
  const response = await api.get('/get-grades');
  return response.data.data;
};
// add Grade
export const addGrade = async (gradeData: { name: string }) => {
  const response = await api.post('/add-grades', gradeData);
  return response.data;
};
// edit Grade
export const updateGrade = async (id: string, gradeData: any) => {
  const response = await api.post(`/update-grades/${id}`, gradeData);
  return response.data;
};
// delete Grade
export const deleteGrade = async (id: number) => {
  const response = await api.post(`/delete-grades/${id}`);
  return response.data;
};

//Announcemens apis Started
// fetch Announcements
export const fetchAnnouncements = async () => {
  const response = await api.get('/get-announcement');
  return response.data.data;
};
// add Announcement
export const addAnnouncement = async (announcementData: { name: string }) => {
  const response = await api.post('/add-announcement', announcementData);
  return response.data;
};
// edit Announcement
export const updateAnnouncement = async (id: string, announcementData: any) => {
  const response = await api.post(`/update-announcement/${id}`, announcementData);
  return response.data;
};
// delete Announcement
export const deleteAnnouncement = async (id: number) => {
  const response = await api.post(`/delete-announcement/${id}`);
  return response.data;
};

//Library Categories apis Started
// fetch Categories
export const fetchCategories = async () => {
  const response = await api.get('/get-category');
  return response.data.data;
};
// add Category
export const addCategory = async (categoryData: { name: string }) => {
  const response = await api.post('/add-category', categoryData);
  return response.data;
};
// edit Category
export const updateCategory = async (id: string, categoryData: any) => {
  const response = await api.post(`/update-category/${id}`, categoryData);
  return response.data;
};
// delete Category
export const deleteCategory = async (id: number) => {
  const response = await api.post(`/delete-category/${id}`);
  return response.data;
};

//Library Resource apis Started
// fetch Resources
export const fetchResources = async () => {
  const response = await api.get('/get-resources');
  return response.data.data;
};
// add Resource
export const addResource = async (resourcesData: { name: string }) => {
  const response = await api.post('/add-resource', resourcesData);
  return response.data;
};
// edit Resource
export const updateResource = async (id: string, resourcesData: any) => {
  const response = await api.post(`/update-resource/${id}`, resourcesData);
  return response.data;
};
// delete Resource
export const deleteResource = async (id: number) => {
  const response = await api.post(`/delete-resource/${id}`);
  return response.data;
};

//Library apis Started
// fetch Library items
export const fetchLibrary = async () => {
  const response = await api.get('/get-library');
  return response.data.data;
};
// add Library item
export const addLibrary = async (libraryData: FormData): Promise<any> => {
  const response = await api.post('/add-library', libraryData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
// edit Library item
export const updateLibrary = async (id: string, libraryData: FormData) => {
  const response = await api.post(`/update-library/${id}`, libraryData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// delete Library item
export const deleteLibrary = async (id: number, filePath?: string) => {
  const formData = new FormData();
  if (filePath) {
    formData.append('file_path', filePath);
  }
  const response = await api.post(`/delete-library/${id}`, formData);
  return response.data;
};

//assessment apis Started
// fetch Assessment
export const fetchAssessment = async () => {
  const response = await api.get('/get-assessment');
  return response.data.data;
};
// fetch Students Assessment
export const fetchStudentsAssessment = async () => {
  const response = await api.get('/get-student-assessment');
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

//quiz-question apis Started
// fetch quiz-question
export const fetchQuizQuestion = async () => {
  const response = await api.get('/get-quiz-question');
  return response.data.data;
};
// add quiz-question
export const addQuizQuestion = async (quizQuestionData: { name: string }) => {
  const response = await api.post('/add-quiz-question', quizQuestionData);
  return response.data;
};

export default api;