import type { InfoStepHandler } from "../../stepHandler.type";

export const ExpressCreationResultHandler = {
  stepId: "URBAN_PROJECT_EXPRESS_CREATION_RESULT",

  getPreviousStepId() {
    return "URBAN_PROJECT_EXPRESS_SUMMARY";
  },
} satisfies InfoStepHandler;
