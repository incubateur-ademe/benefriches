import { DemoAnswerStepHandler } from "../../stepHandlerRegistry";

export const DemoSiteSurfaceAreaHandler = {
  stepId: "DEMO_SITE_SURFACE_AREA",

  getNextStepId() {
    return "DEMO_CREATION_RESULT";
  },

  getPreviousStepId() {
    return "DEMO_SITE_ADDRESS";
  },
} satisfies DemoAnswerStepHandler<"DEMO_SITE_SURFACE_AREA">;
