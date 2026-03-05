import { z } from "zod";

import { soilsDistributionSchema } from "../../soils";

export const urbanZoneLandParcelTypeSchema = z.enum([
  "COMMERCIAL_ACTIVITY_AREA",
  "PUBLIC_SPACES",
  "SERVICED_SURFACE",
  "RESERVED_SURFACE",
]);

export type UrbanZoneLandParcelType = z.infer<typeof urbanZoneLandParcelTypeSchema>;

export const urbanZoneLandParcelSchema = z.object({
  type: urbanZoneLandParcelTypeSchema,
  surfaceArea: z.number().nonnegative(),
  soilsDistribution: soilsDistributionSchema,
  buildingsFloorSurfaceArea: z.number().nonnegative().optional(),
});

export type UrbanZoneLandParcel = z.infer<typeof urbanZoneLandParcelSchema>;
