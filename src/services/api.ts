// src/services/api.ts
import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';
import { getStoredSubjectId } from '@/lib/subjectScope';
import { withSubjectQuery } from '@/lib/subjectScope';
import { shouldUseLegacyUnscopedSubjectData } from '@/lib/subjectScope';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const { store } = await import("@/store/store");
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Auto-attach subject_id to subject-scoped APIs when absent.
  const url = String(config.url || "");
  const subjectScopedHints = [
    "/get-quiz",
    "/add-quiz",
    "/update-quiz",
    "/submitQuizAnswers",
    "/get-SubmittedQuizDetails",
    "/get-school-trackers",
    "/get-trackers",
    "/add-trackers",
    "/update-trackers",
    "/assign-tracker",
    "/get-assessment",
    "/get-school-assessments",
    "/get-student-assessment",
    "/get-student-assessment-tasks",
    "/add-assessment",
    "/update-assessment",
    "/get-report-assessments",
    "/get-assigned-year-classes",
    "/getall-assigned-year-classes",
    "/get-whole-assessments-report",
    "/schoolget-whole-assessments-report",
    "/get-student-scores",
    "/leaderboard/",
    "/school/dashboard",
    "/dashboard-student-assessment",
    "/search-studentProfile",
    "/mind-upgrade/",
  ];
  const isScoped = subjectScopedHints.some((hint) => url.includes(hint));
  if (isScoped) {
    const existing = (config.params as any)?.subject_id;
    const subjectId = existing ?? getStoredSubjectId();
    const legacyUnscoped = shouldUseLegacyUnscopedSubjectData(subjectId ? Number(subjectId) : null);
    if (subjectId && Number(subjectId) > 0 && !legacyUnscoped) {
      config.params = { ...(config.params || {}), subject_id: Number(subjectId) };
    }
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

export const loginUser = async (login: string, password: string) => {
  const formData = new FormData();
  formData.append('login', login);
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
export const fetchAssessment = async (termId: number, subjectId?: number) => {
  const response = await api.get(`/get-assessment/${termId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data ?? [];
};

export const fetchSchoolAssessment = async (schoolId: number, subjectId?: number) => {
  const response = await api.get(`/get-school-assessments/${schoolId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data ?? [];
};

// reorder Assessment
export const reorderAssessments = async (orders: { id: number; position: number }[]) => {
  const response = await api.post('/reorder-assessment', {
    orders: orders,
  });
  return response.data;
};

// fetch Assessment By Students
export const fetchAssessmentByStudent = async (termId: number, subjectId?: number) => {
  const response = await api.get(`/get-student-assessment/${termId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data ?? [];
};
// add Assessment
export const addAssessment = async (assessmentData: { name: string; school_id?: number; type?: string; subject_id?: number }) => {
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
// duplicate Assessment (copies assessment + all its tasks)
export const duplicateAssessment = async (id: string | number) => {
  const response = await api.post(`/duplicate-assessment/${id}`);
  return response.data;
};
// delete deleteAssignTermQuiz
export const deleteAssignTermQuiz = async (id: number) => {
  const response = await api.delete(`/delete-assign-term-quiz/${id}`);
  return response.data;
};

// assign tracker to class
export const assignAssessmentToTerm = async (assesmentId: number, termId: number) => {
  const response = await api.post(`/assign-assessments`, {
    assessment_id: assesmentId,
    term_id: termId,
  });
  return response.data;
};

// unassign tracker from class
export const unassignAssessmentFromTerm = async (assesmentId: number, termId: number) => {
  const response = await api.post(`/unassign-assessments`, {
    assessment_id: assesmentId,
    term_id: termId,
  });
  return response.data;
};


//Tasks apis Started
// fetch Tasks
export const fetchTasks = async (
  assessmentId: number,
  subjectId?: number | null
) => {
  const response = await api.get(`/get-tasks/${assessmentId}`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response.data.data ?? [];
};

const toArray = <T>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

const sumQuizMarks = (quiz: any): string => {
  const total = toArray(quiz?.quiz_queston).reduce((sum, question: any) => {
    return sum + (parseFloat(String(question?.marks ?? 0)) || 0);
  }, 0);
  return String(total);
};

const normalizeTaskTreeToStudentTasks = (rows: any[] = []) => {
  return rows.flatMap((row: any) => {
    if (row?.type === "quiz") {
      const quiz = row?.quiz ?? null;
      return toArray(quiz?.submissions).map((submission: any) => ({
        id: submission?.id,
        student_id: submission?.student_id,
        assessment_id: submission?.assessment_id ?? row?.assessment_id,
        task_id: row?.id,
        task: {
          id: row?.id,
          assessment_id: row?.assessment_id,
          task_name: quiz?.name ?? "Quiz",
          allocated_marks: sumQuizMarks(quiz),
          task_type: "quiz",
          description: "",
          file_path: null,
          created_at: row?.created_at ?? submission?.created_at,
          updated_at: row?.updated_at ?? submission?.updated_at,
        },
        quiz,
        self_assessment_mark:
          submission?.self_assessment_mark != null
            ? String(submission.self_assessment_mark)
            : "",
        additional_notes: submission?.comment ?? "",
        file_path: "",
        created_at: submission?.created_at ?? row?.created_at,
        updated_at: submission?.updated_at ?? row?.updated_at,
        teacher_assessment_score:
          submission?.teacher_assessment_mark != null
            ? String(submission.teacher_assessment_mark)
            : undefined,
        teacher_feedback: submission?.comment ?? "",
        teacher_assessment_feedback: submission?.comment ?? "",
        submission_type: "quiz",
        teacher_assessment_marks:
          submission?.teacher_assessment_mark != null
            ? String(submission.teacher_assessment_mark)
            : undefined,
        teacher_assessment_mark: submission?.teacher_assessment_mark ?? null,
        status: submission?.status ?? "completed",
      }));
    }

    return toArray(row?.student_assessment_tasks).map((submission: any) => ({
      id: submission?.id,
      student_id: submission?.student_id,
      assessment_id: submission?.assessment_id ?? row?.assessment_id,
      task_id: submission?.task_id ?? row?.id,
      task: {
        id: row?.id,
        assessment_id: row?.assessment_id,
        task_name: row?.task_name,
        allocated_marks: row?.allocated_marks,
        task_type: row?.task_type,
        description: row?.description,
        file_path: row?.file_path ?? null,
        created_at: row?.created_at,
        updated_at: row?.updated_at,
        url: row?.url ?? null,
      },
      self_assessment_mark:
        submission?.self_assessment_mark != null
          ? String(submission.self_assessment_mark)
          : "",
      additional_notes: submission?.additional_notes ?? "",
      file_path: submission?.file_path ?? row?.file_path ?? "",
      created_at: submission?.created_at ?? row?.created_at,
      updated_at: submission?.updated_at ?? row?.updated_at,
      teacher_assessment_score:
        submission?.teacher_assessment_score != null
          ? String(submission.teacher_assessment_score)
          : undefined,
      teacher_feedback: submission?.teacher_feedback ?? "",
      teacher_assessment_feedback: submission?.teacher_feedback ?? "",
      submission_type: submission?.submission_type ?? "task",
      teacher_assessment_marks:
        submission?.teacher_assessment_score != null
          ? String(submission.teacher_assessment_score)
          : undefined,
      status: submission?.status ?? "completed",
    }));
  });
};

export const fetchStudentTasks = async (
  assessmentId: number,
  subjectId?: number | null
) => {
  try {
    const response = await api.get(`/get-student-assessment-tasks/${assessmentId}`, {
      params: withSubjectQuery({}, subjectId),
    });
    const payload = response.data;
    const embeddedStatusCode = Number(
      payload?.status_code ?? payload?.statusCode ?? payload?.code ?? 200
    );
    const embeddedMessage = String(payload?.msg ?? payload?.message ?? "");
    const isEmbeddedFailure =
      payload?.success === false ||
      payload?.status === false ||
      payload?.ok === false ||
      embeddedStatusCode >= 400;

    if (isEmbeddedFailure) {
      const syntheticError: any = new Error(embeddedMessage || "Failed to fetch student tasks");
      syntheticError.response = {
        data: payload,
        status: embeddedStatusCode,
      };
      throw syntheticError;
    }

    return payload?.data ?? [];
  } catch (error: any) {
    const backendMessage =
      error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.message ||
      "";

    const shouldFallback =
      String(backendMessage).includes("undefined relationship [quiz_queston]") ||
      Number(error?.response?.data?.status_code ?? error?.response?.status ?? 0) >= 500;

    if (!shouldFallback) {
      throw error;
    }

    const tasks = await fetchTasks(assessmentId, subjectId);
    return normalizeTaskTreeToStudentTasks(tasks);
  }
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
// Remove Task Quiz
export const removeTaskQuiz = async (quizId: number) => {
  const response = await api.post(`/remove-task-quiz/${quizId}`);
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

// mark-url-taskAsComplete
export const markUrlTaskAsComplete = async (taskId: number) => {
  const response = await api.post(`/mark-url-taskAsComplete`, {  
    task_id: taskId,
  });
  return response.data;
};

//get trackers topic apis Started
// fetch trackers topic
export const fetchTrackerTopics = async (trackerId: number) => {
  const response = await api.get(`/get-topics-progress/${trackerId}`);
  // API returns: { msg: "...", status_code: 200, data: {...tracker with topics} }
  // So we need response.data.data
  return response.data.data;
};
// fetch trackers topic
export const fetchTrackerStudentTopics = async (studentId: number, trackerId: number) => {
  const response = await api.get(`/get-student-tracker-topics/${studentId}/${trackerId}`);
  return response.data.data ?? [];
};

// reorder TrackerTopics
export const reorderTrackerTopics = async (orders: { id: number; position: number }[]) => {
  const response = await api.post('/reorder-topic', {
    orders: orders,
  });
  return response.data;
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
export const addTopicMark = async (
  topicId: number,
  marks: number,
  studentId: number,
  trackerId?: number,
  classId?: number
) => {
  const formData = new FormData();
  formData.append("topic_id", topicId.toString());
  formData.append("topic_ids[]", topicId.toString());
  formData.append("topic_ids", topicId.toString());
  formData.append("student_id", studentId.toString());
  formData.append("marks", marks.toString());

  if (typeof trackerId === "number" && !Number.isNaN(trackerId)) {
    formData.append("tracker_id", trackerId.toString());
  }

  if (typeof classId === "number" && !Number.isNaN(classId)) {
    formData.append("class_id", classId.toString());
  }

  const response = await api.post("/add-student-topic-marks", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


// fetch School logo
export const fetchSchoolLogo = async () => {
  const response = await api.get(`/get-logo`);
  return response.data.data ?? null;
};

export default api;
