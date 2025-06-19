import {
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpensePurpose,
} from "shared";

import { ReconversionProjectImpactsResult } from "../application/project-impacts/actions";
import { ProjectDevelopmentPlanType } from "../domain/projects.types";

export type EconomicBalanceName = EconomicBalanceMainName | EconomicBalanceDetailsName;

export type EconomicBalanceMainName =
  | "site_reinstatement"
  | "site_purchase"
  | "operations_costs"
  | "operations_revenues"
  | "financial_assistance"
  | "development_plan_installation"
  | "photovoltaic_development_plan_installation"
  | "urban_project_development_plan_installation"
  | "site_resale"
  | "buildings_resale";

export type DevelopmentPlanInstallationExpenseName =
  | "photovoltaic_technical_studies"
  | "photovoltaic_works"
  | "photovoltaic_other"
  | "urban_project_technical_studies"
  | "urban_project_works"
  | "urban_project_other"
  | DevelopmentPlanInstallationExpenses["purpose"];

export type EconomicBalanceDetailsName =
  | RecurringExpense["purpose"]
  | RecurringRevenue["source"]
  | ReinstatementExpensePurpose
  | FinancialAssistanceRevenue["source"]
  | DevelopmentPlanInstallationExpenseName;

export type EconomicBalance = {
  total: number;
  bearer?: string;
  economicBalance: {
    name: EconomicBalanceMainName;
    value: number;
    details?: {
      name: EconomicBalanceDetailsName;
      value: number;
    }[];
  }[];
};

const getInstallationCostNamePrefix = (projectType?: ProjectDevelopmentPlanType) => {
  switch (projectType) {
    case "URBAN_PROJECT":
      return "urban_project";
    case "PHOTOVOLTAIC_POWER_PLANT":
      return "photovoltaic";
    default:
      return undefined;
  }
};

const getDevelopmentPlanDetailsName = (
  costName: DevelopmentPlanInstallationExpenses["purpose"],
  projectType?: ProjectDevelopmentPlanType,
) => {
  const prefix = getInstallationCostNamePrefix(projectType);
  if (!prefix) {
    return costName;
  }
  switch (costName) {
    case "development_works":
    case "installation_works":
      return `${prefix}_works`;
    case "other":
      return `${prefix}_other`;

    default:
      return costName;
  }
};

export const getEconomicBalanceProjectImpacts = (
  projectType: ProjectDevelopmentPlanType,
  impactsData?: ReconversionProjectImpactsResult["impacts"],
): EconomicBalance => {
  if (!impactsData)
    return {
      total: 0,
      economicBalance: [],
    };

  const { economicBalance } = impactsData;
  const impacts: EconomicBalance["economicBalance"] = [];

  if (economicBalance.costs.siteReinstatement?.total) {
    impacts.push({
      name: "site_reinstatement",
      value: -economicBalance.costs.siteReinstatement.total,
      details: economicBalance.costs.siteReinstatement.costs.map(({ purpose, amount }) => ({
        value: -amount,
        name: purpose,
      })),
    });
  }

  if (economicBalance.costs.sitePurchase) {
    impacts.push({
      name: "site_purchase",
      value: -economicBalance.costs.sitePurchase,
    });
  }

  if (economicBalance.costs.developmentPlanInstallation?.total) {
    const namePrefix = getInstallationCostNamePrefix(projectType);
    impacts.push({
      name: namePrefix
        ? `${namePrefix}_development_plan_installation`
        : "development_plan_installation",
      value: -economicBalance.costs.developmentPlanInstallation.total,
      details: economicBalance.costs.developmentPlanInstallation.costs.map(
        ({ purpose, amount }) => ({
          value: -amount,
          name: getDevelopmentPlanDetailsName(purpose, projectType) as EconomicBalanceDetailsName,
        }),
      ),
    });
  }

  if (economicBalance.revenues.financialAssistance) {
    impacts.push({
      name: "financial_assistance",
      value: economicBalance.revenues.financialAssistance.total,
      details: economicBalance.revenues.financialAssistance.revenues.map(({ source, amount }) => ({
        value: amount,
        name: source,
      })),
    });
  }

  if (economicBalance.costs.operationsCosts?.total) {
    impacts.push({
      name: "operations_costs",
      value: -economicBalance.costs.operationsCosts.total,
      details: economicBalance.costs.operationsCosts.costs.map(({ purpose, amount }) => ({
        value: -amount,
        name: purpose,
      })),
    });
  }

  if (economicBalance.revenues.operationsRevenues?.total) {
    impacts.push({
      name: "operations_revenues",
      value: economicBalance.revenues.operationsRevenues.total,
      details: economicBalance.revenues.operationsRevenues.revenues.map(({ source, amount }) => ({
        value: amount,
        name: source,
      })),
    });
  }

  if (economicBalance.revenues.siteResale) {
    impacts.push({
      name: "site_resale",
      value: economicBalance.revenues.siteResale,
    });
  }

  if (economicBalance.revenues.buildingsResale) {
    impacts.push({
      name: "buildings_resale",
      value: economicBalance.revenues.buildingsResale,
    });
  }

  return {
    total: economicBalance.total,
    bearer: economicBalance.bearer,
    economicBalance: impacts,
  };
};
