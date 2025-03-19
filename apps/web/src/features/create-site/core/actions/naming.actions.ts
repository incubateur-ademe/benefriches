import { createStepCompletedAction } from "./actionsUtils";
import { createStepRevertAttempted } from "./revert.actions";

export const namingIntroductionStepCompleted = createStepCompletedAction("NAMING_INTRODUCTION");
export const namingIntroductionStepReverted = () =>
  createStepRevertAttempted("NAMING_INTRODUCTION")();

export const namingStepCompleted = createStepCompletedAction<{
  name: string;
  description?: string;
}>("NAMING");
export const namingStepReverted = () =>
  createStepRevertAttempted("NAMING")({ resetFields: ["name", "description"] });
