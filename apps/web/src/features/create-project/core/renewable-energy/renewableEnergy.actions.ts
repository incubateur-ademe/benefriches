import { createAction } from "@reduxjs/toolkit";

import { makeProjectCreationActionType } from "../actions/actionsUtils";
import type { AnswersByStep, AnswerStepId } from "./renewableEnergySteps";

export const makeRenewableEnergyProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`renewableEnergy/${actionName}`);
};

export type StepCompletionPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

export const requestStepCompletion = createAction<StepCompletionPayload>(
  makeRenewableEnergyProjectCreationActionType("requestStepCompletion"),
);

export const navigateToPrevious = createAction(
  makeRenewableEnergyProjectCreationActionType("navigateToPrevious"),
);

export const navigateToNext = createAction(
  makeRenewableEnergyProjectCreationActionType("navigateToNext"),
);
