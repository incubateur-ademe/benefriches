/* oxlint-disable typescript/dot-notation */
import assert from "node:assert/strict";
import { describe, it, before } from "node:test";

import { InfluenceAreaService } from "./InfluenceAreaService";

describe("GetInfluenceAreaValuesService", () => {
  let getInfluenceAreaValuesService: InfluenceAreaService;

  before(() => {
    getInfluenceAreaValuesService = new InfluenceAreaService({
      siteSquareMetersSurfaceArea: 10000,
      citySquareMetersSurfaceArea: 6000000000,
      cityPopulation: 300000,
    });
  });

  it("returns municipal density of 50 hab/km²", () => {
    assert.strictEqual(
      getInfluenceAreaValuesService["municipalDensityInhabitantPerSquareMeter"] * 1000000,
      50,
    );
  });

  it("returns 1600 houses per square kilometer for the city", () => {
    assert.strictEqual(getInfluenceAreaValuesService["cityHousingPerSquareMeter"] * 1000000, 1600);
  });

  it("returns an influence area of 972644 m²", () => {
    assert.ok(
      Math.abs(getInfluenceAreaValuesService["influenceSquareMetersArea"] - 962643.55) < 0.005,
    );
  });

  it("returns an housing surface of 1556 m² in influence area", () => {
    assert.ok(
      Math.abs(
        getInfluenceAreaValuesService.getInfluenceAreaSquareMetersHousingSurface() - 1540.23,
      ) < 0.005,
    );
  });

  it("computes inhabitants from housing surface", () => {
    assert.ok(
      Math.abs(InfluenceAreaService.getInhabitantsFromHousingSurface(50000) - 1562.5) < 0.005,
    );
  });

  it("computes households from housing surface", () => {
    assert.ok(
      Math.abs(InfluenceAreaService.getHouseholdsFromHousingSurface(50000) - 710.227272727) < 0.005,
    );
  });

  it("computes influence area with influence radius", () => {
    getInfluenceAreaValuesService = new InfluenceAreaService({
      siteSquareMetersSurfaceArea: 10000,
      citySquareMetersSurfaceArea: 6000000000,
      cityPopulation: 300000,
      influenceRadius: 100,
    });
    assert.ok(Math.abs(getInfluenceAreaValuesService["influenceSquareMetersArea"] - 66865) < 0.005);
    assert.ok(
      Math.abs(
        getInfluenceAreaValuesService.getInfluenceAreaSquareMetersHousingSurface() - 106.984,
      ) < 0.005,
    );
  });
});
