import {
  Address,
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
} from "shared";

import { createSiteCreationAction, createStepCompletedAction } from "./actionsUtils";

export const siteCreationInitiated = createSiteCreationAction("init");

export const introductionStepCompleted = createStepCompletedAction("INTRODUCTION");

export const createModeSelectionCompleted = createStepCompletedAction<{
  createMode: "express" | "custom";
}>("CREATE_MODE_SELECTION");

export const isFricheCompleted = createStepCompletedAction<{ isFriche: boolean }>("IS_FRICHE");

export const siteNatureCompleted = createStepCompletedAction<{ nature: SiteNature }>("SITE_NATURE");

export const fricheActivityStepCompleted =
  createStepCompletedAction<FricheActivity>("FRICHE_ACTIVITY");

export const agriculturalOperationActivityCompleted = createStepCompletedAction<{
  activity: AgriculturalOperationActivity;
}>("AGRICULTURAL_OPERATION_ACTIVITY");

export const naturalAreaTypeCompleted = createStepCompletedAction<{
  naturalAreaType: NaturalAreaType;
}>("NATURAL_AREA_TYPE");

export const addressStepCompleted = createStepCompletedAction<{ address: Address }>("ADDRESS");
