import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

export const createSelectSoilsCarbonStorageDifference = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
) =>
  createSelector([selectStepState], (steps) => ({
    loadingState: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.loadingState ?? "idle",
    current: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.data?.current,
    projected: steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY?.data?.projected,
  }));
