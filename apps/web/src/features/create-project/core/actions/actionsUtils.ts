import { Action, createAction } from "@reduxjs/toolkit";

const PROJECT_CREATION_ACTION_PREFIX = "projectCreation";

const STEP_REVERT_ATTEMPTED_SUFFIX = "stepRevertAttempted";

export const makeProjectCreationActionType = (actionName: string) => {
  return `${PROJECT_CREATION_ACTION_PREFIX}/${actionName}`;
};

export const createProjectCreationAction = <TPayload = void>(actionName: string) => {
  return createAction<TPayload>(makeProjectCreationActionType(actionName));
};

export const isProjectCreationAction = (action: Action) => {
  return action.type.startsWith(PROJECT_CREATION_ACTION_PREFIX);
};

export const isStepRevertAttemptedAction = (
  action: Action,
): action is ReturnType<typeof createStepRevertAttempted> =>
  isProjectCreationAction(action) && action.type.endsWith("stepRevertAttempted");

export const makeProjectCreationRevertActionType = (actionName: string) => {
  return `${makeProjectCreationActionType(actionName)}/${STEP_REVERT_ATTEMPTED_SUFFIX}`;
};

export const createStepRevertAttempted = <TPayload>(actionName: string) =>
  createProjectCreationAction<TPayload>(`${actionName}/${STEP_REVERT_ATTEMPTED_SUFFIX}`);
