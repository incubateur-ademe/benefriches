import { InfoStepHandler } from "../../stepHandlerRegistry";

export const DemoSiteIntroductionHandler = {
  stepId: "DEMO_INTRODUCTION",

  getNextStepId() {
    return "DEMO_SITE_NATURE_SELECTION";
  },
} satisfies InfoStepHandler;
