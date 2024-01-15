import { LocalAndRegionalAuthority } from "@/shared/domain/localOrRegionalAuthority";
import { SoilType } from "@/shared/domain/soils";

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

export type ProjectsGroupedBySite = {
  siteId: string;
  siteName: string;
  projects: { id: string; name: string }[];
}[];

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

type OwnerStructureType = "local_or_regional_authority" | "company" | "private_individual";

export type Owner = { structureType: OwnerStructureType; name: string };

export type ProjectSite = {
  id: string;
  name: string;
  isFriche: boolean;
  soilsDistribution: Partial<Record<SoilType, number>>;
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

type ProjectStakeholderStructure = "company" | "local_or_regional_authority" | "unknown";

export type ProjectStakeholder =
  | { name: string; structureType: ProjectStakeholderStructure }
  | {
      name: LocalAndRegionalAuthority;
      structureType: "local_or_regional_authority";
    };

export type Project = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: Partial<Record<SoilType, number>>;
  futureOperator: ProjectStakeholder;
  reinstatementContractOwner?: ProjectStakeholder;
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  financialAssistanceRevenue: number;
  yearlyProjectedCosts: Expense[];
  yearlyProjectedRevenue: Revenue[];
};
