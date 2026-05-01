import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExamExitContext = "fullscreen" | "screen" | "leave";

type ExamExitLogEntry = {
  reason?: unknown;
  context?: unknown;
  createdAt?: unknown;
  role?: unknown;
};

type DocumentState = {
  assessmentId: string;
  taskId: string;
  studentId: string;
  status: "draft" | "submitted" | "marked";
  metadata?: Record<string, unknown>;
  updatedAt?: string;
};

const STORE_DIR = path.join(process.cwd(), ".data", "assessment-documents");

const safeSegment = (value: string | null) =>
  String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");

const statePath = (assessmentId: string, taskId: string, studentId: string) =>
  path.join(
    STORE_DIR,
    safeSegment(assessmentId),
    safeSegment(taskId),
    `${safeSegment(studentId)}.json`
  );

const readJsonState = async (filePath: string): Promise<DocumentState | null> => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as DocumentState;
  } catch (error: any) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
};

const normalizeIncidentContext = (value: unknown): ExamExitContext => {
  if (value === "screen" || value === "leave") return value;
  return "fullscreen";
};

const toIncidentRows = (state: DocumentState) => {
  const metadata = state.metadata && typeof state.metadata === "object" ? state.metadata : {};
  const rawEvents = Array.isArray(metadata.examExitEvents)
    ? (metadata.examExitEvents as ExamExitLogEntry[])
    : [];
  const title = String(metadata.title ?? "PDF Assessment");

  return rawEvents
    .map((event, index) => ({
      id: `${state.assessmentId}-${state.taskId}-${state.studentId}-${String(event.createdAt ?? index)}`,
      assessmentId: state.assessmentId,
      taskId: state.taskId,
      studentId: state.studentId,
      title,
      reason: String(event.reason ?? "").trim(),
      context: normalizeIncidentContext(event.context),
      createdAt: String(event.createdAt ?? state.updatedAt ?? ""),
      updatedAt: String(state.updatedAt ?? ""),
      status: state.status,
    }))
    .filter((row) => row.reason && row.createdAt);
};

const readStudentIncidentStates = async (
  studentId: string,
  assessmentId?: string | null,
  taskId?: string | null
) => {
  if (assessmentId && taskId) {
    const exactState = await readJsonState(statePath(assessmentId, taskId, studentId));
    return exactState ? [exactState] : [];
  }

  const studentFileName = `${safeSegment(studentId)}.json`;
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
        const taskDirs = await fs.readdir(assessmentPath, { withFileTypes: true });
        const matchingStates = await Promise.all(
          taskDirs
            .filter((entry) => entry.isDirectory())
            .map(async (taskDir) => {
              if (taskId && taskDir.name !== safeSegment(taskId)) return null;
              return readJsonState(path.join(assessmentPath, taskDir.name, studentFileName));
            })
        );

        return matchingStates.filter(Boolean) as DocumentState[];
      })
  );

  return states.flat();
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const studentId = searchParams.get("studentId");
  const assessmentId = searchParams.get("assessmentId");
  const taskId = searchParams.get("taskId");

  if (!studentId) {
    return NextResponse.json({ message: "studentId is required" }, { status: 400 });
  }

  const states = await readStudentIncidentStates(studentId, assessmentId, taskId);
  const incidents = states
    .flatMap((state) => toIncidentRows(state))
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );

  return NextResponse.json({ data: incidents });
}