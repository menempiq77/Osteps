// src/services/schoolNotificationsApi.ts
import { createApiClient } from "@/lib/apiClient";

const api = createApiClient();

export interface SchoolNotificationItem {
  id: number;
  type: string;
  title: string;
  message: string | null;
  url: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string | null;
  time_ago: string | null;
}

export const fetchSchoolNotifications = async (): Promise<{
  notifications: SchoolNotificationItem[];
  unread_count: number;
}> => {
  const res = await api.get(`/school-notifications`);
  return res.data.data;
};

export const fetchSchoolUnreadCount = async (): Promise<number> => {
  const res = await api.get(`/school-notifications/unread-count`);
  return res.data?.data?.unread_count ?? 0;
};

export const markAllSchoolNotificationsRead = async () => {
  const res = await api.post(`/school-notifications/mark-all-read`);
  return res.data;
};

export const markSchoolNotificationRead = async (id: number) => {
  const res = await api.post(`/school-notifications/${id}/read`);
  return res.data;
};
