/**
 * A live train's data
 */

import { z } from "zod";

export const liveTrainSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  speed: z.number().describe("Speed in km/h"),
  direction: z.number().describe("Direction as degrees from north"),
  track: z.string().optional(),

  image: z.string().optional(),
});

export type LiveTrain = z.infer<typeof liveTrainSchema>;
