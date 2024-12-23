import { SoilType } from ".";
import { typedObjectEntries } from "../object-entries";
import { SoilsDistribution } from "./soilDistribution";

export const soilsDistributionObjToArray = (
  soilsDistribution: SoilsDistribution,
): { type: SoilType; surfaceArea: number }[] => {
  return typedObjectEntries(soilsDistribution).map(([type, surfaceArea]) => ({
    type,
    surfaceArea: surfaceArea ?? 0,
  }));
};
