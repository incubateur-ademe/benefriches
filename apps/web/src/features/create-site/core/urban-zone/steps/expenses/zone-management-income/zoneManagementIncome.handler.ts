import type { AnswerStepHandler } from "../../../stepHandler.type";

export const ZoneManagementIncomeHandler = {
  stepId: "URBAN_ZONE_ZONE_MANAGEMENT_INCOME",

  getNextStepId() {
    return "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_ZONE_MANAGEMENT_INCOME">;
