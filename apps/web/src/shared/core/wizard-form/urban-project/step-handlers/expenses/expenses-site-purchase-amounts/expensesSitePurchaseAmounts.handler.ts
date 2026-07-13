import { ReadStateHelper } from "@/shared/core/wizard-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const ExpensesSitePurchaseAmountsHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",

  getPreviousStepId() {
    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },

  getNextStepId({ answers, context }) {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      answers,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    if (involvesReinstatement !== false && context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_EXPENSES_REINSTATEMENT";
    }
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS">;
