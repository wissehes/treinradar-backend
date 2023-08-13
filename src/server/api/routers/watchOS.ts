/**
 * Router for watchOS only routes
 * These routes have a simplified output; only necessary stuff is returned.
 */

import { z } from "zod";
import getDistanceFromGPS from "~/helpers/getDistanceFromGPS";
import getJourney from "~/queries/getJourney";
import getTrains from "~/queries/getTrains";
import { getTrainInfo } from "~/queries/getTrainsInfo";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { JourneyDetails } from "~/types/NS/getJourneyDetailsResponse";
import { nearbyTrainSchema } from "~/types/NearbyTrain";
import type { TrainWithInfo } from "~/types/TrainWithInfo";

type TrainWithDistance = TrainWithInfo & { distance: number };
type TrainWithJourney = TrainWithDistance & { journey?: JourneyDetails };

/**
 * Get the info needed for the nearby trains response.
 * Requests the `info` and the journey for all trains provided.
 * @param trains Your list of trains
 * @returns A list of `TrainWithJourney`
 */
const getTrainsInfoAndJourney = async (
  trains: TrainWithDistance[]
): Promise<TrainWithJourney[]> => {
  if (!trains[0]) return [];

  const treinenMetInfo: TrainWithJourney[] = [];
  const trainsInfo = await getTrainInfo(trains);

  for (const train of trains) {
    const foundInfo = trainsInfo.find((a) => a.ritnummer == train.treinNummer);
    const journey = await getJourney(train.ritId);

    treinenMetInfo.push({
      ...train,
      info: foundInfo,
      journey: journey,
    });
  }

  return treinenMetInfo;
};

export const watchOSRouter = createTRPCRouter({
  nearbyTrains: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/watchOS/nearby",
        description:
          "Returns a list of nearby trains based on the provided location.",
        tags: ["watchOS", "trains"],
      },
    })
    .input(z.object({ latitude: z.number(), longitude: z.number() }))
    .output(z.array(nearbyTrainSchema))
    .query(async ({ input }) => {
      const allTrains = await getTrains();

      // Grab the 5 nearest trains.
      const nearbyTrains: TrainWithDistance[] = allTrains
        .map((t) => {
          const distance = getDistanceFromGPS({
            location1: { lat: input.latitude, lon: input.longitude },
            location2: { lat: t.lat, lon: t.lng },
          });
          return { ...t, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      const withInfo = await getTrainsInfoAndJourney(nearbyTrains);

      return withInfo.map((train) => ({
        journeyId: train.ritId,

        distance: train.distance,
        speed: train.snelheid,
        direction: train.richting,

        image: train.info?.materieeldelen.map((m) => m.afbeelding) ?? [],

        journey: {
          destination: train.journey?.stops[0]?.destination,
          origin: train.journey?.stops[0]?.stop.name,
          category:
            train.journey?.stops[0]?.departures[0]?.product.shortCategoryName,
          operator:
            train.journey?.stops[0]?.departures[0]?.product.operatorName,
          notes: train.journey?.notes.map((a) => a.text) ?? [],
        },
      }));
    }),
});
