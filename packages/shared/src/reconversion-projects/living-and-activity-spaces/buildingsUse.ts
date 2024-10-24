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
  "OTHER",
]);

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
