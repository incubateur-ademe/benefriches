import type { AnswerStepHandler } from "../../stepHandler.type";

export const ExpensesSitePurchaseAmountsHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",

  getPreviousStepId() {
    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },

  getNextStepId(context) {
    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_EXPENSES_REINSTATEMENT";
    }
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS">;
