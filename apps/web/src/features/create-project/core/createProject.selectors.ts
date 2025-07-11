import { createSelector } from "@reduxjs/toolkit";
import {
  Address,
  DevelopmentPlanCategory,
  getDefaultScheduleForProject,
  ProjectSchedule,
  SoilsDistribution,
} from "shared";

import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { RootState } from "@/shared/core/store-config/store";

import { ProjectCreationState, ProjectCreationStep } from "./createProject.reducer";

const selectSelf = (state: RootState) => state.projectCreation;

export const selectCurrentStep = createSelector(selectSelf, (state): ProjectCreationStep => {
  return state.stepsHistory.at(-1) ?? "INTRODUCTION";
});

export const selectProjectId = createSelector(selectSelf, (state): string => {
  return state.projectId;
});

export const selectIsReviewing = createSelector(selectSelf, (state) => state.isReviewing);

export const selectProjectDevelopmentPlanCategory = createSelector(
  selectSelf,
  (state): DevelopmentPlanCategory | undefined => state.developmentPlanCategory,
);

export const selectSiteData = createSelector(
  selectSelf,
  (state): ProjectCreationState["siteData"] => state.siteData,
);
export const selectIsSiteFriche = createSelector(
  selectSiteData,
  (siteData): boolean => siteData?.nature === "FRICHE",
);

export const selectSiteSoilsDistribution = createSelector(
  selectSiteData,
  (siteData): SoilsDistribution => siteData?.soilsDistribution ?? {},
);

export const selectSiteSurfaceArea = createSelector(
  selectSiteData,
  (siteData): number => siteData?.surfaceArea ?? 0,
);

export const selectSiteContaminatedSurfaceArea = createSelector(
  selectSiteData,
  (siteData): number => siteData?.contaminatedSoilSurface ?? 0,
);

export const selectSiteAddress = createSelector(selectSiteData, (siteData): Address | undefined => {
  return siteData?.address;
});

export const selectDefaultSchedule = createSelector(
  selectIsSiteFriche,
  (isFriche): ProjectSchedule => {
    return getDefaultScheduleForProject({ now: () => new Date() })({ hasReinstatement: isFriche });
  },
);

export const selectShouldConfirmStepRevert = createSelector(
  selectSelf,
  selectAppSettings,
  (projecCreation, appSettings) => {
    return appSettings.askForConfirmationOnStepRevert && projecCreation.stepRevertAttempted;
  },
);
