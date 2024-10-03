import { UrbanSpaceCategory } from "shared";

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
      return "Bâtiments, voirie privée, jardings et espaces verts privés...";
    case "PUBLIC_SPACES":
      return "(hors espaces verts) Rues, places, pistes cyclables, parking de surface...";
    case "GREEN_SPACES":
      return "Parc, jarding public, forêt urbaine...";
    case "URBAN_FARM":
      return "Production de fruits et légumes";
    case "RENEWABLE_ENERGY_PRODUCTION_PLANT":
      return "Géothermique ou biomasse";
    case "URBAN_POND_OR_LAKE":
      return "Mare, étang, gravière...";
  }
};
