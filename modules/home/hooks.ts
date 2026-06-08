import { useQueries } from "@tanstack/react-query";
import { findMasterDataByType } from "@/modules/home/api";
import {
  TYPE_OPERATOR,
  TYPE_PROMO,
  TYPE_SERVICE,
  TYPE_TOP_TRIP,
} from "@/modules/home/constants";
import {
  mapOperatorsFromMaster,
  mapPromosFromMaster,
  mapServicesFromMaster,
  mapTripsFromMaster,
} from "@/modules/home/mappers";

export function useHomeSections() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["master-data", TYPE_SERVICE] as const,
        queryFn: () => findMasterDataByType({ type: TYPE_SERVICE, code: "" }),
      },
      {
        queryKey: ["master-data", TYPE_PROMO] as const,
        queryFn: () => findMasterDataByType({ type: TYPE_PROMO, code: "" }),
      },
      {
        queryKey: ["master-data", TYPE_OPERATOR] as const,
        queryFn: () => findMasterDataByType({ type: TYPE_OPERATOR, code: "" }),
      },
      {
        queryKey: ["master-data", TYPE_TOP_TRIP] as const,
        queryFn: () => findMasterDataByType({ type: TYPE_TOP_TRIP, code: "" }),
      },
    ],
  });

  const [services, promos, operators, trips] = results;

  return {
    services: mapServicesFromMaster(services.data ?? []),
    promos: mapPromosFromMaster(promos.data ?? []),
    operators: mapOperatorsFromMaster(operators.data ?? []),
    trips: mapTripsFromMaster(trips.data ?? []),
    isLoading: results.some((query) => query.isLoading),
    isFetching: results.some((query) => query.isFetching),
    isError: results.some((query) => query.isError),
    error:
      results.find((query) => query.error)?.error ??
      results.find((query) => query.isError)?.error,
    refetchAll: () => Promise.all(results.map((query) => query.refetch())),
  };
}
