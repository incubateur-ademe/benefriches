import { createSlice } from "@reduxjs/toolkit";
import { Project, ProjectSite } from "../domain/projects.types";
import {
  fetchBaseProjectAndWithProjectData,
  fetchCurrentAndProjectedSoilsCarbonStorage,
} from "./projectImpactsComparison.actions";

import { SoilType } from "@/shared/domain/soils";

type LoadingState = "idle" | "loading" | "success" | "error";

export type SoilsCarbonStorage = {
  totalCarbonStorage: number;
  soilsStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
};

export type ProjectImpactsComparisonState = {
  baseScenario: {
    type?: "STATU_QUO" | "PROJECT";
    id?: string;
    projectData?: Project;
    siteData?: ProjectSite;
    soilsCarbonStorage?: SoilsCarbonStorage;
  };
  withScenario: {
    type?: "PROJECT";
    id?: string;
    projectData?: Project;
    siteData?: ProjectSite;
    soilsCarbonStorage?: SoilsCarbonStorage;
  };
  dataLoadingState: LoadingState;
  carbonStorageDataLoadingState: LoadingState;
};

export const getInitialState = (): ProjectImpactsComparisonState => {
  return {
    baseScenario: {
      id: undefined,
      type: undefined,
      projectData: undefined,
      siteData: undefined,
      soilsCarbonStorage: undefined,
    },
    withScenario: {
      id: undefined,
      type: undefined,
      projectData: undefined,
      siteData: undefined,
      soilsCarbonStorage: undefined,
    },
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
      state.baseScenario = action.payload.baseScenario;
      state.withScenario = action.payload.withScenario;
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
      state.baseScenario.soilsCarbonStorage = action.payload.current;
      state.withScenario.soilsCarbonStorage = action.payload.projected;
    });
    builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.rejected, (state) => {
      state.carbonStorageDataLoadingState = "error";
    });
  },
});

export default projectImpactsComparisonSlice.reducer;
