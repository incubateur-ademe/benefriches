import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { roundToInteger } from "../../../services";
import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { SoilsTransformationImpactsService } from "./SoilsTransformationImpactsService";

describe("SoilsTransformationImpactsService", () => {
  it("returns no impact difference when no soils differential", () => {
    const service = new SoilsTransformationImpactsService({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectDecontaminedSurfaceArea: 0,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      }),
    });
    assert.deepStrictEqual(service.storedCo2EqDifference, 0);
    assert.deepStrictEqual(service.natureRelatedWelnessAndLeisure, 0);
    assert.deepStrictEqual(service.waterCycle, 0);
    assert.deepStrictEqual(service.forestRelatedProduct, undefined);
    assert.deepStrictEqual(service.pollination, undefined);
    assert.deepStrictEqual(service.invasiveSpeciesRegulation, undefined);
    assert.deepStrictEqual(service.nitrogenCycle, undefined);
    assert.deepStrictEqual(service.soilErosion, undefined);
  });

  it("returns no carbon storage impact if no site and project provided", () => {
    const service = new SoilsTransformationImpactsService({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistribution: {
        PRAIRIE_BUSHES: 1200,
      },
      projectDecontaminedSurfaceArea: 0,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    assert.deepStrictEqual(service.storedCo2EqDifference, 0);
  });

  it("compute storedCo2Eq positive monetary value", () => {
    const service = new SoilsTransformationImpactsService({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistribution: {
        PRAIRIE_BUSHES: 1200,
      },

      siteSoilsCarbonStorage: 100,
      projectSoilsCarbonStorage: 150,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    assert.deepStrictEqual(
      roundToInteger(
        service.getEconomicImpacts().find((item) => item.name === "newStoredCo2Eq")?.total ?? 0,
      ),
      27500,
    );
    assert.deepStrictEqual(
      roundToInteger(
        service.getImpactMetrics().find((item) => item.name === "newStoredCo2Eq")?.total ?? 0,
      ),
      183,
    );
  });

  it("compute storedCo2Eq negative monetary value", () => {
    const service = new SoilsTransformationImpactsService({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistribution: {
        PRAIRIE_BUSHES: 1200,
      },

      siteSoilsCarbonStorage: 150,
      projectSoilsCarbonStorage: 100,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    });
    assert.deepStrictEqual(
      roundToInteger(
        service.getEconomicImpacts().find((item) => item.name === "newStoredCo2Eq")?.total ?? 0,
      ),
      -27500,
    );
    assert.deepStrictEqual(
      roundToInteger(
        service.getImpactMetrics().find((item) => item.name === "newStoredCo2Eq")?.total ?? 0,
      ),
      -183,
    );
  });

  it("returns positive difference for water regulation and ecosystem services monetary values", () => {
    const service = new SoilsTransformationImpactsService({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 250,
        CULTIVATION: 100,
        VINEYARD: 50,
        ORCHARD: 50,
        MINERAL_SOIL: 85,
      },
      projectSoilsDistribution: {
        PRAIRIE_BUSHES: 2000,
        FOREST_CONIFER: 150,
        WET_LAND: 300,
        ARTIFICIAL_TREE_FILLED: 300,
      },
      siteSoilsCarbonStorage: 100,
      projectSoilsCarbonStorage: 150,
      projectDecontaminedSurfaceArea: 1000,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    }).getEconomicImpacts();

    assert.deepStrictEqual(
      roundToInteger(service.find((item) => item.name === "waterRegulation")?.total ?? 0),
      248,
    );
    assert.deepStrictEqual(
      roundToInteger(service.find((item) => item.name === "newStoredCo2Eq")?.total ?? 0),
      27500,
    );
    assert.deepStrictEqual(
      roundToInteger(
        service.find((item) => item.name === "natureRelatedWelnessAndLeisure")?.total ?? 0,
      ),
      60,
    );
    assert.deepStrictEqual(
      service.find((item) => item.name === "forestRelatedProduct"),
      undefined,
    );
    assert.deepStrictEqual(
      roundToInteger(service.find((item) => item.name === "pollination")?.total ?? 0),
      108,
    );
    assert.deepStrictEqual(
      roundToInteger(service.find((item) => item.name === "invasiveSpeciesRegulation")?.total ?? 0),
      40,
    );
    assert.deepStrictEqual(
      roundToInteger(service.find((item) => item.name === "waterCycle")?.total ?? 0),
      1523,
    );
    assert.deepStrictEqual(
      roundToInteger(service.find((item) => item.name === "nitrogenCycle")?.total ?? 0),
      71,
    );
    assert.deepStrictEqual(
      roundToInteger(service.find((item) => item.name === "soilErosion")?.total ?? 0),
      293,
    );
  });

  it("returns negative difference for water regulation and ecosystem services monetary values", () => {
    const impacts = new SoilsTransformationImpactsService({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
        WET_LAND: 250,
      },
      projectSoilsDistribution: {
        PRAIRIE_BUSHES: 500,
        FOREST_CONIFER: 150,
        WET_LAND: 250,
        IMPERMEABLE_SOILS: 500,
      },
      siteSoilsCarbonStorage: 250,
      projectSoilsCarbonStorage: 150,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    }).getEconomicImpacts();

    assert.deepStrictEqual(
      roundToInteger(impacts.find((item) => item.name === "waterRegulation")?.total ?? 0),
      -59,
    );
    assert.deepStrictEqual(
      roundToInteger(impacts.find((item) => item.name === "newStoredCo2Eq")?.total ?? 0),
      -55000,
    );
    assert.deepStrictEqual(
      roundToInteger(
        impacts.find((item) => item.name === "natureRelatedWelnessAndLeisure")?.total ?? 0,
      ),
      -46,
    );
    assert.deepStrictEqual(
      roundToInteger(impacts.find((item) => item.name === "waterCycle")?.total ?? 0),
      -672,
    );
    assert.deepStrictEqual(
      impacts.find((item) => item.name === "forestRelatedProduct"),
      undefined,
    );
    assert.deepStrictEqual(
      impacts.find((item) => item.name === "pollination"),
      undefined,
    );
    assert.deepStrictEqual(
      impacts.find((item) => item.name === "invasiveSpeciesRegulation"),
      undefined,
    );
    assert.deepStrictEqual(
      impacts.find((item) => item.name === "nitrogenCycle"),
      undefined,
    );
    assert.deepStrictEqual(
      impacts.find((item) => item.name === "soilErosion"),
      undefined,
    );
  });

  describe("permeableSurfaceArea impact metric", () => {
    it("returns no difference when no change in soils distribution", () => {
      const impacts = new SoilsTransformationImpactsService({
        siteSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 25,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        projectSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 25,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      }).getImpactMetrics();

      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableGreenSurface"),
        undefined,
      );
      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableMineralSurface"),
        undefined,
      );
    });

    it("returns impact when more mineral soils in project", () => {
      const impacts = new SoilsTransformationImpactsService({
        siteSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 25,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        projectSoilsDistribution: {
          IMPERMEABLE_SOILS: 100,
          BUILDINGS: 25,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 420,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      }).getImpactMetrics();

      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableGreenSurface"),
        undefined,
      );
      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableMineralSurface")?.total,
        100,
      );
    });

    it("returns impact when more green soils in project", () => {
      const impacts = new SoilsTransformationImpactsService({
        siteSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        projectSoilsDistribution: {
          IMPERMEABLE_SOILS: 100,
          BUILDINGS: 0,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 300,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      }).getImpactMetrics();

      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableGreenSurface")?.total,
        200,
      );
      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableMineralSurface"),
        undefined,
      );
    });

    it("returns impact when more green and mineral soils in project", () => {
      const impacts = new SoilsTransformationImpactsService({
        siteSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        projectSoilsDistribution: {
          IMPERMEABLE_SOILS: 0,
          BUILDINGS: 0,
          MINERAL_SOIL: 420,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 300,
          PRAIRIE_GRASS: 500,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      }).getImpactMetrics();
      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableGreenSurface")?.total,
        200,
      );
      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableMineralSurface")?.total,
        100,
      );
    });

    it("returns negative impact when everything is impermeable in project", () => {
      const impacts = new SoilsTransformationImpactsService({
        siteSoilsDistribution: {
          IMPERMEABLE_SOILS: 200,
          BUILDINGS: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 500,
          MINERAL_SOIL: 320,
        },
        projectSoilsDistribution: {
          IMPERMEABLE_SOILS: 1000,
          BUILDINGS: 220,
        },
        sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
          evaluationPeriodInYears: 10,
          operationsFirstYear: 2025,
        }),
      }).getImpactMetrics();
      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableGreenSurface")?.total,
        -600,
      );
      assert.deepStrictEqual(
        impacts.find((item) => item.name === "newPermeableMineralSurface")?.total,
        -320,
      );
    });
  });

  it("returns decontaminated surface impact metric", () => {
    const impacts = new SoilsTransformationImpactsService({
      siteSoilsDistribution: {
        IMPERMEABLE_SOILS: 200,
        BUILDINGS: 100,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
        PRAIRIE_GRASS: 500,
        MINERAL_SOIL: 320,
      },
      projectSoilsDistribution: {
        IMPERMEABLE_SOILS: 1000,
        BUILDINGS: 220,
      },
      projectDecontaminedSurfaceArea: 2000,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2025,
      }),
    }).getImpactMetrics();
    assert.deepStrictEqual(
      impacts.find((item) => item.name === "decontaminatedSurface")?.total,
      2000,
    );
  });

  it("returns no impact difference when no soils differential", () => {
    const service = new SoilsTransformationImpactsService({
      siteSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectSoilsDistribution: {
        PRAIRIE_BUSHES: 1000,
        FOREST_CONIFER: 200,
      },
      projectDecontaminedSurfaceArea: 0,
      sumOnEvolutionPeriodService: new SumOnEvolutionPeriodService({
        evaluationPeriodInYears: 10,
        operationsFirstYear: 2024,
      }),
    });

    const impactMetrics = service.getImpactMetrics();
    assert.strictEqual(service.getEconomicImpacts().length, 0);
    assert.strictEqual(impactMetrics.length, 2);
    assert.strictEqual(
      impactMetrics.find((item) => item.name === "soilsDistribution")?.soilType,
      "PRAIRIE_BUSHES",
    );
    assert.strictEqual(
      impactMetrics.find((item) => item.name === "soilsDistribution")?.total,
      1000,
    );
    assert.strictEqual(
      impactMetrics.findLast((item) => item.name === "soilsDistribution")?.soilType,
      "FOREST_CONIFER",
    );
    assert.strictEqual(
      impactMetrics.findLast((item) => item.name === "soilsDistribution")?.total,
      200,
    );
  });
});
