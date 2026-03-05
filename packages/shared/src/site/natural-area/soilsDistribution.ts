import { SoilsDistribution } from "../../soils";
import { NaturalAreaType } from "./naturalAreaType";

export function getSoilsDistributionForNaturalAreaType(
  surfaceArea: number,
  naturalAreaType: NaturalAreaType,
): SoilsDistribution {
  switch (naturalAreaType) {
    case "PRAIRIE":
      return {
        PRAIRIE_BUSHES: surfaceArea,
      };
    case "FOREST":
      return {
        FOREST_MIXED: surfaceArea,
      };
    case "WET_LAND":
      return {
        WET_LAND: surfaceArea,
      };
    case "MIXED_NATURAL_AREA":
      return {
        PRAIRIE_BUSHES: 0.3 * surfaceArea,
        FOREST_MIXED: 0.3 * surfaceArea,
        WATER: 0.1 * surfaceArea,
        MINERAL_SOIL: 0.3 * surfaceArea,
      };
  }
}
