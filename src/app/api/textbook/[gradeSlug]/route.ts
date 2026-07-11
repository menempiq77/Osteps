import { NextRequest, NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";
import { DATA_DIR } from "@/lib/server/dataDir";
import { resolveWithinDir, safePathSegment } from "@/lib/server/safePath";

const TEXTBOOK_DIR = path.join(DATA_DIR, "textbooks");

export async function GET(
  _req: NextRequest,
  { params }: { params: { gradeSlug: string } },
) {
  const gradeSlug = safePathSegment(params.gradeSlug);
  const gradeDir = resolveWithinDir(TEXTBOOK_DIR, gradeSlug);

  if (!gradeDir) {
    return NextResponse.json({ files: [] });
  }

  try {
    const entries = await readdir(gradeDir);
    const files = [];
    for (const name of entries) {
      if (!name.toLowerCase().endsWith(".pdf")) continue;
      const info = await stat(path.join(gradeDir, name));
      files.push({
        name,
        size: info.size,
        url: `/api/textbook/${gradeSlug}/${encodeURIComponent(name)}`,
        updatedAt: info.mtime.toISOString(),
      });
    }
    files.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}

export async function HEAD(
  _req: NextRequest,
  { params }: { params: { gradeSlug: string } },
) {
  const gradeSlug = safePathSegment(params.gradeSlug);
  const gradeDir = resolveWithinDir(TEXTBOOK_DIR, gradeSlug);

  if (!gradeDir) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const entries = await readdir(gradeDir);
    const pdfCount = entries.filter((e) => e.toLowerCase().endsWith(".pdf")).length;
    if (pdfCount === 0) return new NextResponse(null, { status: 404 });
    return new NextResponse(null, {
      status: 200,
      headers: { "X-Textbook-Count": String(pdfCount) },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
