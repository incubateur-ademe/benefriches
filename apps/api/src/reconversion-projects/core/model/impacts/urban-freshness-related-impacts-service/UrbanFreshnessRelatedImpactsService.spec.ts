import { UrbanFreshnessRelatedImpactsService } from "./UrbanFreshnessRelatedImpactsService";

describe("UrbanFreshnessRelatedImpactsService", () => {
  it("returns no urban freshness impacts if there is no public green spaces in project", () => {
    const urbanFreshnessRelatedImpactsService = new UrbanFreshnessRelatedImpactsService({
      siteSquareMetersSurfaceArea: 15000,
      citySquareMetersSurfaceArea: 15000000,
      cityPopulation: 18000,
      buildingsFloorAreaDistribution: {},
      spacesDistribution: {},
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });

    expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([]);
    expect(urbanFreshnessRelatedImpactsService.getEnvironmentalImpacts()).toEqual({});
    expect(urbanFreshnessRelatedImpactsService.getAvoidedCo2EqEmissionsDetails()).toEqual([]);
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
      spacesDistribution: {
        PUBLIC_GREEN_SPACES: 400,
      },
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });

    expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([]);
    expect(urbanFreshnessRelatedImpactsService.getEnvironmentalImpacts()).toEqual({});
    expect(urbanFreshnessRelatedImpactsService.getAvoidedCo2EqEmissionsDetails()).toEqual([]);
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
      spacesDistribution: {
        PUBLIC_GREEN_SPACES: 65100,
      },
      evaluationPeriodInYears: 10,
      operationsFirstYear: 2025,
    });

    expect(urbanFreshnessRelatedImpactsService.getSocioEconomicList()).toEqual([
      {
        actor: "local_people",
        amount: 2481.42,
        impact: "avoided_air_conditioning_expenses",
        impactCategory: "economic_indirect",
      },
      {
        actor: "local_companies",
        amount: 9100,
        impact: "avoided_air_conditioning_expenses",
        impactCategory: "economic_indirect",
      },
    ]);
    expect(urbanFreshnessRelatedImpactsService.getEnvironmentalImpacts()).toEqual({
      avoidedAirConditioningCo2EqEmissions: 4.06,
    });
    expect(urbanFreshnessRelatedImpactsService.getAvoidedCo2EqEmissionsDetails()).toEqual([
      {
        amount: 1005.49,
        impact: "avoided_air_conditioning_co2_eq_emissions",
      },
    ]);
  });
});
