import { describe, it, expect, vi, beforeEach } from "vitest";

import type { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeRentalIncomeImpacts } from "./rentalIncomeImpacts";

describe("computeRentalIncomeImpacts", () => {
  let getWeightedYearlyValuesSpy: ReturnType<typeof vi.fn>;
  let mockService: SumOnEvolutionPeriodService;

  beforeEach(() => {
    getWeightedYearlyValuesSpy = vi.fn((value: number) => [value, value, value]);
    mockService = {
      getWeightedYearlyValues: getWeightedYearlyValuesSpy,
    } as unknown as SumOnEvolutionPeriodService;
  });

  describe("without rent", () => {
    it("returns empty array", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [{ amount: 1_000, purpose: "taxes" }],
        currentYearlyExpenses: [{ amount: 500, purpose: "maintenance", bearer: "owner" }],
        hasSiteOwnerChange: true,
        sumOnEvolutionPeriodService: mockService,
      });
      expect(result).toHaveLength(0);
    });

    it("ignore expenses that are not 'rent'", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [
          { amount: 1_000, purpose: "taxes" },
          { amount: 500, purpose: "maintenance" },
        ],
        currentYearlyExpenses: [{ amount: 800, purpose: "security", bearer: "tenant" }],
        hasSiteOwnerChange: true,
        sumOnEvolutionPeriodService: mockService,
      });
      expect(result).toHaveLength(0);
    });
  });

  // ── Loyer projeté uniquement (sans loyer actuel) ──────────────────────────
  describe("with projected rent only", () => {
    it("returns projectedRentalIncome if owner changes", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [{ amount: 2_000, purpose: "rent" }],
        currentYearlyExpenses: [],
        hasSiteOwnerChange: true,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result).toHaveLength(1);
      const [item] = result;
      expect(item?.name).toBe("projectedRentalIncome");
      expect(item?.total).toBe(6_000); // 2000 × 3 ans
      expect(item?.detailsByYear).toEqual([2_000, 2_000, 2_000]);
      expect(item?.cumulativeByYear).toEqual([2_000, 4_000, 6_000]);
    });

    it("add projectedRentalIncome if no owner change", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [{ amount: 2_000, purpose: "rent" }],
        currentYearlyExpenses: [],
        hasSiteOwnerChange: false,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result).toHaveLength(1);
      const [item] = result;
      expect(item?.name).toBe("projectedRentalIncome");
      expect(item?.total).toBe(6_000); // 2000 × 3 ans
      expect(item?.detailsByYear).toEqual([2_000, 2_000, 2_000]);
      expect(item?.cumulativeByYear).toEqual([2_000, 4_000, 6_000]);
    });
  });

  // ── Loyer projeté + loyer actuel ─────────────────────────────────────────
  describe("witch projected rent and current rent", () => {
    it("returns projectedRentalIncome and oldRentalIncomeLoss if hasSiteOwnerChange", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [{ amount: 3_000, purpose: "rent" }],
        currentYearlyExpenses: [
          {
            amount: 1_000,
            purpose: "rent",
            bearer: "tenant",
          },
        ],
        hasSiteOwnerChange: true,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result).toHaveLength(2);

      const income = result.find((r) => r.name === "projectedRentalIncome");
      const loss = result.find((r) => r.name === "oldRentalIncomeLoss");

      expect(income).toBeDefined();
      expect(income?.total).toBe(9_000); // 3000 × 3

      expect(loss).toBeDefined();
      expect(loss?.total).toBe(-3_000); // 1000 × 3
    });

    it("computes projectedRentalIncomeIncrease if there is no owner changes", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [{ amount: 3_000, purpose: "rent" }],
        currentYearlyExpenses: [{ amount: 1_000, purpose: "rent", bearer: "tenant" }],
        hasSiteOwnerChange: false,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result.find((r) => r.name === "projectedRentalIncome")).toBeUndefined();

      const increase = result.find((r) => r.name === "projectedRentalIncomeIncrease");
      expect(increase).toBeDefined();
      expect(increase?.total).toBe(6_000);
    });

    it("computes negative projectedRentalIncomeIncrease with no owner changes", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [{ amount: 500, purpose: "rent" }],
        currentYearlyExpenses: [{ amount: 1_000, purpose: "rent", bearer: "tenant" }],
        hasSiteOwnerChange: false,
        sumOnEvolutionPeriodService: mockService,
      });

      const increase = result.find((r) => r.name === "projectedRentalIncomeIncrease");
      // différence = 500 - 1000 = -500 → -500 × 3 = -1500
      expect(increase?.total).toBe(-1_500);
    });
  });

  // ── Loyer actuel uniquement ───────────────────────────────────────────────
  describe("with current rent only", () => {
    it("computes negative oldRentalIncomeLoss", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [],
        currentYearlyExpenses: [{ amount: 1_500, purpose: "rent", bearer: "tenant" }],
        hasSiteOwnerChange: false,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result).toHaveLength(1);
      const [item] = result;
      expect(item?.name).toBe("oldRentalIncomeLoss");
      // -1500 × 3 = -4500
      expect(item?.total).toBe(-4_500);
    });

    it("computes negative cumulativeByYear oldRentalIncomeLoss", () => {
      const result = computeRentalIncomeImpacts({
        yearlyProjectedExpenses: [],
        currentYearlyExpenses: [{ amount: 1_000, purpose: "rent", bearer: "tenant" }],
        hasSiteOwnerChange: false,
        sumOnEvolutionPeriodService: mockService,
      });

      expect(result[0]?.cumulativeByYear).toEqual([-1_000, -2_000, -3_000]);
    });
  });
});
