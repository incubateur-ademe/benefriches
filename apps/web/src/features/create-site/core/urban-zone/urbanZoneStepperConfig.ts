import z from "zod";

import type { StepVariant } from "@/shared/core/stepVariant.types";
import type { StepToGroupMapping } from "@/shared/core/wizard-form/helpers/stepGroups";

import { soilsContaminationStepperConfig } from "./steps/contamination/soilsContamination.stepperConfig";
import { soilsContaminationIntroductionStepperConfig } from "./steps/contamination/soilsContaminationIntroduction.stepperConfig";
import { creationResultStepperConfig } from "./steps/creation-result/creationResult.stepperConfig";
import { expensesAndIncomeIntroductionStepperConfig } from "./steps/expenses/expenses-introduction/expensesAndIncomeIntroduction.stepperConfig";
import { expensesAndIncomeSummaryStepperConfig } from "./steps/expenses/expenses-summary/expensesAndIncomeSummary.stepperConfig";
import { localAuthorityExpensesStepperConfig } from "./steps/expenses/local-authority-expenses/localAuthorityExpenses.stepperConfig";
import { vacantPremisesExpensesStepperConfig } from "./steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.stepperConfig";
import { zoneManagementExpensesStepperConfig } from "./steps/expenses/zone-management-expenses/zoneManagementExpenses.stepperConfig";
import { zoneManagementIncomeStepperConfig } from "./steps/expenses/zone-management-income/zoneManagementIncome.stepperConfig";
import { finalSummaryStepperConfig } from "./steps/final-summary/finalSummary.stepperConfig";
import { landParcelsSelectionStepperConfig } from "./steps/land-parcels/land-parcels-selection/landParcelsSelection.stepperConfig";
import { landParcelsSurfaceDistributionStepperConfig } from "./steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.stepperConfig";
import { fullTimeJobsEquivalentStepperConfig } from "./steps/management/full-time-jobs-equivalent/fullTimeJobsEquivalent.stepperConfig";
import { managementIntroductionStepperConfig } from "./steps/management/management-introduction/managementIntroduction.stepperConfig";
import { managerStepperConfig } from "./steps/management/manager/manager.stepperConfig";
import { vacantCommercialPremisesFloorAreaStepperConfig } from "./steps/management/vacant-commercial-premises-floor-area/vacantCommercialPremisesFloorArea.stepperConfig";
import { vacantCommercialPremisesFootprintStepperConfig } from "./steps/management/vacant-commercial-premises-footprint/vacantCommercialPremisesFootprint.stepperConfig";
import { namingStepperConfig } from "./steps/naming/naming.stepperConfig";
import { namingIntroductionStepperConfig } from "./steps/naming/namingIntroduction.stepperConfig";
import { parcelBuildingsFloorAreaStepperConfig } from "./steps/per-parcel-soils/parcelBuildingsFloorArea.stepperConfig";
import { parcelSoilsDistributionStepperConfig } from "./steps/per-parcel-soils/parcelSoilsDistribution.stepperConfig";
import { soilsAndSpacesIntroductionStepperConfig } from "./steps/soils-and-spaces-introduction/soilsAndSpacesIntroduction.stepperConfig";
import { soilsCarbonStorageStepperConfig } from "./steps/summary/soils-carbon-storage/soilsCarbonStorage.stepperConfig";
import { soilsSummaryStepperConfig } from "./steps/summary/soils-summary/soilsSummary.stepperConfig";
import {
  ANSWER_STEP_IDS,
  type UrbanZoneSiteCreationStep,
  type UrbanZoneStepsState,
} from "./urbanZoneSteps";

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

/**
 * Sub-group ids (ticket 19) — a finer split than `UrbanZoneStepGroupId`, used only to nest the
 * update sidebar's sub-steps under their active group (`SiteUpdateStepper.tsx`). A group whose
 * navigable steps reduce to a single sub-group (CONTAMINATION, NAMING) has none: those keep
 * rendering as leaves, exactly as before this ticket.
 */
export const urbanZoneStepSubGroupIdSchema = z.enum([
  "LAND_PARCELS_SELECTION",
  "LAND_PARCELS_SURFACE_DISTRIBUTION",
  "PARCEL_SOILS_DISTRIBUTION",
  "PARCEL_BUILDINGS_FLOOR_AREA",
  "MANAGER",
  "VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
  "VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
  "FULL_TIME_JOBS_EQUIVALENT",
  "VACANT_PREMISES_EXPENSES",
  "ZONE_MANAGEMENT_EXPENSES",
  "ZONE_MANAGEMENT_INCOME",
  "LOCAL_AUTHORITY_EXPENSES",
]);
export type UrbanZoneStepSubGroupId = z.infer<typeof urbanZoneStepSubGroupIdSchema>;

// Each step's group assignment is colocated with its handler in *.stepperConfig.ts files
// This file defines the group labels for the urban zone stepper sidebar
export const URBAN_ZONE_STEP_GROUP_LABELS: Record<
  UrbanZoneStepGroupId | UrbanZoneStepSubGroupId,
  string
> = {
  LAND_PARCELS: "Surfaces foncières",
  SOILS_AND_SPACES: "Sols et espaces",
  CONTAMINATION: "Pollution",
  MANAGEMENT: "Gestion et activité",
  EXPENSES: "Dépenses et recettes",
  NAMING: "Dénomination",
  SUMMARY: "Récapitulatif",
  LAND_PARCELS_SELECTION: "Sélection des surfaces foncières",
  LAND_PARCELS_SURFACE_DISTRIBUTION: "Superficie des surfaces foncières",
  PARCEL_SOILS_DISTRIBUTION: "Superficie des sols",
  PARCEL_BUILDINGS_FLOOR_AREA: "Surface de plancher des bâtiments",
  MANAGER: "Gestionnaire",
  VACANT_COMMERCIAL_PREMISES_FOOTPRINT: "Emprise foncière des locaux vacants",
  VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: "Surface de plancher des locaux vacants",
  FULL_TIME_JOBS_EQUIVALENT: "Emplois en équivalent temps plein",
  VACANT_PREMISES_EXPENSES: "Dépenses locaux vacants",
  ZONE_MANAGEMENT_EXPENSES: "Dépenses gestion zone",
  ZONE_MANAGEMENT_INCOME: "Recettes gestion zone",
  LOCAL_AUTHORITY_EXPENSES: "Dépenses collectivité",
};

export type UrbanZoneStepStepperConfig = {
  groupId: UrbanZoneStepGroupId;
  label: string;
  subGroupId?: UrbanZoneStepSubGroupId;
};

export const URBAN_ZONE_STEP_TO_GROUP: StepToGroupMapping<
  UrbanZoneSiteCreationStep,
  UrbanZoneStepGroupId,
  UrbanZoneStepSubGroupId
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

/**
 * The urban-zone final summary's section mapping (ticket 15) — a finer split than
 * `URBAN_ZONE_STEP_TO_GROUP` above, whose sidebar groups don't map 1:1 to `UrbanZoneFinalSummary`'s
 * sections (there is no dedicated 📍 Localisation sidebar group — that data lives on the custom
 * engine, see index.tsx's `onNavigateToCustomStep` — and EXPENSES has no summary section at all).
 */
export const urbanZoneSummarySectionIdSchema = z.enum([
  "LOCATION",
  "LAND_PARCELS",
  "SOILS",
  "CONTAMINATION",
  "MANAGEMENT",
  "EXPENSES",
  "NAMING",
]);
export type UrbanZoneSummarySectionId = z.infer<typeof urbanZoneSummarySectionIdSchema>;

// Total over every urban-zone step id. The expense/income steps have no home in the final
// summary (it renders no "💸 Dépenses et recettes" section) — bucketed under their own EXPENSES
// group (kept out of MANAGEMENT so they don't pollute its completion/warning/target) which
// `UrbanZoneFinalSummaryContainer` simply never reads when building `sectionProps`.
export const URBAN_ZONE_STEP_TO_SUMMARY_SECTION: Record<
  UrbanZoneSiteCreationStep,
  { groupId: UrbanZoneSummarySectionId }
> = {
  URBAN_ZONE_LAND_PARCELS_SELECTION: { groupId: "LAND_PARCELS" },
  URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: { groupId: "LAND_PARCELS" },

  URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION: { groupId: "SOILS" },
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION: { groupId: "SOILS" },
  URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION: { groupId: "SOILS" },
  URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION: { groupId: "SOILS" },
  URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION: { groupId: "SOILS" },
  URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA: { groupId: "SOILS" },
  URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA: { groupId: "SOILS" },
  URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA: { groupId: "SOILS" },
  URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA: { groupId: "SOILS" },
  URBAN_ZONE_SOILS_SUMMARY: { groupId: "SOILS" },
  URBAN_ZONE_SOILS_CARBON_STORAGE: { groupId: "SOILS" },

  URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION: { groupId: "CONTAMINATION" },
  URBAN_ZONE_SOILS_CONTAMINATION: { groupId: "CONTAMINATION" },

  URBAN_ZONE_MANAGEMENT_INTRODUCTION: { groupId: "MANAGEMENT" },
  URBAN_ZONE_MANAGER: { groupId: "MANAGEMENT" },
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: { groupId: "MANAGEMENT" },
  URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA: { groupId: "MANAGEMENT" },
  URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT: { groupId: "MANAGEMENT" },

  // Not surfaced in the final summary (no dedicated section) — see comment above.
  URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION: { groupId: "EXPENSES" },
  URBAN_ZONE_VACANT_PREMISES_EXPENSES: { groupId: "EXPENSES" },
  URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES: { groupId: "EXPENSES" },
  URBAN_ZONE_ZONE_MANAGEMENT_INCOME: { groupId: "EXPENSES" },
  URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY: { groupId: "EXPENSES" },
  URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES: { groupId: "EXPENSES" },

  URBAN_ZONE_NAMING_INTRODUCTION: { groupId: "NAMING" },
  URBAN_ZONE_NAMING: { groupId: "NAMING" },

  // Not surfaced as a distinct summary section — arbitrary but total mapping, filtered out by
  // isNavigableUrbanZoneStep before any section is built.
  URBAN_ZONE_FINAL_SUMMARY: { groupId: "NAMING" },
  URBAN_ZONE_CREATION_RESULT: { groupId: "NAMING" },
};

const NAVIGABLE_URBAN_ZONE_STEP_IDS: ReadonlySet<string> = new Set(ANSWER_STEP_IDS);

/** Only answer steps (not intros/summaries) are direct-navigation targets. */
export const isNavigableUrbanZoneStep = (stepId: UrbanZoneSiteCreationStep): boolean =>
  NAVIGABLE_URBAN_ZONE_STEP_IDS.has(stepId);

export type UrbanZoneStepperSubGroup = StepVariant & {
  subGroupId: UrbanZoneStepSubGroupId;
  title: string;
  targetStepId: UrbanZoneSiteCreationStep;
};

export type UrbanZoneStepperGroup = StepVariant & {
  groupId: UrbanZoneStepGroupId;
  title: string;
  targetStepId: UrbanZoneSiteCreationStep;
  subGroups: UrbanZoneStepperSubGroup[];
};

const isUrbanZoneStepCompleted = (
  stepId: UrbanZoneSiteCreationStep,
  steps: UrbanZoneStepsState,
): boolean =>
  Boolean((steps as Record<string, { completed?: boolean } | undefined>)[stepId]?.completed);

/**
 * The update wizard's clickable-sidebar data for the urban-zone sub-flow, transcribed from
 * `computeCustomStepperGroups` (ticket 10, sub-groups added ticket 19). One entry per group, each
 * pointing at its first not-yet-completed navigable (answer) step in the walked sequence, falling
 * back to the group's first walked step. The SUMMARY group has no navigable steps of its own and
 * is left out.
 *
 * Each group's navigable steps are further bucketed into `subGroups`, in order of first
 * appearance in `stepsSequence`, mirroring `useBuildStepperNavigationItems`'s semantics: a group
 * with a current sub-group becomes "groupActive" (rather than "current") so the update sidebar
 * renders it expanded, with exactly that sub-group marked "current".
 */
export const computeUrbanZoneStepperGroups = ({
  currentStep,
  steps,
  stepsSequence,
}: {
  currentStep: UrbanZoneSiteCreationStep;
  steps: UrbanZoneStepsState;
  stepsSequence: UrbanZoneSiteCreationStep[];
}): UrbanZoneStepperGroup[] => {
  const { groupId: currentGroupId, subGroupId: currentSubGroupId } =
    URBAN_ZONE_STEP_TO_GROUP[currentStep];
  const isStepCompleted = (stepId: UrbanZoneSiteCreationStep) =>
    isUrbanZoneStepCompleted(stepId, steps);

  return URBAN_ZONE_STEP_GROUP_IDS.filter(
    (groupId) =>
      groupId !== "SUMMARY" &&
      stepsSequence.some((stepId) => URBAN_ZONE_STEP_TO_GROUP[stepId].groupId === groupId),
  ).map((groupId) => {
    const stepsInGroup = stepsSequence.filter(
      (stepId) => URBAN_ZONE_STEP_TO_GROUP[stepId].groupId === groupId,
    );
    const navigableStepsInGroup = stepsInGroup.filter(isNavigableUrbanZoneStep);

    const firstIncompleteStep = navigableStepsInGroup.find((stepId) => !isStepCompleted(stepId));
    const targetStepId = firstIncompleteStep ?? navigableStepsInGroup[0] ?? currentStep;

    const isCurrentGroup = groupId === currentGroupId;

    const subGroupIds: UrbanZoneStepSubGroupId[] = [];
    for (const stepId of navigableStepsInGroup) {
      const { subGroupId } = URBAN_ZONE_STEP_TO_GROUP[stepId];
      if (subGroupId !== undefined && !subGroupIds.includes(subGroupId)) {
        subGroupIds.push(subGroupId);
      }
    }

    const subGroups: UrbanZoneStepperSubGroup[] = subGroupIds.map((subGroupId) => {
      const stepsInSubGroup = navigableStepsInGroup.filter(
        (stepId) => URBAN_ZONE_STEP_TO_GROUP[stepId].subGroupId === subGroupId,
      );
      const firstIncompleteSubGroupStep = stepsInSubGroup.find(
        (stepId) => !isStepCompleted(stepId),
      );

      return {
        subGroupId,
        title: URBAN_ZONE_STEP_GROUP_LABELS[subGroupId],
        targetStepId: firstIncompleteSubGroupStep ?? stepsInSubGroup[0] ?? currentStep,
        activity: isCurrentGroup && currentSubGroupId === subGroupId ? "current" : "inactive",
        validation: stepsInSubGroup.every(isStepCompleted) ? "completed" : "empty",
      };
    });

    return {
      groupId,
      title: URBAN_ZONE_STEP_GROUP_LABELS[groupId],
      targetStepId,
      activity: isCurrentGroup
        ? currentSubGroupId !== undefined
          ? "groupActive"
          : "current"
        : "inactive",
      validation:
        navigableStepsInGroup.length > 0 && navigableStepsInGroup.every(isStepCompleted)
          ? "completed"
          : "empty",
      subGroups,
    };
  });
};
