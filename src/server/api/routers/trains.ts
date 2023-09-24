import { TRPCError } from "@trpc/server";
import { z } from "zod";
import getTrains from "~/queries/getTrains";
import { getTrainInfo } from "~/queries/getTrainsInfo";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type LiveTrain, liveTrainSchema } from "~/types/LiveTrain";

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
        track: info?.spoor,

        image: `https://trein.wissehes.nl/api/image/${info?.materieeldelen[0]?.type}`,
      };

      return data;
    }),
});
