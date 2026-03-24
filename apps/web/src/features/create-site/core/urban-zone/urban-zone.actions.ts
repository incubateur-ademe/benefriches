import { createAction } from "@reduxjs/toolkit";

import type { AnswersByStep, SchematizedAnswerStepId } from "./urbanZoneSteps";

export type StepCompletionPayload<T extends SchematizedAnswerStepId = SchematizedAnswerStepId> = {
  [K in T]: { stepId: K; answers: AnswersByStep[K] };
}[T];

export const makeUrbanZoneActionType = (actionName: string) =>
  `siteCreation/urbanZone/${actionName}`;

export const previousStepRequested = createAction(makeUrbanZoneActionType("previousStepRequested"));

export const nextStepRequested = createAction(makeUrbanZoneActionType("nextStepRequested"));

export const stepCompletionRequested = createAction(
  makeUrbanZoneActionType("stepCompletionRequested"),
  (payload: StepCompletionPayload) => ({ payload }),
);
