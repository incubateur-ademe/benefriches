import assert from "node:assert/strict";
import { describe, it } from "node:test";

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

    assert.strictEqual(result.economicImpacts.length, 0);
    assert.strictEqual(result.impactMetrics.length, 0);
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

    assert.strictEqual(
      result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq"),
      undefined,
    );
    assert.strictEqual(
      result.impactMetrics.find(({ name }) => name === "newStoredCo2Eq"),
      undefined,
    );
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
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")?.total ?? 0) - 27499,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.impactMetrics.find(({ name }) => name === "newStoredCo2Eq")?.total ?? 0) - 183,
      ) < 0.5,
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
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")?.total ?? 0) - -27499,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.impactMetrics.find(({ name }) => name === "newStoredCo2Eq")?.total ?? 0) - -183,
      ) < 0.5,
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

    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "waterRegulation")?.total ?? 0) - 146,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")?.total ?? 0) - 27499,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "natureRelatedWelnessAndLeisure")
          ?.total ?? 0) - 11,
      ) < 0.5,
    );
    assert.strictEqual(
      result.economicImpacts.find(({ name }) => name === "forestRelatedProduct"),
      undefined,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "pollination")?.total ?? 0) - 37,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "invasiveSpeciesRegulation")?.total ??
          0) - 14,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "waterCycle")?.total ?? 0) - 485,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "nitrogenCycle")?.total ?? 0) - 9,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "soilErosion")?.total ?? 0) - 101,
      ) < 0.5,
    );

    assert.ok(
      Math.abs(
        (result.impactMetrics.find(({ name }) => name === "newPermeableSurface")?.total ?? 0) - 165,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.impactMetrics.find(({ name }) => name === "decontaminatedSurface")?.total ?? 0) -
          1000,
      ) < 0.5,
    );
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
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "waterRegulation")?.total ?? 0) - -59,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "newStoredCo2Eq")?.total ?? 0) - -55000,
      ) < 0.5,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "natureRelatedWelnessAndLeisure")
          ?.total ?? 0) - -46,
      ) < 0.5,
    );
    assert.strictEqual(
      result.economicImpacts.find(({ name }) => name === "forestRelatedProduct"),
      undefined,
    );
    assert.strictEqual(
      result.economicImpacts.find(({ name }) => name === "pollination"),
      undefined,
    );
    assert.strictEqual(
      result.economicImpacts.find(({ name }) => name === "invasiveSpeciesRegulation"),
      undefined,
    );
    assert.ok(
      Math.abs(
        (result.economicImpacts.find(({ name }) => name === "waterCycle")?.total ?? 0) - -672,
      ) < 0.5,
    );
    assert.strictEqual(
      result.economicImpacts.find(({ name }) => name === "nitrogenCycle"),
      undefined,
    );
    assert.strictEqual(
      result.economicImpacts.find(({ name }) => name === "soilErosion"),
      undefined,
    );

    assert.ok(
      Math.abs(
        (result.impactMetrics.find(({ name }) => name === "newPermeableSurface")?.total ?? 0) -
          -550,
      ) < 0.5,
    );
    assert.strictEqual(
      result.impactMetrics.find(({ name }) => name === "decontaminatedSurface"),
      undefined,
    );
  });
});
