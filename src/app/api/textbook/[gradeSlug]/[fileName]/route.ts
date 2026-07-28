import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { DATA_DIR } from "@/lib/server/dataDir";
import { resolveWithinDir, safePathSegment } from "@/lib/server/safePath";

const TEXTBOOK_DIR = path.join(DATA_DIR, "textbooks");

export async function GET(
  _req: NextRequest,
  { params }: { params: { gradeSlug: string; fileName: string } },
) {
  const { gradeSlug, fileName } = params;
  const decodedName = safePathSegment(decodeURIComponent(fileName));
  const filePath = resolveWithinDir(TEXTBOOK_DIR, gradeSlug, decodedName);

  if (!filePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await stat(filePath);
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${decodedName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
