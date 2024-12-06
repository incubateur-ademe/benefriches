import {
  BuildingFloorAreaUsageDistribution,
  BuildingsEconomicActivityUse,
  BuildingsUse,
  ECONOMIC_ACTIVITY_BUILDINGS_USE,
  getSoilTypeForLivingAndActivitySpace,
  getSoilTypeForPublicSpace,
  getSoilTypeForUrbanGreenSpace,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
  UrbanSpaceCategory,
} from "shared";

import { getColorForSoilType } from "@/shared/domain/soils";
import { getPictogramForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

export const getLabelForSpaceCategory = (spaceCategory: UrbanSpaceCategory): string => {
  switch (spaceCategory) {
    case "LIVING_AND_ACTIVITY_SPACES":
      return "Lieux de vie et d'activité";
    case "PUBLIC_SPACES":
      return "Espaces publics";
    case "GREEN_SPACES":
      return "Espaces verts";
    case "URBAN_FARM":
      return "Ferme urbaine";
    case "RENEWABLE_ENERGY_PRODUCTION_PLANT":
      return "Centrale de production d'EnR";
    case "URBAN_POND_OR_LAKE":
      return "Plan d'eau";
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
    case "URBAN_POND_OR_LAKE":
      return `${URBAN_SPACE_CATEGORY_PICTOGRAM_URL_BASE}/urban-pond-or-lake.svg`;
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
    case "URBAN_POND_OR_LAKE":
      return "Mare, étang...";
  }
};

export const getLabelForUrbanGreenSpace = (greenSpace: UrbanGreenSpace): string => {
  switch (greenSpace) {
    case "LAWNS_AND_BUSHES":
      return "Pelouses et arbustes";
    case "GRAVEL_ALLEY":
      return "Allée en gravier";
    case "PAVED_ALLEY":
      return "Allée pavée ou bitumée";
    case "TREE_FILLED_SPACE":
      return "Zone arborée";
    case "URBAN_POND_OR_LAKE":
      return "Plan d'eau";
  }
};

export const getLabelForLivingAndActivitySpace = (
  livingAndActivitySpace: UrbanLivingAndActivitySpace,
): string => {
  switch (livingAndActivitySpace) {
    case "BUILDINGS":
      return "Bâtiments";
    case "PAVED_ALLEY_OR_PARKING_LOT":
      return "Allée ou parking bitumé";
    case "GRAVEL_ALLEY_OR_PARKING_LOT":
      return "Allée ou parking en gravier";
    case "GARDEN_AND_GRASS_ALLEYS":
      return "Jardin ou allée enherbée";
    case "TREE_FILLED_GARDEN_OR_ALLEY":
      return "Jardin ou allée arborée";
  }
};

export const getLabelForPublicSpace = (publicSpace: UrbanPublicSpace): string => {
  switch (publicSpace) {
    case "GRASS_COVERED_SURFACE":
      return "Bandes végétalisées";
    case "IMPERMEABLE_SURFACE":
      return "Bitume, pavé ou ciment";
    case "PERMEABLE_SURFACE":
      return "Gravier, dalles alvéolées ou enrobé poreux";
  }
};

export const getDescriptionForPublicSpace = (publicSpace: UrbanPublicSpace): string | undefined => {
  switch (publicSpace) {
    case "GRASS_COVERED_SURFACE":
      return "Engazonnées, à strates végétales basses ou arbustives, alignement d'arbres, noues d'infiltration...";
    default:
      return undefined;
  }
};

export type BuildingsUseCategory =
  | "RESIDENTIAL"
  | "MULTI_STORY_PARKING"
  | "OTHER"
  | "ECONOMIC_ACTIVITY";
export const getLabelForBuildingsUseCategory = (useCategory: BuildingsUseCategory): string => {
  switch (useCategory) {
    case "RESIDENTIAL":
      return "Habitations";
    case "ECONOMIC_ACTIVITY":
      return "Lieux d'activité économique";
    case "MULTI_STORY_PARKING":
      return "Parking silo";
    case "OTHER":
      return "Autres usages";
  }
};

export const getDescriptionForBuildingsUseCategory = (
  useCategory: BuildingsUseCategory,
): string => {
  switch (useCategory) {
    case "RESIDENTIAL":
      return "Maisons, immeubles collectifs...";
    case "ECONOMIC_ACTIVITY":
      return "Bureaux, commerces...";
    case "MULTI_STORY_PARKING":
      return "Parking voiture à étage";
    case "OTHER":
      return "Établissement éducatif, espace de santé, lieu socio-culturel...";
  }
};

export const getPictogramUrlForBuildingsUseCategory = (
  useCategory: BuildingsUseCategory,
): string => {
  switch (useCategory) {
    case "RESIDENTIAL":
      return `/img/pictograms/buildings-uses/habitations.svg`;
    case "ECONOMIC_ACTIVITY":
      return `/img/pictograms/buildings-uses/LAE.svg`;
    case "MULTI_STORY_PARKING":
      return `/img/pictograms/buildings-uses/parking-silo.svg`;
    case "OTHER":
      return `/img/pictograms/buildings-uses/autres-usages.svg`;
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

export const isBuildingEconomicActivityUse = (buildingUse: BuildingsUse) => {
  return ECONOMIC_ACTIVITY_BUILDINGS_USE.includes(buildingUse as BuildingsEconomicActivityUse);
};

export const getDescriptionForBuildingFloorArea = (
  building: keyof BuildingFloorAreaUsageDistribution,
): string | undefined => {
  switch (building) {
    case "GROUND_FLOOR_RETAIL":
      return "Boulangerie, restaurant, supérette...";
    case "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS":
      return "Garage, atelier...";
    case "SHIPPING_OR_INDUSTRIAL_BUILDINGS":
      return "Entrepot, usine...";
    case "TERTIARY_ACTIVITIES":
      return "Bureaux, lieu d’enseignement ou de culture...";
    default:
      return undefined;
  }
};

export const getPictogramUrlForEconomicActivityUses = (
  useCategory: BuildingsEconomicActivityUse,
): string => {
  switch (useCategory) {
    case "GROUND_FLOOR_RETAIL":
      return `/img/pictograms/buildings-uses/economic-activity/commerce-pied-d-immeuble.svg`;
    case "NEIGHBOURHOOD_FACILITIES_AND_SERVICES":
      return `/img/pictograms/buildings-uses/economic-activity/autre-LAE.svg`;
    case "OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS":
      return `/img/pictograms/buildings-uses/economic-activity/autre-LAE.svg`;
    case "SHIPPING_OR_INDUSTRIAL_BUILDINGS":
      return `/img/pictograms/buildings-uses/economic-activity/industry.svg`;
    case "TERTIARY_ACTIVITIES":
      return `/img/pictograms/buildings-uses/economic-activity/bureaux.svg`;
  }
};
