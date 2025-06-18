import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FricheActivity, SiteNature, SoilsDistribution } from "shared";

import { RootState } from "@/shared/core/store-config/store";

import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import { ModalDataProps } from "../../views/project-page/impacts/impact-description-modals/ImpactModalDescription";
import {
  fetchImpactsForReconversionProject,
  ReconversionProjectImpactsResult,
} from "./fetchImpactsForReconversionProject.action";
import { fetchQuickImpactsForUrbanProjectOnFriche } from "./fetchQuickImpactsForUrbanProjectOnFriche.action";

type LoadingState = "idle" | "loading" | "success" | "error";

const DEFAULT_EVALUATION_PERIOD_IN_YEARS = 20;
const DEFAULT_VIEW_MODE = "summary";

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
            LOCAL_STORE?: number;
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
    nature: SiteNature;
    fricheActivity: FricheActivity;
    owner: {
      structureType: string;
      name: string;
    };
  };
  impactsData?: ReconversionProjectImpactsResult["impacts"];
  evaluationPeriod: number;
  currentViewMode: ViewMode;
};

const getInitialState = (): ProjectImpactsState => {
  return {
    impactsData: undefined,
    projectData: undefined,
    relatedSiteData: undefined,
    dataLoadingState: "idle",
    evaluationPeriod: DEFAULT_EVALUATION_PERIOD_IN_YEARS,
    currentViewMode: DEFAULT_VIEW_MODE,
  };
};

const projectImpactsSlice = createSlice({
  name: "projectImpacts",
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
    /* fetch reconversion project impacts */
    builder.addCase(fetchImpactsForReconversionProject.pending, (state) => {
      state.dataLoadingState = "loading";
    });
    builder.addCase(fetchImpactsForReconversionProject.fulfilled, (state, action) => {
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
    builder.addCase(fetchImpactsForReconversionProject.rejected, (state) => {
      state.dataLoadingState = "error";
    });
    /* fetch quick impacts for urban project on friche */
    builder.addCase(fetchQuickImpactsForUrbanProjectOnFriche.pending, (state) => {
      state.dataLoadingState = "loading";
    });
    builder.addCase(fetchQuickImpactsForUrbanProjectOnFriche.fulfilled, (state, action) => {
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
    builder.addCase(fetchQuickImpactsForUrbanProjectOnFriche.rejected, (state) => {
      state.dataLoadingState = "error";
    });
  },
});

export const { setEvaluationPeriod, setViewMode } = projectImpactsSlice.actions;

const selectSelf = (state: RootState) => state.projectImpacts;

export const selectProjectName = createSelector(
  selectSelf,
  (state): string => state.projectData?.name ?? "Projet",
);

type ProjectContext = {
  name: string;
  siteName: string;
  siteId: string;
  type?: ProjectDevelopmentPlanType;
  isExpressProject: boolean;
};
export const selectProjectContext = createSelector(
  selectSelf,
  (state): ProjectContext => ({
    name: state.projectData?.name ?? "Projet",
    siteName: state.relatedSiteData?.name ?? "",
    siteId: state.relatedSiteData?.id ?? "",
    type: state.projectData?.developmentPlan.type,
    isExpressProject: !!state.projectData?.isExpressProject,
  }),
);

export const selectModalData = createSelector(
  selectSelf,
  (state): ModalDataProps => ({
    projectData: state.projectData!,
    siteData: state.relatedSiteData!,
    impactsData: state.impactsData!,
  }),
);

export default projectImpactsSlice.reducer;
