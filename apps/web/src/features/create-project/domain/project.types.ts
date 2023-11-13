import { LocalAndRegionalAuthority } from "@/shared/domain/localOrRegionalAuthority";

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
  name: string;
  relatedSiteId: string;
  types: ProjectType[];
  renewableEnergyTypes: RenewableEnergyType[];
  futureOperator: ProjectStakeholder;
  fullTimeJobsInvolved: number;
  reinstatementFullTimeJobsInvolved: number;
  reinstatementContractOwner: ProjectStakeholder;
  operationsFullTimeJobsInvolved: number;
};

type ProjectStakeholderStructure =
  | "company"
  | "local_or_regional_authority"
  | "unknown";

type ProjectStakeholder =
  | { name: string; structureType: ProjectStakeholderStructure }
  | {
      name: LocalAndRegionalAuthority;
      structureType: "local_or_regional_authority";
    };

export type ProjectSite = {
  id: string;
  name: string;
  isFriche: boolean;
  owner: {
    id: string;
    name: string;
    structureType: ProjectStakeholderStructure;
  };
  tenant?: {
    id: string;
    name: string;
    structureType: ProjectStakeholderStructure;
  };
};
