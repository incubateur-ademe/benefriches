import { AgriculturalOperationActivity, FricheActivity, NaturalAreaType } from "shared";

import { createStepCompletedAction } from "../../actions/actionsUtils";

export const fricheActivityStepCompleted =
  createStepCompletedAction<FricheActivity>("FRICHE_ACTIVITY");

export const agriculturalOperationActivityCompleted = createStepCompletedAction<{
  activity: AgriculturalOperationActivity;
}>("AGRICULTURAL_OPERATION_ACTIVITY");

export const naturalAreaTypeCompleted = createStepCompletedAction<{
  naturalAreaType: NaturalAreaType;
}>("NATURAL_AREA_TYPE");
