import { CO2eqMonetaryValueServiceMock } from "src/reconversion-projects/core/gateways/CO2eqMonetaryValueService.mock";
import { GetInfluenceAreaValuesServiceMock } from "src/reconversion-projects/core/gateways/GetInfluenceAreaValuesService.mock";
import { TravelRelatedImpactsService } from "./TravelRelatedImpactsService";

describe("TravelRelatedImpactsService", () => {
  let travelRelatedImpactsService: TravelRelatedImpactsService;
  let cO2eqMonetaryValueService: CO2eqMonetaryValueServiceMock;

  beforeAll(() => {
    cO2eqMonetaryValueService = new CO2eqMonetaryValueServiceMock();
    travelRelatedImpactsService = new TravelRelatedImpactsService(
      new GetInfluenceAreaValuesServiceMock(),
      cO2eqMonetaryValueService,
      10000,
      1500,
      700,
      10,
      2025,
    );
  });

  it("computes impacted inhabitants", () => {
    expect(travelRelatedImpactsService.impactedInhabitants).toEqual(341.375);
  });

  it("computes impacted tertiary activity employees", () => {
    expect(travelRelatedImpactsService.impactedTertiaryActivityEmployees).toEqual(100);
  });

  it("computes impacted other activity employees", () => {
    expect(travelRelatedImpactsService.impactedOtherActivityEmployees).toEqual(10);
  });

  it("computes avoided kilometers per inhabitant", () => {
    expect(travelRelatedImpactsService.avoidedKilometersPerInhabitantTraveler).toEqual(74761.125);
  });

  it("computes avoided kilometers per tertiary activity employee", () => {
    expect(
      travelRelatedImpactsService.avoidedKilometersPerTertiaryActivityEmployeeTraveler,
    ).toEqual(13200);
  });

  it("computes avoided kilometers per other activity employee", () => {
    expect(travelRelatedImpactsService.avoidedKilometersPerOtherActivityEmployeeTraveler).toEqual(
      1320,
    );
  });

  it("computes avoided kilometers per traveler", () => {
    expect(travelRelatedImpactsService.avoidedKilometersPerTravelerPerYear).toEqual(89281.125);
  });

  it("computes avoided kilometers per vehicule", () => {
    expect(travelRelatedImpactsService.avoidedKilometersPerVehiculePerYear).toBeCloseTo(61573.19);
  });

  it("computes time saved per inhabitant", () => {
    expect(travelRelatedImpactsService.travelTimeSavedPerInhabitantTraveler).toBeCloseTo(2076.7);
  });

  it("computes time saved per tertiary activity employee", () => {
    expect(travelRelatedImpactsService.travelTimeSavedPerOtherActivityEmployeeTraveler).toBeCloseTo(
      366.67,
    );
  });

  it("computes time saved per other activity employee", () => {
    expect(
      travelRelatedImpactsService.travelTimeSavedPerTertiaryActivityEmployeeTraveler,
    ).toBeCloseTo(36.67);
  });

  it("computes time saved per traveler", () => {
    expect(travelRelatedImpactsService.travelTimeSavedPerTravelerPerYear).toBeCloseTo(2480.0312);
  });

  it("computes avoided accidents per year for a hundred of vehicule", () => {
    expect(travelRelatedImpactsService.avoidedAccidentsPerYear).toBeCloseTo(0.002937041);
  });

  it("computes travel time saved per traveler for duration", () => {
    expect(travelRelatedImpactsService.getTravelTimeSavedPerTraveler()).toBeCloseTo(24800.312);
  });

  it("computes avoided kilometer per vehicule for duration", () => {
    expect(travelRelatedImpactsService.getAvoidedKilometersPerVehicule()).toBeCloseTo(615731.9);
  });

  it("computes avoided kilometer per vehicule monetary value for duration", () => {
    expect(travelRelatedImpactsService.getAvoidedKilometersPerVehiculeMonetaryAmount()).toBeCloseTo(
      61573.1897,
    );
  });

  it("computes travel time saved per inhabitant traveler monetary value for duration", () => {
    expect(
      travelRelatedImpactsService.getTravelTimeSavedPerInhabitantTravelerMonetaryAmount(),
    ).toBeCloseTo(207669.792);
  });

  it("computes travel time saved per worker traveler monetary value for duration", () => {
    expect(
      travelRelatedImpactsService.getTravelTimeSavedPerWorkerTravelerMonetaryAmount(),
    ).toBeCloseTo(40333.33);
  });

  it("computes avoided co2eq emissions with avoided kilometers for duration", () => {
    expect(travelRelatedImpactsService.getAvoidedTrafficCO2EmissionsInTons()).toBeCloseTo(96.793);
  });

  it("computes avoided co2eq emissions with avoided kilometers monetary value for duration", () => {
    const spy = jest.spyOn(cO2eqMonetaryValueService, "getAnnualizedCO2MonetaryValueForDuration");
    travelRelatedImpactsService.getAvoidedTrafficCO2EmissionsMonetaryValue();
    expect(spy).toHaveBeenCalledWith(
      travelRelatedImpactsService.avoidedCO2EmissionsGramPerKilometerPerYear / 1000000,
      2025,
      10,
    );
  });

  it("computes avoided air pollution for duration", () => {
    expect(travelRelatedImpactsService.getAvoidedAirPollution()).toBeCloseTo(9728.563965517);
  });

  it("computes avoided accidents injuries and deaths for duration with low avoided kilometers", () => {
    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuries()).toEqual(0);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuries()).toEqual(0);
    expect(travelRelatedImpactsService.getAvoidedAccidentsDeaths()).toEqual(0);

    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesMonetaryValue()).toEqual(0);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesMonetaryValue()).toEqual(0);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesMonetaryValue()).toEqual(0);
  });

  it("computes avoided accidents injuries and deaths for duration with high avoided kilometers", () => {
    travelRelatedImpactsService.projectHousingSurfaceArea = 160000000;
    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuries()).toEqual(443);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuries()).toEqual(27);
    expect(travelRelatedImpactsService.getAvoidedAccidentsDeaths()).toEqual(8);

    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesMonetaryValue()).toEqual(
      7088000,
    );
    expect(
      travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesMonetaryValue(),
    ).toBeCloseTo(10800000);
    expect(travelRelatedImpactsService.getAvoidedAccidentsDeathsMonetaryValue()).toBeCloseTo(
      25600000,
    );
  });

  it("computes avoided property damages expenses for duration with high avoided kilometers", () => {
    travelRelatedImpactsService.projectHousingSurfaceArea = 160000000;
    expect(travelRelatedImpactsService.getAvoidedPropertyDamageCosts()).toBeCloseTo(2256443.75);
  });
});
