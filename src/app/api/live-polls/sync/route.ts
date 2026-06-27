import { NextRequest, NextResponse } from "next/server";

const presenterState = new Map<
  string,
  { questionIndex: number; mode: "presenter_led" | "self_paced"; updatedAt: number }
>();

if (typeof globalThis !== "undefined") {
  const g = globalThis as Record<string, unknown>;
  if (!g.__pollSyncCleanup) {
    g.__pollSyncCleanup = true;
    setInterval(() => {
      const now = Date.now();
      for (const [key, val] of presenterState) {
        if (now - val.updatedAt > 3_600_000) presenterState.delete(key);
      }
    }, 600_000);
  }
}

export async function GET(req: NextRequest) {
  const pollId = req.nextUrl.searchParams.get("pollId");
  if (!pollId) return NextResponse.json({ error: "Missing pollId" }, { status: 400 });
  const state = presenterState.get(pollId);
  return NextResponse.json(state ?? { questionIndex: 0, mode: "self_paced" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pollId, questionIndex, mode } = body;
  if (!pollId) return NextResponse.json({ error: "Missing pollId" }, { status: 400 });
  presenterState.set(String(pollId), {
    questionIndex: questionIndex ?? 0,
    mode: mode ?? "presenter_led",
    updatedAt: Date.now(),
  });
  return NextResponse.json({ ok: true });
}
