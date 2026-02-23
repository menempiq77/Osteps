import { getStudentNote, setStudentNote } from "@/lib/server/studentNotesStore";

const mode = (process.env.STUDENT_NOTES_MODE || "file").toLowerCase();
const laravelBaseUrl = process.env.STUDENT_NOTES_LARAVEL_BASE_URL || "";
const laravelPathTemplate =
  process.env.STUDENT_NOTES_LARAVEL_PATH_TEMPLATE || "/students/{id}/notes";

function buildLaravelUrl(studentId: string): string {
  const path = laravelPathTemplate.replace("{id}", encodeURIComponent(studentId));
  return `${laravelBaseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

function extractNoteFromResponse(payload: any): string {
  if (!payload || typeof payload !== "object") return "";
  if (typeof payload.note === "string") return payload.note;
  if (payload.data && typeof payload.data.note === "string") return payload.data.note;
  return "";
}

export async function getNote(studentId: string, authHeader?: string): Promise<string> {
  if (mode !== "laravel" || !laravelBaseUrl) {
    return getStudentNote(studentId);
  }

  const res = await fetch(buildLaravelUrl(studentId), {
    method: "GET",
    headers: authHeader ? { Authorization: authHeader } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Laravel note GET failed (${res.status})`);
  }

  const body = await res.json().catch(() => ({}));
  return extractNoteFromResponse(body);
}

export async function setNote(
  studentId: string,
  note: string,
  authHeader?: string
): Promise<void> {
  if (mode !== "laravel" || !laravelBaseUrl) {
    await setStudentNote(studentId, note);
    return;
  }

  const res = await fetch(buildLaravelUrl(studentId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify({ note }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Laravel note PUT failed (${res.status})`);
  }
}

