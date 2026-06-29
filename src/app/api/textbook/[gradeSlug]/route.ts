import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const TEXTBOOK_DIR = path.join(process.cwd(), "textbooks");

export async function GET(
  _req: NextRequest,
  { params }: { params: { gradeSlug: string } },
) {
  const { gradeSlug } = params;
  const filePath = path.join(TEXTBOOK_DIR, `${gradeSlug}.pdf`);

  try {
    await stat(filePath);
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${gradeSlug}-textbook.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ exists: false }, { status: 404 });
  }
}

export async function HEAD(
  _req: NextRequest,
  { params }: { params: { gradeSlug: string } },
) {
  const { gradeSlug } = params;
  const filePath = path.join(TEXTBOOK_DIR, `${gradeSlug}.pdf`);

  try {
    const info = await stat(filePath);
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(info.size),
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
