import { describe, expect, it } from "vitest";

import { ExpensesIntroductionHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/expenses/expensesIntroduction.handler";

describe("ExpensesIntroductionHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS", () => {
      const nextStep = ExpensesIntroductionHandler.getNextStepId!({ stepsState: {} });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE", () => {
      const previousStep = ExpensesIntroductionHandler.getPreviousStepId!({ stepsState: {} });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });
  });
});
