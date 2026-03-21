import { fetchAnnouncements } from "@/services/announcementApi";
import { fetchManageAssignments } from "@/services/mindUpgradeApi";
import { fetchMaterials, fetchStudentMaterials } from "@/services/materialApi";
import {
  StoryComment,
  StoryFeedItem,
  StoryPostInput,
  StoryPostRecord,
  StoryItemType,
  StoryReaction,
  StoryReactionSummary,
  StoryReactionType,
} from "@/types/classStory";

type FeedParams = {
  classId: string;
  subjectId?: number | null;
  role?: string;
  userId?: string;
  preferStudentMaterials?: boolean;
};

type RawRecord = Record<string, unknown>;

const storyStorageKey = (
  scope: "posts" | "comments" | "reactions",
  subjectId?: number | null
): string => {
  const base =
    scope === "posts"
      ? "class-story-posts-v1"
      : scope === "comments"
        ? "class-story-comments-v1"
        : "class-story-reactions-v1";
  return subjectId ? `${base}-s${subjectId}` : base;
};

export const STORY_REACTION_OPTIONS: Array<{ key: StoryReactionType; emoji: string; label: string }> = [
  { key: "like", emoji: "👍", label: "Like" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "laugh", emoji: "😂", label: "Laugh" },
  { key: "surprise", emoji: "😮", label: "Surprise" },
  { key: "cry", emoji: "😢", label: "Cry" },
  { key: "clap", emoji: "👏", label: "Clap" },
  { key: "angry", emoji: "😠", label: "Angry" },
];

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const readStorageArray = <T>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  return safeParse<T[]>(window.localStorage.getItem(key), []);
};

const writeStorageArray = <T>(key: string, value: T[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const toStringId = (value: unknown, fallbackPrefix = "id") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return `${fallbackPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const getMaybeString = (raw: RawRecord, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
};

const getMaybeNumber = (raw: RawRecord, keys: string[]): number | undefined => {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
};

const normalizeRoleValue = (value: string) => value.trim().toUpperCase().replace(/\s+/g, "_");

const getClassIdFromRaw = (raw: RawRecord): string | undefined => {
  const direct = getMaybeNumber(raw, ["class_id", "classId"]);
  if (direct !== undefined) return String(direct);

  const classObj = raw.class;
  if (classObj && typeof classObj === "object") {
    const nested = getMaybeNumber(classObj as RawRecord, ["id", "class_id"]);
    if (nested !== undefined) return String(nested);
  }

  return undefined;
};

const itemId = (type: StoryItemType, sourceId: string) => `${type}:${sourceId}`;

const canSeeAnnouncement = (rawRole: unknown, currentRole?: string) => {
  if (!currentRole) return true;
  const normalizedCurrent = normalizeRoleValue(currentRole);
  const roles = Array.isArray(rawRole)
    ? rawRole
    : typeof rawRole === "string"
      ? [rawRole]
      : [];

  if (roles.length === 0) return true;

  const normalizedTargets = roles
    .map((entry) => (typeof entry === "string" ? normalizeRoleValue(entry) : ""))
    .filter(Boolean);

  return normalizedTargets.includes("ALL") || normalizedTargets.includes(normalizedCurrent);
};

const getReactionSummary = (itemIdValue: string, subjectId?: number | null): StoryReactionSummary => {
  const reactions = readStorageArray<StoryReaction>(storyStorageKey("reactions", subjectId)).filter(
    (entry) => entry.itemId === itemIdValue
  );

  return reactions.reduce<StoryReactionSummary>((acc, entry) => {
    const nextCount = (acc[entry.reaction] ?? 0) + 1;
    return { ...acc, [entry.reaction]: nextCount };
  }, {});
};

const getTotalReactions = (summary: StoryReactionSummary) => {
  return Object.values(summary).reduce((sum, count) => sum + (count ?? 0), 0);
};

const getViewerReaction = (itemIdValue: string, userId?: string, subjectId?: number | null) => {
  if (!userId) return null;
  const reactions = readStorageArray<StoryReaction>(storyStorageKey("reactions", subjectId));
  const entry = reactions.find((reaction) => reaction.itemId === itemIdValue && reaction.userId === userId);
  return entry?.reaction ?? null;
};

const toAnnouncementItems = (
  items: unknown,
  classId: string,
  currentRole?: string
): StoryFeedItem[] => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((entry): entry is RawRecord => !!entry && typeof entry === "object")
    .filter((entry) => canSeeAnnouncement(entry.role, currentRole))
    .filter((entry) => {
      const itemClassId = getClassIdFromRaw(entry);
      return !itemClassId || itemClassId === classId;
    })
    .map((entry) => {
      const sourceId = toStringId(entry.id, "announcement");
      const entryType = getMaybeString(entry, ["type"]) === "event" ? "event" : "announcement";
      const title = getMaybeString(entry, ["title", "name"]) ?? "Announcement";
      const body = getMaybeString(entry, ["description", "content"]) ?? "";

      return {
        id: itemId(entryType, sourceId),
        sourceId,
        classId,
        type: entryType,
        title,
        body,
        authorId: getMaybeString(entry, ["author_id", "authorId", "created_by"]),
        authorName: getMaybeString(entry, ["author_name", "author", "created_by_name"]) ?? "School Team",
        createdAt:
          getMaybeString(entry, ["created_at", "createdAt", "updated_at"]) ??
          new Date().toISOString(),
        attachmentUrl: getMaybeString(entry, ["file_path", "attachment", "url"]),
        attachmentLabel: getMaybeString(entry, ["file_name", "attachment_label"]),
        attachmentType: "link",
        likeCount: 0,
        totalReactions: 0,
        reactionSummary: {},
        viewerReaction: null,
        commentCount: 0,
      } satisfies StoryFeedItem;
    });
};

const toMaterialItems = (items: unknown, classId: string): StoryFeedItem[] => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((entry): entry is RawRecord => !!entry && typeof entry === "object")
    .filter((entry) => {
      const itemClassId = getClassIdFromRaw(entry);
      return !itemClassId || itemClassId === classId;
    })
    .map((entry) => {
      const sourceId = toStringId(entry.id, "resource");
      const title = getMaybeString(entry, ["title", "name", "material_name"]) ?? "Resource";
      const body = getMaybeString(entry, ["description", "content"]) ?? "";
      const attachmentUrl = getMaybeString(entry, ["file_path", "path", "link", "url"]);
      const attachmentType = attachmentUrl?.startsWith("http") ? "link" : "file";

      return {
        id: itemId("resource", sourceId),
        sourceId,
        classId,
        type: "resource",
        title,
        body,
        authorId: getMaybeString(entry, ["author_id", "authorId", "teacher_id"]),
        authorName: getMaybeString(entry, ["author_name", "teacher_name", "created_by_name"]) ?? "Teacher",
        createdAt:
          getMaybeString(entry, ["created_at", "createdAt", "updated_at"]) ??
          new Date().toISOString(),
        attachmentUrl,
        attachmentLabel: attachmentUrl ? "Open resource" : undefined,
        attachmentType,
        likeCount: 0,
        totalReactions: 0,
        reactionSummary: {},
        viewerReaction: null,
        commentCount: 0,
      } satisfies StoryFeedItem;
    });
};

const toAssignmentItems = (items: unknown, classId: string): StoryFeedItem[] => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((entry): entry is RawRecord => !!entry && typeof entry === "object")
    .filter((entry) => {
      const itemClassId = getMaybeNumber(entry, ["class_id"]);
      if (itemClassId === undefined) return true;
      return String(itemClassId) === classId;
    })
    .map((entry) => {
      const sourceId = toStringId(entry.id, "assignment");
      const title = getMaybeString(entry, ["title", "course_key", "name"]) ?? "Assignment";
      const startsAt = getMaybeString(entry, ["starts_at"]);
      const endsAt = getMaybeString(entry, ["ends_at"]);
      const body =
        startsAt || endsAt
          ? `Active window${startsAt ? ` from ${new Date(startsAt).toLocaleDateString()}` : ""}${
              endsAt ? ` to ${new Date(endsAt).toLocaleDateString()}` : ""
            }`
          : "Assignment posted";

      return {
        id: itemId("assignment", sourceId),
        sourceId,
        classId,
        type: "assignment",
        title,
        body,
        authorId: getMaybeString(entry, ["teacher_id", "author_id", "authorId"]),
        authorName: getMaybeString(entry, ["teacher_name", "author_name"]) ?? "Teacher",
        createdAt: startsAt ?? endsAt ?? new Date().toISOString(),
        likeCount: 0,
        totalReactions: 0,
        reactionSummary: {},
        viewerReaction: null,
        commentCount: 0,
      } satisfies StoryFeedItem;
    });
};

const toPostItems = (classId: string, subjectId?: number | null): StoryFeedItem[] => {
  const posts = readStorageArray<StoryPostRecord>(storyStorageKey("posts", subjectId));

  return posts
    .filter((post) => post.classId === classId)
    .map((post) => ({
      id: itemId("post", post.id),
      sourceId: post.id,
      classId: post.classId,
      type: "post",
      title: post.title,
      body: post.body,
      authorId: post.authorId,
      authorName: post.authorName,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      attachmentUrl: post.attachmentUrl,
      attachmentLabel: post.attachmentLabel,
      attachmentType: post.attachmentType,
      likeCount: 0,
      totalReactions: 0,
      reactionSummary: {},
      viewerReaction: null,
      commentCount: 0,
    }));
};

const withEngagementCounts = (items: StoryFeedItem[], userId?: string, subjectId?: number | null): StoryFeedItem[] => {
  const comments = readStorageArray<StoryComment>(storyStorageKey("comments", subjectId));

  return items.map((item) => {
    const summary = getReactionSummary(item.id, subjectId);
    return {
      ...item,
      likeCount: summary.like ?? 0,
      totalReactions: getTotalReactions(summary),
      reactionSummary: summary,
      viewerReaction: getViewerReaction(item.id, userId, subjectId),
      commentCount: comments.filter((entry) => entry.itemId === item.id).length,
    };
  });
};

export const fetchClassStoryFeed = async ({
  classId,
  subjectId,
  role,
  userId,
  preferStudentMaterials,
}: FeedParams): Promise<StoryFeedItem[]> => {
  const [announcementResult, materialResult, assignmentResult] = await Promise.allSettled([
    fetchAnnouncements(),
    preferStudentMaterials ? fetchStudentMaterials(subjectId) : fetchMaterials(subjectId),
    fetchManageAssignments({ class_id: classId }),
  ]);

  const announcements =
    announcementResult.status === "fulfilled"
      ? toAnnouncementItems(announcementResult.value, classId, role)
      : [];
  const materials =
    materialResult.status === "fulfilled"
      ? toMaterialItems(materialResult.value, classId)
      : [];
  const assignments =
    assignmentResult.status === "fulfilled"
      ? toAssignmentItems(assignmentResult.value, classId)
      : [];

  const posts = toPostItems(classId, subjectId);

  return withEngagementCounts([...posts, ...announcements, ...assignments, ...materials], userId, subjectId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const createClassStoryPost = async (params: {
  classId: string;
  subjectId?: number | null;
  input: StoryPostInput;
  authorId: string;
  authorName: string;
}): Promise<StoryPostRecord> => {
  const postsKey = storyStorageKey("posts", params.subjectId);
  const posts = readStorageArray<StoryPostRecord>(postsKey);
  const created: StoryPostRecord = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    classId: params.classId,
    title: params.input.title,
    body: params.input.body,
    authorId: params.authorId,
    authorName: params.authorName,
    createdAt: new Date().toISOString(),
    attachmentUrl: params.input.attachmentUrl,
    attachmentLabel: params.input.attachmentLabel,
    attachmentType: params.input.attachmentType,
  };

  writeStorageArray(postsKey, [created, ...posts]);
  return created;
};

export const updateClassStoryPost = async (params: {
  postId: string;
  subjectId?: number | null;
  input: StoryPostInput;
}): Promise<StoryPostRecord | null> => {
  const postsKey = storyStorageKey("posts", params.subjectId);
  const posts = readStorageArray<StoryPostRecord>(postsKey);
  const index = posts.findIndex((post) => post.id === params.postId);
  if (index < 0) return null;

  const updated: StoryPostRecord = {
    ...posts[index],
    title: params.input.title,
    body: params.input.body,
    updatedAt: new Date().toISOString(),
    attachmentUrl: params.input.attachmentUrl,
    attachmentLabel: params.input.attachmentLabel,
    attachmentType: params.input.attachmentType,
  };

  const next = [...posts];
  next[index] = updated;
  writeStorageArray(postsKey, next);
  return updated;
};

export const deleteClassStoryPost = async (params: { postId: string; subjectId?: number | null }) => {
  const postsKey = storyStorageKey("posts", params.subjectId);
  const commentsKey = storyStorageKey("comments", params.subjectId);
  const reactionsKey = storyStorageKey("reactions", params.subjectId);

  const posts = readStorageArray<StoryPostRecord>(postsKey);
  const nextPosts = posts.filter((post) => post.id !== params.postId);
  writeStorageArray(postsKey, nextPosts);

  const postItemId = itemId("post", params.postId);
  const comments = readStorageArray<StoryComment>(commentsKey).filter(
    (comment) => comment.itemId !== postItemId
  );
  writeStorageArray(commentsKey, comments);

  const reactions = readStorageArray<StoryReaction>(reactionsKey).filter(
    (reaction) => reaction.itemId !== postItemId
  );
  writeStorageArray(reactionsKey, reactions);
};

export const fetchStoryComments = (itemIdValue: string, subjectId?: number | null): StoryComment[] => {
  const comments = readStorageArray<StoryComment>(storyStorageKey("comments", subjectId));
  return comments
    .filter((entry) => entry.itemId === itemIdValue)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const addStoryComment = (params: {
  itemId: string;
  classId: string;
  subjectId?: number | null;
  body: string;
  authorId: string;
  authorName: string;
}): StoryComment => {
  const commentsKey = storyStorageKey("comments", params.subjectId);
  const comments = readStorageArray<StoryComment>(commentsKey);
  const created: StoryComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId: params.itemId,
    classId: params.classId,
    body: params.body,
    authorId: params.authorId,
    authorName: params.authorName,
    createdAt: new Date().toISOString(),
  };

  writeStorageArray(commentsKey, [...comments, created]);
  return created;
};

export const updateStoryComment = (params: { commentId: string; subjectId?: number | null; body: string }): StoryComment | null => {
  const commentsKey = storyStorageKey("comments", params.subjectId);
  const comments = readStorageArray<StoryComment>(commentsKey);
  const index = comments.findIndex((comment) => comment.id === params.commentId);
  if (index < 0) return null;

  const updated: StoryComment = {
    ...comments[index],
    body: params.body,
    updatedAt: new Date().toISOString(),
  };

  const next = [...comments];
  next[index] = updated;
  writeStorageArray(commentsKey, next);
  return updated;
};

export const deleteStoryComment = (params: { commentId: string; subjectId?: number | null }) => {
  const commentsKey = storyStorageKey("comments", params.subjectId);
  const comments = readStorageArray<StoryComment>(commentsKey);
  writeStorageArray(
    commentsKey,
    comments.filter((comment) => comment.id !== params.commentId)
  );
};

export const setStoryReaction = (params: {
  itemId: string;
  classId: string;
  subjectId?: number | null;
  userId: string;
  reaction: StoryReactionType;
}): {
  reaction: StoryReactionType | null;
  summary: StoryReactionSummary;
  totalReactions: number;
} => {
  const reactionsKey = storyStorageKey("reactions", params.subjectId);
  const reactions = readStorageArray<StoryReaction>(reactionsKey);
  const index = reactions.findIndex(
    (entry) => entry.itemId === params.itemId && entry.userId === params.userId
  );

  let next: StoryReaction[] = reactions;
  let appliedReaction: StoryReactionType | null = params.reaction;

  if (index >= 0 && reactions[index].reaction === params.reaction) {
    next = reactions.filter((_, entryIndex) => entryIndex !== index);
    appliedReaction = null;
  } else if (index >= 0) {
    const updated: StoryReaction = {
      ...reactions[index],
      reaction: params.reaction,
      updatedAt: new Date().toISOString(),
    };
    next = [...reactions];
    next[index] = updated;
  } else {
    next = [
      ...reactions,
      {
        id: `reaction-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        itemId: params.itemId,
        classId: params.classId,
        userId: params.userId,
        reaction: params.reaction,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  writeStorageArray(reactionsKey, next);

  const summary = getReactionSummary(params.itemId, params.subjectId);
  return {
    reaction: appliedReaction,
    summary,
    totalReactions: getTotalReactions(summary),
  };
};

export const getStoryReactionByUser = (params: {
  itemId: string;
  userId: string;
  subjectId?: number | null;
}): StoryReactionType | null => {
  return getViewerReaction(params.itemId, params.userId, params.subjectId);
};

export const getStoryReactionSummary = (itemIdValue: string, subjectId?: number | null): StoryReactionSummary => {
  return getReactionSummary(itemIdValue, subjectId);
};
