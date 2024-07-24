import { createSelector } from "@reduxjs/toolkit";
import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "../domain/expenses.functions";
import { SiteDraft } from "../domain/siteFoncier.types";

import { RootState } from "@/app/application/store";

const selectSiteData = createSelector(
  (state: RootState) => state.siteCreation,
  (state): Partial<SiteDraft> => state.siteData,
);
const selectSitePopulation = createSelector(
  (state: RootState) => state.siteMunicipalityData,
  (state): number | undefined => state.population,
);

export const getDefaultValuesForYearlyExpenses = createSelector(
  selectSiteData,
  selectSitePopulation,
  (
    siteData,
    population,
  ): { illegalDumpingCostAmount?: number; securityAmount?: number; maintenanceAmount?: number } => {
    const { soilsDistribution = {}, surfaceArea, isFriche } = siteData;
    const buildingsSurface = soilsDistribution.BUILDINGS;
    const maintenance = buildingsSurface
      ? computeMaintenanceDefaultCost(buildingsSurface)
      : undefined;

    if (isFriche) {
      const illegalDumpingCost = population
        ? computeIllegalDumpingDefaultCost(population)
        : undefined;
      const security = surfaceArea ? computeSecurityDefaultCost(surfaceArea) : undefined;

      return {
        illegalDumpingCostAmount: illegalDumpingCost,
        securityAmount: security,
        maintenanceAmount: maintenance,
      };
    }
    return {
      maintenanceAmount: maintenance,
    };
  },
);
