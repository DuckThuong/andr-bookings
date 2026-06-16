import { axiosClient } from "@/shared/services/axiosClient";
import type {
  ChatMessage,
  Conversation,
  CreateConversationPayload,
  SendMessagePayload,
} from "./types";

const USE_MOCK = true;

const HOUR = 1000 * 60 * 60;

const mockOperatorsSeed: Conversation[] = [
  {
    conversationId: 1,
    conversationName: "Phương Trang — Hỗ trợ vé",
    conversationAvatar: "PT",
    conversationCreatedAt: new Date(Date.now() - 24 * 7 * HOUR).toISOString(),
    lastMessagePreview: "Chào anh/chị, chuyến HN → ĐN đã được xác nhận.",
    lastMessageAt: new Date(Date.now() - 0.25 * HOUR).toISOString(),
    unreadCount: 2,
    type: "OPERATOR",
    toUser: {
      userId: 101,
      fullName: "Phương Trang Futa",
      username: "phuongtrang",
      avatarUrl: "PT",
      email: "support@phuongtrang.vn",
      role: "OPERATOR",
    },
    participants: [
      { userId: 1, isPinned: true, isMuted: false },
      {
        userId: 101,
        nickname: "Phương Trang",
        isPinned: false,
        isMuted: false,
      },
    ],
  },
  {
    conversationId: 2,
    conversationName: "Thiên Long — Hỗ trợ đổi vé",
    conversationAvatar: "TL",
    conversationCreatedAt: new Date(Date.now() - 24 * 2 * HOUR).toISOString(),
    lastMessagePreview: "Anh cho em xin mã vé ạ, em hỗ trợ đổi luôn nhé.",
    lastMessageAt: new Date(Date.now() - 1.2 * HOUR).toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    toUser: {
      userId: 102,
      fullName: "Thiên Long",
      username: "thienlong",
      avatarUrl: "TL",
      email: "cskh@thienlong.vn",
      role: "OPERATOR",
    },
    participants: [
      { userId: 1, isPinned: false, isMuted: false },
      {
        userId: 102,
        nickname: "Thiên Long",
        isPinned: false,
        isMuted: false,
      },
    ],
  },
  {
    conversationId: 3,
    conversationName: "Hỗ trợ khách hàng GoRide",
    conversationAvatar: "GR",
    conversationCreatedAt: new Date(Date.now() - 24 * 5 * HOUR).toISOString(),
    lastMessagePreview: "Cảm ơn anh đã phản hồi, em sẽ kiểm tra ngay.",
    lastMessageAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
    unreadCount: 0,
    type: "ADMIN",
    toUser: {
      userId: 999,
      fullName: "Đội hỗ trợ GoRide",
      username: "admin",
      avatarUrl: "GR",
      email: "admin@goride.vn",
      role: "ADMIN",
    },
    participants: [
      { userId: 1, isPinned: false, isMuted: true },
      {
        userId: 999,
        nickname: "Đội hỗ trợ",
        isPinned: false,
        isMuted: false,
      },
    ],
  },
];

const mockOperatorDirectory: Conversation[] = [
  {
    conversationId: 11,
    conversationName: "Hoàng Long — Hỗ trợ 24/7",
    conversationAvatar: "HL",
    conversationCreatedAt: new Date(Date.now() - 24 * 30 * HOUR).toISOString(),
    lastMessagePreview: "Hệ thống sẵn sàng phục vụ quý khách 24/7.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    toUser: {
      userId: 103,
      fullName: "Hoàng Long",
      username: "hoanglong",
      avatarUrl: "HL",
      email: "support@hoanglong.vn",
      role: "OPERATOR",
    },
    participants: [{ userId: 103, isPinned: false, isMuted: false }],
  },
  {
    conversationId: 12,
    conversationName: "Kumho Samco — Hỗ trợ vé",
    conversationAvatar: "KS",
    conversationCreatedAt: new Date(Date.now() - 24 * 14 * HOUR).toISOString(),
    lastMessagePreview: "Cảm ơn quý khách đã sử dụng dịch vụ.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    type: "OPERATOR",
    toUser: {
      userId: 104,
      fullName: "Kumho Samco",
      username: "kumhosamco",
      avatarUrl: "KS",
      email: "support@kumhosamco.vn",
      role: "OPERATOR",
    },
    participants: [{ userId: 104, isPinned: false, isMuted: false }],
  },
];

const seedMessages: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 901,
      conversationId: 1,
      senderId: 101,
      senderName: "Phương Trang Futa",
      senderAvatarUrl: "PT",
      content: "Xin chào anh/chị, em là nhân viên hỗ trợ của Phương Trang ạ.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 2 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 2 * HOUR).toISOString(),
    },
    {
      id: 902,
      conversationId: 1,
      senderId: 1,
      senderName: "Bạn",
      content:
        "Chào em, anh vừa đặt chuyến HN → ĐN lúc 14:30 ngày mai, kiểm tra giúp anh với.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(
        Date.now() - 24 * 2 * HOUR + 5 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 24 * 2 * HOUR + 5 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: 903,
      conversationId: 1,
      senderId: 101,
      senderName: "Phương Trang Futa",
      senderAvatarUrl: "PT",
      content:
        "Dạ em xác nhận chuyến PT-HN-DN-2031 đã được ghi nhận. Anh nhớ có mặt tại bến Mỹ Đình trước 14:00 ạ.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 1.5 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 1.5 * HOUR).toISOString(),
    },
    {
      id: 904,
      conversationId: 1,
      senderId: 101,
      senderName: "Phương Trang Futa",
      senderAvatarUrl: "PT",
      content: "Chuyến HN → ĐN đã được xác nhận.",
      type: "TEXT",
      status: "DELIVERED",
      attachments: [],
      createdAt: new Date(Date.now() - 0.25 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 0.25 * HOUR).toISOString(),
    },
  ],
  2: [
    {
      id: 801,
      conversationId: 2,
      senderId: 102,
      senderName: "Thiên Long",
      senderAvatarUrl: "TL",
      content: "Chào anh, em nhận được yêu cầu đổi vé từ hệ thống.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 2.5 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 2.5 * HOUR).toISOString(),
    },
  ],
  3: [
    {
      id: 701,
      conversationId: 3,
      senderId: 999,
      senderName: "Đội hỗ trợ GoRide",
      senderAvatarUrl: "GR",
      content: "Cảm ơn anh đã phản hồi, em sẽ kiểm tra ngay.",
      type: "TEXT",
      status: "READ",
      attachments: [],
      createdAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 0.8 * HOUR).toISOString(),
    },
  ],
};

let nextMessageId = 10000;
let nextConversationId = 100;

export const getConversations = async (): Promise<Conversation[]> => {
  if (USE_MOCK) {
    return [...mockOperatorsSeed].sort(
      (a, b) =>
        new Date(b.lastMessageAt ?? 0).getTime() -
        new Date(a.lastMessageAt ?? 0).getTime(),
    );
  }
  const response = await axiosClient.get<Conversation[]>("/chat/conversations");
  return response.data;
};

export const getConversation = async (
  id: number,
): Promise<Conversation | null> => {
  if (USE_MOCK) {
    return mockOperatorsSeed.find((c) => c.conversationId === id) ?? null;
  }
  const response = await axiosClient.get<Conversation>(
    `/chat/conversations/${id}`,
  );
  return response.data;
};

export const getConversationMessages = async (
  conversationId: number,
): Promise<ChatMessage[]> => {
  if (USE_MOCK) {
    return seedMessages[conversationId] ?? [];
  }
  const response = await axiosClient.get<ChatMessage[]>(
    `/chat/conversations/${conversationId}/messages`,
  );
  return response.data;
};

export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<ChatMessage> => {
  if (USE_MOCK) {
    nextMessageId += 1;
    const message: ChatMessage = {
      id: nextMessageId,
      conversationId: payload.conversationId,
      senderId: 1,
      senderName: "Bạn",
      content: payload.content,
      type: "TEXT",
      status: "SENT",
      attachments: payload.attachments ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const conv = mockOperatorsSeed.find(
      (c) => c.conversationId === payload.conversationId,
    );
    if (conv) {
      conv.lastMessagePreview = payload.content ?? "(đính kèm)";
      conv.lastMessageAt = message.createdAt;
    }
    return message;
  }
  const response = await axiosClient.post<ChatMessage>(
    "/chat/messages",
    payload,
  );
  return response.data;
};

export const getOperatorDirectory = async (): Promise<Conversation[]> => {
  if (USE_MOCK) {
    return mockOperatorDirectory;
  }
  const response = await axiosClient.get<Conversation[]>("/chat/operators");
  return response.data;
};

export const createConversation = async (
  payload: CreateConversationPayload,
): Promise<Conversation> => {
  if (USE_MOCK) {
    nextConversationId += 1;
    const id = nextConversationId;
    const newConv: Conversation = {
      conversationId: id,
      conversationName:
        payload.type === "ADMIN"
          ? "Hỗ trợ khách hàng GoRide"
          : `Nhà xe #${id}`,
      conversationAvatar: "GR",
      conversationCreatedAt: new Date().toISOString(),
      lastMessagePreview: payload.initialMessage ?? "",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      type: payload.type,
      toUser: {
        userId: payload.toUserId,
        fullName: "Liên hệ mới",
        username: "user",
        avatarUrl: "NA",
        email: "",
        role: payload.type === "ADMIN" ? "ADMIN" : "OPERATOR",
      },
      participants: [{ userId: 1, isPinned: false, isMuted: false }],
    };
    mockOperatorsSeed.unshift(newConv);
    return newConv;
  }
  const response = await axiosClient.post<Conversation>(
    "/chat/conversations",
    payload,
  );
  return response.data;
};
