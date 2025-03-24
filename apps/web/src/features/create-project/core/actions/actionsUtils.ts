import { Action, createAction } from "@reduxjs/toolkit";

const PROJECT_CREATION_ACTION_PREFIX = "projectCreation";

export const makeProjectCreationActionType = (actionName: string) => {
  return `${PROJECT_CREATION_ACTION_PREFIX}/${actionName}`;
};

export const createProjectCreationAction = <TPayload = void>(actionName: string) => {
  return createAction<TPayload>(makeProjectCreationActionType(actionName));
};

export const isProjectCreationAction = (action: Action) => {
  return action.type.startsWith(PROJECT_CREATION_ACTION_PREFIX);
};
