import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversation,
  getConversation,
  getConversationMessages,
  getConversations,
  getOperatorDirectory,
  sendMessage,
} from "./api";
import type { CreateConversationPayload, SendMessagePayload } from "./types";

export const CHAT_QUERY_KEYS = {
  CONVERSATIONS: ["chat", "conversations"] as const,
  CONVERSATION: (id: number) => ["chat", "conversations", id] as const,
  MESSAGES: (id: number) => ["chat", "conversations", id, "messages"] as const,
  OPERATORS: ["chat", "operators"] as const,
};

export const useConversationsQuery = () =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.CONVERSATIONS,
    queryFn: getConversations,
  });

export const useConversationQuery = (id: number | null) =>
  useQuery({
    queryKey: id ? CHAT_QUERY_KEYS.CONVERSATION(id) : ["chat", "noop"],
    queryFn: () => getConversation(id!),
    enabled: id !== null,
  });

export const useConversationMessagesQuery = (id: number | null) =>
  useQuery({
    queryKey: id ? CHAT_QUERY_KEYS.MESSAGES(id) : ["chat", "noop-messages"],
    queryFn: () => getConversationMessages(id!),
    enabled: id !== null,
  });

export const useOperatorDirectoryQuery = () =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.OPERATORS,
    queryFn: getOperatorDirectory,
  });

export const useSendMessageMutation = (conversationId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    onSuccess: (message) => {
      queryClient.setQueryData(
        CHAT_QUERY_KEYS.MESSAGES(conversationId),
        (current: Awaited<ReturnType<typeof getConversationMessages>> | undefined) =>
          current ? [...current, message] : [message],
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
    mutationFn: (payload: CreateConversationPayload) =>
      createConversation(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.CONVERSATIONS,
      });
    },
  });
};
