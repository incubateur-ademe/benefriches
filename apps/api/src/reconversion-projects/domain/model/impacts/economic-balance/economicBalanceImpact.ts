import { sumListWithKey } from "src/shared-kernel/sum-list/sumList";
import { ReconversionProject } from "../../reconversionProject";

export type EconomicBalanceImpactResult = {
  total: number;
  bearer?: string;
  costs: {
    total: number;
    operationsCosts?: {
      total: number;
      expenses: { purpose: string; amount: number }[];
    };
    siteReinstatement?: number;
    developmentPlanInstallation: number;
    realEstateTransaction?: number;
  };
  revenues: {
    total: number;
    operationsRevenues?: {
      total: number;
      revenues: { source: string; amount: number }[];
    };
    financialAssistance?: number;
  };
};

type ProjectProps = {
  reinstatementFinancialAssistanceAmount?: number;
  reinstatementCost?: number;
  developmentPlanInstallationCost?: number;
  realEstateTransactionTotalCost?: number;
  developmentPlanDeveloperName?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  yearlyProjectedRevenues: ReconversionProject["yearlyProjectedRevenues"];
  yearlyProjectedCosts: ReconversionProject["yearlyProjectedCosts"];
};

type ReconversionProjectInstallationCostResult = {
  reinstatementFinancialAssistanceAmount: number;
  reinstatementCost: number;
  developmentPlanInstallationCost: number;
  realEstateTransactionTotalCost: number;
  developmentPlanDeveloperName?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
};

export const getEconomicResultsOfProjectInstallation = ({
  reinstatementFinancialAssistanceAmount,
  reinstatementCost,
  developmentPlanInstallationCost,
  realEstateTransactionTotalCost,
  developmentPlanDeveloperName,
  futureSiteOwnerName,
  reinstatementContractOwnerName,
}: ReconversionProjectInstallationCostResult) => {
  const isDeveloperOwnerOfReinstatement =
    developmentPlanDeveloperName === reinstatementContractOwnerName;
  const isDeveloperFutureSiteOwner = futureSiteOwnerName === developmentPlanDeveloperName;

  const revenues = isDeveloperOwnerOfReinstatement
    ? {
        total: reinstatementFinancialAssistanceAmount,
        financialAssistance: reinstatementFinancialAssistanceAmount,
      }
    : { total: 0 };

  const costsDetails = Object.fromEntries(
    Object.entries({
      developmentPlanInstallation: -developmentPlanInstallationCost,
      siteReinstatement: isDeveloperOwnerOfReinstatement ? -reinstatementCost : undefined,
      realEstateTransaction:
        isDeveloperFutureSiteOwner && realEstateTransactionTotalCost
          ? -realEstateTransactionTotalCost
          : undefined,
    }).filter(([, amount]) => amount !== undefined),
  ) as {
    siteReinstatement?: number;
    developmentPlanInstallation: number;
    realEstateTransaction?: number;
  };
  const costs = {
    total: Object.values(costsDetails).reduce((total, amount) => total + amount, 0),
    ...costsDetails,
  };

  const { total: projectInstallationTotalCost } = costs;
  const { total: projectInstallationTotalRevenue } = revenues;

  return {
    total: projectInstallationTotalRevenue + projectInstallationTotalCost,
    costs,
    revenues,
  };
};

export const getEconomicResultsOfProjectExploitationForDuration = (
  yearlyProjectedRevenues: ReconversionProject["yearlyProjectedRevenues"],
  yearlyProjectedCosts: ReconversionProject["yearlyProjectedCosts"],
  durationInYear: number,
) => {
  const expensesForDuration = yearlyProjectedCosts.map(({ amount, purpose }) => ({
    purpose,
    amount: -amount * durationInYear,
  }));
  const revenuesForDuration = yearlyProjectedRevenues.map(({ amount, source }) => ({
    source,
    amount: amount * durationInYear,
  }));

  const totalExpensesForDuration = sumListWithKey(expensesForDuration, "amount");
  const totalRevenuesForDuration = sumListWithKey(revenuesForDuration, "amount");
  return {
    total: totalRevenuesForDuration + totalExpensesForDuration,
    operationsCosts: {
      total: totalExpensesForDuration,
      expenses: expensesForDuration,
    },
    operationsRevenues: {
      total: totalRevenuesForDuration,
      revenues: revenuesForDuration,
    },
  };
};

export const computeEconomicBalanceImpact = (
  {
    reinstatementFinancialAssistanceAmount = 0,
    reinstatementCost = 0,
    developmentPlanInstallationCost = 0,
    realEstateTransactionTotalCost = 0,
    reinstatementContractOwnerName,
    futureSiteOwnerName,
    futureOperatorName,
    developmentPlanDeveloperName,
    yearlyProjectedCosts,
    yearlyProjectedRevenues,
  }: ProjectProps,
  durationInYear: number,
) => {
  const {
    total: totalInstallation,
    costs,
    revenues,
  } = getEconomicResultsOfProjectInstallation({
    reinstatementFinancialAssistanceAmount,
    reinstatementCost,
    developmentPlanInstallationCost,
    realEstateTransactionTotalCost,
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
      durationInYear,
    );

    return {
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
    };
  }

  return {
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
  };
};
