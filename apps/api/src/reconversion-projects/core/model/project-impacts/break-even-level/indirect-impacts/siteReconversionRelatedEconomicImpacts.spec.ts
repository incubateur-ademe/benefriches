// oxlint-disable jest/no-commented-out-tests
import assert from "node:assert/strict";
import { describe, it, beforeEach, mock } from "node:test";
import { roundToInteger, sumList } from "shared";

import type { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import {
  getFricheRoadsAndUtilitiesExpensesImpact,
  getLocalPropertyIncreaseWithFricheRemovalImpacts,
  getReinstatementFullTimeJobs,
} from "./siteReconversionRelatedEconomicImpacts";

// ---------------------------------------------------------------------------

describe("getFricheRoadsAndUtilitiesExpensesImpact", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof mock.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = mock.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  it("returns 'fricheRoadsAndUtilitiesExpenses'", () => {
    const result = getFricheRoadsAndUtilitiesExpensesImpact({
      siteSurfaceArea: 10_000,
      sumOnEvolutionPeriodService: mockService,
    });
    assert.strictEqual(result.name, "fricheRoadsAndUtilitiesExpenses");
  });

  it("calls getWeightedYearlyValues with negative value", () => {
    getFricheRoadsAndUtilitiesExpensesImpact({
      siteSurfaceArea: 5_000,
      sumOnEvolutionPeriodService: mockService,
    });
    const value = getWeightedYearlyValuesSpy.mock.calls[0]?.arguments[0] as number;
    assert.ok(value < 0);
  });

  it("calls getWeightedYearlyValues with startYearIndex = 1", () => {
    getFricheRoadsAndUtilitiesExpensesImpact({
      siteSurfaceArea: 5_000,
      sumOnEvolutionPeriodService: mockService,
    });

    assert.strictEqual(getWeightedYearlyValuesSpy.mock.callCount(), 1);
    const opts = getWeightedYearlyValuesSpy.mock.calls[0]!.arguments[2] as {
      startYearIndex?: number;
    };
    assert.strictEqual(opts.startYearIndex, 1);
  });

  it("has detailsByYear et cumulativeByYear in result", () => {
    const result = getFricheRoadsAndUtilitiesExpensesImpact({
      siteSurfaceArea: 1_000,
      sumOnEvolutionPeriodService: mockService,
    });
    assert.strictEqual(Array.isArray(result.detailsByYear), true);
    assert.deepStrictEqual(result.total, sumList(result.detailsByYear));
    assert.strictEqual(Array.isArray(result.cumulativeByYear), true);
  });
});

describe("getLocalPropertyIncreaseWithFricheRemovalImpacts", () => {
  const siteCityData = {
    citySquareMetersSurfaceArea: 5_000_000,
    cityPopulation: 50_000,
    cityPropertyValuePerSquareMeter: 2_500,
  };
  let getWeightedYearlyValuesSpy: ReturnType<typeof mock.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = mock.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  it("returns localPropertyValueIncrease and localTransferDutiesIncrease impacts", () => {
    const result = getLocalPropertyIncreaseWithFricheRemovalImpacts({
      siteSurfaceArea: 10_000,
      siteCityData,
      sumOnEvolutionPeriodService: mockService,
    });

    assert.strictEqual(result.length, 2);
    const names = new Set(result.map((r) => r.name));
    assert.ok(names.has("localPropertyValueIncrease"));
    assert.ok(names.has("localTransferDutiesIncrease"));
  });

  it("has detailsByYear et cumulativeByYear in result", () => {
    const result = getLocalPropertyIncreaseWithFricheRemovalImpacts({
      siteSurfaceArea: 10_000,
      siteCityData,
      sumOnEvolutionPeriodService: mockService,
    });

    result.forEach((item) => {
      assert.strictEqual(Array.isArray(item.detailsByYear), true);
      assert.deepStrictEqual(item.total, roundToInteger(sumList(item.detailsByYear)));
      assert.strictEqual(Array.isArray(item.cumulativeByYear), true);
    });
  });

  describe("fullTimeJobs impact metrics", () => {
    it("returns 2 reinstatement ETP", () => {
      const result = getReinstatementFullTimeJobs({
        evaluationPeriodInYears: 20,
        reinstatementExpenses: [
          { amount: 2250000, purpose: "asbestos_removal" },
          { purpose: "remediation", amount: 3300000 },
          { purpose: "demolition", amount: 2250000 },
          { purpose: "deimpermeabilization", amount: 498000 },
          { purpose: "sustainable_soils_reinstatement", amount: 2520000 },
        ],
        reinstatementSchedule: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-06-30"),
        },
      });

      expect(result?.name).toEqual("reinstatementFullTimeJobs");
      expect(result?.total).toBeCloseTo(2, 0);
    });
  });
});
