/* eslint-disable no-case-declarations */
import { createSelector } from "@reduxjs/toolkit";
import {
  SiteNature,
  SiteYearlyExpensePurpose,
  computeEstimatedPropertyTaxesAmount,
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "shared";

import { RootState } from "@/shared/core/store-config/store";

import {
  getAgriculturalOperationExpensesBaseConfig,
  getFricheManagementExpensesBaseConfig,
  getFricheSecurityExpensesBaseConfig,
  SiteManagementYearlyExpensesBaseConfig,
  FricheSecurityYearlyExpensesBaseConfig,
} from "../expenses.functions";
import { SiteCreationData } from "../siteFoncier.types";

const selectSiteData = createSelector(
  (state: RootState) => state.siteCreation,
  (state): SiteCreationData => state.siteData,
);
const selectSitePopulation = createSelector(
  (state: RootState) => state.siteMunicipalityData,
  (state): number | undefined => state.population,
);

type EstimatedSiteYearlyExpensesAmounts = Partial<Record<SiteYearlyExpensePurpose, number>>;
export const selectEstimatedYearlyExpensesForSite = createSelector(
  [selectSiteData, selectSitePopulation],
  (siteData, population): EstimatedSiteYearlyExpensesAmounts => {
    const { soilsDistribution = {}, surfaceArea, nature } = siteData;

    const buildingsSurface = soilsDistribution.BUILDINGS;
    const propertyTaxesAmount = buildingsSurface
      ? computeEstimatedPropertyTaxesAmount(buildingsSurface)
      : undefined;

    if (nature === "FRICHE") {
      const maintenanceAmount = buildingsSurface
        ? computeMaintenanceDefaultCost(buildingsSurface)
        : undefined;
      const illegalDumpingCostAmount = population
        ? computeIllegalDumpingDefaultCost(population)
        : undefined;
      const securityAmount = surfaceArea ? computeSecurityDefaultCost(surfaceArea) : undefined;

      return {
        maintenance: maintenanceAmount,
        propertyTaxes: propertyTaxesAmount,
        illegalDumpingCost: illegalDumpingCostAmount,
        security: securityAmount,
      };
    }

    return {
      propertyTaxes: propertyTaxesAmount,
    };
  },
);

type SiteYearlyExpensesViewData = {
  siteNature: SiteNature;
  hasTenant: boolean;
  estimatedAmounts: EstimatedSiteYearlyExpensesAmounts;
};

export const selectSiteYearlyExpensesViewData = createSelector(
  [selectSiteData, selectEstimatedYearlyExpensesForSite],
  (siteData, estimatedYearlyExpenses): SiteYearlyExpensesViewData => {
    return {
      siteNature: siteData.nature!,
      hasTenant: !!siteData.tenant,
      estimatedAmounts: estimatedYearlyExpenses,
    };
  },
);

export const selectSiteManagementExpensesBaseConfig = createSelector(
  [selectSiteData],
  (siteData): SiteManagementYearlyExpensesBaseConfig => {
    const hasTenant = !!siteData.tenant;

    switch (siteData.nature) {
      case "FRICHE":
        return getFricheManagementExpensesBaseConfig({
          hasTenant,
        });
      case "AGRICULTURAL_OPERATION":
        const isOperated = !!siteData.isSiteOperated;
        const isOperatedByOwner = isOperated && !hasTenant;
        return getAgriculturalOperationExpensesBaseConfig({
          isOperated,
          isOperatedByOwner,
        });
      default:
        return [];
    }
  },
);

export const selectSiteSecurityExpensesBaseConfig = createSelector(
  [selectSiteData],
  (siteData): FricheSecurityYearlyExpensesBaseConfig => {
    if (siteData.nature !== "FRICHE") return [];

    const hasTenant = !!siteData.tenant;
    const hasRecentAccidents = !!siteData.hasRecentAccidents;

    return getFricheSecurityExpensesBaseConfig({
      hasTenant,
      hasRecentAccidents,
    });
  },
);
