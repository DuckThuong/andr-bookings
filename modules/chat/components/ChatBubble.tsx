import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ChatMessage, ChatMessageAttachment } from "../types";
import { formatMessageTime } from "../mappers";

export interface ChatBubbleProps {
  message: ChatMessage;
  isYour: boolean;
  showSender?: boolean;
  senderName?: string;
  senderAvatar?: string;
  onOpenImage?: (
    images: ChatMessageAttachment[],
    startIndex: number,
  ) => void;
  messageStatus?: "SENT" | "DELIVERED" | "READ";
  showStatus?: boolean;
}

const STATUS_LABEL: Record<"SENT" | "DELIVERED" | "READ", string> = {
  SENT: "Đã gửi",
  DELIVERED: "Đã nhận",
  READ: "Đã đọc",
};

export const ChatBubble = ({
  message,
  isYour,
  showSender,
  senderName,
  onOpenImage,
  messageStatus,
  showStatus,
}: ChatBubbleProps) => {
  const attachments: ChatMessageAttachment[] = message.attachments || [];
  const imageAttachments = attachments.filter((a) =>
    a.mimeType?.startsWith("image/"),
  );
  const fileAttachments = attachments.filter(
    (a) => !a.mimeType?.startsWith("image/"),
  );

  return (
    <View
      className={`chat-bubble-row ${isYour ? "chat-bubble-row--own" : ""}`}
    >
      {!isYour ? (
        <View className="chat-bubble-row__avatar">
          <Text className="chat-bubble-row__avatar-text">
            {(senderName ?? "?").charAt(0).toUpperCase()}
          </Text>
        </View>
      ) : null}

      <View
        className={`chat-bubble ${isYour ? "chat-bubble--own" : "chat-bubble--in"}`}
      >
        {!isYour && showSender && senderName ? (
          <Text className="chat-bubble__sender">{senderName}</Text>
        ) : null}

        {message.content ? (
          <Text
            className={`chat-bubble__text ${isYour ? "chat-bubble__text--own" : ""}`}
          >
            {message.content}
          </Text>
        ) : null}

        {imageAttachments.length > 0 ? (
          <View className="chat-bubble__images">
            {imageAttachments.slice(0, 4).map((item, index) => (
              <Pressable
                key={`${item.url}-${index}`}
                className="chat-bubble__image"
                onPress={() => onOpenImage?.(imageAttachments, index)}
              >
                <Image
                  source={{ uri: item.url }}
                  className="chat-bubble__image-el"
                  resizeMode="cover"
                />
                {index === 3 && imageAttachments.length > 4 ? (
                  <View className="chat-bubble__image-more">
                    <Text className="chat-bubble__image-more-text">
                      +{imageAttachments.length - 4}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>
        ) : null}

        {fileAttachments.length > 0 ? (
          <View className="chat-bubble__files">
            {fileAttachments.map((item, index) => (
              <View key={`${item.url}-${index}`} className="chat-bubble__file">
                <Ionicons
                  name="attach"
                  size={14}
                  color={isYour ? "#fff" : "#00609c"}
                />
                <Text
                  className={`chat-bubble__file-name ${isYour ? "text-white_color" : ""}`}
                  numberOfLines={1}
                >
                  {item.fileName || "Tệp đính kèm"}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="chat-bubble__meta">
          <Text className="chat-bubble__time">
            {formatMessageTime(message.createdAt)}
          </Text>
          {showStatus && messageStatus && isYour ? (
            <View
              className={`chat-bubble__status chat-bubble__status--${messageStatus.toLowerCase()}`}
            >
              <Ionicons
                name={
                  messageStatus === "READ" || messageStatus === "DELIVERED"
                    ? "checkmark-done"
                    : "checkmark"
                }
                size={12}
                color={messageStatus === "SENT" ? "#6b7280" : "#00609c"}
              />
              <Text
                className="chat-bubble__status-label"
                style={{
                  color: messageStatus === "SENT" ? "#6b7280" : "#00609c",
                }}
              >
                {STATUS_LABEL[messageStatus]}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
