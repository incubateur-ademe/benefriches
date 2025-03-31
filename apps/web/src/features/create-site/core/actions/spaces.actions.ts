import { SoilsDistribution, SoilType } from "shared";

import { SurfaceAreaDistributionEntryMode } from "../siteFoncier.types";
import { createStepCompletedAction } from "./actionsUtils";

export const soilsIntroductionStepCompleted = createStepCompletedAction("SOILS_INTRODUCTION");

export const siteSurfaceAreaStepCompleted = createStepCompletedAction<{ surfaceArea: number }>(
  "SURFACE_AREA",
);

export const spacesKnowledgeStepCompleted = createStepCompletedAction<{ knowsSpaces: boolean }>(
  "SPACES_KNOWLEDGE",
);

export const soilsSelectionStepCompleted = createStepCompletedAction<{ soils: SoilType[] }>(
  "SOILS_SELECTION",
);

export const soilsSurfaceAreaDistributionEntryModeCompleted =
  createStepCompletedAction<SurfaceAreaDistributionEntryMode>(
    "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
  );

export const soilsDistributionStepCompleted = createStepCompletedAction<{
  distribution: SoilsDistribution;
}>("SOILS_SURFACE_AREAS_DISTRIBUTION");

export const soilsSummaryStepCompleted = createStepCompletedAction("SOILS_SUMMARY");

export const soilsCarbonStorageStepCompleted = createStepCompletedAction("SOILS_CARBON_STORAGE");
