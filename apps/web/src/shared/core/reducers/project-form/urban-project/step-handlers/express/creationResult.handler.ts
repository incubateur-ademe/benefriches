import { InfoStepHandler } from "../stepHandler.type";

export const ExpressCreationResultHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_EXPRESS_CREATION_RESULT",

  getPreviousStepId() {
    return "URBAN_PROJECT_EXPRESS_SUMMARY";
  },
} as const;
