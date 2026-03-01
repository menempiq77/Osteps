export type SubjectRoleScope = "SCHOOL_ADMIN" | "HOD" | "TEACHER" | "STUDENT";

export interface SubjectBrief {
  id: number;
  name: string;
  code?: string | null;
}

export interface SubjectRole {
  subject_id: number;
  role_scope: "HOD" | "TEACHER" | "STUDENT" | "SCHOOL_ADMIN";
}

export interface SubjectContextResponse {
  assigned_subjects: SubjectBrief[];
  default_subject_id?: number | null;
  subject_roles?: SubjectRole[];
}
