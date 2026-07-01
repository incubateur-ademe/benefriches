import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeHouseholdsPoweredByRenewableEnergyImpact } from "./householdsPoweredByRenewableEnergyImpact";

describe("HouseholdsPoweredByRenewableEnergy impact", () => {
  it("returns 0 when no production expected", () => {
    assert.deepStrictEqual(
      computeHouseholdsPoweredByRenewableEnergyImpact({
        forecastRenewableEnergyAnnualProductionMWh: 0,
      }),
      0,
    );
  });

  it("returns 5 when production of 5 households is expected", () => {
    assert.deepStrictEqual(
      computeHouseholdsPoweredByRenewableEnergyImpact({
        forecastRenewableEnergyAnnualProductionMWh: 23.395,
      }),
      5,
    );
  });
});
