import type { FilterKey, SeatType, SortKey } from "@/modules/search/types";

export const seatTypeOptions: Array<{ key: SeatType; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "sleeper", label: "Giường nằm" },
  { key: "seat", label: "Ghế ngồi" },
  { key: "limousine", label: "VIP" },
  { key: "bus", label: "Xe bus" },
];

export const filterOptions: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Mọi giờ" },
  { key: "morning", label: "Sáng" },
  { key: "daytime", label: "Ban ngày" },
  { key: "night", label: "Đêm" },
  { key: "wifi", label: "Wifi" },
  { key: "ac", label: "Điều hòa" },
];

export const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: "price", label: "Giá thấp nhất" },
  { key: "departure", label: "Giờ khởi hành" },
  { key: "duration", label: "Thời gian ngắn nhất" },
  { key: "rating", label: "Đánh giá cao" },
];
