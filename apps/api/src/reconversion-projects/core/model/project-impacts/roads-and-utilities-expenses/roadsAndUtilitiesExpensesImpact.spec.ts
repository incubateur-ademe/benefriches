import assert from "node:assert/strict";
import { before, describe, it } from "node:test";

import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import {
  computeFricheRoadsAndUtilitiesExpensesImpacts,
  computeFricheYearlyRoadsAndUtilitiesMaintenanceExpenses,
} from "./roadsAndUtilitiesExpensesImpact";

describe("roadsAndUtilitiesExpensesImpact impact", () => {
  describe("computeYearlyRoadsAndUtilitiesMaintenanceExpenses impact", () => {
    it("compute roads and utilities maintenance expenses", () => {
      const result = computeFricheYearlyRoadsAndUtilitiesMaintenanceExpenses(40000);
      assert.deepStrictEqual(result, 35980);
    });
  });

  describe("getRoadsAndUtilitiesExpensesImpacts impact", () => {
    let sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
    before(() => {
      sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });
    });
    it("returns roads and utilities maintenance expenses with friche removal", () => {
      const result = computeFricheRoadsAndUtilitiesExpensesImpacts({
        isFriche: true,
        surfaceArea: 40000,
        sumOnEvolutionPeriodService,
      });
      assert.deepStrictEqual(result, -261531);
    });

    it("returns empty array for non friche site", () => {
      const result = computeFricheRoadsAndUtilitiesExpensesImpacts({
        isFriche: false,
        surfaceArea: 40000,
        sumOnEvolutionPeriodService,
      });
      assert.strictEqual(result, undefined);
    });
  });
});
