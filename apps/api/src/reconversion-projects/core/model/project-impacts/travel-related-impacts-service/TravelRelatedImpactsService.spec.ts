import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
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
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
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
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuries()).toEqual(444);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuries()).toEqual(28);
    expect(travelRelatedImpactsService.getAvoidedAccidentsDeaths()).toEqual(8);

    expect(travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesExpenses()).toEqual(7750407);
    expect(travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesExpenses()).toEqual(
      12110210,
    );
    expect(travelRelatedImpactsService.getAvoidedAccidentsDeathsExpenses()).toEqual(28938699);
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
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });

    expect(travelRelatedImpactsService.getSocioEconomicList()).toEqual([
      {
        actor: "french_society",
        amount: 27919,
        impact: "avoided_air_pollution",
        impactCategory: "social_monetary",
      },
      {
        actor: "local_people",
        amount: 212041,
        impact: "avoided_car_related_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "french_society",
        amount: 528,
        impact: "avoided_property_damages_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "local_people",
        amount: 709578,
        impact: "travel_time_saved",
        impactCategory: "social_monetary",
      },
    ]);
    expect(travelRelatedImpactsService.getAvoidedTrafficCO2Emissions()).toEqual({
      inTons: 239.78,
      monetaryValue: 45308,
    });
    expect(travelRelatedImpactsService.getTravelTimeSavedPerTraveler()).toEqual(79000.75);
    expect(travelRelatedImpactsService.getAvoidedTrafficAccidents()).toEqual(undefined);
  });
});
