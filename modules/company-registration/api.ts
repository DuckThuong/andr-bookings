import { axiosClient } from "@/shared/services/axiosClient";
import type {
  CreateCompanyRegistrationDto,
  CompanyRegistrationResponseDto,
} from "./types";

export async function createCompanyRegistration(
  payload: CreateCompanyRegistrationDto
): Promise<CompanyRegistrationResponseDto> {
  const response = await axiosClient.post<CompanyRegistrationResponseDto>(
    "/company-registrations",
    payload
  );
  return response.data;
}

export async function getMyCompanyRegistration(): Promise<CompanyRegistrationResponseDto | null> {
  try {
    const response = await axiosClient.get<CompanyRegistrationResponseDto>(
      "/company-registrations/me"
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function uploadImage(formData: FormData): Promise<{ imageUrl: string }> {
  const response = await axiosClient.post<{ imageUrl: string }>("/uploads/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
