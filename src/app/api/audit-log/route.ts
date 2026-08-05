import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { DATA_DIR } from "@/lib/server/dataDir";
import { asRecord } from "@/lib/safeRecord";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AuditEntry = {
  id: string; actorId: string; actorRole: string; action: string;
  targetId: string; description: string; timestamp: string;
};
const filePath = path.join(DATA_DIR, "audit-log", "entries.json");
const maxEntries = 10000;
let queue: Promise<void> = Promise.resolve();

const readEntries = async (): Promise<AuditEntry[]> => {
  try {
    const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
    return Array.isArray(parsed?.entries) ? parsed.entries : [];
  } catch (error: unknown) {
    if (asRecord(error)?.code === "ENOENT" || error instanceof SyntaxError) return [];
    throw error;
  }
};
const writeEntries = async (entries: AuditEntry[]) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temp = `${filePath}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temp, JSON.stringify({ entries }, null, 2), "utf8");
    await fs.rename(temp, filePath);
  } catch (error) {
    await fs.rm(temp, { force: true }).catch(() => {});
    throw error;
  }
};

export async function GET(request: NextRequest) {
  const limit = Math.min(500, Math.max(1, Number(request.nextUrl.searchParams.get("limit") || 100)));
  const entries = (await readEntries()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return NextResponse.json({ data: entries.slice(0, limit) });
}

export async function POST(request: NextRequest) {
  const record = asRecord(await request.json().catch(() => null));
  const fields = ["actorId", "actorRole", "action", "targetId", "description", "timestamp"];
  if (fields.some((field) => !String(record?.[field] || "").trim())) {
    return NextResponse.json({ error: "All audit fields are required." }, { status: 400 });
  }
  const entry = { id: randomUUID(), ...Object.fromEntries(fields.map((f) => [f, String(record?.[f]).trim()])) } as AuditEntry;
  const operation = queue.then(async () => {
    const entries = [...(await readEntries()), entry].slice(-maxEntries);
    await writeEntries(entries);
  });
  queue = operation.catch(() => {});
  await operation;
  return NextResponse.json({ data: entry }, { status: 201 });
}
