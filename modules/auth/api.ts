import { axiosClient } from "@/shared/services/axiosClient";
import type { AuthResponse, LoginPayload } from "@/modules/auth/types";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}
