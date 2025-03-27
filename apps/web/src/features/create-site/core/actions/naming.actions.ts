import { createStepCompletedAction } from "./actionsUtils";

export const namingIntroductionStepCompleted = createStepCompletedAction("NAMING_INTRODUCTION");

export const namingStepCompleted = createStepCompletedAction<{
  name: string;
  description?: string;
}>("NAMING");
