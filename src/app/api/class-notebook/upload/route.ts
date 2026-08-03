import { NextRequest, NextResponse } from "next/server";
import { mkdir, rename, writeFile } from "fs/promises";
import path from "path";
import { DATA_DIR } from "@/lib/server/dataDir";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);
const STORE_DIR = path.join(DATA_DIR, "class-notebooks");
const LARAVEL_API_BASE =
  process.env.OSTEPS_LARAVEL_API_BASE || "https://dashboard.osteps.com";

const safe = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

export async function POST(request: NextRequest) {
  try {
    const headers: Record<string, string> = { accept: "application/json" };
    const authorization = request.headers.get("authorization");
    const cookie = request.headers.get("cookie");
    if (authorization) headers.authorization = authorization;
    if (cookie) headers.cookie = cookie;
    const identity = await fetch(`${LARAVEL_API_BASE}/api/user`, {
      headers,
      cache: "no-store",
    });
    if (!identity.ok) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    if (!ALLOWED.has(file.type)) return NextResponse.json({ message: "Only PNG, JPG, and WebP images are supported" }, { status: 415 });
    if (file.size > MAX_BYTES) return NextResponse.json({ message: "Image must be 10MB or smaller" }, { status: 413 });
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const name = `${Date.now()}-${Math.random().toString(16).slice(2)}-${safe(file.name || "image")}.${extension}`;
    const relative = path.join("class-notebooks", name);
    const target = path.join(DATA_DIR, relative);
    const temp = `${target}.${process.pid}.tmp`;
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(temp, Buffer.from(await file.arrayBuffer()));
    await rename(temp, target);
    return NextResponse.json({ url: `/api/class-notebook/file/${encodeURIComponent(name)}`, name: file.name, mime: file.type, size: file.size });
  } catch (error) {
    console.error("Class Notebook upload failed:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
