import axios from "axios";

const FALLBACK_ERROR_MESSAGE = "Đã xảy ra lỗi. Vui lòng thử lại.";

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return FALLBACK_ERROR_MESSAGE;
  }

  const apiMessage = error.response?.data?.message;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  if (Array.isArray(apiMessage) && typeof apiMessage[0] === "string") {
    return apiMessage[0];
  }

  return FALLBACK_ERROR_MESSAGE;
}
