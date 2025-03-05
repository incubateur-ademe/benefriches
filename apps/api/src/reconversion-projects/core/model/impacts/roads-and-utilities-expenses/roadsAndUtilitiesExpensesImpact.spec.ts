import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";
import {
  computeYearlyRoadsAndUtilitiesMaintenanceExpenses,
  getRoadsAndUtilitiesExpensesImpacts,
} from "./roadsAndUtilitiesExpensesImpact";

describe("roadsAndUtilitiesExpensesImpact impact", () => {
  describe("computeYearlyRoadsAndUtilitiesMaintenanceExpenses impact", () => {
    it("compute roads and utilities maintenance expenses", () => {
      const result = computeYearlyRoadsAndUtilitiesMaintenanceExpenses(40000);
      expect(result).toEqual(35980);
    });
  });

  describe("getRoadsAndUtilitiesExpensesImpacts impact", () => {
    let sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
    beforeAll(() => {
      sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      });
    });
    it("returns roads and utilities maintenance expenses with friche removal", () => {
      const result = getRoadsAndUtilitiesExpensesImpacts({
        isFriche: true,
        surfaceArea: 40000,
        sumOnEvolutionPeriodService,
      });
      expect(result).toEqual(-261531);
    });

    it("returns empty array for non friche site", () => {
      const result = getRoadsAndUtilitiesExpensesImpacts({
        isFriche: false,
        surfaceArea: 40000,
        sumOnEvolutionPeriodService,
      });
      expect(result).toEqual(undefined);
    });
  });
});
