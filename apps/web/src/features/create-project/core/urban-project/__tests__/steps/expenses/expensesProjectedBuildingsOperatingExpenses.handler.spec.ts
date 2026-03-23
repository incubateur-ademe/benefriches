import { describe, expect, it } from "vitest";

import { ExpensesProjectedBuildingsOperatingExpensesHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/expenses/expenses-projected-buildings-operating-expenses/expensesProjectedBuildingsOperatingExpenses.handler";

describe("ExpensesProjectedBuildingsOperatingExpensesHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_SCHEDULE_PROJECTION", () => {
      const nextStep = ExpensesProjectedBuildingsOperatingExpensesHandler.getNextStepId();

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_INSTALLATION", () => {
      const previousStep = ExpensesProjectedBuildingsOperatingExpensesHandler.getPreviousStepId();

      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });
  });
});
