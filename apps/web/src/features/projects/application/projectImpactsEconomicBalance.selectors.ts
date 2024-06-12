import { createSelector } from "@reduxjs/toolkit";
import {
  DevelopmentPlanInstallationCost,
  FinancialAssistance,
  OperationsCost,
  ReinstatementCost,
  SourceRevenue,
} from "../domain/impacts.types";
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

export type EconomicBalanceName = EconomicBalanceMainName | EconomicBalanceDetailsName;

export type EconomicBalanceMainName =
  | "site_reinstatement"
  | "real_estate_transaction"
  | "development_plan_installation"
  | "operations_costs"
  | "operations_revenues"
  | "financial_assistance";

type EconomicBalanceDetailsName =
  | OperationsCost["purpose"]
  | SourceRevenue
  | ReinstatementCost["purpose"]
  | FinancialAssistance
  | DevelopmentPlanInstallationCost["purpose"];

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

export const getEconomicBalanceProjectImpacts = createSelector(
  selectCurrentFilter,
  selectImpactsData,
  (currentFilter, impactsData): EconomicBalance => {
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

    if (economicBalance.costs.realEstateTransaction) {
      impacts.push({
        name: "real_estate_transaction",
        value: -economicBalance.costs.realEstateTransaction,
      });
    }

    if (economicBalance.costs.developmentPlanInstallation?.total) {
      impacts.push({
        name: "development_plan_installation",
        value: -economicBalance.costs.developmentPlanInstallation.total,
        details: economicBalance.costs.developmentPlanInstallation.costs.map(
          ({ purpose, amount }) => ({
            value: -amount,
            name: purpose,
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

    return {
      total: economicBalance.total,
      bearer: economicBalance.bearer,
      economicBalance: impacts,
    };
  },
);
