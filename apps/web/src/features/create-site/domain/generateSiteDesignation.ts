import { SiteDraft } from "./siteFoncier.types";

import { SoilType } from "@/shared/domain/soils";

const isSoilTypePrairie = (soilType: SoilType) => {
  return soilType.startsWith("PRAIRIE");
};

const isSoilTypeForest = (soilType: SoilType) => {
  return soilType.startsWith("FOREST");
};

const isSoilTypeAgricultural = (soilType: SoilType) => {
  return [SoilType.VINEYARD, SoilType.ORCHARD, SoilType.CULTIVATION].includes(soilType);
};

const isSoilTypeArtificial = (soilType: SoilType) => {
  return [
    SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
    SoilType.ARTIFICIAL_TREE_FILLED,
    SoilType.MINERAL_SOIL,
    SoilType.BUILDINGS,
  ].includes(soilType);
};

const isSoilTypeNatural = (soilType: SoilType) => {
  return (
    isSoilTypePrairie(soilType) ||
    isSoilTypeForest(soilType) ||
    soilType === SoilType.WATER ||
    soilType === SoilType.WET_LAND
  );
};

export const generateSiteDesignation = (siteData: SiteDraft) => {
  if (siteData.isFriche) return "friche";

  const { soils = [] } = siteData;

  const nonArtificialSoils = soils.filter((soilType) => !isSoilTypeArtificial(soilType));
  if (nonArtificialSoils.length === 0) return "espace";
  if (nonArtificialSoils.every(isSoilTypePrairie)) return "prairie";
  if (nonArtificialSoils.every(isSoilTypeForest)) return "forêt";
  if (nonArtificialSoils.every(isSoilTypeAgricultural)) return "espace agricole";
  if (nonArtificialSoils.every(isSoilTypeNatural)) return "espace naturel";
  return "espace naturel et agricole";
};
