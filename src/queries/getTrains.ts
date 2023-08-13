import NS from "~/shared/NS";
import type { Train, getTrainsResponse } from "~/types/NS/getTrainsResponse";

/**
 * Get all live trains from NS.
 */
export default async function getTrains(): Promise<Train[]> {
  const { data } = await NS.get<getTrainsResponse>(
    "/virtual-train-api/api/vehicle",
    {
      params: { features: "materieel" },
    }
  );

  return data.payload.treinen;
}
