import { describe, expect, it } from "vitest";

import { RevenueBuildingsResaleHandler } from "@/features/create-project/core/urban-project/step-handlers/revenues/revenue-buildings-resale/revenueBuildingsResale.handler";
import { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";

describe("RevenueBuildingsResaleHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE", () => {
      const nextStep = RevenueBuildingsResaleHandler.getNextStepId();

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE when site resale is planned (yes)", () => {
      const answers: UrbanProjectStepsState = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      const previousStep = RevenueBuildingsResaleHandler.getPreviousStepId({
        answers,
        context: { siteData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE when site resale is unknown", () => {
      const answers: UrbanProjectStepsState = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
      };

      const previousStep = RevenueBuildingsResaleHandler.getPreviousStepId({
        answers,
        context: { siteData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when site resale is not planned", () => {
      const answers: UrbanProjectStepsState = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      };

      const previousStep = RevenueBuildingsResaleHandler.getPreviousStepId({
        answers,
        context: { siteData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when steps state is empty", () => {
      const previousStep = RevenueBuildingsResaleHandler.getPreviousStepId({
        answers: {},
        context: { siteData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });
});
