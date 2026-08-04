import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { getDbPool } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LARAVEL_API_BASE =
  process.env.OSTEPS_LARAVEL_API_BASE || "https://dashboard.osteps.com";

const VALID_DAYS = new Set([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

type SchoolPeriod = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  isTeaching: boolean;
};

type TimetableSettings = {
  schoolDays: string[];
  periods: SchoolPeriod[];
  dayOverrides: Record<string, SchoolPeriod[]>;
  pattern: {
    mode: "single" | "ab";
    anchor: string;
  };
};

type AuthenticatedUser = {
  id?: number | string;
  role?: string;
};

type SchoolRow = RowDataPacket & {
  school_id: number | string;
};

const getAuthHeaders = (request: NextRequest): Record<string, string> => {
  const authorization = request.headers.get("authorization");
  if (!authorization) return {};
  return { authorization };
};

const getAuthenticatedUser = async (
  request: NextRequest
): Promise<AuthenticatedUser | null> => {
  const headers = getAuthHeaders(request);
  if (!headers.authorization) return null;

  const response = await fetch(`${LARAVEL_API_BASE}/api/user`, {
    headers: {
      ...headers,
      accept: "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const user = (await response.json()) as AuthenticatedUser;
  return user && typeof user === "object" ? user : null;
};

const resolveSchoolId = async (
  user: AuthenticatedUser
): Promise<number | null> => {
  const userId = Number(user.id);
  if (!Number.isInteger(userId) || userId <= 0) return null;

  const role = String(user.role || "").trim().toUpperCase();
  const table =
    role === "SCHOOL_ADMIN"
      ? "schools"
      : role === "TEACHER" || role === "HOD"
        ? "teachers"
        : role === "STUDENT"
          ? "students"
          : null;
  if (!table) return null;

  const [rows] = await getDbPool().execute<SchoolRow[]>(
    `SELECT ${table === "schools" ? "id" : "school_id"} AS school_id
     FROM ${table}
     WHERE user_id = ?
     LIMIT 1`,
    [userId]
  );
  const schoolId = Number(rows?.[0]?.school_id);
  return Number.isInteger(schoolId) && schoolId > 0 ? schoolId : null;
};

const ensureTable = async (): Promise<void> => {
  await getDbPool().execute(`
    CREATE TABLE IF NOT EXISTS timetable_settings (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      school_id BIGINT UNSIGNED NOT NULL,
      school_days JSON NOT NULL,
      periods JSON NOT NULL,
      day_overrides JSON NOT NULL,
      pattern JSON NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY timetable_settings_school_id_unique (school_id)
    )
  `);
};

const parseJson = <T>(value: unknown): T | null => {
  if (!value) return null;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const isPeriod = (value: unknown): value is SchoolPeriod => {
  if (!value || typeof value !== "object") return false;
  const period = value as Partial<SchoolPeriod>;
  return (
    typeof period.id === "string" &&
    typeof period.label === "string" &&
    typeof period.startTime === "string" &&
    typeof period.endTime === "string" &&
    typeof period.isTeaching === "boolean"
  );
};

const normalizeSettings = (value: unknown): TimetableSettings | null => {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<TimetableSettings>;
  const schoolDays = Array.isArray(input.schoolDays)
    ? input.schoolDays.filter(
        (day): day is string =>
          typeof day === "string" && VALID_DAYS.has(day)
      )
    : [];
  const periods = Array.isArray(input.periods)
    ? input.periods.filter(isPeriod)
    : [];
  const dayOverrides: Record<string, SchoolPeriod[]> = {};
  if (input.dayOverrides && typeof input.dayOverrides === "object") {
    for (const [day, list] of Object.entries(input.dayOverrides)) {
      if (VALID_DAYS.has(day) && Array.isArray(list)) {
        const validPeriods = list.filter(isPeriod);
        if (validPeriods.length > 0) dayOverrides[day] = validPeriods;
      }
    }
  }
  const pattern = input.pattern;
  if (
    schoolDays.length === 0 ||
    periods.length === 0 ||
    !pattern ||
    (pattern.mode !== "single" && pattern.mode !== "ab") ||
    typeof pattern.anchor !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(pattern.anchor)
  ) {
    return null;
  }

  return {
    schoolDays: Array.from(new Set(schoolDays)),
    periods,
    dayOverrides,
    pattern: {
      mode: pattern.mode,
      anchor: pattern.anchor,
    },
  };
};

const settingsFromRow = (row: {
  school_days: unknown;
  periods: unknown;
  day_overrides: unknown;
  pattern: unknown;
}): TimetableSettings | null =>
  normalizeSettings({
    schoolDays: parseJson<string[]>(row.school_days),
    periods: parseJson<SchoolPeriod[]>(row.periods),
    dayOverrides: parseJson<Record<string, SchoolPeriod[]>>(row.day_overrides),
    pattern: parseJson<TimetableSettings["pattern"]>(row.pattern),
  });

const json = (value: unknown) => JSON.stringify(value);

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const schoolId = await resolveSchoolId(user);
    if (!schoolId) {
      return NextResponse.json(
        { message: "Could not resolve the authenticated user's school" },
        { status: 403 }
      );
    }

    await ensureTable();
    const [rows] = await getDbPool().execute<
      Array<RowDataPacket & {
        school_days: unknown;
        periods: unknown;
        day_overrides: unknown;
        pattern: unknown;
      }>
    >(
      `SELECT school_days, periods, day_overrides, pattern
       FROM timetable_settings
       WHERE school_id = ?
       LIMIT 1`,
      [schoolId]
    );
    const settings = rows?.[0] ? settingsFromRow(rows[0]) : null;
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to load timetable settings:", error);
    return NextResponse.json(
      { message: "Failed to load timetable settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const schoolId = await resolveSchoolId(user);
    if (!schoolId) {
      return NextResponse.json(
        { message: "Could not resolve the authenticated user's school" },
        { status: 403 }
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }
    const settings = normalizeSettings(payload);
    if (!settings) {
      return NextResponse.json(
        { message: "Invalid timetable settings payload" },
        { status: 400 }
      );
    }

    await ensureTable();
    await getDbPool().execute(
      `INSERT INTO timetable_settings
        (school_id, school_days, periods, day_overrides, pattern)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         school_days = VALUES(school_days),
         periods = VALUES(periods),
         day_overrides = VALUES(day_overrides),
         pattern = VALUES(pattern),
         updated_at = CURRENT_TIMESTAMP`,
      [
        schoolId,
        json(settings.schoolDays),
        json(settings.periods),
        json(settings.dayOverrides),
        json(settings.pattern),
      ]
    );

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to save timetable settings:", error);
    return NextResponse.json(
      { message: "Failed to save timetable settings" },
      { status: 500 }
    );
  }
}
