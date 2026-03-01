import api from "@/services/api";
import { withSubjectQuery } from "@/lib/subjectScope";

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
  errorLabel: string,
  subjectId?: number
): Promise<LeaderboardResponse> => {
  const errors: string[] = [];

  for (const path of paths) {
    try {
      const res = await api.get(path, {
        params: withSubjectQuery({}, subjectId),
      });
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
  classId: string | number,
  subjectId?: number
): Promise<LeaderboardResponse> => {
  const id = String(classId);
  const primary = await fetchWithFallback(
    [`/get-student-scores/${id}`],
    "Failed to fetch leader Board Scores",
    subjectId
  );

  if ((primary?.data ?? []).length > 0) {
    return primary;
  }

  // Fallback for backends where class leaderboard endpoint is empty:
  // build a ranking from class students' current points.
  try {
    const res = await api.get(`/get-student/${id}`, {
      params: withSubjectQuery({}, subjectId),
    });
    const students = Array.isArray(res?.data?.data) ? res.data.data : [];
    const mapped = students
      .map((student: any) => {
        const pointsRaw =
          student?.total_marks ??
          student?.total_points ??
          student?.points ??
          student?.score ??
          student?.marks ??
          0;
        const pointsNum = Number(pointsRaw);
        return {
          student_id: student?.id ?? student?.student_id,
          student_name:
            student?.student_name ??
            student?.user_name ??
            student?.name ??
            student?.user?.name ??
            "Unknown",
          total_marks: Number.isFinite(pointsNum) ? pointsNum : 0,
          class_name: student?.class_name ?? student?.class?.class_name ?? "",
        } as LeaderboardEntry;
      })
      .filter((student: LeaderboardEntry) => !!student.student_id)
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => (b.total_marks ?? 0) - (a.total_marks ?? 0));

    return {
      status_code: 200,
      msg: "LeaderBoard Data Fetched Successfully",
      data: mapped,
    };
  } catch {
    return primary;
  }
};

export const fetchSchoolLeaderBoardData = async (
  schoolId: string | number,
  subjectId?: number
): Promise<LeaderboardResponse> => {
  return fetchWithFallback(
    ["/leaderboard/school-self"],
    "Failed to fetch school leaderboard",
    subjectId
  );
};

export const fetchSchoolSelfLeaderBoardData =
  async (subjectId?: number): Promise<LeaderboardResponse> => {
    return fetchWithFallback(
      ["/leaderboard/school-self"],
      "Failed to fetch school self leaderboard",
      subjectId
    );
  };

export const fetchYearLeaderBoardData = async (
  yearId: string | number,
  subjectId?: number
): Promise<LeaderboardResponse> => {
  const id = String(yearId);
  return fetchWithFallback([`/leaderboard/year/${id}`], "Failed to fetch year leaderboard", subjectId);
};
