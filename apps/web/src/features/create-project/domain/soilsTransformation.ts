import {
  isForest,
  isWetLand,
  SoilsDistribution,
  SoilType,
  sumSoilsSurfaceAreasWhere,
  typedObjectEntries,
} from "shared";
import { z } from "zod";

import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

const isSoilSuitableForPhotovoltaicPanels = (soilType: SoilType): boolean => {
  return [
    "MINERAL_SOIL",
    "IMPERMEABLE_SOILS",
    "PRAIRIE_GRASS",
    "PRAIRIE_BUSHES",
    "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    "CULTIVATION",
    "ORCHARD",
    "VINEYARD",
  ].includes(soilType);
};

export const getSuitableSurfaceAreaForPhotovoltaicPanels = (
  siteSoils: SoilsDistribution,
): number => {
  const suitableSurfaceArea = sumSoilsSurfaceAreasWhere(
    siteSoils,
    isSoilSuitableForPhotovoltaicPanels,
  );

  return suitableSurfaceArea;
};

export const canSiteAccomodatePhotovoltaicPanels = (
  siteSoils: SoilsDistribution,
  photovoltaicPanelsSurfaceArea: number,
) => {
  const suitableSurfaceArea = getSuitableSurfaceAreaForPhotovoltaicPanels(siteSoils);
  return photovoltaicPanelsSurfaceArea <= suitableSurfaceArea;
};

export const getNonSuitableSoilsForPhotovoltaicPanels = (
  siteSoils: SoilsDistribution,
): SoilsDistribution => {
  return typedObjectKeys(siteSoils)
    .filter((soilType) => !isSoilSuitableForPhotovoltaicPanels(soilType))
    .reduce((soilsDistribution, soilType) => {
      return { ...soilsDistribution, [soilType]: siteSoils[soilType] };
    }, {});
};

const getSoilsTransformationResultingSoilType = (soilType: SoilType): SoilType => {
  switch (soilType) {
    case "FOREST_CONIFER":
    case "FOREST_DECIDUOUS":
    case "FOREST_MIXED":
    case "FOREST_POPLAR":
    case "PRAIRIE_TREES":
      return "PRAIRIE_GRASS";
    case "BUILDINGS":
    case "WET_LAND":
    case "WATER":
      return "MINERAL_SOIL";
    case "ARTIFICIAL_TREE_FILLED":
      return "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    default:
      return soilType;
  }
};

const filterEmptySoils = (soilsDistribution: SoilsDistribution): SoilsDistribution => {
  return typedObjectEntries(soilsDistribution).reduce(
    (updatedSoilsDistribuion, [soilType, surfaceArea]) => {
      if (surfaceArea === 0) {
        return updatedSoilsDistribuion;
      }
      return { [soilType]: surfaceArea, ...updatedSoilsDistribuion };
    },
    {},
  );
};

export const transformNonSuitableSoils = (
  currentSoilsDistribution: SoilsDistribution,
  nonSuitableSoilsToTransform: SoilsDistribution,
): SoilsDistribution => {
  currentSoilsDistribution;
  nonSuitableSoilsToTransform;
  if (!Object.keys(nonSuitableSoilsToTransform).length) return currentSoilsDistribution;

  const newSoilsDistribution = { ...currentSoilsDistribution };

  typedObjectEntries(nonSuitableSoilsToTransform).forEach(
    ([soilTypeToTransform, surfaceAreaToTransform]) => {
      const resultingSoilType = getSoilsTransformationResultingSoilType(soilTypeToTransform);

      newSoilsDistribution[soilTypeToTransform]! -= surfaceAreaToTransform as number;
      newSoilsDistribution[resultingSoilType] =
        (newSoilsDistribution[resultingSoilType] ?? 0) + (surfaceAreaToTransform as number);
    },
  );

  return filterEmptySoils(newSoilsDistribution);
};

// order is important here, priority is given to soils that are less favorable to biodiversity and carbon storage
const ELIGIBLE_SOILS_FOR_MINERAL_AND_IMPERMEABLE_TRANSFORMATION: SoilType[] = [
  "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  "ARTIFICIAL_TREE_FILLED",
  "PRAIRIE_TREES",
  "PRAIRIE_BUSHES",
  "PRAIRIE_GRASS",
  "FOREST_CONIFER",
  "FOREST_DECIDUOUS",
  "FOREST_MIXED",
  "FOREST_POPLAR",
];

export const allocateRecommendedSoilSurfaceArea =
  (soilTypeToAllocate: SoilType) =>
  (soilsDistribution: SoilsDistribution, recommendedSoilSurfaceAreaNeeded: number) => {
    const currentSoilSurfaceArea = soilsDistribution[soilTypeToAllocate] ?? 0;

    if (currentSoilSurfaceArea >= recommendedSoilSurfaceAreaNeeded) {
      return soilsDistribution;
    }

    const newSoilsDistribution = { ...soilsDistribution };

    ELIGIBLE_SOILS_FOR_MINERAL_AND_IMPERMEABLE_TRANSFORMATION.filter((soilType) => {
      return soilType in soilsDistribution;
    }).forEach((soilType) => {
      const newSoilsDistributionMineralSoilSurfaceArea =
        newSoilsDistribution[soilTypeToAllocate] ?? 0;
      const missingMineralSoilSurfaceArea =
        recommendedSoilSurfaceAreaNeeded - newSoilsDistributionMineralSoilSurfaceArea;

      if (newSoilsDistributionMineralSoilSurfaceArea >= recommendedSoilSurfaceAreaNeeded) return;

      const availableSurfaceArea = soilsDistribution[soilType];
      const surfaceAreaToTransform = Math.min(
        missingMineralSoilSurfaceArea,
        availableSurfaceArea as number,
      );
      newSoilsDistribution[soilType]! -= surfaceAreaToTransform;
      newSoilsDistribution[soilTypeToAllocate] =
        (newSoilsDistribution[soilTypeToAllocate] ?? 0) + surfaceAreaToTransform;
    });

    return newSoilsDistribution;
  };

const allocateRecommendedMineralSoilSurfaceArea =
  allocateRecommendedSoilSurfaceArea("MINERAL_SOIL");
const allocateRecommendedImpermeablSoilSurfaceArea =
  allocateRecommendedSoilSurfaceArea("IMPERMEABLE_SOILS");

const getRenaturationTransformationResultingSoilType = (soilType: SoilType): SoilType => {
  switch (soilType) {
    case "BUILDINGS":
    case "MINERAL_SOIL":
    case "IMPERMEABLE_SOILS":
      return "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    default:
      return soilType;
  }
};

type RecommendedSurfaceAreas = {
  recommendedMineralSurfaceArea: number;
  recommendedImpermeableSurfaceArea: number;
};
export const transformSoilsForRenaturation = (
  baseSoilsDistribution: SoilsDistribution,
  { recommendedMineralSurfaceArea, recommendedImpermeableSurfaceArea }: RecommendedSurfaceAreas,
) => {
  if (!Object.keys(baseSoilsDistribution).length) return baseSoilsDistribution;

  const renaturedSoilsDistribution = { ...baseSoilsDistribution };

  typedObjectEntries(baseSoilsDistribution).forEach(
    ([soilTypeToTransform, surfaceAreaToTransform]) => {
      const resultingSoilType = getRenaturationTransformationResultingSoilType(soilTypeToTransform);

      renaturedSoilsDistribution[soilTypeToTransform]! -= surfaceAreaToTransform as number;
      renaturedSoilsDistribution[resultingSoilType] =
        (renaturedSoilsDistribution[resultingSoilType] ?? 0) + (surfaceAreaToTransform as number);
    },
  );

  const withRecommendedMineralSoilSurfaceArea = allocateRecommendedMineralSoilSurfaceArea(
    renaturedSoilsDistribution,
    recommendedMineralSurfaceArea,
  );
  const withRecommendedImpermeableSoilSurfaceArea = allocateRecommendedImpermeablSoilSurfaceArea(
    withRecommendedMineralSoilSurfaceArea,
    recommendedImpermeableSurfaceArea,
  );

  return filterEmptySoils(withRecommendedImpermeableSoilSurfaceArea);
};

export const preserveCurrentSoils = (
  baseSoilsDistribution: SoilsDistribution,
  { recommendedMineralSurfaceArea, recommendedImpermeableSurfaceArea }: RecommendedSurfaceAreas,
) => {
  if (!Object.keys(baseSoilsDistribution).length) return baseSoilsDistribution;

  const withRecommendedMineralSoilSurfaceArea = allocateRecommendedMineralSoilSurfaceArea(
    baseSoilsDistribution,
    recommendedMineralSurfaceArea,
  );
  const withRecommendedImpermeableSoilSurfaceArea = allocateRecommendedImpermeablSoilSurfaceArea(
    withRecommendedMineralSoilSurfaceArea,
    recommendedImpermeableSurfaceArea,
  );

  return filterEmptySoils(withRecommendedImpermeableSoilSurfaceArea);
};

export const soilsTransformationProjectSchema = z.enum([
  "renaturation",
  "preserveCurrentSoils",
  "custom",
]);

export type SoilsTransformationProject = z.infer<typeof soilsTransformationProjectSchema>;

const TRANSFORMABLE_SOILS: SoilType[] = [
  "BUILDINGS",
  "IMPERMEABLE_SOILS",
  "MINERAL_SOIL",
  "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  "ARTIFICIAL_TREE_FILLED",
] as const;
export const getSuitableSoilsForTransformation = (currentSoils: SoilType[]): SoilType[] => {
  return TRANSFORMABLE_SOILS.concat(
    currentSoils.filter((soilType) => !TRANSFORMABLE_SOILS.includes(soilType)),
  );
};

export const isBiodiversityAndClimateSensibleSoil = (soilType: SoilType): boolean => {
  return isForest(soilType) || isWetLand(soilType);
};
const MINIMUM_NOTICEABLE_BIODIVERSITY_AND_CLIMATE_FAVORABLE_SURFACE_AREA = 1000;
export const hasSiteSignificantBiodiversityAndClimateSensibleSoils = (
  siteSoils: SoilsDistribution,
): boolean => {
  const biodiversityAndClimateSensibleSurfaceArea = sumSoilsSurfaceAreasWhere(
    siteSoils,
    isBiodiversityAndClimateSensibleSoil,
  );
  return (
    biodiversityAndClimateSensibleSurfaceArea >=
    MINIMUM_NOTICEABLE_BIODIVERSITY_AND_CLIMATE_FAVORABLE_SURFACE_AREA
  );
};

const hasBiodiversityAndClimateSensibleSoil = (siteSoils: SoilsDistribution): boolean => {
  return typedObjectKeys(siteSoils).some(isBiodiversityAndClimateSensibleSoil);
};

export const getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed = (
  currentSoils: SoilsDistribution,
  futureSoils: SoilsDistribution,
): number => {
  const currentBiodiversityAndClimateSensibleSurfaceArea = sumSoilsSurfaceAreasWhere(
    currentSoils,
    isBiodiversityAndClimateSensibleSoil,
  );
  const futureBiodiversityAndClimateSensibleSurfaceArea = sumSoilsSurfaceAreasWhere(
    futureSoils,
    isBiodiversityAndClimateSensibleSoil,
  );
  const destroyedSurfaceArea =
    currentBiodiversityAndClimateSensibleSurfaceArea -
    futureBiodiversityAndClimateSensibleSurfaceArea;
  return destroyedSurfaceArea > 0 ? destroyedSurfaceArea : 0;
};

export const willTransformationNoticeablyImpactBiodiversityAndClimate = (
  currentSoils: SoilsDistribution,
  futureSoils: SoilsDistribution,
): boolean => {
  if (!hasBiodiversityAndClimateSensibleSoil(currentSoils)) return false;

  const destroyedSurfaceArea = getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed(
    currentSoils,
    futureSoils,
  );
  const currentBiodiversityAndClimateSensibleSurfaceArea = sumSoilsSurfaceAreasWhere(
    currentSoils,
    isBiodiversityAndClimateSensibleSoil,
  );
  return destroyedSurfaceArea >= currentBiodiversityAndClimateSensibleSurfaceArea * 0.1;
};
