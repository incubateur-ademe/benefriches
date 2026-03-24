import { InfoStepHandler } from "../../stepHandlerRegistry";

export const DemoCreationResultHandler = {
  stepId: "DEMO_CREATION_RESULT",

  getPreviousStepId() {
    return "DEMO_SITE_SURFACE_AREA";
  },
} satisfies InfoStepHandler;
