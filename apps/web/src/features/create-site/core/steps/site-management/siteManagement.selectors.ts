/* eslint-disable no-case-declarations */
import { createSelector } from "@reduxjs/toolkit";
import type { SiteNature, SiteYearlyIncome } from "shared";
import {
  SiteYearlyExpensePurpose,
  computeAgriculturalOperationYearlyExpenses,
  computeAgriculturalOperationYearlyIncomes,
  computeEstimatedPropertyTaxesAmount,
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "shared";

import type { UserStructure } from "@/features/onboarding/core/user";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";
import { RootState } from "@/shared/core/store-config/store";

import type { Owner, Tenant } from "../../siteFoncier.types";
import type { SiteCreationData } from "../../siteFoncier.types";
import {
  selectAvailableLocalAuthoritiesWithoutCurrentOwner,
  selectAvailableLocalAuthoritiesWithoutCurrentUser,
  type AvailableLocalAuthority,
} from "../../siteMunicipalityData.reducer";
import {
  getAgriculturalOperationExpensesConfig,
  getFricheManagementExpensesConfig,
  getFricheSecurityExpensesConfig,
  SiteManagementYearlyExpensesConfig,
  FricheSecurityYearlyExpensesConfig,
} from "./expenses.functions";

const selectSiteCreation = (state: RootState) => state.siteCreation;

const selectSiteData = createSelector(selectSiteCreation, (siteCreation) => siteCreation.siteData);

const selectSiteNature = createSelector(
  selectSiteData,
  (siteData): SiteNature | undefined => siteData.nature,
);

const selectSiteOwner = createSelector(
  selectSiteData,
  (siteData): Owner | undefined => siteData.owner,
);

const selectSiteTenant = createSelector(
  selectSiteData,
  (siteData): Tenant | undefined => siteData.tenant,
);

const selectIsSiteOperated = createSelector(
  selectSiteCreation,
  (state): boolean | undefined => state.siteData.isSiteOperated,
);

// ============================================================================
// Owner / Tenant / Operator ViewData Selectors
// ============================================================================

// Owner Form ViewData
export type SiteOwnerFormViewData = {
  currentUserStructure: UserStructure | undefined;
  siteNature: SiteNature | undefined;
  owner: Owner | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

export const selectSiteOwnerFormViewData = createSelector(
  [
    selectCurrentUserStructure,
    selectSiteNature,
    selectSiteOwner,
    selectAvailableLocalAuthoritiesWithoutCurrentUser,
  ],
  (currentUserStructure, siteNature, owner, localAuthoritiesList): SiteOwnerFormViewData => ({
    currentUserStructure,
    siteNature,
    owner,
    localAuthoritiesList,
  }),
);

// Tenant Form ViewData
export type SiteTenantFormViewData = {
  tenant: Tenant | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

export const selectSiteTenantFormViewData = createSelector(
  [selectSiteTenant, selectAvailableLocalAuthoritiesWithoutCurrentOwner],
  (tenant, localAuthoritiesList): SiteTenantFormViewData => ({
    tenant,
    localAuthoritiesList,
  }),
);

// Site Operator Form ViewData
export type SiteOperatorFormViewData = {
  siteOwner: Owner | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

export const selectSiteOperatorFormViewData = createSelector(
  [selectSiteOwner, selectAvailableLocalAuthoritiesWithoutCurrentOwner],
  (siteOwner, localAuthoritiesList): SiteOperatorFormViewData => ({
    siteOwner,
    localAuthoritiesList,
  }),
);

// Is Site Operated Form ViewData
type IsSiteOperatedFormViewData = {
  isSiteOperated: boolean | undefined;
  siteNature: SiteNature | undefined;
};

export const selectIsSiteOperatedFormViewData = createSelector(
  [selectIsSiteOperated, selectSiteNature],
  (isSiteOperated, siteNature): IsSiteOperatedFormViewData => ({
    isSiteOperated,
    siteNature,
  }),
);

// ============================================================================
// Expenses ViewData Selectors
// ============================================================================

const selectSitePopulation = createSelector(
  (state: RootState) => state.siteMunicipalityData,
  (state): number | undefined => state.population,
);

type EstimatedSiteYearlyExpensesAmounts = Partial<Record<SiteYearlyExpensePurpose, number>>;
const selectEstimatedYearlyExpensesForSite = createSelector(
  [selectSiteData, selectSitePopulation],
  (siteData, population): EstimatedSiteYearlyExpensesAmounts => {
    const {
      soilsDistribution = {},
      surfaceArea,
      nature,
      agriculturalOperationActivity,
      tenant,
      isSiteOperated,
    } = siteData;

    const buildingsSurface = soilsDistribution.BUILDINGS;
    const propertyTaxesAmount = buildingsSurface
      ? computeEstimatedPropertyTaxesAmount(buildingsSurface)
      : undefined;

    switch (nature) {
      case "FRICHE": {
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
      case "AGRICULTURAL_OPERATION": {
        if (!agriculturalOperationActivity || !surfaceArea || !isSiteOperated) {
          return {
            propertyTaxes: propertyTaxesAmount,
          };
        }
        const operationsExpenses = computeAgriculturalOperationYearlyExpenses(
          agriculturalOperationActivity,
          surfaceArea,
          tenant ? "tenant" : "owner",
        );

        return {
          rent: operationsExpenses.find(({ purpose }) => purpose === "rent")?.amount,
          otherOperationsCosts: operationsExpenses.find(
            ({ purpose }) => purpose === "otherOperationsCosts",
          )?.amount,
          taxes: operationsExpenses.find(({ purpose }) => purpose === "taxes")?.amount,
        };
      }
      default:
        return {
          propertyTaxes: propertyTaxesAmount,
        };
    }
  },
);

const selectSiteManagementExpensesConfig = createSelector(
  [selectSiteData],
  (siteData): SiteManagementYearlyExpensesConfig => {
    const hasTenant = !!siteData.tenant;

    switch (siteData.nature) {
      case "FRICHE":
        return getFricheManagementExpensesConfig({
          hasTenant,
        });
      case "AGRICULTURAL_OPERATION":
        const isOperated = !!siteData.isSiteOperated;
        const isOperatedByOwner = isOperated && !hasTenant;
        return getAgriculturalOperationExpensesConfig({
          isOperated,
          isOperatedByOwner,
        });
      default:
        return [];
    }
  },
);

const selectSiteSecurityExpensesConfig = createSelector(
  [selectSiteData],
  (siteData): FricheSecurityYearlyExpensesConfig => {
    if (siteData.nature !== "FRICHE") return [];

    const hasTenant = !!siteData.tenant;
    const hasRecentAccidents = !!siteData.hasRecentAccidents;

    return getFricheSecurityExpensesConfig({
      hasTenant,
      hasRecentAccidents,
    });
  },
);

type SiteYearlyExpensesViewData = {
  siteNature: SiteNature;
  hasTenant: boolean;
  estimatedAmounts: EstimatedSiteYearlyExpensesAmounts;
  managementExpensesConfig: SiteManagementYearlyExpensesConfig;
  securityExpensesConfig: FricheSecurityYearlyExpensesConfig;
  expensesInStore: SiteCreationData["yearlyExpenses"];
};

export const selectSiteYearlyExpensesViewData = createSelector(
  [
    selectSiteData,
    selectEstimatedYearlyExpensesForSite,
    selectSiteManagementExpensesConfig,
    selectSiteSecurityExpensesConfig,
  ],
  (
    siteData,
    estimatedYearlyExpenses,
    managementExpensesConfig,
    securityExpensesConfig,
  ): SiteYearlyExpensesViewData => {
    return {
      siteNature: siteData.nature!,
      hasTenant: !!siteData.tenant,
      estimatedAmounts: estimatedYearlyExpenses,
      managementExpensesConfig,
      securityExpensesConfig,
      expensesInStore: siteData.yearlyExpenses,
    };
  },
);

// ============================================================================
// Income ViewData Selectors
// ============================================================================

export const selectEstimatedYearlyIncomesForSite = createSelector(
  selectSiteData,
  (siteData): SiteYearlyIncome[] => {
    const { surfaceArea, nature, agriculturalOperationActivity, isSiteOperated } = siteData;

    switch (nature) {
      case "AGRICULTURAL_OPERATION": {
        if (!agriculturalOperationActivity || !surfaceArea || !isSiteOperated) {
          return [];
        }

        const operationsIncomes = computeAgriculturalOperationYearlyIncomes(
          agriculturalOperationActivity,
          surfaceArea,
        );

        return operationsIncomes;
      }
      default:
        return [];
    }
  },
);

// ViewData Selector for Yearly Income Form
export type YearlyIncomeFormViewData = {
  incomesInStore: SiteYearlyIncome[];
  estimatedIncomeAmounts: SiteYearlyIncome[];
};

export const selectYearlyIncomeFormViewData = createSelector(
  [selectSiteData, selectEstimatedYearlyIncomesForSite],
  (siteData, estimatedIncomeAmounts): YearlyIncomeFormViewData => ({
    incomesInStore: siteData.yearlyIncomes,
    estimatedIncomeAmounts,
  }),
);
