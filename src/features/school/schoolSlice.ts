import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { School, SchoolState } from './types';

const initialState: SchoolState = {
  schools: [],
};

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    addSchool: (state, action: PayloadAction<School>) => {
      state.schools.push(action.payload);
    },
  },
});

export const { addSchool } = schoolSlice.actions;
export default schoolSlice.reducer;