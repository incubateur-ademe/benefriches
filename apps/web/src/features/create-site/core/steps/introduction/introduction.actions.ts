import { ReconversionProjectCreationMode, SiteNature } from "shared";

import { createSiteCreationAction, createStepCompletedAction } from "../../actions/actionsUtils";

export const siteCreationInitiated = createSiteCreationAction<
  undefined | { skipIntroduction: boolean; skipUseMutability?: boolean }
>("init");

export const introductionStepCompleted = createStepCompletedAction("INTRODUCTION");

export const createModeSelectionCompleted = createStepCompletedAction<{
  createMode: Extract<ReconversionProjectCreationMode, "custom" | "express">;
}>("CREATE_MODE_SELECTION");

export const isFricheCompleted = createStepCompletedAction<{ isFriche: boolean }>("IS_FRICHE");
export const mutabilityOrImpactsSelectionCompleted = createStepCompletedAction<{
  useMutability: boolean;
}>("USE_MUTABILITY");

export const siteNatureCompleted = createStepCompletedAction<{ nature: SiteNature }>("SITE_NATURE");
