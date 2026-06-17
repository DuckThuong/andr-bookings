import { axiosClient } from "@/shared/services/axiosClient";
import type {
  BookingSuccessResponse,
  ConfirmPaymentPayload,
  CreateHoldPayload,
  CreateHoldResponse,
  HoldDraftResponse,
  PassengerPayload,
  SeatSelectionResponse,
  ValidatePromoPayload,
  ValidatePromoResponse,
} from "./types";

export async function getSeatSelection(
  tripId: string,
  params?: { date?: string },
): Promise<SeatSelectionResponse> {
  const response = await axiosClient.get<SeatSelectionResponse>(
    `/api/bookings/seat-selection/${tripId}`,
    { params },
  );
  return response.data;
}

export async function validatePromo(
  payload: ValidatePromoPayload,
): Promise<ValidatePromoResponse> {
  const response = await axiosClient.post<ValidatePromoResponse>(
    "/api/bookings/validate-promo",
    payload,
  );
  return response.data;
}

export async function createHold(
  payload: CreateHoldPayload,
): Promise<CreateHoldResponse> {
  const response = await axiosClient.post<CreateHoldResponse>(
    "/api/bookings/hold",
    payload,
  );
  return response.data;
}

export async function updateHoldPassenger(
  holdId: string,
  passenger: PassengerPayload,
): Promise<HoldDraftResponse> {
  const response = await axiosClient.patch<HoldDraftResponse>(
    `/api/bookings/hold/${holdId}/passenger`,
    passenger,
  );
  return response.data;
}

export async function confirmPayment(
  holdId: string,
  payload: ConfirmPaymentPayload,
): Promise<BookingSuccessResponse> {
  const response = await axiosClient.post<BookingSuccessResponse>(
    `/api/bookings/hold/${holdId}/pay`,
    payload,
  );
  return response.data;
}

export async function getBooking(
  bookingId: string,
): Promise<BookingSuccessResponse> {
  const response = await axiosClient.get<BookingSuccessResponse>(
    `/api/bookings/${bookingId}`,
  );
  return response.data;
}
