import z from "zod";

import type { StepVariant } from "@/shared/core/stepVariant.types";
import type { StepToGroupMapping } from "@/shared/core/wizard-form/helpers/stepGroups";

import {
  CUSTOM_ANSWER_STEP_IDS,
  type CustomStepsState,
  type SiteCreationCustomStep,
} from "./customSteps";

/**
 * The custom flow's step groups, transcribed from `views/custom/Stepper.tsx`'s
 * `getCurrentStepCategory` switch (creation's own, non-clickable progress-bar stepper) so the
 * update wizard's clickable stepper and creation's progress bar cannot drift. Mirrors the exact
 * French labels already shown there.
 */
export const customStepGroupIdSchema = z.enum([
  "INTRODUCTION",
  "ADDRESS",
  "SPACES",
  "CONTAMINATION_AND_ACCIDENTS",
  "MANAGEMENT",
  "NAMING",
  "SUMMARY",
]);
export type CustomStepGroupId = z.infer<typeof customStepGroupIdSchema>;

export const CUSTOM_STEP_GROUP_LABELS: Record<CustomStepGroupId, string> = {
  INTRODUCTION: "Introduction",
  ADDRESS: "Adresse",
  SPACES: "Espaces",
  CONTAMINATION_AND_ACCIDENTS: "Pollution et accidents",
  MANAGEMENT: "Gestion du site",
  NAMING: "Dénomination",
  SUMMARY: "Récapitulatif",
};

export const CUSTOM_STEP_TO_GROUP: StepToGroupMapping<
  SiteCreationCustomStep,
  CustomStepGroupId,
  never
> = {
  FRICHE_ACTIVITY: { groupId: "INTRODUCTION" },
  AGRICULTURAL_OPERATION_ACTIVITY: { groupId: "INTRODUCTION" },
  NATURAL_AREA_TYPE: { groupId: "INTRODUCTION" },
  URBAN_ZONE_TYPE: { groupId: "INTRODUCTION" },
  ADDRESS: { groupId: "ADDRESS" },
  SPACES_INTRODUCTION: { groupId: "SPACES" },
  SURFACE_AREA: { groupId: "SPACES" },
  SPACES_KNOWLEDGE: { groupId: "SPACES" },
  SPACES_SELECTION: { groupId: "SPACES" },
  SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE: { groupId: "SPACES" },
  SPACES_SURFACE_AREA_DISTRIBUTION: { groupId: "SPACES" },
  SOILS_SUMMARY: { groupId: "SPACES" },
  SOILS_CARBON_STORAGE: { groupId: "SPACES" },
  URBAN_ZONE_LAND_PARCELS_INTRODUCTION: { groupId: "SPACES" },
  SOILS_CONTAMINATION_INTRODUCTION: { groupId: "CONTAMINATION_AND_ACCIDENTS" },
  SOILS_CONTAMINATION: { groupId: "CONTAMINATION_AND_ACCIDENTS" },
  FRICHE_ACCIDENTS_INTRODUCTION: { groupId: "CONTAMINATION_AND_ACCIDENTS" },
  FRICHE_ACCIDENTS: { groupId: "CONTAMINATION_AND_ACCIDENTS" },
  MANAGEMENT_INTRODUCTION: { groupId: "MANAGEMENT" },
  OWNER: { groupId: "MANAGEMENT" },
  IS_FRICHE_LEASED: { groupId: "MANAGEMENT" },
  IS_SITE_OPERATED: { groupId: "MANAGEMENT" },
  OPERATOR: { groupId: "MANAGEMENT" },
  TENANT: { groupId: "MANAGEMENT" },
  YEARLY_EXPENSES_AND_INCOME_INTRODUCTION: { groupId: "MANAGEMENT" },
  YEARLY_EXPENSES: { groupId: "MANAGEMENT" },
  YEARLY_INCOME: { groupId: "MANAGEMENT" },
  YEARLY_EXPENSES_SUMMARY: { groupId: "MANAGEMENT" },
  NAMING_INTRODUCTION: { groupId: "NAMING" },
  NAMING: { groupId: "NAMING" },
  FINAL_SUMMARY: { groupId: "SUMMARY" },
  CREATION_RESULT: { groupId: "SUMMARY" },
};

const NAVIGABLE_STEP_IDS: ReadonlySet<string> = new Set(CUSTOM_ANSWER_STEP_IDS);

/** Only answer steps (not intros/summaries/notices) are direct-navigation targets. */
export const isNavigableCustomStep = (stepId: SiteCreationCustomStep): boolean =>
  NAVIGABLE_STEP_IDS.has(stepId);

const CUSTOM_STEP_GROUP_IDS = customStepGroupIdSchema.options;

export type CustomStepperGroup = StepVariant & {
  groupId: CustomStepGroupId;
  title: string;
  targetStepId: SiteCreationCustomStep;
};

const isCustomStepCompleted = (stepId: SiteCreationCustomStep, steps: CustomStepsState): boolean =>
  Boolean((steps as Record<string, { completed?: boolean } | undefined>)[stepId]?.completed);

/**
 * The update wizard's clickable-sidebar data: one entry per group, each pointing at its first
 * not-yet-completed navigable (answer) step in the walked sequence, falling back to the group's
 * first walked step. Mirrors `computeRenewableEnergyStepperGroups` on the project side — the
 * SUMMARY group (FINAL_SUMMARY/CREATION_RESULT) has no navigable steps of its own and is left
 * out (nothing to click there beyond "Enregistrer").
 */
export const computeCustomStepperGroups = ({
  currentStep,
  steps,
  stepsSequence,
}: {
  currentStep: SiteCreationCustomStep;
  steps: CustomStepsState;
  stepsSequence: SiteCreationCustomStep[];
}): CustomStepperGroup[] => {
  const { groupId: currentGroupId } = CUSTOM_STEP_TO_GROUP[currentStep];

  return CUSTOM_STEP_GROUP_IDS.filter(
    (groupId) =>
      groupId !== "SUMMARY" &&
      stepsSequence.some((stepId) => CUSTOM_STEP_TO_GROUP[stepId].groupId === groupId),
  ).map((groupId) => {
    const stepsInGroup = stepsSequence.filter(
      (stepId) => CUSTOM_STEP_TO_GROUP[stepId].groupId === groupId,
    );
    const navigableStepsInGroup = stepsInGroup.filter(isNavigableCustomStep);
    const isStepCompleted = (stepId: SiteCreationCustomStep) =>
      isCustomStepCompleted(stepId, steps);

    const firstIncompleteStep = navigableStepsInGroup.find((stepId) => !isStepCompleted(stepId));
    const targetStepId = firstIncompleteStep ?? navigableStepsInGroup[0] ?? currentStep;

    return {
      groupId,
      title: CUSTOM_STEP_GROUP_LABELS[groupId],
      targetStepId,
      activity: groupId === currentGroupId ? "current" : "inactive",
      validation:
        navigableStepsInGroup.length > 0 && navigableStepsInGroup.every(isStepCompleted)
          ? "completed"
          : "empty",
    };
  });
};
