import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const TEXTBOOK_DIR = path.join(process.cwd(), "textbooks");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const gradeSlug = formData.get("gradeSlug") as string | null;

    if (!file || !gradeSlug) {
      return NextResponse.json(
        { error: "Missing file or gradeSlug" },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    await mkdir(TEXTBOOK_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(TEXTBOOK_DIR, `${gradeSlug}.pdf`);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/api/textbook/${gradeSlug}`,
      name: file.name,
      size: file.size,
    });
  } catch (err) {
    console.error("Textbook upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gradeSlug = searchParams.get("gradeSlug");

    if (!gradeSlug) {
      return NextResponse.json(
        { error: "Missing gradeSlug" },
        { status: 400 },
      );
    }

    const filePath = path.join(TEXTBOOK_DIR, `${gradeSlug}.pdf`);
    await unlink(filePath);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "File not found or delete failed" },
      { status: 404 },
    );
  }
}
