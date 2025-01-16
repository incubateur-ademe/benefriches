import { createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { fetchSiteFeatures } from "./fetchSiteFeatures.action";
import { SiteFeatures } from "./siteFeatures";

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

const siteFeatures = createSlice({
  name: "siteFeatures",
  initialState: getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchSiteFeatures.pending, (state) => {
      state.dataLoadingState = "loading";
    });
    builder.addCase(fetchSiteFeatures.fulfilled, (state, action) => {
      state.dataLoadingState = "success";
      state.siteData = action.payload;
    });
    builder.addCase(fetchSiteFeatures.rejected, (state) => {
      state.dataLoadingState = "error";
    });
  },
});

const selectSelf = (state: RootState) => state.siteFeatures;
export const selectLoadingState = createSelector(selectSelf, (state) => state.dataLoadingState);
export const selectSiteFeatures = createSelector(selectSelf, (state) => state.siteData);

export default siteFeatures.reducer;
