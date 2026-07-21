import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { createUrbanProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProjectForm.selectors";

export const updateUrbanProjectFormSelectors = createUrbanProjectFormSelectors("projectUpdate");

const { selectSiteAddress, selectSiteSoilsDistribution, selectProjectSoilsDistributionByType } =
  updateUrbanProjectFormSelectors;

export { selectSiteAddress, selectSiteSoilsDistribution, selectProjectSoilsDistributionByType };

export const selectUrbanProjectCurrentStep = createSelector(
  [(state: RootState) => state.projectUpdate.urbanProject.form],
  (form) => form.currentStep,
);
