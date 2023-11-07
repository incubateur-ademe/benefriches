import { SiteFoncier } from "@/features/create-site/domain/siteFoncier.types";

export enum ProjectType {
  RENEWABLE_ENERGY = "RENEWABLE_ENERGY",
  URBAN_AGRICULTURE = "URBAN_AGRICULTURE",
  BUILDINGS = "BUILDINGS",
  NATURAL_URBAN_SPACES = "NATURAL_URBAN_SPACES",
}

export enum RenewableEnergyType {
  PHOTOVOLTAIC = "PHOTOVOLTAIC",
  AGRIVOLTAIC = "AGRIVOLTAIC",
  GEOTHERMAL = "GEOTHERMAL",
  BIOMASS = "BIOMASS",
}

export type Project = {
  relatedSite: SiteFoncier;
  types: ProjectType[];
  renewableEnergyTypes: RenewableEnergyType[];
};
