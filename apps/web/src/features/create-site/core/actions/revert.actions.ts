import { Action } from "@reduxjs/toolkit";

import { SiteCreationStep } from "../createSite.reducer";
import { SiteCreationData } from "../siteFoncier.types";
import { createSiteCreationAction, isSiteCreationAction } from "./actionsUtils";

export type StepRevertedActionPayload = { resetFields: (keyof SiteCreationData)[] } | undefined;

export const stepReverted = createSiteCreationAction<StepRevertedActionPayload>("stepReverted");

export const stepRevertConfirmed = createSiteCreationAction("stepRevertConfirmed");
export const stepRevertCancelled = createSiteCreationAction("stepRevertCancelled");

export const isStepRevertAttemptedAction = (
  action: Action,
): action is ReturnType<typeof createStepRevertAttempted> =>
  isSiteCreationAction(action) && action.type.endsWith("stepRevertAttempted");

export const createStepRevertAttempted = (stepName: SiteCreationStep) =>
  createSiteCreationAction<StepRevertedActionPayload>(`${stepName}/stepRevertAttempted`);
