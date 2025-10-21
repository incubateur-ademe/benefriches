import { createAction } from "@reduxjs/toolkit";

import { makeProjectFormActionType } from "../projectForm.actions";
import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "./urbanProjectSteps";

export const makeUrbanProjectFormActionType = (prefix: string, actionName: string) =>
  makeProjectFormActionType(prefix, `urbanProject/${actionName}`);

export const createUrbanProjectFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeUrbanProjectFormActionType(prefix, actionName));

export type StepCompletionPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

export const createProjectFormActions = (prefix: string) => {
  return {
    requestStepCompletion: createUrbanProjectFormAction<StepCompletionPayload>(
      prefix,
      "requestStepCompletion",
    ),
    confirmStepCompletion: createUrbanProjectFormAction(prefix, "confirmStepCompletion"),
    cancelStepCompletion: createUrbanProjectFormAction(prefix, "cancelStepCompletion"),
    navigateToPrevious: createUrbanProjectFormAction(prefix, "navigateToPrevious"),
    navigateToNext: createUrbanProjectFormAction(prefix, "navigateToNext"),
    navigateToStep: createUrbanProjectFormAction<{
      stepId: UrbanProjectCreationStep;
    }>(prefix, "navigateToStep"),
  };
};
