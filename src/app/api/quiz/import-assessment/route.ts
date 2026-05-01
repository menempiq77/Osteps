import { NextRequest, NextResponse } from "next/server";

import {
  extractAssessmentText,
  generateQuestionsFromAssessmentText,
} from "@/lib/server/assessmentQuizImport";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Upload a file first." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "The file is too large. Use a file up to 10MB." }, { status: 400 });
    }

    const extracted = await extractAssessmentText(file);
    const generated = generateQuestionsFromAssessmentText(extracted.text);

    return NextResponse.json({
      fileName: file.name,
      warnings: [...extracted.warnings, ...generated.warnings],
      questions: generated.questions,
      extractedText: generated.normalizedText,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process the assessment file.";
    return NextResponse.json({ message }, { status: 400 });
  }
}