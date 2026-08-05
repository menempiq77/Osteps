import api from "@/services/api";
import { withSubjectQuery } from "@/lib/subjectScope";

interface LeaderboardEntry {
  student_id: number;
  student_name: string;
  total_marks: number | null;
  tracker_points?: number | string | null;
  mind_points?: number | string | null;
  coin_balance?: number | string | null;
  coins?: number | string | null;
  wallet_balance?: number | string | null;
  class_name?: string;
}

interface LeaderboardResponse {
  status_code: number;
  msg: string;
  data: LeaderboardEntry[];
}



type LR = Record<string, unknown>;

const normalizePayload = (payload: unknown): LeaderboardResponse => {
  const body = payload as LR | null | undefined;
  const nestedData = body?.data as LR | unknown[] | undefined;

  if (body && Array.isArray(body.data)) {
    return body as unknown as LeaderboardResponse;
  }
  if (body && nestedData && !Array.isArray(nestedData) && Array.isArray((nestedData as LR).data)) {
    return {
      status_code: Number(body.status_code ?? 200),
      msg: String(body.msg || "LeaderBoard Data Fetched Successfully"),
      data: (nestedData as LR).data as LeaderboardEntry[],
    };
  }
  if (body && Array.isArray(body.results)) {
    return {
      status_code: Number(body.status_code ?? 200),
      msg: String(body.msg || "LeaderBoard Data Fetched Successfully"),
      data: body.results as LeaderboardEntry[],
    };
  }
  if (body && Array.isArray(body.leaderboard)) {
    return {
      status_code: Number(body.status_code ?? 200),
      msg: String(body.msg || "LeaderBoard Data Fetched Successfully"),
      data: body.leaderboard as LeaderboardEntry[],
    };
  }
  if (Array.isArray(body)) {
    return {
      status_code: 200,
      msg: "LeaderBoard Data Fetched Successfully",
      data: body as unknown as LeaderboardEntry[],
    };
  }
  return {
    status_code: 200,
    msg: String(body?.msg || "LeaderBoard Data Fetched Successfully"),
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
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: LR };
        message?: string;
      };
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "request_failed";
      errors.push(`${path} -> ${status ?? "ERR"} ${message}`);
    }
  }

  throw new Error(`${errorLabel}. Tried: ${errors.join(" | ")}`);
};

const buildClassLeaderboardFromSchoolData = async (
  classId: string,
  subjectId?: number
): Promise<LeaderboardResponse> => {
  // Roster call uses subject_id to get only students enrolled in that subject.
  // School-self call is NOT filtered by subject_id — scores are not per-subject,
  // so passing subject_id may return 0. We intersect unfiltered scores with the
  // filtered roster to produce a subject-scoped leaderboard.
  const [classStudentsRes, schoolRes] = await Promise.all([
    api.get(`/get-student/${classId}`, {
      params: withSubjectQuery({}, subjectId),
    }),
    api.get("/leaderboard/school-self"),
  ]);

  const classStudents = Array.isArray(classStudentsRes?.data?.data)
    ? classStudentsRes.data.data
    : [];
  const schoolLeaderboard = normalizePayload(schoolRes?.data).data ?? [];

  const classStudentIds = new Set(
    classStudents
      .map((student: LR) => student?.id ?? student?.student_id)
      .filter((id: unknown) => id !== null && id !== undefined)
      .map((id: unknown) => Number(id))
      .filter((id: number) => Number.isFinite(id))
  );

  const classStudentNameMap: Record<number, string> = {};
  for (const student of classStudents as LR[]) {
    const sid = Number(student?.id ?? student?.student_id);
    if (!Number.isFinite(sid)) continue;
    const user = student?.user as LR | undefined;
    const resolvedName = String(
      student?.student_name ??
        student?.user_name ??
        student?.name ??
        user?.name ??
        ""
    );
    if (resolvedName) classStudentNameMap[sid] = resolvedName;
  }

  const filtered = (schoolLeaderboard as unknown as LR[])
    .filter((entry: LR) => classStudentIds.has(Number(entry?.student_id)))
    .map((entry: LR) => {
      const sid = Number(entry?.student_id);
      return {
        ...entry,
        student_name: classStudentNameMap[sid] || entry?.student_name || "Unknown",
      };
    })
    .sort((a: LR, b: LR) => Number(b?.total_marks ?? 0) - Number(a?.total_marks ?? 0)) as unknown as LeaderboardEntry[];

  return {
    status_code: 200,
    msg: "LeaderBoard Data Fetched Successfully",
    data: filtered,
  };
};

export const fetchLeaderBoardData = async (
  classId: string | number,
  subjectId?: number
): Promise<LeaderboardResponse> => {
  const id = String(classId);

  let primary: LeaderboardResponse | null = null;
  let primaryError: Error | null = null;

  try {
    primary = await fetchWithFallback(
      [`/get-student-scores/${id}`],
      "Failed to fetch leader Board Scores",
      subjectId
    );
  } catch (error: unknown) {
    primaryError = error instanceof Error ? error : new Error(String(error));
  }

  if (primary && primary.data.length > 0) {
    return primary;
  }

  // Fallback for backends where class leaderboard endpoint is broken:
  // build class leaderboard by filtering school leaderboard using class roster.
  // /get-student/{classId}?subject_id=X returns only subject-enrolled students,
  // so the intersection with school-self correctly scopes to that subject.
  try {
    const fromSchoolLeaderboard = await buildClassLeaderboardFromSchoolData(id, subjectId);
    if ((fromSchoolLeaderboard?.data ?? []).length > 0) {
      return fromSchoolLeaderboard;
    }
  } catch {
    // continue to next fallback
  }

  // Fallback for backends where class leaderboard endpoint is empty:
  // build a ranking from class students' current points.
  try {
    const res = await api.get(`/get-student/${id}`, {
      params: withSubjectQuery({}, subjectId),
    });
    const students = Array.isArray(res?.data?.data) ? res.data.data : [];
    const mapped = students
      .map((student: LR) => {
        const pointsRaw =
          student?.total_marks ??
          student?.total_points ??
          student?.points ??
          student?.score ??
          student?.marks ??
          0;
        const pointsNum = Number(pointsRaw);
        const user = student?.user as LR | undefined;
        const studentClass = student?.class as LR | undefined;
        return {
          student_id: student?.id ?? student?.student_id,
          student_name:
            student?.student_name ??
            student?.user_name ??
            student?.name ??
            user?.name ??
            "Unknown",
          total_marks: Number.isFinite(pointsNum) ? pointsNum : 0,
          class_name: student?.class_name ?? studentClass?.class_name ?? "",
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
    if (primary) return primary;
    throw (
      primaryError ?? new Error("Failed to fetch leader Board Scores and fallbacks failed")
    );
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
