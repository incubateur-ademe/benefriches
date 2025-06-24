import { pipe } from "rxjs";
import {
  DevelopmentPlanInstallationExpenses,
  EconomicBalanceImpactResult,
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  sumListWithKey,
} from "shared";

import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";

type ProjectProps = {
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  reinstatementCosts: ReinstatementExpense[];
  developmentPlanInstallationCosts: DevelopmentPlanInstallationExpenses[];
  sitePurchaseTotalAmount?: number;
  developmentPlanDeveloperName?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  yearlyProjectedRevenues: RecurringRevenue[];
  yearlyProjectedCosts: RecurringExpense[];
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
};

type ReconversionProjectInstallationCostsInput = {
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  reinstatementCosts: ReinstatementExpense[];
  developmentPlanInstallationCosts: DevelopmentPlanInstallationExpenses[];
  sitePurchaseTotalAmount: number;
  developmentPlanDeveloperName?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
};

type ReconversionProjectInstallationEconomicResult = {
  total: number;
  costs: {
    total: number;
    developmentPlanInstallation?: { total: number; costs: DevelopmentPlanInstallationExpenses[] };
    siteReinstatement?: { total: number; costs: ReinstatementExpense[] };
    sitePurchase?: number;
  };
  revenues: {
    total: number;
    financialAssistance?: { total: number; revenues: FinancialAssistanceRevenue[] };
  };
};

const withSiteResaleRevenues =
  (siteResaleSellingPrice?: number) =>
  (economicBalance: EconomicBalanceImpactResult): EconomicBalanceImpactResult => {
    if (!siteResaleSellingPrice) return economicBalance;
    return {
      ...economicBalance,
      total: economicBalance.total + siteResaleSellingPrice,
      revenues: {
        ...economicBalance.revenues,
        siteResale: siteResaleSellingPrice,
        total: economicBalance.revenues.total + siteResaleSellingPrice,
      },
    };
  };

const withBuildingsResaleRevenues =
  (buildingsResaleSellingPrice?: number) =>
  (economicBalance: EconomicBalanceImpactResult): EconomicBalanceImpactResult => {
    if (!buildingsResaleSellingPrice) return economicBalance;
    return {
      ...economicBalance,
      total: economicBalance.total + buildingsResaleSellingPrice,
      revenues: {
        ...economicBalance.revenues,
        buildingsResale: buildingsResaleSellingPrice,
        total: economicBalance.revenues.total + buildingsResaleSellingPrice,
      },
    };
  };

export const getEconomicResultsOfProjectInstallation = ({
  financialAssistanceRevenues,
  reinstatementCosts,
  developmentPlanInstallationCosts,
  sitePurchaseTotalAmount,
  developmentPlanDeveloperName,
  futureSiteOwnerName,
  reinstatementContractOwnerName,
}: ReconversionProjectInstallationCostsInput): ReconversionProjectInstallationEconomicResult => {
  const isDeveloperOwnerOfReinstatement =
    developmentPlanDeveloperName === reinstatementContractOwnerName;
  const isDeveloperFutureSiteOwner = futureSiteOwnerName === developmentPlanDeveloperName;

  const costDetails: Omit<ReconversionProjectInstallationEconomicResult["costs"], "total"> = {};

  if (developmentPlanInstallationCosts.length > 0) {
    costDetails.developmentPlanInstallation = {
      total: sumListWithKey(developmentPlanInstallationCosts, "amount"),
      costs: developmentPlanInstallationCosts,
    };
  }
  if (isDeveloperOwnerOfReinstatement && reinstatementCosts.length > 0) {
    costDetails.siteReinstatement = {
      total: sumListWithKey(reinstatementCosts, "amount"),
      costs: reinstatementCosts,
    };
  }

  if (isDeveloperFutureSiteOwner && sitePurchaseTotalAmount) {
    costDetails.sitePurchase = sitePurchaseTotalAmount;
  }
  const costs = {
    total:
      (costDetails.developmentPlanInstallation?.total ?? 0) +
      (costDetails.sitePurchase ?? 0) +
      (costDetails.siteReinstatement?.total ?? 0),
    ...costDetails,
  };

  const revenues: ReconversionProjectInstallationEconomicResult["revenues"] = {
    total: 0,
  };

  // financial assistance is given for reinstatement works
  if (financialAssistanceRevenues?.length && isDeveloperOwnerOfReinstatement) {
    const financialAssistanceRevenuesTotal = sumListWithKey(financialAssistanceRevenues, "amount");
    revenues.total = financialAssistanceRevenuesTotal;
    revenues.financialAssistance = {
      total: financialAssistanceRevenuesTotal,
      revenues: financialAssistanceRevenues,
    };
  }

  const { total: projectInstallationTotalCost } = costs;
  const { total: projectInstallationTotalRevenue } = revenues;

  return {
    total: projectInstallationTotalRevenue - projectInstallationTotalCost,
    costs,
    revenues,
  };
};

export const getEconomicResultsOfProjectExploitationForDuration = (
  yearlyProjectedRevenues: ProjectProps["yearlyProjectedRevenues"],
  yearlyProjectedCosts: ProjectProps["yearlyProjectedCosts"],
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService,
) => {
  const costsForDuration = yearlyProjectedCosts.map(({ amount, purpose }) => ({
    purpose,
    amount: sumOnEvolutionPeriodService.sumWithDiscountFactor(amount),
  }));
  const revenuesForDuration = yearlyProjectedRevenues.map(({ amount, source }) => ({
    source,
    amount: sumOnEvolutionPeriodService.sumWithDiscountFactor(amount),
  }));

  const totalCostsForDuration = sumListWithKey(costsForDuration, "amount");
  const totalRevenuesForDuration = sumListWithKey(revenuesForDuration, "amount");
  return {
    total: totalRevenuesForDuration - totalCostsForDuration,
    operationsCosts: {
      total: totalCostsForDuration,
      costs: costsForDuration,
    },
    operationsRevenues: {
      total: totalRevenuesForDuration,
      revenues: revenuesForDuration,
    },
  };
};

export const computeEconomicBalanceImpact = (
  {
    financialAssistanceRevenues,
    reinstatementCosts,
    developmentPlanInstallationCosts,
    sitePurchaseTotalAmount = 0,
    reinstatementContractOwnerName,
    futureSiteOwnerName,
    futureOperatorName,
    developmentPlanDeveloperName,
    yearlyProjectedCosts,
    yearlyProjectedRevenues,
    siteResaleSellingPrice,
    buildingsResaleSellingPrice,
  }: ProjectProps,
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService,
): EconomicBalanceImpactResult => {
  const {
    total: totalInstallation,
    costs,
    revenues,
  } = getEconomicResultsOfProjectInstallation({
    financialAssistanceRevenues,
    reinstatementCosts,
    developmentPlanInstallationCosts,
    sitePurchaseTotalAmount,
    developmentPlanDeveloperName,
    futureSiteOwnerName,
    reinstatementContractOwnerName,
  });

  const isDeveloperFutureSiteOperator = futureOperatorName === developmentPlanDeveloperName;

  const { total: totalInstallationCosts, ...installationCostsDetails } = costs;
  const { total: totalInstallationRevenues, ...installationRevenuesDetails } = revenues;

  if (isDeveloperFutureSiteOperator) {
    const {
      total: totalExploitation,
      operationsCosts,
      operationsRevenues,
    } = getEconomicResultsOfProjectExploitationForDuration(
      yearlyProjectedRevenues,
      yearlyProjectedCosts,
      sumOnEvolutionPeriodService,
    );

    return pipe(
      withSiteResaleRevenues(siteResaleSellingPrice),
      withBuildingsResaleRevenues(buildingsResaleSellingPrice),
    )({
      total: Math.round(totalInstallation + totalExploitation),
      bearer: developmentPlanDeveloperName,
      costs: {
        total: totalInstallationCosts + operationsCosts.total,
        ...installationCostsDetails,
        operationsCosts,
      },
      revenues: {
        total: totalInstallationRevenues + operationsRevenues.total,
        ...installationRevenuesDetails,
        operationsRevenues,
      },
    });
  }

  return pipe(
    withSiteResaleRevenues(siteResaleSellingPrice),
    withBuildingsResaleRevenues(buildingsResaleSellingPrice),
  )({
    total: Math.round(totalInstallation),
    bearer: developmentPlanDeveloperName,
    costs: {
      total: totalInstallationCosts,
      ...installationCostsDetails,
    },
    revenues: {
      total: totalInstallationRevenues,
      ...installationRevenuesDetails,
    },
  });
};
