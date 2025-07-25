// src/services/leaderboardApi.ts
import { API_BASE_URL } from '@/lib/config';
import { store } from '@/store/store';

interface LeaderboardEntry {
  student_id: number;
  student_name: string;
  total_marks: number | null;
}

interface LeaderboardResponse {
  status_code: number;
  msg: string;
  data: LeaderboardEntry[];
}

const getAuthHeader = (): Record<string, string> => {
  const token = store.getState().auth.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchLeaderBoardData = async (): Promise<LeaderboardResponse> => {
  const response = await fetch(`${API_BASE_URL}/get-student-scores`, {
    headers: getAuthHeader(),
  });
  if (!response.ok) throw new Error('Failed to fetch leader Board Scores');
  return await response.json();
};