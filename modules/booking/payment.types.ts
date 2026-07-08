export type PaymentLinkResponse = {
  paymentLinkId: string;
  paymentUrl: string;
  qrCode?: string;
  amount: number;
  description: string;
};

export type PaymentStatus = "pending" | "paid" | "cancelled" | "expired";

export type BookingByPaymentLinkResponse = {
  bookingId: string;
  status: string;
  paymentStatus: PaymentStatus;
  paymentLinkId: string;
  amount: number;
  paymentMethod?: string;
  paidAt?: string;
  passengerPhone?: string;
};

export type PaymentStatusResponse = {
  status: PaymentStatus;
  paymentLinkId: string;
  amount: number;
  paidAt?: string;
  cancelledAt?: string;
};
