import { describe, expect, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { RevenueIntroductionHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/revenues/revenueIntroduction.handler";

describe("RevenueIntroductionHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE when site resale is planned (yes)", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      const nextStep = RevenueIntroductionHandler.getNextStepId!({ stepsState });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE when site resale is unknown (user can modify estimated values)", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { BUILDINGS: 1000 },
          },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
      };

      const nextStep = RevenueIntroductionHandler.getNextStepId!({ stepsState });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_BUILDINGS_RESALE when site resale not planned but buildings resale is planned", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { BUILDINGS: 1000 },
          },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
      };

      const nextStep = RevenueIntroductionHandler.getNextStepId!({ stepsState });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE when no resale is planned", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      };

      const nextStep = RevenueIntroductionHandler.getNextStepId!({ stepsState });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_BUILDINGS_RESALE_SELECTION when project has buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { BUILDINGS: 1000 },
          },
        },
      };

      const previousStep = RevenueIntroductionHandler.getPreviousStepId!({ stepsState });

      expect(previousStep).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
    });

    it("should return URBAN_PROJECT_SITE_RESALE_SELECTION when project has no buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { IMPERMEABLE_SURFACE: 1000 },
          },
        },
      };

      const previousStep = RevenueIntroductionHandler.getPreviousStepId!({ stepsState });

      expect(previousStep).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
    });
  });
});
