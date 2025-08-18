import { createAction } from "@reduxjs/toolkit";

import { makeProjectCreationActionType } from "../actions/actionsUtils";
import { UrbanProjectCustomCreationStep } from "../urban-project/creationSteps";
import { AnswerStepId, AnswersByStep } from "./urbanProjectSteps";

const URBAN_PROJECT_CREATION_PREFIX = "urbanProjectEventSourcing";

export const makeUrbanProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`${URBAN_PROJECT_CREATION_PREFIX}/${actionName}`);
};

const createUrbanProjectCreationAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(makeUrbanProjectCreationActionType(actionName));

type StepPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];
export const completeStep = createUrbanProjectCreationAction<StepPayload>("completeStep");

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
