import { describe, expect, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { RevenueBuildingsOperationsYearlyRevenuesHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/revenues/revenueBuildingsOperationsYearlyRevenues.handler";

describe("RevenueBuildingsOperationsYearlyRevenuesHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE", () => {
      const nextStep = RevenueBuildingsOperationsYearlyRevenuesHandler.getNextStepId({
        stepsState: {},
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE when site resale is planned (yes)", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      const previousStep = RevenueBuildingsOperationsYearlyRevenuesHandler.getPreviousStepId!({
        stepsState,
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE when site resale is unknown", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
      };

      const previousStep = RevenueBuildingsOperationsYearlyRevenuesHandler.getPreviousStepId!({
        stepsState,
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when site resale is not planned", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      };

      const previousStep = RevenueBuildingsOperationsYearlyRevenuesHandler.getPreviousStepId!({
        stepsState,
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when steps state is empty", () => {
      const previousStep = RevenueBuildingsOperationsYearlyRevenuesHandler.getPreviousStepId!({
        stepsState: {},
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });
});
