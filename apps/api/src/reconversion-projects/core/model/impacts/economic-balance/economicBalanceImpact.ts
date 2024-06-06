import { sumListWithKey } from "src/shared-kernel/sum-list/sumList";
import { ReconversionProject } from "../../reconversionProject";

export type EconomicBalanceImpactResult = {
  total: number;
  bearer?: string;
  costs: {
    total: number;
    operationsCosts?: {
      total: number;
      costs: { purpose: string; amount: number }[];
    };
    siteReinstatement?: {
      total: number;
      costs: { purpose: string; amount: number }[];
    };
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
  financialAssistanceRevenues?: number;
  reinstatementCosts: { amount: number; purpose: string }[];
  developmentPlanInstallationCost?: number;
  realEstateTransactionTotalCost?: number;
  developmentPlanDeveloperName?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  yearlyProjectedRevenues: ReconversionProject["yearlyProjectedRevenues"];
  yearlyProjectedCosts: ReconversionProject["yearlyProjectedCosts"];
};

type ReconversionProjectInstallationCostsInput = {
  financialAssistanceRevenues: number;
  reinstatementCosts: { amount: number; purpose: string }[];
  developmentPlanInstallationCost: number;
  realEstateTransactionTotalCost: number;
  developmentPlanDeveloperName?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
};

type ReconversionProjectInstallationEconomicResult = {
  total: number;
  costs: {
    total: number;
    developmentPlanInstallation: number;
    siteReinstatement?: { total: number; costs: { amount: number; purpose: string }[] };
    realEstateTransaction?: number;
  };
  revenues: {
    total: number;
    financialAssistance?: number;
  };
};

const getReinstatementCostsWithTotalAmount = (
  reinstatementCosts: { amount: number; purpose: string }[],
): { total: number; costs: { amount: number; purpose: string }[] } => {
  const total = sumListWithKey(reinstatementCosts, "amount");
  return { total, costs: reinstatementCosts };
};

export const getEconomicResultsOfProjectInstallation = ({
  financialAssistanceRevenues,
  reinstatementCosts,
  developmentPlanInstallationCost,
  realEstateTransactionTotalCost,
  developmentPlanDeveloperName,
  futureSiteOwnerName,
  reinstatementContractOwnerName,
}: ReconversionProjectInstallationCostsInput): ReconversionProjectInstallationEconomicResult => {
  const isDeveloperOwnerOfReinstatement =
    developmentPlanDeveloperName === reinstatementContractOwnerName;
  const isDeveloperFutureSiteOwner = futureSiteOwnerName === developmentPlanDeveloperName;

  const revenues = isDeveloperOwnerOfReinstatement
    ? {
        total: financialAssistanceRevenues,
        financialAssistance: financialAssistanceRevenues,
      }
    : { total: 0 };

  const costDetails: Omit<ReconversionProjectInstallationEconomicResult["costs"], "total"> = {
    developmentPlanInstallation: developmentPlanInstallationCost,
  };

  if (isDeveloperOwnerOfReinstatement) {
    costDetails.siteReinstatement = getReinstatementCostsWithTotalAmount(reinstatementCosts);
  }
  if (isDeveloperFutureSiteOwner && realEstateTransactionTotalCost) {
    costDetails.realEstateTransaction = realEstateTransactionTotalCost;
  }
  const costs = {
    total:
      costDetails.developmentPlanInstallation +
      (costDetails.realEstateTransaction ?? 0) +
      (costDetails.siteReinstatement?.total ?? 0),
    ...costDetails,
  };

  const { total: projectInstallationTotalCost } = costs;
  const { total: projectInstallationTotalRevenue } = revenues;

  return {
    total: projectInstallationTotalRevenue - projectInstallationTotalCost,
    costs,
    revenues,
  };
};

export const getEconomicResultsOfProjectExploitationForDuration = (
  yearlyProjectedRevenues: ReconversionProject["yearlyProjectedRevenues"],
  yearlyProjectedCosts: ReconversionProject["yearlyProjectedCosts"],
  durationInYear: number,
) => {
  const costsForDuration = yearlyProjectedCosts.map(({ amount, purpose }) => ({
    purpose,
    amount: amount * durationInYear,
  }));
  const revenuesForDuration = yearlyProjectedRevenues.map(({ amount, source }) => ({
    source,
    amount: amount * durationInYear,
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
    financialAssistanceRevenues = 0,
    reinstatementCosts,
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
    financialAssistanceRevenues,
    reinstatementCosts,
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
