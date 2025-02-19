import z from "zod";

const buildingsUseSchema = z.enum([
  "RESIDENTIAL",
  "LOCAL_STORE",
  "LOCAL_SERVICES",
  "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
  "PUBLIC_FACILITIES",
  "OFFICES",
  "CULTURAL_PLACE",
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
  "LOCAL_STORE",
  "OFFICES",
  "LOCAL_SERVICES",
  "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
];

export type BuildingsEconomicActivityUse = Extract<
  BuildingsUse,
  "LOCAL_STORE" | "OFFICES" | "LOCAL_SERVICES" | "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES"
>;
