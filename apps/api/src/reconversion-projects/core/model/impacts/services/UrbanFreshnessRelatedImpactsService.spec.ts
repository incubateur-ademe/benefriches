import { CO2eqMonetaryValueServiceMock } from "src/reconversion-projects/core/gateways/CO2eqMonetaryValueService.mock";
import { GetInfluenceAreaValuesServiceMock } from "src/reconversion-projects/core/gateways/GetInfluenceAreaValuesService.mock";
import { UrbanFreshnessRelatedImpactsService } from "./UrbanFreshnessRelatedImpactsService";

describe("UrbanFreshnessRelatedImpactsService", () => {
  let urbanFreshnessRelatedImpactsService: UrbanFreshnessRelatedImpactsService;
  let cO2eqMonetaryValueService: CO2eqMonetaryValueServiceMock;

  beforeAll(() => {
    cO2eqMonetaryValueService = new CO2eqMonetaryValueServiceMock();
    urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService(
      new GetInfluenceAreaValuesServiceMock(),
      cO2eqMonetaryValueService,
      10000,
      1500,
      700,
      10,
      2025,
    );
  });

  it("computes impacted households", () => {
    expect(urbanFreshnessRelatedImpactsService.impactedHouseholds).toBeCloseTo(155.17);
  });

  it("computes avoided air conditioning expenses for inhabitants", () => {
    expect(
      urbanFreshnessRelatedImpactsService.getAvoidedInhabitantsAirConditioningExpenses(),
    ).toBeCloseTo(5430.966);
  });

  it("computes avoided air conditioning expenses for business buildings", () => {
    expect(
      urbanFreshnessRelatedImpactsService.getAvoidedBusinessBuildingsAirConditioningExpenses(),
    ).toEqual(1320);
  });

  it("computes total avoided air conditioning expenses", () => {
    expect(urbanFreshnessRelatedImpactsService.getAvoidedAirConditioningExpenses()).toBeCloseTo(
      6750.966,
    );
  });

  it("computes avoided air conditionning CO2 emissions for housing", () => {
    expect(
      urbanFreshnessRelatedImpactsService.getHousingAvoidedAirConditioningCo2EmissionsInTons(),
    ).toEqual(1.6386);
  });

  it("computes avoided air conditionning CO2 emissions for business buildings", () => {
    expect(
      urbanFreshnessRelatedImpactsService.getBusinessBuildingsAvoidedAirConditioningCo2EmissionsInTons(),
    ).toEqual(0.5808);
  });

  it("computes total avoided air conditionning CO2 emissions", () => {
    expect(
      urbanFreshnessRelatedImpactsService.getAvoidedAirConditioningCo2EmissionsInTons(),
    ).toEqual(2.2194);
  });

  it("computes total avoided air conditionning CO2 emissions monetary value", () => {
    const spy = jest.spyOn(cO2eqMonetaryValueService, "getAnnualizedCO2MonetaryValueForDuration");
    urbanFreshnessRelatedImpactsService.getAvoidedAirConditioningCo2EmissionsMonetaryValue();
    expect(spy).toHaveBeenCalledWith(
      urbanFreshnessRelatedImpactsService.avoidedAirConditioningCo2EmissionsPerYear / 1000000,
      2025,
      10,
    );
  });
});
