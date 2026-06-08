import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "auth.access_token";

type AuthListener = (token: string | null) => void;

const listeners = new Set<AuthListener>();

const notifyListeners = (token: string | null) => {
  listeners.forEach((listener) => listener(token));
};

export const authStorageService = {
  subscribe(listener: AuthListener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  async setAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      notifyListeners(token);
    } catch (error) {
      console.error("[AuthStorage] Failed to save access token:", error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("[AuthStorage] Failed to get access token:", error);
      return null;
    }
  },

  async clearAccessToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      notifyListeners(null);
    } catch (error) {
      console.error("[AuthStorage] Failed to clear access token:", error);
    }
  },
};
