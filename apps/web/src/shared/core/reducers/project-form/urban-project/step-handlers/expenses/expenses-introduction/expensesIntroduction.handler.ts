import { willConstructNewBuildings } from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const ExpensesIntroductionHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getPreviousStepId(context) {
    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }
    if (willConstructNewBuildings(context.stepsState)) {
      return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
    }
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },
} satisfies InfoStepHandler;
