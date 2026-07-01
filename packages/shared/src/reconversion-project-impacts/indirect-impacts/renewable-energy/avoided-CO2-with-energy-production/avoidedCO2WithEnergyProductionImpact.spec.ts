import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "./avoidedCO2WithEnergyProductionImpact";

describe("AvoidedCO2WithEnergyProduction impact", () => {
  it("returns 0 when no energy production", () => {
    assert.deepStrictEqual(
      computeAvoidedCO2TonsWithEnergyProductionImpact({ forecastAnnualEnergyProductionMWh: 0 }),
      0,
    );
  });

  it("returns 336 tons when no forecast photovoltaic annual production is 14000", () => {
    const result = computeAvoidedCO2TonsWithEnergyProductionImpact({
      forecastAnnualEnergyProductionMWh: 14000,
    });
    assert.ok(Math.abs(result - 351.4) < Math.pow(10, -1) / 2);
  });
});
