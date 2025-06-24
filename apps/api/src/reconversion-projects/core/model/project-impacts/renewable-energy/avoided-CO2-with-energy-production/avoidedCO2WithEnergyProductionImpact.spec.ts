import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "./avoidedCO2WithEnergyProductionImpact";

describe("AvoidedCO2WithEnergyProduction impact", () => {
  it("returns 0 when no energy production", () => {
    expect(
      computeAvoidedCO2TonsWithEnergyProductionImpact({ forecastAnnualEnergyProductionMWh: 0 }),
    ).toEqual(0);
  });

  it("returns 336 tons when no forecast photovoltaic annual production is 14000", () => {
    expect(
      computeAvoidedCO2TonsWithEnergyProductionImpact({ forecastAnnualEnergyProductionMWh: 14000 }),
    ).toBeCloseTo(351.4, 1);
  });
});
