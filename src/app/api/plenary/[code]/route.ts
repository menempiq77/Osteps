import { NextRequest, NextResponse } from "next/server";

interface PlenaryComment {
  id: string;
  name: string;
  comment: string;
  createdAt: number;
}

const plenaryStore = new Map<string, PlenaryComment[]>();

if (typeof globalThis !== "undefined") {
  const g = globalThis as Record<string, unknown>;
  if (!g.__plenarySyncCleanup) {
    g.__plenarySyncCleanup = true;
    setInterval(() => {
      const now = Date.now();
      for (const [key, comments] of plenaryStore) {
        if (comments.length > 0 && now - comments[0].createdAt > 86_400_000) {
          plenaryStore.delete(key);
        }
      }
    }, 3_600_000);
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const comments = plenaryStore.get(code) ?? [];
  return NextResponse.json({ comments });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const body = await req.json();
  const { name, comment } = body;
  if (!name || !comment) {
    return NextResponse.json({ error: "Name and comment are required" }, { status: 400 });
  }
  const entry: PlenaryComment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: String(name).slice(0, 50),
    comment: String(comment).slice(0, 500),
    createdAt: Date.now(),
  };
  const existing = plenaryStore.get(code) ?? [];
  existing.push(entry);
  plenaryStore.set(code, existing);
  return NextResponse.json({ ok: true, entry });
}
