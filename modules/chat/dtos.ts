export type MessageStatus = "SENT" | "DELIVERED" | "READ";
export type ConversationType = "OPERATOR" | "ADMIN" | "SUPPORT";
export type MuteConversationPreset =
  | "15m"
  | "1h"
  | "8h"
  | "24h"
  | "no end time yet";

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
  role: "OPERATOR" | "ADMIN" | "SUPPORT" | "USER";
}

export interface ConversationResponseDto {
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

export interface MessageAttachmentResponseDto {
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  width?: number;
  height?: number;
}

export interface MessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderName?: string;
  senderAvatarUrl?: string;
  content?: string;
  type: string;
  status: MessageStatus;
  attachments: MessageAttachmentResponseDto[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayloadDto {
  conversationId: number;
  content?: string;
  attachments?: MessageAttachmentResponseDto[];
}

export interface SetNicknameDto {
  conversationId: number;
  nickname: string | null;
}

export interface PinConversationDto {
  conversationId: number;
  isPinned: boolean;
}

export interface MuteConversationDto {
  conversationId: number;
  preset: MuteConversationPreset;
}

export interface GetMessagesParams {
  page: number;
  limit: number;
}

export interface CreateConversationDto {
  toUserId: number;
  type: ConversationType;
  initialMessage?: string;
}
