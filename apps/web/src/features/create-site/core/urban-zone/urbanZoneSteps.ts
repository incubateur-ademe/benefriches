import z from "zod";

export const INTRODUCTION_STEPS = [
  "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION",
  "URBAN_ZONE_MANAGEMENT_INTRODUCTION",
  "URBAN_ZONE_NAMING_INTRODUCTION",
] as const;

export const SUMMARY_STEPS = [
  "URBAN_ZONE_SOILS_SUMMARY",
  "URBAN_ZONE_FINAL_SUMMARY",
  "URBAN_ZONE_CREATION_RESULT",
] as const;

export const ANSWER_STEP_IDS = [
  "URBAN_ZONE_LAND_PARCELS_SELECTION",
  "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
  "URBAN_ZONE_LAND_PARCEL_SOILS_SELECTION",
  "URBAN_ZONE_LAND_PARCEL_SOILS_DISTRIBUTION",
  "URBAN_ZONE_LAND_PARCEL_BUILDINGS_FLOOR_AREA",
  "URBAN_ZONE_SOILS_CONTAMINATION",
  "URBAN_ZONE_MANAGER",
  "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
  "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
  "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
  "URBAN_ZONE_NAMING",
] as const;

export type UrbanZoneIntroductionStep = (typeof INTRODUCTION_STEPS)[number];
export type UrbanZoneSummaryStep = (typeof SUMMARY_STEPS)[number];
export type UrbanZoneAnswerStepId = (typeof ANSWER_STEP_IDS)[number];

export type UrbanZoneSiteCreationStep =
  | UrbanZoneIntroductionStep
  | UrbanZoneSummaryStep
  | UrbanZoneAnswerStepId;

// Schemas will be added here as steps are implemented in phases 3-5
export const answersByStepSchemas = {} as const;

export type AnswersByStep = {
  [K in keyof typeof answersByStepSchemas]: z.infer<(typeof answersByStepSchemas)[K]>;
};

export type UrbanZoneStepsState = Partial<{
  [K in keyof AnswersByStep]: {
    completed: boolean;
    payload?: AnswersByStep[K];
    defaultValues?: AnswersByStep[K];
  };
}>;
