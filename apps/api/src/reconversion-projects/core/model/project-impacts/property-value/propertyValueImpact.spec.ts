import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computePropertyValueImpact } from "./propertyValueImpact";

describe("LocalPropertyValueIncrease impact", () => {
  let sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  before(() => {
    sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
      operationsFirstYear: 2025,
      evaluationPeriodInYears: 10,
    });
  });
  it("compute property value increase with friche removal", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      sumOnEvolutionPeriodService,
      false,
    );
    assert.deepStrictEqual(propertyValueIncrease, 455339);
    assert.deepStrictEqual(propertyTransferDutiesIncrease, 6637);
  });

  it("compute property value increase with friche removal + renaturation", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      sumOnEvolutionPeriodService,
      true,
    );
    assert.deepStrictEqual(propertyValueIncrease, 2286071);
    assert.deepStrictEqual(propertyTransferDutiesIncrease, 33321);
  });

  it("compute property value increase for evalution period < 5", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      new SumOnEvolutionPeriodService({ operationsFirstYear: 2025, evaluationPeriodInYears: 3 }),
      true,
    );
    assert.deepStrictEqual(propertyValueIncrease, 975188);
    assert.deepStrictEqual(propertyTransferDutiesIncrease, 8585);
  });

  it("compute property value increase for evalution period of 50 years", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      new SumOnEvolutionPeriodService({ operationsFirstYear: 2025, evaluationPeriodInYears: 50 }),
      true,
    );
    assert.deepStrictEqual(propertyValueIncrease, 2286071);
    assert.deepStrictEqual(propertyTransferDutiesIncrease, 78036);
  });
});
