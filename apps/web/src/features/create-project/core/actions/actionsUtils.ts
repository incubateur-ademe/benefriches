import { Action, createAction } from "@reduxjs/toolkit";

import { ProjectCreationStep } from "../createProject.reducer";

const PROJECT_CREATION_ACTION_PREFIX = "projectCreation";

const STEP_REVERT_ATTEMPTED_SUFFIX = "stepRevertAttempted";

export const makeProjectCreationActionType = (actionName: string) => {
  return `${PROJECT_CREATION_ACTION_PREFIX}/${actionName}`;
};

export const createProjectCreationAction = <TPayload = void>(actionName: string) => {
  return createAction<TPayload>(makeProjectCreationActionType(actionName));
};

const isProjectCreationAction = (action: Action) => {
  return action.type.startsWith(PROJECT_CREATION_ACTION_PREFIX);
};

export const isStepRevertAttemptedAction = (
  action: Action,
): action is ReturnType<typeof createStepRevertAttempted> =>
  isProjectCreationAction(action) && action.type.endsWith("stepRevertAttempted");

export const stepRevertAttempted = createProjectCreationAction("stepRevertAttempted");

export const stepRevertConfirmationResolved = createProjectCreationAction<{
  confirmed: boolean;
  doNotAskAgain: boolean;
}>("stepRevertConfirmationResolved");

export const stepRevertConfirmed = createProjectCreationAction<{
  revertedStep: ProjectCreationStep;
}>("stepRevertConfirmed");

export const createStepRevertAttempted = <TPayload>(actionName: string) =>
  createProjectCreationAction<TPayload>(`${actionName}/${STEP_REVERT_ATTEMPTED_SUFFIX}`);
