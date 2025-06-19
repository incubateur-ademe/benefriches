import { createReducer, createSelector, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { FricheActivity, SiteNature, SoilsDistribution } from "shared";

import { RootState } from "@/shared/core/store-config/store";

import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import { ModalDataProps } from "../../views/project-page/impacts/impact-description-modals/ImpactModalDescription";
import { viewModeUpdated } from "./actions";
import {
  evaluationPeriodUpdated,
  reconversionProjectImpactsRequested,
  ReconversionProjectImpactsResult,
} from "./actions";
import { fetchQuickImpactsForUrbanProjectOnFriche } from "./fetchQuickImpactsForUrbanProjectOnFriche.action";

type LoadingState = "idle" | "loading" | "success" | "error";

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
  evaluationPeriod: number | undefined;
  currentViewMode: ViewMode;
};

export const getInitialState = (): ProjectImpactsState => {
  return {
    impactsData: undefined,
    projectData: undefined,
    relatedSiteData: undefined,
    dataLoadingState: "idle",
    evaluationPeriod: undefined,
    currentViewMode: DEFAULT_VIEW_MODE,
  };
};

export const projectImpactsReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(viewModeUpdated, (state, action: PayloadAction<ViewMode>) => {
    state.currentViewMode = action.payload;
  });
  builder.addCase(evaluationPeriodUpdated.pending, (state, action) => {
    state.evaluationPeriod = action.meta.arg.evaluationPeriodInYears;
    state.dataLoadingState = "loading";
  });
  /* fetch reconversion project impacts */
  builder.addCase(reconversionProjectImpactsRequested.pending, (state) => {
    state.dataLoadingState = "loading";
  });
  builder.addCase(reconversionProjectImpactsRequested.rejected, (state) => {
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
  builder.addMatcher(
    isAnyOf(evaluationPeriodUpdated.fulfilled, reconversionProjectImpactsRequested.fulfilled),
    (state, action) => {
      state.dataLoadingState = "success";
      state.impactsData = action.payload.impacts;
      state.evaluationPeriod = action.payload.evaluationPeriodInYears;
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
    },
  );
});

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
