import z from "zod";

import { buildingsUseSchema } from "../urbanProject";

export const isBuildingUse = (value: unknown): value is BuildingsUse => {
  return buildingsUseSchema.safeParse(value).success;
};

export type BuildingsUse = z.infer<typeof buildingsUseSchema>;

export const buildingsUseSurfaceAreaDistributionSchema = z.record(
  buildingsUseSchema,
  z.number().nonnegative(),
);
export type BuildingsUseSurfaceAreaDistribution = z.infer<
  typeof buildingsUseSurfaceAreaDistributionSchema
>;

export const ECONOMIC_ACTIVITY_BUILDINGS_USE: BuildingsEconomicActivityUse[] = [
  "GROUND_FLOOR_RETAIL",
  "TERTIARY_ACTIVITIES",
  "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
  "SHIPPING_OR_INDUSTRIAL_BUILDINGS",
];

export type BuildingsEconomicActivityUse = Extract<
  BuildingsUse,
  | "GROUND_FLOOR_RETAIL"
  | "TERTIARY_ACTIVITIES"
  | "NEIGHBOURHOOD_FACILITIES_AND_SERVICES"
  | "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS"
  | "SHIPPING_OR_INDUSTRIAL_BUILDINGS"
>;
