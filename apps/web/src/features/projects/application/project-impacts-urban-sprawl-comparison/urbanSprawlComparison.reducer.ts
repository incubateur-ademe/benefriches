import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReconversionProjectImpacts } from "shared";

import { ProjectFeatures } from "../../domain/projects.types";
import {
  fetchUrbanSprawlImpactsComparison,
  SiteData,
} from "./fetchUrbanSprawlImpactsComparison.action";

type LoadingState = "idle" | "loading" | "success" | "error";

const DEFAULT_EVALUATION_PERIOD_IN_YEARS = 20;
const DEFAULT_VIEW_MODE = "summary";

export type ViewMode = "charts" | "list" | "summary";

type ProjectData = ProjectFeatures;

export type UrbanSprawlImpactsComparisonState = {
  dataLoadingState: LoadingState;
  projectData?: ProjectData;
  baseCase?: {
    siteData: SiteData;
    impacts: ReconversionProjectImpacts;
  };
  comparisonCase?: {
    siteData: SiteData;
    impacts: ReconversionProjectImpacts;
  };
  evaluationPeriod: number;
  currentViewMode: ViewMode;
};

const getInitialState = (): UrbanSprawlImpactsComparisonState => {
  return {
    projectData: undefined,
    baseCase: undefined,
    comparisonCase: undefined,
    dataLoadingState: "idle",
    evaluationPeriod: DEFAULT_EVALUATION_PERIOD_IN_YEARS,
    currentViewMode: DEFAULT_VIEW_MODE,
  };
};

const urbanSprawlImpactsComparisonSlice = createSlice({
  name: "urban-sprawl-impacts-comparison",
  initialState: getInitialState(),
  reducers: {
    setEvaluationPeriod: (state, action: PayloadAction<number>) => {
      state.evaluationPeriod = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.currentViewMode = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUrbanSprawlImpactsComparison.pending, (state) => {
      state.dataLoadingState = "loading";
    });
    builder.addCase(fetchUrbanSprawlImpactsComparison.fulfilled, (state, action) => {
      state.dataLoadingState = "success";
      state.baseCase = action.payload.baseCase;
      state.projectData = action.payload.projectData;
      state.comparisonCase = action.payload.comparisonCase;
    });
    builder.addCase(fetchUrbanSprawlImpactsComparison.rejected, (state) => {
      state.dataLoadingState = "error";
    });
  },
});

export const { setEvaluationPeriod, setViewMode } = urbanSprawlImpactsComparisonSlice.actions;

export default urbanSprawlImpactsComparisonSlice.reducer;
