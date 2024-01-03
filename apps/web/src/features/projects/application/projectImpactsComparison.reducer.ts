import { createSlice } from "@reduxjs/toolkit";
import {
  CurrentAndProjectedSoilsCarbonStorageResult,
  fetchBaseProjectAndWithProjectData,
  fetchCurrentAndProjectedSoilsCarbonStorage,
  ProjectDetailsResult,
} from "./projectImpactsComparison.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectImpactsComparisonState = {
  baseProjectId?: string;
  withProject?: string;
  projectData?: ProjectDetailsResult["projectData"];
  otherProjectData?: ProjectDetailsResult["projectData"];
  siteData?: ProjectDetailsResult["siteData"];
  dataLoadingState: LoadingState;
  carbonStorageDataLoadingState: LoadingState;
  currentCarbonStorage?: CurrentAndProjectedSoilsCarbonStorageResult["current"];
  projectedCarbonStorage?: CurrentAndProjectedSoilsCarbonStorageResult["projected"];
};

export const getInitialState = (): ProjectImpactsComparisonState => {
  return {
    baseProjectId: undefined,
    withProject: undefined,
    projectData: undefined,
    otherProjectData: undefined,
    siteData: undefined,
    currentCarbonStorage: undefined,
    projectedCarbonStorage: undefined,
    carbonStorageDataLoadingState: "idle",
    dataLoadingState: "idle",
  };
};

export const projectImpactsComparisonSlice = createSlice({
  name: "projectImpactsComparison",
  initialState: getInitialState(),
  reducers: {},
  extraReducers(builder) {
    /* fetch project */
    builder.addCase(fetchBaseProjectAndWithProjectData.pending, (state) => {
      state.dataLoadingState = "loading";
    });
    builder.addCase(fetchBaseProjectAndWithProjectData.fulfilled, (state, action) => {
      state.dataLoadingState = "success";
      state.projectData = action.payload.projectData;
      state.siteData = action.payload.siteData;
      state.otherProjectData = action.payload.otherProjectData;
      state.baseProjectId = action.payload.baseProjectId;
      state.withProject = action.payload.withProject;
    });
    builder.addCase(fetchBaseProjectAndWithProjectData.rejected, (state) => {
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

export default projectImpactsComparisonSlice.reducer;
