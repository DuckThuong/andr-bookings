import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getConversation,
  getConversationMessages,
  sendMessage,
} from "@/modules/chat/api";
import { CHAT_QUERY_KEYS } from "@/modules/chat/hooks";
import { ChatBubble, ChatComposer } from "@/modules/chat/components";
import type { ChatMessage } from "@/modules/chat/types";
import { sortMessagesAsc } from "@/modules/chat/mappers";

const QUICK_REPLIES_BY_TYPE: Record<string, string[]> = {
  OPERATOR: [
    "Tôi cần hỗ trợ về vé",
    "Tôi muốn đổi lịch trình",
    "Gửi thông tin liên hệ",
    "Yêu cầu hóa đơn",
  ],
  ADMIN: [
    "Tôi cần hỗ trợ khẩn cấp",
    "Báo cáo sự cố thanh toán",
    "Đánh giá dịch vụ",
    "Yêu cầu gọi lại",
  ],
  SUPPORT: [
    "Tôi cần hỗ trợ chung",
    "Câu hỏi về tài khoản",
    "Vấn đề kỹ thuật",
    "Yêu cầu hỗ trợ",
  ],
};

const CURRENT_USER_ID = 1;

export default function ChatDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(params.id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const listRef = useRef<FlatList | null>(null);
  const [lightbox, setLightbox] = useState<{
    images: { url: string; fileName?: string }[];
    index: number;
  } | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const conversationQuery = useQuery({
    queryKey: [CHAT_QUERY_KEYS.CONVERSATION(conversationId)],
    queryFn: () => getConversation(conversationId),
    enabled: Number.isFinite(conversationId),
  });

  const messagesQuery = useQuery<ChatMessage[]>({
    queryKey: CHAT_QUERY_KEYS.MESSAGES(conversationId),
    queryFn: () => getConversationMessages(conversationId),
    enabled: Number.isFinite(conversationId),
  });

  const sendMutation = useMutation({
    mutationFn: (payload: { content?: string }) =>
      sendMessage({
        conversationId,
        content: payload.content,
      }),
    onSuccess: (message) => {
      queryClient.setQueryData<ChatMessage[]>(
        CHAT_QUERY_KEYS.MESSAGES(conversationId),
        (current = []) => {
          if (current.some((m) => m.id === message.id)) return current;
          return [...current, message];
        },
      );
    },
    onError: (error) => {
      Alert.alert(
        "Lỗi",
        error instanceof Error ? error.message : "Không thể gửi tin nhắn",
      );
    },
  });

  const messages = sortMessagesAsc(messagesQuery.data ?? []);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages.length]);

  if (conversationQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white_color items-center justify-center">
        <ActivityIndicator color="#00609c" />
      </SafeAreaView>
    );
  }

  const conversation = conversationQuery.data;
  if (!conversation) {
    return (
      <SafeAreaView className="flex-1 bg-white_color items-center justify-center px-6">
        <Text className="text-base font-bold text-primary_color text-center">
          Không tìm thấy cuộc trò chuyện
        </Text>
        <Pressable
          className="mt-4 rounded-full bg-secondary_color px-5 py-2.5"
          onPress={() => router.back()}
        >
          <Text className="text-white_color font-semibold text-sm">
            Quay lại
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const quickReplies = QUICK_REPLIES_BY_TYPE[conversation.type] ?? [];
  const lastOwnMessageId = [...messages]
    .reverse()
    .find((m) => m.senderId === CURRENT_USER_ID)?.id;

  return (
    <SafeAreaView className="flex-1 bg-background_color" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* ─── Sticky header ─── */}
        <View className="chat-window-header">
          <Pressable
            onPress={() => router.back()}
            className="h-9 w-9 rounded-xl items-center justify-center"
            hitSlop={6}
          >
            <Ionicons name="chevron-back" size={22} color="#0a0e1a" />
          </Pressable>

          <AvatarPreview
            name={conversation.conversationName ?? "?"}
            color={conversation.type === "OPERATOR" ? "#00609c" : "#16a34a"}
          />

          <View className="chat-window-header__info">
            <View className="chat-window-header__name-row">
              <Text
                className="chat-window-header__name"
                numberOfLines={1}
              >
                {conversation.conversationName}
              </Text>
              {conversation.type === "ADMIN" ? (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#00609c"
                />
              ) : null}
            </View>
            <View className="chat-window-header__sub">
              <View className="chat-window-header__status" />
              <Text className="chat-window-header__status-text">
                Đang hoạt động
              </Text>
              <View className="chat-window-header__divider" />
              <Text
                className="chat-window-header__email"
                numberOfLines={1}
              >
                {conversation.toUser?.email}
              </Text>
            </View>
          </View>

          <View className="chat-window-header__actions">
            <Pressable
              className={`chat-window-header__icon-btn ${infoOpen ? "chat-window-header__icon-btn--active" : ""}`}
              onPress={() => setInfoOpen((v) => !v)}
              hitSlop={6}
            >
              <Ionicons
                name="information-circle"
                size={20}
                color={infoOpen ? "#f5a623" : "#0a0e1a"}
              />
            </Pressable>
          </View>
        </View>

        {/* ─── Info modal ─── */}
        <Modal
          visible={infoOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setInfoOpen(false)}
        >
          <Pressable
            className="flex-1 bg-black/40"
            onPress={() => setInfoOpen(false)}
          >
            <Pressable
              className="mt-auto bg-white_color rounded-t-3xl p-5"
              onPress={() => {}}
            >
              <View className="items-center mb-4">
                <View className="w-10 h-1 rounded-full bg-[#e5ebef]" />
              </View>
              <View className="items-center mb-4">
                <AvatarPreview
                  name={conversation.conversationName ?? "?"}
                  color={conversation.type === "OPERATOR" ? "#00609c" : "#16a34a"}
                  large
                />
                <Text className="text-lg font-bold text-primary_color mt-3">
                  {conversation.conversationName}
                </Text>
                <Text className="text-xs text-text_color_4 mt-1">
                  {conversation.type === "OPERATOR"
                    ? "Nhà xe"
                    : "Đội hỗ trợ GoRide"}
                </Text>
              </View>
              <InfoRow
                icon="mail"
                label="Email"
                value={conversation.toUser?.email || "—"}
              />
              <InfoRow icon="call" label="Hotline" value="1900-6067" />
              <InfoRow
                icon="location"
                label="Khu vực"
                value={
                  conversation.type === "OPERATOR"
                    ? "Toàn quốc — Hỗ trợ 24/7"
                    : "Trụ sở GoRide, TP. HCM"
                }
              />
            </Pressable>
          </Pressable>
        </Modal>

        {/* ─── Message stream ─── */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 8 }}
          renderItem={({ item, index }) => {
            const isYour = item.senderId === CURRENT_USER_ID;
            const showSender =
              !isYour && index > 0
                ? messages[index - 1]?.senderId !== item.senderId
                : !isYour;
            return (
              <ChatBubble
                message={item}
                isYour={isYour}
                showSender={showSender}
                senderName={item.senderName}
                onOpenImage={(images, startIndex) =>
                  setLightbox({
                    images: images.map((a) => ({
                      url: a.url ?? "",
                      fileName: a.fileName,
                    })),
                    index: startIndex,
                  })
                }
                messageStatus={item.status}
                showStatus={isYour && item.id === lastOwnMessageId}
              />
            );
          }}
        />

        {/* ─── Quick replies ─── */}
        {quickReplies.length > 0 ? (
          <View className="chat-quick">
            <View className="chat-quick__head">
              <Ionicons name="flash" size={11} color="#f5a623" />
              <Text className="chat-quick__head-text">
                {conversation.type === "ADMIN"
                  ? "Hỗ trợ nhanh"
                  : "Câu hỏi thường gặp"}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingRight: 16 }}
            >
              {quickReplies.map((label) => (
                <Pressable
                  key={label}
                  className="chat-quick__item"
                  onPress={() =>
                    sendMutation.mutate({ content: label })
                  }
                >
                  <Text className="chat-quick__item-text">{label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* ─── Composer ─── */}
        <ChatComposer
          onSend={(payload) =>
            sendMutation.mutate({ content: payload.content })
          }
          placeholder={`Nhắn cho ${conversation.conversationName}...`}
          busy={sendMutation.isPending}
        />

        {/* ─── Lightbox ─── */}
        <Modal visible={!!lightbox} transparent animationType="fade">
          <Pressable
            className="flex-1 bg-black/95 items-center justify-center"
            onPress={() => setLightbox(null)}
          >
            {lightbox ? (
              <>
                <View className="absolute top-12 left-5 right-5 flex-row items-center">
                  <Text className="text-white_color text-sm flex-1">
                    {lightbox.index + 1}/{lightbox.images.length}
                  </Text>
                  <Pressable
                    onPress={() => setLightbox(null)}
                    className="h-9 w-9 rounded-full bg-white/15 items-center justify-center"
                    hitSlop={6}
                  >
                    <Ionicons name="close" size={20} color="#fff" />
                  </Pressable>
                </View>
                <Image
                  source={{ uri: lightbox.images[lightbox.index]?.url }}
                  className="w-[92vw] h-[80vh]"
                  resizeMode="contain"
                />
                {lightbox.images.length > 1 ? (
                  <>
                    <Pressable
                      className="absolute left-4 top-1/2 h-12 w-12 rounded-full bg-white/15 items-center justify-center"
                      onPress={() =>
                        setLightbox((current) =>
                          current
                            ? {
                                ...current,
                                index:
                                  (current.index - 1 + current.images.length) %
                                  current.images.length,
                              }
                            : current,
                        )
                      }
                    >
                      <Ionicons name="chevron-back" size={24} color="#fff" />
                    </Pressable>
                    <Pressable
                      className="absolute right-4 top-1/2 h-12 w-12 rounded-full bg-white/15 items-center justify-center"
                      onPress={() =>
                        setLightbox((current) =>
                          current
                            ? {
                                ...current,
                                index:
                                  (current.index + 1) % current.images.length,
                              }
                            : current,
                        )
                      }
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={24}
                        color="#fff"
                      />
                    </Pressable>
                  </>
                ) : null}
              </>
            ) : null}
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const AvatarPreview = ({
  name,
  color,
  large,
}: {
  name: string;
  color: string;
  large?: boolean;
}) => {
  const initial = (name ?? "?").charAt(0).toUpperCase();
  const size = large ? 88 : 48;
  return (
    <View
      className="rounded-full items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    >
      <Text
        className="font-bold text-white_color"
        style={{ fontSize: large ? 28 : 18 }}
      >
        {initial}
      </Text>
    </View>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center gap-3 py-3 border-b border-[#f3f5f7]">
    <View className="h-9 w-9 rounded-xl bg-background_color items-center justify-center">
      <Ionicons name={icon} size={18} color="#00609c" />
    </View>
    <View className="flex-1">
      <Text className="text-[11px] text-text_color_4">{label}</Text>
      <Text
        className="text-sm font-medium text-primary_color"
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  </View>
);
