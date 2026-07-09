import { useState, useEffect, useCallback } from "react";
import { axiosClient } from "@/shared/services/axiosClient";

export interface MasterDataItem {
  id: number;
  type: string;
  code: string;
  name: string;
  rule?: string;
  sort: number;
}

export interface BookingStatusMeta {
  label: string;
  color: string;
  bg: string;
}

export interface MasterDataAllResponse {
  bookingStatuses: MasterDataItem[];
}

export const useBookingStatuses = () => {
  const [data, setData] = useState<MasterDataAllResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get<MasterDataAllResponse>("master-data/all-statuses");
      setData(response.data);
    } catch (err) {
      console.error("Failed to fetch booking statuses:", err);
      setError("Failed to load booking statuses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toStatusMetaMap = useCallback(
    (items: MasterDataItem[]): Record<string, BookingStatusMeta> => {
      const result: Record<string, BookingStatusMeta> = {};
      for (const item of items) {
        const color = item.rule || "#64748b";
        result[item.code] = {
          label: item.name,
          color,
          bg: `${color}1a`,
        };
      }
      return result;
    },
    [],
  );

  const bookingStatusMeta = data?.bookingStatuses
    ? toStatusMetaMap(data.bookingStatuses)
    : {};

  const getBookingStatusMeta = useCallback(
    (code: string): BookingStatusMeta | undefined => {
      return bookingStatusMeta[code];
    },
    [bookingStatusMeta],
  );

  return {
    data,
    loading,
    error,
    bookingStatuses: data?.bookingStatuses ?? [],
    bookingStatusMeta,
    getBookingStatusMeta,
    refetch: fetchData,
  };
};
