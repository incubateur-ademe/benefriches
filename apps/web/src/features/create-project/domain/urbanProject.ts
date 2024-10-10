import {
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
  UrbanSpaceCategory,
} from "shared";

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
      return "Bâtiments, voirie privée, jardins et espaces verts privés...";
    case "PUBLIC_SPACES":
      return "(hors espaces verts) Rues, places, pistes cyclables, parking de surface...";
    case "GREEN_SPACES":
      return "Parc, jardin public, forêt urbaine...";
    case "URBAN_FARM":
      return "Production de fruits et légumes";
    case "RENEWABLE_ENERGY_PRODUCTION_PLANT":
      return "Géothermique ou biomasse";
    case "URBAN_POND_OR_LAKE":
      return "Mare, étang, gravière...";
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
      return "Herbe";
    case "IMPERMEABLE_SURFACE":
      return "Bitume, pavé ou ciment";
    case "PERMEABLE_SURFACE":
      return "Gravier, dalles alvéolées ou enrobé poreux";
  }
};
