import type {
  ChatMessage,
  Conversation,
  MuteConversationPreset,
  SendMessageAttachmentDto,
} from "../types";

export interface SocketEventMeta {
  requestId?: string;
  conversationId?: number;
  sentAt: string;
  version: number;
}

export interface SocketEventEnvelope<T> {
  event: string;
  data: T;
  meta: SocketEventMeta;
}

export interface SocketAck<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  requestId?: string;
}

export interface JoinLeaveConversationPayload {
  conversationId: number;
}

export interface SendMessageSocketPayload {
  conversationId: number;
  content?: string;
  attachments?: SendMessageAttachmentDto[];
  requestId?: string;
}

export interface ReadMessageSocketPayload {
  conversationId: number;
  messageId?: number;
  requestId?: string;
}

export interface MessageStatusUpdatedPayload {
  conversationId: number;
  messageId: number;
  status: "SENT" | "DELIVERED" | "READ";
  updatedAt: string;
  actorUserId?: number;
}

export type MessageSentEvent = SocketEventEnvelope<ChatMessage>;
export type ConversationUpdatedEvent = SocketEventEnvelope<Conversation>;
export type MessageStatusUpdatedEvent =
  SocketEventEnvelope<MessageStatusUpdatedPayload>;

export type { MuteConversationPreset };
