import { DevelopmentPlanCategory } from "shared";

import { RenewableEnergyDevelopmentPlanType } from "@/shared/domain/reconversionProject";

export const getLabelForDevelopmentPlanCategory = (value: DevelopmentPlanCategory): string => {
  switch (value) {
    case "URBAN_PROJECT":
      return "Projet urbain";
    case "NATURAL_URBAN_SPACES":
      return "Espace de nature en ville";
    case "URBAN_AGRICULTURE":
      return "Ferme urbaine";
    case "RENEWABLE_ENERGY":
      return "Centrale d'énergie renouvelable";
    case "COMMERCIAL_ACTIVITY_AREA":
      return "Zone d'activités économiques";
  }
};

export const getDescriptionForDevelopmentPlanCategory = (
  value: DevelopmentPlanCategory,
): string => {
  switch (value) {
    case "URBAN_PROJECT":
      return "Logements, lieux d'activité économique, équipements publics, espaces verts...";
    case "NATURAL_URBAN_SPACES":
      return "Parc ou espaces verts urbains, renaturations...";
    case "URBAN_AGRICULTURE":
      return "Cultures de fruits et légumes, horticulture...";
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
      return "Production d'électricité grâce à des capteurs ou centrales solaires ";
    case "AGRIVOLTAIC":
      return "Production d'électricité photovoltaïque associée à une production agricole";
    case "GEOTHERMAL":
      return "Production de chaleur à partir du sol ou de l'eau en souterrain";
    case "BIOMASS":
      return "Production d'électricité par combustion de matière organique";
  }
};

const developmentPlanCategoryPictogramMap: Record<DevelopmentPlanCategory, string> = {
  URBAN_PROJECT: "urban-project.svg",
  NATURAL_URBAN_SPACES: "natural-urban-space.svg",
  COMMERCIAL_ACTIVITY_AREA: "commercial-activity-area.svg",
  URBAN_AGRICULTURE: "urban-agriculture.svg",
  RENEWABLE_ENERGY: "renewable-energy-production.svg",
} as const;

export const getPictogramForDevelopmentPlanCategory = (value: DevelopmentPlanCategory): string => {
  return developmentPlanCategoryPictogramMap[value];
};

const renewableEnergyPictogramMap: Record<RenewableEnergyDevelopmentPlanType, string> = {
  PHOTOVOLTAIC_POWER_PLANT: "photovoltaic.svg",
  AGRIVOLTAIC: "agrivoltaic.svg",
  GEOTHERMAL: "geothermal.svg",
  BIOMASS: "biomass.svg",
} as const;

export const getPictogramForRenewableEnergy = (
  value: RenewableEnergyDevelopmentPlanType,
): string => {
  return renewableEnergyPictogramMap[value];
};
