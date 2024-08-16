import { SoilType } from "shared";
import { RepositorySoilCategoryType } from "./carbonStorage";

export const mapSoilTypeToRepositorySoilCategory = (
  soilType: SoilType,
): RepositorySoilCategoryType => {
  if (soilType === "BUILDINGS" || soilType === "MINERAL_SOIL") {
    return "impermeable_soils";
  }
  return soilType.toLowerCase() as RepositorySoilCategoryType;
};
