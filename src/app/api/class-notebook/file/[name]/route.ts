import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { DATA_DIR } from "@/lib/server/dataDir";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const mimeByExtension: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};
const LARAVEL_API_BASE =
  process.env.OSTEPS_LARAVEL_API_BASE || "https://dashboard.osteps.com";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const headers: Record<string, string> = { accept: "application/json" };
  const authorization = _request.headers.get("authorization");
  const cookie = _request.headers.get("cookie");
  if (authorization) headers.authorization = authorization;
  if (cookie) headers.cookie = cookie;
  const identity = await fetch(`${LARAVEL_API_BASE}/api/user`, {
    headers,
    cache: "no-store",
  });
  if (!identity.ok) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  const { name } = await params;
  const safeName = String(name || "").replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(DATA_DIR, "class-notebooks", safeName);
  try {
    const body = await readFile(filePath);
    const type = mimeByExtension[path.extname(safeName).toLowerCase()] || "application/octet-stream";
    return new NextResponse(body, { headers: { "Content-Type": type, "Cache-Control": "private, max-age=31536000, immutable" } });
  } catch {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }
}
