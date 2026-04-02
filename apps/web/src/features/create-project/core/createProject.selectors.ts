import { createSelector } from "@reduxjs/toolkit";
import { getDefaultScheduleForProject, ProjectSchedule } from "shared";

import { RootState } from "@/app/store/store";
import { selectShouldGoThroughOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";

import { ProjectCreationState } from "./createProject.reducer";
import {
  creationProjectFormSelectors,
  selectUrbanProjectCurrentStep,
} from "./urban-project/urbanProject.selectors";

const selectSelf = (state: RootState) => state.projectCreation;

export const selectProjectCreationWizardViewData = createSelector(selectSelf, (state) => {
  return {
    currentProjectFlow: state.currentProjectFlow,
    loadingState: state.siteDataLoadingState,
  };
});

export const selectProjectId = createSelector(selectSelf, (state): string => {
  return state.projectId;
});

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

const selectNamingStepAnswers =
  creationProjectFormSelectors.selectStepAnswers("URBAN_PROJECT_NAMING");

type CustomCreationResultViewData = {
  projectId: string;
  projectName: string;
  saveState: "idle" | "loading" | "success" | "error" | "dirty";
  shouldGoThroughOnboarding: boolean;
};

type UrbanProjectCreationWizardViewData = {
  currentStep: ReturnType<typeof selectUrbanProjectCurrentStep>;
  saveState: "idle" | "loading" | "success" | "error" | "dirty";
};

export const selectUrbanProjectCreationWizardViewData = createSelector(
  selectUrbanProjectCurrentStep,
  selectSelf,
  (currentStep, state): UrbanProjectCreationWizardViewData => ({
    currentStep,
    saveState: state.urbanProject.saveState,
  }),
);

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

export const selectMainStepperViewData = createSelector(selectSelf, (state) => ({
  creationMode: state.useCaseSelection.creationMode,
  developmentPlanType: state.useCaseSelection.projectDevelopmentPlan?.type,
}));
