// src/services/notificationsApi.ts
import { API_BASE_URL } from "@/lib/config";
import { store } from "@/store/store";

const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** =========================
 *  Get unread notifications count
 *  GET /api/unread-count
 *  ========================= */
export const fetchUnreadCount = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/unread-count`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  const json = await response.json();
  return json.data.unread_count;
};

/** =========================
 *  Mark all notifications as read
 *  POST /api/mark-all-read
 *  ========================= */
export const markAllNotificationsAsRead = async () => {
  const response = await fetch(`${API_BASE_URL}/mark-all-read`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return response.json();
};

/** =========================
 *  Fetch paginated notifications
 *  GET /api/get-notifications?page=1
 *  ========================= */
export const fetchNotifications = async (page: number = 1) => {
  const response = await fetch(
    `${API_BASE_URL}/get-notifications?page=${page}`,
    {
      headers: getAuthHeader(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const data = await response.json();

  return {
    notifications: data.data.notifications,
    unreadCount: data.data.unread_count,
    pagination: data.data.pagination,
  };
};

/** =========================
 *  Fetch only unread notifications
 *  GET /api/unread-notifications
 *  ========================= */
export const fetchUnreadNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/unread-notifications`, {
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unread notifications");
  }

  const data = await response.json();
  return data.data;
};
