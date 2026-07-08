export type VehicleType = "16" | "29" | "35" | "45";

export type SeatStatus = "available" | "booked" | "vip";

export interface SeatDef {
  id: string;
  label?: string;
  status: SeatStatus;
}

export type SeatCellDef =
  | ({ type: "seat" } & SeatDef)
  | { type: "aisle" }
  | { type: "empty" };

export interface RowDef {
  row: number;
  cells?: SeatCellDef[];
  seats?: Array<SeatDef | null>;
  full?: boolean;
}

export type VehicleConfig = {
  label: string;
  icon: string;
  floors: number;
  isSleeper: boolean;
  mapTitle: string;
  mapSub: string;
};

export type AddonService = {
  id: string;
  icon: string;
  name: string;
  price: number;
  hasQty: boolean;
};

export type PromoCode = {
  code: string;
  discount: string;
};

export type Policy = {
  icon: string;
  title: string;
  description: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type PickupPoint = {
  value: string;
  label: string;
};

export type PassengerData = {
  fullName: string;
  phone: string;
  pickupPointDefault: string;
  pickupPointOptions: PickupPoint[];
  dropoffPointDefault: string;
  dropoffPointOptions: PickupPoint[];
};

export type BookingTrip = {
  tripId: string;
  companyTripId: number;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  arriveNote?: string;
  date: string;
  durationLabel: string;
  unitPrice: number;
  operatorName: string;
  operatorCode: string;
};

export type BookingPageData = {
  trip: BookingTrip;
  passenger: PassengerData;
  breadcrumb: BreadcrumbItem[];
};

export type SeatMeta = {
  version: string;
  currency: string;
  holdSecondsDefault: number;
  maxSeatsPerBooking: number;
  feeRate: number;
  pickupAddonUnitPrice: number;
  unitPrice: number;
};

export type SeatSelectionVehicle = VehicleConfig & {
  layouts: Record<string, RowDef[]>;
};

export type SeatSelectionOperator = {
  code: string;
  name: string;
  rating: number;
  reviewCount: string;
  routeLabel: string;
  amenities: { icon: string; label: string }[];
};

export type SeatSelectionCatalog = {
  addonServices: AddonService[];
  promoCodes: PromoCode[];
  policies: Policy[];
};

export type SeatSelectionResponse = {
  meta: SeatMeta;
  pageData: BookingPageData;
  operator: SeatSelectionOperator;
  catalog: SeatSelectionCatalog;
  vehicles: Record<VehicleType, SeatSelectionVehicle>;
  defaultVehicleType: VehicleType;
  defaultFloor: number;
};

export type ValidatePromoPayload = {
  promoCode: string;
  subTotal: number;
  addonsTotal: number;
  tripId?: string;
};

export type ValidatePromoResponse = {
  valid: boolean;
  promoCode: string;
  promoDiscount: number;
  type?: "fixed" | "percent";
  value?: number;
  message?: string;
};

export type CreateHoldAddonLine = {
  id: string;
  name: string;
  price: number;
  qty?: number;
};

export type CreateHoldPayload = {
  tripId: string;
  vehicleType: VehicleType;
  floor?: number;
  seatIds: string[];
  addons?: CreateHoldAddonLine[];
  promoCode?: string;
  holdDurationSeconds?: number;
};

export type BookingPricing = {
  subTotal: number;
  addonsTotal: number;
  fee: number;
  promoCode?: string | null;
  promoDiscount: number;
  total: number;
};

export type CreateHoldResponse = {
  holdId: string;
  expiresAt: string;
  seatIds: string[];
  holdSeconds: number;
  pricing: BookingPricing;
};

export type PassengerPayload = {
  fullName: string;
  phone: string;
  pickupPoint: string;
  dropoffPoint: string;
};

export type HoldDraftResponse = {
  holdId: string;
  tripId: string;
  vehicleType: string;
  floor: number;
  seatIds: string[];
  promoCode: string | null;
  passenger: PassengerPayload;
  pricing: BookingPricing;
  holdSeconds: number;
};

export type ConfirmPaymentPayload = {
  paymentMethodId: string;
  transactionRef?: string;
};

export type BookingSuccessTrip = {
  bookingId: string;
  operatorShortName: string;
  operatorName: string;
  busType: string;
  rating: number;
  hasInsurance: boolean;
  departTime: string;
  departCity: string;
  departStation: string;
  arriveTime: string;
  arriveTimeNote?: string;
  arriveCity: string;
  arriveStation: string;
  durationLabel: string;
  stopsLabel: string;
  date: string;
  boardAt: string;
  alightAt: string;
  qrCode: string;
  paymentMethod: {
    label: string;
    last4?: string;
  };
};

export type BookingSuccessSeat = {
  id: string;
  label: string;
};

export type BookingSuccessNotification = {
  id: string;
  icon: string;
  colorClass: "green" | "amber" | "blue";
  title: string;
  desc: string;
};

export type NextAction = {
  id: string;
  icon: string;
  label: string;
  prompt: string;
};

export type BookingSuccessResponse = {
  bookingId: string;
  status: string;
  trip: BookingSuccessTrip;
  seats: BookingSuccessSeat[];
  pricing: BookingPricing;
  notifications: BookingSuccessNotification[];
  nextActions: NextAction[];
};

export type PaymentMethod = {
  id: string;
  label: string;
  icon: string;
};

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "payos", label: "PayOS (VietQR)", icon: "qr-code" },
  { id: "cash", label: "Tiền mặt", icon: "cash" },
];
