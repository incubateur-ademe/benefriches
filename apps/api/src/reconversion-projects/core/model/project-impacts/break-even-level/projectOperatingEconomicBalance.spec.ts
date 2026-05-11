import { describe, it, expect, vi, beforeEach } from "vitest";

import type { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { getProjectOperatingEconomicBalance } from "./projectOperatingEconomicBalance";

describe("getProjectOperatingEconomicBalance", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
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
      expect(result).toHaveLength(0);
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

      expect(result).toHaveLength(2);
      expect(result[0]?.details).toBe("maintenance");
      expect(result[1]?.details).toBe("taxes");
      expect(result[0]?.total).toBe(-1_500);
      expect(result[1]?.total).toBe(-600);
    });

    it("computes cumulativeByYear array", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [],
        yearlyProjectedCosts: [{ amount: 100, purpose: "taxes" }],
        sumOnEvolutionPeriodService: mockService,
      });
      expect(result[0]?.detailsByYear).toEqual([-100, -100, -100]);
      expect(result[0]?.cumulativeByYear).toEqual([-100, -200, -300]);
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

      expect(result).toHaveLength(2);
      expect(result[0]?.details).toBe("operations");
      expect(result[1]?.details).toBe("other");
    });

    it("computes cumulativeByYear array", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [{ amount: 100, source: "operations" }],
        yearlyProjectedCosts: [],
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result[0]?.detailsByYear).toEqual([100, 100, 100]);
      expect(result[0]?.cumulativeByYear).toEqual([100, 200, 300]);
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

      expect(result).toHaveLength(4);
      expect(result[0]?.details).toBe("maintenance");
      expect(result[1]?.details).toBe("taxes");
      expect(result[0]?.total).toBe(-1_500);
      expect(result[1]?.total).toBe(-600);
    });

    it("computes cumulativeByYear array", () => {
      const result = getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [],
        yearlyProjectedCosts: [{ amount: 100, purpose: "taxes" }],
        sumOnEvolutionPeriodService: mockService,
      });
      expect(result[0]?.detailsByYear).toEqual([-100, -100, -100]);
      expect(result[0]?.cumulativeByYear).toEqual([-100, -200, -300]);
    });
    it("calls sumOnEvolutionPeriodService with 'discount' factor", () => {
      getProjectOperatingEconomicBalance({
        yearlyProjectedRevenues: [{ amount: 100, source: "rent" }],
        yearlyProjectedCosts: [{ amount: 50, purpose: "maintenance" }],
        sumOnEvolutionPeriodService: mockService,
      });

      getWeightedYearlyValuesSpy.mock.calls.forEach(([_value, weights]) => {
        expect(weights).toEqual(["discount"]);
      });
    });
  });
});
