// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import schoolReducer from '../features/school/schoolSlice';
import classReducer from '../features/class/classSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    school: schoolReducer,
    class: classReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;