import { roundTo1Digit, roundTo2Digits, roundToInteger } from "shared";

import { SumOnEvolutionPeriodService } from "./SumOnEvolutionPeriodService";

describe("SumOnEvolutionPeriodService", () => {
  it.each([
    { year: 2025, expected: 1.04 },
    { year: 2030, expected: 1.1 },
    { year: 2034, expected: 1.15 },
    { year: 2050, expected: 1.4 },
    { year: 2074, expected: 1.86 },
  ])("returns GrossDomesticProductPerCapitaEvolution for $year", ({ year, expected }) => {
    expect(
      roundTo2Digits(
        SumOnEvolutionPeriodService.getYearGrossDomesticProductPerCapitaEvolution(year),
      ),
    ).toEqual(expected);
  });

  it.each([
    { year: 2025, expected: 150 },
    { year: 2027, expected: 184 },
    { year: 2030, expected: 250 },
    { year: 2034, expected: 330 },
    { year: 2050, expected: 775 },
    { year: 2074, expected: 775 },
  ])("returns CO2 Monetary value for $year", ({ year, expected }) => {
    expect(roundToInteger(SumOnEvolutionPeriodService.getYearCO2MonetaryValue(year))).toEqual(
      expected,
    );
  });

  it.each([
    { year: 2025, expected: 132 },
    { year: 2030, expected: 120.9 },
    { year: 2034, expected: 113.3 },
    { year: 2050, expected: 87.2 },
    { year: 2074, expected: 87.2 },
  ])("returns CO2 vehicule emissions evolution for $year", ({ year, expected }) => {
    expect(
      roundTo1Digit(SumOnEvolutionPeriodService.getYearCO2EqEmittedPerVehiculeKilometerValue(year)),
    ).toEqual(expected);
  });

  it.each([
    { year: 2025, expected: 1 },
    { year: 2030, expected: 0.8 },
    { year: 2034, expected: 0.67 },
    { year: 2050, expected: 0.33 },
    { year: 2074, expected: 0.12 },
  ])("returns discount factor for $year related to 2025", ({ year, expected }) => {
    expect(roundTo2Digits(SumOnEvolutionPeriodService.getDiscountFactor(year - 2025))).toEqual(
      expected,
    );
  });

  it("returns total value actualised with discount rate for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    expect(service.sumWithDiscountFactor(83)).toEqual(1714);
  });

  it("returns total value actualised with discount rate for 33 years and starting after 1 year", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    expect(service.sumWithDiscountFactor(83, { rangeIndex: [1, 34] })).toEqual(1413);
  });

  it("returns total value actualised with discount rate for 10 years and starting after 1 year", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });
    expect(service.sumWithDiscountFactor(83, { rangeIndex: [1, 21] })).toEqual(603);
  });

  it("returns value actualised with GDP and discount rate for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    expect(service.sumWithDiscountFactorAndGDPEvolution(133912)).toEqual(3511611);
  });

  it("returns value actualised with CO2 value evolution and discount rate for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    expect(service.sumWithDiscountFactorAndCO2ValueEvolution(15000)).toEqual(145146579);
  });

  it("returns value actualised with CO2 value evolution evolution and discount rate for 1 year", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 1,
      operationsFirstYear: 2025,
    });
    expect(service.sumWithDiscountFactorAndCO2ValueEvolution(225000 / 1000000)).toEqual(34);
  });

  it("returns value actualised with CO2 value evolution evolution and discount rate for 30 year", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 30,
      operationsFirstYear: 2025,
    });
    expect(service.sumWithDiscountFactorAndCO2ValueEvolution(225000 / 1000000)).toEqual(1544);
  });

  it("returns value actualised with CO2 Vehicule Emissions evolution and discount rate for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    expect(service.sumWithCO2EqEmittedPerVehiculeKilometerEvolution(190000)).toEqual(930403742);
  });

  it("returns value actualised with custom function for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    expect(
      service.sumWithCustomFn(10, (value, yearIndex, { operationsFirstYear }) => {
        return value + operationsFirstYear + yearIndex;
      }),
    ).toEqual(102975);
  });
});
