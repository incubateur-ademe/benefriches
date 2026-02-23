import { createSelector } from "@reduxjs/toolkit";

import { createUrbanProjectFormSelectors } from "@/shared/core/reducers/project-form/urban-project/urbanProject.selectors";
import { RootState } from "@/shared/core/store-config/store";

export const updateUrbanProjectFormSelectors = createUrbanProjectFormSelectors("projectUpdate");

const { selectSiteAddress, selectSiteSoilsDistribution, selectProjectSoilsDistributionByType } =
  updateUrbanProjectFormSelectors;

export { selectSiteAddress, selectSiteSoilsDistribution, selectProjectSoilsDistributionByType };

export const selectUrbanProjectCurrentStep = createSelector(
  [(state: RootState) => state.projectUpdate.urbanProject],
  (state) => state.currentStep,
);
