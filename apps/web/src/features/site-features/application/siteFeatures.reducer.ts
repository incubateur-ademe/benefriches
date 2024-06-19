import { createSelector, createSlice } from "@reduxjs/toolkit";
import { SiteFeatures } from "../domain/siteFeatures";
import { fetchSiteFeatures } from "./fetchSiteFeatures.action";

import { RootState } from "@/app/application/store";

type LoadingState = "idle" | "loading" | "success" | "error";

export type SiteFeaturesState = {
  dataLoadingState: LoadingState;
  siteData?: SiteFeatures;
};

export const getInitialState = (): SiteFeaturesState => {
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
