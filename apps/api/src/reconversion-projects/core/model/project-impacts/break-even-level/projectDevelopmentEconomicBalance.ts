import {
  DevelopmentPlanInstallationExpenses,
  DevelopmentPlanType,
  FinancialAssistanceRevenue,
  ProjectDevelopmentEconomicBalanceItem,
  ReinstatementExpense,
  sumListWithKey,
} from "shared";

export type InputReconversionProjectData = {
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  reinstatementCosts: ReinstatementExpense[];
  developmentPlanInstallationCosts: DevelopmentPlanInstallationExpenses[];
  sitePurchaseTotalAmount?: number;
  developmentPlanDeveloperName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  developmentPlanType: DevelopmentPlanType;
};

export const getProjectDevelopmentEconomicBalance = (
  reconversionProject: InputReconversionProjectData,
) => {
  const isDeveloperOwnerOfReinstatement =
    reconversionProject.developmentPlanDeveloperName ===
    reconversionProject.reinstatementContractOwnerName;

  const isDeveloperFutureSiteOwner =
    reconversionProject.futureSiteOwnerName === reconversionProject.developmentPlanDeveloperName;

  const developmentEconomicBalance: ProjectDevelopmentEconomicBalanceItem[] = [];

  if (reconversionProject.developmentPlanInstallationCosts.length > 0) {
    developmentEconomicBalance.push(
      ...reconversionProject.developmentPlanInstallationCosts.map(({ amount, purpose }) => ({
        name: "projectInstallation" as const,
        total: -amount,
        details: purpose,
      })),
    );
  }
  if (isDeveloperOwnerOfReinstatement && reconversionProject.reinstatementCosts.length > 0) {
    developmentEconomicBalance.push(
      ...reconversionProject.reinstatementCosts.map(({ amount, purpose }) => ({
        name: "siteReinstatement" as const,
        total: -amount,
        details: purpose,
      })),
    );
  }

  const hasSitePurchase =
    reconversionProject.developmentPlanType === "URBAN_PROJECT"
      ? reconversionProject.sitePurchaseTotalAmount
      : reconversionProject.sitePurchaseTotalAmount && isDeveloperFutureSiteOwner;
  if (hasSitePurchase && reconversionProject.sitePurchaseTotalAmount) {
    developmentEconomicBalance.push({
      name: "sitePurchase",
      total: -reconversionProject.sitePurchaseTotalAmount,
    });
  }

  if (reconversionProject.siteResaleSellingPrice) {
    developmentEconomicBalance.push({
      name: "siteResaleRevenue",
      total: reconversionProject.siteResaleSellingPrice,
    });
  }

  if (reconversionProject.buildingsResaleSellingPrice) {
    developmentEconomicBalance.push({
      name: "buildingsResaleRevenue",
      total: reconversionProject.buildingsResaleSellingPrice,
    });
  }

  // financial assistance is given for reinstatement works
  if (reconversionProject.financialAssistanceRevenues?.length && isDeveloperOwnerOfReinstatement) {
    developmentEconomicBalance.push(
      ...reconversionProject.financialAssistanceRevenues.map(({ amount, source }) => ({
        name: "financialAssistanceRevenues" as const,
        total: amount,
        details: source,
      })),
    );
  }

  return {
    details: developmentEconomicBalance,
    total: sumListWithKey(developmentEconomicBalance, "total"),
  };
};
