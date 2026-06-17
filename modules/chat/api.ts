import { axiosClient } from "@/shared/services/axiosClient";
import { CHAT_QUERY_KEYS, ConverationEndpoint } from "./config";
import type {
  ConversationResponseDto,
  CreateConversationDto,
  GetMessagesParams,
  MessageResponseDto,
  MuteConversationDto,
  PinConversationDto,
  SendMessagePayloadDto,
  SetNicknameDto,
} from "./dtos";

// ─── Conversations ──────────────────────────────────────────────────────
export const getChatConversations = async (): Promise<
  ConversationResponseDto[]
> => {
  const response = await axiosClient.get<ConversationResponseDto[]>(
    ConverationEndpoint.CHAT_CONVERSATIONS,
  );
  return response.data;
};

export const getChatConversationDetail = async (
  id: number | string,
): Promise<ConversationResponseDto | null> => {
  const response = await axiosClient.get<ConversationResponseDto>(
    ConverationEndpoint.CHAT_CONVERSATION_DETAIL(id),
  );
  return response.data;
};

export const createChatConversation = async (
  payload: CreateConversationDto,
): Promise<ConversationResponseDto> => {
  const response = await axiosClient.post<ConversationResponseDto>(
    ConverationEndpoint.CHAT_CONVERSATIONS,
    payload,
  );
  return response.data;
};

// ─── Messages ───────────────────────────────────────────────────────────
export const getConversationMessages = async (
  conversationId: number | string,
  params: GetMessagesParams,
): Promise<MessageResponseDto[]> => {
  const response = await axiosClient.get<{ data: MessageResponseDto[] }>(
    ConverationEndpoint.CHAT_CONVERSATION_MESSAGES(conversationId),
    { params },
  );
  return response.data.data;
};

export const sendChatMessage = async (
  payload: SendMessagePayloadDto,
): Promise<MessageResponseDto> => {
  const response = await axiosClient.post<MessageResponseDto>(
    ConverationEndpoint.CHAT_SEND_MESSAGE,
    payload,
  );
  return response.data;
};

export const markConversationAsRead = async (
  conversationId: number | string,
  messageId?: number,
): Promise<void> => {
  await axiosClient.post(ConverationEndpoint.CHAT_MARK_READ(conversationId), {
    messageId,
  });
};

// ─── Conversation actions (nickname, pin, mute) ─────────────────────────
export const setConversationNickname = async (
  payload: SetNicknameDto,
): Promise<void> => {
  await axiosClient.patch(
    ConverationEndpoint.CHAT_SET_NICKNAME(payload.conversationId),
    { nickname: payload.nickname },
  );
};

export const pinConversation = async (
  payload: PinConversationDto,
): Promise<void> => {
  await axiosClient.patch(
    ConverationEndpoint.CHAT_PIN(payload.conversationId),
    { isPinned: payload.isPinned },
  );
};

export const muteConversation = async (
  payload: MuteConversationDto,
): Promise<void> => {
  await axiosClient.patch(
    ConverationEndpoint.CHAT_MUTE(payload.conversationId),
    { preset: payload.preset },
  );
};

// ─── Hotlines (operator/admin) ──────────────────────────────────────────
export const getOperatorHotlines = async (): Promise<
  ConversationResponseDto[]
> => {
  const response = await axiosClient.get<ConversationResponseDto[]>(
    ConverationEndpoint.CHAT_OPERATOR_HOTLINE,
  );
  return response.data;
};

export { CHAT_QUERY_KEYS };
