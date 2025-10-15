// src/services/materialApi.ts
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/store/store';

const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all materials
export const fetchMaterials = async () => {
  const response = await fetch(`${API_BASE_URL}/get-material`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch materials');
  const data = await response.json();
  return data.data;
};

// Fetch all materials
export const fetchStudentMaterials = async () => {
  const response = await fetch(`${API_BASE_URL}/get-student-material`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch materials');
  const data = await response.json();
  return data.data;
};

// Add material
export const addMaterial = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/add-material`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to add material');
  return response.json();
};

// Update material
export const updateMaterial = async (id: number, formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/update-material/${id}`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to update material');
  return response.json();
};

// Delete material
export const deleteMaterial = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/delete-material/${id}`, {
    method: 'delete',
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to delete material');
  return response.json();
};
