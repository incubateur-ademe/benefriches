import { describe, expect, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { RevenueFinancialAssistanceHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/revenues/revenueFinancialAssistance.handler";

describe("RevenueFinancialAssistanceHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_INTRODUCTION", () => {
      const nextStep = RevenueFinancialAssistanceHandler.getNextStepId({
        stepsState: {},
      });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
    });
  });

  describe("getPreviousStepId", () => {
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

      const previousStep = RevenueFinancialAssistanceHandler.getPreviousStepId!({
        stepsState,
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
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

      const previousStep = RevenueFinancialAssistanceHandler.getPreviousStepId!({
        stepsState,
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
    });

    it("should return URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE when site resale is planned (yes) and no buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { IMPERMEABLE_SURFACE: 1000 },
          },
        },
      };

      const previousStep = RevenueFinancialAssistanceHandler.getPreviousStepId!({
        stepsState,
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE when site resale is unknown and no buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { IMPERMEABLE_SURFACE: 1000 },
          },
        },
      };

      const previousStep = RevenueFinancialAssistanceHandler.getPreviousStepId!({
        stepsState,
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when no resale is planned and no buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      };

      const previousStep = RevenueFinancialAssistanceHandler.getPreviousStepId!({
        stepsState,
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when steps state is empty", () => {
      const previousStep = RevenueFinancialAssistanceHandler.getPreviousStepId!({
        stepsState: {},
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });
});
