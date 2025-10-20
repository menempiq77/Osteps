// src/services/announcementApi.ts
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/store/store';

const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchAnnouncements = async () => {
  const response = await fetch(`${API_BASE_URL}/get-announcement`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch announcements');
  const data = await response.json();
  return data.data;
};

export const addAnnouncement = async (announcementData: { name: string }) => {
  const response = await fetch(`${API_BASE_URL}/add-announcement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(announcementData),
  });
  if (!response.ok) throw new Error('Failed to add announcement');
  return response.json();
};

export const updateAnnouncement = async (id: string, announcementData: any) => {
  const response = await fetch(`${API_BASE_URL}/update-announcement/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(announcementData),
  });
  if (!response.ok) throw new Error('Failed to update announcement');
  return response.json();
};

export const deleteAnnouncement = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/delete-announcement/${id}`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to delete announcement');
  return response.json();
};

/** Fetch unseen announcement count */
export const fetchUnseenAnnouncementCount = async () => {
  const response = await fetch(`${API_BASE_URL}/unseen-announcement-count`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch unseen announcement count');
  const data = await response.json();
  return data.data;
};

/** Mark a specific announcement as seen */
export const markAnnouncementAsSeen = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/mark-announcement-seen/${id}`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error(`Failed to mark announcement ${id} as seen`);
  const data = await response.json();
  return data.data;
};