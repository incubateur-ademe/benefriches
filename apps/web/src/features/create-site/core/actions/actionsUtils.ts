import { createAction, UnknownAction } from "@reduxjs/toolkit";

import { SiteCreationStep } from "../createSite.reducer";

const SITE_CREATION_PREFIX = "siteCreation";

const COMPLETED_SUFFIX = "/completed";

export const createSiteCreationAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(`${SITE_CREATION_PREFIX}/${actionName}`);

export const createStepCompletedAction = <TPayload = void>(stepName: SiteCreationStep) =>
  createSiteCreationAction<TPayload>(`${stepName}${COMPLETED_SUFFIX}`);

export const isSiteCreationAction = (action: UnknownAction) => {
  return action.type.startsWith(SITE_CREATION_PREFIX);
};

export const isStepCompletedAction = (action: UnknownAction) => {
  return isSiteCreationAction(action) && action.type.endsWith(COMPLETED_SUFFIX);
};
