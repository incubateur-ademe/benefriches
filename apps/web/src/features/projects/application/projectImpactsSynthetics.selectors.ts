import { createSelector } from "@reduxjs/toolkit";
import { convertCarbonToCO2eq } from "../views/shared/convertCarbonToCO2eq";
import { ImpactCategoryFilter } from "./projectImpacts.reducer";

import { RootState } from "@/app/application/store";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";

const selectSelf = (state: RootState) => state.projectImpacts;

export const getCategoryFilter = createSelector(
  selectSelf,
  (state): ImpactCategoryFilter => state.currentCategoryFilter,
);

export const getRelatedSiteInfos = createSelector(
  selectSelf,
  (state): { isFriche: boolean; isAgriculturalFriche: boolean } => ({
    isAgriculturalFriche: state.relatedSiteData?.fricheActivity === "AGRICULTURE",
    isFriche: !!state.relatedSiteData?.isFriche,
  }),
);

export const getProjectImpactBalance = createSelector(selectSelf, (state) => {
  const economicBalanceTotal = state.impactsData?.economicBalance.total ?? 0;
  const socioEconomicMonetaryImpactsTotal = state.impactsData?.socioeconomic.total ?? 0;

  return {
    economicBalanceTotal,
    socioEconomicMonetaryImpactsTotal,
    projectBalance: economicBalanceTotal + socioEconomicMonetaryImpactsTotal,
  };
});

export const getAvoidedFricheCostsForLocalAuthority = createSelector(selectSelf, (state) => {
  const avoidedFricheCosts = state.impactsData?.socioeconomic.impacts.find(
    ({ impact }) => impact === "avoided_friche_costs",
  );

  const siteOwner = state.relatedSiteData?.owner.structureType ?? "";
  const isOwnerLocalAuthority = ["municipality", "epci", "region", "department"].includes(
    siteOwner,
  );

  if (!avoidedFricheCosts || !isOwnerLocalAuthority) {
    return undefined;
  }

  return {
    actorName: state.relatedSiteData?.owner.name ?? "",
    amount: avoidedFricheCosts.amount,
  };
});

export const getTaxesIncomeImpact = createSelector(selectSelf, (state) => {
  const taxesIncomes = state.impactsData?.socioeconomic.impacts.filter(
    ({ impact }) => impact === "taxes_income" || impact === "property_transfer_duties_income",
  );

  if (!taxesIncomes || taxesIncomes.length > 0) {
    return undefined;
  }

  return taxesIncomes.reduce((total, { amount }) => total + amount, 0);
});

export const getFullTimeJobsImpact = createSelector(selectSelf, (state) => {
  const { forecast = 0, current = 0 } = state.impactsData?.fullTimeJobs ?? {};
  const difference = forecast - current;

  return {
    percentageEvolution: getPercentageDifference(current, forecast),
    value: difference,
  };
});

export const getHouseholdsPoweredByRenewableEnergy = createSelector(selectSelf, (state) => {
  if (!state.impactsData?.householdsPoweredByRenewableEnergy) {
    return undefined;
  }
  const { forecast, current } = state.impactsData.householdsPoweredByRenewableEnergy;
  const difference = forecast - current;

  return difference;
});

export const getAvoidedCo2eqEmissions = createSelector(selectSelf, (state) => {
  const avoidedCo2eqEmissions =
    state.impactsData?.socioeconomic.impacts.filter(
      ({ impact }) =>
        impact === "avoided_co2_eq_with_enr" ||
        impact === "avoided_traffic_co2_eq_emissions" ||
        impact === "avoided_air_conditioning_co2_eq_emissions",
    ) ?? [];

  const total = avoidedCo2eqEmissions.reduce((total, { amount }) => total + amount, 0);

  if (state.impactsData?.soilsCarbonStorage) {
    const base = convertCarbonToCO2eq(state.impactsData.soilsCarbonStorage.current.total);
    const forecast = convertCarbonToCO2eq(state.impactsData.soilsCarbonStorage.forecast.total);

    return total + (forecast - base);
  }

  return total;
});

export const getPermeableSurfaceArea = createSelector(selectSelf, (state) => {
  if (!state.impactsData?.permeableSurfaceArea) {
    return undefined;
  }
  const { forecast, base } = state.impactsData.permeableSurfaceArea;

  return {
    percentageEvolution: getPercentageDifference(base, forecast),
    value: forecast - base,
  };
});

export const getNonContaminatedSurfaceArea = createSelector(selectSelf, (state) => {
  if (!state.impactsData?.nonContaminatedSurfaceArea) {
    return undefined;
  }
  const { forecast, current, difference } = state.impactsData.nonContaminatedSurfaceArea;

  return {
    percentageEvolution: getPercentageDifference(current, forecast),
    value: difference,
  };
});

export const getLocalPropertyValueIncrease = createSelector(selectSelf, (state) => {
  const localPropertyValueIncrease = state.impactsData?.socioeconomic.impacts.find(
    ({ impact }) => impact === "local_property_value_increase",
  );
  return localPropertyValueIncrease?.amount;
});
