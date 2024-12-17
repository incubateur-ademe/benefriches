import { isImpermeableSoil, SoilType } from ".";
import { typedObjectEntries } from "../object-entries";
import { SurfaceAreaDistribution, SurfaceAreaDistributionJson } from "../surface-area/surfaceArea";

export type SoilsDistribution = SurfaceAreaDistributionJson<SoilType>;

export const createSoilSurfaceAreaDistribution = (
  sd: SoilsDistribution,
): SurfaceAreaDistribution<SoilType> => {
  return SurfaceAreaDistribution.fromJSON(sd);
};

export const sumSoilsSurfaceAreasWhere = (
  soilsDistribution: SoilsDistribution,
  cb: (s: SoilType) => boolean,
) => {
  return typedObjectEntries(soilsDistribution)
    .filter(([soilType]) => cb(soilType))
    .reduce((sum, [, area]) => sum + (area ?? 0), 0);
};

export const getImpermeableSurfaceArea = (soilsDistribution: SoilsDistribution): number => {
  return sumSoilsSurfaceAreasWhere(soilsDistribution, (soilType) => isImpermeableSoil(soilType));
};

export const getGreenArtificalSurfaceArea = (soilsDistribution: SoilsDistribution): number => {
  return sumSoilsSurfaceAreasWhere(
    soilsDistribution,
    (soilType) =>
      soilType === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" || soilType === "ARTIFICIAL_TREE_FILLED",
  );
};

export const stripEmptySurfaces = (soilsDistribution: SoilsDistribution): SoilsDistribution => {
  return typedObjectEntries(soilsDistribution).reduce((acc, [soilType, surfaceArea]) => {
    return surfaceArea ? { ...acc, [soilType]: surfaceArea } : acc;
  }, {});
};
