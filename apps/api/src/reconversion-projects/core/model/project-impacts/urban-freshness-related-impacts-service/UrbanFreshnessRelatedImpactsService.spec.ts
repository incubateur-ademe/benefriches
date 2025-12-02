import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { UrbanFreshnessRelatedImpactsService } from "./UrbanFreshnessRelatedImpactsService";

describe("UrbanFreshnessRelatedImpactsService", () => {
  it("returns no urban freshness impacts if there is no public green spaces in project", () => {
    const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
      siteSquareMetersSurfaceArea: 15000,
      citySquareMetersSurfaceArea: 15000000,
      cityPopulation: 18000,
      buildingsFloorAreaDistribution: {},
      projectPublicGreenSpaceSurface: 0,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });

    expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([]);
    expect(urbanFreshnessRelatedImpactsService.getAvoidedAirConditioningCo2Emissions()).toEqual(
      undefined,
    );
  });

  it("returns no urban freshness impacts if there is not enough public green spaces in project for public green space < 5000 m²", () => {
    const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
      siteSquareMetersSurfaceArea: 15000,
      citySquareMetersSurfaceArea: 15000000,
      cityPopulation: 18000,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 500,
        LOCAL_STORE: 100,
      },
      projectPublicGreenSpaceSurface: 400,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });

    expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([]);
    expect(urbanFreshnessRelatedImpactsService.getAvoidedAirConditioningCo2Emissions()).toEqual(
      undefined,
    );
  });

  it("returns urban freshness impacts formated", () => {
    const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
      siteSquareMetersSurfaceArea: 120000,
      citySquareMetersSurfaceArea: 15000000,
      cityPopulation: 18000,
      buildingsFloorAreaDistribution: {
        RESIDENTIAL: 1500,
        OFFICES: 12000,
        LOCAL_STORE: 1000,
      },
      projectPublicGreenSpaceSurface: 65100,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });

    expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([
      {
        actor: "local_people",
        amount: 2052,
        impact: "avoided_air_conditioning_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "local_companies",
        amount: 7525,
        impact: "avoided_air_conditioning_expenses",
        impactCategory: "economic_indirect",
      },
    ]);
    expect(urbanFreshnessRelatedImpactsService.getAvoidedAirConditioningCo2Emissions()).toEqual({
      inTons: 4.06,
      monetaryValue: 771,
    });
  });
});
