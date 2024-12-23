import {
  getAnnualizedCO2MonetaryValueForDuration,
  getCO2MonetaryValueForYear,
} from "./co2eqMonetaryValue";

describe("CO2eqMonetaryValue services", () => {
  it("returns 34 € for 225000 gCO2eq avoided per year with 1 year duration", () => {
    expect(getAnnualizedCO2MonetaryValueForDuration(225000 / 1000000, 2025, 1)).toEqual(33.75);
  });

  it("returns 6412 € for 225000 gCO2eq avoided per year with 30 years duration", () => {
    expect(getAnnualizedCO2MonetaryValueForDuration(225000 / 1000000, 2025, 30)).toEqual(6411.21);
  });
});

describe("computeSoilsCarbonStorage", () => {
  it("compute CO2 eq monetary value for a year", () => {
    expect(getCO2MonetaryValueForYear(2025)).toEqual(150);
    expect(getCO2MonetaryValueForYear(2027)).toEqual(184);
    expect(getCO2MonetaryValueForYear(2030)).toEqual(250);
  });
});
