import { SoilsDistribution, SoilType } from "../../soils";
import { FricheActivity } from "./fricheActivity";

export function getSoilsDistributionForFricheActivity(
  surfaceArea: number,
  fricheActivity: FricheActivity,
): SoilsDistribution {
  switch (fricheActivity) {
    case "AGRICULTURE":
      return {
        PRAIRIE_GRASS: 0.5 * surfaceArea,
        CULTIVATION: 0.5 * surfaceArea,
      };
    case "INDUSTRY":
      return {
        BUILDINGS: 0.4 * surfaceArea,
        IMPERMEABLE_SOILS: 0.4 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.2 * surfaceArea,
      };
    case "MILITARY":
      return {
        BUILDINGS: 0.15 * surfaceArea,
        IMPERMEABLE_SOILS: 0.15 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.2 * surfaceArea,
        PRAIRIE_GRASS: 0.5 * surfaceArea,
      };
    case "BUILDING":
      return {
        BUILDINGS: 0.8 * surfaceArea,
        IMPERMEABLE_SOILS: 0.1 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.1 * surfaceArea,
      };
    case "RAILWAY":
      return {
        BUILDINGS: 0.05 * surfaceArea,
        IMPERMEABLE_SOILS: 0.4 * surfaceArea,
        MINERAL_SOIL: 0.5 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.05 * surfaceArea,
      };
    case "PORT":
      return {
        BUILDINGS: 0.8 * surfaceArea,
        IMPERMEABLE_SOILS: 0.2 * surfaceArea,
      };
    case "TIP_OR_RECYCLING_SITE":
      return {
        IMPERMEABLE_SOILS: 0.45 * surfaceArea,
        MINERAL_SOIL: 0.05 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.5 * surfaceArea,
      };
    case "OTHER":
      return {
        BUILDINGS: 0.3 * surfaceArea,
        IMPERMEABLE_SOILS: 0.2 * surfaceArea,
        MINERAL_SOIL: 0.15 * surfaceArea,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0.25 * surfaceArea,
        ARTIFICIAL_TREE_FILLED: 0.1 * surfaceArea,
      };
  }
}

export function getSoilsFromFricheActivity(fricheActivity: FricheActivity): SoilType[] {
  const soilsDistribution = getSoilsDistributionForFricheActivity(1, fricheActivity);
  return Object.keys(soilsDistribution) as SoilType[];
}
