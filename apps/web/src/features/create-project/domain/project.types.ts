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
  description?: string;
  relatedSiteId: string;
  types: ProjectType[];
  renewableEnergyTypes: RenewableEnergyType[];
  futureOperator: ProjectStakeholder;
  conversionFullTimeJobsInvolved: number;
  reinstatementFullTimeJobsInvolved?: number;
  reinstatementContractOwner?: ProjectStakeholder;
  operationsFullTimeJobsInvolved: number;
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  financialAssistanceRevenue: number;
  yearlyProjectedCosts: Expense[];
  yearlyProjectedRevenue: Revenue[];
};

type Expense = {
  amount: number;
};

type Revenue = {
  amount: number;
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
