import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Class, ClassState, Term } from './types';

const initialState: ClassState = {
  classes: [],
};

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    addClass: (state, action: PayloadAction<Class>) => {
      state.classes.push({
        ...action.payload,
        terms: action.payload.terms.map(term => ({
          ...term,
          id: term.id || Date.now().toString() // Ensure ID exists
        }))
      });
    },
    assignTeacher: (state, action: PayloadAction<{ classId: string; teacherId: string }>) => {
      const cls = state.classes.find(c => c.id === action.payload.classId);
      if (cls) cls.teacherId = action.payload.teacherId;
    },
  },
});

export const { addClass, assignTeacher } = classSlice.actions;
export default classSlice.reducer;