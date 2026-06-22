/* oxlint-disable typescript/dot-notation */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { YearlyUrbanFreshnessRelatedImpacts } from "./YearlyUrbanFreshnessRelatedImpacts";

describe("YearlyUrbanFreshnessRelatedImpacts", () => {
  describe("YearlyUrbanFreshnessRelatedImpacts: hasUrbanFreshnessImpact", () => {
    it("returns no urban freshness impacts if there is no public green spaces in project", () => {
      const urbanFreshnessRelatedImpactsService = new YearlyUrbanFreshnessRelatedImpacts({
        siteSquareMetersSurfaceArea: 15000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {},
        projectPublicGreenSpaceSurface: 0,
      });

      assert.deepStrictEqual(urbanFreshnessRelatedImpactsService.hasUrbanFreshnessImpact, false);
    });

    it("returns no urban freshness impacts if there is not enough public green spaces in project for public green space < 5000 m²", () => {
      const urbanFreshnessRelatedImpactsService = new YearlyUrbanFreshnessRelatedImpacts({
        siteSquareMetersSurfaceArea: 1000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 500,
          LOCAL_STORE: 100,
        },
        projectPublicGreenSpaceSurface: 400,
      });

      assert.deepStrictEqual(urbanFreshnessRelatedImpactsService.hasUrbanFreshnessImpact, false);
    });

    it("returns no urban freshness impacts if there is not enough public green spaces in project for 5000 < public green space < 10000 m²", () => {
      const urbanFreshnessRelatedImpactsService = new YearlyUrbanFreshnessRelatedImpacts({
        siteSquareMetersSurfaceArea: 15000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 5000,
          LOCAL_STORE: 2600,
        },
        projectPublicGreenSpaceSurface: 400,
      });

      assert.deepStrictEqual(urbanFreshnessRelatedImpactsService.hasUrbanFreshnessImpact, false);
    });
  });

  describe("YearlyUrbanFreshnessRelatedImpacts: influenceRadius", () => {
    it("returns influence radius of 0 or 25 for public green space < 5000m²", () => {
      const params = {
        siteSquareMetersSurfaceArea: 4000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
      };

      const withOnlyNewResidentsEffectService = new YearlyUrbanFreshnessRelatedImpacts({
        ...params,
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 1500,
          LOCAL_STORE: 1000,
        },
        projectPublicGreenSpaceSurface: 2100,
      });

      const newResidentsEffectAndInfluenceRadiusEffectService =
        new YearlyUrbanFreshnessRelatedImpacts({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            LOCAL_STORE: 1000,
          },
          projectPublicGreenSpaceSurface: 3995,
        });

      assert.deepStrictEqual(withOnlyNewResidentsEffectService.hasUrbanFreshnessImpact, true);
      assert.deepStrictEqual(withOnlyNewResidentsEffectService["influenceRadius"], 0);

      assert.deepStrictEqual(
        newResidentsEffectAndInfluenceRadiusEffectService.hasUrbanFreshnessImpact,
        true,
      );
      assert.deepStrictEqual(
        newResidentsEffectAndInfluenceRadiusEffectService["influenceRadius"],
        25,
      );
    });

    it("returns influence radius of 25 or 50 for public green space surface > 5000m² and < 10000m²", () => {
      const params = {
        siteSquareMetersSurfaceArea: 20000,
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
      };

      assert.deepStrictEqual(
        new YearlyUrbanFreshnessRelatedImpacts({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            LOCAL_STORE: 1000,
          },
          projectPublicGreenSpaceSurface: 5100,
        })["influenceRadius"],
        25,
      );
      assert.deepStrictEqual(
        new YearlyUrbanFreshnessRelatedImpacts({
          ...params,
          siteSquareMetersSurfaceArea: 10000,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            LOCAL_STORE: 1000,
          },
          projectPublicGreenSpaceSurface: 9990,
        })["influenceRadius"],
        50,
      );
    });

    it("returns influence radius for public green space surface > 10000m²", () => {
      const params = {
        citySquareMetersSurfaceArea: 15000000,
        cityPopulation: 18000,
        siteSquareMetersSurfaceArea: 120000,
      };

      assert.deepStrictEqual(
        new YearlyUrbanFreshnessRelatedImpacts({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            LOCAL_STORE: 1000,
          },
          projectPublicGreenSpaceSurface: 11111,
        })["influenceRadius"],
        0,
      );

      assert.deepStrictEqual(
        new YearlyUrbanFreshnessRelatedImpacts({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            LOCAL_STORE: 1000,
          },
          projectPublicGreenSpaceSurface: 65600,
        })["influenceRadius"],
        50,
      );

      assert.deepStrictEqual(
        new YearlyUrbanFreshnessRelatedImpacts({
          ...params,
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 1500,
            LOCAL_STORE: 1000,
          },
          projectPublicGreenSpaceSurface: 119000,
        })["influenceRadius"],
        75,
      );
    });
  });
});
