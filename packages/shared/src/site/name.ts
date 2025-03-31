import { formatCityWithPlacePreposition } from "../local-authority";
import { isForest, isPrairie, isSoilAgricultural, SoilType } from "../soils";
import { FricheActivity, getFricheActivityLabel } from "./friche/fricheActivity";

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
type SiteData = {
  isFriche: boolean;
  fricheActivity?: FricheActivity;
  soils: SoilType[];
  cityName: string;
};

export const generateSiteDesignation = (siteData: SiteData) => {
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

export const generateSiteName = (siteData: SiteData): string => {
  const designation = generateSiteDesignation(siteData);

  const name = `${designation} ${formatCityWithPlacePreposition(siteData.cityName)}`;

  return name.charAt(0).toUpperCase() + name.slice(1);
};
