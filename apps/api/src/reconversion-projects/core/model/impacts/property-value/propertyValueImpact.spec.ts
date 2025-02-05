import { computePropertyValueImpact } from "./propertyValueImpact";

describe("LocalPropertyValueIncrease impact", () => {
  it("compute property value increase with friche removal", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      10,
      false,
    );
    expect(propertyValueIncrease).toBeCloseTo(518611.67);
    expect(propertyTransferDutiesIncrease).toBeCloseTo(9130.708);
  });

  it("compute property value increase with friche removal + renaturation", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      10,
      true,
    );
    expect(propertyValueIncrease).toBeCloseTo(2603739.67);
    expect(propertyTransferDutiesIncrease).toBeCloseTo(45841.6);
  });

  it("compute property value increase for evalution period < 5", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      3,
      true,
    );
    expect(propertyValueIncrease).toBeCloseTo(1562243.802);
    expect(propertyTransferDutiesIncrease).toBeCloseTo(13752.48);
  });

  it("compute property value increase for evalution period of 50 years", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      50,
      true,
    );
    expect(propertyValueIncrease).toBeCloseTo(2603739.67);
    expect(propertyTransferDutiesIncrease).toBeCloseTo(151277.27);
  });
});
