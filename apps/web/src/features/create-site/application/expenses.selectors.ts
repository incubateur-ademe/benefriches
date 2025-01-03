import { createSelector } from "@reduxjs/toolkit";
import { SiteYearlyExpensePurpose, computeEstimatedPropertyTaxesAmount } from "shared";

import { RootState } from "@/app/application/store";

import {
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
  getSiteManagementExpensesBaseConfig,
  getSiteSecurityExpensesBaseConfig,
  SiteManagementYearlyExpensesBaseConfig,
  SiteSecurityYearlyExpensesBaseConfig,
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

type EstimatedSiteYearlyExpensesAmounts = Partial<Record<SiteYearlyExpensePurpose, number>>;
export const selectEstimatedYearlyExpensesForSite = createSelector(
  [selectSiteData, selectSitePopulation],
  (siteData, population): EstimatedSiteYearlyExpensesAmounts => {
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
      maintenance: maintenanceAmount,
      propertyTaxes: propertyTaxesAmount,
      illegalDumpingCost: illegalDumpingCostAmount,
      security: securityAmount,
    };
  },
);

export const selectSiteManagementExpensesBaseConfig = createSelector(
  [selectSiteData],
  (siteData): SiteManagementYearlyExpensesBaseConfig => {
    const hasTenant = !!siteData.isFricheLeased;
    const isOperated = !!siteData.isSiteOperated;

    return getSiteManagementExpensesBaseConfig({
      hasTenant,
      isOperated,
    });
  },
);

export const selectSiteSecurityExpensesBaseConfig = createSelector(
  [selectSiteData],
  (siteData): SiteSecurityYearlyExpensesBaseConfig => {
    const hasTenant = !!siteData.isFricheLeased;
    const hasRecentAccidents = !!siteData.hasRecentAccidents;

    return getSiteSecurityExpensesBaseConfig({
      hasTenant,
      hasRecentAccidents,
    });
  },
);
