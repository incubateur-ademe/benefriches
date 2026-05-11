import {
  DevelopmentPlanInstallationExpenses,
  DevelopmentPlanType,
  FinancialAssistanceRevenue,
  isSameStakeholders,
  ProjectDevelopmentEconomicBalanceItem,
  ReconversionProjectImpactsBreakEvenLevel,
  ReinstatementExpense,
  sumListWithKey,
} from "shared";

export type InputProjectDevelopmentEconomicBalanceProps = {
  developmentPlanType: DevelopmentPlanType;
  costs: {
    reinstatementCosts: ReinstatementExpense[];
    developmentPlanInstallationCosts: DevelopmentPlanInstallationExpenses[];
    sitePurchaseTotalAmount?: number;
  };
  revenues: {
    financialAssistanceRevenues: FinancialAssistanceRevenue[];
    siteResaleSellingPrice?: number;
    buildingsResaleSellingPrice?: number;
  };
  stakeholders: ReconversionProjectImpactsBreakEvenLevel["stakeholders"];
};

export const getProjectDevelopmentEconomicBalance = ({
  developmentPlanType,
  costs,
  revenues,
  stakeholders,
}: InputProjectDevelopmentEconomicBalanceProps) => {
  const isDeveloperOwnerOfReinstatement = isSameStakeholders(
    stakeholders.project.developer,
    stakeholders.project.reinstatementContractOwner,
  );

  const isDeveloperFutureSiteOwner =
    stakeholders.future?.owner &&
    isSameStakeholders(stakeholders.project.developer, stakeholders.future.owner);

  const developmentEconomicBalance: ProjectDevelopmentEconomicBalanceItem[] = [];

  if (costs.developmentPlanInstallationCosts.length > 0) {
    developmentEconomicBalance.push(
      ...costs.developmentPlanInstallationCosts.map(({ amount, purpose }) => ({
        name: "projectInstallation" as const,
        total: -amount,
        details: purpose,
      })),
    );
  }
  if (isDeveloperOwnerOfReinstatement && costs.reinstatementCosts.length > 0) {
    developmentEconomicBalance.push(
      ...costs.reinstatementCosts.map(({ amount, purpose }) => ({
        name: "siteReinstatement" as const,
        total: -amount,
        details: purpose,
      })),
    );
  }

  const hasSitePurchase =
    developmentPlanType === "URBAN_PROJECT"
      ? costs.sitePurchaseTotalAmount
      : costs.sitePurchaseTotalAmount && isDeveloperFutureSiteOwner;
  if (hasSitePurchase && costs.sitePurchaseTotalAmount) {
    developmentEconomicBalance.push({
      name: "sitePurchase",
      total: -costs.sitePurchaseTotalAmount,
    });
  }

  if (revenues.siteResaleSellingPrice) {
    developmentEconomicBalance.push({
      name: "siteResaleRevenue",
      total: revenues.siteResaleSellingPrice,
    });
  }

  if (revenues.buildingsResaleSellingPrice) {
    developmentEconomicBalance.push({
      name: "buildingsResaleRevenue",
      total: revenues.buildingsResaleSellingPrice,
    });
  }

  // financial assistance is given for reinstatement works
  if (revenues.financialAssistanceRevenues?.length && isDeveloperOwnerOfReinstatement) {
    developmentEconomicBalance.push(
      ...revenues.financialAssistanceRevenues.map(({ amount, source }) => ({
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
