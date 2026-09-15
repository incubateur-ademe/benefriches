import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { SumOnEvolutionPeriodService } from "../../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computePropertyValueImpact } from "./propertyValueImpact";

describe("Localresult.propertyValueIncrease impact", () => {
  let sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  before(() => {
    sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
      operationsFirstYear: 2025,
      evaluationPeriodInYears: 10,
    });
  });
  it("compute property value increase with friche removal", () => {
    const result = computePropertyValueImpact({
      siteSurfaceArea: 36000,
      citySurfaceArea: 20000000,
      cityPopulation: 36946,
      localHousePriceEuroPerSquareMeters: 974,
      sumOnEvolutionPeriodService,
      isRenaturation: false,
      cityIsRural: false,
      cityMteZonageAbc: "B",
    });
    assert.deepStrictEqual(result?.propertyValueIncrease, 455339);
    assert.deepStrictEqual(result?.propertyTransferDutiesIncrease, 6637);
  });

  it("compute property value increase with friche removal + renaturation", () => {
    const result = computePropertyValueImpact({
      siteSurfaceArea: 36000,
      citySurfaceArea: 20000000,
      cityPopulation: 36946,
      localHousePriceEuroPerSquareMeters: 974,
      sumOnEvolutionPeriodService: sumOnEvolutionPeriodService,
      isRenaturation: true,
      cityIsRural: false,
      cityMteZonageAbc: "B",
    });
    assert.deepStrictEqual(result?.propertyValueIncrease, 2286071);
    assert.deepStrictEqual(result?.propertyTransferDutiesIncrease, 33321);
  });

  it("compute property value increase for evalution period < 5", () => {
    const result = computePropertyValueImpact({
      siteSurfaceArea: 36000,
      citySurfaceArea: 20000000,
      cityPopulation: 36946,
      localHousePriceEuroPerSquareMeters: 974,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        operationsFirstYear: 2025,
        evaluationPeriodInYears: 3,
      }),
      isRenaturation: true,
      cityIsRural: false,
      cityMteZonageAbc: "B",
    });
    assert.deepStrictEqual(result?.propertyValueIncrease, 975188);
    assert.deepStrictEqual(result?.propertyTransferDutiesIncrease, 8585);
  });

  it("compute property value increase for evalution period of 50 years", () => {
    const result = computePropertyValueImpact({
      siteSurfaceArea: 36000,
      citySurfaceArea: 20000000,
      cityPopulation: 36946,
      localHousePriceEuroPerSquareMeters: 974,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        operationsFirstYear: 2025,
        evaluationPeriodInYears: 50,
      }),
      isRenaturation: true,
      cityIsRural: false,
      cityMteZonageAbc: "B",
    });
    assert.deepStrictEqual(result?.propertyValueIncrease, 2286071);
    assert.deepStrictEqual(result?.propertyTransferDutiesIncrease, 78036);
  });

  it("does not compute property value increase if city is rural", () => {
    const result = computePropertyValueImpact({
      siteSurfaceArea: 36000,
      citySurfaceArea: 20000000,
      cityPopulation: 36946,
      localHousePriceEuroPerSquareMeters: 974,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        operationsFirstYear: 2025,
        evaluationPeriodInYears: 50,
      }),
      isRenaturation: true,
      cityIsRural: true,
      cityMteZonageAbc: "C",
    });
    assert.deepStrictEqual(result, undefined);
  });

  it("keep only influence radius of 100 square meters if city is not rural and MTE zonage is B2", () => {
    const result = computePropertyValueImpact({
      siteSurfaceArea: 36000,
      citySurfaceArea: 20000000,
      cityPopulation: 36946,
      localHousePriceEuroPerSquareMeters: 974,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        operationsFirstYear: 2025,
        evaluationPeriodInYears: 50,
      }),
      isRenaturation: false,
      cityIsRural: false,
      cityMteZonageAbc: "B2",
    });
    assert.deepStrictEqual(result?.propertyValueIncrease, 139671);
    assert.deepStrictEqual(result?.propertyTransferDutiesIncrease, 4768);
  });

  it("does not compute property value increase if city is classified as C with MTE zonage", () => {
    const result = computePropertyValueImpact({
      siteSurfaceArea: 36000,
      citySurfaceArea: 20000000,
      cityPopulation: 36946,
      localHousePriceEuroPerSquareMeters: 974,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        operationsFirstYear: 2025,
        evaluationPeriodInYears: 50,
      }),
      isRenaturation: true,
      cityIsRural: false,
      cityMteZonageAbc: "C",
    });
    assert.deepStrictEqual(result, undefined);
  });
});
