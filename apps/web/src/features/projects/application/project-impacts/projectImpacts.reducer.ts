import { createReducer, createSelector, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import {
  GetReconversionProjectImpactsResultDto,
  SiteNature,
  UrbanSprawlImpactsComparisonResultDto,
} from "shared";

import { RootState } from "@/app/store/store";
import { selectAppSettings } from "@/features/app-settings/core/appSettings";

import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import {
  evaluationPeriodUpdated,
  reconversionProjectImpactsBreakEvenLevelRequested,
  viewModeUpdated,
} from "./actions";
import { fetchQuickImpactsForUrbanProjectOnFriche } from "./actions/fetchQuickImpactsForUrbanProjectOnFriche.action";
import { urbanSprawlImpactsComparisonRequested } from "./actions/urbanSprawlImpactsComparisonRequested.action";

type LoadingState = "idle" | "loading" | "success" | "error";

const DEFAULT_VIEW_MODE = "summary";

export type ViewMode = "list" | "summary";

export type ProjectImpactsState = {
  dataLoadingState: {
    impacts: LoadingState;
    urbanSprawlSimulation: LoadingState;
  };
  contextData?: GetReconversionProjectImpactsResultDto["contextData"];

  currentViewMode: ViewMode;
  evaluationPeriod: number | undefined;

  impacts?: GetReconversionProjectImpactsResultDto["impacts"];
  urbanSprawlSimulation?: UrbanSprawlImpactsComparisonResultDto;
};

export const getInitialState = (): ProjectImpactsState => {
  return {
    contextData: undefined,
    dataLoadingState: {
      impacts: "idle",
      urbanSprawlSimulation: "idle",
    },
    evaluationPeriod: undefined,
    currentViewMode: DEFAULT_VIEW_MODE,
  };
};

export const projectImpactsReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(viewModeUpdated, (state, action: PayloadAction<ViewMode>) => {
    state.currentViewMode = action.payload;
  });

  builder.addCase(evaluationPeriodUpdated, (state, action: PayloadAction<number>) => {
    state.evaluationPeriod = action.payload;
  });

  builder.addCase(urbanSprawlImpactsComparisonRequested.pending, (state) => {
    state.dataLoadingState.urbanSprawlSimulation = "loading";
  });
  builder.addCase(urbanSprawlImpactsComparisonRequested.fulfilled, (state, action) => {
    state.dataLoadingState.urbanSprawlSimulation = "success";
    state.urbanSprawlSimulation = action.payload;
  });
  builder.addCase(urbanSprawlImpactsComparisonRequested.rejected, (state) => {
    state.dataLoadingState.urbanSprawlSimulation = "error";
  });

  /* fetch reconversion project impacts */
  builder.addMatcher(
    isAnyOf(
      reconversionProjectImpactsBreakEvenLevelRequested.pending,
      fetchQuickImpactsForUrbanProjectOnFriche.pending,
    ),
    (state) => {
      state.dataLoadingState.impacts = "loading";
    },
  );
  builder.addMatcher(
    isAnyOf(
      reconversionProjectImpactsBreakEvenLevelRequested.rejected,
      fetchQuickImpactsForUrbanProjectOnFriche.rejected,
    ),
    (state) => {
      state.dataLoadingState.impacts = "error";
    },
  );
  builder.addMatcher(
    isAnyOf(
      reconversionProjectImpactsBreakEvenLevelRequested.fulfilled,
      fetchQuickImpactsForUrbanProjectOnFriche.fulfilled,
    ),
    (state, action) => {
      state.dataLoadingState.impacts = "success";
      state.impacts = action.payload.impacts;
      state.contextData = action.payload.contextData;
      if (!state.evaluationPeriod) {
        state.evaluationPeriod =
          state.contextData.projectDevelopmentPlan.type === "PHOTOVOLTAIC_POWER_PLANT" ? 30 : 50;
      }
    },
  );
});

const selectSelf = (state: RootState) => state.projectImpacts;

export const selectProjectName = createSelector(
  selectSelf,
  (state): string => state.contextData?.projectName ?? "Projet",
);

type ProjectsImpactsViewData = {
  name: string;
  siteName: string;
  siteNature?: SiteNature;
  siteId: string;
  type?: ProjectDevelopmentPlanType;
  isExpressProject: boolean;
  displayImpactsAccuracyDisclaimer: boolean;
};
export const selectProjectsImpactsViewData = createSelector(
  [selectSelf, selectAppSettings],
  (state, appSettings): ProjectsImpactsViewData => {
    const isExpressProject = !!state.contextData?.isExpressProject;
    const isExpressSite = !!state.contextData?.isExpressSite;
    const displayImpactsAccuracyDisclaimer =
      (isExpressProject || isExpressSite) && appSettings.displayImpactsAccuracyDisclaimer;

    return {
      name: state.contextData?.projectName ?? "Projet",
      siteNature: state.contextData?.siteNature,
      siteName: state.contextData?.relatedSiteName ?? "",
      siteId: state.contextData?.relatedSiteId ?? "",
      type: state.contextData?.projectDevelopmentPlan.type,
      isExpressProject,
      displayImpactsAccuracyDisclaimer,
    };
  },
);
