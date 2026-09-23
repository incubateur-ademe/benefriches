import type { ReconversionProjectSoilsDistribution } from "../reconversion-projects";
import type { SoilsDistribution as SoilDistributionByType } from "./soilDistribution";

export const getProjectSoilDistributionByType = (
  projectSoilsDistribution: ReconversionProjectSoilsDistribution,
) => {
  return projectSoilsDistribution.reduce<SoilDistributionByType>(
    (result, { soilType, surfaceArea }) =>
      surfaceArea
        ? {
            ...result,
            [soilType]: (result[soilType] ?? 0) + surfaceArea,
          }
        : result,
    {},
  );
};
