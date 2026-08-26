import { ActionCreatorWithPayload, createAction } from "@reduxjs/toolkit";

import { makeWizardFormActionType } from "@/shared/core/wizard-form/wizardForm.actions";

import { AnswersByStep, DemoAnswerStepId, DemoSiteCreationStep } from "./demoSteps";

const makeDemoFormActionType = (prefix: string, actionName: string) =>
  makeWizardFormActionType(prefix, `demo/${actionName}`);

const createDemoFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeDemoFormActionType(prefix, actionName));

export type StepCompletionPayload<K extends DemoAnswerStepId = DemoAnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

// Pure, dependency-free navigation + step-completion action creators (demo has a single,
// create-only consumer, but the factory stays prefix-parameterized to mirror
// `createRenewableEnergyFormActions`).
export type DemoFormPureActions = {
  stepCompletionRequested: ActionCreatorWithPayload<StepCompletionPayload>;
  stepCompletionConfirmed: ActionCreatorWithPayload<void>;
  stepCompletionCancelled: ActionCreatorWithPayload<void>;
  previousStepRequested: ActionCreatorWithPayload<void>;
  nextStepRequested: ActionCreatorWithPayload<void>;
  stepNavigationRequested: ActionCreatorWithPayload<{ stepId: DemoSiteCreationStep }>;
};

export const createDemoFormActions = (prefix: string): DemoFormPureActions => ({
  stepCompletionRequested: createDemoFormAction<StepCompletionPayload>(
    prefix,
    "stepCompletionRequested",
  ),
  stepCompletionConfirmed: createDemoFormAction(prefix, "stepCompletionConfirmed"),
  stepCompletionCancelled: createDemoFormAction(prefix, "stepCompletionCancelled"),
  previousStepRequested: createDemoFormAction(prefix, "previousStepRequested"),
  nextStepRequested: createDemoFormAction(prefix, "nextStepRequested"),
  stepNavigationRequested: createDemoFormAction<{ stepId: DemoSiteCreationStep }>(
    prefix,
    "stepNavigationRequested",
  ),
});
