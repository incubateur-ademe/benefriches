import { createSelector } from "@reduxjs/toolkit";
import {
  computeDefaultInstallationCostsFromSiteSurfaceArea,
  SoilsDistribution,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
  UrbanSpaceCategory,
} from "shared";

import { RootState } from "@/app/application/store";

import { BuildingsEconomicActivityUse, BuildingsUseCategory } from "../../domain/urbanProject";
import {
  getUrbanProjectSoilsDistributionFromSpaces,
  UrbanSpacesByCategory,
} from "../../domain/urbanProjectSoils";
import { selectSiteData } from "../createProject.selectors";
import { UrbanProjectCreationStep, UrbanProjectState } from "./urbanProject.reducer";

const selectSelf = (state: RootState) => state.projectCreation.urbanProject;

export const selectCreationData = createSelector(
  selectSelf,
  (state): UrbanProjectState["creationData"] => state.creationData,
);

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

export const selectBuildingsFloorSurfaceArea = createSelector([selectSelf], (state): number => {
  return state.creationData.buildingsFloorSurfaceArea ?? 0;
});

export const selectBuildingUseCategories = createSelector(
  [selectSelf],
  (state): BuildingsUseCategory[] => {
    return state.creationData.buildingsUseCategories ?? [];
  },
);

export const selectBuildingsEconomicActivityUses = createSelector(
  [selectSelf],
  (
    state,
  ): {
    buildingsEconomicActivityUses: BuildingsEconomicActivityUse[];
    buildingsEconomicActivityTotalSurfaceArea: number;
  } => {
    return {
      buildingsEconomicActivityUses: state.creationData.buildingsEconomicActivityUses ?? [],
      buildingsEconomicActivityTotalSurfaceArea:
        state.creationData.buildingsUseCategoriesDistribution?.ECONOMIC_ACTIVITY ?? 0,
    };
  },
);

export const getDefaultInstallationCosts = createSelector(selectSiteData, (state) => {
  if (!state?.surfaceArea) {
    return undefined;
  }
  return computeDefaultInstallationCostsFromSiteSurfaceArea(state.surfaceArea);
});
