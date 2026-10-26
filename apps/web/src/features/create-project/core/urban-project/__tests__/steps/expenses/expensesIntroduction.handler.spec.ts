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
    it("should return URBAN_PROJECT_BUILDINGS_RESALE_SELECTION when the project has a buildings use and footprint", () => {
      const previousStep = ExpensesIntroductionHandler.getPreviousStepId({
        answers: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
          },
        },
        context: { siteData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
    });

    it("should return URBAN_PROJECT_SITE_RESALE_SELECTION when the project has no buildings use", () => {
      const previousStep = ExpensesIntroductionHandler.getPreviousStepId({
        answers: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
          },
        },
        context: { siteData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
    });
  });
});
