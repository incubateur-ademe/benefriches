import {
  FinancialAssistanceRevenue,
  FricheActivity,
  UrbanProjectDevelopmentExpense,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
  UrbanProjectSpace,
  BuildingsUseDistribution,
  SiteNature,
} from "shared";

type Schedule = { startDate: string; endDate: string };

export type ProjectsGroup = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
  fricheActivity?: FricheActivity;
  reconversionProjects: {
    id: string;
    name: string;
    type: ProjectDevelopmentPlanType;
    isExpressProject: boolean;
  }[];
};

export type ReconversionProjectsGroupedBySite = ProjectsGroup[];

type PhotovoltaicPowerPlantFeatures = {
  type: "PHOTOVOLTAIC_POWER_PLANT";
  developerName?: string;
  installationCosts: PhotovoltaicInstallationExpense[];
  installationSchedule?: Schedule;
  electricalPowerKWc: number;
  surfaceArea: number;
  expectedAnnualProduction: number;
  contractDuration: number;
};
export type UrbanProjectFeatures = {
  type: "URBAN_PROJECT";
  developerName?: string;
  installationCosts: UrbanProjectDevelopmentExpense[];
  installationSchedule?: Schedule;
  spaces: Partial<Record<UrbanProjectSpace, number>>;
  buildingsFloorArea: BuildingsUseDistribution;
};
export type ProjectFeatures = {
  id: string;
  name: string;
  description?: string;
  developmentPlan: PhotovoltaicPowerPlantFeatures | UrbanProjectFeatures;
  soilsDistribution: SoilsDistribution;
  futureOwner?: string;
  futureOperator?: string;
  reinstatementContractOwner?: string;
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  reinstatementCosts?: ReinstatementExpense[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  reinstatementSchedule?: Schedule;
  firstYearOfOperation?: number;
  sitePurchaseTotalAmount?: number;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  decontaminatedSoilSurface?: number;
};

export type ProjectDevelopmentPlanType = "PHOTOVOLTAIC_POWER_PLANT" | "URBAN_PROJECT";
