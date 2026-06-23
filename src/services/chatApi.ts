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
  image_url?: string;
  sender_id: number;
  sender_name: string;
  sender_role?: string;
  created_at: string;
}

export interface ConversationLastMessage {
  id: number;
  body: string;
  image_url?: string;
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

const dataURLtoBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Send a message
export const sendMessage = async (
  conversationId: number,
  body: string,
  image?: string
): Promise<ChatMessage> => {
  const trimmed = body.trim();
  const payload = image
    ? (() => {
        const formData = new FormData();
        if (trimmed) formData.append("body", trimmed);
        formData.append("image", dataURLtoBlob(image), "chat-image.jpg");
        return formData;
      })()
    : { body: trimmed };

  const response = await api.post(
    `/chat/conversations/${conversationId}/messages`,
    payload,
    image
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined
  );
  return response.data?.data;
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
