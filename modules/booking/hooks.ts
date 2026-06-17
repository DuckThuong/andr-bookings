import { useMutation, useQuery } from "@tanstack/react-query";
import {
  confirmPayment,
  createHold,
  getBooking,
  getSeatSelection,
  updateHoldPassenger,
  validatePromo,
} from "./api";
import type {
  ConfirmPaymentPayload,
  CreateHoldPayload,
  PassengerPayload,
  SeatSelectionResponse,
  ValidatePromoPayload,
} from "./types";

export function useSeatSelectionQuery(tripId: string | undefined, date?: string) {
  return useQuery({
    queryKey: ["seat-selection", tripId, date],
    queryFn: () => getSeatSelection(tripId!, { date }),
    enabled: Boolean(tripId),
  });
}

export function useValidatePromoMutation() {
  return useMutation({
    mutationFn: (payload: ValidatePromoPayload) => validatePromo(payload),
  });
}

export function useCreateHoldMutation() {
  return useMutation({
    mutationFn: (payload: CreateHoldPayload) => createHold(payload),
  });
}

export function useUpdatePassengerMutation() {
  return useMutation({
    mutationFn: ({
      holdId,
      passenger,
    }: {
      holdId: string;
      passenger: PassengerPayload;
    }) => updateHoldPassenger(holdId, passenger),
  });
}

export function useConfirmPaymentMutation() {
  return useMutation({
    mutationFn: ({
      holdId,
      payload,
    }: {
      holdId: string;
      payload: ConfirmPaymentPayload;
    }) => confirmPayment(holdId, payload),
  });
}

export function useBookingQuery(bookingId: string | undefined) {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId!),
    enabled: Boolean(bookingId),
  });
}
