import { computePercentage, computeValueFromPercentage } from "./percentage";

describe("Percentage computing utils", () => {
  describe("computePercentage", () => {
    it("should return 0 when part is 0", () => {
      expect(computePercentage(0, 100)).toEqual(0);
    });
    it("should return 0 when total is 0", () => {
      expect(computePercentage(100, 0)).toEqual(0);
    });
    it("should return 20 when part is 250 and total is 1250", () => {
      expect(computePercentage(250, 1250)).toEqual(20);
    });
  });

  describe("computeValueFromPercentage", () => {
    it("should return 0 when percentage is 0", () => {
      expect(computeValueFromPercentage(0, 100)).toEqual(0);
    });
    it("should return 0 when total is 0", () => {
      expect(computeValueFromPercentage(100, 0)).toEqual(0);
    });
    it("should return 1 when percentage is 2 and total is 50", () => {
      expect(computeValueFromPercentage(2, 50)).toEqual(1);
    });
  });
});
