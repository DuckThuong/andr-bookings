import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyBooking,
  getProfile,
  listMyBookings,
  requestRefund,
  updateHoldPassenger,
  updateProfile,
  getPaymentInvoices,
  getRefundInvoices,
  getInvoiceSummary,
} from "@/modules/profile/api";
import { mapAccountBookingToProfile } from "@/modules/profile/mappers";
import type {
  PassengerPayload,
  ProfileBooking,
  RefundRequestPayload,
  UpdateUserProfilePayload,
  InvoiceQuery,
  RefundQuery,
} from "@/modules/profile/types";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getProfile,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useMyBookingsQuery(contactEmail = "") {
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: () => listMyBookings({ page: 1, limit: 50 }),
    select: (data) =>
      data.items.map((item) => mapAccountBookingToProfile(item, contactEmail)),
  });
}

export function useMyBookingQuery(id: number | null, contactEmail = "") {
  return useQuery({
    queryKey: ["myBooking", id],
    queryFn: () => getMyBooking(id!),
    enabled: id !== null && !Number.isNaN(id),
    select: (data) => mapAccountBookingToProfile(data, contactEmail),
  });
}

export function useUpdateBookingPassengerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      holdCode,
      passenger,
    }: {
      holdCode: string;
      passenger: PassengerPayload;
    }) => updateHoldPassenger(holdCode, passenger),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      void queryClient.invalidateQueries({ queryKey: ["myBooking"] });
    },
  });
}

export function mergeBookingUpdate(
  booking: ProfileBooking,
  values: Partial<ProfileBooking>,
): PassengerPayload {
  return {
    fullName: values.passengerName ?? booking.passengerName,
    phone: (values.contactPhone ?? booking.contactPhone)
      .replace(/\D/g, "")
      .slice(-10),
    pickupPoint: values.pickupValue ?? booking.pickupValue,
    dropoffPoint: values.dropoffValue ?? booking.dropoffValue,
  };
}

// ==================== INVOICE / PAYMENT HISTORY HOOKS ====================

export function useInvoiceSummaryQuery() {
  return useQuery({
    queryKey: ["invoiceSummary"],
    queryFn: getInvoiceSummary,
  });
}

export function usePaymentInvoicesQuery(params?: InvoiceQuery) {
  return useQuery({
    queryKey: ["paymentInvoices", params],
    queryFn: () => getPaymentInvoices(params),
  });
}

export function useRefundInvoicesQuery(params?: RefundQuery) {
  return useQuery({
    queryKey: ["refundInvoices", params],
    queryFn: () => getRefundInvoices(params),
  });
}

export function useRequestRefundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: number;
      payload?: RefundRequestPayload;
    }) => requestRefund(bookingId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      void queryClient.invalidateQueries({ queryKey: ["myBooking"] });
      void queryClient.invalidateQueries({ queryKey: ["refundInvoices"] });
    },
  });
}
