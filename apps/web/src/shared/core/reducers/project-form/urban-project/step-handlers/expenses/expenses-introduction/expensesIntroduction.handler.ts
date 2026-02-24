import { InfoStepHandler } from "../../stepHandler.type";

export const ExpensesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getPreviousStepId(context) {
    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },
} as const;
