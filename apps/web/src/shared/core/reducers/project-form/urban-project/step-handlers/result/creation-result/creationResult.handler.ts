import type { InfoStepHandler } from "../../stepHandler.type";

export const CreationResultHandler = {
  stepId: "URBAN_PROJECT_CREATION_RESULT",

  getPreviousStepId() {
    return "URBAN_PROJECT_FINAL_SUMMARY";
  },
} satisfies InfoStepHandler;
