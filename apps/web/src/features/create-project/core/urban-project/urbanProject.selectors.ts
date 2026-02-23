import { createSelector } from "@reduxjs/toolkit";

import { createUrbanProjectFormSelectors } from "@/shared/core/reducers/project-form/urban-project/urbanProject.selectors";
import { RootState } from "@/shared/core/store-config/store";

export const creationProjectFormSelectors = createUrbanProjectFormSelectors("projectCreation");

const { selectStepState, selectProjectSoilsDistributionByType } = creationProjectFormSelectors;

export const selectUrbanProjectCurrentStep = createSelector(
  [(state: RootState) => state.projectCreation.urbanProject],
  (state) => state.currentStep,
);

export { selectProjectSoilsDistributionByType, selectStepState };
