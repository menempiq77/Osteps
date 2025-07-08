// src/services/timetableApi.ts
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/store/store';

const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTimetableData = async () => {
  const response = await fetch(`${API_BASE_URL}/get-timeTable`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch timetable data');
  const data = await response.json();
  return data.data;
};

export const addTimetableSlot = async (timetableData: {
  subject: string;
  year_id: string;
  teacher_id: string;
  class_id: string;
  room: string;
  date: string;
  day: string;
  start_time: string;
  end_time: string;
  zoom_link?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/add-timeTable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(timetableData),
  });
  if (!response.ok) throw new Error('Failed to add timetable slot');
  return response.json();
};

export const updateTimetableSlot = async (
  id: string,
  timetableData: {
    subject: string;
    year_id: string;
    teacher_id: string;
    class_id: string;
    room: string;
    date: string;
    day: string;
    start_time: string;
    end_time: string;
    zoom_link?: string;
  }
) => {
  const response = await fetch(`${API_BASE_URL}/update-timeTable/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(timetableData),
  });
  if (!response.ok) throw new Error('Failed to update timetable slot');
  return response.json();
};

export const deleteTimetableSlot = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/delete-timeTable/${id}`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to delete timetable slot');
  return response.json();
};