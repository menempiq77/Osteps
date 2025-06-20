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

//admins apis Started
// fetche admins
export const fetchAdmins = async () => {
  const response = await api.get('/get-admin');
  return response.data.data;
};
// add admin
export const addAdmin = async (adminData: any) => {
  const response = await api.post('/add-admin', adminData);
  return response.data;
};
// edit admin
export const updateAdmin = async (id: string, adminData: any) => {
  const response = await api.post(`/update-admin/${id}`, adminData);
  return response.data;
};
// delete admin
export const deleteAdmin = async (id: string) => {
  const response = await api.post(`/delete-admin/${id}`);
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
export const fetchClasses = async (yearId: number) => {
  const response = await api.get(`/get-class/${yearId}`);
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
// Trackers APIs
export const fetchTrackers = async (classId: number) => {
  const response = await api.get(`/get-trackers/${classId}`);
  return response.data.data;
};
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
export const updateTracker = async (id: string, trackerData: {
  name: string;
  type: string;
  status: string;
  progress: string[];
}) => {
  const response = await api.post(`/update-trackers/${id}`, trackerData);
  return response.data;
};
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
export const submitQuizByStudent = async (quizId: number, studentId: number, assessmentId: number, answers: any, type: string) => {
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

// Ask Questions APIs
// Fetch all Questions
export const getAllAskQuestions = async () => {
  const response = await api.get('/get-askQuestions');
  return response.data.data;
};
// Add a new Questions
export const createAskQuestion = async (questionData: { name: string }) => {
  const response = await api.post('/askQuestion', questionData);
  return response.data;
};
// Update a Questions
export const updateAskQuestion = async (id: string, questionData: any) => {
  const response = await api.post(`/update-askQuestion/${id}`, questionData);
  return response.data;
};
// Delete a Questions
export const deleteAskQuestion = async (id: number) => {
  const response = await api.post(`/delete-askQuestion/${id}`);
  return response.data;
};
// Add a new Questions
export const submitAskQuestion = async (id: string, questionData: any) => {
  const response = await api.post(`/submitAnswer/${id}`, questionData);
  return response.data;
};

//behaviourType apis Started
// fetch BehaviourType
export const fetchBehaviourType = async () => {
  const response = await api.get('/get-behaviour');
  return response.data.data;
};
// add BehaviourType
export const addBehaviourType = async (behaviourTypeData: { name: string }) => {
  const response = await api.post('/add-behaviour', behaviourTypeData);
  return response.data;
};
// edit BehaviourType
export const updateBehaviourType = async (id: string, behaviourTypeData: any) => {
  const response = await api.put(`/update-behaviour/${id}`, behaviourTypeData);
  return response.data;
};
// delete BehaviourType
export const deleteBehaviourType = async (id: number) => {
  const response = await api.delete(`/delete-behaviour/${id}`);
  return response.data;
};

//behaviour apis Started
// fetch behaviour
export const fetchBehaviour = async (studentId: number) => {
  const response = await api.get(`/get-studentBehaviour/${studentId}`);
  return response.data.data;
};
// add behaviour
export const addBehaviour = async (behaviourData: { name: string }) => {
  const response = await api.post('/add-studentBehaviour', behaviourData);
  return response.data;
};
// edit behaviour
export const updateBehaviour = async (id: string, behaviourData: any) => {
  const response = await api.put(`/update-studentBehaviour/${id}`, behaviourData);
  return response.data;
};
// delete behaviour
export const deleteBehaviour = async (id: number) => {
  const response = await api.delete(`/delete-studentBehaviour/${id}`);
  return response.data;
};

//Timetable apis Started
// fetch Timetable data
export const fetchTimetableData = async () => {
  const response = await api.get(`/get-timeTable`);
  return response.data.data;
};

export default api;