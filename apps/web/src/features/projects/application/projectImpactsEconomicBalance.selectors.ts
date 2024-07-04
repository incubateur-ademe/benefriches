import { createSelector } from "@reduxjs/toolkit";
import {
  DevelopmentPlanInstallationCost,
  FinancialAssistance,
  OperationsCost,
  ReinstatementCost,
  SourceRevenue,
} from "../domain/impacts.types";
import { ProjectDevelopmentPlanType } from "../domain/projects.types";
import { ProjectImpactsState } from "./projectImpacts.reducer";

import { RootState } from "@/app/application/store";

const selectSelf = (state: RootState) => state.projectImpacts;

const selectImpactsData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["impactsData"] => state.impactsData,
);

const selectCurrentFilter = createSelector(
  selectSelf,
  (state): ProjectImpactsState["currentCategoryFilter"] => state.currentCategoryFilter,
);

export const selectProjectDevelopmentType = createSelector(
  selectSelf,
  (state): ProjectDevelopmentPlanType =>
    state.projectData?.developmentPlan.type ?? "PHOTOVOLTAIC_POWER_PLANT",
);

export type EconomicBalanceName = EconomicBalanceMainName | EconomicBalanceDetailsName;

export type EconomicBalanceMainName =
  | "site_reinstatement"
  | "site_purchase"
  | "operations_costs"
  | "operations_revenues"
  | "financial_assistance"
  | "development_plan_installation"
  | "photovoltaic_development_plan_installation"
  | "mixed_use_neighbourhood_development_plan_installation";

export type DevelopmentPlanInstallationCostName =
  | "photovoltaic_technical_studies"
  | "photovoltaic_works"
  | "photovoltaic_other"
  | "mixed_use_neighbourhood_technical_studies"
  | "mixed_use_neighbourhood_works"
  | "mixed_use_neighbourhood_other"
  | DevelopmentPlanInstallationCost["purpose"];

type EconomicBalanceDetailsName =
  | OperationsCost["purpose"]
  | SourceRevenue
  | ReinstatementCost["purpose"]
  | FinancialAssistance
  | DevelopmentPlanInstallationCostName;

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
    case "MIXED_USE_NEIGHBOURHOOD":
      return "mixed_use_neighbourhood";
    case "PHOTOVOLTAIC_POWER_PLANT":
      return "photovoltaic";
    default:
      return undefined;
  }
};

const getDevelopmentPlanDetailsName = (
  costName: DevelopmentPlanInstallationCost["purpose"],
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

export const getEconomicBalanceProjectImpacts = createSelector(
  selectCurrentFilter,
  selectProjectDevelopmentType,
  selectImpactsData,
  (currentFilter, projectType, impactsData): EconomicBalance => {
    const { economicBalance } = impactsData || {};

    const displayAll = currentFilter === "all";
    const displayEconomicData = displayAll || currentFilter === "economic";

    if (!economicBalance || !(displayAll || displayEconomicData)) {
      return {
        total: 0,
        economicBalance: [],
      };
    }

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
        details: economicBalance.revenues.financialAssistance.revenues.map(
          ({ source, amount }) => ({
            value: amount,
            name: source,
          }),
        ),
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

    return {
      total: economicBalance.total,
      bearer: economicBalance.bearer,
      economicBalance: impacts,
    };
  },
);
