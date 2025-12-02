import {
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  sumIfNotNil,
} from "shared";

import {
  ReconversionProjectFeaturesView,
  ReconversionProjectDataView,
} from "./reconversionProject";

export const formatReconversionProjectInputToFeatures = (
  reconversionProject: ReconversionProjectDataView,
): ReconversionProjectFeaturesView => ({
  id: reconversionProject.id,
  name: reconversionProject.name,
  isExpress: true,
  description: reconversionProject.description,
  developmentPlan:
    reconversionProject.developmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT"
      ? {
          developerName: reconversionProject.developmentPlan.developer.name,
          installationCosts: reconversionProject.developmentPlan
            .costs as DevelopmentPlanInstallationExpenses[],
          ...reconversionProject.developmentPlan,
          ...reconversionProject.developmentPlan.features,
        }
      : {
          developerName: reconversionProject.developmentPlan.developer.name,
          installationCosts: reconversionProject.developmentPlan
            .costs as DevelopmentPlanInstallationExpenses[],
          ...reconversionProject.developmentPlan,
          ...reconversionProject.developmentPlan.features,
        },

  futureOwner: reconversionProject.futureSiteOwner?.name,
  futureOperator: reconversionProject.futureOperator?.name,
  soilsDistribution: reconversionProject.soilsDistribution,
  reinstatementContractOwner: reconversionProject.reinstatementContractOwner?.name,
  financialAssistanceRevenues:
    reconversionProject.financialAssistanceRevenues as FinancialAssistanceRevenue[],
  reinstatementCosts: reconversionProject.reinstatementCosts as ReinstatementExpense[],
  yearlyProjectedExpenses: reconversionProject.yearlyProjectedCosts as RecurringExpense[],
  yearlyProjectedRevenues: reconversionProject.yearlyProjectedRevenues as RecurringRevenue[],
  reinstatementSchedule: reconversionProject.reinstatementSchedule,
  firstYearOfOperation: reconversionProject.operationsFirstYear,
  sitePurchaseTotalAmount: sumIfNotNil(
    reconversionProject.sitePurchaseSellingPrice,
    reconversionProject.sitePurchasePropertyTransferDuties,
  ),
  siteResaleSellingPrice: reconversionProject.siteResaleExpectedSellingPrice,
  buildingsResaleSellingPrice: reconversionProject.buildingsResaleExpectedSellingPrice,
  decontaminatedSoilSurface: reconversionProject.decontaminatedSoilSurface,
});
