import { axiosClient } from "@/shared/services/axiosClient";
import type {
  AccountBookingDetail,
  AccountBookingQuery,
  AccountPaginated,
  AccountBookingItem,
  PassengerPayload,
  UpdateUserProfilePayload,
  UserProfile,
} from "@/modules/profile/types";

export async function getProfile(): Promise<UserProfile> {
  const response = await axiosClient.get<UserProfile>("/user/me");
  return response.data;
}

export async function updateProfile(
  payload: UpdateUserProfilePayload,
): Promise<UserProfile> {
  const response = await axiosClient.patch<UserProfile>("/user/me", payload);
  return response.data;
}

export async function listMyBookings(
  params?: AccountBookingQuery,
): Promise<AccountPaginated<AccountBookingItem>> {
  const response = await axiosClient.get<AccountPaginated<AccountBookingItem>>(
    "/client/account/bookings",
    { params },
  );
  return response.data;
}

export async function getMyBooking(id: number): Promise<AccountBookingDetail> {
  const response = await axiosClient.get<AccountBookingDetail>(
    `/client/account/bookings/${id}`,
  );
  return response.data;
}

export async function updateHoldPassenger(
  holdCode: string,
  passenger: PassengerPayload,
) {
  const response = await axiosClient.patch(
    `/api/bookings/hold/${holdCode}/passenger`,
    passenger,
  );
  return response.data;
}
