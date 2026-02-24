import fs from "fs/promises";
import path from "path";

type NotesMap = Record<string, string>;

const DATA_DIR = path.join(process.cwd(), ".data");
const NOTES_FILE = path.join(DATA_DIR, "student-notes.json");

async function ensureStoreFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(NOTES_FILE);
  } catch {
    await fs.writeFile(NOTES_FILE, "{}", "utf8");
  }
}

async function readStore(): Promise<NotesMap> {
  await ensureStoreFile();
  try {
    const raw = await fs.readFile(NOTES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as NotesMap;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeStore(data: NotesMap): Promise<void> {
  await ensureStoreFile();
  await fs.writeFile(NOTES_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getStudentNote(studentId: string): Promise<string> {
  const store = await readStore();
  return String(store[studentId] ?? "");
}

export async function setStudentNote(studentId: string, note: string): Promise<void> {
  const store = await readStore();
  store[studentId] = note;
  await writeStore(store);
}

