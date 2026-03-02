import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { createUrbanProjectFormSelectors } from "@/shared/core/reducers/project-form/urban-project/urbanProject.selectors";

export const updateUrbanProjectFormSelectors = createUrbanProjectFormSelectors("projectUpdate");

const { selectSiteAddress, selectSiteSoilsDistribution, selectProjectSoilsDistributionByType } =
  updateUrbanProjectFormSelectors;

export { selectSiteAddress, selectSiteSoilsDistribution, selectProjectSoilsDistributionByType };

export const selectUrbanProjectCurrentStep = createSelector(
  [(state: RootState) => state.projectUpdate.urbanProject],
  (state) => state.currentStep,
);
