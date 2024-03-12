import { createSlice } from "@reduxjs/toolkit";
import {
  fetchReconversionProjectImpacts,
  ReconversionProjectImpactsResult,
} from "./fetchReconversionProjectImpacts.action";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectImpactsState = {
  dataLoadingState: LoadingState;
  projectData?: {
    id: string;
    name: string;
    relatedSiteId: string;
    relatedSiteName: string;
  };
  impactsData?: ReconversionProjectImpactsResult["impacts"];
};

export const getInitialState = (): ProjectImpactsState => {
  return {
    impactsData: undefined,
    projectData: undefined,
    dataLoadingState: "idle",
  };
};

export const projectImpactsSlice = createSlice({
  name: "projectImpacts",
  initialState: getInitialState(),
  reducers: {},
  extraReducers(builder) {
    /* fetch reconversion project impacts */
    builder.addCase(fetchReconversionProjectImpacts.pending, (state) => {
      state.dataLoadingState = "loading";
    });
    builder.addCase(fetchReconversionProjectImpacts.fulfilled, (state, action) => {
      state.dataLoadingState = "success";
      state.impactsData = action.payload.impacts;
      state.projectData = {
        id: action.payload.id,
        name: action.payload.name,
        relatedSiteId: action.payload.relatedSiteId,
        relatedSiteName: action.payload.relatedSiteName,
      };
    });
    builder.addCase(fetchReconversionProjectImpacts.rejected, (state) => {
      state.dataLoadingState = "error";
    });
  },
});

export default projectImpactsSlice.reducer;
