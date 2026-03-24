import { DemoAnswerStepHandler } from "../../stepHandlerRegistry";

export const DemoSiteActivityHandler = {
  stepId: "DEMO_SITE_ACTIVITY_SELECTION",

  getNextStepId() {
    return "DEMO_SITE_ADDRESS";
  },

  getPreviousStepId() {
    return "DEMO_SITE_NATURE_SELECTION";
  },
} satisfies DemoAnswerStepHandler<"DEMO_SITE_ACTIVITY_SELECTION">;
