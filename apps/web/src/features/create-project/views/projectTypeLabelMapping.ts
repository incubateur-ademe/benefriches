import {
  DevelopmentPlanCategory,
  RenewableEnergyDevelopmentPlanType,
} from "../domain/project.types";

export const getLabelForDevelopmentPlanCategory = (value: DevelopmentPlanCategory): string => {
  switch (value) {
    case "BUILDINGS":
      return "Quartier";
    case "NATURAL_URBAN_SPACES":
      return "Espace de nature en ville";
    case "URBAN_AGRICULTURE":
      return "Ferme urbaine";
    case "RENEWABLE_ENERGY":
      return "Centrale d'énergies renouvelables";
    case "COMMERCIAL_ACTIVITY_AREA":
      return "Zone d'activité économique";
  }
};

export const getDescriptionForDevelopmentPlanCategory = (
  value: DevelopmentPlanCategory,
): string => {
  switch (value) {
    case "BUILDINGS":
      return "Logements, bureaux, commerces, espaces verts, petite centrale EnR…";
    case "NATURAL_URBAN_SPACES":
      return "Parc ou forêt urbaine";
    case "URBAN_AGRICULTURE":
      return "Production de fruits et légumes";
    case "RENEWABLE_ENERGY":
      return "Centrale photovoltaïque, agrivoltaïque, géothermique ou biomasse";
    case "COMMERCIAL_ACTIVITY_AREA":
      return "Commerciale, industrielle, logistique, artisanale, d'activités de service...";
  }
};

export const getLabelForRenewableEnergyProductionType = (
  value: RenewableEnergyDevelopmentPlanType,
): string => {
  switch (value) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return "Photovoltaïque";
    case "AGRIVOLTAIC":
      return "Agrivoltaïque";
    case "GEOTHERMAL":
      return "Géothermie";
    case "BIOMASS":
      return "Biomasse / Méthanisation";
  }
};

export const getDescriptionForRenewableEnergyType = (
  value: RenewableEnergyDevelopmentPlanType,
): string => {
  switch (value) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return "Production d'électricité à partir du soleil ";
    case "AGRIVOLTAIC":
      return "Production d'électricité photovoltaïque associée à une production agricole";
    case "GEOTHERMAL":
      return "Production de chaleur à partir du sol ou de l'eau en souterrain";
    case "BIOMASS":
      return "Production d'électricité par combustion ou fermentation de matières organiques";
  }
};

const developmentPlanCategoryPictogramMap: Record<DevelopmentPlanCategory, string> = {
  BUILDINGS: "mixed-used-neighborhood.svg",
  NATURAL_URBAN_SPACES: "natural-urban-space.svg",
  COMMERCIAL_ACTIVITY_AREA: "commercial-activity-area.svg",
  URBAN_AGRICULTURE: "urban-agriculture.svg",
  RENEWABLE_ENERGY: "renewable-energy-production.svg",
} as const;

export const getPictogramForDevelopmentPlanCategory = (value: DevelopmentPlanCategory): string => {
  return developmentPlanCategoryPictogramMap[value];
};
