import { SoilsDistribution, SoilType } from "shared";

import { createSiteCreationAction, createStepCompletedAction } from "./actionsUtils";

export const surfaceAreaInputModeUpdated = createSiteCreationAction<"percentage" | "squareMeters">(
  "SURFACE_AREA_INPUT_MODE_UPDATED",
);

export const soilsIntroductionStepCompleted = createStepCompletedAction("SPACES_INTRODUCTION");

export const siteSurfaceAreaStepCompleted = createStepCompletedAction<{ surfaceArea: number }>(
  "SURFACE_AREA",
);

export const spacesKnowledgeStepCompleted = createStepCompletedAction<{ knowsSpaces: boolean }>(
  "SPACES_KNOWLEDGE",
);

export const soilsSelectionStepCompleted = createStepCompletedAction<{ soils: SoilType[] }>(
  "SPACES_SELECTION",
);

export const spacesSurfaceAreaDistributionKnowledgeCompleted = createStepCompletedAction<{
  knowsSurfaceAreas: boolean;
}>("SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE");

export const soilsDistributionStepCompleted = createStepCompletedAction<{
  distribution: SoilsDistribution;
}>("SPACES_SURFACE_AREA_DISTRIBUTION");

export const soilsSummaryStepCompleted = createStepCompletedAction("SOILS_SUMMARY");

export const soilsCarbonStorageStepCompleted = createStepCompletedAction("SOILS_CARBON_STORAGE");
