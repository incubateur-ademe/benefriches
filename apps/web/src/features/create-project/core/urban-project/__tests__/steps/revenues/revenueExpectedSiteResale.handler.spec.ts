import { describe, expect, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { RevenueExpectedSiteResaleHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/revenues/revenueExpectedSiteResale.handler";

describe("RevenueExpectedSiteResaleHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_BUILDINGS_RESALE when project has buildings and buildings resale is planned", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
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

      const nextStep = RevenueExpectedSiteResaleHandler.getNextStepId({
        stepsState,
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES when project has buildings but no buildings resale planned", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { BUILDINGS: 1000 },
          },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: false,
          },
        },
      };

      const nextStep = RevenueExpectedSiteResaleHandler.getNextStepId({
        stepsState,
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
    });

    it("should return URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE when project has no buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { IMPERMEABLE_SURFACE: 1000 },
          },
        },
      };

      const nextStep = RevenueExpectedSiteResaleHandler.getNextStepId({
        stepsState,
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });

    it("should return URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE when steps state is empty", () => {
      const nextStep = RevenueExpectedSiteResaleHandler.getNextStepId({
        stepsState: {},
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION", () => {
      const previousStep = RevenueExpectedSiteResaleHandler.getPreviousStepId!({
        stepsState: {},
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });
});
