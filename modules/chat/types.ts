export type MessageStatus = "SENT" | "DELIVERED" | "READ";
export type ConversationType = "OPERATOR" | "ADMIN" | "SUPPORT";
export type MuteConversationPreset =
  | "15m"
  | "1h"
  | "8h"
  | "24h"
  | "no end time yet";

export type ConversationRole = "OPERATOR" | "ADMIN" | "SUPPORT" | "USER";

export interface ConversationParticipant {
  userId: number;
  nickname?: string;
  isPinned: boolean;
  isMuted: boolean;
  mutedUntil?: string;
}

export interface ConversationToUser {
  userId: number;
  fullName: string;
  username: string;
  avatarUrl: string;
  email: string;
  role: ConversationRole;
}

export interface Conversation {
  conversationId: number;
  conversationName?: string;
  conversationAvatar?: string;
  conversationCreatedAt: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount: number;
  type: ConversationType;
  toUser?: ConversationToUser;
  participants: ConversationParticipant[];
}

export interface ChatMessageAttachment {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  width?: number;
  height?: number;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName?: string;
  senderAvatarUrl?: string;
  content?: string;
  type: string;
  status: MessageStatus;
  attachments: ChatMessageAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  conversationId: number;
  content?: string;
  attachments?: ChatMessageAttachment[];
}

export interface CreateConversationPayload {
  toUserId: number;
  type: ConversationType;
  initialMessage?: string;
}
