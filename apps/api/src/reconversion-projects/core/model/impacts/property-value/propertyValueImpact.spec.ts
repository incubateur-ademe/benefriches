import { computePropertyValueImpact } from "./propertyValueImpact";

describe("LocalPropertyValueIncrease impact", () => {
  it("compute property value increase with friche removal", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      false,
    );
    expect(propertyValueIncrease).toBeCloseTo(518611.67);
    expect(propertyTransferDutiesIncrease).toBeCloseTo(913.07);
  });

  it("compute property value increase with friche removal + renaturation", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      true,
    );
    expect(propertyValueIncrease).toBeCloseTo(2603739.67);
    expect(propertyTransferDutiesIncrease).toBeCloseTo(4584.16);
  });
});
