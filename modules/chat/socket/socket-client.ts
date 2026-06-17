import { io, type Socket } from "socket.io-client";
import Constants from "expo-constants";
import { authStorageService } from "@/modules/auth/storage";

const resolveSocketUrl = () => {
  const envSocketUrl = process.env.EXPO_PUBLIC_SOCKET_URL?.trim();
  if (envSocketUrl) {
    return envSocketUrl.replace(/\/$/, "");
  }

  const apiBase = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? "";
  if (!apiBase) return "";

  try {
    const url = new URL(apiBase);
    const isLoopbackHost =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";

    if (!isLoopbackHost) {
      return url.toString().replace(/\/$/, "");
    }

    const expoHostUri = Constants.expoConfig?.hostUri;
    const expoHost = expoHostUri?.split(":")[0];
    if (expoHost) {
      url.hostname = expoHost;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return apiBase.replace(/\/$/, "");
  }
};

let socketInstance: Socket | null = null;

export const getSocketClient = () => {
  if (socketInstance) {
    return socketInstance;
  }

  const baseUrl = resolveSocketUrl();
  if (!baseUrl) {
    console.warn(
      "[chat-socket] Không tìm thấy EXPO_PUBLIC_SOCKET_URL / EXPO_PUBLIC_API_BASE_URL, socket sẽ không kết nối được.",
    );
  }

  socketInstance = io(`${baseUrl}/chat`, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: {
      token: undefined as string | undefined,
    },
  });

  socketInstance.on("reconnect_attempt", () => {
    void refreshSocketAuth();
  });

  return socketInstance;
};

export const refreshSocketAuth = async () => {
  if (!socketInstance) return;
  const token = await authStorageService.getAccessToken();
  socketInstance.auth = {
    ...(typeof socketInstance.auth === "object" ? socketInstance.auth : {}),
    token: token ? `Bearer ${token}` : undefined,
  };
};

export const resetSocketClient = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
};
