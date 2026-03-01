import api from "@/services/api";

export type SubjectClassPayload = {
  subject_id: number;
  year_id?: number;
  name: string;
  base_class_label?: string;
};

export const fetchSubjectClasses = async (params: { subject_id: number; year_id?: number }) => {
  const res = await api.get("/subject-classes", { params });
  return res?.data?.data ?? [];
};

export const createSubjectClass = async (payload: SubjectClassPayload) => {
  const res = await api.post("/subject-classes", payload);
  return res.data;
};

export const enrollStudentsToSubjectClass = async (payload: { subject_class_id: number; student_ids: number[] }) => {
  const res = await api.post("/subject-classes/enroll-students", payload);
  return res.data;
};

export const assignStaffSubjects = async (payload: {
  user_id: number;
  subject_ids: number[];
  role_scope: "HOD" | "TEACHER";
}) => {
  const res = await api.post("/subjects/assign-staff", payload);
  return res.data;
};

export const fetchStaffSubjectAssignments = async (roleScope?: "HOD" | "TEACHER") => {
  const res = await api.get("/subjects/staff-assignments", {
    params: roleScope ? { role_scope: roleScope } : {},
  });
  return res?.data?.data ?? [];
};
