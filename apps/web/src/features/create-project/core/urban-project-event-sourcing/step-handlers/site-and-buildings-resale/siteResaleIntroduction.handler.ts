import { InfoStepHandler } from "../stepHandler.type";

export const SiteResaleIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",

  getPreviousStepId(context) {
    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }

    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
};
