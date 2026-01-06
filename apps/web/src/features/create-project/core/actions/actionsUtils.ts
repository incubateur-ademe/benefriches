import { createAction } from "@reduxjs/toolkit";

export const PROJECT_CREATION_ACTION_PREFIX = "projectCreation";

export const makeProjectCreationActionType = (actionName: string) => {
  return `${PROJECT_CREATION_ACTION_PREFIX}/${actionName}`;
};

export const createProjectCreationAction = <TPayload = void>(actionName: string) => {
  return createAction<TPayload>(makeProjectCreationActionType(actionName));
};

export const stepReverted = createProjectCreationAction("stepReverted");
