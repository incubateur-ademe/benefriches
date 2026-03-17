import z from "zod";

import { soilsContaminationSchema } from "./steps/contamination/soilsContamination.schema";
import { localAuthorityExpensesSchema } from "./steps/expenses/local-authority-expenses/localAuthorityExpenses.schema";
import { vacantPremisesExpensesSchema } from "./steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.schema";
import { zoneManagementExpensesSchema } from "./steps/expenses/zone-management-expenses/zoneManagementExpenses.schema";
import { zoneManagementIncomeSchema } from "./steps/expenses/zone-management-income/zoneManagementIncome.schema";
import { landParcelsSelectionSchema } from "./steps/land-parcels/land-parcels-selection/landParcelsSelection.schema";
import { landParcelsSurfaceDistributionSchema } from "./steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.schema";
import { fullTimeJobsEquivalentSchema } from "./steps/management/full-time-jobs-equivalent/fullTimeJobsEquivalent.schema";
import { managerSchema } from "./steps/management/manager/manager.schema";
import { vacantCommercialPremisesFloorAreaSchema } from "./steps/management/vacant-commercial-premises-floor-area/vacantCommercialPremisesFloorArea.schema";
import { vacantCommercialPremisesFootprintSchema } from "./steps/management/vacant-commercial-premises-footprint/vacantCommercialPremisesFootprint.schema";
import { namingSchema } from "./steps/naming/naming.schema";
import { landParcelBuildingsFloorAreaSchema } from "./steps/per-parcel-soils/land-parcel-buildings-floor-area/landParcelBuildingsFloorArea.schema";
import { landParcelSoilsDistributionSchema } from "./steps/per-parcel-soils/land-parcel-soils-distribution/landParcelSoilsDistribution.schema";

export const INTRODUCTION_STEPS = [
  "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION",
  "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION",
  "URBAN_ZONE_MANAGEMENT_INTRODUCTION",
  "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
  "URBAN_ZONE_NAMING_INTRODUCTION",
] as const;

export const SUMMARY_STEPS = [
  "URBAN_ZONE_SOILS_SUMMARY",
  "URBAN_ZONE_SOILS_CARBON_STORAGE",
  "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY",
  "URBAN_ZONE_FINAL_SUMMARY",
  "URBAN_ZONE_CREATION_RESULT",
] as const;

// All planned answer step IDs — drives the step union type and navigation
export const ANSWER_STEP_IDS = [
  "URBAN_ZONE_LAND_PARCELS_SELECTION",
  "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
  // Per-parcel soils distribution (one per parcel type)
  "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
  "URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION",
  "URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION",
  "URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION",
  // Per-parcel buildings floor area (one per parcel type)
  "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
  "URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA",
  "URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA",
  "URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA",
  "URBAN_ZONE_SOILS_CONTAMINATION",
  "URBAN_ZONE_MANAGER",
  "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
  "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
  "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",
  // Expenses and incomes
  "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
  "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",
  "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",
  "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",
  // Naming
  "URBAN_ZONE_NAMING",
] as const;

export type UrbanZoneIntroductionStep = (typeof INTRODUCTION_STEPS)[number];
export type UrbanZoneSummaryStep = (typeof SUMMARY_STEPS)[number];

// All planned answer step IDs (drives SiteCreationStep union and navigation)
export type UrbanZoneAnswerStepId = (typeof ANSWER_STEP_IDS)[number];

export type UrbanZoneSiteCreationStep =
  | UrbanZoneIntroductionStep
  | UrbanZoneSummaryStep
  | UrbanZoneAnswerStepId;

// Schemas registered here as each step is implemented (Phase 3+)
// Keys must be a subset of UrbanZoneAnswerStepId
export const answersByStepSchemas = {
  URBAN_ZONE_LAND_PARCELS_SELECTION: landParcelsSelectionSchema,
  URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: landParcelsSurfaceDistributionSchema,
  // Per-parcel soils distribution — all share the same schema
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: landParcelSoilsDistributionSchema,
  URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: landParcelSoilsDistributionSchema,
  URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION: landParcelSoilsDistributionSchema,
  URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION: landParcelSoilsDistributionSchema,
  // Per-parcel buildings floor area — all share the same schema
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: landParcelBuildingsFloorAreaSchema,
  URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA: landParcelBuildingsFloorAreaSchema,
  URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA: landParcelBuildingsFloorAreaSchema,
  URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA: landParcelBuildingsFloorAreaSchema,
  // Contamination
  URBAN_ZONE_SOILS_CONTAMINATION: soilsContaminationSchema,
  // Management
  URBAN_ZONE_MANAGER: managerSchema,
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: vacantCommercialPremisesFootprintSchema,
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: vacantCommercialPremisesFloorAreaSchema,
  URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: fullTimeJobsEquivalentSchema,
  // Expenses and incomes
  URBAN_ZONE_VACANT_PREMISES_EXPENSES: vacantPremisesExpensesSchema,
  URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES: zoneManagementExpensesSchema,
  URBAN_ZONE_ZONE_MANAGEMENT_INCOME: zoneManagementIncomeSchema,
  URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES: localAuthorityExpensesSchema,
  // Naming
  URBAN_ZONE_NAMING: namingSchema,
} as const;

// Step IDs that currently have registered schemas
export type SchematizedAnswerStepId = keyof typeof answersByStepSchemas;

export type AnswersByStep = {
  [K in SchematizedAnswerStepId]: z.infer<(typeof answersByStepSchemas)[K]>;
};

export type UrbanZoneStepsState = Partial<{
  [K in SchematizedAnswerStepId]: {
    completed: boolean;
    payload?: AnswersByStep[K];
    defaultValues?: AnswersByStep[K];
  };
}>;

const URBAN_ZONE_STEP_HANDLER_STEPS_SET: ReadonlySet<string> = new Set([
  ...INTRODUCTION_STEPS,
  ...SUMMARY_STEPS,
  ...ANSWER_STEP_IDS,
]);

export const isUrbanZoneStepHandlerStep = (stepId: string): stepId is UrbanZoneSiteCreationStep =>
  URBAN_ZONE_STEP_HANDLER_STEPS_SET.has(stepId);
