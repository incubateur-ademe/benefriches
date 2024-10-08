import { createSelector } from "@reduxjs/toolkit";
import { UrbanGreenSpace, UrbanLivingAndActivitySpace, UrbanSpaceCategory } from "shared";

import { RootState } from "@/app/application/store";

import { UrbanProjectCreationStep } from "./urbanProject.reducer";

const selectSelf = (state: RootState) => state.projectCreation.urbanProject;

export const selectCurrentStep = createSelector([selectSelf], (state): UrbanProjectCreationStep => {
  return state.stepsHistory.at(-1) ?? "CREATE_MODE_SELECTION";
});

export const selectCreateMode = createSelector([selectSelf], (state) => state.createMode);

export const selectSpacesCategories = createSelector(
  [selectSelf],
  (state): UrbanSpaceCategory[] => state.creationData.spacesCategories ?? [],
);

export const selectSpaceCategorySurfaceArea = createSelector(
  [selectSelf, (_state, spaceCategory: UrbanSpaceCategory) => spaceCategory],
  (state, spaceCategory) => {
    const surfaceAreaDistribution = state.creationData.spacesCategoriesDistribution;
    if (!surfaceAreaDistribution) return 0;
    return surfaceAreaDistribution[spaceCategory] ?? 0;
  },
);

export const selectGreenSpaces = createSelector([selectSelf], (state): UrbanGreenSpace[] => {
  return state.creationData.greenSpaces ?? [];
});

export const selectLivingAndActivitySpaces = createSelector(
  [selectSelf],
  (state): UrbanLivingAndActivitySpace[] => {
    return state.creationData.livingAndActivitySpaces ?? [];
  },
);
