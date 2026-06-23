"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markConversationRead,
  fetchUnreadCount,
  fetchChatUsers,
  createConversation,
  fetchChatSettings,
  Conversation,
  ChatMessage,
  ChatUser,
  ChatParticipant,
  ChatSettings,
} from "@/services/chatApi";

const POLL_INTERVAL = 10000;

const playMessageSound = (type: "send" | "receive" = "send") => {
  if (typeof window === "undefined") return;
  try {
    const audioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
    if (!audioContextCtor) return;
    const ctx = new audioContextCtor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(type === "send" ? 880 : 660, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    /* ignore audio errors */
  }
};

const resizeImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
};

const messagesStorageKey = (convId: number) => `osteps-chat-messages-${convId}`;

const saveMessages = (convId: number, msgs: ChatMessage[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(messagesStorageKey(convId), JSON.stringify(msgs));
  } catch {
    /* ignore storage errors */
  }
};

const loadCachedMessages = (convId: number): ChatMessage[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(messagesStorageKey(convId));
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getInitials = (name: string | undefined | null): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

const avatarColors = [
  "bg-blue-600", "bg-purple-600", "bg-teal-600", "bg-orange-500",
  "bg-pink-600", "bg-indigo-600", "bg-emerald-600", "bg-rose-500",
  "bg-cyan-600", "bg-amber-600", "bg-violet-600", "bg-lime-600",
];

const getAvatarColor = (id: number | string): string => {
  const numId = typeof id === "string" ? parseInt(id, 10) || 0 : id;
  return avatarColors[numId % avatarColors.length];
};

const formatDateSeparator = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffMs = today.getTime() - msgDay.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
};

const isSameDay = (a: string, b: string): boolean => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
};

export default function ChatPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeParticipants, setActiveParticipants] = useState<ChatParticipant[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [chatError, setChatError] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<{ file: File; preview?: string; isImage: boolean; name: string } | null>(null);
  const [chatSettings, setChatSettings] = useState<ChatSettings | null>(null);
  const [searchConversations, setSearchConversations] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchUsers, setSearchUsers] = useState("");
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<ChatUser[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activePollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevUnreadRef = useRef(0);

  const userId = currentUser?.id ? Number(currentUser.id) : 0;
  const userRole = currentUser?.role || "";

  const canChat = useMemo(() => {
    if (!chatSettings) return true;
    const r = userRole.toUpperCase();
    if (r === "STUDENT") return chatSettings.students_can_chat;
    if (r === "TEACHER") return chatSettings.teachers_can_chat;
    if (r === "HOD") return chatSettings.hod_can_chat;
    if (r === "ADMIN" || r === "SCHOOL_ADMIN") return chatSettings.admin_can_chat;
    if (r === "SUPER_ADMIN") return chatSettings.super_admin_can_chat;
    return true;
  }, [chatSettings, userRole]);

  useEffect(() => {
    fetchChatSettings().then(setChatSettings).catch(() => {});
  }, []);

  const showNotif = useCallback((text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 2000);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const poll = async () => {
      const count = await fetchUnreadCount().catch(() => 0);
      if (count > prevUnreadRef.current) {
        playMessageSound("receive");
        if (typeof window !== "undefined" && Notification.permission === "granted") {
          new Notification("New message", { body: "You have a new chat message" });
        }
      }
      prevUnreadRef.current = count;
    };
    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [currentUser]);

  const loadConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error("[Chat] loadConversations error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadConversations();
    pollRef.current = setInterval(loadConversations, POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadConversations]);

  const loadMessages = useCallback(async (convId: number) => {
    const cached = loadCachedMessages(convId);
    if (cached.length > 0) setMessages(cached);
    try {
      const res = await fetchMessages(convId);
      const loaded = res.data.reverse();
      setMessages(loaded);
      setActiveParticipants(res.participants ?? []);
      saveMessages(convId, loaded);
      await markConversationRead(convId);
    } catch (err) {
      console.error("[Chat] loadMessages error:", err);
      if (cached.length > 0) setMessages(cached);
    }
  }, []);

  useEffect(() => {
    if (!activeConversation) return;
    const poll = async () => {
      try {
        const res = await fetchMessages(activeConversation.id);
        const loaded = res.data.reverse();
        setMessages(loaded);
        setActiveParticipants(res.participants ?? []);
        saveMessages(activeConversation.id, loaded);
        await markConversationRead(activeConversation.id);
      } catch (err) {
        console.error("[Chat] poll messages error:", err);
      }
    };
    activePollRef.current = setInterval(poll, POLL_INTERVAL);
    return () => {
      if (activePollRef.current) clearInterval(activePollRef.current);
    };
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    setShowNewChat(false);
    await loadMessages(conv.id);
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !pendingFile) || !activeConversation || sendingMsg) return;
    const body = messageInput.trim();
    const file = pendingFile?.file;
    setMessageInput("");
    setPendingFile(null);
    setSendingMsg(true);
    try {
      const msg = await sendMessage(activeConversation.id, body, file);
      setMessages((prev) => {
        const next = [...prev, msg];
        saveMessages(activeConversation.id, next);
        return next;
      });
      playMessageSound("send");
    } catch (err) {
      console.error("[Chat] send error:", err);
      setMessageInput(body);
      if (file) setPendingFile({ file, name: file.name, isImage: file.type.startsWith("image/") });
      showNotif("Failed to send message");
    } finally {
      setSendingMsg(false);
    }
  };

  const processFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showNotif("File must be smaller than 10 MB");
      return;
    }
    const isImage = file.type.startsWith("image/");
    let preview: string | undefined;
    if (isImage) {
      try {
        preview = await resizeImage(file);
      } catch {
        showNotif("Failed to process image");
        return;
      }
    }
    setPendingFile({ file, preview, isImage, name: file.name });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await processFile(f);
    e.target.value = "";
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        e.preventDefault();
        const f = item.getAsFile();
        if (f) await processFile(f);
        break;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!showNewChat) return;
    const timeout = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const users = await fetchChatUsers(searchUsers || undefined);
        setAvailableUsers(users);
      } catch {
        // silently fail
      } finally {
        setSearchingUsers(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchUsers, showNewChat]);

  const handleSelectUser = (user: ChatUser) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleStartChat = async () => {
    if (selectedUsers.length === 0) return;
    setCreatingChat(true);
    setChatError("");
    try {
      const isGroup = selectedUsers.length > 1;
      const result = await createConversation({
        participant_ids: selectedUsers.map((u) => u.id),
        type: isGroup ? "group" : "direct",
        name: isGroup ? groupName || "Group Chat" : undefined,
      });
      const convs = await fetchConversations();
      setConversations(convs);
      const conv = convs.find((c) => c.id === result.id);
      if (conv) {
        setActiveConversation(conv);
        setShowNewChat(false);
        await loadMessages(conv.id);
      }
      setSelectedUsers([]);
      setGroupName("");
      setSearchUsers("");
    } catch (err: unknown) {
      console.error("[Chat] handleStartChat error:", err);
      setChatError(err instanceof Error ? err.message : "Failed to create chat");
    } finally {
      setCreatingChat(false);
    }
  };

  const onlineParticipants = useMemo(() => {
    return activeParticipants.filter((p) => {
      if (!p.last_seen_at) return false;
      return Date.now() - new Date(p.last_seen_at).getTime() < 2 * 60 * 1000;
    });
  }, [activeParticipants]);

  const otherParticipant = useMemo(() => {
    if (activeConversation?.type === "direct") {
      return activeConversation.participants.find((p) => p.id !== userId) || null;
    }
    return null;
  }, [activeConversation, userId]);

  const lastOwnMessageSeen = useMemo(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.sender_id !== userId) return false;
    if (activeConversation?.type === "group") {
      const others = activeParticipants.filter((p) => p.id !== userId);
      if (others.length === 0) return false;
      const lastRead = Math.max(
        ...others.map((p) => (p.last_read_at ? new Date(p.last_read_at).getTime() : 0))
      );
      return lastRead >= new Date(lastMsg.created_at).getTime();
    }
    if (!otherParticipant?.last_read_at) return false;
    return new Date(otherParticipant.last_read_at) >= new Date(lastMsg.created_at);
  }, [messages, userId, activeParticipants, activeConversation, otherParticipant]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatConvTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getRoleBadgeColor = (role: string) => {
    const r = role?.toUpperCase() || "";
    if (r.includes("ADMIN")) return "bg-purple-100 text-purple-700";
    if (r === "TEACHER" || r === "HOD") return "bg-blue-100 text-blue-700";
    if (r === "STUDENT") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const filteredConversations = useMemo(() => {
    let list = conversations;
    if (filterUnread) {
      list = list.filter((c) => c.unread_count > 0);
    }
    if (!searchConversations.trim()) return list;
    const q = searchConversations.toLowerCase();
    return list.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.participants.some((p) => p.name?.toLowerCase().includes(q))
    );
  }, [conversations, searchConversations, filterUnread]);

  const isOnline = (participant: { last_seen_at?: string | null }) => {
    if (!participant?.last_seen_at) return false;
    return Date.now() - new Date(participant.last_seen_at).getTime() < 2 * 60 * 1000;
  };

  if (!currentUser) return null;
  if (!canChat) {
    return (
      <div className="flex h-[calc(100vh-66px)] items-center justify-center">
        <p className="text-sm text-gray-500">Chat is not available for your role.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-66px)] overflow-hidden bg-white">
      {/* ─── Left Panel ─── */}
      <div className="flex w-[300px] shrink-0 flex-col border-r border-gray-200 bg-[#f5f5f5]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-xl font-bold text-gray-900">Chat</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setShowNewChat(true);
                setActiveConversation(null);
                setMessages([]);
                setSelectedUsers([]);
                setGroupName("");
                setSearchUsers("");
                setChatError("");
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 transition"
              title="New Chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                <path d="M18 2l4 4-10 10H8v-4L18 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchConversations}
              onChange={(e) => setSearchConversations(e.target.value)}
              placeholder="Search"
              className="w-full rounded-md border-0 bg-white pl-9 pr-3 py-[7px] text-sm text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 outline-none focus:ring-2 focus:ring-[#6264A7] transition"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 px-3 pb-2">
          <button
            onClick={() => setFilterUnread(false)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              !filterUnread ? "bg-[#6264A7] text-white" : "bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setFilterUnread(true)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filterUnread ? "bg-[#6264A7] text-white" : "bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200"
            }`}
          >
            Unread
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <p className="text-sm text-gray-400">
                {filterUnread ? "No unread messages" : searchConversations ? "No matching conversations" : "No conversations yet"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = activeConversation?.id === conv.id;
              const otherP = conv.type === "direct" ? conv.participants.find((p) => p.id !== userId) : null;
              const displayName = conv.name || otherP?.name || "Chat";
              const participantOnline = otherP ? isOnline(otherP) : false;
              const convAvatarId = otherP?.id || conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => handleOpenConversation(conv)}
                  className={`group flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                    isActive
                      ? "bg-white shadow-sm"
                      : "hover:bg-white/60"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(convAvatarId)}`}>
                      {conv.type === "group" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      ) : (
                        getInitials(otherP?.name || conv.name)
                      )}
                    </div>
                    {conv.type === "direct" && (
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#f5f5f5] ${
                        participantOnline ? "bg-green-500" : "bg-gray-300"
                      }`} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[13px] truncate ${
                        conv.unread_count > 0 ? "font-bold text-gray-900" : "font-medium text-gray-800"
                      }`}>
                        {displayName}
                      </span>
                      {conv.last_message && (
                        <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                          {formatConvTime(conv.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className={`text-[12px] truncate ${
                        conv.unread_count > 0 ? "font-medium text-gray-700" : "text-gray-500"
                      }`}>
                        {conv.last_message
                          ? `${conv.last_message.sender_id === userId ? "You: " : ""}${conv.last_message.file_url ? "Sent a file" : conv.last_message.body}`
                          : "No messages yet"}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="ml-2 flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[#6264A7] px-1 text-[10px] font-bold text-white">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex flex-1 flex-col bg-white">
        {showNewChat ? (
          /* ─── New Chat ─── */
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3 bg-white">
              <button
                onClick={() => setShowNewChat(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-sm font-semibold text-gray-900">New Chat</h3>
            </div>

            {/* Selected users */}
            {selectedUsers.length > 0 && (
              <div className="px-5 pt-3 flex flex-wrap gap-1.5">
                {selectedUsers.map((u) => (
                  <span
                    key={u.id}
                    className="inline-flex items-center gap-1 rounded-md bg-[#E8EBFA] px-2 py-1 text-xs font-medium text-[#6264A7]"
                  >
                    {u.name}
                    <button onClick={() => handleSelectUser(u)} className="ml-0.5 hover:text-red-500 transition">&times;</button>
                  </span>
                ))}
              </div>
            )}

            {selectedUsers.length > 1 && (
              <div className="px-5 pt-2">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name (optional)"
                  className="w-full rounded-md border-0 px-3 py-2 text-sm ring-1 ring-inset ring-gray-200 outline-none focus:ring-2 focus:ring-[#6264A7] transition"
                />
              </div>
            )}

            <div className="px-5 pt-3 pb-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-md border-0 pl-9 pr-3 py-2 text-sm ring-1 ring-inset ring-gray-200 outline-none focus:ring-2 focus:ring-[#6264A7] transition"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3">
              {searchingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Searching...
                  </div>
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <span className="text-sm text-gray-400">No users found</span>
                </div>
              ) : (
                availableUsers.map((user) => {
                  const isSelected = selectedUsers.some((u) => u.id === user.id);
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition ${
                        isSelected ? "bg-[#E8EBFA]" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(user.id)}`}>
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        {user.email && <p className="text-[11px] text-gray-400 truncate">{user.email}</p>}
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium mt-0.5 ${getRoleBadgeColor(user.role)}`}>
                          {user.role?.replace(/_/g, " ")}
                        </span>
                      </div>
                      {isSelected && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#6264A7">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {selectedUsers.length > 0 && (
              <div className="border-t border-gray-200 px-5 py-3">
                {chatError && <p className="mb-2 text-xs text-red-500 text-center">{chatError}</p>}
                <button
                  onClick={handleStartChat}
                  disabled={creatingChat}
                  className="w-full rounded-md bg-[#6264A7] py-2.5 text-sm font-semibold text-white transition hover:bg-[#525499] disabled:opacity-50"
                >
                  {creatingChat
                    ? "Creating..."
                    : selectedUsers.length > 1
                    ? `Start Group Chat (${selectedUsers.length})`
                    : `Chat with ${selectedUsers[0]?.name}`}
                </button>
              </div>
            )}
          </div>
        ) : activeConversation ? (
          /* ─── Active Conversation ─── */
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3 bg-white">
              <div className="relative">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(otherParticipant?.id || activeConversation.id)}`}>
                  {activeConversation.type === "group" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ) : (
                    getInitials(otherParticipant?.name || activeConversation.name)
                  )}
                </div>
                {activeConversation.type === "direct" && (
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                    onlineParticipants.length > 0 ? "bg-green-500" : "bg-gray-300"
                  }`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {activeConversation.name || "Chat"}
                </h3>
                {activeConversation.type === "direct" && (
                  <p className="text-[12px] text-gray-500">
                    {onlineParticipants.length > 0 ? "Active now" : "Offline"}
                  </p>
                )}
                {activeConversation.type === "group" && (
                  <p className="text-[12px] text-gray-500 truncate">
                    {activeConversation.participants.length} members
                  </p>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-6 py-4" style={{ background: "#fafafa" }}>
              {notification && (
                <div className="sticky top-0 z-10 flex justify-center mb-3">
                  <span className="rounded-md bg-red-50 text-red-600 border border-red-200 px-3 py-1 text-xs">
                    {notification}
                  </span>
                </div>
              )}
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-white ${getAvatarColor(otherParticipant?.id || activeConversation.id)}`}>
                      {getInitials(otherParticipant?.name || activeConversation.name)}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{activeConversation.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Start the conversation</p>
                  </div>
                </div>
              )}

              {/* Messages with date separators and grouping */}
              {messages.map((msg, idx) => {
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const showDateSep = !prevMsg || !isSameDay(prevMsg.created_at, msg.created_at);
                const isMe = msg.sender_id === userId;
                const showSender = !prevMsg || prevMsg.sender_id !== msg.sender_id || showDateSep;
                const isLast = idx === messages.length - 1;

                return (
                  <React.Fragment key={msg.id}>
                    {/* Date separator */}
                    {showDateSep && (
                      <div className="flex items-center justify-center my-4">
                        <div className="border-t border-gray-200 flex-1" />
                        <span className="px-3 text-[11px] font-medium text-gray-400 bg-[#fafafa]">
                          {formatDateSeparator(msg.created_at)}
                        </span>
                        <div className="border-t border-gray-200 flex-1" />
                      </div>
                    )}

                    {/* Message */}
                    <div className={`flex items-start gap-3 ${showSender ? "mt-4" : "mt-0.5"} group`}>
                      {/* Avatar column */}
                      <div className="w-8 shrink-0">
                        {showSender && (
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-white ${getAvatarColor(msg.sender_id)}`}>
                            {getInitials(msg.sender_name)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {showSender && (
                          <div className="flex items-baseline gap-2 mb-0.5">
                            <span className="text-[13px] font-semibold text-gray-900">
                              {isMe ? "You" : msg.sender_name}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {formatTime(msg.created_at)}
                            </span>
                          </div>
                        )}

                        {/* File attachment */}
                        {msg.file_url && (
                          msg.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                              src={msg.file_url}
                              alt="Attachment"
                              className="max-h-56 rounded-lg border border-gray-200 object-cover mb-1"
                            />
                          ) : (
                            <a
                              href={msg.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition mb-1"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                              </svg>
                              Download file
                            </a>
                          )
                        )}

                        {/* Message text */}
                        {msg.body && (
                          <p className="text-[13px] text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                            {msg.body}
                          </p>
                        )}

                        {/* Timestamp for non-first messages (shown on hover) */}
                        {!showSender && (
                          <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition">
                            {formatTime(msg.created_at)}
                          </span>
                        )}

                        {/* Seen indicator */}
                        {isMe && isLast && lastOwnMessageSeen && (
                          <div className="flex items-center gap-1 mt-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6264A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span className="text-[10px] text-[#6264A7] font-medium">Seen</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Compose area */}
            <div className="border-t border-gray-200 bg-white px-4 py-3">
              {pendingFile && (
                <div className="relative mb-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  {pendingFile.isImage && pendingFile.preview ? (
                    <img src={pendingFile.preview} alt="Upload preview" className="h-16 w-auto rounded object-cover" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span className="text-sm text-gray-700 truncate max-w-[200px]">{pendingFile.name}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setPendingFile(null)}
                    className="h-5 w-5 rounded-full bg-gray-400 text-white text-[10px] flex items-center justify-center hover:bg-gray-600 transition"
                    aria-label="Remove file"
                  >
                    &times;
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-[#6264A7] focus-within:ring-1 focus-within:ring-[#6264A7] transition">
                <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sendingMsg}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition disabled:opacity-40"
                  title="Attach file"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder="Type a message"
                  className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none border-none bg-transparent py-0.5"
                  disabled={sendingMsg}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={(!messageInput.trim() && !pendingFile) || sendingMsg}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[#6264A7] hover:bg-[#E8EBFA] transition disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ─── Empty State ─── */
          <div className="flex flex-1 flex-col items-center justify-center text-center px-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8EBFA] mb-4">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6264A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Welcome to Chat</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Select a conversation or start a new chat to begin messaging your colleagues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
