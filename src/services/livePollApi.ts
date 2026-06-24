import api from "./api";

export interface LivePoll {
  id: number;
  school_id: number;
  created_by: number;
  title: string;
  description: string | null;
  join_code: string;
  status: "draft" | "active" | "closed";
  allow_anonymous: boolean;
  created_at: string;
  updated_at: string;
  questions_count?: number;
  responses_count?: number;
}

export interface PollQuestion {
  id: number;
  poll_id: number;
  type: "multiple_choice" | "word_cloud" | "open_text" | "rating";
  question_text: string;
  options: string[] | null;
  sort_order: number;
  time_limit: number | null;
}

export interface QuestionResult extends PollQuestion {
  total_responses: number;
  results: Record<string, number> | string[] | { average: number; distribution: Record<string, number> };
}

export interface PollResults {
  poll: LivePoll;
  questions: QuestionResult[];
  total_participants: number;
}

export const fetchPolls = async (): Promise<LivePoll[]> => {
  const response = await api.get("/live-polls");
  return response.data?.data ?? [];
};

export const fetchPoll = async (id: number): Promise<LivePoll & { questions: PollQuestion[] }> => {
  const response = await api.get(`/live-polls/${id}`);
  return response.data?.data;
};

export const createPoll = async (data: {
  title: string;
  description?: string;
  allow_anonymous?: boolean;
}): Promise<{ id: number; join_code: string }> => {
  const response = await api.post("/live-polls", data);
  return response.data?.data;
};

export const updatePoll = async (
  id: number,
  data: Partial<{ title: string; description: string; status: string; allow_anonymous: boolean }>
): Promise<void> => {
  await api.put(`/live-polls/${id}`, data);
};

export const deletePoll = async (id: number): Promise<void> => {
  await api.delete(`/live-polls/${id}`);
};

export const addQuestion = async (
  pollId: number,
  data: { type: string; question_text: string; options?: string[]; time_limit?: number }
): Promise<{ id: number }> => {
  const response = await api.post(`/live-polls/${pollId}/questions`, data);
  return response.data?.data;
};

export const updateQuestion = async (
  pollId: number,
  questionId: number,
  data: Partial<{ question_text: string; type: string; options: string[]; time_limit: number; sort_order: number }>
): Promise<void> => {
  await api.put(`/live-polls/${pollId}/questions/${questionId}`, data);
};

export const deleteQuestion = async (pollId: number, questionId: number): Promise<void> => {
  await api.delete(`/live-polls/${pollId}/questions/${questionId}`);
};

export const submitResponse = async (
  pollId: number,
  questionId: number,
  data: { answer: string; participant_name?: string }
): Promise<void> => {
  await api.post(`/live-polls/${pollId}/questions/${questionId}/respond`, data);
};

export const fetchResults = async (id: number): Promise<PollResults> => {
  const response = await api.get(`/live-polls/${id}/results`);
  return response.data?.data;
};

export const joinPollByCode = async (
  code: string
): Promise<LivePoll & { questions: PollQuestion[] }> => {
  const response = await api.post("/live-polls/join", { code });
  return response.data?.data;
};
