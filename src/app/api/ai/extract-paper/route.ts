import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";

export const runtime = "nodejs";
export const maxDuration = 20;

const LARAVEL_PUBLIC_DIR = process.env.OSTEPS_LARAVEL_PUBLIC_DIR || "/var/www/laravel/public";
const execFileAsync = promisify(execFile);

const resolveLocalPaperPath = (normalizedUrl: string): string | null => {
  if (!normalizedUrl) return null;
  try {
    const u = new URL(normalizedUrl);
    if (!new Set(["dashboard.osteps.com", "osteps.com", "www.osteps.com", "localhost", "127.0.0.1"]).has(u.hostname)) return null;
    if (!u.pathname.startsWith("/storage/")) return null;
    return path.join(LARAVEL_PUBLIC_DIR, u.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
};

export async function POST(req: NextRequest) {
  let body: { fileUrl?: string };
  try {
    body = (await req.json()) as { fileUrl?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawUrl = String(body.fileUrl || "").trim();
  if (!rawUrl) return NextResponse.json({ text: "" });

  let normalizedUrl = "";
  try {
    const u = new URL(rawUrl);
    u.hash = "";
    normalizedUrl = u.toString();
  } catch {
    normalizedUrl = rawUrl.replace(/#.*$/, "");
  }

  const localPath = resolveLocalPaperPath(normalizedUrl);
  if (!localPath) return NextResponse.json({ text: "" });

  for (const useLayout of [true, false]) {
    try {
      const args = useLayout
        ? ["-layout", "-enc", "UTF-8", localPath, "-"]
        : ["-enc", "UTF-8", localPath, "-"];
      const { stdout } = await execFileAsync("pdftotext", args, {
        maxBuffer: 4 * 1024 * 1024,
        timeout: 12000,
      });
      const text = String(stdout || "").replace(/\s+/g, " ").trim();
      if (text.length > 50) {
        return NextResponse.json({ text: text.slice(0, 18000) });
      }
    } catch {
      // try without layout
    }
  }

  return NextResponse.json({ text: "" });
}
