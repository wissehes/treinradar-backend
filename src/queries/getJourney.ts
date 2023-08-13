import NS from "~/shared/NS";
import type { getJourneyDetailsResponse } from "~/types/NS/getJourneyDetailsResponse";

/**
 * Get a journey by ID
 * @param id Journey ID
 */
export default async function getJourney(id: string | number) {
  const { data } = await NS.get<getJourneyDetailsResponse>(
    "/reisinformatie-api/api/v2/journey",
    {
      params: { train: id },
    }
  );
  return data.payload;
}
