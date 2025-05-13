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

//Library Resource apis Started
// fetch Resources
export const fetchResources = async () => {
  const response = await api.get('/get-resources');
  return response.data.data;
};

//Library apis Started
// fetch Library
export const fetchLibrary = async () => {
  const response = await api.get('/get-library');
  return response.data.data;
};
// add Library
export const addLibrary = async (libraryData: FormData): Promise<any> => {
  const response = await api.post('/add-library', libraryData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
// edit Library
export const updateLibrary = async (id: string, libraryData: FormData) => {
  const response = await api.post(`/update-library/${id}`, libraryData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// delete Library
export const deleteLibrary = async (id: number) => {
  const response = await api.post(`/delete-library/${id}`);
  return response.data;
};

export default api;