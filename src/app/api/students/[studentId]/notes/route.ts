import { NextRequest, NextResponse } from "next/server";
import { getNote, setNote } from "@/lib/server/studentNotesRepo";

type Ctx = { params: Promise<{ studentId: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { studentId } = await ctx.params;
  const auth = req.headers.get("authorization") || undefined;
  if ((process.env.STUDENT_NOTES_STORAGE || process.env.STUDENT_NOTES_MODE || "file").toLowerCase() === "laravel") {
    const base = (process.env.STUDENT_NOTES_LARAVEL_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    const target = `${base}/students/${encodeURIComponent(studentId)}/notes`;
    const response = await fetch(target, { headers: auth ? { Authorization: auth } : undefined, cache: "no-store" });
    return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  }
  const note = await getNote(studentId, auth);
  return NextResponse.json({ studentId, note });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { studentId } = await ctx.params;
  const auth = req.headers.get("authorization") || undefined;
  const body = await req.json().catch(() => ({}));
  const note = String(body?.note ?? "");
  if ((process.env.STUDENT_NOTES_STORAGE || process.env.STUDENT_NOTES_MODE || "file").toLowerCase() === "laravel") {
    const base = (process.env.STUDENT_NOTES_LARAVEL_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    const target = `${base}/students/${encodeURIComponent(studentId)}/notes`;
    const response = await fetch(target, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
      body: JSON.stringify({ note }),
      cache: "no-store",
    });
    return NextResponse.json(await response.json().catch(() => ({ studentId, note })), { status: response.status });
  }
  await setNote(studentId, note, auth);
  return NextResponse.json({ studentId, note });
}
