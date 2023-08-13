import NS from "~/shared/NS";
import type { getMultipleTrainsInfoResponse } from "~/types/NS/getTrainInfoResponse";
import type { Train } from "~/types/NS/getTrainsResponse";

/**
 * Get the `info` property for a list of trains
 * @param trains The list if trains
 * @returns A list of trains' info property.
 */
export async function getTrainInfo(trains: Train[]) {
  const { data } = await NS.get<getMultipleTrainsInfoResponse>(
    "/virtual-train-api/api/v1/trein",
    {
      params: {
        features: "zitplaats",
        ids: trains.map((t) => t.ritId).join(","),
        all: false,
      },
    }
  );

  return data;
}
