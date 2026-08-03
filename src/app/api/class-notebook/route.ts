import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/server/db";
import type { RowDataPacket } from "mysql2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LARAVEL_API_BASE =
  process.env.OSTEPS_LARAVEL_API_BASE || "https://dashboard.osteps.com";

type User = {
  id?: number | string;
  role?: string;
  student?: number | string;
  student_id?: number | string;
  studentClass?: number | string;
  student_class_id?: number | string;
  school?: number | string | { id?: number | string };
  school_id?: number | string;
};

type NotebookRow = RowDataPacket & {
  id: number;
  school_id: number;
  subject_id: number;
  subject_class_id: number;
  class_id: number;
  student_id: number;
};

type PageRow = RowDataPacket & {
  id: number;
  notebook_id: number;
  page_index: number;
  title: string;
  background: string | null;
  student_annotations: string | null;
  teacher_annotations: string | null;
  created_at: string;
  updated_at: string;
};

const authHeaders = (request: NextRequest) => {
  const headers: Record<string, string> = { accept: "application/json" };
  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");
  if (cookie) headers.cookie = cookie;
  if (authorization) headers.authorization = authorization;
  return headers;
};

const getUser = async (request: NextRequest): Promise<User | null> => {
  const response = await fetch(`${LARAVEL_API_BASE}/api/user`, {
    headers: authHeaders(request),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const payload = await response.json().catch(() => null);
  return (payload?.data ?? payload) as User;
};

const roleOf = (user: User) =>
  String(user.role || "").trim().toUpperCase().replace(/\s+/g, "_");

const ownStudentId = (user: User) =>
  Number(user.student ?? user.student_id ?? 0);

const schoolFromUser = async (user: User) => {
  const role = roleOf(user);
  const schoolValue =
    typeof user.school === "object" ? user.school?.id : user.school ?? user.school_id;
  const userId = Number(user.id ?? 0);
  const pool = getDbPool();
  if (role === "SCHOOL_ADMIN" || role === "ADMIN") {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM schools WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return Number(rows[0]?.id ?? schoolValue ?? 0);
  }
  if (role === "TEACHER" || role === "HOD") {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT school_id FROM teachers WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return Number(rows[0]?.school_id ?? schoolValue ?? 0);
  }
  if (role === "STUDENT") {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT school_id FROM students WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return Number(rows[0]?.school_id ?? schoolValue ?? 0);
  }
  return 0;
};

const ensureTables = async () => {
  const pool = getDbPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS class_notebooks (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      school_id BIGINT UNSIGNED NOT NULL,
      subject_id BIGINT UNSIGNED NOT NULL,
      subject_class_id BIGINT UNSIGNED NOT NULL,
      class_id BIGINT UNSIGNED NOT NULL,
      student_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY class_notebooks_scope_student (subject_class_id, student_id),
      KEY class_notebooks_school (school_id)
    )
  `);
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS class_notebook_pages (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      notebook_id BIGINT UNSIGNED NOT NULL,
      page_index INT NOT NULL,
      title VARCHAR(255) NOT NULL DEFAULT '',
      background JSON NOT NULL,
      student_annotations JSON NOT NULL,
      teacher_annotations JSON NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY class_notebook_pages_scope (notebook_id, page_index),
      KEY class_notebook_pages_notebook (notebook_id)
    )
  `);
};

const json = (value: unknown, fallback: unknown) => {
  try {
    return JSON.stringify(value ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
};

const parse = (value: string | null, fallback: unknown) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const ensureNotebook = async (
  schoolId: number,
  subjectId: number,
  subjectClassId: number,
  classId: number,
  studentId: number
) => {
  const pool = getDbPool();
  await pool.execute(
    `INSERT INTO class_notebooks
      (school_id, subject_id, subject_class_id, class_id, student_id)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       school_id = VALUES(school_id), subject_id = VALUES(subject_id),
       class_id = VALUES(class_id), updated_at = CURRENT_TIMESTAMP`,
    [schoolId, subjectId, subjectClassId, classId, studentId]
  );
  const [rows] = await pool.execute<NotebookRow[]>(
    `SELECT * FROM class_notebooks
     WHERE school_id = ? AND subject_class_id = ? AND student_id = ?
     LIMIT 1`,
    [schoolId, subjectClassId, studentId]
  );
  return rows[0] ?? null;
};

const getClassName = async (classId: number, subjectClassId: number) => {
  const pool = getDbPool();
  const [subjectRows] = await pool.execute<RowDataPacket[]>(
    "SELECT base_class_label, name FROM subject_classes WHERE id = ? LIMIT 1",
    [subjectClassId]
  );
  const [classRows] = await pool.execute<RowDataPacket[]>(
    "SELECT class_name FROM classes WHERE id = ? LIMIT 1",
    [classId]
  );
  return String(
    subjectRows[0]?.base_class_label ||
      subjectRows[0]?.name ||
      classRows[0]?.class_name ||
      `Class ${classId}`
  );
};

const authorizeClassScope = async (
  user: User,
  schoolId: number,
  subjectId: number,
  subjectClassId: number,
  classId: number
) => {
  const role = roleOf(user);
  if (!schoolId || !subjectId || !subjectClassId || !classId) return false;
  const pool = getDbPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT sc.id
       FROM subject_classes sc
       JOIN classes c ON c.id = COALESCE(sc.class_id, sc.base_class_id)
      WHERE sc.id = ? AND sc.subject_id = ? AND c.id = ? AND c.school_id = ?`,
    [subjectClassId, subjectId, classId, schoolId]
  );
  if (rows.length === 0) return false;
  if (role === "STUDENT") {
    const [studentRows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM students WHERE id = ? AND school_id = ? AND class_id = ? LIMIT 1",
      [ownStudentId(user), schoolId, classId]
    );
    if (!studentRows.length) return false;
  }
  return true;
};

const pageDto = (row: PageRow) => ({
  id: Number(row.id),
  notebookId: Number(row.notebook_id),
  pageIndex: Number(row.page_index),
  title: row.title || "",
  background: parse(row.background, {}),
  studentAnnotations: parse(row.student_annotations, []),
  teacherAnnotations: parse(row.teacher_annotations, []),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    await ensureTables();
    const params = request.nextUrl.searchParams;
    const subjectId = Number(params.get("subjectId") || 0);
    let subjectClassId = Number(params.get("subjectClassId") || 0);
    let classId = Number(params.get("classId") || 0);
    const requestedStudentId = Number(params.get("studentId") || 0);
    const role = roleOf(user);
    const schoolId = await schoolFromUser(user);
    if (role === "STUDENT" && (!subjectClassId || !classId)) {
      classId = classId || Number(user.studentClass ?? user.student_class_id ?? 0);
      if (classId && subjectId && !subjectClassId) {
        const [subjectRows] = await getDbPool().execute<RowDataPacket[]>(
          `SELECT id FROM subject_classes
            WHERE subject_id = ? AND (class_id = ? OR base_class_id = ?)
            ORDER BY is_active DESC, id ASC LIMIT 1`,
          [subjectId, classId, classId]
        );
        subjectClassId = Number(subjectRows[0]?.id ?? 0);
      }
    }
    if (params.get("view") === "class") {
      if (!["TEACHER", "HOD", "SCHOOL_ADMIN", "ADMIN"].includes(role)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      if (!(await authorizeClassScope(user, schoolId, subjectId, subjectClassId, classId))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      const [students] = await getDbPool().execute<RowDataPacket[]>(
        `SELECT s.id, s.name, s.email
           FROM students s
          WHERE s.school_id = ? AND s.class_id = ?
          ORDER BY s.name ASC`,
        [schoolId, classId]
      );
      const className = await getClassName(classId, subjectClassId);
      const result = [];
      for (const student of students) {
        const notebook = await ensureNotebook(schoolId, subjectId, subjectClassId, classId, Number(student.id));
        const [countRows] = await getDbPool().execute<RowDataPacket[]>(
          "SELECT COUNT(*) AS page_count FROM class_notebook_pages WHERE notebook_id = ?",
          [notebook?.id ?? 0]
        );
        result.push({
          id: String(student.id),
          name: String(student.name || student.email || `Student ${student.id}`),
          email: student.email || undefined,
          notebookId: Number(notebook?.id ?? 0),
          pageCount: Number(countRows[0]?.page_count ?? 0),
        });
      }
      return NextResponse.json({ subjectId, subjectClassId, classId, className, students: result });
    }
    const studentId = role === "STUDENT" ? ownStudentId(user) : requestedStudentId;
    if (!schoolId || !studentId || !(await authorizeClassScope(user, schoolId, subjectId, subjectClassId, classId))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const notebook = await ensureNotebook(schoolId, subjectId, subjectClassId, classId, studentId);
    if (!notebook) return NextResponse.json({ message: "Notebook unavailable" }, { status: 404 });
    const [pages] = await getDbPool().execute<PageRow[]>(
      "SELECT * FROM class_notebook_pages WHERE notebook_id = ? ORDER BY page_index ASC",
      [notebook.id]
    );
    const className = await getClassName(classId, subjectClassId);
    return NextResponse.json({
      notebook: {
        id: notebook.id,
        studentId: notebook.student_id,
        subjectId: notebook.subject_id,
        subjectClassId: notebook.subject_class_id,
        classId: notebook.class_id,
      },
      className,
      pages: pages.map(pageDto),
    });
  } catch (error) {
    console.error("Class Notebook GET failed:", error);
    return NextResponse.json({ message: "Failed to load notebook" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    await ensureTables();
    const body = await request.json();
    const action = String(body?.action || "");
    const role = roleOf(user);
    const schoolId = await schoolFromUser(user);
    const teacher = ["TEACHER", "HOD", "SCHOOL_ADMIN", "ADMIN"].includes(role);
    const pageId = Number(body?.pageId || 0);
    const pool = getDbPool();

    if (action === "create_page") {
      const subjectId = Number(body?.subjectId || 0);
      let subjectClassId = Number(body?.subjectClassId || 0);
      let classId = Number(body?.classId || 0);
      if (role === "STUDENT" && (!subjectClassId || !classId)) {
        classId = classId || Number(user.studentClass ?? user.student_class_id ?? 0);
        if (classId && subjectId && !subjectClassId) {
          const [subjectRows] = await pool.execute<RowDataPacket[]>(
            `SELECT id FROM subject_classes
              WHERE subject_id = ? AND (class_id = ? OR base_class_id = ?)
              ORDER BY is_active DESC, id ASC LIMIT 1`,
            [subjectId, classId, classId]
          );
          subjectClassId = Number(subjectRows[0]?.id ?? 0);
        }
      }
      if (!teacher && role !== "STUDENT") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      if (!(await authorizeClassScope(user, schoolId, subjectId, subjectClassId, classId))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      const targetIds =
        role === "STUDENT"
          ? [ownStudentId(user)]
          : body?.allStudents
            ? (await pool.execute<RowDataPacket[]>(
                "SELECT DISTINCT id FROM students WHERE school_id = ? AND class_id = ?",
                [schoolId, classId]
              ))[0].map((row) => Number(row.id))
            : [Number(body?.studentId || 0)];
      if (!targetIds.every((id) => id > 0)) return NextResponse.json({ message: "Student is required" }, { status: 400 });
      const created = [];
      for (const targetId of targetIds) {
        const notebook = await ensureNotebook(schoolId, subjectId, subjectClassId, classId, targetId);
        if (!notebook) continue;
        const [maxRows] = await pool.execute<RowDataPacket[]>(
          "SELECT COALESCE(MAX(page_index), -1) AS max_index FROM class_notebook_pages WHERE notebook_id = ?",
          [notebook.id]
        );
        const pageIndex = Number(maxRows[0]?.max_index ?? -1) + 1;
        const [result] = await pool.execute<any>(
          `INSERT INTO class_notebook_pages
            (notebook_id, page_index, title, background, student_annotations, teacher_annotations)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [notebook.id, pageIndex, String(body?.title || ""), json(body?.background, {}), "[]", "[]"]
        );
        created.push({ id: result.insertId, notebookId: notebook.id, pageIndex });
      }
      return NextResponse.json({ created });
    }

    if (action === "save_page") {
      if (!pageId) return NextResponse.json({ message: "pageId is required" }, { status: 400 });
      const [rows] = await pool.execute<(PageRow & NotebookRow)[]>(
        `SELECT p.*, n.school_id, n.subject_id, n.subject_class_id, n.class_id, n.student_id
           FROM class_notebook_pages p
           JOIN class_notebooks n ON n.id = p.notebook_id
          WHERE p.id = ? LIMIT 1`,
        [pageId]
      );
      const page = rows[0];
      if (!page || Number(page.school_id) !== schoolId) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const owner = role === "STUDENT" ? ownStudentId(user) : Number(page.student_id);
      if (role === "STUDENT" && owner !== Number(page.student_id)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const updates: string[] = [];
      const values: unknown[] = [];
      if (teacher) {
        if (body.background !== undefined) { updates.push("background = ?"); values.push(json(body.background, {})); }
        if (body.teacherAnnotations !== undefined) { updates.push("teacher_annotations = ?"); values.push(json(body.teacherAnnotations, [])); }
        if (body.title !== undefined) { updates.push("title = ?"); values.push(String(body.title || "")); }
      }
      if (role === "STUDENT" && body.studentAnnotations !== undefined) {
        updates.push("student_annotations = ?"); values.push(json(body.studentAnnotations, []));
      }
      if (updates.length === 0) return NextResponse.json({ message: "No permitted changes" }, { status: 403 });
      values.push(pageId);
      await pool.execute(
        `UPDATE class_notebook_pages SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values as any[]
      );
      return NextResponse.json({ ok: true });
    }

    if (action === "delete_page") {
      if (!teacher || !pageId) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT p.id FROM class_notebook_pages p JOIN class_notebooks n ON n.id = p.notebook_id
          WHERE p.id = ? AND n.school_id = ? LIMIT 1`,
        [pageId, schoolId]
      );
      if (!rows.length) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      await pool.execute("DELETE FROM class_notebook_pages WHERE id = ?", [pageId]);
      return NextResponse.json({ ok: true });
    }

    if (action === "reorder_pages") {
      const notebookId = Number(body?.notebookId || 0);
      const pageIds = Array.isArray(body?.pageIds)
        ? body.pageIds.map((value: unknown) => Number(value)).filter((value: number) => value > 0)
        : [];
      if (!notebookId || pageIds.length === 0) {
        return NextResponse.json({ message: "Notebook and page order are required" }, { status: 400 });
      }
      const [notebookRows] = await pool.execute<NotebookRow[]>(
        "SELECT * FROM class_notebooks WHERE id = ? AND school_id = ? LIMIT 1",
        [notebookId, schoolId]
      );
      const notebook = notebookRows[0];
      if (!notebook || (role === "STUDENT" && Number(notebook.student_id) !== ownStudentId(user))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        for (let index = 0; index < pageIds.length; index += 1) {
          await connection.execute(
            "UPDATE class_notebook_pages SET page_index = ? WHERE id = ? AND notebook_id = ?",
            [100000 + index, pageIds[index], notebookId]
          );
        }
        for (let index = 0; index < pageIds.length; index += 1) {
          await connection.execute(
            "UPDATE class_notebook_pages SET page_index = ? WHERE id = ? AND notebook_id = ?",
            [index, pageIds[index], notebookId]
          );
        }
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ message: "Unknown notebook action" }, { status: 400 });
  } catch (error) {
    console.error("Class Notebook POST failed:", error);
    return NextResponse.json({ message: "Failed to save notebook" }, { status: 500 });
  }
}
