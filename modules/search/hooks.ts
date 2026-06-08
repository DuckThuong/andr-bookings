import { useQuery } from "@tanstack/react-query";
import { searchTrips } from "@/modules/search/api";
import type { SearchTripsParams } from "@/modules/search/types";

export function useTripSearchQuery(params: SearchTripsParams | null) {
  return useQuery({
    queryKey: ["trip-search", params],
    queryFn: () => searchTrips(params ?? {}),
    enabled: params !== null,
    placeholderData: (previousData) => previousData,
  });
}
