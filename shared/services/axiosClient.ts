import axios from "axios";
import Constants from "expo-constants";
import { authStorageService } from "@/modules/auth/storage";

function resolveBaseUrl() {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? "";

  if (!envBaseUrl) {
    return "";
  }

  try {
    const url = new URL(envBaseUrl);
    const isLoopbackHost =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1";

    if (!isLoopbackHost) {
      return url.toString().replace(/\/$/, "");
    }

    const expoHostUri = Constants.expoConfig?.hostUri;
    const expoHost = expoHostUri?.split(":")[0];

    if (!expoHost) {
      return url.toString().replace(/\/$/, "");
    }

    url.hostname = expoHost;
    return url.toString().replace(/\/$/, "");
  } catch {
    return envBaseUrl;
  }
}

const baseURL = resolveBaseUrl();

export const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = await authStorageService.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (__DEV__) {
      const requestUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;
      console.log("[api:request]", config.method?.toUpperCase(), requestUrl, {
        params: config.params,
      });
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authStorageService.clearAccessToken();
    }

    return Promise.reject(error);
  },
);
