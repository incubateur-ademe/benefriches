import type {
  UrbanProjectUseWithBuilding,
  SoilType,
  UrbanGreenSpace,
  UrbanProjectUse,
} from "shared";
import { getSoilTypeForUrbanGreenSpace } from "shared";

import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";

const BUILDINGS_USE_PICTOGRAM_URL_BASE = "/img/pictograms/buildings-uses";
export const getPictogramUrlForBuildingsUse = (use: UrbanProjectUseWithBuilding): string => {
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
    case "OTHER_CULTURAL_PLACE":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/leisure-and-culture/other-cultural-place.svg`;
    case "CINEMA":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/leisure-and-culture/cinema.svg`;
    case "MUSEUM":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/leisure-and-culture/museum.svg`;
    case "THEATER":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/leisure-and-culture/theater.svg`;
    case "RECREATIONAL_FACILITY":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/leisure-and-culture/recreational-facility.svg`;
    case "PUBLIC_FACILITIES":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/public-buildings.svg`;
    case "KINDERGARTEN_OR_PRIMARY_SCHOOL":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/education/kindergarten-or-primary-school.svg`;
    case "SECONDARY_SCHOOL":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/education/secondary-school.svg`;
    case "OTHER_EDUCATIONAL_FACILITY":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/education/other-educational-facility.svg`;
    case "LOCAL_HEALTH_SERVICE":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/health/local-health-service.svg`;
    case "HOSPITAL":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/health/hospital.svg`;
    case "MEDICAL_SOCIAL_FACILITY":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/health/medical-social-facility.svg`;
    case "OTHER_BUILDING":
      return `${BUILDINGS_USE_PICTOGRAM_URL_BASE}/other.svg`;
  }
};

export const getPictogramUrlForUrbanGreenSpace = (space: UrbanGreenSpace): string => {
  return getPictogramForSoilType(getSoilTypeForUrbanGreenSpace(space));
};

export const getColorForUrbanGreenSpace = (space: UrbanGreenSpace): string => {
  return getColorForSoilType(getSoilTypeForUrbanGreenSpace(space));
};

export const getLabelForUrbanProjectUse = (use: UrbanProjectUse): string => {
  switch (use) {
    case "RESIDENTIAL":
      return "Logements";
    case "LOCAL_STORE":
      return "Commerces";
    case "LOCAL_SERVICES":
      return "Services de proximité";
    case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
      return "Locaux artisanaux, industriels ou de stockage";
    case "PUBLIC_FACILITIES":
      return "Autres bâtiments publics";
    case "OFFICES":
      return "Bureaux";
    case "OTHER_CULTURAL_PLACE":
      return "Autre lieu culturel";
    case "SPORTS_FACILITIES":
      return "Équipements sportifs";
    case "MULTI_STORY_PARKING":
      return "Parking silo";
    case "OTHER_BUILDING":
      return "Autres bâtiments";
    case "PUBLIC_GREEN_SPACES":
      return "Espaces verts";
    case "OTHER_PUBLIC_SPACES":
      return "Autres espaces publics";
    // Educational facilities
    case "KINDERGARTEN_OR_PRIMARY_SCHOOL":
      return "Crèche, école maternelle ou élémentaire";
    case "SECONDARY_SCHOOL":
      return "Collège ou lycée";
    case "OTHER_EDUCATIONAL_FACILITY":
      return "Autre établissement éducatif";
    // Health facilities
    case "LOCAL_HEALTH_SERVICE":
      return "Service de santé de proximité";
    case "HOSPITAL":
      return "Établissement hospitalier";
    case "MEDICAL_SOCIAL_FACILITY":
      return "Établissement médico-social";
    // Leisure and culture facilities
    case "CINEMA":
      return "Cinéma";
    case "MUSEUM":
      return "Musée";
    case "THEATER":
      return "Théâtre";
    case "RECREATIONAL_FACILITY":
      return "Équipement récréatif";
  }
};

export const getDescriptionForUrbanProjectUse = (use: UrbanProjectUse): string | undefined => {
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
    case "OTHER_CULTURAL_PLACE":
      return "Médiathèque, salle de concert...";
    case "PUBLIC_GREEN_SPACES":
      return "Parc, jardin public, forêt urbaine...";
    case "OTHER_PUBLIC_SPACES":
      return "Rues, places, pistes cyclables, parkings de surface...";
    // Educational facilities
    case "OTHER_EDUCATIONAL_FACILITY":
      return "(université, centre de formation)";
    // Health facilities
    case "LOCAL_HEALTH_SERVICE":
      return "(médecin, pharmacie, laboratoire...)";
    case "MEDICAL_SOCIAL_FACILITY":
      return "(EHPAD, centre d'accueil...)";
    // Leisure and culture facilities
    case "RECREATIONAL_FACILITY":
      return "(aire de jeux, bowling...)";
    case "OFFICES":
    case "PUBLIC_FACILITIES":
    case "OTHER_BUILDING":
    case "KINDERGARTEN_OR_PRIMARY_SCHOOL":
    case "SECONDARY_SCHOOL":
    case "HOSPITAL":
    case "CINEMA":
    case "MUSEUM":
    case "THEATER":
      return undefined;
  }
};

const URBAN_PROJECT_USE_PICTOGRAM_URL_BASE = "/img/pictograms";
export const getPictogramUrlForUrbanProjectUse = (use: UrbanProjectUse): string => {
  switch (use) {
    case "RESIDENTIAL":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/residential.svg`;
    case "LOCAL_STORE":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/economic-activity/local-store.svg`;
    case "LOCAL_SERVICES":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/economic-activity/local-services.svg`;
    case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/economic-activity/industrial-and-artisanal-and-shipping-premises.svg`;
    case "OFFICES":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/economic-activity/offices.svg`;
    case "MULTI_STORY_PARKING":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/multi-story-parking.svg`;
    case "SPORTS_FACILITIES":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/sports-facilities.svg`;
    case "OTHER_CULTURAL_PLACE":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/leisure-and-culture/other-cultural-place.svg`;
    case "CINEMA":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/leisure-and-culture/cinema.svg`;
    case "MUSEUM":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/leisure-and-culture/museum.svg`;
    case "THEATER":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/leisure-and-culture/theater.svg`;
    case "RECREATIONAL_FACILITY":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/leisure-and-culture/recreational-facility.svg`;
    case "PUBLIC_FACILITIES":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/public-buildings.svg`;
    case "KINDERGARTEN_OR_PRIMARY_SCHOOL":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/education/kindergarten-or-primary-school.svg`;
    case "SECONDARY_SCHOOL":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/education/secondary-school.svg`;
    case "OTHER_EDUCATIONAL_FACILITY":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/education/other-educational-facility.svg`;
    case "LOCAL_HEALTH_SERVICE":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/health/local-health-service.svg`;
    case "HOSPITAL":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/health/hospital.svg`;
    case "MEDICAL_SOCIAL_FACILITY":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/health/medical-social-facility.svg`;
    case "OTHER_BUILDING":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/buildings-uses/other.svg`;
    case "PUBLIC_GREEN_SPACES":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/urban-project-spaces/green-spaces.svg`;
    case "OTHER_PUBLIC_SPACES":
      return `${URBAN_PROJECT_USE_PICTOGRAM_URL_BASE}/urban-project-spaces/public-spaces.svg`;
  }
};

// Spaces (soil types with custom labels for urban project context)
const SPACE_LABELS: Partial<Record<SoilType, { label: string; description: string }>> = {
  BUILDINGS: {
    label: "Bâtiments",
    description: "",
  },
  MINERAL_SOIL: {
    label: "Allée ou parking imperméable",
    description: "Bitume, pavé, ciment",
  },
  IMPERMEABLE_SOILS: {
    label: "Allée ou parking perméable",
    description: "Gravier, dalles alvéolées, sol nu...",
  },
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED: {
    label: "Espace végétalisé",
    description: "Pelouse et buissons",
  },
  ARTIFICIAL_TREE_FILLED: {
    label: "Espace arboré",
    description: "Arbres plantés",
  },
};

export const getLabelForSpace = (soilType: SoilType): string => {
  return SPACE_LABELS[soilType]?.label ?? getLabelForSoilType(soilType);
};

export const getDescriptionForSpace = (soilType: SoilType): string | undefined => {
  return SPACE_LABELS[soilType]?.description ?? getDescriptionForSoilType(soilType);
};
