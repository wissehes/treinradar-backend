import { z } from "zod";
import getSpoorkaart from "~/queries/getSpoorkaart";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const spoorkaartRouter = createTRPCRouter({
  geojson: publicProcedure
    .meta({ openapi: { method: "GET", path: "/spoorkaart/geojson" } })
    .input(z.void())
    .output(z.any())
    .query(async () => {
      return await getSpoorkaart();
    }),
});
