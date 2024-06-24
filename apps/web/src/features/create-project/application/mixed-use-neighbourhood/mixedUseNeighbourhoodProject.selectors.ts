import { createSelector } from "@reduxjs/toolkit";
import { MixedUseNeighbourhoodCreationStep } from "./mixedUseNeighbourhoodProject.reducer";

import { RootState } from "@/app/application/store";

const selectSelf = (state: RootState) => state.projectCreation.mixedUseNeighbourhood;

export const selectCurrentStep = createSelector(
  [selectSelf],
  (state): MixedUseNeighbourhoodCreationStep => {
    return state.stepsHistory.at(-1) ?? "CREATE_MODE_SELECTION";
  },
);
