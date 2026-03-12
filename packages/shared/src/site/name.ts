import { formatCityWithPlacePreposition } from "../local-authority";
import { capitalize } from "../services";
import { FricheActivity, getFricheActivityLabel } from "./friche/fricheActivity";
import { getLabelForNaturalAreaType, NaturalAreaType } from "./natural-area";
import { SiteNature } from "./site";
import { getLabelForUrbanZoneType, UrbanZoneType } from "./urban-zone";

type SiteData = {
  fricheActivity?: FricheActivity;
  naturalAreaType?: NaturalAreaType;
  urbanZone?: UrbanZoneType;
  nature: SiteNature;
  cityName: string;
};

const generateSiteDesignation = (siteData: SiteData) => {
  switch (siteData.nature) {
    case "AGRICULTURAL_OPERATION":
      return "exploitation agricole";
    case "NATURAL_AREA":
      return siteData.naturalAreaType
        ? getLabelForNaturalAreaType(siteData.naturalAreaType)
        : "espace naturel";
    case "FRICHE":
      return siteData.fricheActivity ? getFricheActivityLabel(siteData.fricheActivity) : "friche";
    case "URBAN_ZONE":
      return siteData.urbanZone ? getLabelForUrbanZoneType(siteData.urbanZone) : "zone urbaine";
    default:
      return "site";
  }
};

export const generateSiteName = (siteData: SiteData): string => {
  const designation = generateSiteDesignation(siteData);

  const name = `${designation} ${formatCityWithPlacePreposition(siteData.cityName)}`;

  return capitalize(name);
};
