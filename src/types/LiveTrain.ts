/**
 * A live train's data
 */

import { z } from "zod";

const platformFacilitySchema = z.object({
  paddingLeft: z.number(),
  width: z.number(),
  type: z.enum(["LIFT", "PERRONLETTER", "ROLTRAP", "TRAP", "unknown"]),
  description: z.string(),
});

export const liveTrainSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  speed: z.number().describe("Speed in km/h"),
  direction: z.number().describe("Direction as degrees from north"),

  type: z.enum(["SPR", "IC", "ARR"]),
  journeyId: z.string(),

  station: z.string().optional(),
  track: z.string().optional(),
  platformFacilities: z.array(platformFacilitySchema).optional(),
  images: z
    .array(z.object({ url: z.string(), width: z.number(), height: z.number() }))
    .optional(),

  image: z.string().optional(),
});

export type LiveTrain = z.infer<typeof liveTrainSchema>;
