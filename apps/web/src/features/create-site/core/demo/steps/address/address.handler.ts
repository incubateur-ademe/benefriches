import { DemoAnswerStepHandler } from "../../stepHandlerRegistry";

export const DemoSiteAddressHandler = {
  stepId: "DEMO_SITE_ADDRESS",

  getNextStepId() {
    return "DEMO_SITE_SURFACE_AREA";
  },

  getPreviousStepId() {
    return "DEMO_SITE_ACTIVITY_SELECTION";
  },
} satisfies DemoAnswerStepHandler<"DEMO_SITE_ADDRESS">;
