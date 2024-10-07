import { createSelector } from "@reduxjs/toolkit";
import { UrbanSpaceCategory } from "shared";
import { UrbanProjectCreationStep } from "./urbanProject.reducer";

import { RootState } from "@/app/application/store";

const selectSelf = (state: RootState) => state.projectCreation.urbanProject;

export const selectCurrentStep = createSelector([selectSelf], (state): UrbanProjectCreationStep => {
  return state.stepsHistory.at(-1) ?? "CREATE_MODE_SELECTION";
});

export const selectCreateMode = createSelector([selectSelf], (state) => state.createMode);

export const selectSpacesCategories = createSelector(
  [selectSelf],
  (state): UrbanSpaceCategory[] => state.creationData.spacesCategories ?? [],
);
