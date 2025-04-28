import { createSelector } from "@reduxjs/toolkit";
import { SiteYearlyIncome, computeAgriculturalOperationYearlyIncomes } from "shared";

import { RootState } from "@/shared/core/store-config/store";

import { SiteCreationData } from "../siteFoncier.types";

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
