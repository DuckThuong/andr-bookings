import { axiosClient } from "@/shared/services/axiosClient";
import type {
  AuthResponse,
  LoginPayload,
  SignUpPayload,
} from "@/modules/auth/types";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>("/auth/sign-up", payload);
  return response.data;
}
