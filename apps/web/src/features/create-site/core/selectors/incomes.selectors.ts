import { createSelector } from "@reduxjs/toolkit";
import type { SiteYearlyIncome } from "shared";
import { computeAgriculturalOperationYearlyIncomes } from "shared";

import { RootState } from "@/shared/core/store-config/store";

import type { SiteCreationData } from "../siteFoncier.types";

const selectSiteData = createSelector(
  (state: RootState) => state.siteCreation,
  (state): SiteCreationData => state.siteData,
);

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
