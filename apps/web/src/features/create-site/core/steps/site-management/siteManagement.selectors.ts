/* eslint-disable no-case-declarations */
import { createSelector } from "@reduxjs/toolkit";
import type { SiteNature, SiteYearlyIncome } from "shared";
import {
  SiteYearlyExpensePurpose,
  computeAgriculturalOperationYearlyExpenses,
  computeAgriculturalOperationYearlyIncomes,
  computeEstimatedPropertyTaxesAmount,
  computeFricheDefaultYearlyExpenses,
} from "shared";

import { RootState } from "@/app/store/store";
import type { UserStructure } from "@/features/onboarding/core/user";
import { selectCurrentUserStructure } from "@/features/onboarding/core/user.reducer";

import type { createSiteFormRootSelectors } from "../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../selectors/createSite.selectors";
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

// ============================================================================
// Owner / Tenant / Operator ViewData Selectors
// ============================================================================

type SiteOwnerFormViewData = {
  currentUserStructure: UserStructure | undefined;
  siteNature: SiteNature | undefined;
  owner: Owner | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

type SiteTenantFormViewData = {
  tenant: Tenant | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

type SiteOperatorFormViewData = {
  siteOwner: Owner | undefined;
  localAuthoritiesList: AvailableLocalAuthority[];
};

type IsSiteOperatedFormViewData = {
  isSiteOperated: boolean | undefined;
  siteNature: SiteNature | undefined;
};

type EstimatedSiteYearlyExpensesAmounts = Partial<Record<SiteYearlyExpensePurpose, number>>;

type SiteYearlyExpensesViewData = {
  siteNature: SiteNature;
  hasTenant: boolean;
  estimatedAmounts: EstimatedSiteYearlyExpensesAmounts;
  managementExpensesConfig: SiteManagementYearlyExpensesConfig;
  securityExpensesConfig: FricheSecurityYearlyExpensesConfig;
  expensesInStore: SiteCreationData["yearlyExpenses"];
};

type YearlyIncomeFormViewData = {
  incomesInStore: SiteYearlyIncome[];
  estimatedIncomeAmounts: SiteYearlyIncome[];
};

/**
 * `selectAvailableLocalAuthoritiesWithoutCurrentOwner`/`WithoutCurrentUser` are NOT
 * lens-parameterised here (see the ticket-10 planning notes on `siteMunicipalityData.reducer.ts`)
 * — they stay bound to creation's singleton. Low blast radius: it only affects which local
 * authorities are excluded from the OWNER/TENANT dropdowns' "other local authorities" list, not
 * the update wizard's own hydrated owner/tenant. Flagged as a follow-up, not fixed in this
 * ticket.
 */
export const createSiteManagementSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectSiteData = rootSelectors.selectDerivedSiteData;

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
    selectSiteData,
    (siteData): boolean | undefined => siteData.isSiteOperated,
  );

  const selectSiteOwnerFormViewData = createSelector(
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

  const selectSiteTenantFormViewData = createSelector(
    [selectSiteTenant, selectAvailableLocalAuthoritiesWithoutCurrentOwner],
    (tenant, localAuthoritiesList): SiteTenantFormViewData => ({
      tenant,
      localAuthoritiesList,
    }),
  );

  const selectSiteOperatorFormViewData = createSelector(
    [selectSiteOwner, selectAvailableLocalAuthoritiesWithoutCurrentOwner],
    (siteOwner, localAuthoritiesList): SiteOperatorFormViewData => ({
      siteOwner,
      localAuthoritiesList,
    }),
  );

  const selectIsSiteOperatedFormViewData = createSelector(
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

  const selectSiteIsRural = createSelector(
    (state: RootState) => state.siteMunicipalityData,
    (state): boolean | undefined => state.isRural,
  );

  const selectEstimatedYearlyExpensesForSite = createSelector(
    [selectSiteData, selectSitePopulation, selectSiteIsRural],
    (siteData, population, isRural): EstimatedSiteYearlyExpensesAmounts => {
      const {
        soilsDistribution = {},
        surfaceArea,
        nature,
        agriculturalOperationActivity,
        tenant,
        isSiteOperated,
      } = siteData;

      const buildingsSurface = soilsDistribution.BUILDINGS;
      const propertyTaxesOnlyAmounts: EstimatedSiteYearlyExpensesAmounts = {
        propertyTaxes: buildingsSurface
          ? computeEstimatedPropertyTaxesAmount(buildingsSurface)
          : undefined,
      };

      switch (nature) {
        case "FRICHE": {
          const expenses = computeFricheDefaultYearlyExpenses({
            surfaceArea: surfaceArea ?? 0,
            cityPopulation: population ?? 0,
            buildingsSurface,
            isCityInRuralZone: isRural ?? false,
          });

          return Object.fromEntries(expenses.map(({ purpose, amount }) => [purpose, amount]));
        }
        case "AGRICULTURAL_OPERATION": {
          if (!agriculturalOperationActivity || !surfaceArea || !isSiteOperated) {
            return propertyTaxesOnlyAmounts;
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
          return propertyTaxesOnlyAmounts;
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

  const selectSiteYearlyExpensesViewData = createSelector(
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

  const selectEstimatedYearlyIncomesForSite = createSelector(
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

  const selectYearlyIncomeFormViewData = createSelector(
    [selectSiteData, selectEstimatedYearlyIncomesForSite],
    (siteData, estimatedIncomeAmounts): YearlyIncomeFormViewData => ({
      incomesInStore: siteData.yearlyIncomes,
      estimatedIncomeAmounts,
    }),
  );

  return {
    selectSiteOwnerFormViewData,
    selectSiteTenantFormViewData,
    selectSiteOperatorFormViewData,
    selectIsSiteOperatedFormViewData,
    selectSiteYearlyExpensesViewData,
    selectYearlyIncomeFormViewData,
    selectSiteIsRural,
  };
};

export const {
  selectSiteOwnerFormViewData,
  selectSiteTenantFormViewData,
  selectSiteOperatorFormViewData,
  selectIsSiteOperatedFormViewData,
  selectSiteYearlyExpensesViewData,
  selectYearlyIncomeFormViewData,
  selectSiteIsRural,
} = createSiteManagementSelectors(siteCreationRootSelectors);
