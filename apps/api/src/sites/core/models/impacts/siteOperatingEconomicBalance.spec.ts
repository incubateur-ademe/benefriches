import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { SumOnEvolutionPeriodService } from "src/reconversion-projects/core/model/sum-on-evolution-period/SumOnEvolutionPeriodService";

import { getSiteStatuQuoOperatingEconomicBalance } from "./siteOperatingEconomicBalance";

const BASE_PARAMS = {
  evaluationPeriodInYears: 10,
  operationsFirstYear: 2025,
} as const;

const makeSumService = (
  params: { evaluationPeriodInYears: number; operationsFirstYear: number } = BASE_PARAMS,
) => new SumOnEvolutionPeriodService(params);

describe("getSiteStatuQuoOperatingEconomicBalance", () => {
  it("returns empty total and details", () => {
    const result = getSiteStatuQuoOperatingEconomicBalance({
      yearlyExpenses: [],
      yearlyIncomes: [],
      sumOnEvolutionPeriodService: makeSumService(),
    });

    assert.strictEqual(result.total, 0);
    assert.strictEqual(result.details.length, 0);
  });

  describe("expenses", () => {
    it("computes negative balance if there is only expenses", () => {
      const result = getSiteStatuQuoOperatingEconomicBalance({
        yearlyExpenses: [{ amount: 10000, bearer: "tenant", purpose: "maintenance" }],
        yearlyIncomes: [],
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const expenseEntry = result.details.find((d) => d.details === "maintenance");
      assert.ok(expenseEntry !== undefined);
      assert.ok((expenseEntry?.total ?? 0) < 0);
    });

    it("adds each expenses to details array result", () => {
      const result = getSiteStatuQuoOperatingEconomicBalance({
        yearlyExpenses: [
          { amount: 5000, bearer: "owner", purpose: "taxes" },
          { amount: 2000, bearer: "tenant", purpose: "rent" },
        ],
        yearlyIncomes: [],
        sumOnEvolutionPeriodService: makeSumService(),
      });

      assert.strictEqual(result.details.length, 2);
    });
  });

  describe("incomes", () => {
    it("computes positive balance if there is only incomes", () => {
      const result = getSiteStatuQuoOperatingEconomicBalance({
        yearlyExpenses: [],
        yearlyIncomes: [{ amount: 10000, source: "operations" }],
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const incomeEntry = result.details.find((d) => d.details === "operations");
      assert.ok(incomeEntry !== undefined);
      assert.ok((incomeEntry?.total ?? 0) > 0);
    });
  });

  describe("economic balance", () => {
    it("computes economic balance", () => {
      const result = getSiteStatuQuoOperatingEconomicBalance({
        yearlyExpenses: [{ amount: 5000, bearer: "owner", purpose: "maintenance" }],
        yearlyIncomes: [{ amount: 10000, source: "product-sales" }],
        sumOnEvolutionPeriodService: makeSumService(),
      });

      assert.ok(result.total > 0);
    });

    it("rounds total in result", () => {
      const result = getSiteStatuQuoOperatingEconomicBalance({
        yearlyExpenses: [{ amount: 3000, bearer: "tenant", purpose: "rent" }],
        yearlyIncomes: [{ amount: 8000, source: "product-sales" }],
        sumOnEvolutionPeriodService: makeSumService(),
      });

      const manualSum = result.details.reduce((acc, d) => acc + d.total, 0);
      assert.strictEqual(result.total, Math.round(manualSum));
    });
  });

  describe("cumulativeByYear", () => {
    it("each entry has cumulativeByYear stable or decreasing", () => {
      const result = getSiteStatuQuoOperatingEconomicBalance({
        yearlyExpenses: [],
        yearlyIncomes: [{ amount: 1000, source: "operations" }],
        sumOnEvolutionPeriodService: makeSumService(),
      });

      assert.ok(result.details[0]?.cumulativeByYear !== undefined);
      const cumulative = result.details[0]?.cumulativeByYear ?? [];

      for (let i = 1; i < cumulative.length; i++) {
        assert.ok((cumulative[i] ?? 0) >= (cumulative[i - 1] ?? 0));
      }
    });

    it("each entry has cumulativeByYear with evaluationPeriodInYears length", () => {
      const evaluationPeriodInYears = 20;
      const result = getSiteStatuQuoOperatingEconomicBalance({
        yearlyExpenses: [{ amount: 1000, bearer: "owner", purpose: "taxes" }],
        yearlyIncomes: [],
        sumOnEvolutionPeriodService: makeSumService({
          evaluationPeriodInYears,
          operationsFirstYear: 2025,
        }),
      });

      result.details.forEach((d) => {
        assert.strictEqual(d.cumulativeByYear.length, evaluationPeriodInYears);
      });
    });
  });

  it("each entry has name === 'operatingEconomicBalance'", () => {
    const result = getSiteStatuQuoOperatingEconomicBalance({
      yearlyExpenses: [{ amount: 1000, bearer: "owner", purpose: "taxes" }],
      yearlyIncomes: [{ amount: 2000, source: "product-sales" }],
      sumOnEvolutionPeriodService: makeSumService(),
    });

    result.details.forEach((d) => {
      assert.strictEqual(d.name, "operatingEconomicBalance");
    });
  });
});
