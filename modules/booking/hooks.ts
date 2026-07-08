import { useMutation, useQuery } from "@tanstack/react-query";
import {
  confirmPayment,
  createBookingPaymentLink,
  createHold,
  getBooking,
  getBookingByPaymentLink,
  getPaymentStatus,
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

// PayOS Payment Hooks
export function useCreateBookingPaymentLinkMutation() {
  return useMutation({
    mutationFn: (holdId: string) => createBookingPaymentLink(holdId),
  });
}

export function useBookingByPaymentLinkQuery(paymentLinkId: string | undefined) {
  return useQuery({
    queryKey: ["booking-by-payment", paymentLinkId],
    queryFn: () => getBookingByPaymentLink(paymentLinkId!),
    enabled: Boolean(paymentLinkId),
  });
}

export function usePaymentStatusQuery(paymentLinkId: string | undefined) {
  return useQuery({
    queryKey: ["payment-status", paymentLinkId],
    queryFn: () => getPaymentStatus(paymentLinkId!),
    enabled: Boolean(paymentLinkId),
    retry: 1,
  });
}
