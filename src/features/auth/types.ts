export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  token?: string;
  name?: string;
  profile_path?: string;
  studentClass?:number;
  student?:number;
}

export interface AuthState {
  currentUser: User | null;
  users: User[];
  token: string | null; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}