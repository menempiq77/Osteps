// features/auth/types.ts
export interface User {
    id: string;
    email: string;
    role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT';
    schoolId?: string;
  }
  
  export interface AuthState {
    currentUser: User | null;
    users: User[];
  }