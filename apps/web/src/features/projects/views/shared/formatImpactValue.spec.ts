import {
  formatCO2Impact,
  formatDefaultImpact,
  formatMonetaryImpact,
  formatSurfaceAreaImpact,
} from "./formatImpactValue";

describe("Impact value formatting", () => {
  describe("formatDefaultImpact", () => {
    it("returns 123000.456 as +123 000,5", () => {
      expect(formatDefaultImpact(123000.456)).toEqual("+123 000,5");
    });
    it("returns -345.678 as -345.68", () => {
      expect(formatDefaultImpact(-345.67)).toEqual("-345,7");
    });
    it("returns 789 as 789 when no sign prefix", () => {
      expect(formatDefaultImpact(789, { withSignPrefix: false })).toEqual("789");
    });
  });
  describe("formatMonetaryImpact", () => {
    it("returns 123000.456 as +123 000,46 €", () => {
      expect(formatMonetaryImpact(123000.456)).toEqual("+123 000,46 €");
    });
    it("returns -345.678 as -345.67 €", () => {
      expect(formatMonetaryImpact(-345.67)).toEqual("-345,67 €");
    });
    it("returns 789 as 789 when no sign prefix", () => {
      expect(formatMonetaryImpact(789, { withSignPrefix: false })).toEqual("789 €");
    });
  });
  describe("formatSurfaceAreaImpact", () => {
    it("returns 123000.456 as +123 000,5 ㎡", () => {
      expect(formatSurfaceAreaImpact(123000.456)).toEqual("+123 000,5 ㎡");
    });
    it("returns -345.678 as -345.7 ㎡", () => {
      expect(formatSurfaceAreaImpact(-345.67)).toEqual("-345,7 ㎡");
    });
    it("returns 789 as 789 when no sign prefix", () => {
      expect(formatSurfaceAreaImpact(789, { withSignPrefix: false })).toEqual("789 ㎡");
    });
  });
  describe("formatCO2Impact", () => {
    it("returns 123000.456 as +123 000,5 t", () => {
      expect(formatCO2Impact(123000.456)).toEqual("+123 000,5 t");
    });
    it("returns -345.678 as -345.7 t", () => {
      expect(formatCO2Impact(-345.67)).toEqual("-345,7 t");
    });
    it("returns 789 as 789 when no sign prefix", () => {
      expect(formatCO2Impact(789, { withSignPrefix: false })).toEqual("789 t");
    });
  });
});
