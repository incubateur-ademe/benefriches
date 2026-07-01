import assert from "node:assert/strict";
import { describe, it, beforeEach, mock } from "node:test";

import type { SumOnEvolutionPeriodService } from "../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { getProjectOperatingEconomicBalance } from "./projectOperatingEconomicBalance";

describe("getProjectOperatingEconomicBalance", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof mock.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = mock.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  describe("without costs or revenues", () => {
    it("returns empty array", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [],
        yearlyProjectedCosts: [],
        sumOnEvolutionPeriodService: mockService,
      });
      assert.strictEqual(result.length, 0);
    });
  });

  describe("with yearlyProjectedCosts", () => {
    it("create one item per cost with negative amount", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [],
        yearlyProjectedCosts: [
          { amount: 500, purpose: "maintenance" },
          { amount: 200, purpose: "taxes" },
        ],
        sumOnEvolutionPeriodService: mockService,
      });

      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0]?.details, "maintenance");
      assert.strictEqual(result[1]?.details, "taxes");
      assert.strictEqual(result[0]?.total, -1_500);
      assert.strictEqual(result[1]?.total, -600);
    });

    it("computes cumulativeByYear array", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [],
        yearlyProjectedCosts: [{ amount: 100, purpose: "taxes" }],
        sumOnEvolutionPeriodService: mockService,
      });
      assert.deepStrictEqual(result[0]?.detailsByYear, [-100, -100, -100]);
      assert.deepStrictEqual(result[0]?.cumulativeByYear, [-100, -200, -300]);
    });
  });

  describe("with yearlyProjectedRevenues", () => {
    it("create one item per cost with positive amount", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [
          { amount: 1_000, source: "operations" },
          { amount: 500, source: "other" },
        ],
        yearlyProjectedCosts: [],
        sumOnEvolutionPeriodService: mockService,
      });

      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0]?.details, "operations");
      assert.strictEqual(result[1]?.details, "other");
    });

    it("computes cumulativeByYear array", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [{ amount: 100, source: "operations" }],
        yearlyProjectedCosts: [],
        sumOnEvolutionPeriodService: mockService,
      });

      assert.deepStrictEqual(result[0]?.detailsByYear, [100, 100, 100]);
      assert.deepStrictEqual(result[0]?.cumulativeByYear, [100, 200, 300]);
    });
  });

  describe("with yearlyProjectedCosts and yearlyProjectedRevenues", () => {
    it("create one item per cost and revenue", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [
          { amount: 100, source: "operations" },
          { amount: 50, source: "rent" },
        ],
        yearlyProjectedCosts: [
          { amount: 500, purpose: "maintenance" },
          { amount: 200, purpose: "taxes" },
        ],
        sumOnEvolutionPeriodService: mockService,
      });

      assert.strictEqual(result.length, 4);
      assert.strictEqual(result[0]?.details, "maintenance");
      assert.strictEqual(result[1]?.details, "taxes");
      assert.strictEqual(result[0]?.total, -1_500);
      assert.strictEqual(result[1]?.total, -600);
    });

    it("computes cumulativeByYear array", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [],
        yearlyProjectedCosts: [{ amount: 100, purpose: "taxes" }],
        sumOnEvolutionPeriodService: mockService,
      });
      assert.deepStrictEqual(result[0]?.detailsByYear, [-100, -100, -100]);
      assert.deepStrictEqual(result[0]?.cumulativeByYear, [-100, -200, -300]);
    });

    it("calls sumOnEvolutionPeriodService with 'discount' factor", () => {
      getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [{ amount: 100, source: "rent" }],
        yearlyProjectedCosts: [{ amount: 50, purpose: "maintenance" }],
        sumOnEvolutionPeriodService: mockService,
      });

      getWeightedYearlyValuesSpy.mock.calls.forEach((call) => {
        const [_value, weights] = call.arguments as [number, string[]];
        assert.deepStrictEqual(weights, ["discount"]);
      });
    });
  });
});
