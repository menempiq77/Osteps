export type StoryItemType =
  | "announcement"
  | "event"
  | "assignment"
  | "resource"
  | "post";

export type StoryFilter = "all" | StoryItemType;

export interface StoryFeedItem {
  id: string;
  sourceId: string;
  classId: string;
  type: StoryItemType;
  title: string;
  body?: string;
  authorId?: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
  attachmentUrl?: string;
  attachmentLabel?: string;
  attachmentType?: "file" | "link";
  likeCount: number;
  totalReactions?: number;
  viewerReaction?: StoryReactionType | null;
  reactionSummary?: StoryReactionSummary;
  commentCount: number;
}

export interface StoryPostInput {
  title: string;
  body: string;
  attachmentUrl?: string;
  attachmentLabel?: string;
  attachmentType?: "file" | "link";
}

export interface StoryPostRecord {
  id: string;
  classId: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
  attachmentUrl?: string;
  attachmentLabel?: string;
  attachmentType?: "file" | "link";
}

export interface StoryComment {
  id: string;
  itemId: string;
  classId: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}

export type StoryReactionType =
  | "like"
  | "love"
  | "laugh"
  | "surprise"
  | "cry"
  | "clap"
  | "angry";

export type StoryReactionSummary = Partial<Record<StoryReactionType, number>>;

export interface StoryReaction {
  id: string;
  itemId: string;
  classId: string;
  userId: string;
  reaction: StoryReactionType;
  createdAt: string;
  updatedAt?: string;
}
