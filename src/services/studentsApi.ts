// src/services/studentsApi.ts
import axios from 'axios';
import { store } from '@/store/store';
import { API_BASE_URL } from '@/lib/config';
import { withSubjectQuery } from '@/lib/subjectScope';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const YEAR7_LOCAL_CLASS_BY_ID: Record<number, string> = {
  20: "7IsA",
  21: "7IsB1",
  22: "7IsB2",
};

const YEAR7_LOCAL_TARGETS: Record<string, string> = {
  asser: "7IsA",
  ayman: "7IsA",
  elias: "7IsA",
  gemma: "7IsA",
  kitty: "7IsA",
  "mohammed a": "7IsA",
  tia: "7IsA",
  "zayed m": "7IsA",
  "zayed z": "7IsA",
  "hamza kaan bilikozen": "7IsB1",
  hanna: "7IsB1",
  kayla: "7IsB1",
  lara: "7IsB1",
  malek: "7IsB1",
  "mayra b": "7IsB1",
  mohsin: "7IsB1",
  myrah: "7IsB1",
  noor: "7IsB1",
  omar: "7IsB1",
  "saif alif ezzy": "7IsB1",
  selim: "7IsB1",
  yousof: "7IsB1",
  zaynab: "7IsB1",
  aarish: "7IsB2",
  daniel: "7IsB2",
  elif: "7IsB2",
  "erich mcfarland": "7IsB2",
  kerem: "7IsB2",
  "mohammad ss": "7IsB2",
  qasim: "7IsB2",
  rania: "7IsB2",
  salwan: "7IsB2",
  sophia: "7IsB2",
  yaseen: "7IsB2",
  zayd: "7IsB2",
};

const normalizeYear7StudentKey = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const getLocalYear7TargetClass = (student: Record<string, any>, sourceClassId: number): string => {
  const nameKey = normalizeYear7StudentKey(student.student_name ?? student.name ?? "");
  const mapped = YEAR7_LOCAL_TARGETS[nameKey];
  if (mapped) return mapped;
  return YEAR7_LOCAL_CLASS_BY_ID[sourceClassId] ?? "";
};

const getRawStudents = async (classId: string | number) => {
  const response = await api.get(`/get-student/${classId}`, {
    params: withSubjectQuery({}),
  });
  return response.data.data;
};

const getLocallyRestoredYear7Students = async (requestedClassId: number) => {
  const requestedClassLabel = YEAR7_LOCAL_CLASS_BY_ID[requestedClassId];
  if (!requestedClassLabel) {
    return getRawStudents(requestedClassId);
  }

  const classIds = Object.keys(YEAR7_LOCAL_CLASS_BY_ID).map((id) => Number(id));
  const rowsByClass = await Promise.all(
    classIds.map(async (classId) => {
      const rows = await getRawStudents(classId);
      return (Array.isArray(rows) ? rows : []).map((student: Record<string, any>) => ({
        ...student,
        __local_source_class_id: classId,
      }));
    })
  );

  const uniqueStudents = Array.from(
    new Map(
      rowsByClass
        .flat()
        .map((student) => [
          String(student.id ?? student.student_id ?? `${student.user_name}-${student.student_name}`),
          student,
        ])
    ).values()
  );

  return uniqueStudents
    .filter((student) => {
      const sourceClassId = Number(student.__local_source_class_id ?? requestedClassId);
      return getLocalYear7TargetClass(student, sourceClassId) === requestedClassLabel;
    })
    .map(({ __local_source_class_id, ...student }) => student)
    .concat(
      requestedClassLabel === "7IsB1" &&
        !uniqueStudents.some(
          (student) =>
            normalizeYear7StudentKey(student.student_name ?? student.name ?? "") ===
            "hamza kaan bilikozen"
        )
        ? [
            {
              id: "local-year7-hamza-kaan-bilikozen",
              student_id: "local-year7-hamza-kaan-bilikozen",
              student_name: "Hamza Kaan Bilikozen",
              user_name: "Hamza Kaan Bilikozen",
              class_id: requestedClassId,
              class_name: requestedClassLabel,
              status: "active",
            },
          ]
        : []
    );
};

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// fetch Students
export const fetchStudents = async (classId: string | number) => {
  const numericClassId = Number(classId);
  if (Number.isFinite(numericClassId) && YEAR7_LOCAL_CLASS_BY_ID[numericClassId]) {
    return getLocallyRestoredYear7Students(numericClassId);
  }
  return getRawStudents(classId);
};
// add Student
export const addStudent = async (studentData: {
  student_name: string;
  user_name?: string;
  email: string;
  password?: string;
  class_id: number;
  status: string;
  gender?: string;
  student_gender?: string;
  nationality?: string;
  is_sen?: boolean;
  sen_details?: string;
}) => {
  const response = await api.post('/add-student', studentData);
  return response.data;
};
// edit Student
export const updateStudent = async (
  id: string,
  studentData: {
    student_name: string;
    user_name?: string;
    email: string;
    class_id: number;
    password?: string;
    status: 'active' | 'inactive' | 'suspended';
    gender?: string;
    student_gender?: string;
    nationality?: string;
    is_sen?: boolean;
    sen_details?: string;
  }
) => {
  try {
    const response = await api.post(`/update-student/${id}`, studentData);
    const payload = response.data;
    const statusCode = Number(
      payload?.status_code ?? payload?.statusCode ?? payload?.code ?? 200
    );
    const isExplicitFailure =
      payload?.success === false || payload?.status === false || payload?.ok === false;

    if ((Number.isFinite(statusCode) && statusCode >= 400) || isExplicitFailure) {
      const backendMessage =
        payload?.msg || payload?.message || payload?.data?.message || "Failed to update student";
      throw new Error(String(backendMessage));
    }

    return payload?.data ?? payload;
  } catch (error: any) {
    const backendMessage =
      error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      (Array.isArray(error?.response?.data?.errors)
        ? error.response.data.errors[0]
        : undefined) ||
      (typeof error?.response?.data?.errors === "object"
        ? Object.values(error.response.data.errors)[0]
        : undefined) ||
      error?.message ||
      "Failed to update student";
    throw new Error(String(Array.isArray(backendMessage) ? backendMessage[0] : backendMessage));
  }
};

// delete Student
export const deleteStudent = async (id: string | number) => {
  const response = await api.post(`/delete-student/${id}`);
  return response.data;
};
export default api;

// fetch Students profile data
export const fetchStudentProfileData = async (studentId: string | number) => {
  const response = await api.get(`/get-studentProfile/${studentId}`, {
    params: withSubjectQuery({}),
  });
  return response.data.data;
};

export const uploadStudentAvatar = async (
  classId: string | number,
  studentId: string | number,
  file: File
) => {
  const formDataPrimary = new FormData();
  formDataPrimary.append("profile_path", file);

  const attempts: Array<() => Promise<any>> = [
    // Preferred REST route (newer backend shape).
    () =>
      api.post(`/classes/${classId}/students/${studentId}/avatar`, formDataPrimary, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    // Legacy route used in this codebase for student updates.
    () => {
      const fd = new FormData();
      fd.append("profile_path", file);
      return api.post(`/update-student/${studentId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    // Profile route fallback (some backends expect student_id in multipart body).
    () => {
      const fd = new FormData();
      fd.append("student_id", String(studentId));
      fd.append("profile_path", file);
      return api.post(`/update-student-profile`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  ];

  let lastError: any;
  for (const attempt of attempts) {
    try {
      const response = await attempt();
      return response.data;
    } catch (error: any) {
      lastError = error;
    }
  }

  const backendMessage =
    lastError?.response?.data?.msg ||
    lastError?.response?.data?.message ||
    lastError?.response?.data?.data?.message ||
    lastError?.message ||
    "Failed to update avatar";
  throw new Error(String(backendMessage));
};
