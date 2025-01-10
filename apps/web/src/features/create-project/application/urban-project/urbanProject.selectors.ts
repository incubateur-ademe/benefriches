import { createSelector } from "@reduxjs/toolkit";
import {
  computeDefaultInstallationCostsFromSiteSurfaceArea,
  filterObject,
  SoilsDistribution,
  UrbanSpaceCategory,
  BuildingsEconomicActivityUse,
  SurfaceAreaDistribution,
  SurfaceAreaDistributionJson,
} from "shared";

import { RootState } from "@/app/application/store";
import { selectAppSettings } from "@/shared/app-settings/core/appSettings";

import {
  getUrbanProjectSoilsDistributionFromSpaces,
  UrbanSpacesByCategory,
} from "../../domain/urbanProjectSoils";
import { selectSiteData } from "../createProject.selectors";
import { UrbanProjectCreationStep, UrbanProjectState } from "./urbanProject.reducer";

const selectSelf = (state: RootState) => state.projectCreation.urbanProject;

export const selectSaveState = createSelector(
  selectSelf,
  (state): UrbanProjectState["saveState"] => state.saveState,
);

export const selectCreationData = createSelector(
  selectSelf,
  (state): UrbanProjectState["creationData"] => state.creationData,
);

export const selectProjectName = createSelector(
  selectCreationData,
  (state): string => state.name ?? "",
);

export const selectCurrentStep = createSelector([selectSelf], (state): UrbanProjectCreationStep => {
  return state.stepsHistory.at(-1) ?? "CREATE_MODE_SELECTION";
});

export const selectCreateMode = createSelector([selectSelf], (state) => state.createMode);

export const selectSpacesCategories = createSelector(
  [selectSelf],
  (state): UrbanSpaceCategory[] => state.creationData.spacesCategories ?? [],
);

type SurfaceAreaDistributionWithUnit<TSurface extends string> = {
  unit: "percentage" | "squareMeters";
  value: SurfaceAreaDistributionJson<TSurface>;
};
const getSurfaceAreaDistributionWithUnit = <TSurface extends string>(
  surfaceAreaDistributionInSquareMeters: SurfaceAreaDistributionJson<TSurface>,
  outputUnit: "percentage" | "squareMeters",
): SurfaceAreaDistributionWithUnit<TSurface> => {
  const surfaceAreaDistribution = SurfaceAreaDistribution.fromJSON(
    surfaceAreaDistributionInSquareMeters,
  );
  return outputUnit === "percentage"
    ? {
        unit: "percentage",
        value: surfaceAreaDistribution.getDistributionInPercentage(),
      }
    : { unit: "squareMeters", value: surfaceAreaDistribution.toJSON() };
};

export const selectSpacesCategoriesSurfaceDistribution = createSelector(
  [selectSelf, selectAppSettings],
  (state, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      state.creationData.spacesCategoriesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const selectPublicSpacesDistribution = createSelector(
  [selectSelf, selectAppSettings],
  (state, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      state.creationData.publicSpacesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const selectGreenSpacesDistribution = createSelector(
  [selectSelf, selectAppSettings],
  (state, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      state.creationData.greenSpacesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const selectLivingAndActivitySpacessDistribution = createSelector(
  [selectSelf, selectAppSettings],
  (state, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      state.creationData.livingAndActivitySpacesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const selectSpaceCategorySurfaceArea = createSelector(
  [selectSelf, (_state, spaceCategory: UrbanSpaceCategory) => spaceCategory],
  (state, spaceCategory) => {
    const surfaceAreaDistribution = state.creationData.spacesCategoriesDistribution;
    if (!surfaceAreaDistribution) return 0;
    return surfaceAreaDistribution[spaceCategory] ?? 0;
  },
);

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

export const getUrbanProjectSpaceDistribution = createSelector(selectCreationData, (state) => {
  const {
    IMPERMEABLE_SURFACE = 0,
    PERMEABLE_SURFACE = 0,
    GRASS_COVERED_SURFACE = 0,
  } = state.publicSpacesDistribution ?? {};
  const {
    URBAN_POND_OR_LAKE = 0,
    LAWNS_AND_BUSHES = 0,
    TREE_FILLED_SPACE = 0,
    PAVED_ALLEY = 0,
    GRAVEL_ALLEY = 0,
  } = state.greenSpacesDistribution ?? {};
  const publicGreenSpaces = URBAN_POND_OR_LAKE + LAWNS_AND_BUSHES + TREE_FILLED_SPACE;
  const {
    BUILDINGS = 0,
    PAVED_ALLEY_OR_PARKING_LOT = 0,
    GRAVEL_ALLEY_OR_PARKING_LOT = 0,
    GARDEN_AND_GRASS_ALLEYS = 0,
    TREE_FILLED_GARDEN_OR_ALLEY = 0,
  } = state.livingAndActivitySpacesDistribution ?? {};

  return filterObject(
    {
      BUILDINGS_FOOTPRINT: BUILDINGS,
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: PAVED_ALLEY_OR_PARKING_LOT,
      PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: GRAVEL_ALLEY_OR_PARKING_LOT,
      PRIVATE_GARDEN_AND_GRASS_ALLEYS: GARDEN_AND_GRASS_ALLEYS,
      PRIVATE_TREE_FILLED_GARDEN_AND_ALLEYS: TREE_FILLED_GARDEN_OR_ALLEY,
      // public spaces
      PUBLIC_GREEN_SPACES: publicGreenSpaces,
      PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: IMPERMEABLE_SURFACE + PAVED_ALLEY,
      PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: PERMEABLE_SURFACE + GRAVEL_ALLEY,
      PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: GRASS_COVERED_SURFACE,
    },
    ([, value]) => !!value && value > 0,
  );
});

export const selectDefaultInstallationCosts = createSelector(selectSiteData, (state) => {
  if (!state?.surfaceArea) {
    return undefined;
  }
  return computeDefaultInstallationCostsFromSiteSurfaceArea(state.surfaceArea);
});

export const selectInstallationCosts = createSelector(selectCreationData, (creationData) => {
  return creationData.installationExpenses ?? undefined;
});

export const selectContaminatedSurfaceAreaPercentageToDecontaminate = createSelector(
  [selectSelf, selectSiteData],
  (state, siteData): number => {
    const contaminatedSurfaceArea = siteData?.contaminatedSoilSurface;
    if (!contaminatedSurfaceArea) return 0;

    const surfaceAreaToDecontaminate = state.creationData.decontaminatedSurfaceArea ?? 0;
    return (surfaceAreaToDecontaminate * 100) / contaminatedSurfaceArea;
  },
);

type SitePurchaseAmounts = {
  sellingPrice: number;
  propertyTransferDuties?: number;
};
export const selectSitePurchaseAmounts = createSelector(
  [selectSelf],
  ({ creationData }): SitePurchaseAmounts | undefined => {
    if (!creationData.sitePurchaseSellingPrice) return undefined;
    return {
      sellingPrice: creationData.sitePurchaseSellingPrice,
      propertyTransferDuties: creationData.sitePurchasePropertyTransferDuties ?? 0,
    };
  },
);

type SiteResaleAmounts = {
  sellingPrice: number;
  propertyTransferDuties?: number;
};
export const selectSiteResaleAmounts = createSelector(
  [selectCreationData],
  (creationData): SiteResaleAmounts | undefined => {
    if (!creationData.siteResaleExpectedSellingPrice) return undefined;
    return {
      sellingPrice: creationData.siteResaleExpectedSellingPrice,
      propertyTransferDuties: creationData.siteResaleExpectedPropertyTransferDuties ?? 0,
    };
  },
);
