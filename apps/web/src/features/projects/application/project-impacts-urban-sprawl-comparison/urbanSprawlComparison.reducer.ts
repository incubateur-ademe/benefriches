import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SiteNature } from "shared";

import {
  evaluationPeriodUpdated,
  reconversionProjectImpactsRequested,
} from "../project-impacts/actions";
import {
  fetchUrbanSprawlImpactsComparison,
  UrbanSprawlImpactsComparisonObj,
} from "./fetchUrbanSprawlImpactsComparison.action";

type LoadingState = "idle" | "loading" | "success" | "error";

const DEFAULT_VIEW_MODE = "summary";

export type ViewMode = "charts" | "list" | "summary";

export type UrbanSprawlImpactsComparisonState = {
  dataLoadingState: LoadingState;
  projectData?: UrbanSprawlImpactsComparisonObj["projectData"];
  baseCase?: UrbanSprawlImpactsComparisonObj["baseCase"];
  comparisonCase?: UrbanSprawlImpactsComparisonObj["comparisonCase"];
  evaluationPeriod: number;
  currentViewMode: ViewMode;
  comparisonSiteNature?: SiteNature;
};

const INITIAL_STATE: UrbanSprawlImpactsComparisonState = {
  projectData: undefined,
  baseCase: undefined,
  comparisonCase: undefined,
  dataLoadingState: "idle",
  evaluationPeriod: 50,
  currentViewMode: DEFAULT_VIEW_MODE,
  comparisonSiteNature: undefined,
};

const urbanSprawlImpactsComparisonSlice = createSlice({
  name: "urban-sprawl-impacts-comparison",
  initialState: INITIAL_STATE,
  reducers: {
    setEvaluationPeriod: (state, action: PayloadAction<number>) => {
      state.evaluationPeriod = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.currentViewMode = action.payload;
    },
    setInitialParams: (
      state,
      action: PayloadAction<{ comparisonSiteNature: SiteNature; evaluationPeriod?: number }>,
    ) => {
      state.comparisonSiteNature = action.payload.comparisonSiteNature;
      if (action.payload.evaluationPeriod) {
        state.evaluationPeriod = action.payload.evaluationPeriod;
      }
    },
    setComparisonSiteNature: (state, action: PayloadAction<SiteNature>) => {
      state.comparisonSiteNature = action.payload;
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
    builder.addCase(evaluationPeriodUpdated.fulfilled, (state, action) => {
      state.evaluationPeriod = action.payload.evaluationPeriodInYears;
    });
    builder.addCase(reconversionProjectImpactsRequested.fulfilled, (state, action) => {
      if (state.projectData && action.payload.id !== state.projectData.id) {
        return INITIAL_STATE;
      }
    });
  },
});

export const { setEvaluationPeriod, setViewMode, setInitialParams, setComparisonSiteNature } =
  urbanSprawlImpactsComparisonSlice.actions;

export default urbanSprawlImpactsComparisonSlice.reducer;
