import { ActionCreatorWithPayload, createAction } from "@reduxjs/toolkit";

import { makeWizardFormActionType } from "@/shared/core/wizard-form/wizardForm.actions";

import type {
  CustomAnswerStepId,
  CustomAnswersByStep,
  SiteCreationCustomStep,
} from "./customSteps";

const createCustomFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeWizardFormActionType(prefix, actionName));

export type StepCompletionPayload<K extends CustomAnswerStepId = CustomAnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: CustomAnswersByStep[P];
  };
}[K];

// Pure, dependency-free navigation + step-completion action creators, mirroring
// createUrbanZoneFormActions/createDemoFormActions.
export type CustomFormPureActions = {
  stepCompletionRequested: ActionCreatorWithPayload<StepCompletionPayload>;
  stepCompletionConfirmed: ActionCreatorWithPayload<void>;
  stepCompletionCancelled: ActionCreatorWithPayload<void>;
  previousStepRequested: ActionCreatorWithPayload<void>;
  nextStepRequested: ActionCreatorWithPayload<void>;
  stepNavigationRequested: ActionCreatorWithPayload<{ stepId: SiteCreationCustomStep }>;
};

export const createCustomFormActions = (prefix: string): CustomFormPureActions => ({
  stepCompletionRequested: createCustomFormAction<StepCompletionPayload>(
    prefix,
    "stepCompletionRequested",
  ),
  stepCompletionConfirmed: createCustomFormAction(prefix, "stepCompletionConfirmed"),
  stepCompletionCancelled: createCustomFormAction(prefix, "stepCompletionCancelled"),
  previousStepRequested: createCustomFormAction(prefix, "previousStepRequested"),
  nextStepRequested: createCustomFormAction(prefix, "nextStepRequested"),
  stepNavigationRequested: createCustomFormAction<{ stepId: SiteCreationCustomStep }>(
    prefix,
    "stepNavigationRequested",
  ),
});

// The legacy custom flow has exactly one live consumer today (creation), so the concrete bound
// actions are instantiated and re-exported directly from this file, mirroring
// urban-zone.actions.ts.
export const customFormActions = createCustomFormActions("siteCreation/custom");

export const {
  stepCompletionRequested,
  stepCompletionConfirmed,
  stepCompletionCancelled,
  previousStepRequested,
  nextStepRequested,
  stepNavigationRequested,
} = customFormActions;
