import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "./avoidedCO2WithEnergyProductionImpact";

describe("AvoidedCO2WithEnergyProduction impact", () => {
  it("returns 0 when no energy production", () => {
    expect(
      computeAvoidedCO2TonsWithEnergyProductionImpact({ forecastAnnualEnergyProductionMWh: 0 }),
    ).toEqual({
      current: 0,
      forecast: 0,
    });
  });

  it("returns 336 tons when no forecast photovoltaic annual production is 14000", () => {
    expect(
      computeAvoidedCO2TonsWithEnergyProductionImpact({ forecastAnnualEnergyProductionMWh: 14000 }),
    ).toEqual({
      current: 0,
      forecast: 336,
    });
  });
});
