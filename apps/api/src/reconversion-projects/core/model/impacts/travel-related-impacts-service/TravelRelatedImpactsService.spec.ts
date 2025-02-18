import { TravelRelatedImpactsService } from "./TravelRelatedImpactsService";

describe("TravelRelatedImpactsService", () => {
  let travelRelatedImpactsService: TravelRelatedImpactsService;
  beforeAll(() => {
    travelRelatedImpactsService = new TravelRelatedImpactsService({
      siteSquareMetersSurfaceArea: 10000,
      citySquareMetersSurfaceArea: 6000000000,
      cityPopulation: 300000,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 10000,
        OFFICES: 1500,
        LOCAL_STORE: 500,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
      },
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });
  });

  it("computes avoided accidents injuries and deaths for duration with low avoided kilometers", () => {
    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuries()).toEqual(0);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuries()).toEqual(0);
    expect(travelRelatedImpactsService.getAvoidedAccidentsDeaths()).toEqual(0);

    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesExpenses()).toEqual(0);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesExpenses()).toEqual(0);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesExpenses()).toEqual(0);
  });

  it("computes avoided accidents injuries and deaths for duration with high avoided kilometers", () => {
    travelRelatedImpactsService = new TravelRelatedImpactsService({
      siteSquareMetersSurfaceArea: 10000,
      citySquareMetersSurfaceArea: 6000000000,
      cityPopulation: 300000,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 160000000,
        OFFICES: 1500,
        LOCAL_STORE: 500,
        ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 200,
      },
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });
    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuries()).toEqual(444);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuries()).toEqual(28);
    expect(travelRelatedImpactsService.getAvoidedAccidentsDeaths()).toEqual(8);

    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesExpenses()).toEqual(7100765);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesExpenses()).toEqual(
      11094945,
    );
    expect(travelRelatedImpactsService.getAvoidedAccidentsDeathsExpenses()).toEqual(26512596);
  });

  it("returns socioeconomic, social and environment impacts related to travel", () => {
    const travelRelatedImpactsService = new TravelRelatedImpactsService({
      siteSquareMetersSurfaceArea: 15000,
      citySquareMetersSurfaceArea: 15000000,
      cityPopulation: 18000,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 1500,
        LOCAL_STORE: 1000,
        OFFICES: 1000,
        CULTURAL_PLACE: 500,
        SPORTS_FACILITIES: 1000,
      },
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });

    expect(travelRelatedImpactsService.getSocioEconomicList()).toEqual([
      {
        actor: "french_society",
        amount: 30990.09,
        impact: "avoided_air_pollution",
        impactCategory: "social_monetary",
      },
      {
        actor: "local_people",
        amount: 196139.79,
        impact: "avoided_car_related_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "french_society",
        amount: 586.05,
        impact: "avoided_property_damages_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "local_people",
        amount: 790007.5,
        impact: "travel_time_saved",
        impactCategory: "social_monetary",
      },
    ]);
    expect(travelRelatedImpactsService.getEnvironmentalImpacts()).toEqual({
      avoidedCarTrafficCo2EqEmissions: 308.33,
    });
    expect(travelRelatedImpactsService.getAvoidedCo2EqEmissionsDetails()).toEqual([
      {
        amount: 76438.22,
        impact: "avoided_traffic_co2_eq_emissions",
      },
    ]);
    expect(travelRelatedImpactsService.getSocialImpacts()).toMatchObject({
      travelTimeSaved: 79000.75,
    });
  });
});
