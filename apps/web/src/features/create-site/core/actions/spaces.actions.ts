import { SoilsDistribution, SoilType } from "shared";

import { SurfaceAreaDistributionEntryMode } from "../siteFoncier.types";
import { createStepCompletedAction, createStepRevertedAction } from "./actionsUtils";

export const soilsIntroductionStepCompleted = createStepCompletedAction("SOILS_INTRODUCTION");
export const soilsIntroductionStepReverted = createStepRevertedAction("SOILS_INTRODUCTION");

export const siteSurfaceAreaStepCompleted = createStepCompletedAction<{ surfaceArea: number }>(
  "SURFACE_AREA",
);
export const siteSurfaceAreaStepReverted = () =>
  createStepRevertedAction("SURFACE_AREA")({ resetFields: ["surfaceArea"] });

export const soilsSelectionStepCompleted = createStepCompletedAction<{ soils: SoilType[] }>(
  "SOILS_SELECTION",
);
export const soilsSelectionReverted = () =>
  createStepRevertedAction("SOILS_SELECTION")({ resetFields: ["soils"] });

export const soilsSurfaceAreaDistributionEntryModeCompleted =
  createStepCompletedAction<SurfaceAreaDistributionEntryMode>(
    "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE",
  );
export const soilsSurfaceAreaDistributionEntryModeStepReverted = () =>
  createStepRevertedAction("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE")({
    resetFields: ["soilsDistributionEntryMode", "soilsDistribution"],
  });

export const soilsDistributionStepCompleted = createStepCompletedAction<{
  distribution: SoilsDistribution;
}>("SOILS_SURFACE_AREAS_DISTRIBUTION");
export const soilsDistributionStepReverted = () =>
  createStepRevertedAction("SOILS_SURFACE_AREAS_DISTRIBUTION")({
    resetFields: ["soilsDistribution"],
  });

export const soilsSummaryStepCompleted = createStepCompletedAction("SOILS_SUMMARY");
export const soilsSummaryStepReverted = createStepRevertedAction("SOILS_SUMMARY");

export const soilsCarbonStorageStepCompleted = createStepCompletedAction("SOILS_CARBON_STORAGE");
export const soilsCarbonStorageStepReverted = createStepRevertedAction("SOILS_CARBON_STORAGE");
