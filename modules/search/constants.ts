import type { FilterKey, SeatType, SortKey } from "@/modules/search/types";

export const seatTypeOptions: Array<{ key: SeatType; label: string }> = [
  { key: "all", label: "All" },
  { key: "sleeper", label: "Sleeper" },
  { key: "seat", label: "Seat" },
  { key: "limousine", label: "VIP" },
  { key: "bus", label: "Bus" },
];

export const filterOptions: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All time" },
  { key: "morning", label: "Morning" },
  { key: "daytime", label: "Day" },
  { key: "night", label: "Night" },
  { key: "wifi", label: "Wifi" },
  { key: "ac", label: "A/C" },
];

export const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: "price", label: "Lowest price" },
  { key: "departure", label: "Departure" },
  { key: "duration", label: "Shortest" },
  { key: "rating", label: "Top rated" },
];
