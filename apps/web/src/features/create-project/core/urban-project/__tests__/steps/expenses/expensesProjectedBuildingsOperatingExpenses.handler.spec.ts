import { describe, expect, it } from "vitest";

import { stepHandlerRegistry } from "@/shared/core/wizard-form/urban-project/step-handlers/stepHandlerRegistry";
import { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

describe("ExpensesProjectedBuildingsOperatingExpensesHandler", () => {
  describe("getNextStepId", () => {
    it("returns revenue introduction when continuing from projected operating expenses", () => {
      // Arrange
      const nextStep =
        stepHandlerRegistry.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES.getNextStepId?.(
          { answers: {}, context: { siteData: undefined } },
        );

      // Assert
      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });

  describe("getPreviousStepId", () => {
    it("returns construction and rehabilitation when going back from projected operating expenses after reuse", () => {
      // Arrange
      const answers: WizardFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1500 },
        },
      };

      // Act
      const previousStep =
        stepHandlerRegistry.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES.getPreviousStepId?.(
          { answers, context: { siteData: undefined } },
        );

      // Assert
      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION");
    });

    it("returns installation when going back from projected operating expenses without reuse or buildings constructor", () => {
      // Arrange
      const answers: WizardFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 0 },
        },
      };

      // Act
      const previousStep =
        stepHandlerRegistry.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES.getPreviousStepId?.(
          { answers, context: { siteData: undefined } },
        );

      // Assert
      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });
  });
});
