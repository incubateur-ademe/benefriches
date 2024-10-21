import { createSelector } from "@reduxjs/toolkit";
import {
  SoilsDistribution,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
  UrbanSpaceCategory,
} from "shared";

import { RootState } from "@/app/application/store";

import {
  getUrbanProjectSoilsDistributionFromSpaces,
  UrbanSpacesByCategory,
} from "../../domain/urbanProjectSoils";
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

export const selectPublicSpaces = createSelector([selectSelf], (state): UrbanPublicSpace[] => {
  return state.creationData.publicSpaces ?? [];
});

export const selectUrbanProjectSoilsDistribution = createSelector(
  [selectSelf],
  (state): SoilsDistribution => {
    const { spacesCategoriesDistribution } = state.creationData;
    if (!spacesCategoriesDistribution) return {};

    const urbanSpacesByCategory: UrbanSpacesByCategory = [];
    if (spacesCategoriesDistribution.GREEN_SPACES) {
      urbanSpacesByCategory.push({
        category: "GREEN_SPACES",
        surfaceArea: spacesCategoriesDistribution.GREEN_SPACES,
        spaces: state.creationData.greenSpacesDistribution ?? {},
      });
    }
    if (spacesCategoriesDistribution.LIVING_AND_ACTIVITY_SPACES) {
      urbanSpacesByCategory.push({
        category: "LIVING_AND_ACTIVITY_SPACES",
        surfaceArea: spacesCategoriesDistribution.LIVING_AND_ACTIVITY_SPACES,
        spaces: state.creationData.livingAndActivitySpacesDistribution ?? {},
      });
    }
    if (spacesCategoriesDistribution.PUBLIC_SPACES) {
      urbanSpacesByCategory.push({
        category: "PUBLIC_SPACES",
        surfaceArea: spacesCategoriesDistribution.PUBLIC_SPACES,
        spaces: state.creationData.publicSpacesDistribution ?? {},
      });
    }
    if (spacesCategoriesDistribution.URBAN_POND_OR_LAKE) {
      urbanSpacesByCategory.push({
        category: "URBAN_POND_OR_LAKE",
        surfaceArea: spacesCategoriesDistribution.URBAN_POND_OR_LAKE,
      });
    }

    const soilsDistribution = getUrbanProjectSoilsDistributionFromSpaces(urbanSpacesByCategory);
    return soilsDistribution.toJSON();
  },
);

export const selectBuildingsFootprintSurfaceArea = createSelector([selectSelf], (state): number => {
  return state.creationData.livingAndActivitySpacesDistribution?.BUILDINGS ?? 0;
});
