import {
  Address,
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
} from "shared";

import { createSiteCreationAction, createStepCompletedAction } from "./actionsUtils";
import { createStepRevertAttempted } from "./revert.actions";

export const siteCreationInitiated = createSiteCreationAction("init");

export const introductionStepCompleted = createStepCompletedAction("INTRODUCTION");

export const createModeSelectionCompleted = createStepCompletedAction<{
  createMode: "express" | "custom";
}>("CREATE_MODE_SELECTION");
export const createModeReverted = createStepRevertAttempted("CREATE_MODE_SELECTION");

export const isFricheCompleted = createStepCompletedAction<{ isFriche: boolean }>("IS_FRICHE");
export const isFricheReverted = () =>
  createStepRevertAttempted("IS_FRICHE")({ resetFields: ["isFriche"] });

export const siteNatureCompleted = createStepCompletedAction<{ nature: SiteNature }>("SITE_NATURE");
export const siteNatureReverted = () =>
  createStepRevertAttempted("SITE_NATURE")({ resetFields: ["nature"] });

export const fricheActivityStepCompleted =
  createStepCompletedAction<FricheActivity>("FRICHE_ACTIVITY");
export const fricheActivityStepReverted = () =>
  createStepRevertAttempted("FRICHE_ACTIVITY")({ resetFields: ["fricheActivity"] });

export const agriculturalOperationActivityCompleted = createStepCompletedAction<{
  activity: AgriculturalOperationActivity;
}>("AGRICULTURAL_OPERATION_ACTIVITY");

export const agriculturalOperationActivityReverted = () =>
  createStepRevertAttempted("AGRICULTURAL_OPERATION_ACTIVITY")({
    resetFields: ["agriculturalOperationActivity"],
  });

export const naturalAreaTypeCompleted = createStepCompletedAction<{
  naturalAreaType: NaturalAreaType;
}>("NATURAL_AREA_TYPE");
export const naturalAreaTypeReverted = () =>
  createStepRevertAttempted("NATURAL_AREA_TYPE")({ resetFields: ["naturalAreaType"] });

export const addressStepCompleted = createStepCompletedAction<{ address: Address }>("ADDRESS");
export const addressStepReverted = () =>
  createStepRevertAttempted("ADDRESS")({ resetFields: ["address"] });
