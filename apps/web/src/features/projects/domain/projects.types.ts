import { FricheActivity, SoilsDistribution } from "shared";

import {
  LocalAutorityStructureType,
  OwnerStructureType,
  TenantStructureType,
} from "@/shared/domain/stakeholder";

export type ProjectsList = {
  id: string;
  name: string;
  site: {
    id: string;
    name: string;
  };
}[];

export type SitesList = {
  id: string;
  name: string;
}[];

export type ProjectsGroup = {
  siteId: string;
  siteName: string;
  isFriche: boolean;
  fricheActivity?: FricheActivity;
  reconversionProjects: { id: string; name: string; type: ProjectDevelopmentPlanType }[];
};

export type ReconversionProjectsGroupedBySite = ProjectsGroup[];

export type SiteExpense = {
  type: string;
  bearer: "owner" | "tenant" | "local_or_regional_authority" | "society";
  category: "rent" | "safety" | "soils_degradation" | "taxes" | "other";
  amount: number;
};

type SiteIncome = {
  type: string;
  amount: number;
};

export type Owner = { structureType: OwnerStructureType; name: string };

export type ProjectSite = {
  id: string;
  name: string;
  isFriche: boolean;
  soilsDistribution: SoilsDistribution;
  surfaceArea: number;
  address: {
    id: string;
    value: string;
    city: string;
    cityCode: string;
    postCode: string;
    streetNumber?: string;
    streetName?: string;
    long: number;
    lat: number;
  };
  yearlyExpenses: SiteExpense[];
  yearlyIncomes: SiteIncome[];
  owner: Owner;
};

type Expense = {
  amount: number;
};

type Revenue = {
  amount: number;
};

type ProjectStakeholderStructure =
  | OwnerStructureType
  | TenantStructureType
  | "company"
  | LocalAutorityStructureType
  | "other"
  | "unknown";

export type ProjectStakeholder = { name: string; structureType: ProjectStakeholderStructure };

export type Project = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: SoilsDistribution;
  futureOperator: ProjectStakeholder;
  reinstatementContractOwner?: ProjectStakeholder;
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  financialAssistanceRevenues: number;
  yearlyProjectedCosts: Expense[];
  yearlyProjectedRevenues: Revenue[];
};

export type ProjectDevelopmentPlanType = "PHOTOVOLTAIC_POWER_PLANT" | "MIXED_USE_NEIGHBOURHOOD";
