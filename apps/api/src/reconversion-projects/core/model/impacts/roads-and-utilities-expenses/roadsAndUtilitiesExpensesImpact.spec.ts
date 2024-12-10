import {
  computeRoadsAndUtilitiesMaintenanceExpensesImpact,
  formatRoadsAndUtilitiesExpensesImpacts,
} from "./roadsAndUtilitiesExpensesImpact";

describe("avoidedRoadAndUtilitiesExpensesImpact impact", () => {
  describe("computeAvoidedRoadAndUtilitiesMaintenanceExpensesImpact impact", () => {
    it("returns no value for non friche site", () => {
      const result = computeRoadsAndUtilitiesMaintenanceExpensesImpact(false, 10000, 10);
      expect(result).toEqual(undefined);
    });

    it("compute avoided road and utilities maintenance expenses with friche removal", () => {
      const result = computeRoadsAndUtilitiesMaintenanceExpensesImpact(true, 40000, 10);
      expect(result).toBeCloseTo(-300800);
    });
  });
  describe("formatAvoidedRoadAndUtilitiesExpensesImpacts impact", () => {
    it("returns avoided road and utilities maintenance expenses with friche removal", () => {
      const result = formatRoadsAndUtilitiesExpensesImpacts(true, 40000, 10);
      expect(result).toEqual({
        socioeconomic: [
          {
            impact: "avoided_roads_and_utilities_maintenance_expenses",
            amount: -300800,
            actor: "community",
            impactCategory: "economic_indirect",
          },
        ],
      });
    });

    it("returns empty array for non friche site", () => {
      const result = formatRoadsAndUtilitiesExpensesImpacts(false, 10000, 10);
      expect(result).toEqual({
        socioeconomic: [],
      });
    });
  });
});
