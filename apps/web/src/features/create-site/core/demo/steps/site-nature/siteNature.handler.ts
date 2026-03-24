import { DemoAnswerStepHandler } from "../../stepHandlerRegistry";

export const DemoSiteNatureHandler = {
  stepId: "DEMO_SITE_NATURE_SELECTION",

  getNextStepId() {
    return "DEMO_SITE_ACTIVITY_SELECTION";
  },

  getPreviousStepId() {
    return "DEMO_INTRODUCTION";
  },
} satisfies DemoAnswerStepHandler<"DEMO_SITE_NATURE_SELECTION">;
