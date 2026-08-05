import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/server/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LARAVEL_API_BASE =
  process.env.OSTEPS_LARAVEL_API_BASE || "https://dashboard.osteps.com";

type User = {
  id?: number | string;
  role?: string;
  student?: number | string | { id?: number | string; class_id?: number | string };
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
  heading: string | null;
  background: string | null;
  student_annotations: string | null;
  teacher_annotations: string | null;
  created_at: string;
  updated_at: string;
};

type MaterialRow = RowDataPacket & {
  id: number;
  school_id: number;
  subject_id: number;
  name: string;
  kind: "docx" | "pdf" | "image";
  pages: string | null;
  page_count: number;
  created_by: number;
  created_at: string;
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

const ownStudentId = async (user: User) => {
  const directId =
    typeof user.student === "object"
      ? Number((user.student as { id?: number | string }).id ?? 0)
      : Number(user.student ?? user.student_id ?? 0);
  if (directId > 0) return directId;
  const [rows] = await getDbPool().execute<RowDataPacket[]>(
    "SELECT id FROM students WHERE user_id = ? LIMIT 1",
    [Number(user.id ?? 0)]
  );
  return Number(rows[0]?.id ?? 0);
};

const studentClassId = async (user: User) => {
  const studentObjectClassId =
    typeof user.student === "object"
      ? Number(user.student.class_id ?? 0)
      : 0;
  const directClassId = Number(
    studentObjectClassId ||
      user.studentClass ||
      user.student_class_id ||
      0
  );
  if (directClassId > 0) return directClassId;
  const [rows] = await getDbPool().execute<RowDataPacket[]>(
    "SELECT class_id FROM students WHERE user_id = ? LIMIT 1",
    [Number(user.id ?? 0)]
  );
  return Number(rows[0]?.class_id ?? 0);
};

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
      heading VARCHAR(255) NULL,
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
  const [headingColumns] = await pool.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS count
       FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'class_notebook_pages'
        AND column_name = 'heading'`
  );
  if (Number(headingColumns[0]?.count ?? 0) === 0) {
    await pool.execute(
      "ALTER TABLE class_notebook_pages ADD COLUMN heading VARCHAR(255) NULL AFTER title"
    );
  }
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS class_notebook_materials (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      school_id BIGINT UNSIGNED NOT NULL,
      subject_id BIGINT UNSIGNED NOT NULL,
      name VARCHAR(255) NOT NULL,
      kind ENUM('docx', 'pdf', 'image') NOT NULL,
      pages JSON NULL,
      page_count INT NOT NULL DEFAULT 1,
      created_by BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY class_notebook_materials_school_subject (school_id, subject_id)
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

const parse = (value: unknown, fallback: unknown) => {
  if (!value) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const sanitizeMaterialHtml = (value: unknown) =>
  String(value || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*("|')\s*javascript:[\s\S]*?\2/gi, "");

const materialDto = (row: MaterialRow) => ({
  id: Number(row.id),
  schoolId: Number(row.school_id),
  subjectId: Number(row.subject_id),
  name: row.name || "",
  kind: row.kind,
  pages: parse(row.pages, []),
  pageCount: Number(row.page_count || 1),
  createdBy: Number(row.created_by),
  createdAt: row.created_at,
});

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
    "SELECT class_name FROM school_classes WHERE id = ? LIMIT 1",
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
       JOIN school_classes c
         ON c.id = ? AND c.class_name = COALESCE(sc.base_class_label, sc.name)
      WHERE sc.id = ? AND sc.subject_id = ? AND c.school_id = ?`,
    [classId, subjectClassId, subjectId, schoolId]
  );
  if (rows.length === 0) return false;
  if (role === "STUDENT") {
    const [studentRows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM students WHERE id = ? AND school_id = ? AND class_id = ? LIMIT 1",
      [await ownStudentId(user), schoolId, classId]
    );
    if (!studentRows.length) return false;
  }
  return true;
};

const pageDto = (row: PageRow, materials?: Map<number, ReturnType<typeof materialDto>>) => {
  const background = parse(row.background, {}) as { materialId?: number };
  return {
    id: Number(row.id),
    notebookId: Number(row.notebook_id),
    pageIndex: Number(row.page_index),
    title: row.title || "",
    heading: row.heading ?? null,
    background,
    material: materials?.get(Number(background.materialId || 0)) || null,
    studentAnnotations: parse(row.student_annotations, []),
    teacherAnnotations: parse(row.teacher_annotations, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

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
      classId = classId || (await studentClassId(user));
      if (classId && subjectId && !subjectClassId) {
        const [subjectRows] = await getDbPool().execute<RowDataPacket[]>(
          `SELECT sc.id FROM subject_classes sc
            JOIN school_classes c
              ON c.id = ? AND c.class_name = COALESCE(sc.base_class_label, sc.name)
           WHERE sc.subject_id = ?
            ORDER BY is_active DESC, id ASC LIMIT 1`,
          [classId, subjectId]
        );
        subjectClassId = Number(subjectRows[0]?.id ?? 0);
      }
    }
    if (params.get("view") === "material") {
      const materialId = Number(params.get("materialId") || 0);
      if (!materialId || !schoolId || !subjectId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      const [materialRows] = await getDbPool().execute<MaterialRow[]>(
        "SELECT * FROM class_notebook_materials WHERE id = ? AND school_id = ? AND subject_id = ? LIMIT 1",
        [materialId, schoolId, subjectId]
      );
      const material = materialRows[0];
      if (!material) return NextResponse.json({ message: "Not found" }, { status: 404 });
      if (role === "STUDENT") {
        const studentId = await ownStudentId(user);
        const [pageRows] = await getDbPool().execute<RowDataPacket[]>(
          `SELECT p.id
             FROM class_notebook_pages p
             JOIN class_notebooks n ON n.id = p.notebook_id
            WHERE n.school_id = ? AND n.subject_id = ? AND n.student_id = ?
              AND JSON_UNQUOTE(JSON_EXTRACT(p.background, '$.materialId')) = CAST(? AS CHAR)
            LIMIT 1`,
          [schoolId, subjectId, studentId, materialId]
        );
        if (!pageRows.length) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      return NextResponse.json({ material: materialDto(material) });
    }
    if (params.get("view") === "class") {
      if (!["TEACHER", "HOD", "SCHOOL_ADMIN", "ADMIN"].includes(role)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      if (!(await authorizeClassScope(user, schoolId, subjectId, subjectClassId, classId))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      const [students] = await getDbPool().execute<RowDataPacket[]>(
        `SELECT s.id, s.student_name AS name, s.email
           FROM students s
          WHERE s.school_id = ? AND s.class_id = ?
          ORDER BY s.student_name ASC`,
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
    const studentId =
      role === "STUDENT" ? await ownStudentId(user) : requestedStudentId;
    if (!schoolId || !studentId || !(await authorizeClassScope(user, schoolId, subjectId, subjectClassId, classId))) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const notebook = await ensureNotebook(schoolId, subjectId, subjectClassId, classId, studentId);
    if (!notebook) return NextResponse.json({ message: "Notebook unavailable" }, { status: 404 });
    const [pages] = await getDbPool().execute<PageRow[]>(
      "SELECT * FROM class_notebook_pages WHERE notebook_id = ? ORDER BY page_index ASC",
      [notebook.id]
    );
    const materialIds = pages
      .map((page) => Number((parse(page.background, {}) as { materialId?: number })?.materialId || 0))
      .filter((id, index, ids) => id > 0 && ids.indexOf(id) === index);
    const materials = new Map<number, ReturnType<typeof materialDto>>();
    if (materialIds.length) {
      const placeholders = materialIds.map(() => "?").join(",");
      const [materialRows] = await getDbPool().execute<MaterialRow[]>(
        `SELECT * FROM class_notebook_materials
          WHERE school_id = ? AND subject_id = ? AND id IN (${placeholders})`,
        [schoolId, subjectId, ...materialIds]
      );
      materialRows.forEach((material) => materials.set(Number(material.id), materialDto(material)));
    }
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
      pages: pages.map((page) => pageDto(page, materials)),
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

    if (action === "list_materials") {
      const subjectId = Number(body?.subjectId || 0);
      if (!subjectId || !schoolId || !["TEACHER", "HOD", "SCHOOL_ADMIN", "ADMIN", "STUDENT"].includes(role)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      const studentId = role === "STUDENT" ? await ownStudentId(user) : 0;
      const [rows] = await pool.execute<MaterialRow[]>(
        studentId
          ? `SELECT DISTINCT m.*
               FROM class_notebook_materials m
               JOIN class_notebooks n
                 ON n.school_id = m.school_id AND n.subject_id = m.subject_id
               JOIN class_notebook_pages p
                 ON p.notebook_id = n.id
                AND JSON_UNQUOTE(JSON_EXTRACT(p.background, '$.materialId')) = CAST(m.id AS CHAR)
              WHERE m.school_id = ? AND m.subject_id = ? AND n.student_id = ?
              ORDER BY m.created_at DESC, m.id DESC`
          : `SELECT * FROM class_notebook_materials
              WHERE school_id = ? AND subject_id = ?
              ORDER BY created_at DESC, id DESC`,
        studentId ? [schoolId, subjectId, studentId] : [schoolId, subjectId]
      );
      return NextResponse.json({ materials: rows.map(materialDto) });
    }

    if (action === "create_material") {
      if (!teacher) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const subjectId = Number(body?.subjectId || 0);
      const kind = String(body?.kind || "");
      const name = String(body?.name || "").trim().slice(0, 255);
      if (!schoolId || !subjectId || !name || !["docx", "pdf", "image"].includes(kind)) {
        return NextResponse.json({ message: "Material name, subject, and kind are required" }, { status: 400 });
      }
      const rawPages = Array.isArray(body?.pages) ? body.pages : [];
      const pages =
        kind === "docx"
          ? rawPages.map((page: { html?: unknown }) => ({
              html: sanitizeMaterialHtml(page?.html),
            }))
          : rawPages;
      if (pages.length < 1) {
        return NextResponse.json({ message: "Material pages are required" }, { status: 400 });
      }
      if (Buffer.byteLength(JSON.stringify(pages), "utf8") > 4 * 1024 * 1024) {
        return NextResponse.json(
          { message: "This document is too large to store; split it or share it as a PDF." },
          { status: 413 }
        );
      }
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO class_notebook_materials
          (school_id, subject_id, name, kind, pages, page_count, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          schoolId,
          subjectId,
          name,
          kind,
          json(pages, []),
          pages.length,
          Number(user.id || 0),
        ]
      );
      return NextResponse.json({ materialId: result.insertId });
    }

    if (action === "share_material") {
      if (!teacher) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const materialId = Number(body?.materialId || 0);
      const subjectClassId = Number(body?.subjectClassId || 0);
      const classId = Number(body?.classId || 0);
      const [materialRows] = await pool.execute<MaterialRow[]>(
        "SELECT * FROM class_notebook_materials WHERE id = ? AND school_id = ? LIMIT 1",
        [materialId, schoolId]
      );
      const material = materialRows[0];
      if (!material || !(await authorizeClassScope(user, schoolId, Number(material.subject_id), subjectClassId, classId))) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
      const targetIds = body?.allStudents
        ? (await pool.execute<RowDataPacket[]>(
            "SELECT id FROM students WHERE school_id = ? AND class_id = ? ORDER BY id",
            [schoolId, classId]
          ))[0].map((row) => Number(row.id))
        : Array.isArray(body?.studentIds)
          ? body.studentIds.map((id: unknown) => Number(id)).filter((id: number) => id > 0)
          : [];
      if (!targetIds.length) return NextResponse.json({ message: "Select at least one student" }, { status: 400 });
      const [validRows] = await pool.execute<RowDataPacket[]>(
        `SELECT id FROM students WHERE school_id = ? AND class_id = ? AND id IN (${targetIds.map(() => "?").join(",")})`,
        [schoolId, classId, ...targetIds]
      );
      const validIds = validRows.map((row) => Number(row.id));
      const materialPages = Array.isArray(parse(material.pages, []))
        ? (parse(material.pages, []) as Array<{ imageUrl?: string; html?: string }>)
        : [];
      const pagesPerStudent = materialPages.length;
      if (!pagesPerStudent) {
        return NextResponse.json({ message: "Material pages are missing" }, { status: 409 });
      }
      let pagesCreated = 0;
      for (const studentId of validIds) {
        const notebook = await ensureNotebook(schoolId, Number(material.subject_id), subjectClassId, classId, studentId);
        if (!notebook) continue;
        const [maxRows] = await pool.execute<RowDataPacket[]>(
          "SELECT COALESCE(MAX(page_index), -1) AS max_index FROM class_notebook_pages WHERE notebook_id = ?",
          [notebook.id]
        );
        let pageIndex = Number(maxRows[0]?.max_index ?? -1) + 1;
        for (let materialPage = 0; materialPage < pagesPerStudent; materialPage += 1) {
          await pool.execute(
            `INSERT INTO class_notebook_pages
              (notebook_id, page_index, title, background, student_annotations, teacher_annotations)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              notebook.id,
              pageIndex,
              `${material.name} — ${materialPage + 1}`.slice(0, 255),
              json({ materialId, materialPage }, {}),
              "[]",
              "[]",
            ]
          );
          pageIndex += 1;
          pagesCreated += 1;
        }
      }
      return NextResponse.json({
        students: validIds.length,
        pagesPerStudent,
        pagesCreated,
      });
    }

    if (action === "delete_material") {
      const materialId = Number(body?.materialId || 0);
      const subjectId = Number(body?.subjectId || 0);
      if (!teacher || !materialId || !subjectId) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const [result] = await pool.execute<ResultSetHeader>(
        `DELETE FROM class_notebook_materials
          WHERE id = ? AND school_id = ? AND subject_id = ?
            AND EXISTS (
              SELECT 1
                FROM subject_classes sc
                JOIN school_classes c
                  ON c.class_name = COALESCE(sc.base_class_label, sc.name)
               WHERE sc.subject_id = class_notebook_materials.subject_id
                 AND c.school_id = ?
            )`,
        [materialId, schoolId, subjectId, schoolId]
      );
      if (!result.affectedRows) return NextResponse.json({ message: "Material not found" }, { status: 404 });
      return NextResponse.json({ ok: true });
    }

    if (action === "create_page") {
      const subjectId = Number(body?.subjectId || 0);
      let subjectClassId = Number(body?.subjectClassId || 0);
      let classId = Number(body?.classId || 0);
      if (role === "STUDENT" && (!subjectClassId || !classId)) {
        classId = classId || (await studentClassId(user));
        if (classId && subjectId && !subjectClassId) {
          const [subjectRows] = await pool.execute<RowDataPacket[]>(
            `SELECT sc.id FROM subject_classes sc
              JOIN school_classes c
                ON c.id = ? AND c.class_name = COALESCE(sc.base_class_label, sc.name)
             WHERE sc.subject_id = ?
              ORDER BY is_active DESC, id ASC LIMIT 1`,
            [classId, subjectId]
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
          ? [await ownStudentId(user)]
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
        const [result] = await pool.execute<ResultSetHeader>(
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
      const owner =
        role === "STUDENT" ? await ownStudentId(user) : Number(page.student_id);
      if (role === "STUDENT" && owner !== Number(page.student_id)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const updates: string[] = [];
      const values: Array<string | number | null> = [];
      if (teacher) {
        if (body.background !== undefined) { updates.push("background = ?"); values.push(json(body.background, {})); }
        if (body.teacherAnnotations !== undefined) { updates.push("teacher_annotations = ?"); values.push(json(body.teacherAnnotations, [])); }
        if (body.title !== undefined) { updates.push("title = ?"); values.push(String(body.title || "").slice(0, 255)); }
        if (body.heading !== undefined) { updates.push("heading = ?"); values.push(body.heading == null ? null : String(body.heading).slice(0, 255)); }
      }
      if (role === "STUDENT" && body.studentAnnotations !== undefined) {
        updates.push("student_annotations = ?"); values.push(json(body.studentAnnotations, []));
      }
      if (role === "STUDENT" && body.title !== undefined) {
        updates.push("title = ?"); values.push(String(body.title || "").slice(0, 255));
      }
      if (role === "STUDENT" && body.heading !== undefined) {
        updates.push("heading = ?"); values.push(body.heading == null ? null : String(body.heading).slice(0, 255));
      }
      if (updates.length === 0) return NextResponse.json({ message: "No permitted changes" }, { status: 403 });
      values.push(pageId);
      await pool.execute(
        `UPDATE class_notebook_pages SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
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

    if (action === "duplicate_page") {
      if (!teacher || !pageId) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const [rows] = await pool.execute<(PageRow & NotebookRow)[]>(
        `SELECT p.*, n.school_id, n.student_id
           FROM class_notebook_pages p
           JOIN class_notebooks n ON n.id = p.notebook_id
          WHERE p.id = ? AND n.school_id = ? LIMIT 1`,
        [pageId, schoolId]
      );
      const page = rows[0];
      if (!page) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      const [maxRows] = await pool.execute<RowDataPacket[]>(
        "SELECT COALESCE(MAX(page_index), -1) AS max_index FROM class_notebook_pages WHERE notebook_id = ?",
        [page.notebook_id]
      );
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO class_notebook_pages
          (notebook_id, page_index, title, heading, background, student_annotations, teacher_annotations)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          page.notebook_id,
          Number(maxRows[0]?.max_index ?? -1) + 1,
          page.title || "",
          page.heading ?? null,
          page.background || "{}",
          "[]",
          page.teacher_annotations || "[]",
        ]
      );
      return NextResponse.json({ ok: true, pageId: result.insertId });
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
      if (
        !notebook ||
        (role === "STUDENT" &&
          Number(notebook.student_id) !== (await ownStudentId(user)))
      ) {
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
