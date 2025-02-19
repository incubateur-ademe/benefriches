import z from "zod";

const buildingsUseSchema = z.enum([
  "RESIDENTIAL",
  "GROUND_FLOOR_RETAIL",
  "NEIGHBOURHOOD_FACILITIES_AND_SERVICES",
  "SHIPPING_OR_INDUSTRIAL_BUILDINGS",
  "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
  "PUBLIC_FACILITIES",
  "TERTIARY_ACTIVITIES",
  "SOCIO_CULTURAL_PLACE",
  "SPORTS_FACILITIES",
  "MULTI_STORY_PARKING",
  "OTHER",
]);

export const BUILDINGS_USE_LIST = buildingsUseSchema.options;

export type BuildingsUse = z.infer<typeof buildingsUseSchema>;

export const buildingsFloorAreaUsageDistribution = z.record(
  buildingsUseSchema,
  z.number().nonnegative(),
);
export type BuildingFloorAreaUsageDistribution = z.infer<
  typeof buildingsFloorAreaUsageDistribution
>;

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
