import { AnswerStepHandler } from "../stepHandler.type";

export const ExpensesSitePurchaseAmountsHandler: AnswerStepHandler<"URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS"> =
  {
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
  };
