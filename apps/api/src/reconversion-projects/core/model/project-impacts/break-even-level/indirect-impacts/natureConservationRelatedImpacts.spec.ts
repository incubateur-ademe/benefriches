import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { getNatureConservationRelatedImpacts } from "./natureConservationRelatedImpacts";

describe("natureConservationRelatedImpacts", () => {
  it("returns no impact difference when no soils differential", () => {
    const result = getNatureConservationRelatedImpacts({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistributionByType: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectDecontaminatedSoilSurface: 0,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      }),
    });

    expect(result.economicImpacts.length).toEqual(0);
    expect(result.impactMetrics.length).toEqual(0);
  });

  it("returns no carbon storage impact if no base and forecast provided", () => {
    const result = getNatureConservationRelatedImpacts({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistributionByType: {
        PRAIRIE_BUSHES: 1200,
      },
      projectDecontaminatedSoilSurface: 0,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });

    expect(result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")).toBeUndefined();
    expect(result.impactMetrics.find(({ name }) => name === "newStoredCo2Eq")).toBeUndefined();
  });

  it("compute newStoredCo2Eq positive monetary value", () => {
    const result = getNatureConservationRelatedImpacts({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistributionByType: {
        PRAIRIE_BUSHES: 1200,
      },

      baseSoilsCarbonStorage: { total: 100 },
      projectSoilsCarbonStorage: { total: 150 },
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    expect(result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")?.total).toBeCloseTo(
      27499,
      0,
    );
    expect(result.impactMetrics.find(({ name }) => name === "newStoredCo2Eq")?.total).toBeCloseTo(
      183,
      0,
    );
  });

  it("compute newStoredCo2Eq negative monetary value", () => {
    const result = getNatureConservationRelatedImpacts({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistributionByType: {
        PRAIRIE_BUSHES: 1200,
      },
      baseSoilsCarbonStorage: { total: 150 },
      projectSoilsCarbonStorage: { total: 100 },
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    expect(result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")?.total).toBeCloseTo(
      -27499,
      0,
    );
    expect(result.impactMetrics.find(({ name }) => name === "newStoredCo2Eq")?.total).toBeCloseTo(
      -183,
      0,
    );
  });

  it("returns positive difference for water regulation and ecosystem services monetary values", () => {
    const result = getNatureConservationRelatedImpacts({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 250,
        CULTIVATION: 100,
        VINEYARD: 50,
        ORCHARD: 50,
        MINERAL_SOIL: 85,
        BUILDINGS: 165,
      },
      projectSoilsDistributionByType: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 300,
        ARTIFICIAL_TREE_FILLED: 400,
      },
      baseSoilsCarbonStorage: { total: 100 },
      projectSoilsCarbonStorage: { total: 150 },
      projectDecontaminatedSoilSurface: 1000,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });

    expect(
      result.economicImpacts.find(({ name }) => name === "waterRegulation")?.total,
    ).toBeCloseTo(146, 0);
    expect(result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")?.total).toBeCloseTo(
      27499,
      0,
    );
    expect(
      result.economicImpacts.find(({ name }) => name === "natureRelatedWelnessAndLeisure")?.total,
    ).toBeCloseTo(11, 0);
    expect(
      result.economicImpacts.find(({ name }) => name === "forestRelatedProduct"),
    ).toBeUndefined();
    expect(result.economicImpacts.find(({ name }) => name === "pollination")?.total).toBeCloseTo(
      37,
      0,
    );
    expect(
      result.economicImpacts.find(({ name }) => name === "invasiveSpeciesRegulation")?.total,
    ).toBeCloseTo(14, 0);
    expect(result.economicImpacts.find(({ name }) => name === "waterCycle")?.total).toBeCloseTo(
      485,
      0,
    );
    expect(result.economicImpacts.find(({ name }) => name === "nitrogenCycle")?.total).toBeCloseTo(
      9,
      0,
    );
    expect(result.economicImpacts.find(({ name }) => name === "soilErosion")?.total).toBeCloseTo(
      101,
      0,
    );

    expect(
      result.impactMetrics.find(({ name }) => name === "newPermeableSurface")?.total,
    ).toBeCloseTo(165, 0);
    expect(
      result.impactMetrics.find(({ name }) => name === "decontaminatedSurface")?.total,
    ).toBeCloseTo(1000, 0);
  });

  it("returns negative difference for water regulation and ecosystem services monetary values", () => {
    const result = getNatureConservationRelatedImpacts({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 250,
      },
      projectSoilsDistributionByType: {
        PRAIRIE_BUSHES: 500,
        FOREST_CONIFER: 150,
        WET_LAND: 250,
        IMPERMEABLE_SOILS: 550,
      },
      baseSoilsCarbonStorage: { total: 250 },
      projectSoilsCarbonStorage: { total: 150 },
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    expect(
      result.economicImpacts.find(({ name }) => name === "waterRegulation")?.total,
    ).toBeCloseTo(-59, 0);
    expect(result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")?.total).toBeCloseTo(
      -55000,
      0,
    );
    expect(
      result.economicImpacts.find(({ name }) => name === "natureRelatedWelnessAndLeisure")?.total,
    ).toBeCloseTo(-46, 0);
    expect(
      result.economicImpacts.find(({ name }) => name === "forestRelatedProduct"),
    ).toBeUndefined();
    expect(result.economicImpacts.find(({ name }) => name === "pollination")).toBeUndefined();
    expect(
      result.economicImpacts.find(({ name }) => name === "invasiveSpeciesRegulation"),
    ).toBeUndefined();
    expect(result.economicImpacts.find(({ name }) => name === "waterCycle")?.total).toBeCloseTo(
      -672,
      0,
    );
    expect(result.economicImpacts.find(({ name }) => name === "nitrogenCycle")).toBeUndefined();
    expect(result.economicImpacts.find(({ name }) => name === "soilErosion")).toBeUndefined();

    expect(
      result.impactMetrics.find(({ name }) => name === "newPermeableSurface")?.total,
    ).toBeCloseTo(-550, 0);
    expect(
      result.impactMetrics.find(({ name }) => name === "decontaminatedSurface"),
    ).toBeUndefined();
  });
});
