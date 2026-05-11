import { roundToInteger, sumList } from "shared";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import {
  getAvoidedFricheMaintenanceAndSecuringCosts,
  getPreviousSiteOperationBenefitLoss,
  getFricheRoadsAndUtilitiesExpensesImpact,
  getLocalPropertyIncreaseWithFricheRemovalImpacts,
} from "./siteReconversionRelatedEconomicImpacts";

describe("getAvoidedFricheMaintenanceAndSecuringCosts", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  it("returns empty array if there is no friche costs", () => {
    const result = getAvoidedFricheMaintenanceAndSecuringCosts({
      yearlyExpenses: [],
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result).toHaveLength(0);
  });

  it("returns only friche related costs", () => {
    const result = getAvoidedFricheMaintenanceAndSecuringCosts({
      yearlyExpenses: [
        { amount: 1_000, purpose: "security", bearer: "owner" },
        { amount: 500, purpose: "rent", bearer: "tenant" }, // doit être ignoré
        { amount: 200, purpose: "maintenance", bearer: "owner" },
      ],
      sumOnEvolutionPeriodService: mockService,
    });

    expect(result).toHaveLength(2);
    const purposes = result.map((r) => r.details);
    expect(purposes).toContain("security");
    expect(purposes).toContain("maintenance");
  });

  it("returns 'avoidedFricheMaintenanceAndSecuringCostsForOwner' for owner costs", () => {
    const result = getAvoidedFricheMaintenanceAndSecuringCosts({
      yearlyExpenses: [{ amount: 500, purpose: "security", bearer: "owner" }],
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result[0]?.name).toBe("avoidedFricheMaintenanceAndSecuringCostsForOwner");
  });

  it("returns 'avoidedFricheMaintenanceAndSecuringCostsForTenant' for tenant costs", () => {
    const result = getAvoidedFricheMaintenanceAndSecuringCosts({
      yearlyExpenses: [{ amount: 500, purpose: "illegalDumpingCost", bearer: "tenant" }],
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result[0]?.name).toBe("avoidedFricheMaintenanceAndSecuringCostsForTenant");
  });

  it("sum with evaluationPeriodInYears", () => {
    const result = getAvoidedFricheMaintenanceAndSecuringCosts({
      yearlyExpenses: [{ amount: 2_000, purpose: "maintenance", bearer: "owner" }],
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result[0]?.total).toBe(6_000);
  });

  it("adds all valid friche costs", () => {
    const frichePurposes = [
      "security",
      "illegalDumpingCost",
      "accidentsCost",
      "otherSecuringCosts",
      "maintenance",
    ] as const;
    const result = getAvoidedFricheMaintenanceAndSecuringCosts({
      yearlyExpenses: frichePurposes.map((purpose, i) => ({
        amount: (i + 1) * 100,
        purpose,
        bearer: "owner",
      })),
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result).toHaveLength(5);
  });

  it("each item contains detailsByYear and cumulativeByYear", () => {
    const result = getAvoidedFricheMaintenanceAndSecuringCosts({
      yearlyExpenses: [{ amount: 1_000, purpose: "security", bearer: "owner" }],
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result[0]?.detailsByYear).toBeDefined();
    expect(result[0]?.cumulativeByYear).toBeDefined();
    expect(result[0]?.cumulativeByYear).toEqual([1_000, 2_000, 3_000]);
  });
});

// ---------------------------------------------------------------------------

describe("getPreviousSiteOperationBenefitLoss", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  it("returns 'previousSiteOperationBenefitLoss'", () => {
    const result = getPreviousSiteOperationBenefitLoss({
      previousYearlyIncomes: [],
      previousYearlyExpenses: [],
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result.name).toBe("previousSiteOperationBenefitLoss");
  });

  it("computes benefit loss amount total for evaluation period", () => {
    const result = getPreviousSiteOperationBenefitLoss({
      previousYearlyIncomes: [
        { amount: 5_000, source: "operations" },
        { amount: 2_000, source: "product-sales" },
      ],
      previousYearlyExpenses: [{ amount: 3_000, purpose: "operationsTaxes", bearer: "tenant" }],
      sumOnEvolutionPeriodService: mockService,
    });

    // balance = 7000 - 3000 = 4000 ; total = 4000 * 3 = 12000
    expect(getWeightedYearlyValuesSpy).toHaveBeenCalledWith(4_000, ["discount"]);
    expect(result.total).toBe(12_000);
  });

  it("returns negative value if incomes are lower than expenses", () => {
    const result = getPreviousSiteOperationBenefitLoss({
      previousYearlyIncomes: [{ amount: 1_000, source: "operations" }],
      previousYearlyExpenses: [{ amount: 4_000, purpose: "maintenance", bearer: "tenant" }],
      sumOnEvolutionPeriodService: mockService,
    });

    // balance = 1000 - 4000 = -3000 ; total = -3000 * 3 = -9000
    expect(result.total).toBe(-9_000);
  });

  it("returns 0 if expenses === incomes ", () => {
    const result = getPreviousSiteOperationBenefitLoss({
      previousYearlyIncomes: [],
      previousYearlyExpenses: [],
      sumOnEvolutionPeriodService: mockService,
    });
    expect(result.total).toBe(0);
  });
});

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
