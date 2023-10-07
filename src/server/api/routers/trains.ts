import { TRPCError } from "@trpc/server";
import { z } from "zod";
import getTrains from "~/queries/getTrains";
import { getTrainInfo } from "~/queries/getTrainsInfo";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type LiveTrain, liveTrainSchema } from "~/types/LiveTrain";
import { type TrainInformation } from "~/types/NS/getTrainInfoResponse";

const createImageURL = (info?: TrainInformation): string | undefined => {
  const type = info?.materieeldelen[0]?.type;
  if (!type) return;

  return `https://trein.wissehes.nl/api/image/${encodeURIComponent(type)}`;
};

export const trainsRouter = createTRPCRouter({
  live: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/trains/live",
        description: "Get a single train's live data.",
        tags: ["trains"],
      },
    })
    .input(z.object({ id: z.string() }))
    .output(liveTrainSchema)
    .query(async ({ input }) => {
      const allTrains = await getTrains();
      const thisTrain = allTrains.find((t) => t.ritId == input.id);

      if (!thisTrain) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const infos = await getTrainInfo([thisTrain]);
      const info = infos.find((i) => i.ritnummer == thisTrain.treinNummer);

      const data: LiveTrain = {
        latitude: thisTrain.lat,
        longitude: thisTrain.lng,

        speed: thisTrain.snelheid,
        direction: thisTrain.richting,

        station: info?.station,
        track: info?.spoor,
        platformFacilities: info?.perronVoorzieningen,

        image: createImageURL(info),
      };

      return data;
    }),

  all: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/trains/live/all",
        description: "Get all live trains",
        tags: ["trains"],
      },
    })
    .input(z.void())
    .output(z.array(liveTrainSchema))
    .query(async () => {
      const allTrains = await getTrains();
      const infos = await getTrainInfo(allTrains);

      const data: LiveTrain[] = allTrains.map((train) => {
        const info = infos.find((i) => i.ritnummer == train.treinNummer);
        // info.
        return {
          latitude: train.lat,
          longitude: train.lng,

          speed: train.snelheid,
          direction: train.richting,

          station: info?.station,
          track: info?.spoor,
          platformFacilities: info?.perronVoorzieningen,

          image: createImageURL(info),
        };
      });

      return data;
    }),
});
