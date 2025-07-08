// src/services/termsApi.ts
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/store/store';

const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchTerm = async (classId: number) => {
  const response = await fetch(`${API_BASE_URL}/get-term/${classId}`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch terms');
  const data = await response.json();
  return data.data;
};

export const addTerm = async (classId: number, termData: { name: string }) => {
  const response = await fetch(`${API_BASE_URL}/add-term`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ ...termData, class_id: classId }),
  });
  if (!response.ok) throw new Error('Failed to add term');
  return response.json();
};

export const updateTerm = async (id: number, classId: number, termData: { name: string }) => {
  const response = await fetch(`${API_BASE_URL}/update-term/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ ...termData, class_id: classId }),
  });
  if (!response.ok) throw new Error('Failed to update term');
  return response.json();
};

export const deleteTerm = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/delete-term/${id}`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to delete term');
  return response.json();
};