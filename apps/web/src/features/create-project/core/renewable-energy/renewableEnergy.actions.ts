import { ActionCreatorWithPayload, createAction } from "@reduxjs/toolkit";

import { makeWizardFormActionType } from "@/shared/core/wizard-form/wizardForm.actions";

import type {
  AnswersByStep,
  AnswerStepId,
  RenewableEnergyCreationStep,
} from "./renewableEnergySteps";

const makeRenewableEnergyFormActionType = (prefix: string, actionName: string) =>
  makeWizardFormActionType(prefix, `renewableEnergy/${actionName}`);

const createRenewableEnergyFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeRenewableEnergyFormActionType(prefix, actionName));

// Kept for the feature's own extra thunks (save, expected-performance, soils-carbon-storage),
// which are not part of the wizard-form step-completion/navigation contract.
export const makeRenewableEnergyProjectCreationActionType = (actionName: string) =>
  makeRenewableEnergyFormActionType("projectCreation", actionName);

export type StepCompletionPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

export type RenewableEnergyFormReducerActions = {
  stepCompletionRequested: ActionCreatorWithPayload<StepCompletionPayload>;
  previousStepRequested: ActionCreatorWithPayload<void>;
  nextStepRequested: ActionCreatorWithPayload<void>;
  stepNavigationRequested: ActionCreatorWithPayload<{ stepId: RenewableEnergyCreationStep }>;
};

// Factory kept prefix-parameterized (mirrors `createUrbanProjectFormActions`) so ticket 09's
// editing slice can instantiate a second, independently-namespaced instance from this same
// registry, exactly as urban does for creation vs update.
export const createRenewableEnergyFormActions = (
  prefix: string,
): RenewableEnergyFormReducerActions => ({
  stepCompletionRequested: createRenewableEnergyFormAction<StepCompletionPayload>(
    prefix,
    "stepCompletionRequested",
  ),
  previousStepRequested: createRenewableEnergyFormAction(prefix, "previousStepRequested"),
  nextStepRequested: createRenewableEnergyFormAction(prefix, "nextStepRequested"),
  stepNavigationRequested: createRenewableEnergyFormAction<{
    stepId: RenewableEnergyCreationStep;
  }>(prefix, "stepNavigationRequested"),
});

const creationRenewableEnergyFormActions = createRenewableEnergyFormActions("projectCreation");

export const stepCompletionRequested = creationRenewableEnergyFormActions.stepCompletionRequested;
export const previousStepRequested = creationRenewableEnergyFormActions.previousStepRequested;
export const nextStepRequested = creationRenewableEnergyFormActions.nextStepRequested;
export const stepNavigationRequested = creationRenewableEnergyFormActions.stepNavigationRequested;
