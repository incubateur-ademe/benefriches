import { createAction } from "@reduxjs/toolkit";

import { ProjectCreationStep } from "../createProject.reducer";

const PROJECT_CREATION_ACTION_PREFIX = "projectCreation";

export const makeProjectCreationActionType = (actionName: string) => {
  return `${PROJECT_CREATION_ACTION_PREFIX}/${actionName}`;
};

export const createProjectCreationAction = <TPayload = void>(actionName: string) => {
  return createAction<TPayload>(makeProjectCreationActionType(actionName));
};

export const stepRevertAttempted = createProjectCreationAction("stepRevertAttempted");

export const stepRevertConfirmationResolved = createProjectCreationAction<{
  confirmed: boolean;
  doNotAskAgain: boolean;
}>("stepRevertConfirmationResolved");

export const stepRevertConfirmed = createProjectCreationAction<{
  revertedStep: ProjectCreationStep;
}>("stepRevertConfirmed");
