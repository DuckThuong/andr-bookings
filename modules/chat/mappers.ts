import type { ChatMessage, Conversation } from "./types";

export const mapConversationsByTime = (items: Conversation[]) =>
  [...items].sort(
    (a, b) =>
      new Date(b.lastMessageAt ?? 0).getTime() -
      new Date(a.lastMessageAt ?? 0).getTime(),
  );

export const mapPinnedFirst = (items: Conversation[]) => {
  const pinned: Conversation[] = [];
  const rest: Conversation[] = [];
  items.forEach((item) => {
    const isPinned = item.participants.find((p) => p.userId === 1)?.isPinned;
    if (isPinned) pinned.push(item);
    else rest.push(item);
  });
  return [...pinned, ...rest];
};

export const formatConversationTime = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} ph`;
  if (hours < 24) return `${hours} giờ`;

  const sameDay = date.toDateString() === now.toDateString();
  if (!sameDay) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  }
  return `${hours} giờ`;
};

export const formatMessageTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getConversationDisplayName = (conversation: Conversation) =>
  conversation.conversationName ||
  conversation.toUser?.fullName ||
  "Cuộc trò chuyện";

export const getConversationAvatar = (conversation: Conversation) =>
  conversation.conversationAvatar ||
  conversation.toUser?.avatarUrl ||
  (getConversationDisplayName(conversation).charAt(0) ?? "?");

export const isOperatorConversation = (conversation: Conversation) =>
  conversation.type === "OPERATOR";

export const isAdminConversation = (conversation: Conversation) =>
  conversation.type === "ADMIN";

export const sortMessagesAsc = (messages: ChatMessage[]) =>
  [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

export const getConversationInitials = (conversation: Conversation) => {
  const name = getConversationDisplayName(conversation);
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

export const getConversationPreview = (conversation: Conversation) => {
  if (conversation.lastMessagePreview) {
    return conversation.lastMessagePreview;
  }
  if (conversation.type === "OPERATOR") {
    return "Hỗ trợ về vé, lịch trình và dịch vụ nhà xe.";
  }
  return "Đội ngũ GoRide luôn sẵn sàng hỗ trợ bạn.";
};

export const getTypeLabel = (type: Conversation["type"]) => {
  switch (type) {
    case "OPERATOR":
      return "Nhà xe";
    case "ADMIN":
      return "Hỗ trợ viên";
    case "SUPPORT":
      return "Hỗ trợ";
  }
};
