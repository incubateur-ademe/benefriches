import {
  Address,
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteNature,
} from "shared";

import {
  createSiteCreationAction,
  createStepCompletedAction,
  createStepRevertedAction,
} from "./actionsUtils";

export const siteCreationInitiated = createSiteCreationAction("init");

export const introductionStepCompleted = createStepCompletedAction("INTRODUCTION");

export const createModeSelectionCompleted = createStepCompletedAction<{
  createMode: "express" | "custom";
}>("CREATE_MODE_SELECTION");
export const createModeReverted = createSiteCreationAction("CREATE_MODE_SELECTION/reverted");

export const isFricheCompleted = createStepCompletedAction<{ isFriche: boolean }>("IS_FRICHE");
export const isFricheReverted = () =>
  createStepRevertedAction("IS_FRICHE")({ resetFields: ["isFriche"] });

export const siteNatureCompleted = createStepCompletedAction<{ nature: SiteNature }>("SITE_NATURE");
export const siteNatureReverted = () =>
  createStepRevertedAction("SITE_NATURE")({ resetFields: ["nature"] });

export const fricheActivityStepCompleted =
  createStepCompletedAction<FricheActivity>("FRICHE_ACTIVITY");
export const fricheActivityStepReverted = () =>
  createStepRevertedAction("FRICHE_ACTIVITY")({ resetFields: ["fricheActivity"] });

export const agriculturalOperationActivityCompleted = createStepCompletedAction<{
  activity: AgriculturalOperationActivity;
}>("AGRICULTURAL_OPERATION_ACTIVITY");

export const agriculturalOperationActivityReverted = () =>
  createStepRevertedAction("AGRICULTURAL_OPERATION_ACTIVITY")({
    resetFields: ["agriculturalOperationActivity"],
  });

export const naturalAreaTypeCompleted = createStepCompletedAction<{
  naturalAreaType: NaturalAreaType;
}>("NATURAL_AREA_TYPE");
export const naturalAreaTypeReverted = () =>
  createStepRevertedAction("NATURAL_AREA_TYPE")({ resetFields: ["naturalAreaType"] });

export const addressStepCompleted = createStepCompletedAction<{ address: Address }>("ADDRESS");
export const addressStepReverted = () =>
  createStepRevertedAction("ADDRESS")({ resetFields: ["address"] });
