import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import {
  getKeyImpactIndicatorsList,
  getMainKeyImpactIndicators,
  getProjectOverallImpact,
  ProjectOverallImpact,
} from "../../domain/projectKeyImpactIndicators";

const selectSelf = (state: RootState) => state.projectImpacts;

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
