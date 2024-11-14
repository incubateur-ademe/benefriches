import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FricheActivity, SoilsDistribution } from "shared";

import { RootState } from "@/app/application/store";

import { ProjectDevelopmentPlanType } from "../domain/projects.types";
import {
  fetchReconversionProjectImpacts,
  ReconversionProjectImpactsResult,
} from "./fetchReconversionProjectImpacts.action";

type LoadingState = "idle" | "loading" | "success" | "error";

const DEFAULT_EVALUATION_PERIOD_IN_YEARS = 20;
const DEFAULT_VIEW_MODE = "summary";
const DEFAULT_CATEGORY_FILTER = "all";

type ImpactCategory = "economic" | "environment" | "social";
export type ImpactCategoryFilter = ImpactCategory | "all";
export type ViewMode = "charts" | "list" | "summary";

export type ProjectImpactsState = {
  dataLoadingState: LoadingState;
  projectData?: {
    id: string;
    name: string;
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: number;
    isExpressProject: boolean;
    developmentPlan:
      | {
          type: "PHOTOVOLTAIC_POWER_PLANT";
          electricalPowerKWc: number;
          surfaceArea: number;
        }
      | {
          type: "URBAN_PROJECT";
          buildingsFloorAreaDistribution: {
            GROUND_FLOOR_RETAIL?: number;
            RESIDENTIAL?: number;
          };
        };
  };
  relatedSiteData?: {
    id: string;
    name: string;
    isExpressSite: boolean;
    addressLabel: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
    surfaceArea: number;
    isFriche: boolean;
    fricheActivity: FricheActivity;
    owner: {
      structureType: string;
      name: string;
    };
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
        isExpressSite: action.payload.isExpressSite,
        ...action.payload.siteData,
      };
    });
    builder.addCase(fetchReconversionProjectImpacts.rejected, (state) => {
      state.dataLoadingState = "error";
    });
  },
});

export const { setEvaluationPeriod, setCategoryFilter, setViewMode } = projectImpactsSlice.actions;

const selectSelf = (state: RootState) => state.projectImpacts;

export const getProjectName = createSelector(
  selectSelf,
  (state): string => state.projectData?.name ?? "Project",
);

type ProjectContext = {
  name: string;
  siteName: string;
  siteId: string;
  type?: ProjectDevelopmentPlanType;
  isExpressProject: boolean;
};
export const getProjectContext = createSelector(
  selectSelf,
  (state): ProjectContext => ({
    name: state.projectData?.name ?? "Project",
    siteName: state.relatedSiteData?.name ?? "",
    siteId: state.relatedSiteData?.id ?? "",
    type: state.projectData?.developmentPlan.type,
    isExpressProject: !!state.projectData?.isExpressProject,
  }),
);

export default projectImpactsSlice.reducer;
