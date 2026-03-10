export type UrbanZoneStepGroupId =
  | "LAND_PARCELS"
  | "SOILS_AND_SPACES"
  | "CONTAMINATION"
  | "MANAGEMENT"
  | "NAMING"
  | "SUMMARY";

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
