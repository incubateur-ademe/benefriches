import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import type { SiteFeatures } from "./site.types";

const selectSelf = (state: RootState) => state.siteFeatures;

export type SiteFeaturesViewData =
  | { loadingState: "idle" | "loading" | "error"; siteFeatures: undefined }
  | { loadingState: "success"; siteFeatures: SiteFeatures };

export const selectSiteFeaturesViewData = createSelector(
  selectSelf,
  (state): SiteFeaturesViewData => {
    if (state.dataLoadingState === "success" && state.siteData) {
      return {
        loadingState: "success",
        siteFeatures: state.siteData,
      };
    }

    return {
      loadingState: state.dataLoadingState as "idle" | "loading" | "error",
      siteFeatures: undefined,
    };
  },
);
