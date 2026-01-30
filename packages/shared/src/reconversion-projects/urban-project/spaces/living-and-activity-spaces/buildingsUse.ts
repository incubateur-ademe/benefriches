import z from "zod";

import { SurfaceAreaDistributionJson } from "../../../../surface-area";

export const buildingsUseSchema = z.enum([
  "RESIDENTIAL",
  "LOCAL_STORE",
  "LOCAL_SERVICES",
  "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
  "PUBLIC_FACILITIES",
  "OFFICES",
  "MULTI_STORY_PARKING",
  "OTHER_BUILDING",
  // Health facilities
  "LOCAL_HEALTH_SERVICE",
  "HOSPITAL",
  "MEDICAL_SOCIAL_FACILITY",
  // Leisure and culture facilities
  "OTHER_CULTURAL_PLACE",
  "CINEMA",
  "MUSEUM",
  "THEATER",
  "SPORTS_FACILITIES",
  "RECREATIONAL_FACILITY",
  // Educational facilities
  "KINDERGARTEN_OR_PRIMARY_SCHOOL",
  "SECONDARY_SCHOOL",
  "OTHER_EDUCATIONAL_FACILITY",
]);

export const BUILDINGS_USE_LIST = buildingsUseSchema.options;

export type BuildingsUse = z.infer<typeof buildingsUseSchema>;

export type BuildingsUseDistribution = SurfaceAreaDistributionJson<BuildingsUse>;

export const buildingsUseDistributionSchema = z.partialRecord(
  buildingsUseSchema,
  z.number().nonnegative(),
);
export const BUILDINGS_ECONOMIC_ACTIVITY_USE = [
  "LOCAL_STORE",
  "OFFICES",
  "LOCAL_SERVICES",
  "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
] as const satisfies BuildingsUse[];
