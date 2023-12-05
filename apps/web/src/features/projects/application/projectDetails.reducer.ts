import { createSlice } from "@reduxjs/toolkit";
import { ProjectDetailsResult } from "../infrastructure/project-details-service/localStorageProjectDetailsApi";
import {
  CurrentAndProjectedSoilsCarbonStorageResult,
  fetchCurrentAndProjectedSoilsCarbonStorage,
  fetchProjectDetails,
} from "./projectDetails.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectDetailsState = {
  projectData?: ProjectDetailsResult["projectData"];
  siteData?: ProjectDetailsResult["siteData"];
  projectDataLoadingState: LoadingState;
  carbonStorageDataLoadingState: LoadingState;
  currentCarbonStorage?: CurrentAndProjectedSoilsCarbonStorageResult["current"];
  projectedCarbonStorage?: CurrentAndProjectedSoilsCarbonStorageResult["projected"];
};

export const getInitialState = (): ProjectDetailsState => {
  return {
    projectData: undefined,
    siteData: undefined,
    currentCarbonStorage: undefined,
    projectedCarbonStorage: undefined,
    carbonStorageDataLoadingState: "idle",
    projectDataLoadingState: "idle",
  };
};

export const projectDetailsSlice = createSlice({
  name: "projectDetails",
  initialState: getInitialState(),
  reducers: {},
  extraReducers(builder) {
    /* fetch project */
    builder.addCase(fetchProjectDetails.pending, (state) => {
      state.projectDataLoadingState = "loading";
    });
    builder.addCase(fetchProjectDetails.fulfilled, (state, action) => {
      state.projectDataLoadingState = "success";
      state.projectData = action.payload.projectData;
      state.siteData = action.payload.siteData;
    });
    builder.addCase(fetchProjectDetails.rejected, (state) => {
      state.projectDataLoadingState = "error";
    });
    /* fetch carbon storage */
    builder.addCase(
      fetchCurrentAndProjectedSoilsCarbonStorage.pending,
      (state) => {
        state.carbonStorageDataLoadingState = "loading";
      },
    );
    builder.addCase(
      fetchCurrentAndProjectedSoilsCarbonStorage.fulfilled,
      (state, action) => {
        state.carbonStorageDataLoadingState = "success";
        state.currentCarbonStorage = action.payload.current;
        state.projectedCarbonStorage = action.payload.projected;
      },
    );
    builder.addCase(
      fetchCurrentAndProjectedSoilsCarbonStorage.rejected,
      (state) => {
        state.carbonStorageDataLoadingState = "error";
      },
    );
  },
});

export default projectDetailsSlice.reducer;
