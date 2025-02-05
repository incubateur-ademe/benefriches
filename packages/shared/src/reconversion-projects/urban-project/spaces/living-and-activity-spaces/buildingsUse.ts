import z from "zod";

const buildingsUseSchema = z.enum([
  "RESIDENTIAL",
  "GROUND_FLOOR_RETAIL",
  "TERTIARY_ACTIVITIES",
  "NEIGHBOURHOOD_FACILITIES_AND_SERVICES",
  "PUBLIC_FACILITIES",
  "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS",
  "SHIPPING_OR_INDUSTRIAL_BUILDINGS",
  "MULTI_STORY_PARKING",
  "SOCIO_CULTURAL_PLACE",
  "SPORTS_FACILITIES",
  "OTHER",
]);

export const isBuildingUse = (value: unknown): value is BuildingsUse => {
  return buildingsUseSchema.safeParse(value).success;
};

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

export const isBuildingsEconomicActivityUse = (
  value: unknown,
): value is BuildingsEconomicActivityUse => {
  return ECONOMIC_ACTIVITY_BUILDINGS_USE.includes(value as BuildingsEconomicActivityUse);
};
