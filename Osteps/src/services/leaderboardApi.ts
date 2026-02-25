import api from "@/services/api";

interface LeaderboardEntry {
  student_id: number;
  student_name: string;
  total_marks: number | null;
  class_name?: string;
}

interface LeaderboardResponse {
  status_code: number;
  msg: string;
  data: LeaderboardEntry[];
}

const normalizePayload = (payload: any): LeaderboardResponse => {
  if (payload && Array.isArray(payload.data)) {
    return payload as LeaderboardResponse;
  }
  if (payload && payload.data && Array.isArray(payload.data.data)) {
    return {
      status_code: payload.status_code ?? 200,
      msg: payload.msg || "LeaderBoard Data Fetched Successfully",
      data: payload.data.data,
    };
  }
  if (payload && Array.isArray(payload.results)) {
    return {
      status_code: payload.status_code ?? 200,
      msg: payload.msg || "LeaderBoard Data Fetched Successfully",
      data: payload.results,
    };
  }
  if (payload && Array.isArray(payload.leaderboard)) {
    return {
      status_code: payload.status_code ?? 200,
      msg: payload.msg || "LeaderBoard Data Fetched Successfully",
      data: payload.leaderboard,
    };
  }
  if (Array.isArray(payload)) {
    return {
      status_code: 200,
      msg: "LeaderBoard Data Fetched Successfully",
      data: payload,
    };
  }
  return {
    status_code: 200,
    msg: payload?.msg || "LeaderBoard Data Fetched Successfully",
    data: [],
  };
};

const fetchWithFallback = async (
  paths: string[],
  errorLabel: string
): Promise<LeaderboardResponse> => {
  const errors: string[] = [];

  for (const path of paths) {
    try {
      const res = await api.get(path);
      return normalizePayload(res.data);
    } catch (error: any) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        "request_failed";
      errors.push(`${path} -> ${status ?? "ERR"} ${message}`);
    }
  }

  throw new Error(`${errorLabel}. Tried: ${errors.join(" | ")}`);
};

export const fetchLeaderBoardData = async (
  classId: string | number
): Promise<LeaderboardResponse> => {
  const id = String(classId);
  return fetchWithFallback(
    [
      `/get-student-scores/${id}`,
    ],
    "Failed to fetch leader Board Scores"
  );
};

export const fetchSchoolLeaderBoardData = async (
  schoolId: string | number
): Promise<LeaderboardResponse> => {
  return fetchWithFallback(
    ["/leaderboard/school-self"],
    "Failed to fetch school leaderboard"
  );
};

export const fetchSchoolSelfLeaderBoardData =
  async (): Promise<LeaderboardResponse> => {
    return fetchWithFallback(
      ["/leaderboard/school-self"],
      "Failed to fetch school self leaderboard"
    );
  };

export const fetchYearLeaderBoardData = async (
  yearId: string | number
): Promise<LeaderboardResponse> => {
  const id = String(yearId);
  return fetchWithFallback([`/leaderboard/year/${id}`], "Failed to fetch year leaderboard");
};
