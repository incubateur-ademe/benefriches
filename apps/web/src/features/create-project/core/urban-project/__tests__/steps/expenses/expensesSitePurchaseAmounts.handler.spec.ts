import { roundToInteger } from "shared";
import { describe, expect, it } from "vitest";

import { ExpensesSitePurchaseAmountsHandler } from "@/features/create-project/core/urban-project/step-handlers/expenses/expenses-site-purchase-amounts/expensesSitePurchaseAmounts.handler";

import { mockSiteCityReferenceData, mockSiteData } from "../../_siteData.mock";

describe("ExpensesSitePurchaseAmountsHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_REINSTATEMENT when site is a friche", () => {
      const nextStep = ExpensesSitePurchaseAmountsHandler.getNextStepId({
        answers: {},
        context: {
          siteCityReferenceData: mockSiteCityReferenceData,
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
        },
      });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    });

    it("should return URBAN_PROJECT_EXPENSES_INSTALLATION when site is not a friche", () => {
      const nextStep = ExpensesSitePurchaseAmountsHandler.getNextStepId({
        answers: {},
        context: {
          siteCityReferenceData: mockSiteCityReferenceData,
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
        },
      });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });

    it("should return URBAN_PROJECT_EXPENSES_INSTALLATION when siteData is undefined", () => {
      const nextStep = ExpensesSitePurchaseAmountsHandler.getNextStepId({
        answers: {},
        context: { siteData: undefined, siteCityReferenceData: undefined },
      });

      expect(nextStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_EXPENSES_INTRODUCTION", () => {
      const previousStep = ExpensesSitePurchaseAmountsHandler.getPreviousStepId();

      expect(previousStep).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
    });
  });

  describe("getDefaultAnswers", () => {
    const successContext = {
      siteCityReferenceData: mockSiteCityReferenceData,
      siteData: { ...mockSiteData, surfaceArea: 1000 },
    };

    it("computes resale price and property transfer duties", () => {
      const result = ExpensesSitePurchaseAmountsHandler.getDefaultAnswers({
        context: successContext,
        answers: {},
      });

      const expectedPrice = 210 * 1000;
      expect(result?.sitePurchaseSellingPrice).toEqual(expectedPrice);
      expect(result?.sitePurchasePropertyTransferDuties).toBeGreaterThan(0);
    });

    it("rounds price as integer", () => {
      const result = ExpensesSitePurchaseAmountsHandler.getDefaultAnswers({
        context: {
          siteData: { ...mockSiteData, surfaceArea: 1234 },
          siteCityReferenceData: {
            ...mockSiteCityReferenceData,
            landAndRealEstateValues: {
              ...mockSiteCityReferenceData.landAndRealEstateValues,
              landWithoutBuildingsMedianPricePerSquareMeters: 12.345,
            },
          },
        },
        answers: {},
      });

      expect(Number.isInteger(result?.sitePurchaseSellingPrice)).toBe(true);
      expect(result?.sitePurchaseSellingPrice).toBe(roundToInteger(12.345 * 1234));
    });

    it("returns undefined if no siteCityReferenceData or siteData are not loaded", () => {
      expect(
        ExpensesSitePurchaseAmountsHandler.getDefaultAnswers({
          context: {
            ...successContext,
            siteCityReferenceData: {
              ...successContext.siteCityReferenceData,
              loadingState: "loading",
            },
          },
          answers: {},
        }),
      ).toBeUndefined();
      expect(
        ExpensesSitePurchaseAmountsHandler.getDefaultAnswers({
          context: {
            ...successContext,
            siteCityReferenceData: {
              ...successContext.siteCityReferenceData,
              loadingState: "error",
            },
          },
          answers: {},
        }),
      ).toBeUndefined();

      expect(
        ExpensesSitePurchaseAmountsHandler.getDefaultAnswers({
          context: {
            ...successContext,
            siteData: undefined,
          },
          answers: {},
        }),
      ).toBeUndefined();

      expect(
        ExpensesSitePurchaseAmountsHandler.getDefaultAnswers({
          context: {
            ...successContext,
            siteData: { ...mockSiteData, surfaceArea: 0 },
          },
          answers: {},
        }),
      ).toBeUndefined();
    });

    it("returns undefined landAndRealEstateValues is nil", () => {
      expect(
        ExpensesSitePurchaseAmountsHandler.getDefaultAnswers({
          answers: {},
          context: {
            ...successContext,
            siteCityReferenceData: {
              ...successContext.siteCityReferenceData,
              landAndRealEstateValues: {
                propertyValueMedianPricePerSquareMeters: 1000,
                accuracy: "city",
              },
            },
          },
        }),
      ).toBeUndefined();
      expect(
        ExpensesSitePurchaseAmountsHandler.getDefaultAnswers({
          answers: {},
          context: {
            ...successContext,
            siteCityReferenceData: {
              ...successContext.siteCityReferenceData,
              landAndRealEstateValues: {
                propertyValueMedianPricePerSquareMeters: 1000,
                accuracy: "city",
                landWithoutBuildingsMedianPricePerSquareMeters: 0,
              },
            },
          },
        }),
      ).toBeUndefined();
    });
  });
});
