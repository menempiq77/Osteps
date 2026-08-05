import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR, LEGACY_DATA_DIRS } from "@/lib/server/dataDir";
import { getDbPool } from "@/lib/server/db";
import { RowDataPacket } from "mysql2/promise";
import { asRecord } from "@/lib/safeRecord";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LARAVEL_API_BASE =
  process.env.OSTEPS_LARAVEL_API_BASE || "https://dashboard.osteps.com";

type LaravelStudentAssessmentTask = {
  id?: number | string;
  assessment_id?: number | string;
  task_id?: number | string;
  student_id?: number | string;
  status?: string;
  self_assessment_mark?: number | string | null;
  teacher_assessment_score?: number | string | null;
  teacher_assessment_mark?: number | string | null;
  teacher_assessment_marks?: number | string | null;
  teacher_feedback?: string | null;
  teacher_assessment_feedback?: string | null;
  task?: { id?: number | string };
  student?: { id?: number | string };
};

const getLaravelAuthHeaders = (request: NextRequest): Record<string, string> => {
  const headers: Record<string, string> = {};
  const cookie = request.headers.get("cookie");
  if (cookie) headers["cookie"] = cookie;
  const token = request.headers.get("authorization");
  if (token) headers["authorization"] = token;
  return headers;
};

const findLaravelTask = (
  tasks: unknown[],
  taskId: string,
  studentId: string
): LaravelStudentAssessmentTask | null => {
  for (const raw of tasks) {
    const task = raw as LaravelStudentAssessmentTask;
    const recordTaskId = String(
      task.task_id ?? task.task?.id ?? ""
    ).trim();
    const recordStudentId = String(
      task.student_id ?? task.student?.id ?? ""
    ).trim();
    if (recordTaskId === taskId && recordStudentId === studentId) {
      return task;
    }
  }
  return null;
};

const fetchLaravelStudentTasks = async (
  assessmentId: string,
  authHeaders: Record<string, string>
): Promise<unknown[]> => {
  try {
    const res = await fetch(
      `${LARAVEL_API_BASE}/api/get-student-assessment-tasks/${assessmentId}`,
      {
        method: "GET",
        headers: {
          ...authHeaders,
          accept: "application/json",
        },
      }
    );
    if (!res.ok) return [];
    const payload = (await res.json()) as { data?: unknown[] };
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error: unknown) {
    console.error("Failed to fetch student assessment tasks from Laravel:", error);
    return [];
  }
};

const fetchLaravelTask = async (
  assessmentId: string,
  taskId: string,
  studentId: string,
  authHeaders: Record<string, string>
): Promise<LaravelStudentAssessmentTask | null> => {
  const tasks = await fetchLaravelStudentTasks(assessmentId, authHeaders);
  return findLaravelTask(tasks, taskId, studentId);
};

const syncTeacherMarkToLaravel = async (
  studentId: string,
  taskId: string,
  assessmentId: string,
  marks: string,
  feedback: string,
  authHeaders: Record<string, string>
): Promise<void> => {
  if (!marks.trim()) return;
  try {
    await fetch(`${LARAVEL_API_BASE}/api/add-student-task-marks/${studentId}`, {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        task_id: taskId,
        assessment_id: assessmentId,
        teacher_assessment_marks: marks,
        teacher_assessment_feedback: feedback,
      }),
    });
  } catch (error: unknown) {
    console.error("Failed to sync teacher mark to Laravel:", error);
  }
};

// Database-backed persistence for assessment document state. The file store
// remains the fast cache, but the MySQL table is the durable source of truth
// that survives deploys, directory changes, and server re-installs.

interface DbDocumentRow extends RowDataPacket {
  id: number;
  assessment_id: number;
  task_id: number;
  student_id: number;
  status: string;
  student_locked: number;
  student_annotations: string | null;
  teacher_annotations: string | null;
  metadata: string | null;
  submitted_at: string | null;
  marked_at: string | null;
  created_at: string;
  updated_at: string;
}

const parseJsonColumn = (value: string | null): unknown => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const toIsoOrNull = (value: string | undefined | null): string | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 19).replace("T", " ");
};

const fetchDbState = async (
  assessmentId: string,
  taskId: string,
  studentId: string
): Promise<DocumentState | null> => {
  try {
    const [rows] = await getDbPool().execute<DbDocumentRow[]>(
      `SELECT * FROM assessment_document_annotations
       WHERE assessment_id = ? AND task_id = ? AND student_id = ?
       LIMIT 1`,
      [assessmentId, taskId, studentId]
    );
    const row = rows?.[0];
    if (!row) return null;

    const parsed: Partial<DocumentState> = {
      assessmentId: String(row.assessment_id),
      taskId: String(row.task_id),
      studentId: String(row.student_id),
      status: (row.status as DocumentState["status"]) || "draft",
      studentLocked: Boolean(row.student_locked),
      studentAnnotations: (parseJsonColumn(row.student_annotations) as unknown[]) || [],
      teacherAnnotations: (parseJsonColumn(row.teacher_annotations) as unknown[]) || [],
      metadata: (parseJsonColumn(row.metadata) as Record<string, unknown>) || {},
      submittedAt: row.submitted_at || undefined,
      markedAt: row.marked_at || undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
    return buildState(assessmentId, taskId, studentId, parsed);
  } catch (error: unknown) {
    console.error("Failed to fetch assessment document from database:", error);
    return null;
  }
};

const upsertDbState = async (state: DocumentState): Promise<void> => {
  try {
    await getDbPool().execute(
      `INSERT INTO assessment_document_annotations
        (assessment_id, task_id, student_id, status, student_locked,
         student_annotations, teacher_annotations, metadata,
         submitted_at, marked_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         student_locked = VALUES(student_locked),
         student_annotations = VALUES(student_annotations),
         teacher_annotations = VALUES(teacher_annotations),
         metadata = VALUES(metadata),
         submitted_at = VALUES(submitted_at),
         marked_at = VALUES(marked_at),
         updated_at = VALUES(updated_at)`,
      [
        state.assessmentId,
        state.taskId,
        state.studentId,
        state.status,
        state.studentLocked ? 1 : 0,
        JSON.stringify(state.studentAnnotations || []),
        JSON.stringify(state.teacherAnnotations || []),
        JSON.stringify(state.metadata || {}),
        toIsoOrNull(state.submittedAt),
        toIsoOrNull(state.markedAt),
        new Date(state.updatedAt).toISOString().slice(0, 19).replace("T", " "),
      ]
    );
  } catch (error: unknown) {
    console.error("Failed to upsert assessment document to database:", error);
  }
};

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

const STORE_DIR = path.join(DATA_DIR, "assessment-documents");

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
  } catch (error: unknown) {
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

const statePathForDir = (
  storeDir: string,
  assessmentId: string,
  taskId: string,
  studentId: string
) =>
  path.join(
    storeDir,
    safeSegment(assessmentId),
    safeSegment(taskId),
    `${safeSegment(studentId)}.json`
  );

const findLegacyStateFile = async (
  assessmentId: string,
  taskId: string,
  studentId: string
): Promise<string | null> => {
  for (const legacyDir of LEGACY_DATA_DIRS) {
    const candidate = statePathForDir(
      path.join(legacyDir, "assessment-documents"),
      assessmentId,
      taskId,
      studentId
    );
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // not in this legacy location
    }
  }
  return null;
};

const buildState = (
  assessmentId: string,
  taskId: string,
  studentId: string,
  parsed?: Partial<DocumentState>
): DocumentState => {
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
};

const writeState = async (state: DocumentState) => {
  const filePath = statePath(state.assessmentId, state.taskId, state.studentId);
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random()
    .toString(16)
    .slice(2)}.tmp`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(tempPath, JSON.stringify(state, null, 2), "utf8");
  await fs.rename(tempPath, filePath);
  // The database is the durable source of truth; always mirror the file.
  await upsertDbState(state);
};

const readState = async (
  assessmentId: string,
  taskId: string,
  studentId: string,
  authHeaders?: Record<string, string>
): Promise<DocumentState> => {
  const filePath = statePath(assessmentId, taskId, studentId);

  const rawFromPath = async (targetPath: string) => {
    const raw = await fs.readFile(targetPath, "utf8");
    return parseStoredState(raw);
  };

  try {
    const parsed = await rawFromPath(filePath);
    const fileState = buildState(assessmentId, taskId, studentId, parsed);
    // Keep the database in sync with the primary file store so the data
    // survives even if the `.data` files are lost or moved.
    await upsertDbState(fileState);
    return fileState;
  } catch (error: unknown) {     if (asRecord(error)?.code !== "ENOENT") throw error;
  }

  // The primary store is empty. Try the database source of truth next and
  // restore the file from there if a row exists.
  const dbState = await fetchDbState(assessmentId, taskId, studentId);
  if (dbState) {
    try {
      await writeState(dbState);
    } catch (writeError: unknown) {
      console.error("Failed to restore assessment document file from database:", writeError);
    }
    return dbState;
  }

  // The primary store is empty. Look in legacy `.data` directories that may
  // contain student answers/marking from earlier deploys with a different cwd.
  const legacyFile = await findLegacyStateFile(assessmentId, taskId, studentId);
  if (legacyFile) {
    try {
      const parsed = await rawFromPath(legacyFile);
      // Migrate the recovered state into the primary store so future reads
      // and writes use the stable DATA_DIR.
      const recoveredState = buildState(assessmentId, taskId, studentId, parsed);
      await writeState(recoveredState);
      return recoveredState;
    } catch (migrationError: unknown) {
      console.error("Failed to migrate legacy assessment document state:", migrationError);
    }
  }

  // The document store is empty. Fall back to the legacy Laravel
  // `student_assessment_tasks` table so existing teacher marks/feedback are
  // still visible after a deploy/cwd change.
  if (authHeaders) {
    try {
      const dbTask = await fetchLaravelTask(assessmentId, taskId, studentId, authHeaders);
      if (dbTask) {
        const teacherMark =
          dbTask.teacher_assessment_score ??
          dbTask.teacher_assessment_marks ??
          dbTask.teacher_assessment_mark ??
          null;
        const teacherFeedback =
          dbTask.teacher_feedback ??
          dbTask.teacher_assessment_feedback ??
          null;
        const dbStatus = String(dbTask.status || "").toLowerCase();
        const isMarked =
          dbStatus === "completed" ||
          (teacherMark != null && String(teacherMark).trim() !== "");
        const safeDbStatus = (dbStatus as DocumentState["status"]) || "draft";

        const dbBackedState = buildState(assessmentId, taskId, studentId, {
          status: isMarked ? "marked" : safeDbStatus,
          studentLocked: isMarked || dbStatus === "completed",
          metadata: {
            selfAssessmentMark: dbTask.self_assessment_mark ?? undefined,
            ...(teacherMark != null && String(teacherMark).trim() !== ""
              ? { teacherMarks: String(teacherMark) }
              : {}),
            ...(teacherFeedback != null && String(teacherFeedback).trim() !== ""
              ? { teacherFeedback: String(teacherFeedback) }
              : {}),
            dbBacked: true,
          },
        });

        // Persist this db-backed state into the primary store and database so
        // future reads/writes are not dependent on the Laravel fallback.
        await writeState(dbBackedState);
        return dbBackedState;
      }
    } catch (dbError: unknown) {
      console.error("Failed to load assessment document state from Laravel fallback:", dbError);
    }
  }

  return createEmptyState(assessmentId, taskId, studentId);
};

const toFiniteNumber = (value: unknown) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const isExamExitMetadataPayload = (metadata: Record<string, unknown>) =>
  Array.isArray(metadata.examExitEvents) ||
  typeof metadata.lastExamExitReason === "string" ||
  typeof metadata.lastExamExitAt === "string";

const pickExamExitMetadata = (metadata: Record<string, unknown>) => {
  const safeMetadata: Record<string, unknown> = {};

  if (Array.isArray(metadata.examExitEvents)) {
    safeMetadata.examExitEvents = metadata.examExitEvents;
  }
  if (typeof metadata.lastExamExitReason === "string") {
    safeMetadata.lastExamExitReason = metadata.lastExamExitReason;
  }
  if (metadata.lastExamExitContext === "fullscreen" || metadata.lastExamExitContext === "screen" || metadata.lastExamExitContext === "leave") {
    safeMetadata.lastExamExitContext = metadata.lastExamExitContext;
  }
  if (typeof metadata.lastExamExitAt === "string") {
    safeMetadata.lastExamExitAt = metadata.lastExamExitAt;
  }

  return safeMetadata;
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

  const authHeaders = getLaravelAuthHeaders(request);
  const state = await readState(ids.assessmentId, ids.taskId, ids.studentId, authHeaders);
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
  const authHeaders = getLaravelAuthHeaders(request);
  const state = await readState(ids.assessmentId, ids.taskId, ids.studentId, authHeaders);
  const payloadMetadata = payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {};

  if (
    layer === "student" &&
    isExamExitMetadataPayload(payloadMetadata) &&
    !Array.isArray(payload.annotations)
  ) {
    state.metadata = {
      ...state.metadata,
      ...pickExamExitMetadata(payloadMetadata),
    };
    state.updatedAt = new Date().toISOString();
    await writeState(state);
    return NextResponse.json(state);
  }

  if (layer === "student" && state.studentLocked && isExamExitMetadataPayload(payloadMetadata)) {
    state.metadata = {
      ...state.metadata,
      ...pickExamExitMetadata(payloadMetadata),
    };
    state.updatedAt = new Date().toISOString();
    await writeState(state);
    return NextResponse.json(state);
  }

  const existingDocumentUrl = normalizeDocumentUrl(state.metadata?.documentFileUrl);
  const incomingDocumentUrl = normalizeDocumentUrl(payloadMetadata.documentFileUrl);

  // If a document already has a recorded PDF identity, keep that identity authoritative.
  // Students may still have an older browser bundle or route URL that sends the current
  // task file URL after a teacher/admin replaced the task file. The annotator renders the
  // saved PDF identity, so rejecting these saves would block valid reopened work.

  if (
    !existingDocumentUrl &&
    incomingDocumentUrl &&
    layer === "student" &&
    Array.isArray(state.studentAnnotations) &&
    state.studentAnnotations.length > 0
  ) {
    return NextResponse.json(
      {
        message:
          "This older saved answer has no recorded original PDF identity. Student answers were not changed. Ask an admin to verify the correct PDF before students continue.",
        documentIdentityUnverified: true,
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

  // Sync teacher marks/feedback back to the Laravel `student_assessment_tasks`
  // table so the assessment list and reports reflect the latest marking.
  if (layer === "teacher") {
    const finalMetadata = state.metadata || {};
    const teacherMarks = String(finalMetadata.teacherMarks ?? "");
    const teacherFeedback = String(finalMetadata.teacherFeedback ?? "");
    if (teacherMarks.trim()) {
      await syncTeacherMarkToLaravel(
        ids.studentId,
        ids.taskId,
        ids.assessmentId,
        teacherMarks,
        teacherFeedback,
        authHeaders
      );
    }
  }

  return NextResponse.json(state);
}
