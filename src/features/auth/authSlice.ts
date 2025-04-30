import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '@/services/api';
import { User, AuthState } from './types';

const initialState: AuthState = {
  currentUser: null,
  users: [],
  token: null,
  status: 'idle',
  error: null,
};

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
    },
    // Optional: Add user to users array if needed
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
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
        state.currentUser = {
          id: action.payload.id.toString(),
          email: action.payload.email,
          role: action.payload.role,
          schoolId: action.payload.schoolId,
          token: action.payload.token,
          name: action.payload.name,
        };
        state.token = action.payload.token;
        
        if (!state.users.some(user => user.id === action.payload.id.toString())) {
          state.users.push(state.currentUser);
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

export const { logout, addUser } = authSlice.actions;
export default authSlice.reducer;