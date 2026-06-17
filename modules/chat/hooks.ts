import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChatConversation,
  getChatConversationDetail,
  getConversationMessages,
  getChatConversations,
  getOperatorHotlines,
  sendChatMessage,
  CHAT_QUERY_KEYS,
} from "./api";
import { sortMessagesAsc } from "./mappers";
import type {
  CreateConversationDto,
  MessageResponseDto,
  SendMessagePayloadDto,
} from "./dtos";

export const useConversationsQuery = () =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.CONVERSATIONS,
    queryFn: getChatConversations,
  });

export const useConversationQuery = (id: number | null) =>
  useQuery({
    queryKey: id ? CHAT_QUERY_KEYS.CONVERSATION(id) : ["chat", "noop"],
    queryFn: () => getChatConversationDetail(id!),
    enabled: id !== null,
  });

export const useConversationMessagesQuery = (id: number | null) =>
  useQuery({
    queryKey: id ? CHAT_QUERY_KEYS.MESSAGES(id) : ["chat", "noop-messages"],
    queryFn: () => getConversationMessages(id!, { page: 1, limit: 50 }),
    enabled: id !== null,
    select: (data) => sortMessagesAsc(data),
  });

export const useOperatorDirectoryQuery = () =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.OPERATORS,
    queryFn: getOperatorHotlines,
  });

export const useSendMessageMutation = (conversationId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendMessagePayloadDto) => sendChatMessage(payload),
    onSuccess: (message) => {
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.MESSAGES(conversationId),
        (current: unknown) => {
          const messages = current as MessageResponseDto[] | undefined;
          const list = messages ?? [];
          if (list.some((m) => m.id === message.id)) return messages;
          return [...list, message];
        },
      );
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.CONVERSATIONS,
      });
    },
  });
};

export const useCreateConversationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateConversationDto) =>
      createChatConversation(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.CONVERSATIONS,
      });
    },
  });
};
