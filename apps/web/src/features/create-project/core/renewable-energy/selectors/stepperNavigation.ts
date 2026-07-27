import type { StepVariant } from "@/shared/core/stepVariant.types";
import {
  buildStepGroupsFromSequence,
  StepGroups,
} from "@/shared/core/wizard-form/helpers/stepGroups";

import { isAnswersStep, RenewableEnergyCreationStep } from "../renewableEnergySteps";
import {
  RENEWABLE_ENERGY_STEP_GROUP_IDS,
  RENEWABLE_ENERGY_STEP_GROUP_LABELS,
  RENEWABLE_ENERGY_STEP_TO_GROUP,
  RenewableEnergyStepGroupId,
  RenewableEnergyStepSubGroupId,
} from "../step-handlers/renewableEnergyStepperConfig";
import type { RenewableEnergyStepsState } from "../step-handlers/stepHandler.type";

// The final-summary review step has no "answers" of its own to complete, so it's always
// treated as completed rather than flashing an incomplete-step warning.
const NON_ANSWER_NAVIGABLE_STEPS = new Set<RenewableEnergyCreationStep>([
  "RENEWABLE_ENERGY_FINAL_SUMMARY",
]);

// A step is navigable (i.e. eligible for a stepper entry) when it's an answer step, or one of
// the non-answer steps explicitly allow-listed above.
const isNavigableRenewableEnergyStep = (stepId: RenewableEnergyCreationStep): boolean =>
  isAnswersStep(stepId) || NON_ANSWER_NAVIGABLE_STEPS.has(stepId);

const isRenewableEnergyStepCompleted = (
  stepId: RenewableEnergyCreationStep,
  steps: RenewableEnergyStepsState,
): boolean =>
  NON_ANSWER_NAVIGABLE_STEPS.has(stepId) ||
  (isAnswersStep(stepId) && Boolean(steps[stepId]?.completed));

export type RenewableEnergyStepGroups = StepGroups<
  RenewableEnergyCreationStep,
  RenewableEnergyStepGroupId,
  RenewableEnergyStepSubGroupId
>;

// Buckets the walked step sequence into its groups/sub-groups (shared wizard-form mechanism),
// for rendering the update stepper's nested, clickable sub-steps.
export const buildRenewableEnergyStepGroupsFromSequence = ({
  steps,
  stepsSequence,
}: {
  steps: RenewableEnergyStepsState;
  stepsSequence: RenewableEnergyCreationStep[];
}): RenewableEnergyStepGroups =>
  buildStepGroupsFromSequence(
    stepsSequence.map((stepId) => ({
      stepId,
      isCompleted: isRenewableEnergyStepCompleted(stepId, steps),
    })),
    RENEWABLE_ENERGY_STEP_TO_GROUP,
    isNavigableRenewableEnergyStep,
  );

export type RenewableEnergyStepperGroup = StepVariant & {
  groupId: RenewableEnergyStepGroupId;
  title: string;
  targetStepId: RenewableEnergyCreationStep;
};

// Shared by the update sidebar and both the creation/update summary "Modifier" links: each
// group's targetStepId is its first not-yet-completed answer step in the walked sequence,
// falling back to the group's first walked step (or the current step, if the group was never
// reached — shouldn't happen for a fully-hydrated edit, but keeps the selector total).
export const computeRenewableEnergyStepperGroups = ({
  currentStep,
  steps,
  stepsSequence,
}: {
  currentStep: RenewableEnergyCreationStep;
  steps: RenewableEnergyStepsState;
  stepsSequence: RenewableEnergyCreationStep[];
}): RenewableEnergyStepperGroup[] => {
  const { groupId: currentGroupId } = RENEWABLE_ENERGY_STEP_TO_GROUP[currentStep];

  return RENEWABLE_ENERGY_STEP_GROUP_IDS.map((groupId) => {
    const stepsInGroup = stepsSequence.filter(
      (stepId) => RENEWABLE_ENERGY_STEP_TO_GROUP[stepId].groupId === groupId,
    );
    const navigableStepsInGroup = stepsInGroup.filter(isNavigableRenewableEnergyStep);
    const isStepCompleted = (stepId: RenewableEnergyCreationStep) =>
      isRenewableEnergyStepCompleted(stepId, steps);

    const firstIncompleteStep = navigableStepsInGroup.find((stepId) => !isStepCompleted(stepId));
    const targetStepId = firstIncompleteStep ?? navigableStepsInGroup[0] ?? currentStep;

    return {
      groupId,
      title: RENEWABLE_ENERGY_STEP_GROUP_LABELS[groupId],
      targetStepId,
      activity: groupId === currentGroupId ? "current" : "inactive",
      validation:
        navigableStepsInGroup.length > 0 && navigableStepsInGroup.every(isStepCompleted)
          ? "completed"
          : "empty",
    };
  });
};
