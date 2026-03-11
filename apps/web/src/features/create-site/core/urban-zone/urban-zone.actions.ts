import { createAction } from "@reduxjs/toolkit";

import type { AnswersByStep, SchematizedAnswerStepId } from "./urbanZoneSteps";

export type StepCompletionPayload<T extends SchematizedAnswerStepId = SchematizedAnswerStepId> = {
  [K in T]: { stepId: K; answers: AnswersByStep[K] };
}[T];

export const previousStepRequested = createAction("siteCreation/urbanZone/previousStepRequested");

export const nextStepRequested = createAction("siteCreation/urbanZone/nextStepRequested");

export const stepCompletionRequested = createAction(
  "siteCreation/urbanZone/stepCompletionRequested",
  (payload: StepCompletionPayload) => ({ payload }),
);
