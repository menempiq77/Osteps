import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { StoryPostInput, StoryPostRecord } from "@/types/classStory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreatePostPayload = {
  classId?: string;
  subjectId?: string | number | null;
  input?: StoryPostInput;
  authorId?: string;
  authorName?: string;
  records?: StoryPostRecord[];
};

type UpdatePostPayload = {
  classId?: string;
  subjectId?: string | number | null;
  postId?: string;
  input?: StoryPostInput;
};

const STORE_DIR = path.join(process.cwd(), ".data", "class-story", "posts");

const safeSegment = (value: string | number | null | undefined) =>
  String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_");

const postsPath = (classId: string, subjectId?: string | null) =>
  path.join(
    STORE_DIR,
    safeSegment(subjectId || "global"),
    `${safeSegment(classId)}.json`
  );

const normalizeSubjectId = (value: string | null) => {
  const normalized = String(value || "").trim();
  return normalized || null;
};

const readPosts = async (
  classId: string,
  subjectId?: string | null
): Promise<StoryPostRecord[]> => {
  const filePath = postsPath(classId, subjectId);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoryPostRecord[]) : [];
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
    return [];
  }
};

const writePosts = async (
  classId: string,
  subjectId: string | null | undefined,
  posts: StoryPostRecord[]
) => {
  const filePath = postsPath(classId, subjectId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf8");
};

const sortPosts = (posts: StoryPostRecord[]) =>
  [...posts].sort(
    (left, right) =>
      new Date(right.updatedAt || right.createdAt).getTime() -
      new Date(left.updatedAt || left.createdAt).getTime()
  );

export async function GET(request: NextRequest) {
  const classId = String(request.nextUrl.searchParams.get("classId") || "").trim();
  const subjectId = normalizeSubjectId(request.nextUrl.searchParams.get("subjectId"));

  if (!classId) {
    return NextResponse.json({ message: "classId is required" }, { status: 400 });
  }

  const posts = await readPosts(classId, subjectId);
  return NextResponse.json({ data: sortPosts(posts) });
}

export async function POST(request: NextRequest) {
  let payload: CreatePostPayload;
  try {
    payload = (await request.json()) as CreatePostPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const classId = String(payload.classId || "").trim();
  const subjectId = normalizeSubjectId(
    payload.subjectId == null ? null : String(payload.subjectId)
  );

  if (!classId) {
    return NextResponse.json({ message: "classId is required" }, { status: 400 });
  }

  const posts = await readPosts(classId, subjectId);

  if (Array.isArray(payload.records) && payload.records.length > 0) {
    const existingIds = new Set(posts.map((post) => post.id));
    const importedRecords = payload.records
      .filter((record) => record.classId === classId)
      .filter((record) => !existingIds.has(record.id));

    const nextPosts = sortPosts([...posts, ...importedRecords]);
    await writePosts(classId, subjectId, nextPosts);
    return NextResponse.json({ data: nextPosts });
  }

  if (!payload.input || !payload.authorId || !payload.authorName) {
    return NextResponse.json(
      { message: "input, authorId and authorName are required" },
      { status: 400 }
    );
  }

  const created: StoryPostRecord = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    classId,
    title: payload.input.title,
    body: payload.input.body,
    authorId: payload.authorId,
    authorName: payload.authorName,
    createdAt: new Date().toISOString(),
    attachmentUrl: payload.input.attachmentUrl,
    attachmentLabel: payload.input.attachmentLabel,
    attachmentType: payload.input.attachmentType,
  };

  const nextPosts = sortPosts([created, ...posts]);
  await writePosts(classId, subjectId, nextPosts);
  return NextResponse.json({ record: created, data: nextPosts });
}

export async function PUT(request: NextRequest) {
  let payload: UpdatePostPayload;
  try {
    payload = (await request.json()) as UpdatePostPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const classId = String(payload.classId || "").trim();
  const postId = String(payload.postId || "").trim();
  const subjectId = normalizeSubjectId(
    payload.subjectId == null ? null : String(payload.subjectId)
  );

  if (!classId || !postId || !payload.input) {
    return NextResponse.json(
      { message: "classId, postId and input are required" },
      { status: 400 }
    );
  }

  const posts = await readPosts(classId, subjectId);
  const index = posts.findIndex((post) => post.id === postId);
  if (index < 0) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const updated: StoryPostRecord = {
    ...posts[index],
    title: payload.input.title,
    body: payload.input.body,
    updatedAt: new Date().toISOString(),
    attachmentUrl: payload.input.attachmentUrl,
    attachmentLabel: payload.input.attachmentLabel,
    attachmentType: payload.input.attachmentType,
  };

  const nextPosts = [...posts];
  nextPosts[index] = updated;
  const sorted = sortPosts(nextPosts);
  await writePosts(classId, subjectId, sorted);
  return NextResponse.json({ record: updated, data: sorted });
}

export async function DELETE(request: NextRequest) {
  const classId = String(request.nextUrl.searchParams.get("classId") || "").trim();
  const postId = String(request.nextUrl.searchParams.get("postId") || "").trim();
  const subjectId = normalizeSubjectId(request.nextUrl.searchParams.get("subjectId"));

  if (!classId || !postId) {
    return NextResponse.json({ message: "classId and postId are required" }, { status: 400 });
  }

  const posts = await readPosts(classId, subjectId);
  const nextPosts = posts.filter((post) => post.id !== postId);
  await writePosts(classId, subjectId, nextPosts);
  return NextResponse.json({ data: sortPosts(nextPosts) });
}