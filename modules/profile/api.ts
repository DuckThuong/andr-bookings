import { axiosClient } from "@/shared/services/axiosClient";
import type {
  AccountBookingDetail,
  AccountBookingQuery,
  AccountPaginated,
  AccountBookingItem,
  PassengerPayload,
  RefundRequestPayload,
  RefundRequestResponse,
  UpdateUserProfilePayload,
  UserProfile,
  PaymentInvoice,
  RefundInvoice,
  InvoicePaginated,
  InvoiceSummary,
  InvoiceQuery,
  RefundQuery,
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

// ==================== INVOICE / PAYMENT HISTORY API ====================

export async function getPaymentInvoices(
  params?: InvoiceQuery,
): Promise<InvoicePaginated<PaymentInvoice>> {
  const response = await axiosClient.get<InvoicePaginated<PaymentInvoice>>(
    "/client/invoices/payments",
    { params },
  );
  return response.data;
}

export async function getRefundInvoices(
  params?: RefundQuery,
): Promise<InvoicePaginated<RefundInvoice>> {
  const response = await axiosClient.get<InvoicePaginated<RefundInvoice>>(
    "/client/invoices/refunds",
    { params },
  );
  return response.data;
}

export async function getInvoiceSummary(): Promise<InvoiceSummary> {
  const response = await axiosClient.get<InvoiceSummary>("/client/invoices/summary");
  return response.data;
}

// ==================== REFUND REQUEST API ====================

export async function requestRefund(
  bookingId: number,
  payload?: RefundRequestPayload,
): Promise<RefundRequestResponse> {
  const response = await axiosClient.post<RefundRequestResponse>(
    `/client/account/bookings/${bookingId}/refund`,
    payload ?? {},
  );
  return response.data;
}
