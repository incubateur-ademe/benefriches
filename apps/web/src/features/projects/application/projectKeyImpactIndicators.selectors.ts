import { createSelector } from "@reduxjs/toolkit";
import { isLocalAuthority } from "shared";

import { RootState } from "@/app/application/store";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";

import {
  getMainKeyImpactIndicators,
  getProjectOverallImpact,
  ProjectOverallImpact,
} from "../domain/projectKeyImpactIndicators";
import { convertCarbonToCO2eq } from "../views/shared/convertCarbonToCO2eq";
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

const getRelatedSiteInfos = (
  state: RootState["projectImpacts"],
): { isFriche: boolean; isAgriculturalFriche: boolean } => ({
  isAgriculturalFriche: state.relatedSiteData?.fricheActivity === "AGRICULTURE",
  isFriche: !!state.relatedSiteData?.isFriche,
});

const getProjectImpactBalance = (state: RootState["projectImpacts"]) => {
  const economicBalanceTotal = state.impactsData?.economicBalance.total ?? 0;
  const socioEconomicMonetaryImpactsTotal = state.impactsData?.socioeconomic.total ?? 0;

  return {
    economicBalanceTotal,
    socioEconomicMonetaryImpactsTotal,
    projectBalance: economicBalanceTotal + socioEconomicMonetaryImpactsTotal,
  };
};

const getAvoidedFricheCostsForLocalAuthority = (state: RootState["projectImpacts"]) => {
  const avoidedFricheCosts = state.impactsData?.socioeconomic.impacts.find(
    ({ impact }) => impact === "avoided_friche_costs",
  );

  const siteOwner = state.relatedSiteData?.owner.structureType ?? "";
  const isOwnerLocalAuthority = isLocalAuthority(siteOwner);

  if (!avoidedFricheCosts || !isOwnerLocalAuthority) {
    return undefined;
  }

  return {
    actorName: state.relatedSiteData?.owner.name ?? "",
    amount: avoidedFricheCosts.amount,
  };
};

const getTaxesIncomeImpact = (state: RootState["projectImpacts"]) => {
  const taxesIncomes = state.impactsData?.socioeconomic.impacts.filter(
    ({ impact }) =>
      impact === "taxes_income" ||
      impact === "property_transfer_duties_income" ||
      impact === "local_transfer_duties_increase",
  );

  if (!taxesIncomes || taxesIncomes.length > 0) {
    return undefined;
  }

  return taxesIncomes.reduce((total, { amount }) => total + amount, 0);
};

const getFullTimeJobsImpact = (state: RootState["projectImpacts"]) => {
  if (!state.impactsData?.fullTimeJobs) {
    return undefined;
  }
  const { forecast, current } = state.impactsData.fullTimeJobs;
  const difference = forecast - current;

  return {
    percentageEvolution: getPercentageDifference(current, forecast),
    difference,
  };
};

const getHouseholdsPoweredByRenewableEnergy = (state: RootState["projectImpacts"]) => {
  if (!state.impactsData?.householdsPoweredByRenewableEnergy) {
    return undefined;
  }
  const { forecast, current } = state.impactsData.householdsPoweredByRenewableEnergy;
  const difference = forecast - current;

  return difference;
};

const getAvoidedCo2eqEmissions = (state: RootState["projectImpacts"]) => {
  if (!state.impactsData) {
    return 0;
  }

  const total = [
    state.impactsData.avoidedAirConditioningCo2EqEmissions ?? 0,
    state.impactsData.avoidedCarTrafficCo2EqEmissions ?? 0,
    state.impactsData.avoidedCO2TonsWithEnergyProduction?.forecast ?? 0,
  ].reduce((total, amount) => total + amount, 0);

  if (state.impactsData.soilsCarbonStorage.isSuccess) {
    const base = convertCarbonToCO2eq(state.impactsData.soilsCarbonStorage.current.total);
    const forecast = convertCarbonToCO2eq(state.impactsData.soilsCarbonStorage.forecast.total);
    return total + (forecast - base);
  }

  return total;
};

const getPermeableSurfaceArea = (state: RootState["projectImpacts"]) => {
  if (!state.impactsData?.permeableSurfaceArea) {
    return undefined;
  }
  const { forecast, base } = state.impactsData.permeableSurfaceArea;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    difference: forecast - base,
  };
};

const getNonContaminatedSurfaceArea = (state: RootState["projectImpacts"]) => {
  const siteContaminatedSurfaceArea = state.relatedSiteData?.contaminatedSoilSurface ?? 0;
  const siteSurfaceArea = state.relatedSiteData?.surfaceArea ?? 0;
  const nonContaminatedSurfaceAreaImpact = state.impactsData?.nonContaminatedSurfaceArea;

  if (!nonContaminatedSurfaceAreaImpact || !siteContaminatedSurfaceArea) {
    return undefined;
  }

  const { forecast, current, difference } = nonContaminatedSurfaceAreaImpact;

  return {
    percentageEvolution: getPercentageDifference(current, forecast),
    forecastContaminatedSurfaceArea: siteSurfaceArea - forecast,
    decontaminatedSurfaceArea: difference,
  };
};

const getLocalPropertyValueIncrease = (state: RootState["projectImpacts"]) => {
  const localPropertyValueIncrease = state.impactsData?.socioeconomic.impacts.find(
    ({ impact }) => impact === "local_property_value_increase",
  );
  return localPropertyValueIncrease?.amount;
};

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

export const getKeyImpactIndicatorsList = createSelector(selectSelf, (state) => {
  const { isFriche, isAgriculturalFriche } = getRelatedSiteInfos(state);
  const projectImpactBalance = getProjectImpactBalance(state);
  const avoidedFricheCostsForLocalAuthority = getAvoidedFricheCostsForLocalAuthority(state);
  const taxesIncomesImpact = getTaxesIncomeImpact(state);
  const fullTimeJobs = getFullTimeJobsImpact(state);
  const householdsPoweredByRenewableEnergy = getHouseholdsPoweredByRenewableEnergy(state);
  const avoidedCo2eqEmissions = getAvoidedCo2eqEmissions(state);
  const permeableSurfaceArea = getPermeableSurfaceArea(state);
  const nonContaminatedSurfaceArea = getNonContaminatedSurfaceArea(state);
  const localPropertyValueIncrease = getLocalPropertyValueIncrease(state);

  const impacts: KeyImpactIndicatorData[] = [];

  if (isFriche) {
    impacts.push({
      name: "zanCompliance",
      isSuccess: !isAgriculturalFriche,
      value: {
        isAgriculturalFriche,
      },
    });
  } else if (permeableSurfaceArea && permeableSurfaceArea.difference < 0) {
    impacts.push({
      name: "zanCompliance",
      isSuccess: false,
      value: {
        isAgriculturalFriche,
      },
    });
  }

  impacts.push({
    name: "projectImpactBalance",
    isSuccess: projectImpactBalance.projectBalance > 0,
    value: projectImpactBalance,
  });

  if (avoidedFricheCostsForLocalAuthority) {
    impacts.push({
      name: "avoidedFricheCostsForLocalAuthority",
      isSuccess: avoidedFricheCostsForLocalAuthority.amount > 0,
      value: avoidedFricheCostsForLocalAuthority,
    });
  }

  if (taxesIncomesImpact) {
    impacts.push({
      name: "taxesIncomesImpact",
      isSuccess: taxesIncomesImpact > 0,
      value: taxesIncomesImpact,
    });
  }

  if (localPropertyValueIncrease && localPropertyValueIncrease > 0) {
    impacts.push({
      name: "localPropertyValueIncrease",
      isSuccess: true,
      value: localPropertyValueIncrease,
    });
  }

  if (fullTimeJobs && fullTimeJobs.difference !== 0) {
    impacts.push({
      name: "fullTimeJobs",
      isSuccess: fullTimeJobs.difference > 0,
      value: fullTimeJobs,
    });
  }

  if (householdsPoweredByRenewableEnergy && householdsPoweredByRenewableEnergy > 0) {
    impacts.push({
      name: "householdsPoweredByRenewableEnergy",
      isSuccess: true,
      value: householdsPoweredByRenewableEnergy,
    });
  }

  if (avoidedCo2eqEmissions) {
    impacts.push({
      name: "avoidedCo2eqEmissions",
      isSuccess: avoidedCo2eqEmissions > 0,
      value: avoidedCo2eqEmissions,
    });
  }

  if (permeableSurfaceArea && permeableSurfaceArea.difference > 0) {
    impacts.push({
      name: "permeableSurfaceArea",
      isSuccess: permeableSurfaceArea.difference > 0,
      value: permeableSurfaceArea,
    });
  }

  if (nonContaminatedSurfaceArea) {
    impacts.push({
      name: "nonContaminatedSurfaceArea",
      isSuccess: nonContaminatedSurfaceArea.decontaminatedSurfaceArea > 0,
      value: nonContaminatedSurfaceArea,
    });
  }

  return impacts;
});

export const selectMainKeyImpactIndicators = createSelector(
  getKeyImpactIndicatorsList,
  (keyImpactIndicators) => {
    return getMainKeyImpactIndicators(keyImpactIndicators);
  },
);

export const selectProjectOverallImpact = createSelector(
  getKeyImpactIndicatorsList,
  (keyImpactIndicators): ProjectOverallImpact => {
    return getProjectOverallImpact(keyImpactIndicators);
  },
);
