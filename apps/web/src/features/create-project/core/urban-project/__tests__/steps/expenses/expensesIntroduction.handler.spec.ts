import { describe, expect, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ExpensesIntroductionHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/expenses/expensesIntroduction.handler";

describe("ExpensesIntroductionHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS", () => {
      const nextStep = ExpensesIntroductionHandler.getNextStepId!({ stepsState: {} });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_BUILDINGS_RESALE_SELECTION when project has buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      };

      const previousStep = ExpensesIntroductionHandler.getPreviousStepId!({ stepsState });

      expect(previousStep).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
    });

    it("should return URBAN_PROJECT_SITE_RESALE_SELECTION when project has no buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
      };

      const previousStep = ExpensesIntroductionHandler.getPreviousStepId!({ stepsState });

      expect(previousStep).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
    });

    it("should return URBAN_PROJECT_SITE_RESALE_SELECTION when steps state is empty", () => {
      const previousStep = ExpensesIntroductionHandler.getPreviousStepId!({ stepsState: {} });

      expect(previousStep).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
    });
  });
});
