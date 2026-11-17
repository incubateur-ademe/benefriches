import { describe, expect, it } from "vitest";

import { RevenueBuildingsResaleHandler } from "@/features/create-project/core/urban-project/step-handlers/revenues/revenue-buildings-resale/revenueBuildingsResale.handler";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";

import { mockSiteCityReferenceData, mockSiteData } from "../../_siteData.mock";

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
        context: { siteData: undefined, siteCityReferenceData: undefined },
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
        context: { siteData: undefined, siteCityReferenceData: undefined },
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
        context: { siteData: undefined, siteCityReferenceData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });

    it("should return URBAN_PROJECT_REVENUE_INTRODUCTION when steps state is empty", () => {
      const previousStep = RevenueBuildingsResaleHandler.getPreviousStepId({
        answers: {},
        context: { siteData: undefined, siteCityReferenceData: undefined },
      });

      expect(previousStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
    });
  });

  describe("getDefaultAnswers", () => {
    describe("without siteCityReferenceData", () => {
      it("uses default price per usages ratio to compute sellingPrice if loadingState is not success", () => {
        const result = RevenueBuildingsResaleHandler.getDefaultAnswers({
          answers: {
            URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
              completed: true,
              payload: {
                usesFloorSurfaceAreaDistribution: {
                  RESIDENTIAL: 100,
                  OFFICES: 50,
                },
              },
            },
          },
          context: {
            siteData: mockSiteData,
            siteCityReferenceData: {
              loadingState: "loading",
            },
          },
        });

        expect(result.buildingsResaleSellingPrice).toBe(19500);
      });

      it("uses default price per usages ratio to compute sellingPrice if siteCityReferenceData is not defined", () => {
        const result = RevenueBuildingsResaleHandler.getDefaultAnswers({
          answers: {
            URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
              completed: true,
              payload: {
                usesFloorSurfaceAreaDistribution: {
                  RESIDENTIAL: 100,
                },
              },
            },
          },
          context: {
            siteData: mockSiteData,
            siteCityReferenceData: {
              loadingState: "success",
            },
          },
        });

        expect(result.buildingsResaleSellingPrice).toBe(15000);
        expect(result.buildingsResalePropertyTransferDuties).toBeGreaterThan(0);
      });

      it("uses default price per usages ratio to compute sellingPrice if buildingFootprint is not defined", () => {
        const result = RevenueBuildingsResaleHandler.getDefaultAnswers({
          answers: {
            URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
              completed: true,
              payload: {
                usesFloorSurfaceAreaDistribution: {
                  RESIDENTIAL: 100,
                },
              },
            },
          },
          context: {
            siteData: mockSiteData,
            siteCityReferenceData: mockSiteCityReferenceData,
          },
        });

        expect(result.buildingsResaleSellingPrice).toBe(15000);
        expect(result.buildingsResalePropertyTransferDuties).toBeGreaterThan(0);
      });
      it("uses default price per usages ratio to compute sellingPrice if propertyValueMedianPricePerSquareMeters is 0", () => {
        const result = RevenueBuildingsResaleHandler.getDefaultAnswers({
          answers: {
            URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
              completed: true,
              payload: {
                usesFloorSurfaceAreaDistribution: {
                  RESIDENTIAL: 100,
                },
              },
            },
            URBAN_PROJECT_SPACES_SURFACE_AREA: {
              completed: true,
              payload: {
                spacesSurfaceAreaDistribution: {
                  BUILDINGS: 1500,
                },
              },
            },
          },
          context: {
            siteData: mockSiteData,
            siteCityReferenceData: {
              ...mockSiteCityReferenceData,
              landAndRealEstateValues: {
                ...mockSiteCityReferenceData.landAndRealEstateValues,
                propertyValueMedianPricePerSquareMeters: 0,
              },
            },
          },
        });

        expect(result.buildingsResaleSellingPrice).toBe(15000);
        expect(result.buildingsResalePropertyTransferDuties).toBeGreaterThan(0);
      });
    });

    describe("with siteCityReferenceData", () => {
      it("computes selling price with propertyValueMedianPricePerSquareMeters and buildingsFloorAreaDistribution", () => {
        const result = RevenueBuildingsResaleHandler.getDefaultAnswers({
          answers: {
            URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
              completed: true,
              payload: {
                usesFloorSurfaceAreaDistribution: {
                  RESIDENTIAL: 200,
                },
              },
            },
            URBAN_PROJECT_SPACES_SURFACE_AREA: {
              completed: true,
              payload: {
                spacesSurfaceAreaDistribution: {
                  BUILDINGS: 200,
                },
              },
            },
          },
          context: {
            siteData: mockSiteData,
            siteCityReferenceData: {
              ...mockSiteCityReferenceData,
              landAndRealEstateValues: {
                ...mockSiteCityReferenceData.landAndRealEstateValues,
                propertyValueMedianPricePerSquareMeters: 3000,
              },
            },
          },
        });

        expect(result.buildingsResaleSellingPrice).toBe(600000);
      });

      it("only counts residential surfaces on footprint surface", () => {
        const result = RevenueBuildingsResaleHandler.getDefaultAnswers({
          answers: {
            URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
              completed: true,
              payload: {
                usesFloorSurfaceAreaDistribution: {
                  RESIDENTIAL: 100,
                },
              },
            },
            URBAN_PROJECT_SPACES_SURFACE_AREA: {
              completed: true,
              payload: {
                spacesSurfaceAreaDistribution: {
                  BUILDINGS: 30,
                  ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000,
                },
              },
            },
          },
          context: {
            siteData: mockSiteData,
            siteCityReferenceData: {
              ...mockSiteCityReferenceData,
              landAndRealEstateValues: {
                ...mockSiteCityReferenceData.landAndRealEstateValues,
                propertyValueMedianPricePerSquareMeters: 1000,
              },
            },
          },
        });
        expect(result.buildingsResaleSellingPrice).toBe(30000);
      });

      it("computes resale price with several kind of usages", () => {
        const result = RevenueBuildingsResaleHandler.getDefaultAnswers({
          answers: {
            URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
              completed: true,
              payload: {
                usesFloorSurfaceAreaDistribution: {
                  RESIDENTIAL: 100,
                  OFFICES: 100,
                },
              },
            },
            URBAN_PROJECT_SPACES_SURFACE_AREA: {
              completed: true,
              payload: {
                spacesSurfaceAreaDistribution: {
                  BUILDINGS: 50,
                },
              },
            },
          },
          context: {
            siteData: mockSiteData,
            siteCityReferenceData: {
              ...mockSiteCityReferenceData,
              landAndRealEstateValues: {
                ...mockSiteCityReferenceData.landAndRealEstateValues,
                propertyValueMedianPricePerSquareMeters: 1000,
              },
            },
          },
        });
        expect(result.buildingsResaleSellingPrice).toBe(40000);
        expect(result.buildingsResalePropertyTransferDuties).toBeGreaterThan(0);
      });
    });

    it("considers buildings footprint as residential if there is no buildingsUseDistribution", () => {
      const result = RevenueBuildingsResaleHandler.getDefaultAnswers({
        answers: {
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: {
                BUILDINGS: 100,
              },
            },
          },
        },
        context: {
          siteData: mockSiteData,
          siteCityReferenceData: {
            ...mockSiteCityReferenceData,
            landAndRealEstateValues: {
              ...mockSiteCityReferenceData.landAndRealEstateValues,
              propertyValueMedianPricePerSquareMeters: 2000,
            },
          },
        },
      });
      expect(result.buildingsResaleSellingPrice).toBe(200000);
      expect(result.buildingsResalePropertyTransferDuties).toBeGreaterThan(0);
    });
  });
});
