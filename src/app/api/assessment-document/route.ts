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

const normalizeDocumentUrl = (value: unknown) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  try {
    const url = new URL(rawValue);
    url.hash = "";
    return url.toString();
  } catch {
    return rawValue.replace(/#.*$/, "");
  }
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

const extractFirstJsonObject = (raw: string) => {
  let depth = 0;
  let inString = false;
  let escaped = false;
  let started = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];

    if (!started) {
      if (/\s/.test(char)) continue;
      if (char !== "{") return null;
      started = true;
      depth = 1;
      continue;
    }

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = inString;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      return raw.slice(0, index + 1);
    }
  }

  return null;
};

const parseStoredState = (raw: string): Partial<DocumentState> => {
  try {
    return JSON.parse(raw) as Partial<DocumentState>;
  } catch (error) {
    const firstObject = extractFirstJsonObject(raw);
    if (!firstObject) throw error;
    return JSON.parse(firstObject) as Partial<DocumentState>;
  }
};

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
    const parsed = parseStoredState(raw);
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
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random()
    .toString(16)
    .slice(2)}.tmp`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(tempPath, JSON.stringify(state, null, 2), "utf8");
  await fs.rename(tempPath, filePath);
};

const toFiniteNumber = (value: unknown) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
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

const validateStudentIdentityHeader = (request: NextRequest, studentId: string) => {
  const role = String(request.headers.get("x-osteps-role") || "").trim().toUpperCase();
  const authenticatedStudentId = String(request.headers.get("x-osteps-student-id") || "").trim();

  if (role !== "STUDENT" || !authenticatedStudentId) return null;
  if (String(studentId) === authenticatedStudentId) return null;

  return NextResponse.json(
    { message: "Student document does not match the signed-in student." },
    { status: 403 }
  );
};

export async function GET(request: NextRequest) {
  const ids = requiredIds(request);
  if ("error" in ids) {
    return NextResponse.json({ message: ids.error }, { status: 400 });
  }

  const identityError = validateStudentIdentityHeader(request, ids.studentId);
  if (identityError) return identityError;

  const state = await readState(ids.assessmentId, ids.taskId, ids.studentId);
  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  const ids = requiredIds(request);
  if ("error" in ids) {
    return NextResponse.json({ message: ids.error }, { status: 400 });
  }

  const identityError = validateStudentIdentityHeader(request, ids.studentId);
  if (identityError) return identityError;

  let payload: AnnotationPayload;
  try {
    payload = (await request.json()) as AnnotationPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  const layer = payload.layer === "teacher" ? "teacher" : "student";
  const state = await readState(ids.assessmentId, ids.taskId, ids.studentId);
  const payloadMetadata = payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {};
  const existingDocumentUrl = normalizeDocumentUrl(state.metadata?.documentFileUrl);
  const incomingDocumentUrl = normalizeDocumentUrl(payloadMetadata.documentFileUrl);

  if (existingDocumentUrl && incomingDocumentUrl && existingDocumentUrl !== incomingDocumentUrl) {
    return NextResponse.json(
      {
        message:
          "This saved answer belongs to a different PDF than the task currently points to. Student answers were not changed.",
        documentFileMismatch: true,
        savedDocumentFileUrl: existingDocumentUrl,
        incomingDocumentFileUrl: incomingDocumentUrl,
        state,
      },
      { status: 409 }
    );
  }

  if (layer === "student") {
    const incomingClientSaveId = String(payloadMetadata.clientSaveId || "").trim();
    const existingClientSaveId = String(state.metadata?.clientSaveId || "").trim();
    const incomingClientSaveSeq = toFiniteNumber(payloadMetadata.clientSaveSeq);
    const existingClientSaveSeq = toFiniteNumber(state.metadata?.clientSaveSeq);

    if (
      incomingClientSaveId &&
      existingClientSaveId &&
      incomingClientSaveId === existingClientSaveId &&
      incomingClientSaveSeq != null &&
      existingClientSaveSeq != null &&
      incomingClientSaveSeq < existingClientSaveSeq
    ) {
      return NextResponse.json(state);
    }
  }

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

  state.metadata = {
    ...state.metadata,
    ...payloadMetadata,
    documentFileUrl: existingDocumentUrl || incomingDocumentUrl || state.metadata?.documentFileUrl,
  };
  state.updatedAt = new Date().toISOString();

  await writeState(state);
  return NextResponse.json(state);
}
