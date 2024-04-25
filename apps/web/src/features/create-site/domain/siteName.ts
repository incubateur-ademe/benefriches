import { isForest, isPrairie, isSoilAgricultural, SoilType } from "shared";
import { getFricheActivityLabel } from "./friche.types";
import { SiteDraft } from "./siteFoncier.types";

const isSoilTypeArtificial = (soilType: SoilType) => {
  return [
    "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    "ARTIFICIAL_TREE_FILLED",
    "MINERAL_SOIL",
    "BUILDINGS",
  ].includes(soilType);
};

const isSoilTypeNatural = (soilType: SoilType) => {
  return (
    isPrairie(soilType) || isForest(soilType) || soilType === "WATER" || soilType === "WET_LAND"
  );
};

export const generateSiteDesignation = (siteData: SiteDraft) => {
  if (siteData.isFriche)
    return siteData.fricheActivity ? getFricheActivityLabel(siteData.fricheActivity) : "friche";

  const { soils = [] } = siteData;

  const nonArtificialSoils = soils.filter((soilType) => !isSoilTypeArtificial(soilType));
  if (nonArtificialSoils.length === 0) return "espace";
  if (nonArtificialSoils.every(isPrairie)) return "prairie";
  if (nonArtificialSoils.every(isForest)) return "forêt";
  if (nonArtificialSoils.every(isSoilAgricultural)) return "espace agricole";
  if (nonArtificialSoils.every(isSoilTypeNatural)) return "espace naturel";
  return "espace naturel et agricole";
};

export const generateSiteName = (siteData: SiteDraft): string => {
  const designation = generateSiteDesignation(siteData);

  const { city } = siteData.address;

  const name = `${designation} de ${city}`;

  return name.charAt(0).toUpperCase() + name.slice(1);
};
