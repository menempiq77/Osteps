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
  Conversation,
  ChatMessage,
  ChatUser,
  ChatParticipant,
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

export default function ChatWidget() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"list" | "chat" | "new">("list");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeParticipants, setActiveParticipants] = useState<ChatParticipant[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [chatError, setChatError] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [searchUsers, setSearchUsers] = useState("");
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<ChatUser[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchingUsers, setSearchingUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activePollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const userId = currentUser?.id ? Number(currentUser.id) : 0;

  const showNotification = useCallback((text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 2000);
  }, []);

  // Fetch unread count periodically
  useEffect(() => {
    if (!currentUser) return;
    const poll = () => {
      fetchUnreadCount().then(setUnreadTotal).catch(() => {});
    };
    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Fetch conversations when widget opens
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
    if (open && view === "list") {
      loadConversations();
      pollRef.current = setInterval(loadConversations, POLL_INTERVAL);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [open, view, loadConversations]);

  // Fetch messages when opening a conversation
  const loadMessages = useCallback(
    async (convId: number) => {
      const cached = loadCachedMessages(convId);
      if (cached.length > 0) setMessages(cached);
      try {
        const res = await fetchMessages(convId);
        const loaded = res.data.reverse();
        setMessages(loaded);
        setActiveParticipants(res.participants ?? []);
        saveMessages(convId, loaded);
        await markConversationRead(convId);
        fetchUnreadCount().then(setUnreadTotal).catch(() => {});
      } catch (err) {
        console.error("[Chat] loadMessages error:", err);
        if (cached.length > 0) setMessages(cached);
      }
    },
    []
  );

  // Poll for new messages in active conversation
  useEffect(() => {
    if (view === "chat" && activeConversation) {
      const poll = async () => {
        try {
          const res = await fetchMessages(activeConversation.id);
          const loaded = res.data.reverse();
          setMessages(loaded);
          setActiveParticipants(res.participants ?? []);
          saveMessages(activeConversation.id, loaded);
          await markConversationRead(activeConversation.id);
          fetchUnreadCount().then(setUnreadTotal).catch(() => {});
        } catch (err) {
          console.error("[Chat] poll messages error:", err);
        }
      };
      activePollRef.current = setInterval(poll, POLL_INTERVAL);
      return () => {
        if (activePollRef.current) clearInterval(activePollRef.current);
      };
    }
  }, [view, activeConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    setView("chat");
    await loadMessages(conv.id);
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !pendingImage) || !activeConversation || sendingMsg) return;
    const body = messageInput.trim();
    const image = pendingImage;
    setMessageInput("");
    setPendingImage(null);
    setSendingMsg(true);
    try {
      const msg = await sendMessage(activeConversation.id, body, image || undefined);
      setMessages((prev) => {
        const next = [...prev, msg];
        saveMessages(activeConversation.id, next);
        return next;
      });
      playMessageSound("send");
      showNotification("Message sent");
    } catch (err) {
      console.error("[Chat] send error:", err);
      setMessageInput(body);
      if (image) setPendingImage(image);
      showNotification("Failed to send message");
    } finally {
      setSendingMsg(false);
    }
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showNotification("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image must be smaller than 5 MB");
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      setPendingImage(dataUrl);
    } catch {
      showNotification("Failed to process image");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
    e.target.value = "";
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) await processImageFile(file);
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

  // Search users for new chat
  useEffect(() => {
    if (view !== "new") return;
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
  }, [searchUsers, view]);

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
        setView("chat");
        await loadMessages(conv.id);
      } else {
        setView("list");
      }
      setSelectedUsers([]);
      setGroupName("");
      setSearchUsers("");
    } catch (err: unknown) {
      console.error("[Chat] handleStartChat error:", err);
      const msg = err instanceof Error ? err.message : "Failed to create chat";
      setChatError(msg);
    } finally {
      setCreatingChat(false);
    }
  };

  const handleBack = () => {
    if (view === "chat" || view === "new") {
      setView("list");
      setActiveConversation(null);
      setMessages([]);
      setActiveParticipants([]);
      setSelectedUsers([]);
      setGroupName("");
      setSearchUsers("");
      setChatError("");
      loadConversations();
    }
  };

  const otherParticipant = useMemo(() => {
    if (activeConversation?.type === "direct") {
      return activeConversation.participants.find((p) => p.id !== userId) || null;
    }
    return null;
  }, [activeConversation, userId]);

  const onlineParticipants = useMemo(() => {
    return activeParticipants.filter((p) => {
      if (!p.last_seen_at) return false;
      return Date.now() - new Date(p.last_seen_at).getTime() < 2 * 60 * 1000;
    });
  }, [activeParticipants]);

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
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getRoleBadgeColor = (role: string) => {
    const r = role?.toUpperCase() || "";
    if (r.includes("ADMIN")) return "bg-purple-100 text-purple-700";
    if (r === "TEACHER" || r === "HOD") return "bg-blue-100 text-blue-700";
    if (r === "STUDENT") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary,#38C16C)] text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        title="Chat"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {unreadTotal > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadTotal > 99 ? "99+" : unreadTotal}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 left-6 z-[1001] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200"
          style={{ width: 380, height: 520 }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-3 text-white"
            style={{
              background:
                "linear-gradient(105deg, #242936 0%, #253742 30%, #373f61 63%, #403344 100%)",
            }}
          >
            {view !== "list" && (
              <button
                onClick={handleBack}
                className="mr-1 flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate">
                {view === "list"
                  ? "Messages"
                  : view === "new"
                  ? "New Chat"
                  : activeConversation?.name || "Chat"}
              </h3>
              {view === "chat" && activeConversation?.type === "group" && (
                <p className="text-[10px] text-white/60 truncate">
                  {activeConversation.participants.map((p) => p.name).join(", ")}
                </p>
              )}
              {view === "chat" && activeConversation?.type === "direct" && (
                <p className="text-[10px] text-white/60 flex items-center gap-1">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${onlineParticipants.length > 0 ? "bg-green-400" : "bg-gray-400"}`} />
                  {onlineParticipants.length > 0 ? "Online" : "Offline"}
                </p>
              )}
            </div>
            {view === "list" && (
              <button
                onClick={() => setView("new")}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
                title="New Chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {notification && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[var(--primary,#38C16C)] text-white px-3 py-1 text-xs shadow-md pointer-events-none">
              {notification}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Conversation List */}
            {view === "list" && (
              <div className="flex-1 overflow-y-auto">
                {loading && conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-sm text-gray-400">Loading...</div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm text-gray-500">No conversations yet</p>
                    <button
                      onClick={() => setView("new")}
                      className="mt-3 rounded-lg bg-[var(--primary,#38C16C)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                    >
                      Start a Chat
                    </button>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleOpenConversation(conv)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-100"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-soft,#eef9f2)] text-sm font-bold text-[var(--primary,#38C16C)]">
                        {conv.type === "group"
                          ? conv.name?.charAt(0)?.toUpperCase() || "G"
                          : conv.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm font-semibold text-gray-900 truncate">
                              {conv.name}
                            </span>
                            {conv.type === "direct" && (
                              <span
                                className={`inline-block h-2 w-2 rounded-full ${
                                  conv.participants[0]?.last_seen_at &&
                                  Date.now() - new Date(conv.participants[0].last_seen_at).getTime() < 2 * 60 * 1000
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                                title={conv.participants[0]?.last_seen_at ? "Online" : "Offline"}
                              />
                            )}
                          </span>
                          {conv.last_message && (
                            <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                              {formatTime(conv.last_message.created_at)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-gray-500 truncate">
                            {conv.last_message
                              ? `${conv.last_message.sender_id === userId ? "You" : conv.last_message.sender_name}: ${conv.last_message.image_url ? "Sent an image" : conv.last_message.body}`
                              : "No messages yet"}
                          </p>
                          {conv.unread_count > 0 && (
                            <span className="ml-2 flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[var(--primary,#38C16C)] px-1.5 text-[10px] font-bold text-white">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                        {conv.type === "group" && (
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">
                            {conv.participants.map((p) => p.name).join(", ")}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Chat View */}
            {view === "chat" && activeConversation && (
              <>
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                  style={{ background: "#f8fafb" }}
                >
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-gray-400">Start the conversation</p>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === userId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${
                            isMe
                              ? "bg-[var(--primary,#38C16C)] text-white rounded-br-md"
                              : "bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-sm"
                          }`}
                        >
                          {!isMe && activeConversation.type === "group" && (
                            <p className="text-[10px] font-semibold text-[var(--primary,#38C16C)] mb-0.5">
                              {msg.sender_name}
                            </p>
                          )}
                          {msg.image_url && (
                            <img
                              src={msg.image_url}
                              alt="Attachment"
                              className="mb-1.5 max-h-40 rounded-lg border border-white/20 object-cover"
                            />
                          )}
                          {msg.body && <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>}
                          <p
                            className={`text-[10px] mt-1 ${
                              isMe ? "text-white/60" : "text-gray-400"
                            }`}
                          >
                            {formatTime(msg.created_at)}
                          </p>
                          {isMe && msg.id === messages[messages.length - 1]?.id && lastOwnMessageSeen && (
                            <p className="text-[10px] mt-0.5 text-right text-white/60 flex items-center justify-end gap-0.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              Seen
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                {/* Message Input */}
                <div className="border-t border-gray-100 px-3 py-2 bg-white">
                  {pendingImage && (
                    <div className="relative mb-2 inline-block">
                      <img
                        src={pendingImage}
                        alt="Upload preview"
                        className="h-20 w-auto rounded-lg border border-gray-200 object-cover"
                      />
                      <button
                        onClick={() => setPendingImage(null)}
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center hover:bg-gray-800"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={sendingMsg}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-[var(--primary,#38C16C)] transition disabled:opacity-40"
                      aria-label="Attach image"
                      title="Attach image"
                    >
                      🖼️
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      placeholder="Type a message..."
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary,#38C16C)] transition"
                      disabled={sendingMsg}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={(!messageInput.trim() && !pendingImage) || sendingMsg}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary,#38C16C)] text-white transition hover:opacity-90 disabled:opacity-40"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* New Chat View */}
            {view === "new" && (
              <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Selected users chips */}
                {selectedUsers.length > 0 && (
                  <div className="px-4 pt-3 flex flex-wrap gap-1.5">
                    {selectedUsers.map((u) => (
                      <span
                        key={u.id}
                        className="inline-flex items-center gap-1 rounded-full bg-[var(--theme-soft,#eef9f2)] px-2.5 py-1 text-xs font-medium text-[var(--primary,#38C16C)]"
                      >
                        {u.name}
                        <button
                          onClick={() => handleSelectUser(u)}
                          className="hover:text-red-500 transition"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Group name input (when multiple users selected) */}
                {selectedUsers.length > 1 && (
                  <div className="px-4 pt-2">
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Group name (optional)"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary,#38C16C)] transition"
                    />
                  </div>
                )}

                {/* Search input */}
                <div className="px-4 pt-3 pb-2">
                  <input
                    type="text"
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--primary,#38C16C)] transition"
                    autoFocus
                  />
                </div>

                {/* User list */}
                <div className="flex-1 overflow-y-auto px-2">
                  {searchingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <span className="text-sm text-gray-400">Searching...</span>
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
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                            isSelected
                              ? "bg-[var(--theme-soft,#eef9f2)]"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                            {user.name
                              ?.split(" ")
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase() || "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            {user.email && (
                              <p className="text-[11px] text-gray-400 truncate">
                                {user.email}
                              </p>
                            )}
                            <span
                              className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {user.role?.replace(/_/g, " ")}
                            </span>
                          </div>
                          {isSelected && (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="var(--primary, #38C16C)"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Start Chat Button */}
                {selectedUsers.length > 0 && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    {chatError && (
                      <p className="mb-2 text-xs text-red-500 text-center">{chatError}</p>
                    )}
                    <button
                      onClick={handleStartChat}
                      disabled={creatingChat}
                      className="w-full rounded-xl bg-[var(--primary,#38C16C)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
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
            )}
          </div>
        </div>
      )}
    </>
  );
}
