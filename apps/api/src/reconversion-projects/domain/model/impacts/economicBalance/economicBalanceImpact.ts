import { ReconversionProject } from "../../reconversionProject";

export type EconomicBalanceImpactResult = {
  total: number;
  bearer?: string;
  costs: {
    total: number;
    operationsCosts: {
      total: number;
      expenses: { purpose: string; amount: number }[];
    };
    siteReinstatement?: number;
    developmentPlanInstallation: number;
    realEstateTransaction?: number;
  };
  revenues: {
    total: number;
    operationsRevenues: {
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
  realEstateTransactionCost?: number;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  yearlyProjectedRevenues: ReconversionProject["yearlyProjectedRevenues"];
  yearlyProjectedCosts: ReconversionProject["yearlyProjectedCosts"];
};

type EconomicResultInstallationProps = {
  reinstatementFinancialAssistanceAmount: number;
  reinstatementCost: number;
  developmentPlanInstallationCost: number;
  realEstateTransactionCost: number;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
};

export const getEconomicResultsOfProjectInstallation = ({
  reinstatementFinancialAssistanceAmount,
  reinstatementCost,
  developmentPlanInstallationCost,
  realEstateTransactionCost,
  futureOperatorName,
  futureSiteOwnerName,
  reinstatementContractOwnerName,
}: EconomicResultInstallationProps) => {
  const isOperatorOwnerOfReinstatement = futureOperatorName === reinstatementContractOwnerName;
  const isOperatorFutureSiteOwner = futureSiteOwnerName === futureOperatorName;

  const revenues = isOperatorOwnerOfReinstatement
    ? {
        total: reinstatementFinancialAssistanceAmount,
        financialAssistance: reinstatementFinancialAssistanceAmount,
      }
    : { total: 0 };

  const costsDetails = Object.fromEntries(
    Object.entries({
      developmentPlanInstallation: -developmentPlanInstallationCost,
      siteReinstatement: isOperatorOwnerOfReinstatement ? -reinstatementCost : undefined,
      realEstateTransaction: isOperatorFutureSiteOwner ? -realEstateTransactionCost : undefined,
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

  const totalExpensesForDuration = expensesForDuration.reduce(
    (total, expense) => expense.amount + total,
    0,
  );
  const totalRevenuesForDuration = revenuesForDuration.reduce(
    (total, expense) => expense.amount + total,
    0,
  );
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
    realEstateTransactionCost = 0,
    reinstatementContractOwnerName,
    futureSiteOwnerName,
    futureOperatorName,
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
    realEstateTransactionCost,
    futureOperatorName,
    futureSiteOwnerName,
    reinstatementContractOwnerName,
  });

  const {
    total: totalExploitation,
    operationsCosts,
    operationsRevenues,
  } = getEconomicResultsOfProjectExploitationForDuration(
    yearlyProjectedRevenues,
    yearlyProjectedCosts,
    durationInYear,
  );

  const { total: totalInstallationCosts, ...installationCostsDetails } = costs;
  const { total: totalInstallationRevenues, ...installationRevenuesDetails } = revenues;

  return {
    total: Math.round(totalInstallation + totalExploitation),
    bearer: futureOperatorName,
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
};
