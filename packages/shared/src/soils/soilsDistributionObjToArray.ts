import { typedObjectEntries } from "../object-entries";
import type { ReconversionProjectSoilsDistribution } from "../reconversion-projects";
import type { SoilsDistribution } from "./soilDistribution";

export const soilsDistributionObjToArray = (
  soilsDistribution: SoilsDistribution,
): ReconversionProjectSoilsDistribution => {
  return typedObjectEntries(soilsDistribution).map(([soilType, surfaceArea]) => ({
    soilType,
    surfaceArea: surfaceArea ?? 0,
  }));
};
