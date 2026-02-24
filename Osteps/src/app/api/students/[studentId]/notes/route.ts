import { NextRequest, NextResponse } from "next/server";
import { getNote, setNote } from "@/lib/server/studentNotesRepo";

type Ctx = { params: Promise<{ studentId: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { studentId } = await ctx.params;
  const auth = req.headers.get("authorization") || undefined;
  const note = await getNote(studentId, auth);
  return NextResponse.json({ studentId, note });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { studentId } = await ctx.params;
  const auth = req.headers.get("authorization") || undefined;
  const body = await req.json().catch(() => ({}));
  const note = String(body?.note ?? "");
  await setNote(studentId, note, auth);
  return NextResponse.json({ studentId, note });
}
