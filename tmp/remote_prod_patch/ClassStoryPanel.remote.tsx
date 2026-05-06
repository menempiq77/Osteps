"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Empty,
  Input,
  Modal,
  Popover,
  Popconfirm,
  Segmented,
  Spin,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  MessageOutlined,
  PaperClipOutlined,
  PictureOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { RootState } from "@/store/store";
import { useSubjectContext } from "@/contexts/SubjectContext";
import {
  addStoryComment,
  createClassStoryPost,
  deleteClassStoryPost,
  deleteStoryComment,
  fetchClassStoryFeed,
  fetchStoryComments,
  setStoryReaction,
  STORY_REACTION_OPTIONS,
  updateClassStoryPost,
  updateStoryComment,
} from "@/services/classStoryApi";
import { StoryFeedItem, StoryFilter, StoryReactionType } from "@/types/classStory";

const { Text } = Typography;
const { TextArea } = Input;

const filterOptions: { label: string; value: StoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Announcements", value: "announcement" },
  { label: "Assignments", value: "assignment" },
  { label: "Events", value: "event" },
  { label: "Resources", value: "resource" },
  { label: "Posts", value: "post" },
];

const typeAccent: Record<StoryFeedItem["type"], string> = {
  post: "bg-violet-500",
  announcement: "bg-sky-500",
  event: "bg-emerald-500",
  assignment: "bg-amber-500",
  resource: "bg-cyan-500",
};

const typeChip: Record<StoryFeedItem["type"], string> = {
  post: "bg-violet-50 text-violet-700",
  announcement: "bg-sky-50 text-sky-700",
  event: "bg-emerald-50 text-emerald-700",
  assignment: "bg-amber-50 text-amber-700",
  resource: "bg-cyan-50 text-cyan-700",
};

const getInitials = (name: string) => {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "CS";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

const formatStoryDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isImageAttachment = (url?: string, label?: string) => {
  const value = `${url || ""} ${label || ""}`.toLowerCase();
  return (
    value.includes("data:image/") ||
    /\.(png|jpe?g|gif|webp|bmp|svg|avif)(\?|#|$)/i.test(value)
  );
};

const isVideoAttachment = (url?: string, label?: string) => {
  const value = `${url || ""} ${label || ""}`.toLowerCase();
  return (
    value.includes("data:video/") ||
    /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?|#|$)/i.test(value)
  );
};

const extractFirstUrl = (text?: string) => {
  if (!text) return undefined;
  const match = text.match(/https?:\/\/[^\s]+/i);
  return match?.[0];
};

const getYoutubeVideoId = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0];
    }
    if (host.includes("youtube.com")) {
      const byQuery = parsed.searchParams.get("v");
      if (byQuery) return byQuery;
      const segments = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = segments.findIndex(
        (segment) => segment === "embed" || segment === "shorts"
      );
      if (embedIndex >= 0 && segments[embedIndex + 1]) {
        return segments[embedIndex + 1];
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
};

const isDirectVideoUrl = (url?: string) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?|#|$)/i.test(url);
};

const getWebsitePreviewImage = (url: string) =>
  `https://image.thum.io/get/width/1200/noanimate/${encodeURIComponent(url)}`;

interface ClassStoryPanelProps {
  classId: string;
}

export default function ClassStoryPanel({ classId }: ClassStoryPanelProps) {
  const queryClient = useQueryClient();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId } = useSubjectContext();
  const [messageApi, contextHolder] = message.useMessage();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [filter, setFilter] = useState<StoryFilter>("all");
  const [composerTitle, setComposerTitle] = useState("");
  const [composerBody, setComposerBody] = useState("");
  const [composerAttachmentUrl, setComposerAttachmentUrl] = useState("");
  const [composerAttachmentLabel, setComposerAttachmentLabel] = useState("");
  const [composerAttachmentType, setComposerAttachmentType] = useState<
    "file" | "link" | undefined
  >(undefined);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<{
    itemId: string;
    commentId: string;
  } | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isEventMode, setIsEventMode] = useState(false);
  const [eventDate, setEventDate] = useState<string>("");
  const [eventStartTime, setEventStartTime] = useState<string>("");
  const [eventEndTime, setEventEndTime] = useState<string>("");
  const [isDragOverUpload, setIsDragOverUpload] = useState(false);
  const [openReactionPickerId, setOpenReactionPickerId] = useState<string | null>(null);

  const userRole = currentUser?.role;
  const canCreatePost =
    userRole === "TEACHER" || userRole === "HOD" || userRole === "SCHOOL_ADMIN";
  const canModerate = canCreatePost;
  const canInteract = Boolean(currentUser?.id);
  const feedQueryKey = [
    "class-story-feed",
    classId,
    activeSubjectId,
    userRole,
    currentUser?.id,
  ] as const;

  const { data: feed = [], isLoading } = useQuery({
    queryKey: feedQueryKey,
    queryFn: () =>
      fetchClassStoryFeed({
        classId,
        subjectId: activeSubjectId,
        role: userRole,
        userId: currentUser?.id,
        preferStudentMaterials: userRole === "STUDENT",
      }),
    enabled: Boolean(classId),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });

  const resetComposer = () => {
    setComposerTitle("");
    setComposerBody("");
    setComposerAttachmentUrl("");
    setComposerAttachmentLabel("");
    setComposerAttachmentType(undefined);
    setEditingPostId(null);
    setIsComposerOpen(false);
    setIsEventMode(false);
    setEventDate("");
    setEventStartTime("");
    setEventEndTime("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openComposer = (mode?: "photo" | "event" | "file") => {
    if (!editingPostId) {
      setComposerTitle("");
      setComposerBody("");
    }
    if (mode === "event" && !editingPostId && !composerTitle) {
      setComposerTitle("Event update");
    }
    if (mode === "event") {
      setIsEventMode(true);
    }
    setIsComposerOpen(true);
    if (mode === "file") {
      setTimeout(() => fileInputRef.current?.click(), 100);
    }
  };

  const upsertPostMutation = useMutation({
    mutationFn: () => {
      if (!currentUser?.id) {
        throw new Error("Missing user session");
      }

      const payload = {
        title: composerTitle.trim(),
        body: (() => {
          if (!isEventMode) return composerBody.trim();
          const details: string[] = [];
          if (eventDate) {
            details.push(`📅 Event Date: ${eventDate}`);
          }
          if (eventStartTime && eventEndTime) {
            details.push(`⏰ Time: ${eventStartTime} - ${eventEndTime}`);
          } else if (eventStartTime) {
            details.push(`⏰ Starts: ${eventStartTime}`);
          } else if (eventEndTime) {
            details.push(`⏰ Ends: ${eventEndTime}`);
          }
          return details.length
            ? `${composerBody.trim()}\n\n${details.join("\n")}`
            : composerBody.trim();
        })(),
        attachmentUrl: composerAttachmentUrl.trim() || undefined,
        attachmentLabel: composerAttachmentLabel.trim() || undefined,
        attachmentType: composerAttachmentType,
      };

      if (editingPostId) {
        return updateClassStoryPost({
          classId,
          postId: editingPostId,
          subjectId: activeSubjectId,
          input: payload,
        });
      }

      return createClassStoryPost({
        classId,
        subjectId: activeSubjectId,
        input: payload,
        authorId: currentUser.id,
        authorName: currentUser.name || currentUser.email,
      });
    },
    onSuccess: () => {
      messageApi.success(editingPostId ? "Post updated" : "Story post published");
      resetComposer();
      queryClient.invalidateQueries({ queryKey: ["class-story-feed", classId] });
    },
    onError: () => {
      messageApi.error(
        editingPostId ? "Could not update post" : "Could not publish post"
      );
    },
  });

  const filteredFeed = useMemo(() => {
    if (filter === "all") return feed;
    return feed.filter((item) => item.type === filter);
  }, [feed, filter]);

  const attachSelectedFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        messageApi.error("Failed to attach file");
        return;
      }
      setComposerAttachmentUrl(result);
      setComposerAttachmentLabel(file.name);
      setComposerAttachmentType("file");
      setIsComposerOpen(true);
    };
    reader.onerror = () => messageApi.error("Failed to read selected file");
    reader.readAsDataURL(file);
  };

  const handleFilePick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    attachSelectedFile(file);
  };

  const toggleCommentPanel = (itemId: string) => {
    setOpenComments((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const submitComment = (item: StoryFeedItem) => {
    const draft = commentDrafts[item.id]?.trim();
    if (!draft || !currentUser?.id || !canInteract) return;

    if (editingComment && editingComment.itemId === item.id) {
      updateStoryComment({
        commentId: editingComment.commentId,
        subjectId: activeSubjectId,
        body: draft,
      });
      setEditingComment(null);
      setCommentDrafts((prev) => ({ ...prev, [item.id]: "" }));
      queryClient.invalidateQueries({ queryKey: feedQueryKey });
      return;
    }

    addStoryComment({
      itemId: item.id,
      classId,
      subjectId: activeSubjectId,
      body: draft,
      authorId: currentUser.id,
      authorName: currentUser.name || currentUser.email,
    });

    setCommentDrafts((prev) => ({ ...prev, [item.id]: "" }));
    queryClient.invalidateQueries({ queryKey: feedQueryKey });
  };

  const handleReaction = async (item: StoryFeedItem, reaction: StoryReactionType) => {
    if (!currentUser?.id || !canInteract) return;
    try {
      await setStoryReaction({
        itemId: item.id,
        classId,
        subjectId: activeSubjectId,
        userId: currentUser.id,
        userName: currentUser.name || currentUser.email,
        reaction,
      });
      setOpenReactionPickerId(null);
      queryClient.invalidateQueries({ queryKey: feedQueryKey });
    } catch {
      messageApi.error("Could not save reaction");
    }
  };

  const canEditPost = (item: StoryFeedItem) => {
    if (item.type !== "post" || !currentUser?.id) return false;
    return canModerate || item.authorId === currentUser.id;
  };

  const canEditComment = (authorId?: string) => {
    if (!currentUser?.id) return false;
    return canModerate || authorId === currentUser.id;
  };

  const getReactionUsers = (item: StoryFeedItem, reaction: StoryReactionType) => {
    return (item.reactionDetails ?? [])
      .filter((entry) => entry.reaction === reaction)
      .map((entry) => String(entry.userName || entry.userId || "").trim())
      .filter((value, index, values) => Boolean(value) && values.indexOf(value) === index);
  };

  const reactionBadges = (item: StoryFeedItem) => {
    const summary = item.reactionSummary ?? {};
    return STORY_REACTION_OPTIONS.filter(
      (entry) => (summary[entry.key] ?? 0) > 0
    ).map((entry) => {
      const users = getReactionUsers(item, entry.key);

      return (
        <Popover
          key={entry.key}
          trigger="click"
          placement="top"
          content={
            <div className="min-w-[120px] space-y-1 text-sm text-slate-700">
              {users.map((user) => (
                <div key={user}>{user}</div>
              ))}
            </div>
          }
        >
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500 transition hover:bg-slate-50"
          >
            <span>{entry.emoji}</span>
            <span>{summary[entry.key]}</span>
          </button>
        </Popover>
      );
    });
  };

  return (
    <div className="mt-4 space-y-4">
      {contextHolder}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFilePick}
        accept="*/*"
      />

      <div className="mx-auto max-w-5xl space-y-5">
        {canCreatePost && (
          <div className="rounded-[30px] border border-[#dde3f3] bg-white p-4 shadow-[0_10px_25px_rgba(92,104,154,0.12)] md:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg font-semibold text-slate-700 shadow-sm">
                {currentUser?.profile_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.profile_path}
                    alt={currentUser.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(currentUser?.name || currentUser?.email || "Class Story")
                )}
              </div>
              <button
                type="button"
                onClick={() => openComposer()}
                className="flex-1 rounded-[28px] bg-[#eef2f8] px-6 py-4 text-left text-sm font-medium text-slate-800 transition hover:bg-[#e7edf7]"
              >
                What&apos;s happening in this class?
              </button>
            </div>

            <div className="my-5 h-px bg-[#e7ebf5]" />

            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => openComposer("photo")}
                className="flex items-center justify-center gap-2 rounded-full bg-[#edf3ff] px-5 py-3 text-sm font-semibold text-[#2f5fb7] transition hover:bg-[#e4ecfb]"
              >
                <PictureOutlined />
                <span>Photo/Video</span>
              </button>
              <button
                type="button"
                onClick={() => openComposer("event")}
                className="flex items-center justify-center gap-2 rounded-full bg-[#e8faf2] px-5 py-3 text-sm font-semibold text-[#2f7a51] transition hover:bg-[#def5ea]"
              >
                <CalendarOutlined />
                <span>Event</span>
              </button>
              <button
                type="button"
                onClick={() => openComposer("file")}
                className="flex items-center justify-center gap-2 rounded-full bg-[#edf7fd] px-5 py-3 text-sm font-semibold text-[#2d6f94] transition hover:bg-[#e0f1fb]"
              >
                <PaperClipOutlined />
                <span>File</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <Segmented
            value={filter}
            onChange={(value) => setFilter(value as StoryFilter)}
            options={filterOptions}
          />
          <Text className="text-xs !text-slate-400">Class #{classId}</Text>
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-[28px] border border-[#dde3f3] bg-white shadow-sm">
            <Spin size="large" />
          </div>
        ) : filteredFeed.length === 0 ? (
          <div className="rounded-[28px] border border-[#dde3f3] bg-white p-8 shadow-sm">
            <Empty description="No story items yet" />
          </div>
        ) : (
          <div className="space-y-5">
            {filteredFeed.map((item) => {
              const comments = fetchStoryComments(item.id, activeSubjectId);
              const inlineUrl =
                item.attachmentType === "link"
                  ? item.attachmentUrl
                  : extractFirstUrl(item.body);
              const youtubeVideoId = inlineUrl ? getYoutubeVideoId(inlineUrl) : undefined;
              const canRenderDirectVideo = inlineUrl && isDirectVideoUrl(inlineUrl);
              const canRenderWebsitePreview =
                inlineUrl &&
                !youtubeVideoId &&
                !canRenderDirectVideo &&
                !isImageAttachment(inlineUrl);
              const hideAttachmentCard =
                item.attachmentType === "link" && Boolean(inlineUrl);

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[30px] border border-[#dde3f3] bg-white shadow-[0_10px_24px_rgba(92,104,154,0.1)]"
                >
                  <div className="px-5 py-5 md:px-6 md:py-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="relative mt-1">
                          <div
                            className={`absolute -left-2 top-2 h-12 w-1 rounded-full ${typeAccent[item.type]}`}
                          />
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#e8edf8] text-sm font-semibold text-slate-700">
                            {item.authorName ? getInitials(item.authorName) : "CS"}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-700">
                            {item.authorName}
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-[#5a66a0]">
                            Class Story
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="whitespace-nowrap text-sm font-semibold text-[#5a66a0]">
                          {formatStoryDate(item.createdAt)}
                        </div>
                        {canEditPost(item) && (
                          <div className="flex items-center gap-1">
                            <Tooltip title="Edit post">
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                className="!rounded-full !text-slate-400"
                                onClick={() => {
                                  setEditingPostId(item.sourceId);
                                  setComposerTitle(item.title);
                                  setComposerBody(item.body || "");
                                  setComposerAttachmentUrl(item.attachmentUrl || "");
                                  setComposerAttachmentLabel(item.attachmentLabel || "");
                                  setComposerAttachmentType(item.attachmentType);
                                  setIsComposerOpen(true);
                                }}
                              />
                            </Tooltip>
                            <Popconfirm
                              title="Delete this post?"
                              onConfirm={async () => {
                                await deleteClassStoryPost({
                                  classId,
                                  postId: item.sourceId,
                                  subjectId: activeSubjectId,
                                });
                                queryClient.invalidateQueries({
                                  queryKey: feedQueryKey,
                                });
                                if (editingPostId === item.sourceId) {
                                  resetComposer();
                                }
                              }}
                            >
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                className="!rounded-full"
                              />
                            </Popconfirm>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 space-y-4 pl-[68px]">
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${typeChip[item.type]}`}
                      >
                        {item.type}
                      </div>
                      <h3 className="text-base font-semibold leading-snug text-slate-800">
                        {item.title}
                      </h3>

                      {item.body && (
                        <div className="text-sm leading-7 text-slate-700">{item.body}</div>
                      )}

                      {youtubeVideoId && (
                        <div className="max-w-xl overflow-hidden rounded-2xl border border-[#dde3f3] bg-[#f6f8fd] p-2">
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                            <iframe
                              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                              title="Embedded YouTube video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="absolute inset-0 h-full w-full"
                            />
                          </div>
                        </div>
                      )}

                      {canRenderDirectVideo && (
                        <div className="block max-w-xl overflow-hidden rounded-2xl border border-[#dde3f3] bg-[#f6f8fd] p-3">
                          <video
                            controls
                            className="max-h-[420px] w-full rounded-xl bg-black"
                            src={inlineUrl}
                          />
                        </div>
                      )}

                      {canRenderWebsitePreview && inlineUrl && (
                        <a
                          href={inlineUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block max-w-xl overflow-hidden rounded-2xl border border-[#dde3f3] bg-[#f6f8fd] transition hover:bg-[#eef3fb]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getWebsitePreviewImage(inlineUrl)}
                            alt="Website preview"
                            className="max-h-[260px] w-full object-cover"
                          />
                          <div className="truncate px-4 py-3 text-sm font-medium text-slate-700">
                            {inlineUrl}
                          </div>
                        </a>
                      )}

                      {item.attachmentUrl && !hideAttachmentCard &&
                        (isImageAttachment(item.attachmentUrl, item.attachmentLabel) ? (
                          <div className="block max-w-xl overflow-hidden rounded-2xl border border-[#dde3f3] bg-[#f6f8fd]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.attachmentUrl}
                              alt={item.attachmentLabel || "Story image"}
                              className="max-h-[420px] w-full object-cover"
                            />
                          </div>
                        ) : isVideoAttachment(item.attachmentUrl, item.attachmentLabel) ? (
                          <div className="block max-w-xl overflow-hidden rounded-2xl border border-[#dde3f3] bg-[#f6f8fd] p-3">
                            <video
                              controls
                              className="max-h-[420px] w-full rounded-xl bg-black"
                              src={item.attachmentUrl}
                            />
                          </div>
                        ) : (
                          <a
                            href={item.attachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block max-w-xl rounded-2xl border border-[#dde3f3] bg-[#f6f8fd] p-4 transition hover:bg-[#eef3fb]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#5a66a0] shadow-sm">
                                {item.attachmentType === "file" ? (
                                  <UploadOutlined />
                                ) : (
                                  <LinkOutlined />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-base font-semibold text-slate-800">
                                  {item.attachmentLabel || "Open attachment"}
                                </div>
                                <div className="truncate text-sm text-slate-500">
                                  {item.attachmentType === "file"
                                    ? "Attached file"
                                    : item.attachmentUrl}
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}

                      <div className="flex flex-wrap items-center gap-2 text-sm text-[#5a66a0]">
                        {reactionBadges(item)}
                        {comments.length > 0 && (
                          <span>
                            {comments.length} comment{comments.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#e7ebf5] bg-white px-5 py-4 md:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenReactionPickerId((prev) =>
                              prev === item.id ? null : item.id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-[#d7ddee] bg-white px-5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-[#f7f9fd]"
                        >
                          <span className="text-base">♡</span>
                          <span>Reaction</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCommentPanel(item.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#d7ddee] bg-white px-5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-[#f7f9fd]"
                        >
                          <MessageOutlined />
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>

                    {openReactionPickerId === item.id && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#eef2f8] pt-3">
                        {STORY_REACTION_OPTIONS.map((reaction) => {
                          const mine = item.viewerReaction === reaction.key;
                          return (
                            <button
                              key={reaction.key}
                              type="button"
                              onClick={() => void handleReaction(item, reaction.key)}
                              className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${
                                mine
                                  ? "border-[#cfd8f5] bg-[#eef2ff]"
                                  : "border-[#e0e5f1] bg-white hover:bg-[#f7f9fd]"
                              }`}
                              title={reaction.label}
                            >
                              {reaction.emoji}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {openComments[item.id] && (
                      <div className="mt-4 space-y-3 border-t border-[#eef2f8] pt-4">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-start justify-between gap-3 rounded-2xl bg-[#f7f9fd] px-4 py-3"
                          >
                            <div>
                              <div className="text-sm font-semibold text-slate-800">
                                {comment.authorName}
                              </div>
                              <div className="mt-1 text-sm text-slate-600">
                                {comment.body}
                              </div>
                            </div>
                            {canEditComment(comment.authorId) && (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="small"
                                  type="text"
                                  icon={<EditOutlined />}
                                  onClick={() => {
                                    setEditingComment({
                                      itemId: item.id,
                                      commentId: comment.id,
                                    });
                                    setCommentDrafts((prev) => ({
                                      ...prev,
                                      [item.id]: comment.body,
                                    }));
                                  }}
                                />
                                <Popconfirm
                                  title="Delete comment?"
                                  onConfirm={() => {
                                    deleteStoryComment({
                                      commentId: comment.id,
                                      subjectId: activeSubjectId,
                                    });
                                    queryClient.invalidateQueries({
                                      queryKey: feedQueryKey,
                                    });
                                  }}
                                >
                                  <Button
                                    size="small"
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                  />
                                </Popconfirm>
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8edf8] text-sm font-semibold text-slate-700">
                            {getInitials(
                              currentUser?.name || currentUser?.email || "You"
                            )}
                          </div>
                          <div className="flex-1">
                            <TextArea
                              value={commentDrafts[item.id] || ""}
                              onChange={(event) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [item.id]: event.target.value,
                                }))
                              }
                              autoSize={{ minRows: 2, maxRows: 4 }}
                              placeholder="Reply..."
                              className="!rounded-2xl"
                            />
                          </div>
                          <Button
                            type="primary"
                            className="!rounded-full !border-0 !bg-[#5a66a0]"
                            icon={<SendOutlined />}
                            onClick={() => submitComment(item)}
                          >
                            {editingComment?.itemId === item.id ? "Save" : "Reply"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={isComposerOpen}
        onCancel={resetComposer}
        footer={null}
        centered
        width={760}
        closeIcon={<span className="text-2xl text-slate-500">×</span>}
      >
        <div className="-mx-6 -mt-4">
          <div className="border-b border-[#e7ebf5] px-6 py-5">
            <div className="text-xl font-semibold text-slate-800">New post</div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#e8edf8] text-sm font-semibold text-slate-700">
                {currentUser?.profile_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.profile_path}
                    alt={currentUser.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(currentUser?.name || currentUser?.email || "You")
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="text-sm font-semibold text-slate-800">
                  {currentUser?.name || currentUser?.email}
                </div>
                <Input
                  value={composerTitle}
                  onChange={(event) => setComposerTitle(event.target.value)}
                  placeholder="Post title"
                  className="!rounded-2xl"
                />
                <TextArea
                  value={composerBody}
                  onChange={(event) => setComposerBody(event.target.value)}
                  placeholder="What's happening in this class?"
                  autoSize={{ minRows: 5, maxRows: 8 }}
                  className="!rounded-2xl"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragOverUpload(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragOverUpload(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragOverUpload(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragOverUpload(false);
                const file = event.dataTransfer.files?.[0];
                attachSelectedFile(file);
              }}
              className={`block w-full rounded-3xl p-5 text-center transition ${
                isDragOverUpload
                  ? "bg-[#e8efff] ring-2 ring-[#9fb3ef]"
                  : "bg-[#f4f6fb] hover:bg-[#ecf0f8]"
              }`}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-[#5a66a0] shadow-sm">
                {composerAttachmentType === "file" ? (
                  <UploadOutlined />
                ) : (
                  <PictureOutlined />
                )}
              </div>
              <div className="mt-3 text-base font-semibold text-slate-800">
                Add Photos/Videos
              </div>
              <div className="text-sm text-slate-500">
                Click to upload or drag and drop any file
              </div>
              {composerAttachmentUrl && (
                <div className="mt-3 truncate text-sm text-slate-600">
                  {composerAttachmentLabel || composerAttachmentUrl}
                </div>
              )}
            </button>

            <Input
              value={composerAttachmentLabel}
              onChange={(event) => setComposerAttachmentLabel(event.target.value)}
              placeholder="Attachment label"
              className="!rounded-2xl"
            />
            <Input
              value={composerAttachmentUrl}
              onChange={(event) => {
                setComposerAttachmentUrl(event.target.value);
                setComposerAttachmentType(
                  event.target.value.trim() ? "link" : undefined
                );
              }}
              placeholder="Paste a meeting link, website, or file URL"
              prefix={<LinkOutlined />}
              className="!rounded-2xl"
            />

            <div className="flex items-center justify-between border-t border-[#e7ebf5] pt-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf3ff] text-[#2f5fb7]"
                >
                  <PictureOutlined />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef9ff] text-[#2d6f94]"
                >
                  <PaperClipOutlined />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEventMode(true);
                    setComposerTitle((prev) => prev || "Event update");
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${
                    isEventMode
                      ? "bg-[#dcd4ff] text-[#5b41d7] ring-2 ring-[#cfc2ff]"
                      : "bg-[#f0ebff] text-[#6d55d8]"
                  }`}
                >
                  <CalendarOutlined />
                </button>
              </div>

              <Button
                type="primary"
                className="!h-10 !rounded-full !border-0 !bg-[#dfe4f1] !px-8 !text-sm !font-semibold !text-white enabled:!bg-[#5a66a0]"
                disabled={!composerTitle.trim() || !composerBody.trim()}
                loading={upsertPostMutation.isPending}
                onClick={() => upsertPostMutation.mutate()}
              >
                Post
              </Button>
            </div>

            {isEventMode && (
              <div className="rounded-2xl border border-[#e6ddff] bg-[#f7f4ff] p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d55d8]">
                  Event details
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                    className="h-10 rounded-xl border border-[#d5cff5] bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#8d79e5]"
                  />
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(event) => setEventStartTime(event.target.value)}
                    className="h-10 rounded-xl border border-[#d5cff5] bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#8d79e5]"
                    aria-label="Event start time"
                  />
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(event) => setEventEndTime(event.target.value)}
                    className="h-10 rounded-xl border border-[#d5cff5] bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#8d79e5]"
                    aria-label="Event end time"
                  />
                  <Button
                    onClick={() => {
                      setIsEventMode(false);
                      setEventDate("");
                      setEventStartTime("");
                      setEventEndTime("");
                    }}
                    className="!rounded-full"
                  >
                    Remove Event Mode
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
