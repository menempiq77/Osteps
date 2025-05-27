import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from '@/services/api';
import { User, AuthState } from './types';

const initialState: AuthState = {
  currentUser: null,
  users: [],
  token: null,
  status: 'idle',
  error: null,
};

// Async login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUser(email, password);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('currentUser');
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, email, role, token, name, school, student } = action.payload;

        const currentUser: User = {
          id: id.toString(),
          email,
          role,
          school: school?.id || null,
          student: student?.id || null,
          studentClass: student?.class_id || null,
          token,
          name,
        };

        state.currentUser = currentUser;
        state.token = token;

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Add to users if not already present
        if (!state.users.some(user => user.id === id.toString())) {
          state.users.push(currentUser);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.currentUser = null;
        state.token = null;
      });
  },
});

export const { logout, addUser, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
