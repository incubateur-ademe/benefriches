import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { roundTo1Digit, roundTo2Digits, roundToInteger } from "shared";

import { SumOnEvolutionPeriodService } from "./SumOnEvolutionPeriodService";

describe("SumOnEvolutionPeriodService", () => {
  for (const { year, expected } of [
    { year: 2025, expected: 1.04 },
    { year: 2030, expected: 1.1 },
    { year: 2034, expected: 1.15 },
    { year: 2050, expected: 1.4 },
    { year: 2074, expected: 1.86 },
  ]) {
    it(`returns GrossDomesticProductPerCapitaEvolution for ${year}`, () => {
      assert.deepStrictEqual(
        roundTo2Digits(
          SumOnEvolutionPeriodService.getYearGrossDomesticProductPerCapitaEvolution(year),
        ),
        expected,
      );
    });
  }

  for (const { year, expected } of [
    { year: 2025, expected: 150 },
    { year: 2027, expected: 184 },
    { year: 2030, expected: 250 },
    { year: 2034, expected: 330 },
    { year: 2050, expected: 775 },
    { year: 2074, expected: 775 },
  ]) {
    it(`returns CO2 Monetary value for ${year}`, () => {
      assert.deepStrictEqual(
        roundToInteger(SumOnEvolutionPeriodService.getYearCO2MonetaryValue(year)),
        expected,
      );
    });
  }

  for (const { year, expected } of [
    { year: 2025, expected: 132 },
    { year: 2030, expected: 120.9 },
    { year: 2034, expected: 113.3 },
    { year: 2050, expected: 87.2 },
    { year: 2074, expected: 87.2 },
  ]) {
    it(`returns CO2 vehicule emissions evolution for ${year}`, () => {
      assert.deepStrictEqual(
        roundTo1Digit(
          SumOnEvolutionPeriodService.getYearCO2EqEmittedPerVehiculeKilometerValue(year),
        ),
        expected,
      );
    });
  }

  for (const { year, expected } of [
    { year: 2025, expected: 1 },
    { year: 2030, expected: 0.8 },
    { year: 2034, expected: 0.67 },
    { year: 2050, expected: 0.33 },
    { year: 2074, expected: 0.12 },
  ]) {
    it(`returns discount factor for ${year} related to 2025`, () => {
      assert.deepStrictEqual(
        roundTo2Digits(SumOnEvolutionPeriodService.getDiscountFactor(year - 2025)),
        expected,
      );
    });
  }

  it("returns total value actualised with discount rate for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    assert.deepStrictEqual(service.sumWithDiscountFactor(83), 1714);
  });

  it("returns total value actualised with discount rate for 33 years and starting after 1 year", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    assert.deepStrictEqual(
      service.sumWithDiscountFactor(83, { startYearIndex: 1, endYearIndex: 34 }),
      1413,
    );
  });

  it("returns total value actualised with discount rate for 10 years and starting after 1 year", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });
    assert.deepStrictEqual(
      service.sumWithDiscountFactor(83, { startYearIndex: 1, endYearIndex: 21 }),
      603,
    );
  });

  it("returns value actualised with GDP and discount rate for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    assert.deepStrictEqual(service.sumWithDiscountFactorAndGDPEvolution(133912), 3511611);
  });

  it("returns value actualised with CO2 value evolution and discount rate for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    assert.deepStrictEqual(service.sumWithDiscountFactorAndCO2ValueEvolution(15000), 145146579);
  });

  it("returns value actualised with CO2 value evolution evolution and discount rate for 1 year", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 1,
      operationsFirstYear: 2025,
    });
    assert.deepStrictEqual(service.sumWithDiscountFactorAndCO2ValueEvolution(225000 / 1000000), 34);
  });

  it("returns value actualised with CO2 value evolution evolution and discount rate for 30 year", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 30,
      operationsFirstYear: 2025,
    });
    assert.deepStrictEqual(
      service.sumWithDiscountFactorAndCO2ValueEvolution(225000 / 1000000),
      1544,
    );
  });

  it("returns value actualised with CO2 Vehicule Emissions evolution and discount rate for 50 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 50,
      operationsFirstYear: 2025,
    });
    assert.deepStrictEqual(service.sumWithCO2EqEmittedPerVehiculeKilometerEvolution(190000), 930);
  });

  it("returns array of values actualised with discount rate for 10 years", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });
    const values = service.getWeightedYearlyValues(190000, ["discount"]);
    assert.deepStrictEqual(values[0], 190000);
    assert.strictEqual(values.length, 10);
    assert.deepStrictEqual(
      values.toSorted((a, b) => b - a),
      values,
    );
  });

  it("returns array of non values actualised values", () => {
    const service = new SumOnEvolutionPeriodService({
      evaluationPeriodInYears: 5,
      operationsFirstYear: 2025,
    });
    const values = service.getWeightedYearlyValues(190000, [], {
      startYearIndex: 0,
      endYearIndex: 1,
    });
    assert.deepStrictEqual(values[0], 190000);
    assert.strictEqual(values.length, 5);
    assert.deepStrictEqual(values, [190000, 0, 0, 0, 0]);
  });

  it("should replace evaluationPeriodInYears by max or min value if wrong value is passed to service", () => {
    assert.deepStrictEqual(
      new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 5000,
        operationsFirstYear: 2025,
      }).evaluationPeriodInYears,
      50,
    );

    assert.deepStrictEqual(
      new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 50,
        operationsFirstYear: 2025,
      }).evaluationPeriodInYears,
      50,
    );

    assert.deepStrictEqual(
      new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 1,
        operationsFirstYear: 2025,
      }).evaluationPeriodInYears,
      1,
    );

    assert.deepStrictEqual(
      new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 25,
        operationsFirstYear: 2025,
      }).evaluationPeriodInYears,
      25,
    );

    assert.deepStrictEqual(
      new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 0,
        operationsFirstYear: 2025,
      }).evaluationPeriodInYears,
      1,
    );

    assert.deepStrictEqual(
      new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: -52,
        operationsFirstYear: 2025,
      }).evaluationPeriodInYears,
      1,
    );
  });
});
