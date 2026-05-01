import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnnotationPayload = {
  layer?: "student" | "teacher";
  annotations?: unknown;
  status?: "draft" | "submitted" | "marked";
  studentLocked?: boolean;
  metadata?: Record<string, unknown>;
};

type DocumentState = {
  assessmentId: string;
  taskId: string;
  studentId: string;
  status: "draft" | "submitted" | "marked";
  studentLocked: boolean;
  studentAnnotations: unknown[];
  teacherAnnotations: unknown[];
  metadata: Record<string, unknown>;
  updatedAt: string;
  submittedAt?: string;
  markedAt?: string;
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

const createEmptyState = (
  assessmentId: string,
  taskId: string,
  studentId: string
): DocumentState => ({
  assessmentId,
  taskId,
  studentId,
  status: "draft",
  studentLocked: false,
  studentAnnotations: [],
  teacherAnnotations: [],
  metadata: {},
  updatedAt: new Date().toISOString(),
});

const readState = async (
  assessmentId: string,
  taskId: string,
  studentId: string
): Promise<DocumentState> => {
  const filePath = statePath(assessmentId, taskId, studentId);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<DocumentState>;
    const nextState = {
      ...createEmptyState(assessmentId, taskId, studentId),
      ...parsed,
    } as DocumentState;
    const metadata =
      nextState.metadata && typeof nextState.metadata === "object"
        ? nextState.metadata
        : {};
    const studentLockOverride =
      typeof metadata.studentLockOverride === "boolean"
        ? metadata.studentLockOverride
        : undefined;

    if (studentLockOverride !== undefined) {
      nextState.studentLocked = studentLockOverride;
    } else if (nextState.status === "marked") {
      nextState.studentLocked = true;
    } else {
      nextState.studentLocked = false;
    }
    return nextState;
  } catch (error: any) {
    if (error?.code !== "ENOENT") throw error;
    return createEmptyState(assessmentId, taskId, studentId);
  }
};

const writeState = async (state: DocumentState) => {
  const filePath = statePath(state.assessmentId, state.taskId, state.studentId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(state, null, 2), "utf8");
};

const requiredIds = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const assessmentId = searchParams.get("assessmentId");
  const taskId = searchParams.get("taskId");
  const studentId = searchParams.get("studentId");

  if (!assessmentId || !taskId || !studentId) {
    return { error: "assessmentId, taskId and studentId are required" } as const;
  }

  return { assessmentId, taskId, studentId } as const;
};

export async function GET(request: NextRequest) {
  const ids = requiredIds(request);
  if ("error" in ids) {
    return NextResponse.json({ message: ids.error }, { status: 400 });
  }

  const state = await readState(ids.assessmentId, ids.taskId, ids.studentId);
  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  const ids = requiredIds(request);
  if ("error" in ids) {
    return NextResponse.json({ message: ids.error }, { status: 400 });
  }

  let payload: AnnotationPayload;
  try {
    payload = (await request.json()) as AnnotationPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  const layer = payload.layer === "teacher" ? "teacher" : "student";
  const state = await readState(ids.assessmentId, ids.taskId, ids.studentId);

  if (layer === "student" && state.studentLocked) {
    return NextResponse.json(
      { message: "This student document is locked after finish." },
      { status: 423 }
    );
  }

  const annotations = Array.isArray(payload.annotations) ? payload.annotations : [];
  if (layer === "teacher") {
    state.teacherAnnotations = annotations;
  } else {
    state.studentAnnotations = annotations;
  }

  if (payload.status === "submitted" && layer === "student") {
    state.status = "submitted";
    state.studentLocked = false;
    delete state.metadata.studentLockOverride;
    state.submittedAt = new Date().toISOString();
  }

  if (payload.status === "marked" && layer === "teacher") {
    state.status = "marked";
    state.studentLocked = true;
    state.metadata.studentLockOverride = true;
    state.markedAt = new Date().toISOString();
  }

  if (layer === "teacher" && typeof payload.studentLocked === "boolean") {
    state.studentLocked = payload.studentLocked;
    state.metadata.studentLockOverride = payload.studentLocked;
  }

  state.metadata = { ...state.metadata, ...(payload.metadata || {}) };
  state.updatedAt = new Date().toISOString();

  await writeState(state);
  return NextResponse.json(state);
}
