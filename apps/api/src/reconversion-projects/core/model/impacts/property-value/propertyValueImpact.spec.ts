import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";
import { computePropertyValueImpact } from "./propertyValueImpact";

describe("LocalPropertyValueIncrease impact", () => {
  let sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  beforeAll(() => {
    sumOnEvolutionPeriodService = new SumOnEvolutionPeriodService({
      operationsFirstYear: 2025,
      evaluationPeriodInYears: 10,
    });
  });
  it("compute property value increase with friche removal", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      sumOnEvolutionPeriodService,
      false,
    );
    expect(propertyValueIncrease).toEqual(455339);
    expect(propertyTransferDutiesIncrease).toEqual(6637);
  });

  it("compute property value increase with friche removal + renaturation", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      sumOnEvolutionPeriodService,
      true,
    );
    expect(propertyValueIncrease).toEqual(2286071);
    expect(propertyTransferDutiesIncrease).toEqual(33321);
  });

  it("compute property value increase for evalution period < 5", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      new SumOnEvolutionPeriodService({ operationsFirstYear: 2025, evaluationPeriodInYears: 3 }),
      true,
    );
    expect(propertyValueIncrease).toEqual(975188);
    expect(propertyTransferDutiesIncrease).toEqual(8585);
  });

  it("compute property value increase for evalution period of 50 years", () => {
    const { propertyTransferDutiesIncrease, propertyValueIncrease } = computePropertyValueImpact(
      36000,
      20000000,
      36946,
      974,
      new SumOnEvolutionPeriodService({ operationsFirstYear: 2025, evaluationPeriodInYears: 50 }),
      true,
    );
    expect(propertyValueIncrease).toEqual(2286071);
    expect(propertyTransferDutiesIncrease).toEqual(78036);
  });
});
