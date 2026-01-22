import { z } from "zod";

import type { SurfaceAreaDistributionJson } from "../../../surface-area";

/**
 * Urban project uses schema combining building uses with non-building uses.
 *
 * Building uses: Require both footprint ("emprise foncière") and floor surface area ("surface de plancher")
 * Non-building uses: Only require footprint surface area
 */
export const urbanProjectUseSchema = z.enum([
  // Building uses (from existing buildingsUse)
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
  // Non-building uses
  "PUBLIC_GREEN_SPACES",
  "OTHER_PUBLIC_SPACES",
]);

export type UrbanProjectUse = z.infer<typeof urbanProjectUseSchema>;

export const URBAN_PROJECT_USE_LIST = urbanProjectUseSchema.options;

/**
 * Building uses that require floor surface area input.
 * These are uses where buildings are constructed and floor area matters.
 */
export const BUILDING_USES = [
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
] as const satisfies UrbanProjectUse[];

export type BuildingUse = (typeof BUILDING_USES)[number];

/**
 * Non-building uses that only require footprint surface area.
 */
export const NON_BUILDING_USES = [
  "PUBLIC_GREEN_SPACES",
  "OTHER_PUBLIC_SPACES",
] as const satisfies UrbanProjectUse[];

export type NonBuildingUse = (typeof NON_BUILDING_USES)[number];

/**
 * Check if a use is a building use (requires floor surface area).
 */
export const isBuildingUse = (use: UrbanProjectUse): use is BuildingUse => {
  return (BUILDING_USES as readonly string[]).includes(use);
};

/**
 * Distribution of surface areas per use (footprint or floor area).
 */
export type UrbanProjectUseDistribution = SurfaceAreaDistributionJson<UrbanProjectUse>;

export const urbanProjectUseDistributionSchema = z.partialRecord(
  urbanProjectUseSchema,
  z.number().nonnegative(),
);
