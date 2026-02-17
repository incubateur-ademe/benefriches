import { describe, expect, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { UrbanProjectInstallationExpensesHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/expenses/expensesInstallation.handler";

describe("UrbanProjectInstallationExpensesHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES when project has buildings but no buildings resale planned", () => {
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

      const nextStep = UrbanProjectInstallationExpensesHandler.getNextStepId({
        stepsState,
      });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when project has buildings and buildings resale is planned", () => {
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

      const nextStep = UrbanProjectInstallationExpensesHandler.getNextStepId({
        stepsState,
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when project has no buildings", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: { IMPERMEABLE_SURFACE: 1000 },
          },
        },
      };

      const nextStep = UrbanProjectInstallationExpensesHandler.getNextStepId({
        stepsState,
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when steps state is empty", () => {
      const nextStep = UrbanProjectInstallationExpensesHandler.getNextStepId({
        stepsState: {},
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_REINSTATEMENT when site is a friche", () => {
      const previousStep = UrbanProjectInstallationExpensesHandler.getPreviousStepId!({
        stepsState: {},
        siteData: {
          id: "test-site",
          name: "Test Site",
          nature: "FRICHE",
          surfaceArea: 10000,
          soilsDistribution: {},
          isExpressSite: false,
          owner: { name: "Test Owner", structureType: "company" },
          address: {
            city: "Test City",
            cityCode: "12345",
            value: "Test Address",
            postCode: "12345",
            long: 0,
            lat: 0,
          },
        },
      });

      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    });

    it("should return URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS when site is not a friche", () => {
      const previousStep = UrbanProjectInstallationExpensesHandler.getPreviousStepId!({
        stepsState: {},
        siteData: {
          id: "test-site",
          name: "Test Site",
          nature: "AGRICULTURAL_OPERATION",
          surfaceArea: 10000,
          soilsDistribution: {},
          isExpressSite: false,
          owner: { name: "Test Owner", structureType: "company" },
          address: {
            city: "Test City",
            cityCode: "12345",
            value: "Test Address",
            postCode: "12345",
            long: 0,
            lat: 0,
          },
        },
      });

      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
    });

    it("should return URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS when siteData is undefined", () => {
      const previousStep = UrbanProjectInstallationExpensesHandler.getPreviousStepId!({
        stepsState: {},
        siteData: undefined,
      });

      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
    });
  });

  describe("getDefaultAnswers", () => {
    it("should return default installation expenses based on site surface area", () => {
      const defaultAnswers = UrbanProjectInstallationExpensesHandler.getDefaultAnswers!({
        stepsState: {},
        siteData: {
          id: "test-site",
          name: "Test Site",
          nature: "FRICHE",
          surfaceArea: 10000,
          soilsDistribution: {},
          isExpressSite: false,
          owner: { name: "Test Owner", structureType: "company" },
          address: {
            city: "Test City",
            cityCode: "12345",
            value: "Test Address",
            postCode: "12345",
            long: 0,
            lat: 0,
          },
        },
      });

      expect(defaultAnswers).toBeDefined();
      const installationExpenses = defaultAnswers?.installationExpenses;
      expect(installationExpenses).toBeDefined();
      expect(installationExpenses).toHaveLength(3);
      expect(installationExpenses?.map((e) => e.purpose)).toEqual([
        "development_works",
        "technical_studies",
        "other",
      ]);
      installationExpenses?.forEach((expense) => {
        expect(expense.amount).toBeGreaterThan(0);
      });
    });

    it("should return undefined when site surface area is not available", () => {
      const defaultAnswers = UrbanProjectInstallationExpensesHandler.getDefaultAnswers!({
        stepsState: {},
        siteData: undefined,
      });

      expect(defaultAnswers).toBeUndefined();
    });
  });
});
