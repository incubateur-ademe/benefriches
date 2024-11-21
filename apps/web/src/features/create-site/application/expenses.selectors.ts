import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/application/store";

import {
  computeEstimatedPropertyTaxesAmount,
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "../domain/expenses.functions";
import { SiteDraft } from "../domain/siteFoncier.types";

const selectSiteData = createSelector(
  (state: RootState) => state.siteCreation,
  (state): Partial<SiteDraft> => state.siteData,
);
const selectSitePopulation = createSelector(
  (state: RootState) => state.siteMunicipalityData,
  (state): number | undefined => state.population,
);

export type EstimatedSiteYearlyExpenses = {
  illegalDumpingCostAmount?: number;
  securityAmount?: number;
  maintenanceAmount?: number;
  propertyTaxesAmount?: number;
};
export const selectEstimatedYearlyExpensesForSite = createSelector(
  selectSiteData,
  selectSitePopulation,
  (siteData, population): EstimatedSiteYearlyExpenses => {
    const { soilsDistribution = {}, surfaceArea, isFriche } = siteData;
    const buildingsSurface = soilsDistribution.BUILDINGS;
    const maintenanceAmount = buildingsSurface
      ? computeMaintenanceDefaultCost(buildingsSurface)
      : undefined;
    const propertyTaxesAmount = buildingsSurface
      ? computeEstimatedPropertyTaxesAmount(buildingsSurface)
      : undefined;
    const illegalDumpingCostAmount =
      isFriche && population ? computeIllegalDumpingDefaultCost(population) : undefined;
    const securityAmount = surfaceArea ? computeSecurityDefaultCost(surfaceArea) : undefined;

    return {
      maintenanceAmount,
      propertyTaxesAmount,
      illegalDumpingCostAmount,
      securityAmount,
    };
  },
);
