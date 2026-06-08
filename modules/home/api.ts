import { axiosClient } from "@/shared/services/axiosClient";
import type { MasterItem, MasterPayload } from "@/modules/home/types";

export async function findMasterDataByType(
  payload: MasterPayload,
): Promise<MasterItem[]> {
  const response = await axiosClient.get<MasterItem | MasterItem[]>(
    "/master-data/find-by-type",
    {
      params: payload,
    },
  );

  return Array.isArray(response.data) ? response.data : [response.data];
}
