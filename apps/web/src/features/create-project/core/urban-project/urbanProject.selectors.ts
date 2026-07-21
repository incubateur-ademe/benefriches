import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { createUrbanProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProjectForm.selectors";

export const creationProjectFormSelectors = createUrbanProjectFormSelectors("projectCreation");

const { selectProjectSoilsDistributionByType } = creationProjectFormSelectors;

export const selectUrbanProjectCurrentStep = createSelector(
  [(state: RootState) => state.projectCreation.urbanProject.form],
  (form) => form.currentStep,
);

export const selectUrbanProjectCreationStepperDataView = createSelector(
  [(state: RootState) => state.projectCreation],
  (state) => ({
    currentStep: state.urbanProject.form.currentStep,
    currentProjectFlow: state.currentProjectFlow,
  }),
);

export { selectProjectSoilsDistributionByType };
