import { createSelector } from "@reduxjs/toolkit";
import {
  computeDefaultInstallationExpensesFromSiteSurfaceArea,
  filterObject,
  SoilsDistribution,
  UrbanSpaceCategory,
  SurfaceAreaDistribution,
  SurfaceAreaDistributionJson,
  ProjectSchedule,
  ProjectScheduleBuilder,
} from "shared";

import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { RootState } from "@/shared/core/store-config/store";

import { selectDefaultSchedule, selectSiteData } from "../../createProject.selectors";
import { generateUrbanProjectName } from "../../projectName";
import { UrbanProjectCreationData } from "../creationData";
import { UrbanProjectState } from "../urbanProject.reducer";
import {
  getUrbanProjectSoilsDistributionFromSpaces,
  UrbanSpacesByCategory,
} from "../urbanProjectSoils";

const selectSelf = (state: RootState) => state.projectCreation.urbanProject;

export const selectSaveState = createSelector(
  selectSelf,
  (state): UrbanProjectState["saveState"] => state.saveState,
);

export const selectCreationData = createSelector(
  selectSelf,
  (state): UrbanProjectCreationData => state.creationData,
);

export const selectProjectName = createSelector(
  selectCreationData,
  (creationData): string => creationData.name ?? "",
);

export const selectCreateMode = createSelector([selectSelf], (state) => state.createMode);

export const selectSpacesCategories = createSelector(
  [selectCreationData],
  (creationData): UrbanSpaceCategory[] => creationData.spacesCategories ?? [],
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
  [selectCreationData, selectAppSettings],
  (creationData, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      creationData.spacesCategoriesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const selectPublicSpacesDistribution = createSelector(
  [selectCreationData, selectAppSettings],
  (creationData, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      creationData.publicSpacesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const selectGreenSpacesDistribution = createSelector(
  [selectCreationData, selectAppSettings],
  (creationData, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      creationData.greenSpacesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const selectLivingAndActivitySpacessDistribution = createSelector(
  [selectCreationData, selectAppSettings],
  (creationData, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      creationData.livingAndActivitySpacesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const selectSpaceCategorySurfaceArea = createSelector(
  [selectCreationData, (_state, spaceCategory: UrbanSpaceCategory) => spaceCategory],
  (creationData, spaceCategory) => {
    const surfaceAreaDistribution = creationData.spacesCategoriesDistribution;
    if (!surfaceAreaDistribution) return 0;
    return surfaceAreaDistribution[spaceCategory] ?? 0;
  },
);

export const selectUrbanProjectSoilsDistribution = createSelector(
  [selectCreationData],
  (creationData): SoilsDistribution => {
    const { spacesCategoriesDistribution } = creationData;
    if (!spacesCategoriesDistribution) return {};

    const urbanSpacesByCategory: UrbanSpacesByCategory = [];
    if (spacesCategoriesDistribution.GREEN_SPACES) {
      urbanSpacesByCategory.push({
        category: "GREEN_SPACES",
        surfaceArea: spacesCategoriesDistribution.GREEN_SPACES,
        spaces: creationData.greenSpacesDistribution ?? {},
      });
    }
    if (spacesCategoriesDistribution.LIVING_AND_ACTIVITY_SPACES) {
      urbanSpacesByCategory.push({
        category: "LIVING_AND_ACTIVITY_SPACES",
        surfaceArea: spacesCategoriesDistribution.LIVING_AND_ACTIVITY_SPACES,
        spaces: creationData.livingAndActivitySpacesDistribution ?? {},
      });
    }
    if (spacesCategoriesDistribution.PUBLIC_SPACES) {
      urbanSpacesByCategory.push({
        category: "PUBLIC_SPACES",
        surfaceArea: spacesCategoriesDistribution.PUBLIC_SPACES,
        spaces: creationData.publicSpacesDistribution ?? {},
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

export const selectBuildingsFootprintSurfaceArea = createSelector(
  [selectCreationData],
  (creationData): number => {
    return creationData.livingAndActivitySpacesDistribution?.BUILDINGS ?? 0;
  },
);

export const selectBuildingsFloorSurfaceArea = createSelector(
  [selectCreationData],
  (creationData): number => {
    return creationData.buildingsFloorSurfaceArea ?? 0;
  },
);

export const selectBuildingsFloorUseSurfaceAreas = createSelector(
  [selectCreationData, selectAppSettings],
  (creationData, appSettings) => {
    return getSurfaceAreaDistributionWithUnit(
      creationData.buildingsUsesDistribution ?? {},
      appSettings.surfaceAreaInputMode,
    );
  },
);

export const getUrbanProjectSpaceDistribution = createSelector(
  selectCreationData,
  (creationData) => {
    const {
      livingAndActivitySpacesDistribution,
      publicSpacesDistribution,
      greenSpacesDistribution,
    } = creationData;

    const publicGreenSpaces =
      (greenSpacesDistribution?.URBAN_POND_OR_LAKE ?? 0) +
      (greenSpacesDistribution?.LAWNS_AND_BUSHES ?? 0) +
      (greenSpacesDistribution?.TREE_FILLED_SPACE ?? 0);

    return filterObject(
      {
        BUILDINGS_FOOTPRINT: livingAndActivitySpacesDistribution?.BUILDINGS,
        PRIVATE_PAVED_ALLEY_OR_PARKING_LOT:
          livingAndActivitySpacesDistribution?.IMPERMEABLE_SURFACE,
        PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: livingAndActivitySpacesDistribution?.PERMEABLE_SURFACE,
        PRIVATE_GARDEN_AND_GRASS_ALLEYS: livingAndActivitySpacesDistribution?.PRIVATE_GREEN_SPACES,
        // public spaces
        PUBLIC_GREEN_SPACES: publicGreenSpaces,
        PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS:
          (publicSpacesDistribution?.IMPERMEABLE_SURFACE ?? 0) +
          (greenSpacesDistribution?.PAVED_ALLEY ?? 0),
        PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS:
          (publicSpacesDistribution?.PERMEABLE_SURFACE ?? 0) +
          (greenSpacesDistribution?.GRAVEL_ALLEY ?? 0),
        PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: publicSpacesDistribution?.GRASS_COVERED_SURFACE,
      },
      ([, value]) => !!value && value > 0,
    );
  },
);

export const selectDefaultInstallationCosts = createSelector(selectSiteData, (siteData) => {
  if (!siteData?.surfaceArea) {
    return undefined;
  }
  return computeDefaultInstallationExpensesFromSiteSurfaceArea(siteData.surfaceArea);
});

export const selectInstallationCosts = createSelector(selectCreationData, (creationData) => {
  return creationData.installationExpenses ?? undefined;
});

export const selectContaminatedSurfaceAreaPercentageToDecontaminate = createSelector(
  [selectCreationData, selectSiteData],
  (creationData, siteData): number => {
    const surfaceToDecontaminate = creationData.decontaminatedSurfaceArea;
    const contaminatedSurfaceArea = siteData?.contaminatedSoilSurface;
    if (!contaminatedSurfaceArea || !surfaceToDecontaminate) return 0;

    return computePercentage(surfaceToDecontaminate, contaminatedSurfaceArea);
  },
);

type SitePurchaseAmounts = {
  sellingPrice: number;
  propertyTransferDuties?: number;
};
export const selectSitePurchaseAmounts = createSelector(
  [selectCreationData],
  (creationData): SitePurchaseAmounts | undefined => {
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

export const selectProjectScheduleInitialValues = createSelector(
  [selectCreationData, selectDefaultSchedule],
  (creationData, defaultSchedule): ProjectSchedule => {
    if (creationData.installationSchedule && creationData.firstYearOfOperation) {
      return new ProjectScheduleBuilder()
        .withInstallation(creationData.installationSchedule)
        .withFirstYearOfOperations(creationData.firstYearOfOperation)
        .withReinstatement(creationData.reinstatementSchedule)
        .build();
    }

    return defaultSchedule;
  },
);

export const selectProjectPhase = createSelector(
  [selectCreationData],
  (creationData) => creationData.projectPhase,
);

export const selectNameAndDescriptionInitialValues = createSelector(
  [selectCreationData],
  (creationData) => {
    if (!creationData.name) return { name: generateUrbanProjectName() };
    return {
      name: creationData.name,
      description: creationData.description,
    };
  },
);
