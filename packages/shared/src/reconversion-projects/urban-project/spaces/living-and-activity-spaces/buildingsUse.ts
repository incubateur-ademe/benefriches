import z from "zod";

import { SurfaceAreaDistributionJson } from "../../../../surface-area";

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

export type BuildingsUseDistribution = SurfaceAreaDistributionJson<BuildingsUse>;

export const buildingsUseDistributionSchema = z.record(
  buildingsUseSchema,
  z.number().nonnegative(),
);
export const BUILDINGS_ECONOMIC_ACTIVITY_USE = [
  "LOCAL_STORE",
  "OFFICES",
  "LOCAL_SERVICES",
  "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
] as const satisfies BuildingsUse[];
