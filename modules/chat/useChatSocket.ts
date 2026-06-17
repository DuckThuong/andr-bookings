import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatSocket } from "./socket/chat-socket";
import { CHAT_QUERY_KEYS, markConversationAsRead } from "./api";
import type { MessageResponseDto, ConversationResponseDto } from "./dtos";

export function useChatSocket(conversationId: number | null) {
  const queryClient = useQueryClient();

  const syncMessages = useCallback(
    async (targetId: number) => {
      try {
        const freshMessages = await import("./api").then((mod) =>
          mod.getConversationMessages(targetId, { page: 1, limit: 50 }),
        );
        queryClient.setQueryData(
          CHAT_QUERY_KEYS.MESSAGES(targetId),
          freshMessages,
        );
      } catch (error) {
        // noop
      }
    },
    [queryClient],
  );

  useEffect(() => {
    if (!conversationId || Number.isNaN(conversationId)) return;

    let unsubscribeMessageSent: (() => void) | undefined;
    let unsubscribeConversationUpdated: (() => void) | undefined;

    const handleMessageSent = async (event: { data: MessageResponseDto }) => {
      const incoming = event.data;
      if (incoming.conversationId !== conversationId) return;

      const current = (queryClient.getQueryData<MessageResponseDto[]>(
        CHAT_QUERY_KEYS.MESSAGES(conversationId),
      )) ?? [];

      const updated = current.some((message) => message.id === incoming.id)
        ? current.map((message) =>
            message.id === incoming.id ? incoming : message,
          )
        : [...current, incoming];

      queryClient.setQueryData(
        CHAT_QUERY_KEYS.MESSAGES(conversationId),
        updated,
      );
      await syncMessages(conversationId);
    };

    const handleConversationUpdated = async (
      event: { data: ConversationResponseDto },
    ) => {
      const updatedConversation = event.data;
      if (updatedConversation.conversationId !== conversationId) return;

      const current = (queryClient.getQueryData<ConversationResponseDto[]>(
        CHAT_QUERY_KEYS.CONVERSATIONS,
      )) ?? [];

      const replaced = current.map((item) =>
        item.conversationId === updatedConversation.conversationId
          ? updatedConversation
          : item,
      );

      queryClient.setQueryData(
        CHAT_QUERY_KEYS.CONVERSATIONS,
        replaced,
      );
      await syncMessages(conversationId);
      await markConversationAsRead(conversationId).catch(() => undefined);
    };

    void chatSocket.joinConversation(conversationId).then(() => {
      unsubscribeMessageSent = chatSocket.subscribeMessageSent(
        handleMessageSent,
      );
      unsubscribeConversationUpdated = chatSocket.subscribeConversationUpdated(
        handleConversationUpdated,
      );
    });

    void markConversationAsRead(conversationId).catch(() => undefined);

    return () => {
      unsubscribeMessageSent?.();
      unsubscribeConversationUpdated?.();
      void chatSocket.leaveConversation(conversationId).catch(() => undefined);
    };
  }, [conversationId, queryClient, syncMessages]);
}
