import { SoilsDistribution, SoilType } from "shared";

import { SurfaceAreaDistributionEntryMode } from "../siteFoncier.types";
import { createStepCompletedAction } from "./actionsUtils";
import { createStepRevertAttempted } from "./revert.actions";

export const soilsIntroductionStepCompleted = createStepCompletedAction("SOILS_INTRODUCTION");
export const soilsIntroductionStepReverted = createStepRevertAttempted("SOILS_INTRODUCTION");

export const siteSurfaceAreaStepCompleted = createStepCompletedAction<{ surfaceArea: number }>(
  "SURFACE_AREA",
);
export const siteSurfaceAreaStepReverted = () =>
  createStepRevertAttempted("SURFACE_AREA")({ resetFields: ["surfaceArea"] });

export const soilsSelectionStepCompleted = createStepCompletedAction<{ soils: SoilType[] }>(
  "SOILS_SELECTION",
);
export const soilsSelectionReverted = () =>
  createStepRevertAttempted("SOILS_SELECTION")({ resetFields: ["soils"] });

export const soilsSurfaceAreaDistributionEntryModeCompleted =
  createStepCompletedAction<SurfaceAreaDistributionEntryMode>(
    "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
  );
export const soilsSurfaceAreaDistributionEntryModeStepReverted = () =>
  createStepRevertAttempted("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE")({
    resetFields: ["soilsDistributionEntryMode", "soilsDistribution"],
  });

export const soilsDistributionStepCompleted = createStepCompletedAction<{
  distribution: SoilsDistribution;
}>("SOILS_SURFACE_AREAS_DISTRIBUTION");
export const soilsDistributionStepReverted = () =>
  createStepRevertAttempted("SOILS_SURFACE_AREAS_DISTRIBUTION")({
    resetFields: ["soilsDistribution"],
  });

export const soilsSummaryStepCompleted = createStepCompletedAction("SOILS_SUMMARY");
export const soilsSummaryStepReverted = createStepRevertAttempted("SOILS_SUMMARY");

export const soilsCarbonStorageStepCompleted = createStepCompletedAction("SOILS_CARBON_STORAGE");
export const soilsCarbonStorageStepReverted = createStepRevertAttempted("SOILS_CARBON_STORAGE");
