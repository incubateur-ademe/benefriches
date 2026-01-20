import { describe, expect, it } from "vitest";

import { ExpensesSitePurchaseAmountsHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/expenses/expensesSitePurchaseAmounts.handler";

describe("ExpensesSitePurchaseAmountsHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_REINSTATEMENT when site is a friche", () => {
      const nextStep = ExpensesSitePurchaseAmountsHandler.getNextStepId({
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

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    });

    it("should return URBAN_PROJECT_EXPENSES_INSTALLATION when site is not a friche", () => {
      const nextStep = ExpensesSitePurchaseAmountsHandler.getNextStepId({
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

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });

    it("should return URBAN_PROJECT_EXPENSES_INSTALLATION when siteData is undefined", () => {
      const nextStep = ExpensesSitePurchaseAmountsHandler.getNextStepId({
        stepsState: {},
        siteData: undefined,
      });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_INTRODUCTION", () => {
      const previousStep = ExpensesSitePurchaseAmountsHandler.getPreviousStepId!({
        stepsState: {},
      });

      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
    });
  });
});
