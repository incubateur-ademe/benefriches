import { ReconversionProjectSoilsDistribution } from "../reconversion-projects";
import { SoilsDistribution as SoilDistributionByType } from "./soilDistribution";

export const getProjectSoilDistributionByType = (
  projectSoilsDistribution: ReconversionProjectSoilsDistribution,
) => {
  return projectSoilsDistribution.reduce<SoilDistributionByType>(
    (result, { soilType, surfaceArea = 0 }) =>
      surfaceArea
        ? {
            ...result,
            [soilType]: (result[soilType] ?? 0) + surfaceArea,
          }
        : result,
    {},
  );
};
