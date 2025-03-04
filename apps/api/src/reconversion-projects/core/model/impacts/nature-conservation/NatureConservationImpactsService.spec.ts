import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";
import { NatureConservationImpactsService } from "./NatureConservationImpactsService";

describe("NatureConservationImpactsService", () => {
  it("returns no impact difference when no soils differential", () => {
    const natureConservationImpactsService = new NatureConservationImpactsService({
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      baseDecontaminatedSurfaceArea: 0,
      forecastDecontaminedSurfaceArea: 0,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      }),
    });
    const {
      storedCo2Eq,
      natureRelatedWelnessAndLeisure,
      forestRelatedProduct,
      pollination,
      invasiveSpeciesRegulation,
      waterCycle,
      nitrogenCycle,
      soilErosion,
    } = natureConservationImpactsService.getEcosystemServicesMonetaryImpact();

    expect(storedCo2Eq.difference).toEqual(0);
    expect(natureRelatedWelnessAndLeisure.difference).toEqual(0);
    expect(waterCycle.difference).toEqual(0);
    expect(forestRelatedProduct).toEqual(undefined);
    expect(pollination).toEqual(undefined);
    expect(invasiveSpeciesRegulation).toEqual(undefined);
    expect(nitrogenCycle).toEqual(undefined);
    expect(soilErosion).toEqual(undefined);
  });

  it("returns no carbon storage impact if no base and forecast provided", () => {
    const natureConservationImpactsService = new NatureConservationImpactsService({
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 1200,
      },
      baseDecontaminatedSurfaceArea: 0,
      forecastDecontaminedSurfaceArea: 0,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    const { storedCo2Eq } = natureConservationImpactsService.getEcosystemServicesMonetaryImpact();

    expect(storedCo2Eq).toEqual({ base: 0, forecast: 0, difference: 0 });
  });

  it("compute storedCo2Eq positive monetary value", () => {
    const natureConservationImpactsService = new NatureConservationImpactsService({
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 1200,
      },

      baseSoilsCo2eqStorage: 366.67,
      forecastSoilsCo2eqStorage: 550,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    expect(
      natureConservationImpactsService.getEcosystemServicesMonetaryImpact().storedCo2Eq,
    ).toEqual({ base: 55001, forecast: 82500, difference: 27499 });
  });

  it("compute storedCo2Eq negative monetary value", () => {
    const natureConservationImpactsService = new NatureConservationImpactsService({
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 1200,
      },

      baseSoilsCo2eqStorage: 550,
      forecastSoilsCo2eqStorage: 366.67,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    expect(
      natureConservationImpactsService.getEcosystemServicesMonetaryImpact().storedCo2Eq,
    ).toEqual({ forecast: 55001, base: 82500, difference: -27499 });
  });

  it("returns positive difference for water regulation and ecosystem services monetary values", () => {
    const natureConservationImpactsService = new NatureConservationImpactsService({
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 250,
        CULTIVATION: 100,
        VINEYARD: 50,
        ORCHARD: 50,
        MINERAL_SOIL: 85,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 2000,
        FOREST_CONIFER: 150,
        WET_LAND: 300,
        ARTIFICIAL_TREE_FILLED: 300,
      },
      baseSoilsCo2eqStorage: 366.666,
      forecastSoilsCo2eqStorage: 550,
      baseDecontaminatedSurfaceArea: 0,
      forecastDecontaminedSurfaceArea: 1000,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    const {
      storedCo2Eq,
      natureRelatedWelnessAndLeisure,
      forestRelatedProduct,
      pollination,
      invasiveSpeciesRegulation,
      waterCycle,
      nitrogenCycle,
      soilErosion,
    } = natureConservationImpactsService.getEcosystemServicesMonetaryImpact();
    const waterRegulation = natureConservationImpactsService.getWaterRegulationMonetaryImpact();

    expect(waterRegulation).toEqual({
      base: 154,
      forecast: 367,
      difference: 213,
    });
    expect(storedCo2Eq).toEqual({ base: 55000, difference: 27500, forecast: 82500 });
    expect(natureRelatedWelnessAndLeisure).toEqual({ base: 173, difference: 60, forecast: 234 });
    expect(forestRelatedProduct).toEqual(undefined);
    expect(pollination).toEqual({ base: 120, difference: 108, forecast: 228 });
    expect(invasiveSpeciesRegulation).toEqual({ base: 44, difference: 40, forecast: 84 });
    expect(waterCycle).toEqual({ base: 1837, difference: 1523, forecast: 3359 });
    expect(nitrogenCycle).toEqual({ base: 268, difference: 103, forecast: 371 });
    expect(soilErosion).toEqual({ base: 327, difference: 293, forecast: 619 });
  });

  it("returns negative difference for water regulation and ecosystem services monetary values", () => {
    const natureConservationImpactsService = new NatureConservationImpactsService({
      baseSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 250,
      },
      forecastSoilsDistribution: {
        PRAIRIE_BUSHES: 500,
        FOREST_CONIFER: 150,
        WET_LAND: 250,
        IMPERMEABLE_SOILS: 500,
      },
      baseSoilsCo2eqStorage: 916.666,
      forecastSoilsCo2eqStorage: 550,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    const {
      storedCo2Eq,
      natureRelatedWelnessAndLeisure,
      forestRelatedProduct,
      pollination,
      invasiveSpeciesRegulation,
      waterCycle,
      nitrogenCycle,
      soilErosion,
    } = natureConservationImpactsService.getEcosystemServicesMonetaryImpact();
    const waterRegulation = natureConservationImpactsService.getWaterRegulationMonetaryImpact();

    expect(waterRegulation).toEqual({
      base: 154,
      forecast: 96,
      difference: -58,
    });
    expect(storedCo2Eq).toEqual({ base: 137500, difference: -55000, forecast: 82500 });
    expect(natureRelatedWelnessAndLeisure).toEqual({ base: 173, difference: -46, forecast: 127 });
    expect(waterCycle).toEqual({ base: 1771, difference: -672, forecast: 1099 });
    expect(forestRelatedProduct).toEqual(undefined);
    expect(pollination).toEqual(undefined);
    expect(invasiveSpeciesRegulation).toEqual(undefined);
    expect(nitrogenCycle).toEqual(undefined);
    expect(soilErosion).toEqual(undefined);
  });
});
