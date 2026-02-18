import { z } from "zod";

import type { SurfaceAreaDistributionJson } from "../../../surface-area";

/**
 * Urban project uses schema combining building uses with non-building uses.
 *
 * Building uses: Require both footprint ("emprise foncière") and floor surface area ("surface de plancher")
 * Non-building uses: Only require footprint surface area
 */
export const urbanProjectUseSchema = z.enum([
  "RESIDENTIAL",
  "LOCAL_STORE",
  "LOCAL_SERVICES",
  "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
  "PUBLIC_FACILITIES",
  "OFFICES",
  "OTHER_CULTURAL_PLACE",
  "SPORTS_FACILITIES",
  "MULTI_STORY_PARKING",
  "OTHER_BUILDING",
  // Educational facilities
  "KINDERGARTEN_OR_PRIMARY_SCHOOL",
  "SECONDARY_SCHOOL",
  "OTHER_EDUCATIONAL_FACILITY",
  // Health facilities
  "LOCAL_HEALTH_SERVICE",
  "HOSPITAL",
  "MEDICAL_SOCIAL_FACILITY",
  // Leisure and culture facilities
  "CINEMA",
  "MUSEUM",
  "THEATER",
  "RECREATIONAL_FACILITY",
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

export const urbanProjectBuildingsUseSchema = urbanProjectUseSchema.exclude([
  "PUBLIC_GREEN_SPACES",
  "OTHER_PUBLIC_SPACES",
]);
const USES_WITH_BUILDINGS = urbanProjectBuildingsUseSchema.options;

export type UrbanProjectUseWithBuilding = z.infer<typeof urbanProjectBuildingsUseSchema>;

/**
 * Check if a use includes buildings (requires floor surface area).
 * Note: Uses with buildings can also include other spaces like alleys, paths, gardens, etc.
 */
export const doesUseIncludeBuildings = (
  use: UrbanProjectUse,
): use is UrbanProjectUseWithBuilding => {
  return (USES_WITH_BUILDINGS as readonly string[]).includes(use);
};

/**
 * Distribution of surface areas per use (footprint or floor area).
 */
export type UrbanProjectUseDistribution = SurfaceAreaDistributionJson<UrbanProjectUse>;

export const urbanProjectUseDistributionSchema = z.partialRecord(
  urbanProjectUseSchema,
  z.number().nonnegative(),
);

export type BuildingsUseDistribution = SurfaceAreaDistributionJson<UrbanProjectUseWithBuilding>;

export const buildingsUseDistributionSchema = z.partialRecord(
  urbanProjectBuildingsUseSchema,
  z.number().nonnegative(),
);
export const BUILDINGS_ECONOMIC_ACTIVITY_USE = [
  "LOCAL_STORE",
  "OFFICES",
  "LOCAL_SERVICES",
  "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
] as const satisfies UrbanProjectUseWithBuilding[];
