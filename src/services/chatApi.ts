import api from "./api";

export interface ChatUser {
  id: number;
  name: string;
  email?: string;
  role: string;
}

export interface ChatParticipant {
  id: number;
  name: string;
  role: string;
  last_read_at?: string;
  last_seen_at?: string;
}

export interface ChatMessage {
  id: number;
  body: string;
  file_url?: string;
  sender_id: number;
  sender_name: string;
  sender_role?: string;
  created_at: string;
}

export interface ConversationLastMessage {
  id: number;
  body: string;
  file_url?: string;
  sender_id: number;
  sender_name: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  type: "direct" | "group";
  name: string;
  participants: ChatParticipant[];
  last_message: ConversationLastMessage | null;
  unread_count: number;
  updated_at: string;
}

export interface ChatSettings {
  students_can_chat: boolean;
  teachers_can_chat: boolean;
  hod_can_chat: boolean;
  admin_can_chat: boolean;
  super_admin_can_chat: boolean;
}

// Fetch all conversations for the current user
export const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await api.get("/chat/conversations");
  return response.data?.data ?? [];
};

// Create a new conversation
export const createConversation = async (data: {
  participant_ids: number[];
  type?: "direct" | "group";
  name?: string;
}): Promise<{ id: number; existing: boolean }> => {
  const response = await api.post("/chat/conversations", data);
  return response.data?.data;
};

// Fetch messages for a conversation
export const fetchMessages = async (
  conversationId: number,
  page?: number
): Promise<{ data: ChatMessage[]; has_more: boolean; next_page: number; participants: ChatParticipant[] }> => {
  const response = await api.get(
    `/chat/conversations/${conversationId}/messages`,
    { params: page ? { page } : {} }
  );
  return response.data;
};

// Send a message
export const sendMessage = async (
  conversationId: number,
  body: string,
  file?: File
): Promise<ChatMessage> => {
  const trimmed = body.trim();
  if (file) {
    const formData = new FormData();
    if (trimmed) formData.append("body", trimmed);
    formData.append("file", file, file.name);
    const response = await api.post(
      `/chat/conversations/${conversationId}/messages`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data?.data;
  }
  const response = await api.post(
    `/chat/conversations/${conversationId}/messages`,
    { body: trimmed }
  );
  return response.data?.data;
};

// Edit a message
export const editMessage = async (
  conversationId: number,
  messageId: number,
  body: string
): Promise<ChatMessage> => {
  const response = await api.put(
    `/chat/conversations/${conversationId}/messages/${messageId}`,
    { body }
  );
  return response.data?.data;
};

// Delete a message
export const deleteMessage = async (
  conversationId: number,
  messageId: number
): Promise<void> => {
  await api.delete(
    `/chat/conversations/${conversationId}/messages/${messageId}`
  );
};

// Mark a conversation as read
export const markConversationRead = async (
  conversationId: number
): Promise<void> => {
  await api.post(`/chat/conversations/${conversationId}/read`);
};

// Get total unread count
export const fetchUnreadCount = async (): Promise<number> => {
  const response = await api.get("/chat/unread-count");
  return response.data?.data?.unread_count ?? 0;
};

// Search users to start a chat with
export const fetchChatUsers = async (search?: string): Promise<ChatUser[]> => {
  const response = await api.get("/chat/users", {
    params: search ? { search } : {},
  });
  return response.data?.data ?? [];
};

export const fetchChatSettings = async (): Promise<ChatSettings> => {
  const response = await api.get("/chat/settings");
  return (
    response.data?.data ?? {
      students_can_chat: true,
      teachers_can_chat: true,
      hod_can_chat: true,
      admin_can_chat: true,
      super_admin_can_chat: true,
    }
  );
};

export const updateChatSettings = async (
  data: ChatSettings
): Promise<ChatSettings> => {
  const response = await api.post("/chat/settings", data);
  return response.data?.data;
};
