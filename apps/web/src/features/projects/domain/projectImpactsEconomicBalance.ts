import {
  BuildingsConstructionExpensePurpose,
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  ProjectOperatingEconomicBalanceItem,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpensePurpose,
  sumListWithKey,
} from "shared";

import { ProjectImpactsState } from "../application/project-impacts/projectImpacts.reducer";
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
  | "urban_project_buildings_construction_and_rehabilitation"
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
  | DevelopmentPlanInstallationExpenseName
  | BuildingsConstructionExpensePurpose;

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
  impactsData?: ProjectImpactsState["impacts"],
): EconomicBalance => {
  if (!impactsData)
    return {
      total: 0,
      economicBalance: [],
    };

  const economicBalance = impactsData.projectEconomicBalance;
  const impacts: EconomicBalance["economicBalance"] = [];

  const siteReinstatement = economicBalance.details.filter(
    (item) => item.name === "siteReinstatement",
  );

  if (siteReinstatement.length > 0) {
    impacts.push({
      name: "site_reinstatement",
      value: sumListWithKey(siteReinstatement, "total"),
      details: siteReinstatement.map(({ details, total }) => ({
        value: total,
        name: details,
      })),
    });
  }

  const sitePurchase = economicBalance.details.find((item) => item.name === "sitePurchase")?.total;

  if (sitePurchase) {
    impacts.push({
      name: "site_purchase",
      value: sitePurchase,
    });
  }

  const developmentPlanInstallation = economicBalance.details.filter(
    (item) => item.name === "projectInstallation",
  );

  if (developmentPlanInstallation.length > 0) {
    const namePrefix = getInstallationCostNamePrefix(projectType);
    impacts.push({
      name: namePrefix
        ? `${namePrefix}_development_plan_installation`
        : "development_plan_installation",
      value: sumListWithKey(developmentPlanInstallation, "total"),
      details: developmentPlanInstallation.map(({ details, total }) => ({
        value: total,
        name: getDevelopmentPlanDetailsName(details, projectType) as EconomicBalanceDetailsName,
      })),
    });
  }

  const buildingsConstructionAndRehabilitation = economicBalance.details.filter(
    (item) => item.name === "projectBuildingsInstallation",
  );

  if (buildingsConstructionAndRehabilitation.length > 0) {
    impacts.push({
      name: "urban_project_buildings_construction_and_rehabilitation",
      value: sumListWithKey(buildingsConstructionAndRehabilitation, "total"),
      details: buildingsConstructionAndRehabilitation.map(({ details, total }) => ({
        value: total,
        name: details,
      })),
    });
  }
  const financialAssistance = economicBalance.details.filter(
    (item) => item.name === "financialAssistanceRevenues",
  );

  if (financialAssistance.length > 0) {
    impacts.push({
      name: "financial_assistance",
      value: sumListWithKey(financialAssistance, "total"),
      details: financialAssistance.map(({ details, total }) => ({
        value: total,
        name: details,
      })),
    });
  }

  const operationsCosts = economicBalance.details.filter(
    (item): item is ProjectOperatingEconomicBalanceItem =>
      item.name === "projectOperatingEconomicBalance" && item.total < 0,
  );

  if (operationsCosts.length > 0) {
    impacts.push({
      name: "operations_costs",
      value: sumListWithKey(operationsCosts, "total"),
      details: operationsCosts.map(({ details, total }) => ({
        value: total,
        name: details,
      })),
    });
  }
  const operationsRevenues = economicBalance.details.filter(
    (item): item is ProjectOperatingEconomicBalanceItem =>
      item.name === "projectOperatingEconomicBalance" && item.total > 0,
  );

  if (operationsRevenues.length > 0) {
    impacts.push({
      name: "operations_revenues",
      value: sumListWithKey(operationsRevenues, "total"),
      details: operationsRevenues.map(({ details, total }) => ({
        value: total,
        name: details,
      })),
    });
  }
  const siteResale = economicBalance.details.find(
    (item) => item.name === "siteResaleRevenue",
  )?.total;

  if (siteResale) {
    impacts.push({
      name: "site_resale",
      value: siteResale,
    });
  }
  const buildingsResale = economicBalance.details.find(
    (item) => item.name === "buildingsResaleRevenue",
  )?.total;

  if (buildingsResale) {
    impacts.push({
      name: "buildings_resale",
      value: buildingsResale,
    });
  }

  return {
    total: economicBalance.total,
    bearer: impactsData.stakeholders.project.developer.structureName,
    economicBalance: impacts,
  };
};
