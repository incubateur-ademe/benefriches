import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchReconversionProjectImpacts,
  ReconversionProjectImpactsResult,
} from "./fetchReconversionProjectImpacts.action";

import { SoilType } from "@/shared/domain/soils";

type LoadingState = "idle" | "loading" | "success" | "error";

const DEFAULT_EVALUATION_PERIOD_IN_YEARS = 10;

export type SoilsDistribution = Partial<Record<SoilType, number>>;

export type ProjectImpactsState = {
  dataLoadingState: LoadingState;
  projectData?: {
    id: string;
    name: string;
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: 0;
  };
  relatedSiteData?: {
    id: string;
    name: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
  };
  impactsData?: ReconversionProjectImpactsResult["impacts"];
  evaluationPeriod: number;
};

export const getInitialState = (): ProjectImpactsState => {
  return {
    impactsData: undefined,
    projectData: undefined,
    relatedSiteData: undefined,
    dataLoadingState: "idle",
    evaluationPeriod: DEFAULT_EVALUATION_PERIOD_IN_YEARS,
  };
};

export const projectImpactsSlice = createSlice({
  name: "projectImpacts",
  initialState: getInitialState(),
  reducers: {
    setEvaluationPeriod: (state, action: PayloadAction<number>) => {
      state.evaluationPeriod = action.payload;
    },
  },
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
        ...action.payload.projectData,
      };
      state.relatedSiteData = {
        id: action.payload.relatedSiteId,
        name: action.payload.relatedSiteName,
        ...action.payload.siteData,
      };
    });
    builder.addCase(fetchReconversionProjectImpacts.rejected, (state) => {
      state.dataLoadingState = "error";
    });
  },
});

export const { setEvaluationPeriod } = projectImpactsSlice.actions;

export default projectImpactsSlice.reducer;
