import { createSelector } from "@reduxjs/toolkit";
import { UrbanProjectCreationStep } from "./mixedUseNeighbourhoodProject.reducer";

import { RootState } from "@/app/application/store";

const selectSelf = (state: RootState) => state.projectCreation.mixedUseNeighbourhood;

export const selectCurrentStep = createSelector([selectSelf], (state): UrbanProjectCreationStep => {
  return state.stepsHistory.at(-1) ?? "CREATE_MODE_SELECTION";
});

export const selectCreateMode = createSelector([selectSelf], (state) => state.createMode);
