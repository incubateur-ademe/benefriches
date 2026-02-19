import { createSelector } from "@reduxjs/toolkit";

import { selectSiteFeaturesViewData } from "@/features/sites/core/siteFeatures.selectors";
import { RootState } from "@/shared/core/store-config/store";

const selectSelf = (state: RootState) => state.siteCreation;

// Creation Result ViewData
type SiteCreationResultViewData = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

export const selectSiteCreationResultViewData = createSelector(
  [selectSelf, selectSiteFeaturesViewData],
  (siteCreation, siteFeaturesViewData): SiteCreationResultViewData => ({
    siteId: siteCreation.siteData.id,
    siteName: siteFeaturesViewData.siteFeatures?.name ?? "",
    loadingState: siteCreation.saveLoadingState,
  }),
);

// Express Result ViewData
type ExpressResultViewData = {
  siteId: string;
  saveLoadingState: "idle" | "loading" | "success" | "error";
};

export const selectExpressResultViewData = createSelector(
  selectSelf,
  (siteCreation): ExpressResultViewData => ({
    siteId: siteCreation.siteData.id,
    saveLoadingState: siteCreation.saveLoadingState,
  }),
);
