import { createAction } from "@reduxjs/toolkit";

import type { AnswersByStep, SchematizedAnswerStepId } from "./urbanZoneSteps";

export type StepCompletionPayload<T extends SchematizedAnswerStepId> = {
  stepId: T;
  answers: AnswersByStep[T];
};

export const previousStepRequested = createAction("siteCreation/urbanZone/previousStepRequested");

export const nextStepRequested = createAction("siteCreation/urbanZone/nextStepRequested");

export const stepCompletionRequested = createAction(
  "siteCreation/urbanZone/stepCompletionRequested",
  <T extends SchematizedAnswerStepId>(payload: StepCompletionPayload<T>) => ({ payload }),
);
