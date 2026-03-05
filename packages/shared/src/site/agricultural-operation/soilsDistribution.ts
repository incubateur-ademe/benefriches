import { SoilsDistribution } from "../../soils";
import { AgriculturalOperationActivity } from "./operationActivity";

export function getSoilsDistributionForAgriculturalOperationActivity(
  surfaceArea: number,
  agriculturalOperationActivity: AgriculturalOperationActivity,
): SoilsDistribution {
  switch (agriculturalOperationActivity) {
    case "CEREALS_AND_OILSEEDS_CULTIVATION":
    case "LARGE_VEGETABLE_CULTIVATION":
    case "MARKET_GARDENING":
      return {
        CULTIVATION: 0.95 * surfaceArea,
        BUILDINGS: 0.05 * surfaceArea,
      };
    case "FLOWERS_AND_HORTICULTURE":
      return {
        BUILDINGS: 0.5 * surfaceArea,
        CULTIVATION: 0.5 * surfaceArea,
      };
    case "VITICULTURE":
      return {
        VINEYARD: 0.95 * surfaceArea,
        BUILDINGS: 0.05 * surfaceArea,
      };
    case "FRUITS_AND_OTHER_PERMANENT_CROPS":
      return {
        ORCHARD: 0.95 * surfaceArea,
        BUILDINGS: 0.05 * surfaceArea,
      };
    case "CATTLE_FARMING":
    case "SHEEP_AND_GOAT_FARMING":
      return {
        PRAIRIE_GRASS: 0.95 * surfaceArea,
        BUILDINGS: 0.05 * surfaceArea,
      };
    case "PIG_FARMING":
      return {
        CULTIVATION: 0.5 * surfaceArea,
        PRAIRIE_GRASS: 0.4 * surfaceArea,
        BUILDINGS: 0.1 * surfaceArea,
      };
    case "POULTRY_FARMING":
      return {
        CULTIVATION: 0.5 * surfaceArea,
        PRAIRIE_GRASS: 0.49 * surfaceArea,
        BUILDINGS: 0.01 * surfaceArea,
      };
    case "POLYCULTURE_AND_LIVESTOCK":
      return {
        CULTIVATION: 0.475 * surfaceArea,
        PRAIRIE_GRASS: 0.475 * surfaceArea,
        BUILDINGS: 0.05 * surfaceArea,
      };
  }
}
