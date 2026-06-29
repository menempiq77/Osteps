import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink, readdir } from "fs/promises";
import path from "path";

const TEXTBOOK_DIR = path.join(process.cwd(), "textbooks");

const sanitizeFilename = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9._\- ]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 100);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const gradeSlug = formData.get("gradeSlug") as string | null;

    if (!gradeSlug) {
      return NextResponse.json(
        { error: "Missing gradeSlug" },
        { status: 400 },
      );
    }

    const files = formData.getAll("files") as File[];
    if (files.length === 0) {
      const singleFile = formData.get("file") as File | null;
      if (singleFile) files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 },
      );
    }

    const gradeDir = path.join(TEXTBOOK_DIR, gradeSlug);
    await mkdir(gradeDir, { recursive: true });

    const uploaded: { name: string; size: number; url: string }[] = [];

    for (const file of files) {
      if (file.type !== "application/pdf") continue;

      const safeName = sanitizeFilename(file.name) || `textbook-${Date.now()}.pdf`;
      const finalName = safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(gradeDir, finalName);
      await writeFile(filePath, buffer);

      uploaded.push({
        name: finalName,
        size: file.size,
        url: `/api/textbook/${gradeSlug}/${encodeURIComponent(finalName)}`,
      });
    }

    if (uploaded.length === 0) {
      return NextResponse.json(
        { error: "No valid PDF files found" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, files: uploaded });
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
    const fileName = searchParams.get("fileName");

    if (!gradeSlug) {
      return NextResponse.json(
        { error: "Missing gradeSlug" },
        { status: 400 },
      );
    }

    if (fileName) {
      const filePath = path.join(TEXTBOOK_DIR, gradeSlug, fileName);
      await unlink(filePath);
    } else {
      const gradeDir = path.join(TEXTBOOK_DIR, gradeSlug);
      const files = await readdir(gradeDir).catch(() => [] as string[]);
      for (const f of files) {
        await unlink(path.join(gradeDir, f)).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "File not found or delete failed" },
      { status: 404 },
    );
  }
}
