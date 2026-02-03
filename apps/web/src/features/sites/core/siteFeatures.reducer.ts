import { createReducer } from "@reduxjs/toolkit";

import { fetchSiteFeatures } from "./fetchSiteFeatures.action";
import { SiteFeatures } from "./site.types";

type LoadingState = "idle" | "loading" | "success" | "error";

type SiteFeaturesState = {
  dataLoadingState: LoadingState;
  siteData?: SiteFeatures;
};

const getInitialState = (): SiteFeaturesState => {
  return {
    dataLoadingState: "idle",
    siteData: undefined,
  };
};

const siteFeaturesReducer = createReducer(getInitialState(), (builder) => {
  builder
    .addCase(fetchSiteFeatures.pending, (state) => {
      state.dataLoadingState = "loading";
    })
    .addCase(fetchSiteFeatures.fulfilled, (state, action) => {
      state.dataLoadingState = "success";
      state.siteData = action.payload;
    })
    .addCase(fetchSiteFeatures.rejected, (state) => {
      state.dataLoadingState = "error";
    });
});

export default siteFeaturesReducer;
