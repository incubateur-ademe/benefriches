import { ProjectType, RenewableEnergyType } from "../domain/project.types";

export const getLabelForProjectType = (value: ProjectType): string => {
  switch (value) {
    case ProjectType.BUILDINGS:
      return "Bâtiments, quartier mixte (Habitations, commerces, infrastructures..)";
    case ProjectType.NATURAL_URBAN_SPACES:
      return "Espace de nature en ville (Parc, aménagement paysager...)";
    case ProjectType.URBAN_AGRICULTURE:
      return "Agriculture urbaine (Production de fruits et légumes)";
    case ProjectType.RENEWABLE_ENERGY:
      return "Énergies renouvelables (Photovoltaïques, géothermie...)";
  }
};

export const getLabelForRenewableEnergyType = (value: RenewableEnergyType): string => {
  switch (value) {
    case RenewableEnergyType.PHOTOVOLTAIC:
      return "Photovoltaïque";
    case RenewableEnergyType.AGRIVOLTAIC:
      return "Agrivoltaïque";
    case RenewableEnergyType.GEOTHERMAL:
      return "Géothermie";
    case RenewableEnergyType.BIOMASS:
      return "Biomasse";
  }
};

export const getDescriptionForRenewableEnergyType = (value: RenewableEnergyType): string => {
  switch (value) {
    case RenewableEnergyType.PHOTOVOLTAIC:
      return "Production d’électricité grâce à des capteurs ou centrales solaires";
    case RenewableEnergyType.AGRIVOLTAIC:
      return "Production d’électricité photovoltaïque associée à une production agricole";
    case RenewableEnergyType.GEOTHERMAL:
      return "Production de chaleur à partir du sol ou de l’eau en souterrain";
    case RenewableEnergyType.BIOMASS:
      return "Production d’électricité par combustion de matière organique";
  }
};
