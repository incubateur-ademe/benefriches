import { describe, expect, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { UrbanProjectReinstatementExpensesHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/expenses/expensesReinstatement.handler";

describe("UrbanProjectReinstatementExpensesHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_INSTALLATION", () => {
      const nextStep = UrbanProjectReinstatementExpensesHandler.getNextStepId({
        stepsState: {},
      });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS", () => {
      const previousStep = UrbanProjectReinstatementExpensesHandler.getPreviousStepId!({
        stepsState: {},
      });

      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
    });
  });

  describe("getDefaultAnswers", () => {
    it("should return default reinstatement expenses based on soils distribution", () => {
      const stepsState: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: {
            decontaminatedSurfaceArea: 200,
          },
        },
      };

      const siteData: ProjectFormState["siteData"] = {
        id: "test-site",
        name: "Test Site",
        nature: "FRICHE",
        surfaceArea: 10000,
        soilsDistribution: {
          BUILDINGS: 2000,
          IMPERMEABLE_SOILS: 1000,
        },
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
      };

      const defaultAnswers = UrbanProjectReinstatementExpensesHandler.getDefaultAnswers!({
        stepsState,
        siteData,
      });

      expect(defaultAnswers).toBeDefined();
      const reinstatementExpenses = defaultAnswers?.reinstatementExpenses;
      expect(reinstatementExpenses).toBeDefined();
      expect(reinstatementExpenses).toHaveLength(5);
      expect(reinstatementExpenses?.map((e) => e.purpose)).toEqual([
        "asbestos_removal",
        "deimpermeabilization",
        "demolition",
        "sustainable_soils_reinstatement",
        "remediation",
      ]);
    });

    it("should return default values with zero amounts when no soils distribution", () => {
      const defaultAnswers = UrbanProjectReinstatementExpensesHandler.getDefaultAnswers!({
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
      const reinstatementExpenses = defaultAnswers?.reinstatementExpenses;
      expect(reinstatementExpenses).toBeDefined();
      expect(reinstatementExpenses).toHaveLength(5);
      reinstatementExpenses?.forEach((expense) => {
        expect(expense.amount).toBe(0);
      });
    });
  });
});
