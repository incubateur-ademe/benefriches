import { createSlice } from "@reduxjs/toolkit";
import {
  CurrentAndProjectedSoilsCarbonStorageResult,
  fetchCurrentAndProjectedSoilsCarbonStorage,
  fetchProjectAndSiteData,
  ProjectDetailsResult,
} from "./projectImpacts.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectImpactsState = {
  projectData?: ProjectDetailsResult["projectData"];
  siteData?: ProjectDetailsResult["siteData"];
  dataLoadingState: LoadingState;
  carbonStorageDataLoadingState: LoadingState;
  currentCarbonStorage?: CurrentAndProjectedSoilsCarbonStorageResult["current"];
  projectedCarbonStorage?: CurrentAndProjectedSoilsCarbonStorageResult["projected"];
};

export const getInitialState = (): ProjectImpactsState => {
  return {
    projectData: undefined,
    siteData: undefined,
    currentCarbonStorage: undefined,
    projectedCarbonStorage: undefined,
    carbonStorageDataLoadingState: "idle",
    dataLoadingState: "idle",
  };
};

export const projectImpactsSlice = createSlice({
  name: "projectImpacts",
  initialState: getInitialState(),
  reducers: {},
  extraReducers(builder) {
    /* fetch project */
    builder.addCase(fetchProjectAndSiteData.pending, (state) => {
      state.dataLoadingState = "loading";
    });
    builder.addCase(fetchProjectAndSiteData.fulfilled, (state, action) => {
      state.dataLoadingState = "success";
      state.projectData = action.payload.projectData;
      state.siteData = action.payload.siteData;
    });
    builder.addCase(fetchProjectAndSiteData.rejected, (state) => {
      state.dataLoadingState = "error";
    });
    /* fetch carbon storage */
    builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.pending, (state) => {
      state.carbonStorageDataLoadingState = "loading";
    });
    builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.fulfilled, (state, action) => {
      state.carbonStorageDataLoadingState = "success";
      state.currentCarbonStorage = action.payload.current;
      state.projectedCarbonStorage = action.payload.projected;
    });
    builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.rejected, (state) => {
      state.carbonStorageDataLoadingState = "error";
    });
  },
});

export default projectImpactsSlice.reducer;
