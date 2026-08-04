import fs from "fs/promises";
import path from "path";
import mysql from "mysql2/promise";

const DATA_DIR = process.env.OSTEPS_DATA_DIR || "/var/www/osteps/Osteps/.data";
const STORE_DIR = path.join(DATA_DIR, "assessment-documents");

const toIsoOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 19).replace("T", " ");
};

async function main() {
  const pool = mysql.createPool({
    host: process.env.OSTEPS_MYSQL_HOST,
    port: Number(process.env.OSTEPS_MYSQL_PORT || 3306),
    user: process.env.OSTEPS_MYSQL_USER,
    password: process.env.OSTEPS_MYSQL_PASSWORD,
    database: process.env.OSTEPS_MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
  });

  let count = 0;
  const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name.endsWith(".json")) {
        const rel = path.relative(STORE_DIR, fullPath);
        const [assessmentId, taskId, studentFile] = rel.split(path.sep);
        const studentId = studentFile.replace(/\.json$/, "");

        try {
          const raw = await fs.readFile(fullPath, "utf8");
          const state = JSON.parse(raw);

          await pool.execute(
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
              String(state.assessmentId ?? assessmentId),
              String(state.taskId ?? taskId),
              String(state.studentId ?? studentId),
              state.status || "draft",
              state.studentLocked ? 1 : 0,
              JSON.stringify(state.studentAnnotations || []),
              JSON.stringify(state.teacherAnnotations || []),
              JSON.stringify(state.metadata || {}),
              toIsoOrNull(state.submittedAt),
              toIsoOrNull(state.markedAt),
              new Date(state.updatedAt || Date.now()).toISOString().slice(0, 19).replace("T", " "),
            ]
          );

          count += 1;
          if (count % 50 === 0) {
            console.log(`Imported ${count} documents...`);
          }
        } catch (error) {
          console.error(`Failed to import ${fullPath}:`, error.message);
        }
      }
    }
  };

  try {
    await walk(STORE_DIR);
    console.log(`Done: imported ${count} documents.`);
  } catch (error) {
    console.error("Import failed:", error);
  } finally {
    await pool.end();
  }
}

main();
