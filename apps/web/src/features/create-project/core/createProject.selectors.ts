import { createSelector } from "@reduxjs/toolkit";
import { DevelopmentPlanCategory, getDefaultScheduleForProject, ProjectSchedule } from "shared";

import { createProjectFormSelectors } from "@/shared/core/reducers/project-form/projectForm.selectors";
import { RootState } from "@/shared/core/store-config/store";

import { ProjectCreationState, ProjectCreationStep } from "./createProject.reducer";
import { ProjectSuggestion } from "./project.types";

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

const {
  selectSiteAddress,
  selectSiteSoilsDistribution,
  selectAvailableLocalAuthoritiesStakeholders,
  selectProjectAvailableStakeholders,
  selectSiteSurfaceArea,
  selectSiteContaminatedSurfaceArea,
} = createProjectFormSelectors("projectCreation");
export {
  selectSiteAddress,
  selectSiteSoilsDistribution,
  selectAvailableLocalAuthoritiesStakeholders,
  selectProjectAvailableStakeholders,
  selectSiteSurfaceArea,
  selectSiteContaminatedSurfaceArea,
};
