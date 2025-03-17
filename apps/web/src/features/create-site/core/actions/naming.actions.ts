import { createStepCompletedAction, createStepRevertedAction } from "./actionsUtils";

export const namingIntroductionStepCompleted = createStepCompletedAction("NAMING_INTRODUCTION");
export const namingIntroductionStepReverted = () =>
  createStepRevertedAction("NAMING_INTRODUCTION")();

export const namingStepCompleted = createStepCompletedAction<{
  name: string;
  description?: string;
}>("NAMING");
export const namingStepReverted = () =>
  createStepRevertedAction("NAMING")({ resetFields: ["name", "description"] });
