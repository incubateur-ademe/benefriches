import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SoilType } from "shared";
import {
  fetchReconversionProjectImpacts,
  ReconversionProjectImpactsResult,
} from "./fetchReconversionProjectImpacts.action";

type LoadingState = "idle" | "loading" | "success" | "error";

const DEFAULT_EVALUATION_PERIOD_IN_YEARS = 10;
const DEFAULT_VIEW_MODE = "charts";
const DEFAULT_CATEGORY_FILTER = "all";

export type SoilsDistribution = Partial<Record<SoilType, number>>;

type ImpactCategory = "economic" | "environment" | "social";
export type ImpactCategoryFilter = ImpactCategory | "all";
export type ViewMode = "charts" | "list";

export type ProjectImpactsState = {
  dataLoadingState: LoadingState;
  projectData?: {
    id: string;
    name: string;
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: 0;
    developmentPlan: {
      surfaceArea?: number;
      electricalPowerKWc?: number;
    };
  };
  relatedSiteData?: {
    id: string;
    name: string;
    addressLabel: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
  };
  impactsData?: ReconversionProjectImpactsResult["impacts"];
  evaluationPeriod: number;
  currentViewMode: ViewMode;
  currentCategoryFilter: ImpactCategoryFilter;
};

export const getInitialState = (): ProjectImpactsState => {
  return {
    impactsData: undefined,
    projectData: undefined,
    relatedSiteData: undefined,
    dataLoadingState: "idle",
    evaluationPeriod: DEFAULT_EVALUATION_PERIOD_IN_YEARS,
    currentViewMode: DEFAULT_VIEW_MODE,
    currentCategoryFilter: DEFAULT_CATEGORY_FILTER,
  };
};

export const projectImpactsSlice = createSlice({
  name: "projectImpacts",
  initialState: getInitialState(),
  reducers: {
    setEvaluationPeriod: (state, action: PayloadAction<number>) => {
      state.evaluationPeriod = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.currentViewMode = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<ImpactCategoryFilter>) => {
      state.currentCategoryFilter = action.payload;
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

export const { setEvaluationPeriod, setCategoryFilter, setViewMode } = projectImpactsSlice.actions;

export default projectImpactsSlice.reducer;
