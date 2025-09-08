import { createAction } from "@reduxjs/toolkit";

import { makeProjectCreationActionType } from "../actions/actionsUtils";
import { UrbanProjectCustomCreationStep } from "../urban-project/creationSteps";
import { AnswerStepId, AnswersByStep } from "./urbanProjectSteps";

const URBAN_PROJECT_CREATION_PREFIX = "urbanProjectBeta";

export const makeUrbanProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`${URBAN_PROJECT_CREATION_PREFIX}/${actionName}`);
};

const createUrbanProjectCreationAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(makeUrbanProjectCreationActionType(actionName));

export type StepCompletionPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];
export const requestStepCompletion =
  createUrbanProjectCreationAction<StepCompletionPayload>("requestStepCompletion");

export const confirmStepCompletion = createUrbanProjectCreationAction("confirmStepCompletion");

export const cancelStepCompletion = createUrbanProjectCreationAction("cancelStepCompletion");

export const loadStep = createUrbanProjectCreationAction<{
  stepId: AnswerStepId;
}>("loadStep");

export const navigateToPrevious = createUrbanProjectCreationAction<{
  stepId: UrbanProjectCustomCreationStep;
}>("navigateToPrevious");

export const navigateToNext = createUrbanProjectCreationAction<{
  stepId: UrbanProjectCustomCreationStep;
}>("navigateToNext");

export const navigateToStep = createUrbanProjectCreationAction<{
  stepId: UrbanProjectCustomCreationStep;
}>("navigateToStep");
