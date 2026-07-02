import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeNitrogenCycleMonetaryValue,
  computeSoilErosionMonetaryValue,
  computeWaterRegulationMonetaryValue,
  computeForestRelatedProductMonetaryValue,
  computeInvasiveSpeciesRegulationMonetaryValue,
  computeNatureRelatedWellnessAndLeisureMonetaryValue,
  computePollinisationMonetaryValue,
  computeWaterCycleMonetaryValue,
} from "./natureConservationYearlyMonetaryValue";

describe("Nature conservation yearly monetary values", () => {
  it("computeNatureRelatedWellnessAndLeisureMonetaryValue", () => {
    assert.ok(
      Math.abs(
        computeNatureRelatedWellnessAndLeisureMonetaryValue({
          prairieSurfaceArea: 1000,
          forestSurfaceArea: 200,
        }) - 13,
      ) < 0.5,
    );
    assert.deepStrictEqual(computeNatureRelatedWellnessAndLeisureMonetaryValue({}), 0);
    assert.ok(
      Math.abs(
        computeNatureRelatedWellnessAndLeisureMonetaryValue({
          prairieSurfaceArea: 1000,
          forestSurfaceArea: 200,
          wetLandSurfaceArea: 8000,
        }) - 201,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        computeNatureRelatedWellnessAndLeisureMonetaryValue({
          prairieSurfaceArea: -1000,
          forestSurfaceArea: 200,
          wetLandSurfaceArea: 200,
        }) - 4,
      ) < 0.5,
    );
  });

  it("computeForestRelatedProductMonetaryValue", () => {
    assert.ok(Math.abs(computeForestRelatedProductMonetaryValue(200) - 3) < 0.5);
    assert.deepStrictEqual(computeForestRelatedProductMonetaryValue(0), 0);
    assert.ok(Math.abs(computeForestRelatedProductMonetaryValue(-550) - -9) < 0.5);
  });

  it("computePollinisationMonetaryValue", () => {
    assert.ok(Math.abs(computePollinisationMonetaryValue(1000) - 9) < 0.5);
    assert.deepStrictEqual(computePollinisationMonetaryValue(0), 0);
    assert.ok(Math.abs(computePollinisationMonetaryValue(-500) - -5) < 0.5);
  });

  it("computeInvasiveSpeciesRegulationMonetaryValue", () => {
    assert.ok(Math.abs(computeInvasiveSpeciesRegulationMonetaryValue(1000) - 3) < 0.5);
    assert.deepStrictEqual(computeInvasiveSpeciesRegulationMonetaryValue(0), 0);
    assert.ok(Math.abs(computeInvasiveSpeciesRegulationMonetaryValue(-250) - -1) < 0.5);
  });

  it("computeWaterCycleMonetaryValue", () => {
    assert.ok(Math.abs(computeWaterCycleMonetaryValue(100, 200) - 19) < 0.5);
    assert.ok(Math.abs(computeWaterCycleMonetaryValue(100, 0) - 14) < 0.5);
    assert.deepStrictEqual(computeWaterCycleMonetaryValue(0, 0), 0);
    assert.ok(Math.abs(computeWaterCycleMonetaryValue(-250, 100) - -31) < 0.5);
  });

  it("computeNitrogenCycleMonetaryValue", () => {
    assert.ok(
      Math.abs(
        computeNitrogenCycleMonetaryValue({ prairieSurfaceArea: 1000, wetLandSurfaceArea: 200 }) -
          11,
      ) < 0.5,
    );
    assert.deepStrictEqual(computeNitrogenCycleMonetaryValue({}), 0);
    assert.ok(
      Math.abs(
        computeNitrogenCycleMonetaryValue({
          prairieSurfaceArea: 1000,
          wetLandSurfaceArea: -8000,
        }) - -152,
      ) < 0.5,
    );
  });

  it("computeSoilErosionMonetaryValue", () => {
    assert.ok(Math.abs(computeSoilErosionMonetaryValue(250) - 6) < 0.5);
    assert.deepStrictEqual(computeSoilErosionMonetaryValue(0), 0);
    assert.ok(Math.abs(computeSoilErosionMonetaryValue(-250) - -6) < 0.5);
  });

  it("computeWaterRegulationMonetaryValue", () => {
    assert.ok(
      Math.abs(
        computeWaterRegulationMonetaryValue({
          prairieSurfaceArea: 1000,
          forestSurfaceArea: 200,
          decontaminatedSurfaceArea: 250,
        }) - 17,
      ) < 0.5,
    );
    assert.deepStrictEqual(computeWaterRegulationMonetaryValue({}), 0);
    assert.ok(
      Math.abs(
        computeWaterRegulationMonetaryValue({
          prairieSurfaceArea: 1000,
          forestSurfaceArea: 200,
          wetLandSurfaceArea: -4000,
          decontaminatedSurfaceArea: 150,
        }) - -336.54,
      ) < 0.005,
    );
  });
});
