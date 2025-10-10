import {
  BuildingsUse,
  getSoilTypeForLivingAndActivitySpace,
  getSoilTypeForPublicSpace,
  getSoilTypeForUrbanGreenSpace,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
  UrbanSpaceCategory,
} from "shared";

import { getPictogramForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";

export const getLabelForSpaceCategory = (spaceCategory: UrbanSpaceCategory): string => {
  switch (spaceCategory) {
    case "LIVING_AND_ACTIVITY_SPACES":
      return "Lieux d'habitation et d'activité";
    case "PUBLIC_SPACES":
      return "Espaces publics";
    case "GREEN_SPACES":
      return "Espaces verts publics";
    case "URBAN_FARM":
      return "Ferme urbaine";
    case "RENEWABLE_ENERGY_PRODUCTION_PLANT":
      return "Centrale de production d'EnR";
  }
};

const URBAN_SPACE_CATEGORY_PICTOGRAM_URL_BASE = "/img/pictograms/urban-project-spaces";
export const getPictogramForUrbanSpaceCategory = (spaceCategory: UrbanSpaceCategory): string => {
  switch (spaceCategory) {
    case "LIVING_AND_ACTIVITY_SPACES":
      return `${URBAN_SPACE_CATEGORY_PICTOGRAM_URL_BASE}/living-and-activity-spaces.svg`;
    case "PUBLIC_SPACES":
      return `${URBAN_SPACE_CATEGORY_PICTOGRAM_URL_BASE}/public-spaces.svg`;
    case "GREEN_SPACES":
      return `${URBAN_SPACE_CATEGORY_PICTOGRAM_URL_BASE}/green-spaces.svg`;
    case "URBAN_FARM":
      return `${URBAN_SPACE_CATEGORY_PICTOGRAM_URL_BASE}/urban-farm.svg`;
    case "RENEWABLE_ENERGY_PRODUCTION_PLANT":
      return `${URBAN_SPACE_CATEGORY_PICTOGRAM_URL_BASE}/renewable-energy-production-plant.svg`;
  }
};

export const getDescriptionForUrbanSpaceCategory = (spaceCategory: UrbanSpaceCategory): string => {
  switch (spaceCategory) {
    case "LIVING_AND_ACTIVITY_SPACES":
      return "Logements, lieux d'activités économiques, équipements publics...";
    case "PUBLIC_SPACES":
      return "(hors espaces verts) Rues, places, pistes cyclables, parking de surface...";
    case "GREEN_SPACES":
      return "Parc, jardin public, forêt urbaine...";
    case "URBAN_FARM":
      return "Cultures de fruits et légumes, horticulture...";
    case "RENEWABLE_ENERGY_PRODUCTION_PLANT":
      return "Géothermique ou biomasse";
  }
};

export const getColorForUrbanSpaceCategory = (spaceCategory: UrbanSpaceCategory): string => {
  switch (spaceCategory) {
    case "LIVING_AND_ACTIVITY_SPACES":
      return "#F80338";
    case "GREEN_SPACES":
      return "#59C939";
    case "PUBLIC_SPACES":
      return "#919CB3";
    case "URBAN_FARM":
      return "#F2CF5A";
    case "RENEWABLE_ENERGY_PRODUCTION_PLANT":
      return "#F97F05";
  }
};

export const getLabelForUrbanGreenSpace = (greenSpace: UrbanGreenSpace): string => {
  switch (greenSpace) {
    case "LAWNS_AND_BUSHES":
      return "Pelouses et buissons";
    case "GRAVEL_ALLEY":
      return "Allées et espaces en revêtement perméable";
    case "PAVED_ALLEY":
      return "Allées et espaces en revêtement imperméable";
    case "TREE_FILLED_SPACE":
      return "Zone arborée";
    case "URBAN_POND_OR_LAKE":
      return "Plan d'eau";
  }
};

export const getDescriptionForUrbanGreenSpace = (
  greenSpace: UrbanGreenSpace,
): string | undefined => {
  switch (greenSpace) {
    case "PAVED_ALLEY":
      return "Pavé, bitume...";
    case "GRAVEL_ALLEY":
      return "Gravier, dalles alvéolées...";
  }
};

export const getLabelForLivingAndActivitySpace = (
  livingAndActivitySpace: UrbanLivingAndActivitySpace,
): string => {
  switch (livingAndActivitySpace) {
    case "BUILDINGS":
      return "Bâtiments";
    case "IMPERMEABLE_SURFACE":
      return "Espaces en revêtement imperméable";
    case "PERMEABLE_SURFACE":
      return "Espaces en revêtement perméable";
    case "PRIVATE_GREEN_SPACES":
      return "Espaces verts privés";
  }
};

export const getDescriptionForLivingAndActivitySpace = (
  livingAndActivitySpace: UrbanLivingAndActivitySpace,
): string => {
  switch (livingAndActivitySpace) {
    case "BUILDINGS":
      return "";
    case "IMPERMEABLE_SURFACE":
      return "Allée ou parking en bitume, pavés...";
    case "PERMEABLE_SURFACE":
      return "Allée ou parking en gravier, dalles alvéolées...";
    case "PRIVATE_GREEN_SPACES":
      return "Pelouse, haies...";
  }
};

export const getLabelForPublicSpace = (publicSpace: UrbanPublicSpace): string => {
  switch (publicSpace) {
    case "GRASS_COVERED_SURFACE":
      return "Revêtement végétal";
    case "IMPERMEABLE_SURFACE":
      return "Revêtement imperméable";
    case "PERMEABLE_SURFACE":
      return "Revêtement perméable";
  }
};

export const getDescriptionForPublicSpace = (publicSpace: UrbanPublicSpace): string | undefined => {
  switch (publicSpace) {
    case "GRASS_COVERED_SURFACE":
      return "Zones enherbées, alignement d'arbres, noue...";
    case "IMPERMEABLE_SURFACE":
      return "Bitume, pavé, ciment...";
    case "PERMEABLE_SURFACE":
      return "Gravier, dalles alvéolées, enrobé poreux, sol nu...";
    default:
      return undefined;
  }
};

export const getDescriptionForBuildingsUse = (use: BuildingsUse): string => {
  switch (use) {
    case "RESIDENTIAL":
      return "Maisons, immeubles collectifs...";
    case "LOCAL_STORE":
      return "Boulangerie, supérette...";
    case "MULTI_STORY_PARKING":
      return "Parking voiture à étage";
    case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
      return "Usine, entrepôt, atelier...";
    case "SPORTS_FACILITIES":
      return "Stade, gymnase, piscine...";
    case "LOCAL_SERVICES":
      return "Banque, poste, restaurant...";
    case "CULTURAL_PLACE":
      return "Cinéma, théâtre, musée...";
    case "OTHER":
      return "Établissement éducatif, espace de santé...";
    case "OFFICES":
    case "PUBLIC_FACILITIES":
      return "";
  }
};

const BUILDINGS_USE_PICTOGRAM_URL_BASE = "/img/pictograms/buildings-uses";
export const getPictogramUrlForBuildingsUse = (use: BuildingsUse): string => {
  switch (use) {
    case "RESIDENTIAL":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/residential.svg`;
    case "LOCAL_STORE":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/economic-activity/local-store.svg`;
    case "LOCAL_SERVICES":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/economic-activity/local-services.svg`;
    case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/economic-activity/industrial-and-artisanal-and-shipping-premises.svg`;
    case "OFFICES":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/economic-activity/offices.svg`;
    case "MULTI_STORY_PARKING":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/multi-story-parking.svg`;
    case "SPORTS_FACILITIES":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/sports-facilities.svg`;
    case "CULTURAL_PLACE":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/cultural-place.svg`;
    case "PUBLIC_FACILITIES":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/public-buildings.svg`;
    case "OTHER":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/other.svg`;
  }
};

export const getPictogramUrlForUrbanGreenSpace = (space: UrbanGreenSpace): string => {
  return getPictogramForSoilType(getSoilTypeForUrbanGreenSpace(space));
};

export const getColorForUrbanGreenSpace = (space: UrbanGreenSpace): string => {
  return getColorForSoilType(getSoilTypeForUrbanGreenSpace(space));
};

export const getPictogramUrlForUrbanLivingAndActivitySpace = (
  space: UrbanLivingAndActivitySpace,
): string => {
  return getPictogramForSoilType(getSoilTypeForLivingAndActivitySpace(space));
};

export const getColorForUrbanLivingAndActivitySpace = (
  space: UrbanLivingAndActivitySpace,
): string => {
  return getColorForSoilType(getSoilTypeForLivingAndActivitySpace(space));
};

export const getPictogramUrlForUrbanPublicSpace = (space: UrbanPublicSpace): string => {
  return getPictogramForSoilType(getSoilTypeForPublicSpace(space));
};

export const getColorForUrbanPublicSpace = (space: UrbanPublicSpace): string => {
  return getColorForSoilType(getSoilTypeForPublicSpace(space));
};
