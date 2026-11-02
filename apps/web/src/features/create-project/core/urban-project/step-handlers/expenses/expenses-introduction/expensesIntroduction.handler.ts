import type { InfoStepHandler } from "../../stepHandler.type";

export const ExpensesIntroductionHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} satisfies InfoStepHandler;
