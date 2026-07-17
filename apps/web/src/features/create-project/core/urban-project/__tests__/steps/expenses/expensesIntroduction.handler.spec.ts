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
    it("should return URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER when site is a friche", () => {
      const previousStep = ExpensesIntroductionHandler.getPreviousStepId({
        answers: {},
        context: { siteData: { nature: "FRICHE" } as never },
      });

      expect(previousStep).toBe("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER");
    });

    it("should return URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER when site is not a friche", () => {
      const previousStep = ExpensesIntroductionHandler.getPreviousStepId({
        answers: {},
        context: { siteData: { nature: "AGRICULTURAL" } as never },
      });

      expect(previousStep).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
    });

    it("should return URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER when no site data", () => {
      const previousStep = ExpensesIntroductionHandler.getPreviousStepId({
        answers: {},
        context: { siteData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
    });
  });
});
