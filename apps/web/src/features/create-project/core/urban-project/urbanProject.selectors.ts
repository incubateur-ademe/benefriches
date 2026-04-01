import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { createUrbanProjectFormSelectors } from "@/shared/core/reducers/project-form/urban-project/urbanProject.selectors";

export const creationProjectFormSelectors = createUrbanProjectFormSelectors("projectCreation");

const { selectProjectSoilsDistributionByType } = creationProjectFormSelectors;

export const selectUrbanProjectCurrentStep = createSelector(
  [(state: RootState) => state.projectCreation.urbanProject],
  (state) => state.currentStep,
);

export const selectUrbanProjectCreationStepperDataView = createSelector(
  [(state: RootState) => state.projectCreation],
  (state) => ({
    currentStep: state.urbanProject.currentStep,
    currentProjectFlow: state.currentProjectFlow,
  }),
);

export { selectProjectSoilsDistributionByType };
