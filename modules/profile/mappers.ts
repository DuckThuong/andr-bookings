import { PICKUP_OPTIONS, DROPOFF_OPTIONS } from "@/modules/profile/constants";
import type {
  AccountBookingDetail,
  AccountBookingItem,
  PassengerPayload,
  ProfileBooking,
  ProfileBookingStatus,
  TrackingStep,
} from "@/modules/profile/types";
import { formatIsoDateToDisplay } from "@/shared/utils/date";

const PAYMENT_LABELS: Record<string, string> = {
  card: "Thẻ tín dụng / ghi nợ",
  ewallet: "Ví điện tử",
  bank: "Chuyển khoản ngân hàng",
  cash: "Tiền mặt",
};

const resolvePointLabel = (
  value: string | undefined,
  options: Array<{ value: string; label: string }>,
): string => {
  if (!value) return "—";
  return options.find((item) => item.value === value)?.label ?? value;
};

const formatSeatLabel = (
  item: AccountBookingItem | AccountBookingDetail,
): string => {
  const detail = item as AccountBookingDetail;

  if (detail.seats?.length) {
    return detail.seats.map((seat) => seat.name || seat.code).join(", ");
  }

  if (item.totalSeat > 1) return `${item.totalSeat} ghế`;
  if (item.totalSeat === 1) return "1 ghế";
  return "—";
};

export const mapBookingStatus = (
  item: AccountBookingItem,
  ticketStatus?: string | null,
  holdExpiresAt?: string | null,
): string => {
  const status = item.status?.toUpperCase() ?? "";
  const ticket = ticketStatus?.toUpperCase() ?? "";

  if (
    status === "CANCELLED" ||
    ticket === "CANCELLED" ||
    ticket === "REFUNDED"
  ) {
    return "CANCELLED";
  }

  // Check if HOLD booking has expired
  if (status === "HOLD" && holdExpiresAt) {
    if (new Date() > new Date(holdExpiresAt)) {
      return "CANCELLED";
    }
  }

  if (status === "HOLD") return "UNPAID";
  if (status === "CONFIRMED") return "CONFIRMED";

  if (
    status === "PENDING_APPROVAL" ||
    (status === "CONVERTED" && ticket === "PENDING")
  ) {
    return "PENDING";
  }

  if (status === "CONVERTED" && ticket === "PAID") return "WAITING";

  return "UNPAID";
};

const canEditBooking = (item: AccountBookingItem): boolean => {
  if (item.status !== "HOLD") return false;
  const expiresAt = new Date(item.holdExpiresAt);
  return !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() > Date.now();
};

export const mapAccountBookingToProfile = (
  item: AccountBookingItem | AccountBookingDetail,
  contactEmail = "",
): ProfileBooking => {
  const road = item.schedule?.road;
  const trip = item.schedule?.trip;
  const company = item.schedule?.company;
  const passenger = item.passenger;
  const ticket = (item as AccountBookingDetail).ticket;
  const route =
    road?.startPoint && road?.endPoint
      ? `${road.startPoint} → ${road.endPoint}`
      : (trip?.name ?? "—");

  return {
    id: String(item.id),
    holdCode: item.code,
    route,
    date: formatIsoDateToDisplay(item.createdAt),
    time: trip?.departure ?? "—",
    passengerName: passenger?.fullName ?? "—",
    seat: formatSeatLabel(item),
    pickup: resolvePointLabel(passenger?.pickupPoint, PICKUP_OPTIONS),
    dropoff: resolvePointLabel(passenger?.dropoffPoint, DROPOFF_OPTIONS),
    pickupValue: passenger?.pickupPoint ?? "",
    dropoffValue: passenger?.dropoffPoint ?? "",
    paymentMethod:
      PAYMENT_LABELS[item.paymentMethodId ?? ""] ?? item.paymentMethodId ?? "—",
    status: mapBookingStatus(item, ticket?.status ?? null, item.holdExpiresAt),
    bookingCode: ticket?.code ?? item.code,
    contactPhone: passenger?.phone ?? "",
    contactEmail,
    note: "",
    canEdit: canEditBooking(item),
    operatorCode: company?.code,
    operatorName: company?.companyName,
    operatorUserId: company?.operatorUserId,
  };
};

export const toPassengerPayload = (
  booking: ProfileBooking,
): PassengerPayload => ({
  fullName: booking.passengerName,
  phone: booking.contactPhone.replace(/\D/g, "").slice(-10),
  pickupPoint: booking.pickupValue,
  dropoffPoint: booking.dropoffValue,
});

export const getTrackingProgress = (status: string): number => {
  switch (status) {
    case "UNPAID":
      return 20;
    case "PENDING":
      return 40;
    case "CONFIRMED":
      return 60;
    case "WAITING":
      return 80;
    case "CANCELLED":
      return 0;
    default:
      return 0;
  }
};

export const buildTrackingSteps = (
  status: string,
): TrackingStep[] => {
  const progress = getTrackingProgress(status);
  const labels = [
    "Đã đặt vé",
    "Đã xác nhận",
    "Chuẩn bị khởi hành",
    "Đang di chuyển",
    "Hoàn thành",
  ];
  const thresholds = [20, 40, 60, 80, 100];

  return labels.map((label, index) => {
    const threshold = thresholds[index];
    const done = progress >= threshold;
    const prevThreshold = index === 0 ? 0 : thresholds[index - 1];
    const active = progress >= prevThreshold && progress < threshold + 20;

    return {
      key: `step-${index}`,
      label,
      done: status === "CANCELLED" ? false : done,
      active: status === "CANCELLED" ? false : active && !done,
    };
  });
};
