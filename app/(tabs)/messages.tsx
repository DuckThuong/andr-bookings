import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CHAT_QUERY_KEYS } from "@/modules/chat/hooks";
import {
  createConversation,
  getConversations,
  getOperatorDirectory,
} from "@/modules/chat/api";
import { ChatListItem } from "@/modules/chat/components";
import type { Conversation } from "@/modules/chat/types";

type FilterKey = "all" | "operator" | "admin";

const FILTER_LABELS: Record<FilterKey, string> = {
  all: "Tất cả",
  operator: "Nhà xe",
  admin: "Hỗ trợ",
};

export default function MessagesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const conversationsQuery = useQuery({
    queryKey: CHAT_QUERY_KEYS.CONVERSATIONS,
    queryFn: getConversations,
  });

  const operatorsQuery = useQuery({
    queryKey: CHAT_QUERY_KEYS.OPERATORS,
    queryFn: getOperatorDirectory,
  });

  const startMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (conversation: Conversation) => {
      void queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.CONVERSATIONS,
      });
      setSelectedId(conversation.conversationId);
      router.push(`/chat/${conversation.conversationId}` as never);
    },
  });

  const conversations: Conversation[] = conversationsQuery.data ?? [];
  const operators: Conversation[] = operatorsQuery.data ?? [];

  const filteredConversations = useMemo(() => {
    let items: Conversation[] = conversations;
    if (filter !== "all") {
      items = items.filter((item: Conversation) =>
        filter === "operator"
          ? item.type === "OPERATOR"
          : item.type === "ADMIN" || item.type === "SUPPORT",
      );
    }
    if (search.trim()) {
      const keyword = search.toLowerCase();
      items = items.filter(
        (item: Conversation) =>
          (item.conversationName ?? "").toLowerCase().includes(keyword) ||
          (item.lastMessagePreview ?? "").toLowerCase().includes(keyword),
      );
    }
    return items;
  }, [conversations, filter, search]);

  const totalUnread = useMemo(
    () =>
      conversations.reduce(
        (sum: number, item: Conversation) => sum + (item.unreadCount ?? 0),
        0,
      ),
    [conversations],
  );

  const isLoading = conversationsQuery.isLoading;
  const isEmpty = !isLoading && filteredConversations.length === 0;

  const onOpenConversation = (id: number) => {
    setSelectedId(id);
    router.push(`/chat/${id}` as never);
  };

  return (
    <SafeAreaView className="flex-1 bg-background_color" edges={["top"]}>
      {/* ─── Header ─── */}
      <View className="bg-primary_color px-5 pt-3 pb-5">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-[10px] font-bold uppercase tracking-wider text-[#f5a623]">
              Hỗ trợ & trò chuyện
            </Text>
            <Text className="text-2xl font-bold text-white_color mt-1">
              Tin nhắn
            </Text>
          </View>
          {totalUnread > 0 ? (
            <View className="rounded-full px-3 py-1.5 bg-white/10 border border-white/20">
              <Text className="text-xs font-semibold text-white_color">
                {totalUnread} chưa đọc
              </Text>
            </View>
          ) : null}
        </View>

        <View className="flex-row items-center bg-white_color rounded-2xl px-3 py-2.5">
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            className="flex-1 text-sm text-primary_color ml-2"
            placeholder="Tìm cuộc trò chuyện..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View className="flex-row items-center gap-1.5 mt-3">
          <Ionicons name="filter" size={12} color="rgba(255,255,255,0.7)" />
          {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
            <Pressable
              key={key}
              className={`rounded-full px-3 py-1.5 ${
                filter === key ? "bg-[#f5a623]" : "bg-white/10"
              }`}
              onPress={() => setFilter(key)}
            >
              <Text
                className={`text-xs font-semibold ${
                  filter === key
                    ? "text-primary_color"
                    : "text-white_color"
                }`}
              >
                {FILTER_LABELS[key]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ─── Conversation count ─── */}
      <View className="px-5 py-2 bg-white_color border-b border-[#e5ebef]">
        <Text className="text-[10px] font-bold uppercase tracking-wider text-text_color_4">
          {filteredConversations.length} cuộc trò chuyện
        </Text>
      </View>

      {/* ─── Conversation list ─── */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#00609c" />
        </View>
      ) : (
        <FlatList<Conversation>
          data={filteredConversations}
          keyExtractor={(item) => String(item.conversationId)}
          renderItem={({ item }) => (
            <ChatListItem
              conversation={item}
              isActive={selectedId === item.conversationId}
              onPress={() => onOpenConversation(item.conversationId)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={conversationsQuery.isRefetching}
              onRefresh={() => conversationsQuery.refetch()}
              tintColor="#00609c"
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-16 px-6">
              <View className="h-20 w-20 rounded-full bg-[#fff8ec] items-center justify-center mb-3">
                <Ionicons name="chatbubbles" size={36} color="#f5a623" />
              </View>
              <Text className="text-base font-bold text-primary_color">
                Chưa có cuộc trò chuyện
              </Text>
              <Text className="text-sm text-text_color_4 text-center mt-1.5">
                Bắt đầu nhắn tin với nhà xe hoặc đội hỗ trợ GoRide.
              </Text>
            </View>
          }
        />
      )}

      {/* ─── Hotlines ─── */}
      {!isLoading && operators.length > 0 ? (
        <View className="bg-white_color border-t border-[#e5ebef] px-5 py-3.5">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-text_color_4 mb-2.5">
            Liên hệ nhanh
          </Text>
          <View className="flex-row gap-2 flex-wrap">
            {operators.slice(0, 3).map((operator: Conversation) => (
              <Pressable
                key={operator.conversationId}
                className="flex-row items-center gap-2 rounded-full bg-background_color border border-[#e5ebef] px-3 py-2"
                onPress={() =>
                  startMutation.mutate({
                    toUserId: operator.toUser?.userId ?? 0,
                    type: "OPERATOR",
                  })
                }
              >
                <View
                  className="h-7 w-7 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#00609c" }}
                >
                  <Text className="text-white_color text-[11px] font-bold">
                    {(operator.conversationName ?? "?").charAt(0)}
                  </Text>
                </View>
                <Text
                  className="text-xs font-semibold text-primary_color max-w-[120px]"
                  numberOfLines={1}
                >
                  {operator.conversationName}
                </Text>
                <Ionicons name="add" size={14} color="#f5a623" />
              </Pressable>
            ))}
            <Pressable
              className="flex-row items-center gap-2 rounded-full bg-[#dcfce7] border border-[#86efac] px-3 py-2"
              onPress={() =>
                startMutation.mutate({ toUserId: 999, type: "ADMIN" })
              }
            >
              <View className="h-7 w-7 rounded-full bg-[#16a34a] items-center justify-center">
                <Ionicons name="headset" size={14} color="#fff" />
              </View>
              <Text className="text-xs font-semibold text-[#15803d]">
                Hỗ trợ GoRide
              </Text>
              <Ionicons name="add" size={14} color="#15803d" />
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
