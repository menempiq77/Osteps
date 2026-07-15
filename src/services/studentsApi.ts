// src/services/studentsApi.ts
import { createApiClient } from '@/lib/apiClient';
import { withSubjectPayload, withSubjectQuery } from '@/lib/subjectScope';
import { isReadOnlyWorkspace } from '@/lib/readOnlyWorkspace';
import { isEmbeddedFailure, getPayloadMessage, getApiErrorMessage } from '@/lib/apiResponse';

const api = createApiClient();

const getRawStudents = async (
  classId: string | number,
  subjectId?: number | null,
  subjectClassId?: string | number | null
) => {
  const scopedParams = withSubjectQuery({}, subjectId) as Record<string, unknown>;
  if (subjectClassId != null && String(subjectClassId).trim() !== "") {
    scopedParams.subject_class_id = Number(subjectClassId);
  }
  // In the archived read-only workspace the subject-class enrollment is inactive,
  // so the subject-scoped roster returns nothing. Ask the API to include inactive
  // subject-classes so we get the students actually enrolled in the subject
  // (rather than falling back to the whole physical base-class roster, which can
  // include students who were never enrolled in this subject).
  if (isReadOnlyWorkspace()) {
    scopedParams.include_inactive = 1;
  }
  const response = await api.get(`/get-student/${classId}`, {
    params: scopedParams,
  });
  return response.data.data;
};

// fetch Students
export const fetchStudents = async (
  classId: string | number,
  subjectId?: number | null,
  subjectClassId?: string | number | null
) => {
  const rows = await getRawStudents(classId, subjectId, subjectClassId);
  // In the archived read-only workspace the subject-class enrollment is
  // inactive, so the subject-scoped roster returns nothing. Fall back to the
  // base class roster so the archived class's students still show up.
  if (
    (!Array.isArray(rows) || rows.length === 0) &&
    isReadOnlyWorkspace() &&
    classId != null &&
    String(classId).trim() !== ""
  ) {
    return fetchBaseClassStudents(classId);
  }
  return rows;
};

/**
 * Fetch the full base-class roster with NO subject scoping at all.
 *
 * `fetchStudents`/`withSubjectQuery` silently fall back to the stored active
 * subject id when none is passed, which returns 0 rows for an archived
 * subject-class. The archived read-only workspace uses this to list the class's
 * students as they were, bypassing the (inactive) subject-class enrollment.
 */
export const fetchBaseClassStudents = async (classId: string | number) => {
  const response = await api.get(`/get-student/${classId}`);
  return response?.data?.data ?? [];
};

/**
 * Students that belong to no class at all (e.g. their only class was a
 * deleted subject's class). The per-class roster fetch can't surface these,
 * so they are fetched separately and merged into the "All Students" list so a
 * School Admin can still find and reassign them.
 */
export const fetchUnassignedStudents = async () => {
  const response = await api.get(`/get-unassigned-students`);
  return response?.data?.data ?? [];
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
  subject_class_id?: number;
}, subjectId?: number | null) => {
  try {
    const response = await api.post('/add-student', withSubjectPayload(studentData, subjectId));
    const payload = response.data;
    if (isEmbeddedFailure(payload)) {
      throw new Error(getPayloadMessage(payload, "Failed to add student"));
    }

    return payload?.data ?? payload;
  } catch (error: any) {
    throw new Error(getApiErrorMessage(error, "Failed to add student"));
  }
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
    subject_class_id?: number;
  },
  subjectId?: number | null
) => {
  try {
    const response = await api.post(`/update-student/${id}`, withSubjectPayload(studentData, subjectId));
    const payload = response.data;
    if (isEmbeddedFailure(payload)) {
      throw new Error(getPayloadMessage(payload, "Failed to update student"));
    }

    return payload?.data ?? payload;
  } catch (error: any) {
    throw new Error(getApiErrorMessage(error, "Failed to update student"));
  }
};

// update only a student's support / wellbeing (SEN) info
export const updateStudentSupport = async (
  id: string | number,
  data: { is_sen: boolean; sen_details?: string | null },
  subjectId?: number | null
) => {
  try {
    const response = await api.post(
      `/update-student-support/${id}`,
      withSubjectPayload(data, subjectId)
    );
    const payload = response.data;
    if (isEmbeddedFailure(payload)) {
      throw new Error(getPayloadMessage(payload, "Failed to update support info"));
    }

    return payload?.data ?? payload;
  } catch (error: any) {
    throw new Error(getApiErrorMessage(error, "Failed to update support info"));
  }
};

// delete Student
export const deleteStudent = async (id: string | number) => {
  const response = await api.post(`/delete-student/${id}`);
  return response.data;
};
export default api;

// fetch Students profile data
export const fetchStudentProfileData = async (
  studentId: string | number,
  subjectId?: number | null
) => {
  const response = await api.get(`/get-studentProfile/${studentId}`, {
    params: withSubjectQuery({}, subjectId),
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
