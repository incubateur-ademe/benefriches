import { z } from "zod";

export const urbanZoneTypeSchema = z.enum([
  "ECONOMIC_ACTIVITY_ZONE",
  "RESIDENTIAL_ZONE",
  "PUBLIC_FACILITY",
  "MIXED_URBAN_ZONE",
]);

export type UrbanZoneType = z.infer<typeof urbanZoneTypeSchema>;
