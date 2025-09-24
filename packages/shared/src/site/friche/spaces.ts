import { SoilsDistribution, SoilType } from "../../soils";
import { SurfaceAreaDistribution } from "../../surface-area";
import { FricheActivity } from "./fricheActivity";

const FRICHE_ACTIVITY_SOILS_DISTRIBUTION_CONFIGS: Record<FricheActivity, SoilsDistribution> = {
  AGRICULTURE: {
    PRAIRIE_GRASS: 0.5,
    CULTIVATION: 0.5,
  },
  INDUSTRY: {
    BUILDINGS: 0.4,
    IMPERMEABLE_SOILS: 0.4,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.2,
  },
  MILITARY: {
    BUILDINGS: 0.15,
    IMPERMEABLE_SOILS: 0.15,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.2,
    PRAIRIE_GRASS: 0.5,
  },
  BUILDING: {
    BUILDINGS: 0.8,
    IMPERMEABLE_SOILS: 0.1,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.1,
  },
  RAILWAY: {
    BUILDINGS: 0.05,
    IMPERMEABLE_SOILS: 0.4,
    MINERAL_SOIL: 0.5,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.05,
  },
  PORT: {
    BUILDINGS: 0.8,
    IMPERMEABLE_SOILS: 0.2,
  },
  TIP_OR_RECYCLING_SITE: {
    IMPERMEABLE_SOILS: 0.45,
    MINERAL_SOIL: 0.05,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.5,
  },
  OTHER: {
    BUILDINGS: 0.3,
    IMPERMEABLE_SOILS: 0.2,
    MINERAL_SOIL: 0.15,
    ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.25,
    ARTIFICIAL_TREE_FILLED: 0.1,
  },
};

export function getSoilsDistributionForFricheActivity(
  surfaceArea: number,
  fricheActivity: FricheActivity,
  options?: { builtSurfaceArea: number },
): SoilsDistribution {
  const config = FRICHE_ACTIVITY_SOILS_DISTRIBUTION_CONFIGS[fricheActivity];
  const hasPredefinedBuiltSurfaceArea = options?.builtSurfaceArea !== undefined;
  // set buildings surface area to total surface area if it exceeds it
  const buildingsSurfaceArea = hasPredefinedBuiltSurfaceArea
    ? Math.min(surfaceArea, options.builtSurfaceArea)
    : undefined;

  // compute adjustment factor for non-building surfaces
  let adjustmentFactor = 1;
  if (hasPredefinedBuiltSurfaceArea) {
    const originalBuildingsArea = (config.BUILDINGS ?? 0) * surfaceArea;
    const originalNonBuildingsArea = surfaceArea - originalBuildingsArea;
    const remainingArea = surfaceArea - (buildingsSurfaceArea ?? 0);
    adjustmentFactor = originalNonBuildingsArea > 0 ? remainingArea / originalNonBuildingsArea : 0;
  }

  const distribution = new SurfaceAreaDistribution();

  // Buildings
  if (config.BUILDINGS) {
    const finalBuildingsArea = buildingsSurfaceArea ?? config.BUILDINGS * surfaceArea;
    if (finalBuildingsArea > 0) {
      distribution.addSurface("BUILDINGS", finalBuildingsArea);
    }
  } else if (buildingsSurfaceArea && buildingsSurfaceArea > 0) {
    distribution.addSurface("BUILDINGS", buildingsSurfaceArea);
  }

  // Other surfaces with adjustment factor
  for (const [soilType, ratio] of Object.entries(config)) {
    if (soilType !== "BUILDINGS" && ratio > 0) {
      const area = ratio * adjustmentFactor * surfaceArea;
      if (area > 0) {
        distribution.addSurface(soilType as SoilType, area);
      }
    }
  }

  return distribution.toJSON();
}
