import z from "zod";

import { landParcelsSelectionStepperConfig } from "../steps/land-parcels/land-parcels-selection/landParcelsSelection.stepperConfig";
import { landParcelsSurfaceDistributionStepperConfig } from "../steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.stepperConfig";
import { parcelBuildingsFloorAreaStepperConfig } from "../steps/per-parcel-soils/parcelBuildingsFloorArea.stepperConfig";
import { parcelSoilsDistributionStepperConfig } from "../steps/per-parcel-soils/parcelSoilsDistribution.stepperConfig";
import { soilsAndSpacesIntroductionStepperConfig } from "../steps/soils-and-spaces-introduction/soilsAndSpacesIntroduction.stepperConfig";
import { soilsSummaryStepperConfig } from "../steps/summary/soils-summary/soilsSummary.stepperConfig";
import type { UrbanZoneSiteCreationStep } from "../urbanZoneSteps";

const urbanZoneStepGroupIdSchema = z.enum([
  "LAND_PARCELS",
  "SOILS_AND_SPACES",
  "CONTAMINATION",
  "MANAGEMENT",
  "NAMING",
  "SUMMARY",
]);

export type UrbanZoneStepGroupId = z.infer<typeof urbanZoneStepGroupIdSchema>;

export const URBAN_ZONE_STEP_GROUP_IDS = urbanZoneStepGroupIdSchema.options;

// Each step's group assignment is colocated with its handler in *.stepperConfig.ts files
// This file defines the group labels for the urban zone stepper sidebar
export const URBAN_ZONE_STEP_GROUP_LABELS: Record<UrbanZoneStepGroupId, string> = {
  LAND_PARCELS: "Surfaces foncières",
  SOILS_AND_SPACES: "Sols et espaces",
  CONTAMINATION: "Pollution",
  MANAGEMENT: "Gestion et activité",
  NAMING: "Dénomination",
  SUMMARY: "Récapitulatif",
};

export type UrbanZoneStepStepperConfig = {
  groupId: UrbanZoneStepGroupId;
  label: string;
};

export const URBAN_ZONE_STEP_TO_GROUP: Record<
  UrbanZoneSiteCreationStep,
  { groupId: UrbanZoneStepGroupId }
> = {
  // Land parcels
  URBAN_ZONE_LAND_PARCELS_SELECTION: landParcelsSelectionStepperConfig,
  URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: landParcelsSurfaceDistributionStepperConfig,

  // Soils and spaces introduction
  URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION: soilsAndSpacesIntroductionStepperConfig,

  // Per-parcel soils distribution (all share the same config)
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: parcelSoilsDistributionStepperConfig,
  URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: parcelSoilsDistributionStepperConfig,
  URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION: parcelSoilsDistributionStepperConfig,
  URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION: parcelSoilsDistributionStepperConfig,

  // Per-parcel buildings floor area (all share the same config)
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: parcelBuildingsFloorAreaStepperConfig,
  URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA: parcelBuildingsFloorAreaStepperConfig,
  URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA: parcelBuildingsFloorAreaStepperConfig,
  URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA: parcelBuildingsFloorAreaStepperConfig,

  // Soils summary
  URBAN_ZONE_SOILS_SUMMARY: soilsSummaryStepperConfig,

  // Contamination (not yet implemented)
  URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION: { groupId: "CONTAMINATION" },
  URBAN_ZONE_SOILS_CONTAMINATION: { groupId: "CONTAMINATION" },

  // Management (not yet implemented)
  URBAN_ZONE_MANAGEMENT_INTRODUCTION: { groupId: "MANAGEMENT" },
  URBAN_ZONE_MANAGER: { groupId: "MANAGEMENT" },
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: { groupId: "MANAGEMENT" },
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: { groupId: "MANAGEMENT" },
  URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: { groupId: "MANAGEMENT" },

  // Naming (not yet implemented)
  URBAN_ZONE_NAMING_INTRODUCTION: { groupId: "NAMING" },
  URBAN_ZONE_NAMING: { groupId: "NAMING" },

  // Summary (not yet implemented)
  URBAN_ZONE_FINAL_SUMMARY: { groupId: "SUMMARY" },
  URBAN_ZONE_CREATION_RESULT: { groupId: "SUMMARY" },
};
