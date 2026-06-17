import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ConversationResponseDto } from "../dtos";
import {
  formatConversationTime,
  getConversationDisplayName,
  getConversationInitials,
  getConversationPreview,
  getTypeLabel,
} from "../mappers";

export interface ChatListItemProps {
  conversation: ConversationResponseDto;
  isActive?: boolean;
  onPress?: () => void;
}

const TYPE_BADGE_COLOR: Record<ConversationResponseDto["type"], string> = {
  OPERATOR: "#00609c",
  ADMIN: "#16a34a",
  SUPPORT: "#16a34a",
};

const TYPE_BADGE_ICON: Record<ConversationResponseDto["type"], keyof typeof Ionicons.glyphMap> = {
  OPERATOR: "bus",
  ADMIN: "headset",
  SUPPORT: "help-circle",
};

const TYPE_TAG_BG: Record<ConversationResponseDto["type"], string> = {
  OPERATOR: "bg-[#e0f2fe]",
  ADMIN: "bg-[#dcfce7]",
  SUPPORT: "bg-[#dcfce7]",
};

const TYPE_TAG_TEXT: Record<ConversationResponseDto["type"], string> = {
  OPERATOR: "text-[#00609c]",
  ADMIN: "text-[#15803d]",
  SUPPORT: "text-[#15803d]",
};

export const ChatListItem = ({
  conversation,
  isActive,
  onPress,
}: ChatListItemProps) => {
  const name = getConversationDisplayName(conversation);
  const initials = getConversationInitials(conversation);
  const preview = getConversationPreview(conversation);
  const unread = conversation.unreadCount ?? 0;
  const isPinned = conversation.participants[0]?.isPinned;
  const time = conversation.lastMessageAt
    ? formatConversationTime(conversation.lastMessageAt)
    : "";
  const typeColor = TYPE_BADGE_COLOR[conversation.type];
  const typeIcon = TYPE_BADGE_ICON[conversation.type];
  const typeLabel = getTypeLabel(conversation.type);

  return (
    <Pressable
      onPress={onPress}
      className={`chat-item ${isActive ? "chat-item--active" : ""}`}
      android_ripple={{ color: "#f3f5f7" }}
    >
      {isActive ? (
        <View className="absolute left-0 top-4 bottom-4 w-1 rounded-r-md bg-[#f5a623]" />
      ) : null}

      <View className="chat-item__avatar-wrap">
        <View
          className="chat-item__avatar"
          style={{ backgroundColor: typeColor }}
        >
          <Text className="chat-item__avatar-text">{initials || "?"}</Text>
        </View>
        <View
          className="chat-item__type-badge"
          style={{ backgroundColor: typeColor }}
        >
          <Ionicons name={typeIcon} size={10} color="#fff" />
        </View>
        {unread > 0 ? (
          <View className="chat-item__unread">
            <Text className="chat-item__unread-text">
              {unread > 99 ? "99+" : unread}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="chat-item__body">
        <View className="chat-item__line-1">
          <Text
            className={`chat-item__name ${unread > 0 ? "chat-item__name--unread" : ""}`}
            numberOfLines={1}
          >
            {name}
          </Text>
          <View className="flex-row items-center gap-1.5">
            {isPinned ? (
              <Ionicons name="pin" size={11} color="#f5a623" />
            ) : null}
            <Text className="chat-item__time">{time}</Text>
          </View>
        </View>

        <View className="chat-item__line-2">
          <Text
            className={`chat-item__preview ${unread > 0 ? "chat-item__preview--unread" : ""}`}
            numberOfLines={1}
          >
            {preview}
          </Text>
        </View>

        <View className="chat-item__tags">
          <Text
            className={`chat-item__tag ${TYPE_TAG_BG[conversation.type]} ${TYPE_TAG_TEXT[conversation.type]}`}
          >
            {typeLabel}
          </Text>
          {conversation.toUser?.email ? (
            <Text className="chat-item__tag chat-item__tag--verified">
              ✓ Đã xác minh
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};
