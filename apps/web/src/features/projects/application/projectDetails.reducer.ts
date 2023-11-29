import { createSlice } from "@reduxjs/toolkit";
import { ProjectDetailsResult } from "../infrastructure/project-details-service/localStorageProjectDetailsApi";
import { fetchProjectDetails } from "./projectDetails.actions";

import {
  fetchCarbonStorageForSiteAndProjectSoils,
  ProjectAndSiteSoilsCarbonStorageResult,
} from "@/shared/application/actions/soilsCarbonStorage.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectCreationState = {
  projectData?: ProjectDetailsResult["projectData"];
  siteData?: ProjectDetailsResult["siteData"];
  projectDataLoadingState: LoadingState;
  carbonStorageDataLoadingState: LoadingState;
  siteCarbonStorage?: ProjectAndSiteSoilsCarbonStorageResult["siteCarbonStorage"];
  projectCarbonStorage?: ProjectAndSiteSoilsCarbonStorageResult["projectCarbonStorage"];
};

export const getInitialState = (): ProjectCreationState => {
  return {
    projectData: undefined,
    siteData: undefined,
    siteCarbonStorage: undefined,
    projectCarbonStorage: undefined,
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
      fetchCarbonStorageForSiteAndProjectSoils.pending,
      (state) => {
        state.carbonStorageDataLoadingState = "loading";
      },
    );
    builder.addCase(
      fetchCarbonStorageForSiteAndProjectSoils.fulfilled,
      (state, action) => {
        state.carbonStorageDataLoadingState = "success";
        state.siteCarbonStorage = action.payload.siteCarbonStorage;
        state.projectCarbonStorage = action.payload.projectCarbonStorage;
      },
    );
    builder.addCase(
      fetchCarbonStorageForSiteAndProjectSoils.rejected,
      (state) => {
        state.carbonStorageDataLoadingState = "error";
      },
    );
  },
});

export default projectDetailsSlice.reducer;
