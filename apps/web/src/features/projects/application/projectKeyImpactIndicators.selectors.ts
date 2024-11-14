import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/application/store";

import {
  getKeyImpactIndicatorsList,
  getMainKeyImpactIndicators,
  getProjectOverallImpact,
  ProjectOverallImpact,
} from "../domain/projectKeyImpactIndicators";
import { ImpactCategoryFilter } from "./projectImpacts.reducer";

const selectSelf = (state: RootState) => state.projectImpacts;

export const getCategoryFilter = createSelector(
  selectSelf,
  (state): ImpactCategoryFilter => state.currentCategoryFilter,
);

export const getEvaluationPeriod = createSelector(
  selectSelf,
  (state): number => state.evaluationPeriod,
);

export type KeyImpactIndicatorData =
  | {
      name:
        | "taxesIncomesImpact"
        | "localPropertyValueIncrease"
        | "householdsPoweredByRenewableEnergy"
        | "avoidedCo2eqEmissions";
      isSuccess: boolean;
      value: number;
    }
  | {
      name: "nonContaminatedSurfaceArea";
      isSuccess: boolean;
      value: {
        forecastContaminatedSurfaceArea: number;
        decontaminatedSurfaceArea: number;
        percentageEvolution: number;
      };
    }
  | {
      name: "fullTimeJobs" | "permeableSurfaceArea";
      isSuccess: boolean;
      value: { difference: number; percentageEvolution: number };
    }
  | {
      name: "avoidedFricheCostsForLocalAuthority";
      isSuccess: boolean;
      value: { actorName: string; amount: number };
    }
  | {
      name: "projectImpactBalance";
      isSuccess: boolean;
      value: {
        economicBalanceTotal: number;
        socioEconomicMonetaryImpactsTotal: number;
        projectBalance: number;
      };
    }
  | {
      name: "zanCompliance";
      isSuccess: boolean;
      value: {
        isAgriculturalFriche: boolean;
      };
    };

export const getKeyImpactIndicatorsListSelector = createSelector(selectSelf, (state) =>
  getKeyImpactIndicatorsList(state.impactsData, state.relatedSiteData),
);

export const selectMainKeyImpactIndicators = createSelector(
  getKeyImpactIndicatorsListSelector,
  (keyImpactIndicators) => {
    return getMainKeyImpactIndicators(keyImpactIndicators);
  },
);

export const selectProjectOverallImpact = createSelector(
  getKeyImpactIndicatorsListSelector,
  (keyImpactIndicators): ProjectOverallImpact => {
    return getProjectOverallImpact(keyImpactIndicators);
  },
);
