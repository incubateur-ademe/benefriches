import {
  BuildingsUseDistribution,
  FinancialAssistanceRevenue,
  ReconversionProjectSoilsDistribution,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "../reconversion-projects";
import { DevelopmentPlanInstallationExpenses } from "./types";

type DevelopmentPlanFeatures =
  | {
      type: "PHOTOVOLTAIC_POWER_PLANT";
      features: {
        electricalPowerKWc: number;
        surfaceArea: number;
        expectedAnnualProduction: number;
        contractDuration: number;
      };
    }
  | {
      type: "URBAN_PROJECT";
      features: {
        buildingsFloorAreaDistribution: BuildingsUseDistribution;
      };
    };

export type ReconversionProjectImpactsDataView<TSchedule> = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: ReconversionProjectSoilsDistribution;
  isExpressProject: boolean;
  conversionSchedule?: TSchedule;
  reinstatementSchedule?: TSchedule;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  sitePurchaseTotalAmount?: number;
  sitePurchasePropertyTransferDutiesAmount?: number;
  reinstatementExpenses: ReinstatementExpense[];
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  developmentPlan: {
    installationCosts: DevelopmentPlanInstallationExpenses[];
    installationSchedule?: TSchedule;
    developerName?: string;
  } & DevelopmentPlanFeatures;
  operationsFirstYear?: number;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  decontaminatedSoilSurface?: number;
};
