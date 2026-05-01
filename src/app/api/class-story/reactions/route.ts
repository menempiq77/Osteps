import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { StoryReaction, StoryReactionType } from "@/types/classStory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReactionPayload = {
  itemId?: string;
  classId?: string;
  subjectId?: string | number | null;
  userId?: string;
  userName?: string;
  reaction?: StoryReactionType;
};

const STORE_DIR = path.join(process.cwd(), ".data", "class-story", "reactions");

const safeSegment = (value: string | number | null | undefined) =>
  String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");

const reactionsPath = (classId: string, subjectId?: string | null) =>
  path.join(
    STORE_DIR,
    safeSegment(subjectId || "global"),
    `${safeSegment(classId)}.json`
  );

const readReactions = async (
  classId: string,
  subjectId?: string | null
): Promise<StoryReaction[]> => {
  const filePath = reactionsPath(classId, subjectId);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoryReaction[]) : [];
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
    return [];
  }
};

const writeReactions = async (
  classId: string,
  subjectId: string | null | undefined,
  reactions: StoryReaction[]
) => {
  const filePath = reactionsPath(classId, subjectId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(reactions, null, 2), "utf8");
};

const normalizeSubjectId = (value: string | null) => {
  const normalized = String(value || "").trim();
  return normalized || null;
};

export async function GET(request: NextRequest) {
  const classId = String(request.nextUrl.searchParams.get("classId") || "").trim();
  const subjectId = normalizeSubjectId(request.nextUrl.searchParams.get("subjectId"));
  const itemId = String(request.nextUrl.searchParams.get("itemId") || "").trim();

  if (!classId) {
    return NextResponse.json({ message: "classId is required" }, { status: 400 });
  }

  const reactions = await readReactions(classId, subjectId);
  const filtered = itemId
    ? reactions.filter((entry) => entry.itemId === itemId)
    : reactions;

  return NextResponse.json({ data: filtered });
}

export async function POST(request: NextRequest) {
  let payload: ReactionPayload;
  try {
    payload = (await request.json()) as ReactionPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const classId = String(payload.classId || "").trim();
  const itemId = String(payload.itemId || "").trim();
  const userId = String(payload.userId || "").trim();
  const userName = String(payload.userName || "").trim();
  const subjectId = normalizeSubjectId(
    payload.subjectId == null ? null : String(payload.subjectId)
  );
  const reaction = payload.reaction;

  if (!classId || !itemId || !userId || !userName || !reaction) {
    return NextResponse.json(
      { message: "classId, itemId, userId, userName and reaction are required" },
      { status: 400 }
    );
  }

  const reactions = await readReactions(classId, subjectId);
  const index = reactions.findIndex(
    (entry) => entry.itemId === itemId && entry.userId === userId
  );

  let nextReactions = reactions;
  let appliedReaction: StoryReactionType | null = reaction;

  if (index >= 0 && reactions[index].reaction === reaction) {
    nextReactions = reactions.filter((_, entryIndex) => entryIndex !== index);
    appliedReaction = null;
  } else if (index >= 0) {
    const updated: StoryReaction = {
      ...reactions[index],
      userName,
      reaction,
      updatedAt: new Date().toISOString(),
    };
    nextReactions = [...reactions];
    nextReactions[index] = updated;
  } else {
    nextReactions = [
      ...reactions,
      {
        id: `reaction-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        itemId,
        classId,
        userId,
        userName,
        reaction,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  await writeReactions(classId, subjectId, nextReactions);

  return NextResponse.json({
    reaction: appliedReaction,
    data: nextReactions.filter((entry) => entry.itemId === itemId),
  });
}