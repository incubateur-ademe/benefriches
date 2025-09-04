import { ReadStateHelper } from "../../urbanProject.helpers";
import { InfoStepHandler } from "../stepHandler.type";

export const ExpensesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getPreviousStepId(context) {
    if (ReadStateHelper.hasBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";
    }
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} as const;
