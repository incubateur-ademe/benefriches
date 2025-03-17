import { createAction } from "@reduxjs/toolkit";

import { SiteCreationStep } from "../createSite.reducer";
import { SiteCreationData } from "../siteFoncier.types";

const SITE_CREATION_PREFIX = "siteCreation";

export const createSiteCreationAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(`${SITE_CREATION_PREFIX}/${actionName}`);

export const createStepCompletedAction = <TPayload = void>(stepName: SiteCreationStep) =>
  createSiteCreationAction<TPayload>(`${stepName}/completed`);

export type StepRevertedActionPayload = { resetFields: (keyof SiteCreationData)[] } | undefined;
export const createStepRevertedAction = (stepName: SiteCreationStep) =>
  createSiteCreationAction<StepRevertedActionPayload>(`${stepName}/reverted`);

export const isStepRevertedAction = (action: {
  type: string;
  payload?: StepRevertedActionPayload;
}) => {
  return action.type.startsWith(SITE_CREATION_PREFIX) && action.type.endsWith("/reverted");
};
