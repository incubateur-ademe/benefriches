/* eslint-disable @typescript-eslint/dot-notation */
import { UrbanFreshnessRelatedImpactsService } from "./UrbanFreshnessRelatedImpactsService";

describe("UrbanFreshnessRelatedImpactsService", () => {
  describe("UrbanFreshnessRelatedImpactsService: hasUrbanFreshnessImpact", () => {
    it("returns no urban freshness impacts if there is no public green spaces in project", () => {
      const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
        siteSquareMetersSurfaceArea: 15000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {},
        spacesDistribution: {},
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });

      expect(urbanFreshnessRelatedImpactsService.hasUrbanFreshnessImpact).toEqual(false);
    });

    it("returns no urban freshness impacts if there is not enough public green spaces in project for public green space < 5000 m²", () => {
      const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
        siteSquareMetersSurfaceArea: 1000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 500,
          GROUND_FLOOR_RETAIL: 100,
        },
        spacesDistribution: {
          PUBLIC_GREEN_SPACES: 400,
        },
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });

      expect(urbanFreshnessRelatedImpactsService.hasUrbanFreshnessImpact).toEqual(false);
    });

    it("returns no urban freshness impacts if there is not enough public green spaces in project for 5000 < public green space < 10000 m²", () => {
      const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
        siteSquareMetersSurfaceArea: 15000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 5000,
          GROUND_FLOOR_RETAIL: 2600,
        },
        spacesDistribution: {
          PUBLIC_GREEN_SPACES: 400,
        },
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });

      expect(urbanFreshnessRelatedImpactsService.hasUrbanFreshnessImpact).toEqual(false);
    });
  });

  describe("UrbanFreshnessRelatedImpactsService: influenceRadius", () => {
    it("returns influence radius of 0 or 25 for public green space < 5000m²", () => {
      const params = {
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        siteSquareMetersSurfaceArea: 4000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
      };

      const withOnlyNewResidentsEffectService = new UrbanFreshnessRelatedImpactsService({
        ...params,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 1500,
          GROUND_FLOOR_RETAIL: 1000,
        },
        spacesDistribution: {
          PUBLIC_GREEN_SPACES: 2100,
        },
      });

      const newResidentsEffectAndInfluenceRadiusEffectService =
        new UrbanFreshnessRelatedImpactsService({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 3995,
          },
        });

      expect(withOnlyNewResidentsEffectService.hasUrbanFreshnessImpact).toEqual(true);
      expect(withOnlyNewResidentsEffectService["influenceRadius"]).toEqual(0);

      expect(newResidentsEffectAndInfluenceRadiusEffectService.hasUrbanFreshnessImpact).toEqual(
        true,
      );
      expect(newResidentsEffectAndInfluenceRadiusEffectService["influenceRadius"]).toEqual(25);
    });

    it("returns influence radius of 25 or 50 for public green space surface > 5000m² and < 10000m²", () => {
      const params = {
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        siteSquareMetersSurfaceArea: 20000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
      };

      expect(
        new UrbanFreshnessRelatedImpactsService({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 5100,
          },
        })["influenceRadius"],
      ).toEqual(25);
      expect(
        new UrbanFreshnessRelatedImpactsService({
          ...params,
          siteSquareMetersSurfaceArea: 10000,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 9990,
          },
        })["influenceRadius"],
      ).toEqual(50);
    });

    it("returns influence radius for public green space surface > 10000m²", () => {
      const params = {
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        siteSquareMetersSurfaceArea: 120000,
      };

      expect(
        new UrbanFreshnessRelatedImpactsService({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 11111,
          },
        })["influenceRadius"],
      ).toEqual(0);

      expect(
        new UrbanFreshnessRelatedImpactsService({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 65600,
          },
        })["influenceRadius"],
      ).toEqual(50);

      expect(
        new UrbanFreshnessRelatedImpactsService({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            GROUND_FLOOR_RETAIL: 1000,
          },
          spacesDistribution: {
            PUBLIC_GREEN_SPACES: 119000,
          },
        })["influenceRadius"],
      ).toEqual(75);
    });
  });

  describe("Urban Freshness related impacts", () => {
    it("returns no urban freshness impacts if there is no public green spaces in project", () => {
      const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
        siteSquareMetersSurfaceArea: 15000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {},
        spacesDistribution: {},
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });

      expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([]);
      expect(urbanFreshnessRelatedImpactsService.getEnvironmentalImpacts()).toEqual({});
      expect(urbanFreshnessRelatedImpactsService.getAvoidedCo2EqEmissionsDetails()).toEqual([]);
    });

    it("returns no urban freshness impacts if there is not enough public green spaces in project for public green space < 5000 m²", () => {
      const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
        siteSquareMetersSurfaceArea: 15000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 500,
          GROUND_FLOOR_RETAIL: 100,
        },
        spacesDistribution: {
          PUBLIC_GREEN_SPACES: 400,
        },
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });

      expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([]);
      expect(urbanFreshnessRelatedImpactsService.getEnvironmentalImpacts()).toEqual({});
      expect(urbanFreshnessRelatedImpactsService.getAvoidedCo2EqEmissionsDetails()).toEqual([]);
    });

    it("returns urban freshness impacts formated", () => {
      const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
        siteSquareMetersSurfaceArea: 120000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 1500,
          TERTIARY_ACTIVITIES: 12000,
          GROUND_FLOOR_RETAIL: 1000,
        },
        spacesDistribution: {
          PUBLIC_GREEN_SPACES: 65100,
        },
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });

      expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([
        {
          actor: "local_people",
          amount: 2481.42,
          impact: "avoided_air_conditioning_expenses",
          impactCategory: "economic_indirect",
        },
        {
          actor: "local_companies",
          amount: 9100,
          impact: "avoided_air_conditioning_expenses",
          impactCategory: "economic_indirect",
        },
      ]);
      expect(urbanFreshnessRelatedImpactsService.getEnvironmentalImpacts()).toEqual({
        avoidedAirConditioningCo2EqEmissions: 4.06,
      });
      expect(urbanFreshnessRelatedImpactsService.getAvoidedCo2EqEmissionsDetails()).toEqual([
        {
          amount: 1005.49,
          impact: "avoided_air_conditioning_co2_eq_emissions",
        },
      ]);
    });
  });
});
