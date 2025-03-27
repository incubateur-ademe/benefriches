import { createAction } from "@reduxjs/toolkit";

import { SiteCreationStep } from "../createSite.reducer";

const SITE_CREATION_PREFIX = "siteCreation";

const COMPLETED_SUFFIX = "/completed";

export const createSiteCreationAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(`${SITE_CREATION_PREFIX}/${actionName}`);

export const createStepCompletedAction = <TPayload = void>(stepName: SiteCreationStep) =>
  createSiteCreationAction<TPayload>(`${stepName}${COMPLETED_SUFFIX}`);
