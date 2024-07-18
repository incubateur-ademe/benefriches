import { FricheActivity, SoilsDistribution } from "shared";

import {
  MixedUseNeighbourhoodDevelopmentExpense,
  MixedUseNeighbourhoodSpace,
} from "@/shared/domain/mixedUseNeighbourhood";
import {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  WorksSchedule,
} from "@/shared/domain/reconversionProject";
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
  reconversionProjects: {
    id: string;
    name: string;
    type: ProjectDevelopmentPlanType;
    isExpressProject: boolean;
  }[];
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

type ProjectStakeholderStructure =
  | OwnerStructureType
  | TenantStructureType
  | "company"
  | LocalAutorityStructureType
  | "other"
  | "unknown";

export type ProjectStakeholder = { name: string; structureType: ProjectStakeholderStructure };

export type ProjectFeatures = {
  id: string;
  name: string;
  description?: string;
  developmentPlan:
    | {
        type: "PHOTOVOLTAIC_POWER_PLANT";
        developerName?: string;
        installationCosts: PhotovoltaicInstallationExpense[];
        installationSchedule?: WorksSchedule;
        electricalPowerKWc: number;
        surfaceArea: number;
        expectedAnnualProduction: number;
        contractDuration: number;
      }
    | {
        type: "MIXED_USE_NEIGHBOURHOOD";
        developerName?: string;
        installationCosts: MixedUseNeighbourhoodDevelopmentExpense[];
        installationSchedule?: WorksSchedule;
        spaces: Record<MixedUseNeighbourhoodSpace, number>;
      };
  soilsDistribution: SoilsDistribution;
  futureOwner?: string;
  futureOperator?: string;
  reinstatementContractOwner?: string;
  reinstatementFullTimeJobs?: number;
  conversionFullTimeJobs?: number;
  operationsFullTimeJobs?: number;
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  reinstatementCosts?: ReinstatementExpense[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  reinstatementSchedule?: WorksSchedule;
  firstYearOfOperation?: number;
  sitePurchaseTotalAmount?: number;
  siteResaleTotalAmount?: number;
};

export type ProjectDevelopmentPlanType = "PHOTOVOLTAIC_POWER_PLANT" | "MIXED_USE_NEIGHBOURHOOD";

export type ProjectForComparison = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: SoilsDistribution;
  futureOperator: ProjectStakeholder;
  reinstatementContractOwner?: ProjectStakeholder;
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  financialAssistanceRevenues: number;
  yearlyProjectedCosts: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
};
