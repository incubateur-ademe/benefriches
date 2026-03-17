import z from "zod";

import { soilsContaminationStepperConfig } from "../steps/contamination/soilsContamination.stepperConfig";
import { soilsContaminationIntroductionStepperConfig } from "../steps/contamination/soilsContaminationIntroduction.stepperConfig";
import { creationResultStepperConfig } from "../steps/creation-result/creationResult.stepperConfig";
import { expensesAndIncomeIntroductionStepperConfig } from "../steps/expenses/expenses-introduction/expensesAndIncomeIntroduction.stepperConfig";
import { expensesAndIncomeSummaryStepperConfig } from "../steps/expenses/expenses-summary/expensesAndIncomeSummary.stepperConfig";
import { localAuthorityExpensesStepperConfig } from "../steps/expenses/local-authority-expenses/localAuthorityExpenses.stepperConfig";
import { vacantPremisesExpensesStepperConfig } from "../steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.stepperConfig";
import { zoneManagementExpensesStepperConfig } from "../steps/expenses/zone-management-expenses/zoneManagementExpenses.stepperConfig";
import { zoneManagementIncomeStepperConfig } from "../steps/expenses/zone-management-income/zoneManagementIncome.stepperConfig";
import { finalSummaryStepperConfig } from "../steps/final-summary/finalSummary.stepperConfig";
import { landParcelsSelectionStepperConfig } from "../steps/land-parcels/land-parcels-selection/landParcelsSelection.stepperConfig";
import { landParcelsSurfaceDistributionStepperConfig } from "../steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.stepperConfig";
import { fullTimeJobsEquivalentStepperConfig } from "../steps/management/full-time-jobs-equivalent/fullTimeJobsEquivalent.stepperConfig";
import { managementIntroductionStepperConfig } from "../steps/management/management-introduction/managementIntroduction.stepperConfig";
import { managerStepperConfig } from "../steps/management/manager/manager.stepperConfig";
import { vacantCommercialPremisesFloorAreaStepperConfig } from "../steps/management/vacant-commercial-premises-floor-area/vacantCommercialPremisesFloorArea.stepperConfig";
import { vacantCommercialPremisesFootprintStepperConfig } from "../steps/management/vacant-commercial-premises-footprint/vacantCommercialPremisesFootprint.stepperConfig";
import { namingStepperConfig } from "../steps/naming/naming.stepperConfig";
import { namingIntroductionStepperConfig } from "../steps/naming/namingIntroduction.stepperConfig";
import { parcelBuildingsFloorAreaStepperConfig } from "../steps/per-parcel-soils/parcelBuildingsFloorArea.stepperConfig";
import { parcelSoilsDistributionStepperConfig } from "../steps/per-parcel-soils/parcelSoilsDistribution.stepperConfig";
import { soilsAndSpacesIntroductionStepperConfig } from "../steps/soils-and-spaces-introduction/soilsAndSpacesIntroduction.stepperConfig";
import { soilsCarbonStorageStepperConfig } from "../steps/summary/soils-carbon-storage/soilsCarbonStorage.stepperConfig";
import { soilsSummaryStepperConfig } from "../steps/summary/soils-summary/soilsSummary.stepperConfig";
import type { UrbanZoneSiteCreationStep } from "../urbanZoneSteps";

const urbanZoneStepGroupIdSchema = z.enum([
  "LAND_PARCELS",
  "SOILS_AND_SPACES",
  "CONTAMINATION",
  "MANAGEMENT",
  "EXPENSES",
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
  EXPENSES: "Dépenses et recettes",
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

  // Soils summary and carbon storage
  URBAN_ZONE_SOILS_SUMMARY: soilsSummaryStepperConfig,
  URBAN_ZONE_SOILS_CARBON_STORAGE: soilsCarbonStorageStepperConfig,

  // Contamination
  URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION: soilsContaminationIntroductionStepperConfig,
  URBAN_ZONE_SOILS_CONTAMINATION: soilsContaminationStepperConfig,

  // Management
  URBAN_ZONE_MANAGEMENT_INTRODUCTION: managementIntroductionStepperConfig,
  URBAN_ZONE_MANAGER: managerStepperConfig,
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: vacantCommercialPremisesFootprintStepperConfig,
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: vacantCommercialPremisesFloorAreaStepperConfig,
  URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: fullTimeJobsEquivalentStepperConfig,

  // Expenses and incomes
  URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION: expensesAndIncomeIntroductionStepperConfig,
  // Activity park manager flow
  URBAN_ZONE_VACANT_PREMISES_EXPENSES: vacantPremisesExpensesStepperConfig,
  URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES: zoneManagementExpensesStepperConfig,
  URBAN_ZONE_ZONE_MANAGEMENT_INCOME: zoneManagementIncomeStepperConfig,
  URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY: expensesAndIncomeSummaryStepperConfig,
  // Local authority flow
  URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES: localAuthorityExpensesStepperConfig,

  // Naming
  URBAN_ZONE_NAMING_INTRODUCTION: namingIntroductionStepperConfig,
  URBAN_ZONE_NAMING: namingStepperConfig,

  // Summary
  URBAN_ZONE_FINAL_SUMMARY: finalSummaryStepperConfig,
  URBAN_ZONE_CREATION_RESULT: creationResultStepperConfig,
};
