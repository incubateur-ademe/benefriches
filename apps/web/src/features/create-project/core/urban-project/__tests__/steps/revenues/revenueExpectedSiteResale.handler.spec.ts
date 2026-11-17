import { roundToInteger } from "shared";
import { describe, expect, it } from "vitest";

import { RevenueExpectedSiteResaleHandler } from "@/features/create-project/core/urban-project/step-handlers/revenues/revenue-expected-site-resale/revenueExpectedSiteResale.handler";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";

import { mockSiteCityReferenceData, mockSiteData } from "../../_siteData.mock";

describe("RevenueExpectedSiteResaleHandler", () => {
  describe("getNextStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_BUILDINGS_RESALE when project has buildings and buildings resale is planned", () => {
      const answers: UrbanProjectStepsState = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
          },
        },
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: {
            developerWillBeBuildingsConstructor: true,
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
      };

      const nextStep = RevenueExpectedSiteResaleHandler.getNextStepId({
        answers,
        context: { siteData: undefined, siteCityReferenceData: undefined },
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
    });

    it("should return URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE when project has no buildings", () => {
      const answers: UrbanProjectStepsState = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
      };

      const nextStep = RevenueExpectedSiteResaleHandler.getNextStepId({
        answers,
        context: { siteData: undefined, siteCityReferenceData: undefined },
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });

    it("should return URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE when steps state is empty", () => {
      const nextStep = RevenueExpectedSiteResaleHandler.getNextStepId({
        answers: {},
        context: { siteData: undefined, siteCityReferenceData: undefined },
      });

      expect(nextStep).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
    });
  });

  describe("getPreviousStepId", () => {
    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION", () => {
      const previousStep = RevenueExpectedSiteResaleHandler.getPreviousStepId();

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });

  describe("getDefaultAnswers", () => {
    const successContext = {
      siteCityReferenceData: mockSiteCityReferenceData,
      siteData: { ...mockSiteData, surfaceArea: 1000 },
    };

    it("computes resale price and property transfer duties", () => {
      const result = RevenueExpectedSiteResaleHandler.getDefaultAnswers({
        context: successContext,
        answers: {},
      });

      const expectedPrice = 210 * 1000;
      expect(result?.siteResaleExpectedSellingPrice).toEqual(expectedPrice);
      expect(result?.siteResaleExpectedPropertyTransferDuties).toBeGreaterThan(0);
    });

    it("rounds price as integer", () => {
      const result = RevenueExpectedSiteResaleHandler.getDefaultAnswers({
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

      expect(Number.isInteger(result?.siteResaleExpectedSellingPrice)).toBe(true);
      expect(result?.siteResaleExpectedSellingPrice).toBe(roundToInteger(12.345 * 1234));
    });

    it("returns undefined if no siteCityReferenceData or siteData are not loaded", () => {
      expect(
        RevenueExpectedSiteResaleHandler.getDefaultAnswers({
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
        RevenueExpectedSiteResaleHandler.getDefaultAnswers({
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
        RevenueExpectedSiteResaleHandler.getDefaultAnswers({
          context: {
            ...successContext,
            siteCityReferenceData: {
              loadingState: "success",
            },
          },
          answers: {},
        }),
      ).toBeUndefined();

      expect(
        RevenueExpectedSiteResaleHandler.getDefaultAnswers({
          context: {
            ...successContext,
            siteData: undefined,
          },
          answers: {},
        }),
      ).toBeUndefined();

      expect(
        RevenueExpectedSiteResaleHandler.getDefaultAnswers({
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
        RevenueExpectedSiteResaleHandler.getDefaultAnswers({
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
        RevenueExpectedSiteResaleHandler.getDefaultAnswers({
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
