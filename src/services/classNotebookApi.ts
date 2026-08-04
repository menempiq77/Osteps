import { getAuthHeader } from "@/lib/apiClient";
import type {
  NotebookAnnotation,
  NotebookBackground,
  NotebookClassResponse,
  NotebookPageResponse,
} from "@/lib/classNotebook";

const request = async (url: string, init?: RequestInit) => {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...getAuthHeader(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || "Class Notebook request failed.");
  }
  return payload;
};

const queryString = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && String(value).trim()) query.set(key, String(value));
  });
  return query.toString();
};

export const fetchNotebookClass = async (params: {
  subjectId: number;
  subjectClassId: number;
  classId?: number;
}): Promise<NotebookClassResponse> =>
  request(`/api/class-notebook?${queryString({ ...params, view: "class" })}`);

export const fetchNotebook = async (params: {
  subjectId: number;
  subjectClassId: number;
  classId?: number;
  studentId?: string | number;
}): Promise<NotebookPageResponse> =>
  request(`/api/class-notebook?${queryString(params)}`);

export const createNotebookPage = async (params: {
  subjectId: number;
  subjectClassId: number;
  classId: number;
  studentId?: string | number;
  allStudents?: boolean;
  title?: string;
  background?: NotebookBackground;
}) =>
  request("/api/class-notebook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create_page", ...params }),
  });

export const saveNotebookPage = async (params: {
  pageId: number;
  studentAnnotations?: NotebookAnnotation[];
  teacherAnnotations?: NotebookAnnotation[];
  background?: NotebookBackground;
  title?: string;
}) =>
  request("/api/class-notebook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "save_page", ...params }),
  });

export const deleteNotebookPage = async (pageId: number) =>
  request("/api/class-notebook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete_page", pageId }),
  });

export const reorderNotebookPages = async (notebookId: number, pageIds: number[]) =>
  request("/api/class-notebook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reorder_pages", notebookId, pageIds }),
  });

export const uploadNotebookImage = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return request("/api/class-notebook/upload", { method: "POST", body: form });
};
