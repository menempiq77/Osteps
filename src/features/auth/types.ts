export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'HOD' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  school?: number | null;
  token?: string;
  name?: string;
  profile_path?: string;
  studentClass?:number;
  student?:number;
  studentClassName?: string;
  studentYearName?: string;
  contact?: string;
  assigned_subjects?: Array<{ id: number; name: string; code?: string | null }>;
  default_subject_id?: number | null;
  subject_roles?: Array<{ subject_id: number; role_scope: string }>;
}

export interface AuthState {
  currentUser: User | null;
  users: User[];
  token: string | null; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
