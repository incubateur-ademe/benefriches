import { computeHouseholdsPoweredByRenewableEnergyImpact } from "./householdsPoweredByRenewableEnergyImpact";

describe("HouseholdsPoweredByRenewableEnergy impact", () => {
  it("returns 0 when no production expected", () => {
    expect(
      computeHouseholdsPoweredByRenewableEnergyImpact({
        forecastRenewableEnergyAnnualProductionMWh: 0,
      }),
    ).toEqual({
      current: 0,
      forecast: 0,
    });
  });

  it("returns 5 when production of 5 households is expected", () => {
    expect(
      computeHouseholdsPoweredByRenewableEnergyImpact({
        forecastRenewableEnergyAnnualProductionMWh: 23.395,
      }),
    ).toEqual({
      current: 0,
      forecast: 5,
    });
  });
});
