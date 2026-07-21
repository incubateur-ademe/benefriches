import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { ReconversionProjectSoilsDistribution } from "shared";

import type { RootState } from "@/app/store/store";
import type { getProjectSummary } from "@/features/create-project/core/urban-project/helpers/projectSummary";
import type { UrbanProjectFormState } from "@/features/create-project/core/urban-project/urbanProject.state";
import type { ProjectStepGroups } from "@/features/create-project/views/project-form/stepper/stepperConfig";

type UrbanProjectSummaryViewData = {
  isFormValid: boolean;
  projectSummary: ReturnType<typeof getProjectSummary>;
  projectSoilsDistribution: ReconversionProjectSoilsDistribution;
  saveState: UrbanProjectFormState["saveState"];
  stepsGroupedBySections: ProjectStepGroups;
};

export const createSelectUrbanProjectSummaryViewData = (
  selectIsFormStatusValid: Selector<RootState, boolean>,
  selectProjectSummary: Selector<RootState, ReturnType<typeof getProjectSummary>>,
  selectProjectSoilsDistribution: Selector<RootState, ReconversionProjectSoilsDistribution>,
  selectSaveState: Selector<RootState, UrbanProjectFormState["saveState"]>,
  selectStepsGroupedBySections: Selector<RootState, ProjectStepGroups>,
) =>
  createSelector(
    [
      selectIsFormStatusValid,
      selectProjectSummary,
      selectProjectSoilsDistribution,
      selectSaveState,
      selectStepsGroupedBySections,
    ],
    (
      isFormValid,
      projectSummary,
      projectSoilsDistribution,
      saveState,
      stepsGroupedBySections,
    ): UrbanProjectSummaryViewData => ({
      isFormValid,
      projectSummary,
      projectSoilsDistribution,
      saveState,
      stepsGroupedBySections,
    }),
  );
