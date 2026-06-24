import {
  BuildingsConstructionExpense,
  DevelopmentPlanInstallationExpenses,
  DevelopmentPlanType,
  EconomicBalanceImpactResult,
  FinancialAssistanceRevenue,
  ProjectDevelopmentEconomicBalanceItem,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  roundToInteger,
  sumListWithKey,
} from "shared";

import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { getProjectDevelopmentEconomicBalance } from "../break-even-level/projectDevelopmentEconomicBalance";
import { getProjectOperatingEconomicBalance } from "../break-even-level/projectOperatingEconomicBalance";

type ProjectProps = {
  developmentPlanType: DevelopmentPlanType;
  financialAssistanceRevenues?: FinancialAssistanceRevenue[];
  reinstatementCosts: ReinstatementExpense[];
  developmentPlanInstallationCosts: DevelopmentPlanInstallationExpenses[];
  buildingsConstructionAndRehabilitationCosts?: BuildingsConstructionExpense[];
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

export const computeEconomicBalanceImpact = (
  {
    developmentPlanType,
    financialAssistanceRevenues = [],
    reinstatementCosts,
    developmentPlanInstallationCosts,
    buildingsConstructionAndRehabilitationCosts,
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
  const developmentEconomicBalance = getProjectDevelopmentEconomicBalance({
    developmentPlanType,
    costs: {
      reinstatementCosts,
      developmentPlanInstallationCosts,
      buildingsConstructionAndRehabilitationCosts,
      sitePurchaseTotalAmount,
    },
    revenues: {
      financialAssistanceRevenues,
      siteResaleSellingPrice,
      buildingsResaleSellingPrice,
    },
    stakeholders: {
      current: { owner: { structureType: "unknown", structureName: undefined } },
      project: {
        developer: {
          structureType: "unknown",
          structureName: developmentPlanDeveloperName,
        },
        reinstatementContractOwner: {
          structureType: "unknown",
          structureName: reinstatementContractOwnerName,
        },
      },
      future: {
        owner: {
          structureType: "unknown",
          structureName: futureSiteOwnerName,
        },
        operator: {
          structureType: "unknown",
          structureName: futureOperatorName,
        },
      },
    },
  });

  const isDeveloperFutureSiteOperator = futureOperatorName === developmentPlanDeveloperName;

  const siteReinstatement = (
    developmentEconomicBalance.details.filter(
      ({ name }) => name === "siteReinstatement",
    ) as Extract<ProjectDevelopmentEconomicBalanceItem, { name: "siteReinstatement" }>[]
  ).map((item) => ({
    amount: item.total * -1,
    purpose: item.details,
  }));

  const developmentPlanInstallation = (
    developmentEconomicBalance.details.filter(
      ({ name }) => name === "projectInstallation",
    ) as Extract<ProjectDevelopmentEconomicBalanceItem, { name: "projectInstallation" }>[]
  ).map((item) => ({
    amount: item.total * -1,
    purpose: item.details,
  }));

  const buildingsConstructionAndRehabilitation = (
    developmentEconomicBalance.details.filter(
      ({ name }) => name === "projectBuildingsInstallation",
    ) as Extract<ProjectDevelopmentEconomicBalanceItem, { name: "projectBuildingsInstallation" }>[]
  ).map((item) => ({
    amount: item.total * -1,
    purpose: item.details,
  }));

  const financialAssistance = (
    developmentEconomicBalance.details.filter(
      ({ name }) => name === "financialAssistanceRevenues",
    ) as Extract<ProjectDevelopmentEconomicBalanceItem, { name: "financialAssistanceRevenues" }>[]
  ).map((item) => ({
    amount: item.total,
    source: item.details,
  }));

  const sitePurchase = developmentEconomicBalance.details.find(
    ({ name }) => name === "sitePurchase",
  )?.total;

  const siteReinstatementTotal = sumListWithKey(siteReinstatement, "amount");
  const developmentPlanInstallationTotal = sumListWithKey(developmentPlanInstallation, "amount");

  const buildingsConstructionAndRehabilitationTotal = sumListWithKey(
    buildingsConstructionAndRehabilitation,
    "amount",
  );

  const siteResale = developmentEconomicBalance.details.find(
    ({ name }) => name === "siteResaleRevenue",
  )?.total;
  const buildingsResale = developmentEconomicBalance.details.find(
    ({ name }) => name === "buildingsResaleRevenue",
  )?.total;

  const financialAssistanceTotal = roundToInteger(sumListWithKey(financialAssistance, "amount"));

  const sitePurchaseTotal = sitePurchase ? sitePurchase * -1 : undefined;
  if (isDeveloperFutureSiteOperator) {
    const operationEconomicBalance = getProjectOperatingEconomicBalance({
      yearlyProjectedCosts,
      yearlyProjectedRevenues,
      sumOnEvolutionPeriodService,
    });

    const costs = operationEconomicBalance.filter(({ total }) => total < 0);
    const revenues = operationEconomicBalance.filter(({ total }) => total > 0);
    const operationCostsTotal =
      costs.length > 0 ? roundToInteger(sumListWithKey(costs, "total")) * -1 : 0;
    const operationsRevenuesTotal = roundToInteger(sumListWithKey(revenues, "total"));

    return {
      total: roundToInteger(
        sumListWithKey(operationEconomicBalance, "total") + developmentEconomicBalance.total,
      ),
      bearer: developmentPlanDeveloperName,
      costs: {
        total:
          siteReinstatementTotal +
          developmentPlanInstallationTotal +
          operationCostsTotal +
          buildingsConstructionAndRehabilitationTotal +
          (sitePurchaseTotal ?? 0),
        operationsCosts: {
          total: operationCostsTotal,
          costs: costs.map(({ details, total }) => ({
            purpose: details,
            amount: roundToInteger(total * -1),
          })) as RecurringExpense[],
        },
        developmentPlanInstallation:
          developmentPlanInstallation.length > 0
            ? {
                total: developmentPlanInstallationTotal,
                costs: developmentPlanInstallation,
              }
            : undefined,
        buildingsConstructionAndRehabilitation:
          buildingsConstructionAndRehabilitation.length > 0
            ? {
                total: buildingsConstructionAndRehabilitationTotal,
                costs: buildingsConstructionAndRehabilitation,
              }
            : undefined,
        siteReinstatement:
          siteReinstatement.length > 0
            ? {
                total: siteReinstatementTotal,
                costs: siteReinstatement,
              }
            : undefined,
        sitePurchase: sitePurchaseTotal,
      },
      revenues: {
        total:
          (siteResale ?? 0) +
          (buildingsResale ?? 0) +
          operationsRevenuesTotal +
          financialAssistanceTotal,
        siteResale: developmentEconomicBalance.details.find(
          ({ name }) => name === "siteResaleRevenue",
        )?.total,
        buildingsResale: developmentEconomicBalance.details.find(
          ({ name }) => name === "buildingsResaleRevenue",
        )?.total,
        operationsRevenues: {
          total: roundToInteger(sumListWithKey(revenues, "total")),
          revenues: revenues.map((item) => ({
            amount: roundToInteger(item.total),
            source: item.details,
          })) as RecurringRevenue[],
        },
        financialAssistance:
          financialAssistance.length > 0
            ? {
                total: financialAssistanceTotal,
                revenues: financialAssistance,
              }
            : undefined,
      },
    };
  }

  return {
    total: developmentEconomicBalance.total,
    bearer: developmentPlanDeveloperName,
    costs: {
      total:
        siteReinstatementTotal +
        developmentPlanInstallationTotal +
        (sitePurchaseTotal ?? 0) +
        buildingsConstructionAndRehabilitationTotal,
      developmentPlanInstallation:
        developmentPlanInstallation.length > 0
          ? {
              total: sumListWithKey(developmentPlanInstallation, "amount"),
              costs: developmentPlanInstallation,
            }
          : undefined,
      buildingsConstructionAndRehabilitation:
        buildingsConstructionAndRehabilitation.length > 0
          ? {
              total: sumListWithKey(buildingsConstructionAndRehabilitation, "amount"),
              costs: buildingsConstructionAndRehabilitation,
            }
          : undefined,
      siteReinstatement:
        siteReinstatement.length > 0
          ? {
              total: sumListWithKey(siteReinstatement, "amount"),
              costs: siteReinstatement,
            }
          : undefined,
      sitePurchase: sitePurchase ? sitePurchase * -1 : undefined,
    },
    revenues: {
      total: (siteResale ?? 0) + (buildingsResale ?? 0) + financialAssistanceTotal,
      siteResale: developmentEconomicBalance.details.find(
        ({ name }) => name === "siteResaleRevenue",
      )?.total,
      buildingsResale: developmentEconomicBalance.details.find(
        ({ name }) => name === "buildingsResaleRevenue",
      )?.total,
      financialAssistance:
        financialAssistance.length > 0
          ? {
              total: financialAssistanceTotal,
              revenues: financialAssistance,
            }
          : undefined,
    },
  };
};
