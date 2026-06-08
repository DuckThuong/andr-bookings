export type SeatType = "all" | "sleeper" | "seat" | "limousine" | "bus";
export type FilterKey = "all" | "morning" | "daytime" | "night" | "wifi" | "ac";
export type SortKey = "price" | "departure" | "duration" | "rating";

export type SearchTripsParams = {
  fromCity?: string;
  toCity?: string;
  date?: string;
  passengers?: number;
  seatType?: SeatType;
  filters?: string;
  sortKey?: SortKey;
  page?: number;
  pageSize?: number;
};

export type SearchTrip = {
  id: string;
  featured?: boolean;
  operator: {
    code: string;
    logoColor: string;
    name: string;
    vehicleType: string;
    rating: number;
    reviewCount: string;
  };
  departure: { time: string; city: string; station: string };
  arrival: { time: string; city: string; station: string };
  duration: string;
  stopLabel: string;
  price: number;
  seatsLeft: number;
  badges: Array<{
    type: "green" | "amber" | "blue" | "gray" | "red";
    label: string;
  }>;
  amenities: Array<{
    icon: string;
    label: string;
  }>;
};

export type SearchTripsResponse = {
  search: {
    from: string;
    to: string;
    date: string;
    passengers: number;
    seatType: SeatType;
  };
  meta: {
    resultCount: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
    sortKey: SortKey;
    filters: FilterKey[];
  };
  trips: SearchTrip[];
};
