/**
 * Nearby train type
 */

import { z } from "zod";

export const nearbyTrainSchema = z.object({
  journeyId: z.string(),

  distance: z.number(),
  speed: z.number(),
  direction: z.number(),

  image: z.array(z.string()),

  journey: z.object({
    destination: z.string().optional(),
    origin: z.string().optional(),
    category: z.string().optional(),
    operator: z.string().optional(),
    notes: z.array(z.string()),
  }),
});

export type NearbyTrain = z.infer<typeof nearbyTrainSchema>;
