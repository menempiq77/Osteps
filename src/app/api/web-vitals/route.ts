import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { DATA_DIR } from "@/lib/server/dataDir";
import { asRecord } from "@/lib/safeRecord";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WebVitalName = "LCP" | "CLS" | "INP" | "TTFB";

type WebVitalEvent = {
  id: string;
  name: WebVitalName;
  value: number;
  delta: number;
  rating?: string;
  navigationType?: string;
  pathname?: string;
  userAgent?: string;
  createdAt: string;
};

type WebVitalState = {
  metrics: WebVitalEvent[];
};

const STORE_DIR = path.join(DATA_DIR, "web-vitals");
const LOG_PATH = path.join(STORE_DIR, "metrics.json");
const VALID_NAMES = new Set<WebVitalName>(["LCP", "CLS", "INP", "TTFB"]);

const readMetricState = async (): Promise<WebVitalState> => {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<WebVitalState>;
    return { metrics: Array.isArray(parsed.metrics) ? parsed.metrics : [] };
  } catch (error: unknown) {
    if (asRecord(error)?.code === "ENOENT") return { metrics: [] };
    throw error;
  }
};

const writeMetricState = async (state: WebVitalState) => {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(LOG_PATH, JSON.stringify(state, null, 2), "utf8");
};

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const record = asRecord(payload);
  const name = String(record?.name || "") as WebVitalName;
  const value = Number(record?.value);
  const delta = Number(record?.delta ?? 0);

  if (!VALID_NAMES.has(name) || !Number.isFinite(value) || !Number.isFinite(delta)) {
    return NextResponse.json({ message: "Invalid web vital metric" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const event: WebVitalEvent = {
    id: String(record?.id || `${name}-${Date.now()}`),
    name,
    value,
    delta,
    rating: String(record?.rating || "") || undefined,
    navigationType: String(record?.navigationType || "") || undefined,
    pathname: String(record?.pathname || "") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    createdAt: now,
  };
  const state = await readMetricState();

  await writeMetricState({ metrics: [...state.metrics, event] });
  return NextResponse.json({ data: event });
}
