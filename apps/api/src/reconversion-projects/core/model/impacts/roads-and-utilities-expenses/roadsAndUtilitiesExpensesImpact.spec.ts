import {
  computeRoadsAndUtilitiesMaintenanceExpensesImpact,
  formatRoadsAndUtilitiesExpensesImpacts,
} from "./roadsAndUtilitiesExpensesImpact";

describe("roadsAndUtilitiesExpensesImpact impact", () => {
  describe("computeRoadsAndUtilitiesMaintenanceExpensesImpact impact", () => {
    it("returns no value for non friche site", () => {
      const result = computeRoadsAndUtilitiesMaintenanceExpensesImpact(false, 10000, 10);
      expect(result).toEqual(undefined);
    });

    it("compute roads and utilities maintenance expenses with friche removal", () => {
      const result = computeRoadsAndUtilitiesMaintenanceExpensesImpact(true, 40000, 10);
      expect(result).toBeCloseTo(-300800);
    });
  });
  describe("formatRoadAndUtilitiesExpensesImpacts impact", () => {
    it("returns roads and utilities maintenance expenses with friche removal", () => {
      const result = formatRoadsAndUtilitiesExpensesImpacts(true, 40000, 10);
      expect(result).toEqual({
        socioeconomic: [
          {
            impact: "roads_and_utilities_maintenance_expenses",
            amount: -300800,
            actor: "community",
            impactCategory: "economic_direct",
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
