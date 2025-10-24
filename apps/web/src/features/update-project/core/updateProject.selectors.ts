import { createSelector } from "@reduxjs/toolkit";

import { createProjectFormSelectors } from "@/shared/core/reducers/project-form/projectForm.selectors";
import { createUrbanProjectFormSelectors } from "@/shared/core/reducers/project-form/urban-project/urbanProject.selectors";
import { RootState } from "@/shared/core/store-config/store";

const {
  selectSiteAddress,
  selectSiteSoilsDistribution,
  selectAvailableLocalAuthoritiesStakeholders,
  selectProjectAvailableStakeholders,
  selectSiteSurfaceArea,
  selectSiteContaminatedSurfaceArea,
} = createProjectFormSelectors("projectUpdate");

export { selectSiteAddress, selectSiteSoilsDistribution };

export const updateUrbanProjectFormSelectors = createUrbanProjectFormSelectors("projectUpdate", {
  selectAvailableLocalAuthoritiesStakeholders,
  selectProjectAvailableStakeholders,
  selectSiteAddress,
  selectSiteSoilsDistribution,
  selectSiteSurfaceArea,
  selectSiteContaminatedSurfaceArea,
});
const { selectProjectSoilsDistribution } = updateUrbanProjectFormSelectors;
export { selectProjectSoilsDistribution };

export const selectUrbanProjectCurrentStep = createSelector(
  [(state: RootState) => state.projectUpdate.urbanProject],
  (state) => state.currentStep,
);
