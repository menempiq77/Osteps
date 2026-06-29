import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/server/dataDir";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QuizIncidentContext = "fullscreen" | "screen" | "leave";

type QuizIncidentEvent = {
  id: string;
  reason: string;
  context: QuizIncidentContext;
  createdAt: string;
  userAgent?: string;
};

type QuizIncidentState = {
  assessmentId: string;
  quizId: string;
  studentId: string;
  title: string;
  events: QuizIncidentEvent[];
  updatedAt: string;
};

const STORE_DIR = path.join(DATA_DIR, "quiz-incidents");

const safeSegment = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_") || "unknown";

const statePath = (assessmentId: string, quizId: string, studentId: string) =>
  path.join(
    STORE_DIR,
    safeSegment(assessmentId),
    safeSegment(quizId),
    `${safeSegment(studentId)}.json`
  );

const readJsonState = async (filePath: string): Promise<QuizIncidentState | null> => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as QuizIncidentState;
  } catch (error: any) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
};

const writeJsonState = async (filePath: string, state: QuizIncidentState) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(state, null, 2));
};

const normalizeIncidentContext = (value: unknown): QuizIncidentContext => {
  if (value === "screen" || value === "leave") return value;
  return "fullscreen";
};

const toIncidentRows = (state: QuizIncidentState) =>
  (Array.isArray(state.events) ? state.events : [])
    .map((event) => ({
      id: event.id,
      assessmentId: state.assessmentId,
      quizId: state.quizId,
      studentId: state.studentId,
      title: state.title || "Quiz",
      reason: String(event.reason || "").trim(),
      context: normalizeIncidentContext(event.context),
      createdAt: String(event.createdAt || state.updatedAt || ""),
      updatedAt: state.updatedAt,
      userAgent: event.userAgent || "",
    }))
    .filter((row) => row.reason && row.createdAt);

const readIncidentStates = async ({
  assessmentId,
  quizId,
  studentId,
}: {
  assessmentId?: string | null;
  quizId?: string | null;
  studentId?: string | null;
}) => {
  if (assessmentId && quizId && studentId) {
    const exactState = await readJsonState(statePath(assessmentId, quizId, studentId));
    return exactState ? [exactState] : [];
  }

  let assessmentDirs: fs.Dirent[] = [] as unknown as fs.Dirent[];
  try {
    assessmentDirs = await fs.readdir(STORE_DIR, { withFileTypes: true });
  } catch (error: any) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  const states = await Promise.all(
    assessmentDirs
      .filter((entry) => entry.isDirectory())
      .map(async (assessmentDir) => {
        if (assessmentId && assessmentDir.name !== safeSegment(assessmentId)) return [];

        const assessmentPath = path.join(STORE_DIR, assessmentDir.name);
        const quizDirs = await fs.readdir(assessmentPath, { withFileTypes: true });
        const matchingStates = await Promise.all(
          quizDirs
            .filter((entry) => entry.isDirectory())
            .map(async (quizDir) => {
              if (quizId && quizDir.name !== safeSegment(quizId)) return [];

              const quizPath = path.join(assessmentPath, quizDir.name);
              const studentFiles = await fs.readdir(quizPath, { withFileTypes: true });
              const fileStates = await Promise.all(
                studentFiles
                  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
                  .map(async (studentFile) => {
                    if (studentId && studentFile.name !== `${safeSegment(studentId)}.json`) return null;
                    return readJsonState(path.join(quizPath, studentFile.name));
                  })
              );

              return fileStates.filter(Boolean) as QuizIncidentState[];
            })
        );

        return matchingStates.flat();
      })
  );

  return states.flat();
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assessmentId = searchParams.get("assessmentId");
  const quizId = searchParams.get("quizId");
  const studentId = searchParams.get("studentId");

  if (!quizId && !studentId) {
    return NextResponse.json(
      { message: "quizId or studentId is required" },
      { status: 400 }
    );
  }

  const states = await readIncidentStates({ assessmentId, quizId, studentId });
  const incidents = states
    .flatMap((state) => toIncidentRows(state))
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );

  return NextResponse.json({ data: incidents });
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const rawAssessmentId = String(payload?.assessmentId || "").trim();
  const rawQuizId = String(payload?.quizId || "").trim();
  const rawStudentId = String(payload?.studentId || "").trim();
  const reason = String(payload?.reason || "").trim();

  if (!rawAssessmentId || !rawQuizId || !rawStudentId || !reason) {
    return NextResponse.json(
      { message: "assessmentId, quizId, studentId and reason are required" },
      { status: 400 }
    );
  }

  const assessmentId = safeSegment(rawAssessmentId);
  const quizId = safeSegment(rawQuizId);
  const studentId = safeSegment(rawStudentId);

  const now = new Date().toISOString();
  const filePath = statePath(assessmentId, quizId, studentId);
  const existing = await readJsonState(filePath);
  const event: QuizIncidentEvent = {
    id: `${assessmentId}-${quizId}-${studentId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    reason,
    context: normalizeIncidentContext(payload?.context),
    createdAt: now,
    userAgent: String(request.headers.get("user-agent") || ""),
  };

  const nextState: QuizIncidentState = {
    assessmentId,
    quizId,
    studentId,
    title: String(payload?.title || existing?.title || "Quiz").trim() || "Quiz",
    events: [...(existing?.events || []), event],
    updatedAt: now,
  };

  await writeJsonState(filePath, nextState);
  return NextResponse.json({ data: event });
}
