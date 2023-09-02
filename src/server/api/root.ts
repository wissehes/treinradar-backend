import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { watchOSRouter } from "./routers/watchOS";
import { trainsRouter } from "./routers/trains";
import { spoorkaartRouter } from "./routers/spoorkaart";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  watchos: watchOSRouter,
  trains: trainsRouter,
  spoorkaart: spoorkaartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
