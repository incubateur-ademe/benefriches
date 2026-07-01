import {
  BuildingsUseDistribution,
  FinancialAssistanceRevenue,
  ReconversionProjectSoilsDistribution,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "../reconversion-projects";
import { BuildingsConstructionExpense } from "../reconversion-projects/urban-project/buildingsConstructionExpenses";
import { DevelopmentPlanInstallationExpenses } from "./format-impacts/types";

export type DevelopmentPlanFeatures =
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
  involvesReinstatement: boolean;
  soilsDistribution: ReconversionProjectSoilsDistribution;
  isExpressProject: boolean;
  conversionSchedule?: TSchedule;
  reinstatementSchedule?: TSchedule;
  futureOperatorStructureType?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  futureSiteOwnerStructureType?: string;
  reinstatementContractOwnerName?: string;
  reinstatementContractOwnerStructureType?: string;
  sitePurchaseTotalAmount?: number;
  sitePurchasePropertyTransferDutiesAmount?: number;
  reinstatementExpenses: ReinstatementExpense[];
  buildingsConstructionAndRehabilitationExpenses?: BuildingsConstructionExpense[];
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  developmentPlan: {
    installationCosts: DevelopmentPlanInstallationExpenses[];
    installationSchedule?: TSchedule;
    developerName?: string;
    developerStructureType: string;
  } & DevelopmentPlanFeatures;
  operationsFirstYear?: number;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  siteResaleExpectedPropertyTransferDutiesAmount?: number;
  buildingsResaleExpectedPropertyTransferDutiesAmount?: number;
  decontaminatedSoilSurface?: number;
};
