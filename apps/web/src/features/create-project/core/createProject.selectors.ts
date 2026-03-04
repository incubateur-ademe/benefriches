import { createSelector } from "@reduxjs/toolkit";
import { DevelopmentPlanCategory, getDefaultScheduleForProject, ProjectSchedule } from "shared";

import { RootState } from "@/app/store/store";
import { selectShouldGoThroughOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";

import type { ExpressReconversionProjectResult } from "./actions/expressProjectSavedGateway";
import { ProjectCreationState, ProjectCreationStep } from "./createProject.reducer";
import { ProjectSuggestion } from "./project.types";
import { creationProjectFormSelectors } from "./urban-project/urbanProject.selectors";

const selectSelf = (state: RootState) => state.projectCreation;

export const selectCurrentStep = createSelector(selectSelf, (state): ProjectCreationStep => {
  return state.stepsHistory.at(-1) ?? "INTRODUCTION";
});

export const selectProjectId = createSelector(selectSelf, (state): string => {
  return state.projectId;
});

export const selectProjectDevelopmentPlanCategory = createSelector(
  selectSelf,
  (state): DevelopmentPlanCategory | undefined => state.developmentPlanCategory,
);

type ProjectSuggestionsViewData = {
  projectSuggestions: ProjectSuggestion[];
};

export const selectProjectSuggestionsViewData = createSelector(
  selectSelf,
  (state): ProjectSuggestionsViewData => ({
    projectSuggestions: state.projectSuggestions ?? [],
  }),
);

export const selectSiteData = createSelector(
  selectSelf,
  (state): ProjectCreationState["siteData"] => state.siteData,
);
export const selectIsSiteFriche = createSelector(
  selectSiteData,
  (siteData): boolean => siteData?.nature === "FRICHE",
);

export const selectDefaultSchedule = createSelector(
  selectIsSiteFriche,
  (isFriche): ProjectSchedule => {
    return getDefaultScheduleForProject({ now: () => new Date() })({ hasReinstatement: isFriche });
  },
);

export const {
  selectSiteAddress,
  selectSiteSoilsDistribution,
  selectSiteSurfaceArea,
  selectSiteContaminatedSurfaceArea,
} = creationProjectFormSelectors;

type UrbanProjectExpressSummaryViewData = {
  loadingState: "idle" | "loading" | "success" | "error";
  data: ExpressReconversionProjectResult | undefined;
  siteName: string;
};

export const selectUrbanProjectExpressSummaryViewData = createSelector(
  selectSelf,
  selectSiteData,
  (state, siteData): UrbanProjectExpressSummaryViewData => {
    const stepState = state.urbanProject.steps.URBAN_PROJECT_EXPRESS_SUMMARY;
    return {
      loadingState: stepState?.loadingState ?? "idle",
      data: stepState?.data,
      siteName: siteData?.name ?? "",
    };
  },
);

type CommonResultViewData = {
  projectId: string;
  shouldGoThroughOnboarding: boolean;
};

export const selectCommonResultViewData = createSelector(
  selectProjectId,
  selectShouldGoThroughOnboarding,
  (projectId, shouldGoThroughOnboarding): CommonResultViewData => ({
    projectId,
    shouldGoThroughOnboarding,
  }),
);

type ExpressCreationResultViewData = {
  projectId: string;
  projectName: string;
  saveState: "idle" | "loading" | "success" | "error" | "dirty";
  shouldGoThroughOnboarding: boolean;
};

export const selectExpressCreationResultViewData = createSelector(
  selectSelf,
  selectShouldGoThroughOnboarding,
  (state, shouldGoThroughOnboarding): ExpressCreationResultViewData => ({
    projectId: state.projectId,
    projectName: state.urbanProject.steps.URBAN_PROJECT_EXPRESS_SUMMARY?.data?.name ?? "",
    saveState: state.urbanProject.saveState,
    shouldGoThroughOnboarding,
  }),
);

const selectNamingStepAnswers =
  creationProjectFormSelectors.selectStepAnswers("URBAN_PROJECT_NAMING");

type CustomCreationResultViewData = {
  projectId: string;
  projectName: string;
  saveState: "idle" | "loading" | "success" | "error" | "dirty";
  shouldGoThroughOnboarding: boolean;
};

export const selectCustomCreationResultViewData = createSelector(
  selectProjectId,
  creationProjectFormSelectors.selectSaveState,
  selectNamingStepAnswers,
  selectShouldGoThroughOnboarding,
  (
    projectId,
    saveState,
    namingAnswers,
    shouldGoThroughOnboarding,
  ): CustomCreationResultViewData => ({
    projectId,
    projectName: namingAnswers?.name ?? "",
    saveState,
    shouldGoThroughOnboarding,
  }),
);
