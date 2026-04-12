// src/services/timetableApi.ts
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/store/store';
import { withSubjectPayload, withSubjectQuery } from '@/lib/subjectScope';

type TimetableSubjectScope = number | 'all' | undefined;

const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const resolveTimetableQuery = (subjectScope?: TimetableSubjectScope): { subject_id?: number } => {
  if (subjectScope === 'all') return {};
  if (typeof subjectScope === 'number' && Number.isFinite(subjectScope) && subjectScope > 0) {
    return { subject_id: subjectScope };
  }
  return withSubjectQuery({});
};

const withTimetableSubjectPayload = <T extends Record<string, unknown>>(
  payload: T,
  subjectScope?: TimetableSubjectScope
): T & { subject_id?: number } => {
  if (subjectScope === 'all') return payload;
  if (typeof subjectScope === 'number' && Number.isFinite(subjectScope) && subjectScope > 0) {
    return {
      ...payload,
      subject_id: subjectScope,
    };
  }
  return withSubjectPayload(payload as any);
};

export const fetchTimetableData = async (subjectScope?: TimetableSubjectScope) => {
  const params = new URLSearchParams();
  const scoped = resolveTimetableQuery(subjectScope);
  if (typeof scoped.subject_id === 'number') {
    params.set('subject_id', String(scoped.subject_id));
  }
  const response = await fetch(
    `${API_BASE_URL}/get-timeTable${params.toString() ? `?${params.toString()}` : ''}`,
    {
      headers: getAuthHeader(),
    }
  );
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
  school_id?: string | number;
}, subjectScope?: TimetableSubjectScope) => {
  const response = await fetch(`${API_BASE_URL}/add-timeTable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(withTimetableSubjectPayload(timetableData as any, subjectScope)),
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
    school_id?: string | number;
  },
  subjectScope?: TimetableSubjectScope
) => {
  const response = await fetch(`${API_BASE_URL}/update-timeTable/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(withTimetableSubjectPayload(timetableData as any, subjectScope)),
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
