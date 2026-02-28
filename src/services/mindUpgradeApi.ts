import axios from "axios";
import { store } from "@/store/store";
import { API_BASE_URL } from "@/lib/config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type MindCourseKey = "aqeedah" | "stories_of_the_prophets";

export type MindCourseCatalogItem = {
  course_key: MindCourseKey | string;
  title: string;
  description: string;
  route_path: string;
};

export type MindAssignmentRow = {
  id: number;
  course_key: string;
  class_id?: number | null;
  class_name?: string;
  student_id?: number | null;
  student_name?: string;
  year_id?: number;
  year_name?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
};

export type StudentMindAssignment = {
  course_key: string;
  is_assigned_now: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  status: "active" | "upcoming" | "expired" | "unassigned";
};

type PendingProgressEvent =
  | {
      type: "quiz";
      payload: {
        course_key: string;
        unit_key: string;
        score: number;
        total: number;
      };
    }
  | {
      type: "minigame";
      payload: {
        course_key: string;
        unit_key: string;
        xp: number;
      };
    };

const PENDING_KEY = "mind_upgrade_pending_progress_v1";

function readPending(): PendingProgressEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePending(events: PendingProgressEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

function queuePending(event: PendingProgressEvent) {
  const existing = readPending();
  existing.push(event);
  writePending(existing);
}

export async function flushPendingMindProgressEvents() {
  const pending = readPending();
  if (pending.length === 0) return;

  const failed: PendingProgressEvent[] = [];
  for (const event of pending) {
    try {
      if (event.type === "quiz") {
        await api.post("/mind-upgrade/progress/quiz-complete", event.payload);
      } else {
        await api.post("/mind-upgrade/progress/minigame-complete", event.payload);
      }
    } catch {
      failed.push(event);
    }
  }
  writePending(failed);
}

export function inferCourseKeyFromSlug(slug: string): MindCourseKey {
  return slug.startsWith("aqeedah-") ? "aqeedah" : "stories_of_the_prophets";
}

export const fallbackMindCatalog: MindCourseCatalogItem[] = [
  {
    course_key: "aqeedah",
    title: "Aqeedah",
    description: "Learn core beliefs of Islam in a clear and structured way.",
    route_path: "/dashboard/mind-upgrade/aqeedah",
  },
  {
    course_key: "stories_of_the_prophets",
    title: "Stories of the Prophets",
    description: "Explore prophetic stories and lessons for daily character.",
    route_path: "/dashboard/mind-upgrade/stories-of-the-prophets",
  },
];

export async function fetchMindUpgradeCatalog(): Promise<MindCourseCatalogItem[]> {
  try {
    const response = await api.get("/mind-upgrade/catalog");
    const data = response?.data?.data ?? response?.data ?? [];
    if (Array.isArray(data) && data.length > 0) return data;
    return fallbackMindCatalog;
  } catch {
    return fallbackMindCatalog;
  }
}

export async function assignMindUpgradeCourses(payload: {
  course_key: string;
  class_ids?: number[];
  student_ids?: number[];
  year_ids?: number[];
  assign_all_classes?: boolean;
  assign_all_students?: boolean;
  starts_at?: string;
  ends_at?: string;
}) {
  const response = await api.post("/mind-upgrade/assignments", payload);
  return response?.data?.data ?? response?.data;
}

export async function fetchManageAssignments(filters?: {
  course_key?: string;
  year_id?: string | number;
  class_id?: string | number;
  active_only?: boolean;
}): Promise<MindAssignmentRow[]> {
  const response = await api.get("/mind-upgrade/assignments/manage", {
    params: filters,
  });
  const data = response?.data?.data ?? response?.data ?? [];
  return Array.isArray(data) ? data : [];
}

export async function unassignMindUpgrade(id: number | string) {
  const response = await api.delete(`/mind-upgrade/assignments/${id}`);
  return response?.data?.data ?? response?.data;
}

export async function fetchStudentMindAssignments(): Promise<StudentMindAssignment[]> {
  const response = await api.get("/mind-upgrade/assignments/my");
  const data = response?.data?.data ?? response?.data ?? [];
  return Array.isArray(data) ? data : [];
}

export async function submitMindQuizCompletion(payload: {
  course_key: string;
  unit_key: string;
  score: number;
  total: number;
}) {
  try {
    await flushPendingMindProgressEvents();
    const response = await api.post("/mind-upgrade/progress/quiz-complete", payload);
    return response?.data?.data ?? response?.data;
  } catch (error) {
    queuePending({ type: "quiz", payload });
    throw error;
  }
}

export async function submitMindMiniGameCompletion(payload: {
  course_key: string;
  unit_key: string;
  xp: number;
}) {
  try {
    await flushPendingMindProgressEvents();
    const response = await api.post("/mind-upgrade/progress/minigame-complete", payload);
    return response?.data?.data ?? response?.data;
  } catch (error) {
    queuePending({ type: "minigame", payload });
    throw error;
  }
}

export async function fetchStudentMindPoints(studentId: string | number): Promise<{
  mind_points: number;
  tracker_points?: number;
  total_points?: number;
}> {
  const response = await api.get(`/mind-upgrade/points/student/${studentId}`);
  const data = response?.data?.data ?? response?.data ?? {};
  return {
    mind_points: Number(data?.mind_points ?? 0),
    tracker_points:
      data?.tracker_points !== undefined ? Number(data.tracker_points) : undefined,
    total_points:
      data?.total_points !== undefined ? Number(data.total_points) : undefined,
  };
}
