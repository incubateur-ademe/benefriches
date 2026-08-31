import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";

import { selectDerivedSiteData } from "../../selectors/createSite.selectors";

const selectSelf = (state: RootState) => state.siteCreation;

// Creation Result ViewData
type SiteCreationResultViewData = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

export const selectSiteCreationResultViewData = createSelector(
  [selectSelf, selectDerivedSiteData],
  (siteCreation, siteData): SiteCreationResultViewData => ({
    siteId: siteData.id,
    siteName: siteData.name ?? "",
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
    siteId: siteCreation.initialSiteData.id,
    saveLoadingState: siteCreation.saveLoadingState,
  }),
);
