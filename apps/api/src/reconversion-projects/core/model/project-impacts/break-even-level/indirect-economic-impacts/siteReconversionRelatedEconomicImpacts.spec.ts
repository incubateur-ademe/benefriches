// oxlint-disable jest/no-commented-out-tests
import { roundToInteger, sumList } from "shared";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import {
  getFricheRoadsAndUtilitiesExpensesImpact,
  getLocalPropertyIncreaseWithFricheRemovalImpacts,
} from "./siteReconversionRelatedEconomicImpacts";

// ---------------------------------------------------------------------------

describe("getFricheRoadsAndUtilitiesExpensesImpact", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  it("returns 'fricheRoadsAndUtilitiesExpenses'", () => {
    const result = getFricheRoadsAndUtilitiesExpensesImpact({
      siteSurfaceArea: 10_000,
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result.name).toBe("fricheRoadsAndUtilitiesExpenses");
  });

  it("calls getWeightedYearlyValues with negative value", () => {
    getFricheRoadsAndUtilitiesExpensesImpact({
      siteSurfaceArea: 5_000,
      sumOnEvolutionPeriodService: mockService,
    });
    const value = getWeightedYearlyValuesSpy.mock.calls[0];
    expect(value?.[0]).toBeLessThan(0);
  });

  it("calls getWeightedYearlyValues with startYearIndex = 1", () => {
    getFricheRoadsAndUtilitiesExpensesImpact({
      siteSurfaceArea: 5_000,
      sumOnEvolutionPeriodService: mockService,
    });

    expect(getWeightedYearlyValuesSpy.mock.calls[0]?.[2]).toMatchObject({ startYearIndex: 1 });
  });

  it("has detailsByYear et cumulativeByYear in result", () => {
    const result = getFricheRoadsAndUtilitiesExpensesImpact({
      siteSurfaceArea: 1_000,
      sumOnEvolutionPeriodService: mockService,
    });
    expect(Array.isArray(result.detailsByYear)).toBe(true);
    expect(result.total).toEqual(sumList(result.detailsByYear));
    expect(Array.isArray(result.cumulativeByYear)).toBe(true);
  });
});

describe("getLocalPropertyIncreaseWithFricheRemovalImpacts", () => {
  const siteCityData = {
    citySquareMetersSurfaceArea: 5_000_000,
    cityPopulation: 50_000,
    cityPropertyValuePerSquareMeter: 2_500,
  };
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
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

    expect(result).toHaveLength(2);
    const names = result.map((r) => r.name);
    expect(names).toContain("localPropertyValueIncrease");
    expect(names).toContain("localTransferDutiesIncrease");
  });

  it("has detailsByYear et cumulativeByYear in result", () => {
    const result = getLocalPropertyIncreaseWithFricheRemovalImpacts({
      siteSurfaceArea: 10_000,
      siteCityData,
      sumOnEvolutionPeriodService: mockService,
    });

    result.forEach((item) => {
      expect(Array.isArray(item.detailsByYear)).toBe(true);
      expect(item.total).toEqual(roundToInteger(sumList(item.detailsByYear)));
      expect(Array.isArray(item.cumulativeByYear)).toBe(true);
    });
  });
});
