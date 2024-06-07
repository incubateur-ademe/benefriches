import { sumListWithKey } from "src/shared-kernel/sum-list/sumList";
import { ReconversionProject } from "../../reconversionProject";

type Cost = {
  amount: number;
  purpose: string;
};
type Revenue = {
  amount: number;
  source: string;
};

export type EconomicBalanceImpactResult = {
  total: number;
  bearer?: string;
  costs: {
    total: number;
    operationsCosts?: { total: number; costs: Cost[] };
    siteReinstatement?: { total: number; costs: Cost[] };
    developmentPlanInstallation?: { total: number; costs: Cost[] };
    realEstateTransaction?: number;
  };
  revenues: {
    total: number;
    operationsRevenues?: { total: number; revenues: Revenue[] };
    financialAssistance?: { total: number; revenues: Revenue[] };
  };
};

type ProjectProps = {
  financialAssistanceRevenues?: Revenue[];
  reinstatementCosts: Cost[];
  developmentPlanInstallationCosts: Cost[];
  realEstateTransactionTotalCost?: number;
  developmentPlanDeveloperName?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  reinstatementContractOwnerName?: string;
  yearlyProjectedRevenues: Revenue[];
  yearlyProjectedCosts: Cost[];
};

type ReconversionProjectInstallationCostsInput = {
  financialAssistanceRevenues?: Revenue[];
  reinstatementCosts: Cost[];
  developmentPlanInstallationCosts: Cost[];
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
    developmentPlanInstallation?: { total: number; costs: Cost[] };
    siteReinstatement?: { total: number; costs: Cost[] };
    realEstateTransaction?: number;
  };
  revenues: {
    total: number;
    financialAssistance?: { total: number; revenues: Revenue[] };
  };
};

const getCostsWithTotalAmount = (costs: Cost[]): { total: number; costs: Cost[] } => {
  const total = sumListWithKey(costs, "amount");
  return { total, costs };
};

const getFinancialAssistanceRevenuesWithTotalAmount = (
  financialAssistanceRevenues: Revenue[],
): { total: number; revenues: Revenue[] } => {
  const total = sumListWithKey(financialAssistanceRevenues, "amount");
  return { total, revenues: financialAssistanceRevenues };
};

export const getEconomicResultsOfProjectInstallation = ({
  financialAssistanceRevenues,
  reinstatementCosts,
  developmentPlanInstallationCosts,
  realEstateTransactionTotalCost,
  developmentPlanDeveloperName,
  futureSiteOwnerName,
  reinstatementContractOwnerName,
}: ReconversionProjectInstallationCostsInput): ReconversionProjectInstallationEconomicResult => {
  const isDeveloperOwnerOfReinstatement =
    developmentPlanDeveloperName === reinstatementContractOwnerName;
  const isDeveloperFutureSiteOwner = futureSiteOwnerName === developmentPlanDeveloperName;

  const costDetails: Omit<ReconversionProjectInstallationEconomicResult["costs"], "total"> = {};

  if (developmentPlanInstallationCosts.length > 0) {
    costDetails.developmentPlanInstallation = getCostsWithTotalAmount(
      developmentPlanInstallationCosts,
    );
  }
  if (isDeveloperOwnerOfReinstatement && reinstatementCosts.length > 0) {
    costDetails.siteReinstatement = getCostsWithTotalAmount(reinstatementCosts);
  }

  if (isDeveloperFutureSiteOwner && realEstateTransactionTotalCost) {
    costDetails.realEstateTransaction = realEstateTransactionTotalCost;
  }
  const costs = {
    total:
      (costDetails.developmentPlanInstallation?.total ?? 0) +
      (costDetails.realEstateTransaction ?? 0) +
      (costDetails.siteReinstatement?.total ?? 0),
    ...costDetails,
  };

  const financialAssistanceRevenuesWithTotal = financialAssistanceRevenues?.length
    ? getFinancialAssistanceRevenuesWithTotalAmount(financialAssistanceRevenues)
    : null;
  const revenues: ReconversionProjectInstallationEconomicResult["revenues"] =
    financialAssistanceRevenuesWithTotal
      ? {
          total: financialAssistanceRevenuesWithTotal.total,
          financialAssistance: financialAssistanceRevenuesWithTotal,
        }
      : { total: 0 };

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
    financialAssistanceRevenues,
    reinstatementCosts,
    developmentPlanInstallationCosts,
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
    developmentPlanInstallationCosts,
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
