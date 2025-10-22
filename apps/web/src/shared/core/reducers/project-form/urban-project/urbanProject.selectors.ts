import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { ReadStateHelper } from "./helpers/readState";

export const createUrbanProjectFormSelectors = (
  entityName: "projectCreation" | "projectUpdate",
) => {
  const selectSelf = (state: RootState) => state[entityName];

  const selectStepState = createSelector(selectSelf, (state) => state.urbanProject.steps);

  const selectProjectSoilDistribution = createSelector(selectStepState, (state) =>
    ReadStateHelper.getProjectSoilDistributionBySoilType(state),
  );

  return {
    selectStepState,
    selectProjectSoilDistribution,
  };
};
