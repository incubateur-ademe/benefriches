import { describe, expect, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { RevenueIntroductionHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/revenues/revenue-introduction/revenueIntroduction.handler";

describe("RevenueIntroductionHandler", () => {
  describe("getNextStepId", () => {
    it("returns expected site resale when site resale is planned", () => {
      // Arrange
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      // Act
      const nextStep = RevenueIntroductionHandler.getNextStepId({ stepsState });

      // Assert
      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("returns expected site resale when site resale remains unknown", () => {
      // Arrange
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
      };

      // Act
      const nextStep = RevenueIntroductionHandler.getNextStepId({ stepsState });

      // Assert
      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("returns buildings resale when site resale is skipped but buildings resale is planned", () => {
      // Arrange
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
      };

      // Act
      const nextStep = RevenueIntroductionHandler.getNextStepId({ stepsState });

      // Assert
      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
    });

    it("returns financial assistance when no resale revenue applies", () => {
      // Arrange
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      };

      // Act
      const nextStep = RevenueIntroductionHandler.getNextStepId({ stepsState });

      // Assert
      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });
  });

  describe("getPreviousStepId", () => {
    it("returns projected operating expenses when going back without buildings resale", () => {
      // Arrange
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: false,
          },
        },
      };

      // Act
      const previousStep = RevenueIntroductionHandler.getPreviousStepId({ stepsState });

      // Assert
      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES");
    });

    it("returns construction and rehabilitation when reuse exists and buildings resale is planned", () => {
      // Arrange
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: {
            buildingsFootprintToReuse: 1200,
          },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
      };

      // Act
      const previousStep = RevenueIntroductionHandler.getPreviousStepId({ stepsState });

      // Assert
      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION");
    });

    it("returns installation when the project has no buildings", () => {
      // Arrange
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["OTHER_PUBLIC_SPACES"] },
        },
      };

      // Act
      const previousStep = RevenueIntroductionHandler.getPreviousStepId({ stepsState });

      // Assert
      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });

    it("returns installation when no prior expense information is available", () => {
      // Act
      const previousStep = RevenueIntroductionHandler.getPreviousStepId({ stepsState: {} });

      // Assert
      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });
  });
});
