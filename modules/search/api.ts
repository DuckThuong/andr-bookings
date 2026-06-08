import { axiosClient } from "@/shared/services/axiosClient";
import type { SearchTripsParams, SearchTripsResponse } from "@/modules/search/types";

export async function searchTrips(
  params: SearchTripsParams,
): Promise<SearchTripsResponse> {
  const response = await axiosClient.get<SearchTripsResponse>("/api/trips/search", {
    params,
  });

  return response.data;
}
