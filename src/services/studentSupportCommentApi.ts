// src/services/studentSupportCommentApi.ts
import api from "@/services/api";
import { withSubjectPayload, withSubjectQuery } from "@/lib/subjectScope";

export interface StudentSupportComment {
  id: number;
  school_id?: number | null;
  student_id: number;
  subject_id?: number | null;
  author_id?: number | null;
  author_name?: string | null;
  author_role?: string | null;
  comment: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export const fetchStudentSupportComments = async (
  studentId: number | string,
  subjectId?: number | null
): Promise<StudentSupportComment[]> => {
  const response = await api.get(`/students/${studentId}/support-comments`, {
    params: withSubjectQuery({}, subjectId),
  });
  return response?.data?.data ?? [];
};

export const createStudentSupportComment = async (
  payload: { student_id: number; comment: string; subject_id?: number | null },
  subjectId?: number | null
): Promise<StudentSupportComment> => {
  const response = await api.post(
    "/student-support-comments",
    withSubjectPayload(payload, subjectId)
  );
  return response?.data?.data ?? response?.data;
};

export const updateStudentSupportComment = async (
  id: number,
  comment: string,
  subjectId?: number | null
): Promise<StudentSupportComment> => {
  const response = await api.post(
    `/student-support-comments/${id}`,
    withSubjectPayload({ comment }, subjectId)
  );
  return response?.data?.data ?? response?.data;
};

export const deleteStudentSupportComment = async (id: number): Promise<void> => {
  await api.delete(`/student-support-comments/${id}`);
};
