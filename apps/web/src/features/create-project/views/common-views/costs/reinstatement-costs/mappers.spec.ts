import { mapFormValuesToReinstatementExpenses } from "./mappers";

describe("Reinstatement expenses form mappers", () => {
  describe("convertFormValuesToExpenses", () => {
    it("should return an empty when form values are empty", () => {
      const result = mapFormValuesToReinstatementExpenses({});
      expect(result).toEqual([]);
    });
    it("should filter out undefined and zero values", () => {
      const result = mapFormValuesToReinstatementExpenses({
        asbestosRemovalAmount: 0,
        deimpermeabilizationAmount: undefined,
        demolitionAmount: 50,
        wasteCollectionAmount: 100,
      });
      expect(result).toEqual([
        { purpose: "demolition", amount: 50 },
        { purpose: "waste_collection", amount: 100 },
      ]);
    });
  });
});
