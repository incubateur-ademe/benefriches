import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces,
  computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces,
  computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea,
  PERCENT_RATIO_PER_BUILDINGS_TYPE,
} from "./expectedPostDevelopmentResale";

describe("computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces", () => {
  it("returns 0 for empty buildingsDistribution", () => {
    assert.equal(computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces({}), 0);
  });

  it("computes resale price with only one building use", () => {
    assert.equal(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces({ RESIDENTIAL: 100 }),
      15000,
    );
  });

  it("computes resale price with several building uses", () => {
    assert.equal(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces({
        RESIDENTIAL: 100,
        OFFICES: 50,
        LOCAL_STORE: 10,
      }),
      20900,
    );
  });

  it("computes resale price by handling decimal ratio", () => {
    assert.equal(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces({
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 10,
      }),
      725,
    );
  });

  it("returns 0 with usages with no ratio defined", () => {
    assert.equal(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces({
        MULTI_STORY_PARKING: 1000,
        HOSPITAL: 500,
      }),
      0,
    );
  });

  it("computes resale price by ignoring usages with no ratio defined", () => {
    assert.equal(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces({
        RESIDENTIAL: 100,
        MULTI_STORY_PARKING: 1000,
      }),
      15000,
    );
  });

  it("handles undefined surface as 0", () => {
    assert.equal(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces({
        RESIDENTIAL: undefined,
        OFFICES: 10,
      }),
      900,
    );
  });
});

describe("computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea", () => {
  it("returns 0 for empty buildingsDistribution", () => {
    assert.equal(computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea({}), 0);
  });

  it("computes resale price with tense area ratios", () => {
    assert.equal(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea({
        RESIDENTIAL: 100,
        OFFICES: 10,
        PUBLIC_FACILITIES: 10,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 10,
      }),
      33925,
    );
  });

  it("computes resale price higher in tense area than in normal area", () => {
    const distribution = { RESIDENTIAL: 100 };
    assert.ok(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea(distribution) >
        computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces(distribution),
    );
  });

  it("computes resale price by ignoring usages with no ratio defined", () => {
    assert.equal(
      computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea({
        SPORTS_FACILITIES: 300,
      }),
      0,
    );
  });
});

describe("PERCENT_RATIO_PER_BUILDINGS_TYPE", () => {
  it("takes RESIDENTIAL as reference ratio", () => {
    assert.equal(PERCENT_RATIO_PER_BUILDINGS_TYPE.RESIDENTIAL, 1);
  });
});

describe("computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces", () => {
  it("returns undefined for empty buildingsDistribution", () => {
    assert.equal(
      computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
        buildingsFloorAreaDistribution: {},
        propertyValueMedianPricePerSquareMeters: 3000,
        buildingFootprintArea: 100,
      }),
      undefined,
    );
  });

  it("computes resale price with only one building use", () => {
    assert.equal(
      computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
        buildingsFloorAreaDistribution: { RESIDENTIAL: 200 },
        propertyValueMedianPricePerSquareMeters: 3000,
        buildingFootprintArea: 100,
      }),
      300000,
    );
  });

  it("applies usage ratio on median price", () => {
    assert.equal(
      computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
        buildingsFloorAreaDistribution: { OFFICES: 400 },
        propertyValueMedianPricePerSquareMeters: 1000,
        buildingFootprintArea: 100,
      }),
      60000,
    );
  });

  it("computes usages footprint with prorata of floor area", () => {
    assert.equal(
      computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
        buildingsFloorAreaDistribution: { RESIDENTIAL: 100, OFFICES: 100 },
        propertyValueMedianPricePerSquareMeters: 1000,
        buildingFootprintArea: 50,
      }),
      40000,
    );
  });

  it("use default ratio for usages without ratio", () => {
    assert.equal(
      computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
        buildingsFloorAreaDistribution: { RESIDENTIAL: 100, MULTI_STORY_PARKING: 100 },
        propertyValueMedianPricePerSquareMeters: 1000,
        buildingFootprintArea: 100,
      }),
      70000,
    );
  });

  it("returns undefined if buildingFootprintArea is 0", () => {
    assert.equal(
      computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
        buildingsFloorAreaDistribution: { RESIDENTIAL: 100 },
        propertyValueMedianPricePerSquareMeters: 3000,
        buildingFootprintArea: 0,
      }),
      undefined,
    );
  });

  it("returns undefined if median price is nil", () => {
    assert.equal(
      computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
        buildingsFloorAreaDistribution: { RESIDENTIAL: 100 },
        propertyValueMedianPricePerSquareMeters: 0,
        buildingFootprintArea: 100,
      }),
      0,
    );
  });

  it("rounds result as integer", () => {
    const result = computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces({
      buildingsFloorAreaDistribution: { LOCAL_STORE: 50 },
      propertyValueMedianPricePerSquareMeters: 1001,
      buildingFootprintArea: 10,
    });
    assert.ok(Number.isInteger(result));
    assert.equal(result, 9309);
  });
});
