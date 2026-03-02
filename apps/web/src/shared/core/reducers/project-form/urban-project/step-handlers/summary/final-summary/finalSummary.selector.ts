import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { ReconversionProjectSoilsDistribution } from "shared";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import type { getProjectSummary } from "@/shared/core/reducers/project-form/urban-project/helpers/projectSummary";
import type { ProjectStepGroups } from "@/shared/views/project-form/stepper/stepperConfig";

type UrbanProjectSummaryViewData = {
  isFormValid: boolean;
  projectSummary: ReturnType<typeof getProjectSummary>;
  projectSoilsDistribution: ReconversionProjectSoilsDistribution;
  saveState: ProjectFormState["urbanProject"]["saveState"];
  stepsGroupedBySections: ProjectStepGroups;
};

export const createSelectUrbanProjectSummaryViewData = (
  selectIsFormStatusValid: Selector<RootState, boolean>,
  selectProjectSummary: Selector<RootState, ReturnType<typeof getProjectSummary>>,
  selectProjectSoilsDistribution: Selector<RootState, ReconversionProjectSoilsDistribution>,
  selectSaveState: Selector<RootState, ProjectFormState["urbanProject"]["saveState"]>,
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
