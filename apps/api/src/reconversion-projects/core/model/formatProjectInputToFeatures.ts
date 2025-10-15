import {
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  getProjectSoilDistributionByType,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  sumIfNotNil,
} from "shared";

import { ReconversionProjectFeaturesView, ReconversionProjectInput } from "./reconversionProject";

export const formatReconversionProjectInputToFeatures = (
  reconversionProject: ReconversionProjectInput,
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
  soilsDistribution: getProjectSoilDistributionByType(reconversionProject.soilsDistribution),
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
