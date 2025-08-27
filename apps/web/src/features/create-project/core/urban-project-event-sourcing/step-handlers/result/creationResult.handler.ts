import { InfoStepHandler } from "../stepHandler.type";

export const CreationResultHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_CREATION_RESULT",

  getPreviousStepId() {
    return "URBAN_PROJECT_FINAL_SUMMARY";
  },
} as const;
