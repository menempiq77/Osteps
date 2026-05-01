import { fetchAnnouncements } from "@/services/announcementApi";
import { fetchAssessment, fetchAssessmentByStudent } from "@/services/api";
import { fetchManageAssignments } from "@/services/mindUpgradeApi";
import { fetchMaterials, fetchStudentMaterials } from "@/services/materialApi";
import { fetchTrackers } from "@/services/trackersApi";
import { fetchTerm } from "@/services/termsApi";
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

type SharedReactionResponse = {
  data?: StoryReaction[];
  reaction?: StoryReactionType | null;
};

type SharedPostResponse = {
  data?: StoryPostRecord[];
  record?: StoryPostRecord | null;
};

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

  const getMaybeArray = (raw: RawRecord, keys: string[]): unknown[] | undefined => {
    for (const key of keys) {
      const value = raw[key];
      if (Array.isArray(value)) return value;
    }
    return undefined;
  };

const normalizeRoleValue = (value: string) => value.trim().toUpperCase().replace(/\s+/g, "_");

  const normalizeStatusValue = (value: unknown) => String(value ?? "").trim().toLowerCase();

const buildStoryReactionsUrl = (
  classId: string,
  subjectId?: number | null,
  itemId?: string
) => {
  const params = new URLSearchParams();
  params.set("classId", classId);
  if (subjectId != null && Number.isFinite(Number(subjectId)) && Number(subjectId) > 0) {
    params.set("subjectId", String(subjectId));
  }
  if (itemId) {
    params.set("itemId", itemId);
  }
  return `/api/class-story/reactions?${params.toString()}`;
};

const buildStoryPostsUrl = (
  classId: string,
  subjectId?: number | null,
  postId?: string
) => {
  const params = new URLSearchParams();
  params.set("classId", classId);
  if (subjectId != null && Number.isFinite(Number(subjectId)) && Number(subjectId) > 0) {
    params.set("subjectId", String(subjectId));
  }
  if (postId) {
    params.set("postId", postId);
  }
  return `/api/class-story/posts?${params.toString()}`;
};

const fetchSharedStoryPosts = async (params: {
  classId: string;
  subjectId?: number | null;
}): Promise<StoryPostRecord[]> => {
  const response = await fetch(buildStoryPostsUrl(params.classId, params.subjectId), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch story posts");
  }

  const payload = (await response.json()) as SharedPostResponse;
  return Array.isArray(payload.data) ? payload.data : [];
};

const importLegacyStoryPosts = async (params: {
  classId: string;
  subjectId?: number | null;
  records: StoryPostRecord[];
}) => {
  const response = await fetch(buildStoryPostsUrl(params.classId, params.subjectId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: params.records }),
  });

  if (!response.ok) {
    throw new Error("Failed to import legacy story posts");
  }

  const payload = (await response.json()) as SharedPostResponse;
  return Array.isArray(payload.data) ? payload.data : [];
};

const getLegacyStoryPostSyncKey = (classId: string, subjectId?: number | null) =>
  `class-story-post-sync-v1-${subjectId ?? "global"}-${classId}`;

const syncLegacyStoryPosts = async (params: {
  classId: string;
  subjectId?: number | null;
}) => {
  if (typeof window === "undefined") return;

  const legacyPostsKey = storyStorageKey("posts", params.subjectId);
  const legacyPosts = readStorageArray<StoryPostRecord>(legacyPostsKey).filter(
    (post) => post.classId === params.classId
  );

  if (legacyPosts.length === 0) return;

  const syncKey = getLegacyStoryPostSyncKey(params.classId, params.subjectId);
  if (window.sessionStorage.getItem(syncKey) === "1") return;

  const sharedPosts = await fetchSharedStoryPosts(params).catch(() => []);
  const sharedIds = new Set(sharedPosts.map((post) => post.id));
  const missingPosts = legacyPosts.filter((post) => !sharedIds.has(post.id));

  if (missingPosts.length > 0) {
    await importLegacyStoryPosts({
      classId: params.classId,
      subjectId: params.subjectId,
      records: missingPosts,
    });
  }

  const remainingLegacyPosts = readStorageArray<StoryPostRecord>(legacyPostsKey).filter(
    (post) =>
      post.classId !== params.classId ||
      !legacyPosts.some((legacyPost) => legacyPost.id === post.id)
  );
  writeStorageArray(legacyPostsKey, remainingLegacyPosts);
  window.sessionStorage.setItem(syncKey, "1");
};

const fetchSharedStoryReactions = async (params: {
  classId: string;
  subjectId?: number | null;
}): Promise<StoryReaction[]> => {
  const response = await fetch(buildStoryReactionsUrl(params.classId, params.subjectId), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch story reactions");
  }

  const payload = (await response.json()) as SharedReactionResponse;
  return Array.isArray(payload.data) ? payload.data : [];
};

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

const formatStoryDateLabel = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getNearestDueDate = (tasks: unknown) => {
  if (!Array.isArray(tasks)) return undefined;

  const now = Date.now();
  const datedTasks = tasks
    .filter((entry): entry is RawRecord => !!entry && typeof entry === "object")
    .map((entry) => getMaybeString(entry, ["due_date", "dueDate"]))
    .filter((value): value is string => Boolean(value))
    .map((value) => ({ value, timestamp: new Date(value).getTime() }))
    .filter((entry) => Number.isFinite(entry.timestamp));

  if (datedTasks.length === 0) return undefined;

  const futureTasks = datedTasks.filter((entry) => entry.timestamp >= now);
  if (futureTasks.length > 0) {
    futureTasks.sort(
      (left, right) =>
        Math.abs(left.timestamp - now) - Math.abs(right.timestamp - now)
    );
    return futureTasks[0].value;
  }

  datedTasks.sort((left, right) => right.timestamp - left.timestamp);
  return datedTasks[0].value;
};

const isVisibleAssessmentFeedItem = (entry: RawRecord, termId: number) => {
  const entryType = getMaybeString(entry, ["type"]);

  if (entryType === "quiz") {
    const itemTermId = getMaybeNumber(entry, ["term_id"]);
    return itemTermId == null || Number(itemTermId) === Number(termId);
  }

  if (entryType === "assessment") {
    const assignedRows = getMaybeArray(entry, ["assigned", "assign_assessments"])
      ?.filter((row): row is RawRecord => !!row && typeof row === "object") ?? [];

    if (assignedRows.length === 0) {
      return true;
    }

    return assignedRows.some((row) => {
      const assignedTermId = getMaybeNumber(row, ["term_id"]);
      return (
        assignedTermId != null &&
        Number(assignedTermId) === Number(termId) &&
        normalizeStatusValue(row.status) === "assigned"
      );
    });
  }

  return false;
};

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

const summarizeReactionEntries = (reactions: StoryReaction[]): StoryReactionSummary => {
  return reactions.reduce<StoryReactionSummary>((acc, entry) => {
    const nextCount = (acc[entry.reaction] ?? 0) + 1;
    return { ...acc, [entry.reaction]: nextCount };
  }, {});
};

const getReactionSummary = (itemIdValue: string, reactions: StoryReaction[]): StoryReactionSummary => {
  return summarizeReactionEntries(
    reactions.filter((entry) => entry.itemId === itemIdValue)
  );
};

const getTotalReactions = (summary: StoryReactionSummary) => {
  return Object.values(summary).reduce((sum, count) => sum + (count ?? 0), 0);
};

const getViewerReaction = (itemIdValue: string, userId?: string, reactions: StoryReaction[] = []) => {
  if (!userId) return null;
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

const toAssessmentStoryItems = (
  items: unknown,
  classId: string,
  termId: number,
  role?: string
): StoryFeedItem[] => {
  if (!Array.isArray(items)) return [];

  const normalizedRole = normalizeRoleValue(role ?? "");

  return items
    .filter((entry): entry is RawRecord => !!entry && typeof entry === "object")
    .filter((entry) => isVisibleAssessmentFeedItem(entry, termId))
    .map((entry) => {
      const entryType = getMaybeString(entry, ["type"]) === "quiz" ? "quiz" : "assessment";
      const quizRecord =
        entry.quiz && typeof entry.quiz === "object" ? (entry.quiz as RawRecord) : undefined;
      const sourceId = toStringId(entry.id, entryType);
      const title =
        getMaybeString(entry, ["name", "title"]) ??
        getMaybeString(quizRecord ?? {}, ["name", "title"]) ??
        (entryType === "quiz" ? "Quiz" : "Assessment");
      const description = getMaybeString(entry, ["description", "content"]);
      const taskCount = Array.isArray(entry.tasks) ? entry.tasks.length : 0;
      const dueDate =
        getNearestDueDate(entry.tasks) ??
        getMaybeString(entry, ["due_date", "dueDate", "updated_at", "created_at"]);
      const detailParts = [
        entryType === "quiz" ? "Quiz assigned" : "Assessment assigned",
        taskCount > 0 ? `${taskCount} task${taskCount === 1 ? "" : "s"}` : undefined,
        dueDate ? `Due ${formatStoryDateLabel(dueDate) ?? dueDate}` : undefined,
      ].filter((part): part is string => Boolean(part));
      const assessmentId = getMaybeNumber(entry, ["id"]);
      const quizId =
        getMaybeNumber(quizRecord ?? {}, ["id"]) ?? getMaybeNumber(entry, ["quiz_id"]);
      const navigationHref =
        normalizedRole === "STUDENT"
          ? entryType === "quiz" &&
            assessmentId != null &&
            quizId != null
            ? `/dashboard/students/assignments/${assessmentId}/quiz/${quizId}`
            : entryType === "assessment" && assessmentId != null
              ? `/dashboard/students/assignments/${assessmentId}`
              : undefined
          : undefined;

      return {
        id: itemId("assignment", sourceId),
        sourceId,
        classId,
        type: "assignment",
        navigationHref,
        title,
        body: [description, detailParts.join(" • ")]
          .filter((part): part is string => Boolean(part && part.trim()))
          .join(" • "),
        authorId: getMaybeString(entry, ["teacher_id", "author_id", "authorId"]),
        authorName:
          getMaybeString(entry, ["teacher_name", "author_name", "created_by_name"]) ??
          "Teacher",
        createdAt:
          dueDate ??
          getMaybeString(entry, ["updated_at", "created_at"]) ??
          new Date().toISOString(),
        likeCount: 0,
        totalReactions: 0,
        reactionSummary: {},
        viewerReaction: null,
        commentCount: 0,
      } satisfies StoryFeedItem;
    });
};

const toTrackerStoryItems = (
  items: unknown,
  classId: string,
  role?: string
): StoryFeedItem[] => {
  if (!Array.isArray(items)) return [];

  const normalizedRole = normalizeRoleValue(role ?? "");

  return items
    .filter((entry): entry is RawRecord => !!entry && typeof entry === "object")
    .filter((entry) => {
      const itemClassId = getMaybeNumber(entry, ["class_id"]);
      if (itemClassId === undefined) return true;
      return String(itemClassId) === classId;
    })
    .map((entry) => {
      const tracker =
        entry.tracker && typeof entry.tracker === "object"
          ? (entry.tracker as RawRecord)
          : {};
      const topics =
        getMaybeArray(tracker, ["topics"])
          ?.filter((topic): topic is RawRecord => !!topic && typeof topic === "object") ?? [];
      const completedTopics = topics.filter((topic) => {
        const progressRows =
          getMaybeArray(topic, ["status_progress"])
            ?.filter((row): row is RawRecord => !!row && typeof row === "object") ?? [];
        return progressRows.some((row) => Boolean(row.is_completed));
      }).length;
      const trackerId =
        getMaybeNumber(entry, ["tracker_id", "id"]) ?? getMaybeNumber(tracker, ["id"]);
      const sourceId = toStringId(trackerId, "tracker");
      const title =
        getMaybeString(tracker, ["name", "title"]) ??
        getMaybeString(entry, ["name", "title"]) ??
        "Tracker";
      const deadline =
        getMaybeString(tracker, ["deadline", "deadline_at", "deadline_date", "last_updated"]) ??
        getMaybeString(entry, ["deadline", "deadline_at", "deadline_date"]) ??
        getMaybeString(entry, ["updated_at", "created_at"]);
      const status =
        getMaybeString(tracker, ["status"]) ?? getMaybeString(entry, ["status"]);
      const detailParts = [
        "Tracker assigned",
        topics.length > 0 ? `${completedTopics}/${topics.length} topics` : undefined,
        status ? `Status ${status}` : undefined,
        deadline ? `Due ${formatStoryDateLabel(deadline) ?? deadline}` : undefined,
      ].filter((part): part is string => Boolean(part));
      const navigationHref =
        trackerId == null
          ? undefined
          : normalizedRole === "STUDENT"
            ? `/dashboard/trackers/${classId}/${trackerId}`
            : ["SCHOOL_ADMIN", "ADMIN", "HOD", "TEACHER"].includes(normalizedRole)
              ? `/dashboard/viewtrackers/${classId}/${trackerId}`
              : undefined;

      return {
        id: itemId("assignment", `tracker-${sourceId}`),
        sourceId: `tracker-${sourceId}`,
        classId,
        type: "assignment",
        navigationHref,
        title,
        body: detailParts.join(" • "),
        authorId: getMaybeString(entry, ["teacher_id", "author_id", "authorId"]),
        authorName:
          getMaybeString(entry, ["teacher_name", "author_name", "created_by_name"]) ??
          "Teacher",
        createdAt: deadline ?? new Date().toISOString(),
        likeCount: 0,
        totalReactions: 0,
        reactionSummary: {},
        viewerReaction: null,
        commentCount: 0,
      } satisfies StoryFeedItem;
    });
};

const dedupeStoryItems = (items: StoryFeedItem[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const fetchAssessmentStoryItems = async (
  classId: string,
  subjectId?: number | null,
  role?: string
): Promise<StoryFeedItem[]> => {
  const numericClassId = Number(classId);
  if (!Number.isFinite(numericClassId) || numericClassId <= 0) return [];

  const terms = await fetchTerm(numericClassId);
  if (!Array.isArray(terms) || terms.length === 0) return [];
  const normalizedRole = normalizeRoleValue(role ?? "");
  const useStudentAssessments = normalizedRole === "STUDENT";

  const termResults = await Promise.allSettled(
    terms
      .filter((entry): entry is RawRecord => !!entry && typeof entry === "object")
      .map(async (term) => {
        const termId = getMaybeNumber(term, ["id"]);
        if (termId == null) return [];

        const assessmentRows = useStudentAssessments
          ? await fetchAssessmentByStudent(termId, subjectId ?? undefined)
          : await fetchAssessment(termId, subjectId ?? undefined);
        return toAssessmentStoryItems(assessmentRows, classId, termId);
      })
  );

  return dedupeStoryItems(
    termResults.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
  );
};

const toPostItems = (posts: StoryPostRecord[], classId: string): StoryFeedItem[] => {
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

const withEngagementCounts = (
  items: StoryFeedItem[],
  userId?: string,
  subjectId?: number | null,
  reactions: StoryReaction[] = []
): StoryFeedItem[] => {
  const comments = readStorageArray<StoryComment>(storyStorageKey("comments", subjectId));

  return items.map((item) => {
    const itemReactions = reactions.filter((entry) => entry.itemId === item.id);
    const summary = summarizeReactionEntries(itemReactions);
    return {
      ...item,
      likeCount: summary.like ?? 0,
      totalReactions: getTotalReactions(summary),
      reactionSummary: summary,
      reactionDetails: itemReactions,
      viewerReaction: getViewerReaction(item.id, userId, itemReactions),
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
  await syncLegacyStoryPosts({ classId, subjectId }).catch(() => undefined);

  const [announcementResult, materialResult, assignmentResult, trackerResult, assessmentResult, reactionResult, postsResult] =
    await Promise.allSettled([
    fetchAnnouncements(),
    preferStudentMaterials ? fetchStudentMaterials(subjectId) : fetchMaterials(subjectId),
    fetchManageAssignments({ class_id: classId }),
    fetchTrackers(Number(classId), subjectId ?? undefined),
    fetchAssessmentStoryItems(classId, subjectId, role),
    fetchSharedStoryReactions({ classId, subjectId }),
    fetchSharedStoryPosts({ classId, subjectId }),
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
  const trackerAssignments =
    trackerResult.status === "fulfilled"
      ? toTrackerStoryItems(trackerResult.value, classId, role)
      : [];
  const assessmentAssignments =
    assessmentResult.status === "fulfilled" ? assessmentResult.value : [];
  const reactions =
    reactionResult.status === "fulfilled" ? reactionResult.value : [];
  const sharedPosts =
    postsResult.status === "fulfilled"
      ? postsResult.value
      : readStorageArray<StoryPostRecord>(storyStorageKey("posts", subjectId)).filter(
          (post) => post.classId === classId
        );

  const posts = toPostItems(sharedPosts, classId);

  return withEngagementCounts(
    [
      ...posts,
      ...announcements,
      ...assignments,
      ...trackerAssignments,
      ...assessmentAssignments,
      ...materials,
    ],
    userId,
    subjectId,
    reactions
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createClassStoryPost = async (params: {
  classId: string;
  subjectId?: number | null;
  input: StoryPostInput;
  authorId: string;
  authorName: string;
}): Promise<StoryPostRecord> => {
  const response = await fetch(buildStoryPostsUrl(params.classId, params.subjectId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to create story post");
  }

  const payload = (await response.json()) as SharedPostResponse;
  if (!payload.record) {
    throw new Error("Missing created story post");
  }

  return payload.record;
};

export const updateClassStoryPost = async (params: {
  classId: string;
  postId: string;
  subjectId?: number | null;
  input: StoryPostInput;
}): Promise<StoryPostRecord | null> => {
  const response = await fetch(buildStoryPostsUrl(params.classId, params.subjectId, params.postId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("Failed to update story post");
  }

  const payload = (await response.json()) as SharedPostResponse;
  return payload.record ?? null;
};

export const deleteClassStoryPost = async (params: {
  classId: string;
  postId: string;
  subjectId?: number | null;
}) => {
  const response = await fetch(buildStoryPostsUrl(params.classId, params.subjectId, params.postId), {
    method: "DELETE",
  });

  if (!response.ok && response.status !== 404) {
    throw new Error("Failed to delete story post");
  }

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

export const setStoryReaction = async (params: {
  itemId: string;
  classId: string;
  subjectId?: number | null;
  userId: string;
  userName: string;
  reaction: StoryReactionType;
}): Promise<{
  reaction: StoryReactionType | null;
  summary: StoryReactionSummary;
  totalReactions: number;
  reactions: StoryReaction[];
}> => {
  const response = await fetch(buildStoryReactionsUrl(params.classId, params.subjectId, params.itemId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Failed to save story reaction");
  }

  const payload = (await response.json()) as SharedReactionResponse;
  const reactions = Array.isArray(payload.data) ? payload.data : [];
  const summary = summarizeReactionEntries(reactions);
  return {
    reaction: payload.reaction ?? null,
    summary,
    totalReactions: getTotalReactions(summary),
    reactions,
  };
};
