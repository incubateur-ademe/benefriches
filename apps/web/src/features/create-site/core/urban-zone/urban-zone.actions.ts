import { ActionCreatorWithPayload, createAction } from "@reduxjs/toolkit";

import { makeWizardFormActionType } from "@/shared/core/wizard-form/wizardForm.actions";

import type {
  AnswersByStep,
  SchematizedAnswerStepId,
  UrbanZoneSiteCreationStep,
} from "./urbanZoneSteps";

// Kept in its original (pre-port) format — used only by urbanZoneSiteSaved.action.ts for its
// own thunk action-type string, unrelated to the wizard-form engine's action namespacing.
export const makeUrbanZoneActionType = (actionName: string) =>
  `siteCreation/urbanZone/${actionName}`;

const createUrbanZoneFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeWizardFormActionType(prefix, actionName));

export type StepCompletionPayload<K extends SchematizedAnswerStepId = SchematizedAnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

// Pure, dependency-free navigation + step-completion action creators. Urban zone has a single,
// create-only consumer today, but the factory stays prefix-parameterized to mirror
// `createDemoFormActions`/`createRenewableEnergyFormActions` — the update flow (ticket 06) will
// instantiate it a second time with a different prefix.
export type UrbanZoneFormPureActions = {
  stepCompletionRequested: ActionCreatorWithPayload<StepCompletionPayload>;
  stepCompletionConfirmed: ActionCreatorWithPayload<void>;
  stepCompletionCancelled: ActionCreatorWithPayload<void>;
  previousStepRequested: ActionCreatorWithPayload<void>;
  nextStepRequested: ActionCreatorWithPayload<void>;
  stepNavigationRequested: ActionCreatorWithPayload<{ stepId: UrbanZoneSiteCreationStep }>;
};

export const createUrbanZoneFormActions = (prefix: string): UrbanZoneFormPureActions => ({
  stepCompletionRequested: createUrbanZoneFormAction<StepCompletionPayload>(
    prefix,
    "stepCompletionRequested",
  ),
  stepCompletionConfirmed: createUrbanZoneFormAction(prefix, "stepCompletionConfirmed"),
  stepCompletionCancelled: createUrbanZoneFormAction(prefix, "stepCompletionCancelled"),
  previousStepRequested: createUrbanZoneFormAction(prefix, "previousStepRequested"),
  nextStepRequested: createUrbanZoneFormAction(prefix, "nextStepRequested"),
  stepNavigationRequested: createUrbanZoneFormAction<{ stepId: UrbanZoneSiteCreationStep }>(
    prefix,
    "stepNavigationRequested",
  ),
});

// Urban zone has exactly one live consumer today (creation), so the concrete bound actions are
// instantiated and re-exported directly from this file — every existing view container imports
// them from here. If the update flow (ticket 06) needs a second lens instance, this singleton
// instantiation should move to a factory used by both create and update.
export const urbanZoneFormActions = createUrbanZoneFormActions("siteCreation/urbanZone");

export const {
  stepCompletionRequested,
  stepCompletionConfirmed,
  stepCompletionCancelled,
  previousStepRequested,
  nextStepRequested,
  stepNavigationRequested,
} = urbanZoneFormActions;
