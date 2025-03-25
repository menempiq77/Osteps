import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from './types';
// interface User {
//   id: string;
//   email: string;
//   role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT';
//   schoolId?: string;
// }

// interface AuthState {
//   currentUser: User | null;
//   users: User[];
// }

const initialState: AuthState = {
  currentUser: null,
  users: [
    {
      id: '1',
      email: 'superadmin@example.com',
      role: 'SUPER_ADMIN',
    },
  ],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ email: string; password: string }>) {
      const user = state.users.find(u => u.email === action.payload.email);
      if (user) state.currentUser = user;
    },
    logout(state) {
      state.currentUser = null;
    },
    createSchoolAdmin(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
  },
});

export const { login, logout, createSchoolAdmin } = authSlice.actions;
export default authSlice.reducer;