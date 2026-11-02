import { describe, expect, it } from "vitest";

import { ExpensesIntroductionHandler } from "@/features/create-project/core/urban-project/step-handlers/expenses/expenses-introduction/expensesIntroduction.handler";

describe("ExpensesIntroductionHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS", () => {
      const nextStep = ExpensesIntroductionHandler.getNextStepId();

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_SITE_RESALE_SELECTION", () => {
      const previousStep = ExpensesIntroductionHandler.getPreviousStepId();

      expect(previousStep).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
    });
  });
});
