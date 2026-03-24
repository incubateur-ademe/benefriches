import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import { selectSiteFeaturesViewData } from "@/features/sites/core/siteFeatures.selectors";

const selectSelf = (state: RootState) => state.siteCreation;

type DemoSiteCreationResultViewData = {
  siteId: string;
  siteName: string;
  saveState: "idle" | "loading" | "success" | "error";
};

export const selectDemoSiteCreationResultViewData = createSelector(
  [selectSelf, selectSiteFeaturesViewData],
  (siteCreation, siteFeaturesViewData): DemoSiteCreationResultViewData => ({
    siteId: siteCreation.siteData.id,
    siteName: siteFeaturesViewData.siteFeatures?.name ?? "",
    saveState: siteCreation.demo.saveState,
  }),
);
