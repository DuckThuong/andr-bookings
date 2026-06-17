export type ProfileTabKey =
  | "overview"
  | "account"
  | "trips"
  | "tracking"
  | "settings";

export type ProfileBookingStatus =
  | "Đã xác nhận"
  | "Chờ khởi hành"
  | "Chờ xác nhận"
  | "Chưa thanh toán"
  | "Đã hủy";

export type UserProfile = {
  id: number;
  userCode: string;
  userName: string;
  userDob: string;
  userGender: number;
  userPhone: string;
  userEmail: string;
  userAvatar: string;
  userRole: number;
  userStatus: number;
  userIsEmailVerified: boolean;
  ticketCount?: number;
  bookingCount?: number;
  totalPaid?: number;
  rank?: string;
  spentAmount?: number;
  nextRank?: string;
  nextRankThreshold?: number;
  rankProgressPercent?: number;
  lastBookingAt?: string;
  pendingTicketCount?: number;
  refundCount?: number;
};

export type UpdateUserProfilePayload = {
  userName?: string;
  userDob?: string;
  userGender?: number;
  userAvatar?: string;
  userPhone?: string;
  userEmail?: string;
};

export type AccountBookingPassenger = {
  fullName: string;
  phone: string;
  pickupPoint: string;
  dropoffPoint: string;
};

export type AccountBookingScheduleRoad = {
  startPoint: string;
  endPoint: string;
  standardDuration?: string;
};

export type AccountBookingScheduleTrip = {
  departure?: string;
  arrival?: string;
  name?: string;
};

export type AccountBookingScheduleCompany = {
  code?: string;
  companyName?: string;
  operatorUserId?: number;
};

export type AccountBookingSchedule = {
  trip?: AccountBookingScheduleTrip | null;
  road?: AccountBookingScheduleRoad | null;
  company?: AccountBookingScheduleCompany | null;
};

export type AccountBookingSeat = {
  id: number;
  code: string;
  name: string;
};

export type AccountBookingTicket = {
  id: number;
  code: string;
  status: string;
};

export type AccountBookingItem = {
  id: number;
  code: string;
  status: string;
  totalSeat: number;
  passenger: AccountBookingPassenger | null;
  paymentMethodId?: string | null;
  holdExpiresAt: string;
  createdAt: string;
  schedule?: AccountBookingSchedule | null;
};

export type AccountBookingDetail = AccountBookingItem & {
  seats?: AccountBookingSeat[];
  ticket?: AccountBookingTicket | null;
};

export type AccountPaginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AccountBookingQuery = {
  page?: number;
  limit?: number;
};

export type ProfileBooking = {
  id: string;
  holdCode: string;
  route: string;
  date: string;
  time: string;
  passengerName: string;
  seat: string;
  pickup: string;
  dropoff: string;
  pickupValue: string;
  dropoffValue: string;
  paymentMethod: string;
  status: ProfileBookingStatus;
  bookingCode: string;
  contactPhone: string;
  contactEmail: string;
  note: string;
  canEdit: boolean;
  operatorCode?: string;
  operatorName?: string;
  operatorUserId?: number;
};

export type PassengerPayload = {
  fullName: string;
  phone: string;
  pickupPoint: string;
  dropoffPoint: string;
};

export type TrackingStep = {
  key: string;
  label: string;
  done: boolean;
  active: boolean;
};
