import {
  DevelopmentPlanCategory,
  RenewableEnergyDevelopmentPlanType,
} from "../domain/project.types";

export const getLabelForDevelopmentPlanCategory = (value: DevelopmentPlanCategory): string => {
  switch (value) {
    case "BUILDINGS":
      return "Bâtiments, quartier mixte (Habitations, commerces, infrastructures..)";
    case "NATURAL_URBAN_SPACES":
      return "Espace de nature en ville (Parc, aménagement paysager...)";
    case "URBAN_AGRICULTURE":
      return "Agriculture urbaine (Production de fruits et légumes)";
    case "RENEWABLE_ENERGY":
      return "Énergies renouvelables (Photovoltaïques, géothermie...)";
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
      return "Biomasse";
  }
};

export const getDescriptionForRenewableEnergyType = (
  value: RenewableEnergyDevelopmentPlanType,
): string => {
  switch (value) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return "Production d’électricité grâce à des capteurs ou centrales solaires";
    case "AGRIVOLTAIC":
      return "Production d’électricité photovoltaïque associée à une production agricole";
    case "GEOTHERMAL":
      return "Production de chaleur à partir du sol ou de l’eau en souterrain";
    case "BIOMASS":
      return "Production d’électricité par combustion de matière organique";
  }
};
